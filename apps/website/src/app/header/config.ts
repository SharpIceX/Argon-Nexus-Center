import type { DefineComponent, ReservedProps, SVGAttributes } from 'vue';

import bookIcon from '@fortawesome/fontawesome-free/svgs/solid/book.svg?component';
import atomIcon from '@fortawesome/fontawesome-free/svgs/solid/atom.svg?component';
import houseIcon from '@fortawesome/fontawesome-free/svgs/solid/house.svg?component';
import heartIcon from '@fortawesome/fontawesome-free/svgs/solid/heart.svg?component';
import clapperboardIcon from '@fortawesome/fontawesome-free/svgs/solid/clapperboard.svg?component';

interface NavItemType {
	label: string;
	path: string;
	icon: DefineComponent<SVGAttributes & ReservedProps>;
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
