import sharp from 'sharp';
import url from 'node:url';
import path from 'node:path/posix';
import { Buffer } from 'node:buffer';
import { defineEventHandler } from 'h3';
import { useStorage } from 'nitro/storage';
import { NodeCompiler as TypstNodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

const TYPST_DIRECTORY_ROOT = url.fileURLToPath(import.meta.resolve('@anc/nuxt-seo-og/src/typst'));

const TYPST_CONTEXT = TypstNodeCompiler.create({
	workspace: TYPST_DIRECTORY_ROOT,
});
TYPST_CONTEXT.evictCache(10);

export default defineEventHandler(async (event) => {
	const dirname = path.dirname(event.context.params!['_']!);
	const routePath = dirname === '.' ? '/' : `/${dirname}`;

	const ogData = await useStorage('og-data').getItem<{
		title: string;
		template: string;
		description: string;
	}>(routePath);

	if (!ogData) {
		return;
	}

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
			'Cache-Control': 'public, max-age=86400',
		},
	});
});
