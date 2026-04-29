import type { DefineComponent, ReservedProps, SVGAttributes } from 'vue';

import bookIcon from 'lucide-static/icons/book.svg?component';
import atomIcon from 'lucide-static/icons/atom.svg?component';
import heartIcon from 'lucide-static/icons/heart.svg?component';
import houseIcon from 'lucide-static/icons/house.svg?component';
import clapperboardIcon from 'lucide-static/icons/clapperboard.svg?component';

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
