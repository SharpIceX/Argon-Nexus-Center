import MarkdownIt from 'markdown-it';
import MarkdownItCJKFriendly from 'markdown-it-cjk-friendly';
import { attrs as MarkdwonItAttrs } from '@mdit/plugin-attrs';
import type { MarkdownItAttrsOptions } from '@mdit/plugin-attrs';

function createMarkdownRender(): (markdown: string) => string {
	const md = new MarkdownIt();

	md.use(MarkdownItCJKFriendly);
	md.use(MarkdwonItAttrs, {
		left: '{{',
		right: '}}',
	} satisfies MarkdownItAttrsOptions);

	return (markdown: string): string => md.render(markdown);
}

export default createMarkdownRender;
