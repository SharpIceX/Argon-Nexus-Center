/*
生成缩略图：
magick 未命名_RGB_8.png -gravity center -crop "%[fx:min(w,h)*0.5]x%[fx:min(w,h)*0.5]+0+0" -resize 512x512 -strip ppm:- | cjxl - thumb.jxl -d 2.0 -e 9

其他格式的图片转 JXL：
cjxl -d 0 -e 9 原始图片.png image.jxl
*/

interface galleryType {
	/** 图片链接 */
	image: string;

	/** 图片缩略图链接 */
	thumb: string;

	/** 图片标题 */
	title: string;

	/** 图片纯文本内容&描述 */
	description?: string | undefined;
}

const imageModules = import.meta.glob('./data/**/*', { eager: true, import: 'default' });

function getURL(relativePath: string): string {
	const cleanPath = relativePath.startsWith('./') ? relativePath : `./${relativePath}`;
	return imageModules[cleanPath] as string;
}

const galleryMap: galleryType[] = [
	{
		title: 'Avali与Ardonia的Twin Pass',
		image: getURL('./data/Avali与Ardonia的Twin Pass/image.jxl'),
		thumb: getURL('./data/Avali与Ardonia的Twin Pass/thumb.jxl'),
	},
	{
		title: '剑—后退',
		image: getURL('./data/剑—后退/image.jxl'),
		thumb: getURL('./data/剑—后退/thumb.jxl'),
		description: '第一次做 Avali 拿着武器的渲染图。虽然感觉效果不是很好。。。',
	},
	{
		title: '渲染测试—可怜的Avali',
		image: getURL('./data/渲染测试—可怜的Avali/image.jxl'),
		thumb: getURL('./data/渲染测试—可怜的Avali/thumb.jxl'),
		description: '这只 Avali 演员要领盒饭了吗？',
	},
];

// 检查 Title 是否重复
if (import.meta.dev || import.meta.server) {
	const duplicates = galleryMap
		.map((item, index) => ({ title: item.title, index }))
		.filter((item, index, self) => self.findIndex((t) => t.title === item.title) !== index);

	if (duplicates.length > 0) {
		const info = duplicates.map((d) => `"${d.title}" (索引: ${d.index})`).join(', ');
		throw new Error(`发现重复的图片标题: ${info}`);
	}
}

export default galleryMap;
export type { galleryType };
