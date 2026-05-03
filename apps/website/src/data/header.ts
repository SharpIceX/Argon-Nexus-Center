import {
	Atom as atomIcon,
	Book as bookIcon,
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
	{ label: '首页', path: '/', icon: houseIcon },
	{ label: '博客', path: '/blog', icon: bookIcon },
	{ label: '图库', path: '/art', icon: clapperboardIcon },
	{ label: '幻术奇象', path: '/ts', icon: atomIcon },
	{ label: '朋友们', path: '/friends', icon: heartIcon },
];

export default navData;
export type { NavItemType };
