<template>
	<div :class="$style['home-wrapper']">
		<div :class="$style['home-container']">
			<h1 :class="$style.title">
				<span>关于我</span>
				<featherIcon aria-hidden="true" />
			</h1>

			<section :class="$style.section">
				<p>
					我是一名独立开发者、开源志愿者，目前主要维护一些开源项目。我平常也喜欢创作架空世界观、看科幻小说和可爱的艺术作品。
				</p>
			</section>

			<hr :class="$style['hr-line']" />

			<section :class="$style.section">
				<ul :class="$style['connect-list']">
					<li v-for="item in connectList" :key="item.name">
						<AppLinkExternal :to="item.url">
							<component :is="item.icon" aria-hidden="true" />
							<span>{{ item.name }}</span>
						</AppLinkExternal>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<script lang="ts" setup>
import xIcon from 'simple-icons/icons/x.svg';
import pixivIcon from 'simple-icons/icons/pixiv.svg';
import githubIcon from 'simple-icons/icons/github.svg';
import redditIcon from 'simple-icons/icons/reddit.svg';
import discordIcon from 'simple-icons/icons/discord.svg';
import bilibiliIcon from 'simple-icons/icons/bilibili.svg';
import { Feather as featherIcon, Mail as mailIcon } from '@lucide/vue';

useSeoMeta({
	title: '首页',
});

// TODO：这里之后要移动到单独的页面，然后补充一些相关链接。。。
const connectList = [
	{ name: 'GitHub', icon: markRaw(githubIcon), url: 'https://github.com/SharpIceX' },
	{ name: 'BiliBili', icon: markRaw(bilibiliIcon), url: 'https://space.bilibili.com/513364639' },
	{ name: 'Discord', icon: markRaw(discordIcon), url: 'https://discord.com/users/650534063492431891' },
	{ name: 'Pixiv', icon: markRaw(pixivIcon), url: 'https://www.pixiv.net/users/113640979' },
	{ name: 'Reddit', icon: markRaw(redditIcon), url: 'https://www.reddit.com/user/SharpIceX' },
	{ name: 'Twitter', icon: markRaw(xIcon), url: 'https://x.com/Curasea_Elve' },
	{ name: 'Email', icon: markRaw(mailIcon), url: 'mailto:SharpIce@SharpIce.top' },
];
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';

.hr-line {
	width: 100%;
	margin-block: 1rem;
	border-style: dashed;
}

.home-wrapper {
	height: 100%;
	display: flex;
	padding: 1rem;
	align-items: center;
	justify-content: center;

	.home-container {
		width: 36%;
		display: flex;
		line-break: strict;
		flex-direction: column;
		overflow-wrap: break-word;
	}

	/* 小屏幕 */
	@media (max-width: 1024px) {
		.home-container {
			width: 100%;
		}
	}
}

.title {
	display: flex;
	align-items: center;
	margin-block: 0.5rem;

	svg {
		margin-inline: 0.5rem;
	}
}

.section {
	p {
		text-indent: 2em;

		a {
			text-decoration: none;
		}
	}
}

.connect-list {
	gap: 1rem;
	display: flex;
	flex-wrap: wrap;
	font-size: 1.1rem;
	flex-direction: row;
	justify-content: center;

	a {
		display: flex;
		column-gap: 0.5rem;
		align-items: center;
		text-decoration: none;
	}
}
</style>
