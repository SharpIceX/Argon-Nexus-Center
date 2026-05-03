import { defu } from 'defu';
import fs from 'node:fs/promises';
import path from 'node:path/posix';
import { createUnplugin } from 'unplugin';
import { optimize as svgoOptimize } from 'svgo';
import type { UnpluginInstance } from 'unplugin';
import type { Config as SvgoOptions } from 'svgo';

// TODO 需要处理 prefixIds 问题

const globalSvgoConfig: SvgoOptions = {
	plugins: [
		{
			name: 'add-directives',
			fn: () => {
				return {
					element: {
						enter: (node) => {
							if (node.name === 'svg') {
								node.attributes['v-once'] = '';
								node.attributes['v-pre'] = '';
								node.attributes['v-bind'] = '$attrs';
								node.attributes['fill'] = node.attributes['fill'] ?? 'currentColor';
							}
						},
					},
				};
			},
		},
	],
};

function createSvgTransformer(svgoConfig: SvgoOptions = {}): UnpluginInstance<unknown, boolean> {
	return createUnplugin((_options) => {
		return {
			name: '@anc/nuxt-svg-static/transform',
			enforce: 'pre',
			transformInclude(id) {
				const [pathName, query] = id.split('?');
				if (pathName === undefined) return;

				// 排除非 `.svg` 文件
				const extName = path.extname(pathName);
				if (extName !== '.svg') return false;

				// 只允许不带请求参数，或带了 component 请求参数的请求
				const params = new URLSearchParams(query);
				return query == null || params.has('component');
			},

			async transform(_code, id) {
				const svgRawCode = await fs.readFile(id, 'utf8');
				const svgCode = svgoOptimize(svgRawCode, defu(svgoConfig, globalSvgoConfig)).data;

				return {
					code: `<template>${svgCode}</template>`,
					map: { mappings: '' },
				};
			},

			vite: {
				handleHotUpdate(ctx) {
					if (ctx.file.endsWith('.svg')) {
						const { server, file } = ctx;
						const mods = server.moduleGraph.getModulesByFile(file);

						if (mods) {
							const timestamp = Date.now();
							mods.forEach((mod) => {
								server.moduleGraph.invalidateModule(mod);
								mod.lastHMRTimestamp = timestamp;
							});

							server.ws.send({
								type: 'update',
								updates: Array.from(mods).map((mod) => ({
									timestamp,
									path: mod.url,
									type: 'js-update',
									acceptedPath: mod.url,
								})),
							});

							return [];
						}
					}

					return [];
				},
			},
		};
	});
}

export default createSvgTransformer;
