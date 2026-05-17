import path from 'node:path';
import fs from 'node:fs/promises';
import { defineNuxtModule } from '@nuxt/kit';
import type { NuxtModule } from '@nuxt/schema';
import { withBase, withoutTrailingSlash } from 'ufo';

const module: NuxtModule = defineNuxtModule({
	meta: {
		name: '@anc/nuxt-seo-sitemap',
		configKey: 'site',
	},
	moduleDependencies: {
		'@anc/nuxt-site-config': {},
	},
	setup(_options, nuxt) {
		nuxt.hook('site-config:resolve', (siteConfig) => {
			nuxt.hook('nitro:init', (nitro) => {
				nitro.hooks.hook('prerender:done', async (result) => {
					const sitemapContent = new Set<string>();

					// 过滤出能进入站点地图的页面
					for (const route of result.prerenderedRoutes) {
						if (!route.route || route.error || route.contentType == null) continue;

						const mimeType = route.contentType.split(';')[0]?.trim().toLowerCase();

						if (mimeType === 'text/html' && route.route !== '/200.html' && route.route !== '/404.html') {
							sitemapContent.add(route.route);
						}
					}

					// 转换为 sitemap.xml
					// TODO: 之后可能超过 1000 条，如果超过了在考虑拆分 sitemap.xml
					let sitemapXML =
						'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

					sitemapContent.forEach((route) => {
						const fullUrl = withoutTrailingSlash(withBase(route, siteConfig.url));

						sitemapXML += `<url><loc>${fullUrl}</loc></url>`;
					});

					sitemapXML += '</urlset>';

					await fs.writeFile(path.join(nitro.options.output.publicDir, 'sitemap.xml'), sitemapXML, 'utf8');
				});
			});
		});
	},
});

export default module;
