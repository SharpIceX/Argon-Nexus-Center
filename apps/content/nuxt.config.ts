import path from 'node:path';

export default defineNuxtConfig({
	nitro: {
		publicAssets: [
			{
				maxAge: 0,
				fallthrough: true,
				dir: path.resolve(import.meta.dirname, './pages'),
				ignore: ['**/*.mdx', '**/*.text'],
			},
		],
	},
});
