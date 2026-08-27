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

	/** 图片描述 */
	description?: string | undefined;
}

const imageModules = import.meta.glob('./data/**/*', { eager: true, import: 'default' });

function getURL(relativePath: string): string {
	const cleanPath = relativePath.startsWith('./') ? relativePath : `./${relativePath}`;
	return imageModules[cleanPath] as string;
}

const galleryMap: Record<string, galleryType> = {
	'Avali与Ardonia的Twin-Pass': {
		title: 'Avali与Ardonia的Twin Pass',
		image: getURL('./data/Avali与Ardonia的Twin Pass/image.jxl'),
		thumb: getURL('./data/Avali与Ardonia的Twin Pass/thumb.jxl'),
	},
	'剑—后退': {
		title: '剑—后退',
		image: getURL('./data/剑—后退/image.jxl'),
		thumb: getURL('./data/剑—后退/thumb.jxl'),
		description: '第一次做 Avali 拿着武器的渲染图。虽然感觉效果不是很好。。。',
	},
	'渲染测试—可怜的Avali': {
		title: '渲染测试—可怜的Avali',
		image: getURL('./data/渲染测试—可怜的Avali/image.jxl'),
		thumb: getURL('./data/渲染测试—可怜的Avali/thumb.jxl'),
		description: '这只 Avali 演员要领盒饭了吗？',
	},
	立绘渲染: {
		title: '立绘渲染',
		image: getURL('./data/立绘渲染/image.jxl'),
		thumb: getURL('./data/立绘渲染/thumb.jxl'),
		description: '立绘画师By 骨头',
	},
};

const galleryList = Object.entries(galleryMap).map(([urlName, item]) => ({
	urlName,
	...item,
})) satisfies (galleryType & { urlName: string })[];

export { galleryList };
export type { galleryType };
