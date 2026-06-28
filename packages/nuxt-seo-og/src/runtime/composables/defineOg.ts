import { useNuxtApp } from '#imports';

interface OgOptions {
	disable?: true;

	type?:
		// No Vertical
		| 'website'
		| 'article'
		| 'book'
		| 'profile'
		| 'payment.link'
		// Music
		| 'music.song'
		| 'music.album'
		| 'music.playlist'
		| 'music.radio_station'
		// Video
		| 'video.movie'
		| 'video.episode'
		| 'video.tv_show'
		| 'video.other';
	imageTemplate?: string;

	sysInputs?: Record<string, string>;
}

declare module 'h3' {
	interface H3EventContext {
		_og_options?: OgOptions | undefined;
	}
}

export function defineOg(options: OgOptions) {
	if (import.meta.server) {
		const nuxtApp = useNuxtApp();
		const event = nuxtApp.ssrContext?.event;

		if (event) {
			event.context._og_options = options;
		}
	}
}

export type { OgOptions };
