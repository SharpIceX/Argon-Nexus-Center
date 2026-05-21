import type { NuxtModule } from '@nuxt/schema';
import { addRouteMiddleware, defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

const module: NuxtModule = defineNuxtModule({
	meta: {
		name: '@anc/nuxt-seo',
	},
	moduleDependencies: {
		'@anc/nuxt-site-config': {},
	},
	setup(_options, _nuxt) {
		addRouteMiddleware({
			global: true,
			name: '@anc/nuxt-seo/middleware/canonical',
			path: resolver.resolve('./runtime/middleware/canonical.ts'),
		});

		addPlugin({
			mode: 'server',
			src: resolver.resolve('./runtime/plugins/html-lang.ts'),
		});
	},
});

export default module;
