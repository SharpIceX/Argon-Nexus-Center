import {
	Atom as atomIcon,
	Book as bookIcon,
	Link as linkIcon,
	Heart as heartIcon,
	House as houseIcon,
	Clapperboard as clapperboardIcon,
} from '@lucide/vue';

interface NavItemType {
	label: string;
	path: string;
	icon: Component;
}

const navData: NavItemType[] = [
	// TODO

	{ label: '首页', path: '/', icon: houseIcon },
	{ label: '艺术图库', path: '/gallery/', icon: clapperboardIcon },
	// { label: '博客', path: '/blog/', icon: bookIcon },
	// { label: '架空世界观', path: '/ts/', icon: atomIcon },
	// { label: '联系我', path: '/connect/', icon: linkIcon },
	{ label: '朋友们', path: '/friends/', icon: heartIcon },
];

export default navData;
export type { NavItemType };
