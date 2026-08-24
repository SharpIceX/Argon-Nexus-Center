import fs from 'node:fs';
import os from 'node:os';
import url from 'node:url';
import ts from 'typescript';
import path from 'node:path';
import git from 'isomorphic-git';
import process from 'node:process';

const isProduction = process.env['NODE_ENV'] === 'production';
const isGitHubAction = process.env['GITHUB_ACTIONS'] === 'true';

const strictTSConfigPath = url.fileURLToPath(import.meta.resolve('@anc/strict-tsconfig/tsconfig.json'));
const strictTSConfig = ts.readConfigFile(strictTSConfigPath, (path) => ts.sys.readFile(path));

/** 获取 UTC+8 ISO 8601 格式的构建时间 */
function getBuildTimestamp(): string {
	const formatter = new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});

	const formatted = formatter.format(new Date());

	return `${formatted.replace(' ', 'T')}+08:00`;
}

// TODO：预渲染中会出现重复的`/friends/`页面，可能其他页面也会重复渲染，需要排查

export default defineNuxtConfig({
	telemetry: false,
	appId: 'Argon-Nexus-Center',
	compatibilityDate: 'latest',
	css: ['~/styles/main.less'],
	srcDir: path.resolve(import.meta.dirname, './src'),
	buildId: await git.resolveRef({ fs, dir: path.resolve(import.meta.dirname, '../../'), ref: 'HEAD' }),
	// TODO：未完成 Wiki、小说、Blog 的开发
	// extends: [url.fileURLToPath(import.meta.resolve('@anc/content'))],
	modules: [
		'@nuxt/a11y',
		'nuxt-nexus',
		'@nuxtjs/seo',
		'reka-ui/nuxt',
		'@nuxt/eslint',
		'@anc/nuxt-seo-og',
		'@anc/nuxt-svg-static',
		'@anc/nuxt-page-meta-dates',
	],
	alias: {
		$: path.resolve(import.meta.dirname, './node_modules'),
	},
	runtimeConfig: {
		public: {
			buildTimestamp: getBuildTimestamp(),
		},
	},
	future: {
		compatibilityVersion: 5,
		typescriptBundlerResolution: true,
	},
	typescript: {
		strict: true,
		tsConfig: strictTSConfig.config as Record<string, unknown>,
	},
	features: {
		inlineStyles: true,
	},
	experimental: {
		typedPages: true,
		typescriptPlugin: true,

		// TODO：会引起<https://github.com/nuxt/nuxt/issues/36023>这个问题
		// eslint-disable-next-line ts/ban-ts-comment
		// @ts-ignore
		nitroViteEnvironment: false,
	},
	devtools: {
		enabled: !isProduction,
	},
	build: {
		analyze: process.env['ANALYZE'] === 'true' ? { analyzerMode: 'server', analyzerPort: 8601 } : false,
	},
	nitro: {
		preset: 'cloudflare-pages-static',
		prerender: {
			crawlLinks: true,
			autoSubfolderIndex: true,
			concurrency: isGitHubAction ? os.cpus().length : os.cpus().length - 1 || 1,
		},
		routeRules: {
			'/_nexus/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		},
	},
	devServer: {
		port: 8600,
		host: '127.0.0.1',
	},
	vite: {
		build: {
			target: 'esnext',
			cssMinify: 'lightningcss',
			modulePreload: {
				polyfill: false,
			},
		},
		esbuild: {
			drop: isProduction ? ['console', 'debugger'] : [],
		},
		optimizeDeps: {
			include: ['gsap', 'reka-ui', '@vue/devtools-kit', '@unhead/schema-org/vue', '@lucide/vue'],
		},
	},
	eslint: {
		checker: false,
		config: {
			autoInit: false,
			stylistic: false,
			standalone: false,
			rootDir: path.resolve(import.meta.dirname, '../../'),
		},
	},
	reka: {
		prefix: 'reka',
	},
	site: {
		name: '锐冰',
		indexable: true,
		trailingSlash: true,
		url: 'https://avali.top',
		defaultLocale: 'zh-Hans',
		description: '这里是锐冰的个人网站和灵羽独立区的 Wiki。',
	},
	seo: {
		meta: {
			author: '锐冰',
			colorScheme: 'dark',
			themeColor: '#4DA9CF',
			appleMobileWebAppTitle: '锐冰',
		},
	},
	schemaOrg: {
		identity: {
			name: '锐冰',
			type: 'Person',
			image: '/favicon.webp',
			alternateName: 'SharpIce',
			sameAs: ['https://github.com/SharpIceX'],
		},
	},
	sitemap: {
		// TODO：之后可能要关闭 xsl
		// xsl: fallse,
		credits: false,
		zeroRuntime: true,
		minify: isProduction,
		discoverImages: false,
		discoverVideos: false,
	},
	linkChecker: {
		skipInspections: ['no-non-ascii-chars', 'no-uppercase-chars'],
	},
	ogImage: {
		// TODO：目前 Nuxt V5 的 DevTool 存在 Bug 导致调试不方便，而且 nuxt-og-image 限制较多，之后在考虑换回
		enabled: false,
		zeroRuntime: true,
	},
	robots: {
		credits: false,
		blockAiBots: true,
		blockNonSeoBots: true,
		groups: [
			{
				userAgent: [
					// 搜索引擎
					'Bingbot',
					'Applebot',
					'Googlebot',
					'YandexBot',
					'DuckDuckBot',

					// 社交媒体
					'Slackbot',
					'redditbot',
					'Twitterbot',
					'Discordbot',
					'LinkedInBot',
					'TelegramBot',
					'facebookexternalhit',

					// 互联网档案馆
					'ia_archiver',
					'archive.org_bot',

					// 秋云思
					'Curasea',
					'CuraseaCarbon',
				],
				allow: ['/'],
			},
		],
	},
	app: {
		buildAssetsDir: '_nexus',
		rootId: 'nexus_app',
		head: {
			titleTemplate: '锐冰 - %s',
			viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
			htmlAttrs: {
				dir: 'ltr',
				class: 'dark',
			},
			link: [
				// 网站图标
				{ rel: 'icon', type: 'image/jxl', sizes: '1024x1024', href: '/favicon.jxl' },
				{ rel: 'icon', type: 'image/webp', sizes: '1024x1024', href: '/favicon.webp' },
				{ rel: 'icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48 64x64 128x128 256x256' },
				{ rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon.png', sizes: '180x180' },
			],
			meta: [
				// 关键词
				{
					name: 'keywords',
					content: 'SharpIce, 锐冰, 幻想生物, 个人网站',
				},

				// 版权与许可证信息
				{
					name: 'copyright',
					content: 'Copyright © 2020-2026 锐冰 (SharpIce). Licensed under the Mozilla Public License 2.0.',
				},
				{
					name: 'license',
					content: 'https://www.mozilla.org/MPL/2.0/',
				},

				// 禁用浏览器扩展 Dark Reader
				{
					name: 'darkreader-lock',
					content: 'true',
				},
			],
		},
	},
});
