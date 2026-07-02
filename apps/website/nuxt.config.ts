import fs from 'node:fs';
import os from 'node:os';
import url from 'node:url';
import ts from 'typescript';
import path from 'node:path';
import git from 'isomorphic-git';
import process from 'node:process';

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubAction = process.env.GITHUB_ACTIONS === 'true';

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

export default defineNuxtConfig({
	telemetry: false,
	appId: 'Argon-Nexus-Center',
	compatibilityDate: 'latest',
	css: ['~/styles/main.less'],
	srcDir: path.resolve(import.meta.dirname, './src'),
	buildId: await git.resolveRef({ fs, dir: path.resolve(import.meta.dirname, '../../'), ref: 'HEAD' }),
	extends: [url.fileURLToPath(import.meta.resolve('@anc/content'))],
	modules: [
		'@nuxt/a11y',
		'nuxt-nexus',
		'reka-ui/nuxt',
		'@nuxt/eslint',
		'@anc/nuxt-seo',
		'@nuxtjs/device',
		'@anc/nuxt-seo-og',
		'@anc/nuxt-seo-sitemap',
		'@anc/nuxt-svg-static',
		'@anc/nuxt-site-config',
		'@anc/nuxt-md-component',
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
	},
	devtools: {
		enabled: !isProduction,
	},
	build: {
		analyze: process.env.ANALYZE === 'true' ? { analyzerMode: 'server', analyzerPort: 8601 } : false,
	},
	nitro: {
		preset: 'cloudflare-pages-static',
		prerender: {
			crawlLinks: true,
			autoSubfolderIndex: true,
			concurrency: isGitHubAction ? os.cpus().length : os.cpus().length - 1 || 1,

			routes: [
				// 图库页面
				'/gallery',
			],
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
			include: ['gsap', 'reka-ui', '@vue/devtools-kit', '@vue/devtools-core', '@lucide/vue'],
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
		lang: 'zh-CN',
		url: 'https://avali.top',
	},
	app: {
		buildAssetsDir: '_nexus',
		rootId: `nexus_app`,
		head: {
			titleTemplate: '锐冰 - %s',
			viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
			htmlAttrs: {
				dir: 'ltr',
				class: 'dark',
			},
			meta: [
				// 关键词
				{
					name: 'keywords',
					content: 'SharpIce, 锐冰, 幻想生物, 个人网站',
				},

				// Web App
				{
					name: 'apple-mobile-web-app-title',
					content: '锐冰',
				},

				// 网站主题颜色
				{
					name: 'theme-color',
					content: '#4DA9CF',
				},

				// 版权信息
				{
					name: 'copyright',
					content: 'Copyright © 2020-2026 锐冰 (SharpIce). Licensed under the Mozilla Public License 2.0.',
				},

				// 作者
				{
					name: 'author',
					content: '锐冰',
				},

				// 许可证
				{
					name: 'license',
					content: 'https://www.mozilla.org/MPL/2.0/',
				},

				// 禁用浏览器扩展 Dark Reader
				{
					name: 'darkreader-lock',
				},

				// 仅提供深色模式
				{
					name: 'color-scheme',
					content: 'dark',
				},
			],

			link: [
				{
					rel: 'apple-touch-icon',
					href: '/apple-touch-icon.png',
				},

				{
					rel: 'icon',
					type: 'image/x-icon',
					sizes: 'any',
					href: '/favicon.ico',
				},
				{
					rel: 'icon',
					type: 'image/jxl',
					sizes: '1024x1024',
					href: '/favicon.jxl',
				},
			],
		},
	},
});
