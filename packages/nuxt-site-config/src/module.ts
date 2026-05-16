import { defineNuxtModule } from '@nuxt/kit';

interface ModuleOptions {
	url: string;
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@anc/nuxt-site-config',
		configKey: 'site',
	},
});

export type { ModuleOptions };
