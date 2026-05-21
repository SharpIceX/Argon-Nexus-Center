import fs from 'node:fs';
import sharp from 'sharp';
import path from 'node:path';
import module from 'node:module';
import { inspect } from 'node:util';
import { Buffer } from 'node:buffer';
import { HTTPError } from 'nitro/h3';
import { defineEventHandler } from 'h3';
import { useStorage } from 'nitro/storage';
import { NodeCompiler as TypstNodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

const require = module.createRequire(import.meta.url);

const FONTS_DIRECTORY = path.dirname(require.resolve('@lxgw/LxgwBright/LXGWBright/LXGWBright-Regular.ttf'));
const fontFiles = [
	'LXGWBright-Light.ttf',
	'LXGWBright-Italic.ttf',
	'LXGWBright-Medium.ttf',
	'LXGWBright-Regular.ttf',
	'LXGWBright-LightItalic.ttf',
	'LXGWBright-MediumItalic.ttf',
];
const fontBlobs = fontFiles.map((file) => fs.readFileSync(path.join(FONTS_DIRECTORY, file)));

const TYPST_DIRECTORY_ROOT = path.join(path.dirname(require.resolve('@anc/nuxt-seo-og/package.json')), 'src/typst');

const TYPST_CONTEXT = TypstNodeCompiler.create({
	workspace: TYPST_DIRECTORY_ROOT,
	fontArgs: [
		{
			fontBlobs,
		},
	],
});
TYPST_CONTEXT.evictCache(10);

export default defineEventHandler(async (event) => {
	const dirname = path.posix.dirname(event.context.params!['_']!);
	const routePath = dirname === '.' ? '/' : `/${dirname}`;

	const ogData = await useStorage('og-data').getItem<
		{
			title: string | undefined;
			description: string | undefined;
			template: string | undefined;
		} & Record<string, string>
	>(routePath);

	if (!ogData) {
		return;
	}

	if (ogData.title === undefined) {
		throw new HTTPError({
			status: 404,
			statusText: 'Not Found',
			message: `页面「${routePath}」没有标题！`,
			body: {
				fatal: true,
			},
		});
	}

	try {
		const svgString = TYPST_CONTEXT.svg({
			inputs: ogData,
			mainFilePath: path.resolve(TYPST_DIRECTORY_ROOT, 'main.typ'),
		});

		const webpImageBuffer = await sharp(Buffer.from(svgString))
			.webp({
				quality: 100,
				lossless: true,
			})
			.toBuffer();

		return new Response(new Uint8Array(webpImageBuffer), {
			headers: {
				'Content-Type': 'image/webp',
			},
		});
	} catch (e) {
		const formattedError = inspect(e, {
			depth: null,
			colors: true,
			compact: false,
			showHidden: false,
		});

		console.error(`--- [Typst Rendering Error] ---\nRoute: ${routePath}\nError Details:\n${formattedError}`);

		throw new HTTPError({
			status: 500,
			cause: e,
			statusText: 'Typst Render Error',
			message: e instanceof Error ? e.message : String(e),
			data: {
				route: routePath,
			},
			body: {
				fatal: true,
			},
		});
	}
});
