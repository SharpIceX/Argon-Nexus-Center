import MarkdownIt from 'markdown-it';
import MarkdownItCJKFriendly from 'markdown-it-cjk-friendly';

function createMarkdownRender(): (markdown: string) => string {
	const md = new MarkdownIt();

	md.use(MarkdownItCJKFriendly);

	return (markdown: string): string => md.render(markdown);
}

export default createMarkdownRender;
