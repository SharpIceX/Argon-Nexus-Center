import type { NuxtModule } from '@nuxt/schema';
import { addImports, addPlugin, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

// TODO 写的太屎了

const module: NuxtModule = defineNuxtModule({
	meta: {
		name: '@anc/nuxt-seo-og',
	},
	moduleDependencies: {
		'@anc/nuxt-site-config': {},
	},
	setup(_options, _nuxt) {
		addImports({
			name: 'defineOg',
			as: 'defineOg',
			from: resolver.resolve('./runtime/composables/defineOg.ts'),
		});

		addPlugin({
			mode: 'server',
			name: '@anc/nuxt-site-config/seo',
			src: resolver.resolve('./runtime/server/plugins/seo.ts'),
		});

		addServerHandler({
			route: '/_og-image/**',
			handler: resolver.resolve('./runtime/server/handlers/og-handler.ts'),
		});
	},
});

export default module;
