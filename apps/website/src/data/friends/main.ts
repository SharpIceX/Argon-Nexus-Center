interface friendsListType {
	url: string;
	title: string;
	noRounded?: boolean;
	avatar?: string;
}

const avatars = import.meta.glob('./avatar/*', { eager: true, import: 'default' });
const getAvatar = (name: string) => {
	const path = `./avatar/${name}`;
	return avatars[path] as string;
};

const friendsList: friendsListType[] = [
	{
		title: '初雪·冰',
		url: 'https://wolf.snowlyicewolf.club/',
		avatar: getAvatar('snowlyicewolf.jxl'),
	},
	{
		title: '洺渊',
		url: 'https://blog.fmyron.com/',
		avatar: getAvatar('fmyron.jxl'),
	},
	{
		title: '0o酱',
		noRounded: true,
		url: 'https://blog.im0o.top/',
		avatar: getAvatar('im0o.jxl'),
	},
	{
		title: '西西',
		url: 'https://xxand.cc/',
		avatar: getAvatar('xxand.jxl'),
	},
	{
		title: '炽煋',
		url: 'https://blog.fluffycx.cn/',
	},
	{
		title: '飞羽',
		url: 'https://zoxoy.club/',
	},
	{
		title: '迷失的小K',
		url: 'https://blog.kclub.tech/',
	},
	{
		title: '夏枫',
		url: 'https://blog.mcxiafeng.top/',
		avatar: getAvatar('xiafeng.jxl'),
	},
	{
		title: '胡斯凯',
		url: 'https://hooskai.top/',
	},
	{
		title: '李子小大',
		url: 'https://lizi-owo.xyz/',
		avatar: getAvatar('lizi-owo.jxl'),
	},
	{
		title: '白山白墨',
		noRounded: true,
		url: 'https://bai.ink/',
		avatar: getAvatar('iy.jxl'),
	},
	{
		title: '中二狐狸',
		url: 'https://imfurry.com/',
		avatar: getAvatar('imfurry.jxl'),
	},
	{
		title: 'XME Notes Library',
		url: 'https://blog.xzadudu179.top/',
		avatar: getAvatar('xzadudu179.jxl'),
	},
	{
		title: '泛泛',
		url: 'https://sothx.com/',
		avatar: getAvatar('sothx.jxl'),
	},
	{
		title: '应龙笔记',
		url: 'https://www.silverdragon.cn/?link=yourhost',
		avatar: getAvatar('silverdragon.jxl'),
	},
	{
		title: 'F_Qilin',
		url: 'https://blog.fqilin.top/',
		avatar: getAvatar('fqilin.jxl'),
	},
	{
		title: '渣渣120',
		url: 'https://zhazha120.cn/',
	},
	{
		title: '炎天',
		url: 'https://yawntee.top/',
		avatar: getAvatar('yawntee.jxl'),
	},
];

export default friendsList;
export type { friendsListType };
