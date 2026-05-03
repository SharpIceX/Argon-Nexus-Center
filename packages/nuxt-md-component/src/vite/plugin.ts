import path from 'node:path/posix';
import { createUnplugin } from 'unplugin';
import type { UnpluginInstance } from 'unplugin';
import createMarkdownRender from '../utils/markdown';

const IGNORE_QUERY_PARAMETERS = new Set([
	// Vue 内部
	'vue',
	'type',
	// Vite 内部
	'raw',
	'url',
	'worker',
	'sharedworker',
	'init',
	'inline',
	'no-inline',
	'component',
]);

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

				// 排除 Vite/Vue 内部查询参数
				if (query !== null) {
					const params = new URLSearchParams(query);
					for (const key of params.keys()) {
						if (IGNORE_QUERY_PARAMETERS.has(key)) return false;
					}
				}

				return true;
			},

			transform(code, _id) {
				return {
					code: `<template>${markdownRender(code)}</template>`,
					map: { mappings: '' },
				};
			},

			/**
			 * TODO： 修复热更新问题
			 * TODO： 但仍然有问题，只有客户端有热更新通知，服务端没有
			 */
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
