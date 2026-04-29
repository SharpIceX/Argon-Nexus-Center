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

export default defineNuxtConfig({
	ssr: true,
	pages: true,
	telemetry: false,
	appId: 'Argon-Nexus-Center',
	compatibilityDate: 'latest',
	css: ['~/styles/main.less'],
	srcDir: path.resolve(import.meta.dirname, './src'),
	buildId: await git.resolveRef({ fs, dir: path.resolve(import.meta.dirname, '../../'), ref: 'HEAD' }),
	modules: ['nuxt-svgo', '@nuxt/eslint', '@nuxt/a11y', 'nuxt-nexus', 'reka-ui/nuxt', '@nuxtjs/device'],
	alias: {
		$: path.resolve(import.meta.dirname, './node_modules'),
	},
	future: {
		compatibilityVersion: 5,
		typescriptBundlerResolution: true,
	},
	features: {
		inlineStyles: true,
	},
	typescript: {
		strict: true,
		tsConfig: strictTSConfig.config as Record<string, unknown>,
	},
	experimental: {
		headNext: true,
		typedPages: true,
		lazyHydration: true,
		componentIslands: true,
		typescriptPlugin: true,
		navigationRepaint: true,
		clientNodePlaceholder: true,
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
		},
	},
	devServer: {
		port: 8600,
		host: '127.0.0.1',
	},
	vite: {
		css: {
			transformer: 'lightningcss',
			modules: {
				generateScopedName: '[local]_[hash:base64:5]',
			},
		},
		build: {
			target: 'esnext',
			cssMinify: 'lightningcss',
			modulePreload: {
				polyfill: false,
			},
		},
		esbuild: {
			jsx: 'automatic',
			drop: isProduction ? ['console', 'debugger'] : [],
		},
		optimizeDeps: {
			include: ['gsap', 'reka-ui', '@vue/devtools-kit', '@vue/devtools-core'],
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
	svgo: {
		dts: true,
		global: false,
		defaultImport: 'componentext',
		svgoConfig: {
			plugins: [
				{
					name: 'preset-default',
					params: {
						floatPrecision: 2,
						overrides: {
							removeViewBox: false,
							convertShapeToPath: false,
							mergePaths: false,
							cleanupIds: {
								minify: true,
								remove: true,
							},
						},
					},
				},
				{
					name: 'addAttributesToSVGElement',
					params: {
						attributes: [{ fill: 'none' }, { stroke: 'currentColor' }],
					},
				},
				'removeDimensions',
				'sortAttrs',
				'prefixIds',
			],
		},
	},
	reka: {
		prefix: 'reka',
	},
	app: {
		buildAssetsDir: '_nexus',
		rootId: `nexus_app`,
		head: {
			titleTemplate: '%s - 锐冰',
			viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
			htmlAttrs: {
				dir: 'ltr',
				class: 'dark',
				lang: 'zh-Hans',
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
