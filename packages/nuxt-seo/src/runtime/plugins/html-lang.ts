import { defineNuxtPlugin, useAppConfig, useHead } from '#imports';

export default defineNuxtPlugin(() => {
	const appConfig = useAppConfig();

	const locale = new Intl.Locale(appConfig.site.lang).maximize();

	useHead({
		htmlAttrs: {
			lang: locale.script !== undefined ? `${locale.language}-${locale.script}` : locale.language,
		},
	});
});
