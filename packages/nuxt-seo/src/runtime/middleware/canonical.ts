import { withBase, withoutTrailingSlash } from 'ufo';
import { defineNuxtRouteMiddleware, useRuntimeConfig, useHead } from '#imports';

export default defineNuxtRouteMiddleware((to) => {
	const runtimeConfig = useRuntimeConfig();
	const baseURL = runtimeConfig.public.site.url;

	const canonicalURL = withoutTrailingSlash(withBase(to.path, baseURL));

	useHead({
		link: [
			{
				rel: 'canonical',
				href: canonicalURL,
			},
		],
	});
});
