import createMdTransformer from './vite/plugin';
import { addTypeTemplate, addBuildPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';

const regExpMd = /\.md$/;
const regExpVue = /\.vue$/;

const resolver = createResolver(import.meta.url);

export default defineNuxtModule({
	meta: {
		name: '@anc/nuxt-md-component',
		compatibility: {
			builder: {
				rspack: false,
				webpack: false,
			},
		},
	},
	setup(_options, nuxt) {
		const vite = (nuxt.options.vite ??= {});

		/**
		 * TODO： 会与 TypeScript 行为不一致，导致直接`import test from './test'` 报错，但运行时正常
		// import resolve
		vite.resolve ||= {};
		const ext = vite.resolve.extensions || [];
		vite.resolve.extensions = Array.from(new Set([...ext, '.md']));
		*/

		// @vitejs/plugin-vue 插件
		vite.vue ||= {};
		const existingInclude = vite.vue.include ?? [regExpVue];
		const includeArray = Array.isArray(existingInclude) ? existingInclude : [existingInclude];
		vite.vue.include = [...new Set([...includeArray, regExpMd, regExpVue])];

		// 构建插件
		addBuildPlugin(createMdTransformer());

		// 类型
		addTypeTemplate({
			src: resolver.resolve('./types.d.ts'),
			filename: 'types/nuxt-md-component.d.ts',
		});
	},
});
