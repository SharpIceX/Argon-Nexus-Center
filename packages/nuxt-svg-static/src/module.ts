import createSvgTransformer from './vite/plugin';
import type { Config as SvgoOptions } from 'svgo';
import type { CompilerOptions } from 'typescript';
import { addTypeTemplate, addBuildPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';

interface ModuleOptions {
	svgoConfig?: SvgoOptions;
}

const regExpSvg = /\.svg$/;
const regExpVue = /\.vue$/;

const resolver = createResolver(import.meta.url);

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@anc/nuxt-svg-static',
		configKey: 'svg',
		compatibility: {
			builder: {
				rspack: false,
				webpack: false,
			},
		},
	},
	setup(options, nuxt) {
		const vite = (nuxt.options.vite ??= {});

		// @vitejs/plugin-vue 插件
		vite.vue ||= {};
		const existingInclude = vite.vue.include ?? [regExpVue];
		const includeArray = Array.isArray(existingInclude) ? existingInclude : [existingInclude];
		vite.vue.include = [...new Set([...includeArray, regExpSvg, regExpVue])];

		// 构建插件
		addBuildPlugin(createSvgTransformer(options.svgoConfig));

		// 类型
		addTypeTemplate({
			src: resolver.resolve('./types/component.d.ts'),
			filename: 'types/nuxt-svg-static_component.d.ts.d.ts',
		});

		// TSConfig
		const compilerOptions = (nuxt.options.typescript.tsConfig as { compilerOptions: CompilerOptions })
			.compilerOptions;
		compilerOptions.paths ||= {};
		compilerOptions.paths['*.svg'] = ['./types/nuxt-svg-static_component.d.ts'];
		compilerOptions.paths['*.svg?component'] = ['./types/nuxt-svg-static_component.d.ts'];
	},
});

export type { ModuleOptions };
