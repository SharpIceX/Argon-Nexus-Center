import fs from 'node:fs/promises';
import type { Plugin } from 'vite';
import path from 'node:path/posix';
import { optimize as svgoOptimize } from 'svgo';
import type { Config as SvgoOptions } from 'svgo';

const globalSvgoConfig: SvgoOptions = {
	multipass: true,
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					convertColors: {
						currentColor: true,
					},
				},
			},
		},
		'removeDimensions',
		{
			name: 'add-directives',
			fn: () => {
				return {
					element: {
						enter: (node) => {
							if (node.name === 'svg') {
								node.attributes['v-once'] = '';
								node.attributes['v-bind'] = '$attrs';
								node.attributes['fill'] = 'currentColor';
							}
						},
					},
				};
			},
		},
		'sortAttrs',
	],
};

export default {
	name: 'vite-plugin-svg-static',
	enforce: 'pre',

	async transform(_code, id) {
		const [pathName, query] = id.split('?');
		if (pathName === undefined) return;

		// 排除非 .svg 文件
		if (path.extname(pathName) !== '.svg') return;

		// 只允许不带请求参数，或带了 component 请求参数的请求
		const params = new URLSearchParams(query);
		const shouldTransform = query === undefined || params.has('component');
		if (!shouldTransform) return;

		const svgRawCode = await fs.readFile(pathName, 'utf8');
		const svgCode = svgoOptimize(svgRawCode, {
			path: pathName,
			...globalSvgoConfig,
		}).data;

		return {
			code: `<template>${svgCode}</template>`,
			map: { mappings: '' },
		};
	},
} satisfies Plugin;
