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

	const ogOptions = event.context._og_options;
	const isOGImageEnabled = ogOptions?.disabledOGImage !== true;

	const ogImageURL = resolveSitePath(joinURL('/_og-image', route.path, 'og.webp')).value;

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
			// TODO：nuxt-seo 插件似乎会自动添加这个
			//{ tag: 'meta', props: { property: 'og:site_name', content: siteName } },

			// TODO：nuxt-seo 插件似乎会自动添加这个
			//{ tag: 'meta', props: { property: 'og:locale', content: siteDefaultLocale } },

			// TODO：nuxt-seo 插件似乎会自动添加这个，而且这个计算是相对链接而不是带主机名的绝对链接，似乎有问题
			//{ tag: 'meta', props: { property: 'og:url', content: resolveSitePath(route.path).value } },

			// TODO：不知道什么东西自动增加了一个 og:type = 'website'
			{ tag: 'meta', props: { property: 'og:type', content: ogOptions?.ogType || 'website' } },
		];

		if (isOGImageEnabled) {
			newTags.push(
				// Twitter
				{ tag: 'meta', props: { name: 'twitter:image', content: ogImageURL } },
				{ tag: 'meta', props: { name: 'twitter:image:width', content: '1200' } },
				{ tag: 'meta', props: { name: 'twitter:image:height', content: '600' } },

				// TODO：nuxt-seo 插件似乎会自动添加这个
				//{ tag: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },

				// Open Graph
				{ tag: 'meta', props: { property: 'og:image', content: ogImageURL } },
				{ tag: 'meta', props: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', props: { property: 'og:image:height', content: '600' } },
				{ tag: 'meta', props: { property: 'og:image:type', content: 'image/webp' } },
			);
		}

		// TODO：nuxt-seo 插件似乎会自动添加这个
		/*
		if (pageTitle !== undefined) {
			newTags.push({ tag: 'meta', props: { property: 'og:title', content: pageTitle } });
		}

		if (pageDescription !== undefined) {
			newTags.push({ tag: 'meta', props: { property: 'og:description', content: pageDescription } });
		}
		*/

		ctx.tags.push(...newTags);

		// 预渲染请求
		if (isOGImageEnabled && ((import.meta.server && import.meta.prerender) || import.meta.dev)) {
			void nuxtApp.runWithContext(() => prerenderRoutes(joinURL('/_og-image', route.path, 'og.webp')));

			import('nitro/storage')
				.then(async ({ useStorage }) => {
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
