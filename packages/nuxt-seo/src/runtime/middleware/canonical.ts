import { withBase, withoutTrailingSlash } from 'ufo';
import { defineNuxtRouteMiddleware, useAppConfig, useHead } from '#imports';

export default defineNuxtRouteMiddleware((to) => {
	const appConfig = useAppConfig();

	const canonicalURL = withoutTrailingSlash(withBase(to.path, appConfig.site.url));

	useHead({
		link: [
			{
				rel: 'canonical',
				href: canonicalURL,
			},
		],
	});
});
