import ViteTransformerPlugin from './vite/plugin';
import { addTypeTemplate, createResolver, defineNuxtModule, addVitePlugin } from '@nuxt/kit';

const regExpSvg = /\.svg$/;
const regExpVue = /\.vue$/;

const resolver = createResolver(import.meta.url);

export default defineNuxtModule({
	meta: {
		name: '@anc/nuxt-svg-static',
		compatibility: {
			builder: {
				rspack: false,
				webpack: false,
			},
		},
	},
	setup(_options, nuxt) {
		const vite = (nuxt.options.vite ??= {});

		// @vitejs/plugin-vue 插件
		vite.vue ||= {};
		const existingInclude = vite.vue.include ?? [regExpVue];
		const includeArray = Array.isArray(existingInclude) ? existingInclude : [existingInclude];
		vite.vue.include = [...new Set([...includeArray, regExpSvg, regExpVue])];

		// 构建插件
		addVitePlugin(ViteTransformerPlugin);

		// 类型
		addTypeTemplate({
			src: resolver.resolve('./types.d.ts'),
			filename: 'types/nuxt-svg-static.d.ts',
		});

		// 类型顺序
		nuxt.hook('prepare:types', ({ references }) => {
			const svgRefIndex = references.findIndex(
				(ref) =>
					'path' in ref && typeof ref.path === 'string' && ref.path.includes('types/nuxt-svg-static.d.ts'),
			);

			if (svgRefIndex !== -1) {
				const removedRefs = references.splice(svgRefIndex, 1);
				const svgRef = removedRefs[0];

				if (svgRef !== undefined) {
					const builderEnvIndex = references.findIndex(
						(ref) =>
							'path' in ref &&
							typeof ref.path === 'string' &&
							ref.path.includes('types/builder-env.d.ts'),
					);

					if (builderEnvIndex !== -1) {
						references.splice(builderEnvIndex, 0, svgRef);
					} else {
						// 兜底，如果找不到 `types/builder-env.d.ts` 则直接插到文件开头
						references.unshift(svgRef);
					}
				}
			}
		});
	},
});
