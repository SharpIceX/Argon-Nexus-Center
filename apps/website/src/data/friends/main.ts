interface friendsListType {
	url: string;
	title: string;
	avatar?: string;
	followSEO?: boolean;
	noRounded?: boolean;
}

const avatars = import.meta.glob('./avatar/*', { eager: true, import: 'default' });
const getAvatar = (name: string) => {
	const path = `./avatar/${name}`;
	return avatars[path] as string;
};

const friendsList: friendsListType[] = [
	// TODO
];

export default friendsList;
export type { friendsListType };
