import path from 'node:path';
import fs from 'node:fs/promises';
import type { RouteMeta } from 'vue-router';
import { defineNuxtModule } from '@nuxt/kit';
import { withBase, withTrailingSlash } from 'ufo';
import type { NuxtModule, NuxtPage } from '@nuxt/schema';

const t8DateFormatter = new Intl.DateTimeFormat('sv-SE', {
	timeZone: 'Asia/Shanghai',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
});

const module: NuxtModule = defineNuxtModule({
	meta: {
		name: '@anc/nuxt-seo-sitemap',
	},
	moduleDependencies: {
		'@anc/nuxt-site-config': {},
		'@anc/nuxt-page-meta-dates': {},
	},
	setup(_options, nuxt) {
		nuxt.hook('site-config:resolve', (siteConfig) => {
			nuxt.hook('nitro:init', (nitro) => {
				nitro.hooks.hook('prerender:done', async (result) => {
					const sitemapContent = new Set<string>();
					const routes = new Set<NuxtPage>();

					// 获取所有路由
					Object.keys(nuxt.apps).forEach((item) => {
						const app = nuxt.apps[item];

						if (app?.pages === undefined) {
							return;
						}

						app.pages.forEach((page) => routes.add(page));
					});

					// 过滤出能进入站点地图的页面
					for (const route of result.prerenderedRoutes) {
						if (!route.route || Boolean(route.error) || route.contentType == null) continue;

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
						// 基本路径
						const pageURL = withTrailingSlash(withBase(route, siteConfig.url));
						sitemapXML += `<url><loc>${pageURL}</loc>`;

						// 更新时间
						const matchedPage = Array.from(routes).find((page) => page.path === route);
						const updatedAt = matchedPage?.meta?.['updatedAt'] as RouteMeta['updatedAt'];
						if (updatedAt !== undefined) {
							const isoDate = t8DateFormatter.format(new Date(updatedAt));
							sitemapXML += `<lastmod>${isoDate}</lastmod>`;
						}

						sitemapXML += `</url>`;
					});

					sitemapXML += '</urlset>';

					await fs.writeFile(path.join(nitro.options.output.publicDir, 'sitemap.xml'), sitemapXML, 'utf8');
				});
			});
		});
	},
});

export default module;
