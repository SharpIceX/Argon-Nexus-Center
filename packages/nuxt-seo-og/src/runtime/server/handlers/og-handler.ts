import fs from 'node:fs';
import sharp from 'sharp';
import path from 'node:path';
import module from 'node:module';
import { inspect } from 'node:util';
import { Buffer } from 'node:buffer';
import { useStorage } from 'nitro/storage';
import { HTTPError, defineEventHandler } from 'h3';
import { NodeCompiler as TypstNodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

const require = module.createRequire(import.meta.url);

const FONTS_DIRECTORY = path.dirname(require.resolve('@lxgw/LxgwBright/LXGWBright/LXGWBright-Regular.ttf'));
const fontBlobs = [
	'LXGWBright-Light.ttf',
	'LXGWBright-Italic.ttf',
	'LXGWBright-Medium.ttf',
	'LXGWBright-Regular.ttf',
	'LXGWBright-LightItalic.ttf',
	'LXGWBright-MediumItalic.ttf',
].map((file) => fs.readFileSync(path.join(FONTS_DIRECTORY, file)));

const TYPST_DIRECTORY_ROOT = path.join(path.dirname(require.resolve('@anc/nuxt-seo-og/package.json')), 'src/typst');
const TYPST_CONTEXT = TypstNodeCompiler.create({
	workspace: TYPST_DIRECTORY_ROOT,
	fontArgs: [{ fontBlobs }],
});

sharp.simd(true);

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
			statusCode: 404,
			statusText: 'Not Found',
			message: `页面「${routePath}」没有标题！`,
		});
	}

	try {
		const svgString = TYPST_CONTEXT.svg({
			inputs: ogData,
			mainFilePath: path.resolve(TYPST_DIRECTORY_ROOT, 'main.typ'),
		});

		const webpImageBuffer = await sharp(Buffer.from(svgString))
			.resize({
				width: 1200,
			})
			.webp({
				effort: 0,
				quality: 85,
				preset: 'drawing',
			})
			.toBuffer();

		return new Response(webpImageBuffer, {
			headers: {
				'Content-Type': 'image/webp',
			},
		});
	} catch (error) {
		const formattedError = inspect(error, {
			depth: null,
			colors: true,
			compact: false,
			showHidden: false,
		});

		console.error(`--- [Typst Rendering Error] ---\nRoute: ${routePath}\nError Details:\n${formattedError}`);

		throw new HTTPError({
			cause: error,
			statusCode: 500,
			statusText: 'Typst Render Error',
			message: error instanceof Error ? error.message : String(error),
			data: {
				route: routePath,
			},
		});
	} finally {
		TYPST_CONTEXT.evictCache(10);
	}
});
