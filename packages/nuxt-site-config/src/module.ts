import { defineNuxtModule, useLogger } from '@nuxt/kit';

interface ModuleOptions {
	/** 生存环境 URL */
	url: string;
}

declare module '@nuxt/schema' {
	interface NuxtOptions {
		site: ModuleOptions;
	}
}

const logger = useLogger('@anc/nuxt-site-config');

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@anc/nuxt-site-config',
		configKey: 'site',
	},
	setup(options, nuxt) {
		const isDevelopment = nuxt.options.dev;
		const localUrl = `http://${nuxt.options.devServer.host ?? '127.0.0.1'}:${nuxt.options.devServer.port}`;

		if (!options.url) {
			logger.warn('缺失 `url` 字段');
			options.url = localUrl;
		} else if (isDevelopment) {
			options.url = localUrl;
		}

		nuxt.options.site = options;
	},
});

export type { ModuleOptions };
