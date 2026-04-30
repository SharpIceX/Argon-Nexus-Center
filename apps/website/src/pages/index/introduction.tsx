import { AppLinkExternal } from '#components';

/** 因为直接在 Vue 写 HTML 标签，会被 Prettier 格式化，很难看还有不必要的空格，所以使用 TSX */
const Introduction = () => {
	return (
		<p>
			我是独立开发者、开源志愿者、架空世界观创作者。我喜欢可爱的艺术作品和很棒的小说、电影剧情~目前主要维护一些开源项目，例如
			<AppLinkExternal to='https://github.com/SharpIceX/Argon-Nexus-Center'>
				{() => 'Argon Nexus Center'}
			</AppLinkExternal>
			{'、'}
			<AppLinkExternal to='https://github.com/SharpIceX/nuxt-nexus'>{() => 'Nuxt Nexus'}</AppLinkExternal>
			等项目，和一些项目的本地化贡献：
			<AppLinkExternal to='https://github.com/SharpIceX/CustomPlayerModels'>
				{() => 'CustomPlayerModels'}
			</AppLinkExternal>
		</p>
	);
};

export default Introduction;
