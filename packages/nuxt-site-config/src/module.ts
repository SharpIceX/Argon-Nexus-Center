import { defineNuxtModule, useLogger } from '@nuxt/kit';

interface ModuleOptions {
	/** 生产环境 URL */
	url: string;

	/** 网站语言 */
	lang: string;

	/** 网站名称 */
	name?: string;
}

declare module '@nuxt/schema' {
	interface NuxtHooks {
		'site-config:resolve': (config: ModuleOptions) => void | Promise<void>;
	}
	interface AppConfig {
		site: ModuleOptions;
	}
}

const logger = useLogger('@anc/nuxt-site-config');

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@anc/nuxt-site-config',
		configKey: 'site',
	},
	defaults: {
		lang: 'en-US',
	},
	setup(options, nuxt) {
		const isDevelopment = nuxt.options.dev;
		const localURL = `http://${nuxt.options.devServer.host ?? '127.0.0.1'}:${nuxt.options.devServer.port}`;

		// 站点 URL
		if (isDevelopment || !options.url) {
			options.url = localURL;
		}

		// 语言
		try {
			const locale = new Intl.Locale(options.lang).maximize();
			options.lang = locale.region !== undefined ? `${locale.language}-${locale.region}` : locale.language;
		} catch (e) {
			logger.fail(e);
			const error = new Error(`语言标签 "${options.lang}" 格式不正确。请确保格式符合 BCP 47 规范的标签`);
			throw error;
		}

		nuxt.options.site = options;
		nuxt.options.appConfig.site = options;
		void nuxt.callHook('site-config:resolve', options);
	},
});

export type { ModuleOptions };
