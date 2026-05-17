import { defineNuxtModule } from '@nuxt/kit';

interface ModuleOptions {
	/** 生存环境 URL */
	url: string;
}

declare module '@nuxt/schema' {
	interface NuxtHooks {
		'site-config:resolve': (config: ModuleOptions) => void | Promise<void>;
	}
	interface PublicRuntimeConfig {
		site: ModuleOptions;
	}
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@anc/nuxt-site-config',
		configKey: 'site',
	},
	setup(options, nuxt) {
		const isDevelopment = nuxt.options.dev;
		const localURL = `http://${nuxt.options.devServer.host ?? '127.0.0.1'}:${nuxt.options.devServer.port}`;

		if (isDevelopment || !options.url) {
			options.url = localURL;
		}

		nuxt.options.site = options;
		nuxt.options.runtimeConfig.public.site = options;
		void nuxt.callHook('site-config:resolve', options);
	},
});

export type { ModuleOptions };
