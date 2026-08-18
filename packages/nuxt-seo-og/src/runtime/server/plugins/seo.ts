import { joinURL } from 'ufo';
import {
	useRoute,
	showError,
	useNuxtApp,
	injectHead,
	createError,
	useSiteConfig,
	useRequestEvent,
	prerenderRoutes,
	defineNuxtPlugin,
	createSitePathResolver,
} from '#imports';

export default defineNuxtPlugin(() => {
	const head = injectHead();
	const event = useRequestEvent();
	if (!event?.context || !head?.hooks) {
		return;
	}

	// 站点配置
	const siteConfig = useSiteConfig();
	const siteName = siteConfig['name'] as string | undefined;
	const siteDefaultLocale = siteConfig['defaultLocale'] as string | undefined;
	if (typeof siteDefaultLocale !== 'string' || !siteDefaultLocale) {
		throw createError({
			fatal: true,
			statusCode: 500,
			statusMessage: '站点配置缺少 defaultLocale',
		});
	}
	if (typeof siteName !== 'string' || !siteName) {
		throw createError({
			fatal: true,
			statusCode: 500,
			statusMessage: '站点配置缺少 name',
		});
	}

	const route = useRoute();
	const nuxtApp = useNuxtApp();

	const resolveSitePath = createSitePathResolver();
	const ogImageURL = resolveSitePath(joinURL('/_og-image', route.path, 'og.webp')).value;

	head.hooks.hook('tags:resolve', (ctx) => {
		const ogOptions = event.context._og_options;
		const isOGImageEnabled = ogOptions?.disabledOGImage !== true;

		let pageTitle: string | undefined;
		let pageDescription: string | undefined;

		// 从现有标签提取 title 与 description
		for (const tag of ctx.tags) {
			if (tag.tag === 'title') {
				pageTitle = tag.textContent;
			} else if (tag.tag === 'meta' && tag.props?.['name'] === 'description') {
				pageDescription = tag.props?.['content'];
			}
			if (pageTitle !== undefined && pageDescription !== undefined) break;
		}

		if (isOGImageEnabled) {
			ctx.tags.push(
				// Twitter
				{ tag: 'meta', props: { name: 'twitter:image', content: ogImageURL } },
				{ tag: 'meta', props: { name: 'twitter:image:width', content: '1200' } },
				{ tag: 'meta', props: { name: 'twitter:image:height', content: '630' } },

				// Open Graph
				{ tag: 'meta', props: { property: 'og:image', content: ogImageURL } },
				{ tag: 'meta', props: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', props: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', props: { property: 'og:image:type', content: 'image/webp' } },
			);
		}

		// 预渲染请求
		if (isOGImageEnabled && ((import.meta.server && import.meta.prerender) || import.meta.dev)) {
			void nuxtApp.runWithContext(() => prerenderRoutes(joinURL('/_og-image', route.path, 'og.webp')));

			import('nitro/storage')
				.then(async ({ useStorage }) => {
					const storage = useStorage('og-data');
					return storage.setItem(route.path, {
						title: pageTitle ?? siteName,
						description: pageDescription,
						template: ogOptions?.ogImageTemplate,
						...ogOptions?.props,
					});
				})
				.catch((error) => {
					showError(
						createError({
							fatal: true,
							cause: error,
							statusCode: 500,
							statusMessage: 'og-image 的数据无法存储到 Nitro Storage',
						}),
					);
				});
		}
	});
});
