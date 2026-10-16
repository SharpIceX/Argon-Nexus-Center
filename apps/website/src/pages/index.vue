<template>
	<div :class="$style['home-container']">
		<div :class="$style['home-content']">
			<img src="/avatar.jxl" width="64" height="64" :class="$style['avatar-content']" aria-hidden="true" />

			<div>
				<h1>关于我</h1>
				<p :class="$style.bio">
					我是一名独立开发者、开源志愿者，目前主要维护一些开源项目。我平常也喜欢创作架空世界观、看科幻小说和可爱的艺术作品。
				</p>
			</div>
		</div>
		<hr :class="$style['hr-line']" />

		<ul :class="$style['connect-list']">
			<li v-for="item in connectList" :key="item.name">
				<AppLinkExternal :to="item.url">
					<component :is="item.icon" aria-hidden="true" />
					<span>{{ item.name }}</span>
				</AppLinkExternal>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import xIcon from 'simple-icons/icons/x.svg';
import { Mail as mailIcon } from '@lucide/vue';
import pixivIcon from 'simple-icons/icons/pixiv.svg';
import githubIcon from 'simple-icons/icons/github.svg';
import redditIcon from 'simple-icons/icons/reddit.svg';
import discordIcon from 'simple-icons/icons/discord.svg';

useSeoMeta({
	title: '首页',
});

const connectList = [
	{ name: 'GitHub', icon: markRaw(githubIcon), url: 'https://github.com/SharpIceX' },
	{ name: 'Discord', icon: markRaw(discordIcon), url: 'https://discord.com/users/650534063492431891' },
	{ name: 'Pixiv', icon: markRaw(pixivIcon), url: 'https://www.pixiv.net/users/113640979' },
	{ name: 'Reddit', icon: markRaw(redditIcon), url: 'https://www.reddit.com/user/SharpIceX' },
	{ name: 'Twitter', icon: markRaw(xIcon), url: 'https://x.com/Curasea_Elve' },
	{ name: 'Email', icon: markRaw(mailIcon), url: 'mailto:SharpIce@SharpIce.top' },
];
</script>

<style lang="less" module>
.home-container {
	width: 40%;
	height: 100%;
	display: flex;
	margin: 0 auto;
	flex-direction: column;
	justify-content: center;

	/* 小屏幕 */
	@media (max-width: 1024px) {
		width: 100%;
		padding: 1rem;
	}
}

.home-content {
	gap: 1rem;
	display: grid;
	align-items: center;
	grid-template-columns: 10rem minmax(0, 1fr);

	.avatar-content {
		width: 100%;
		aspect-ratio: 1;
		object-fit: contain;
		image-rendering: pixelated;
	}

	@media (max-width: 1024px) {
		justify-items: center;
		grid-template-columns: 1fr;

		.avatar-content {
			width: 15rem;
		}
	}
}

.hr-line {
	width: 100%;
	margin-block: 1rem;
	border-style: dashed;
}

.bio {
	text-indent: 2em;
}

.connect-list {
	gap: 1rem;
	display: flex;
	flex-wrap: wrap;
	font-size: 1.1rem;
	justify-content: center;

	a {
		display: flex;
		column-gap: 0.5rem;
		align-items: center;
		text-decoration: none;
	}
}
</style>
