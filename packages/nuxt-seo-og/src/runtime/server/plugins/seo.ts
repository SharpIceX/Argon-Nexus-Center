import { joinURL, withBase, withoutTrailingSlash } from 'ufo';
import { defineNuxtPlugin, useAppConfig, useRoute, useNuxtApp, injectHead, prerenderRoutes } from '#imports';

export default defineNuxtPlugin(() => {
	const head = injectHead();
	if (!head.hooks) {
		return;
	}

	const route = useRoute();
	const nuxtApp = useNuxtApp();
	const appConfig = useAppConfig();

	const canonicalURL = withoutTrailingSlash(withBase(route.path, appConfig.site.url));
	const ogImageURL = withBase(joinURL('/_og-image', route.path, 'og.webp'), appConfig.site.url);

	const event = nuxtApp.ssrContext?.event;
	if (!event?.context) {
		return;
	}

	const ogOptions = event.context._og_options;
	const sysInputs = event.context._sys_inputs;

	if (ogOptions?.disable === true) {
		return;
	}

	let pageTitle: string | undefined;
	let pageDescription: string | undefined;

	head.hooks.hook('tags:resolve', async (ctx) => {
		for (const tag of ctx.tags) {
			if (tag.tag === 'title') {
				pageTitle = tag.textContent;
			} else if (tag.tag === 'meta' && tag.props?.['name'] === 'description') {
				pageDescription = tag.props?.['content'];
			}
			if (pageTitle !== undefined && pageDescription !== undefined) break;
		}

		const newTags: (typeof ctx.tags)[number][] = [
			// Twitter
			{ tag: 'meta', props: { name: 'twitter:image', content: ogImageURL } },
			{ tag: 'meta', props: { name: 'twitter:image:width', content: '1200' } },
			{ tag: 'meta', props: { name: 'twitter:image:height', content: '600' } },
			{ tag: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },

			// Open Graph
			{ tag: 'meta', props: { property: 'og:url', content: canonicalURL } },
			{ tag: 'meta', props: { property: 'og:image', content: ogImageURL } },
			{ tag: 'meta', props: { property: 'og:image:width', content: '1200' } },
			{ tag: 'meta', props: { property: 'og:image:height', content: '600' } },
			{ tag: 'meta', props: { property: 'og:image:type', content: 'image/webp' } },
			{ tag: 'meta', props: { property: 'og:locale', content: appConfig.site.lang } },
			{ tag: 'meta', props: { property: 'og:type', content: ogOptions?.type || 'website' } },
		];

		if (appConfig.site.name !== undefined) {
			newTags.push({ tag: 'meta', props: { property: 'og:site_name', content: appConfig.site.name } });
		}
		if (pageTitle !== undefined) {
			newTags.push({ tag: 'meta', props: { property: 'og:title', content: pageTitle } });
		}
		if (pageDescription !== undefined) {
			newTags.push({ tag: 'meta', props: { property: 'og:description', content: pageDescription } });
		}

		ctx.tags.push(...newTags);

		// 预渲染请求
		if (import.meta.server && import.meta.prerender && event !== undefined) {
			void nuxtApp.runWithContext(() => {
				prerenderRoutes(joinURL('/_og-image', route.path, 'og.webp'));
			});

			import('nitro/storage')
				.then(({ useStorage }) => {
					const storage = useStorage('og-data');
					void storage.setItem(route.path, {
						...sysInputs,
						title: pageTitle,
						description: pageDescription,
						template: ogOptions?.imageTemplate,
					});
				})
				.catch((error) => {
					throw error;
				});
		}
	});
});
