import path from 'node:path/posix';
import { createUnplugin } from 'unplugin';
import type { UnpluginInstance } from 'unplugin';
import createMarkdownRender from '../utils/markdown';

function createMdTransformer(): UnpluginInstance<unknown, boolean> {
	const markdownRender = createMarkdownRender();

	return createUnplugin((_options) => {
		return {
			name: '@anc/nuxt-md-component/transform',
			enforce: 'pre',
			transformInclude(id) {
				const [pathName, query] = id.split('?');
				if (pathName === undefined) return;

				// 排除非 `.md` 文件
				const extName = path.extname(pathName);
				if (extName !== '.md') return;

				// 只允许不带请求参数，或带了 component 请求参数的请求
				const params = new URLSearchParams(query);
				return query == null || params.has('component');
			},

			transform(code, _id) {
				return {
					code: `<template>${markdownRender(code)}</template>`,
					map: { mappings: '' },
				};
			},

			vite: {
				handleHotUpdate(ctx) {
					if (ctx.file.endsWith('.md')) {
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

export default createMdTransformer;
