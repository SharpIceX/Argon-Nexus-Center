import fs from 'node:fs';
import os from 'node:os';
import url from 'node:url';
import ts from 'typescript';
import path from 'node:path';
import git from 'isomorphic-git';
import process from 'node:process';

const isProduction = process.env.NODE_ENV === 'production';

const strictTSConfigPath = url.fileURLToPath(import.meta.resolve('@anc/strict-tsconfig/tsconfig.json'));
const strictTSConfig = ts.readConfigFile(strictTSConfigPath, (path) => ts.sys.readFile(path));

export default defineNuxtConfig({
	ssr: true,
	pages: true,
	telemetry: false,
	appId: 'Argon-Nexus-Center',
	compatibilityDate: 'latest',
	srcDir: path.resolve(import.meta.dirname, './src'),
	buildId: await git.resolveRef({ fs, dir: path.resolve(import.meta.dirname, '../../'), ref: 'HEAD' }),
	modules: ['nuxt-svgo', '@nuxt/eslint', '@nuxt/a11y', 'nuxt-nexus'],
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
		tsConfig: strictTSConfig.config as Record<string, unknown>,
	},
	experimental: {
		headNext: true,
		typedPages: true,
		lazyHydration: true,
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
			concurrency: os.cpus().length - 1 || 1,
		},
	},
	devServer: {
		port: 8600,
		host: '127.0.0.1',
	},
	vite: {
		css: {
			transformer: 'lightningcss',
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
							cleanupIds: {
								minify: true,
								remove: true,
							},
						},
					},
				},
				'removeDimensions',
				'sortAttrs',
				'prefixIds',
			],
		},
	},
});
