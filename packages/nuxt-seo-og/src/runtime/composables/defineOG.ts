import { useRequestEvent } from '#imports';
import type { UseSeoMetaInput } from 'unhead/types';

interface ogOptions {
	/** 是否禁用 Open Graph 图片生成 */
	disabledOGImage?: boolean;

	/** Typst 模板路径或名称（对应 sys input 中的 template） */
	ogImageTemplate?: string;

	/** 传递给 Typst sys input 的自定义变量（可覆盖 name、description、template）） */
	props?: Record<string, string>;

	/** Open Graph 类型 */
	ogType?: Extract<UseSeoMetaInput['ogType'], string>;
}

declare module 'h3' {
	interface H3EventContext {
		_og_options?: ogOptions | undefined;
	}
}

export function defineOG(options: ogOptions) {
	if (import.meta.server) {
		const event = useRequestEvent();

		if (event) {
			event.context._og_options = options;
		}
	}
}

export type { ogOptions };
