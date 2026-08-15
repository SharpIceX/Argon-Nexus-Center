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
	const resolvePath = createSitePathResolver();

	const ogOptions = event.context._og_options;
	const isOGImageEnabled = ogOptions?.disabledOGImage !== true;

	const ogImageURL = resolvePath(joinURL('/_og-image', route.path, 'og.webp')).value;

	head.hooks.hook('tags:resolve', (ctx) => {
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

		const newTags: (typeof ctx.tags)[number][] = [
			{ tag: 'meta', props: { property: 'og:site_name', content: siteName } },
			{ tag: 'meta', props: { property: 'og:locale', content: siteDefaultLocale } },
			{ tag: 'meta', props: { property: 'og:url', content: resolvePath(route.path).value } },
			{ tag: 'meta', props: { property: 'og:type', content: ogOptions?.ogType || 'website' } },
		];

		if (isOGImageEnabled) {
			newTags.push(
				// Twitter
				{ tag: 'meta', props: { name: 'twitter:image', content: ogImageURL } },
				{ tag: 'meta', props: { name: 'twitter:image:width', content: '1200' } },
				{ tag: 'meta', props: { name: 'twitter:image:height', content: '600' } },
				{ tag: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },

				// Open Graph
				{ tag: 'meta', props: { property: 'og:image', content: ogImageURL } },
				{ tag: 'meta', props: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', props: { property: 'og:image:height', content: '600' } },
				{ tag: 'meta', props: { property: 'og:image:type', content: 'image/webp' } },
			);
		}

		if (pageTitle !== undefined) {
			newTags.push({ tag: 'meta', props: { property: 'og:title', content: pageTitle } });
		}
		if (pageDescription !== undefined) {
			newTags.push({ tag: 'meta', props: { property: 'og:description', content: pageDescription } });
		}

		ctx.tags.push(...newTags);

		// 预渲染请求
		if (isOGImageEnabled && import.meta.server && import.meta.prerender) {
			void nuxtApp.runWithContext(() => prerenderRoutes(joinURL('/_og-image', route.path, 'og.webp')));

			import('nitro/storage')
				.then(({ useStorage }) => {
					const storage = useStorage('og-data');
					return storage.setItem(route.path, {
						title: pageTitle,
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
