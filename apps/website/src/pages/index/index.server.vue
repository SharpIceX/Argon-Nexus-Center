<template>
	<div :class="$style['home-wrapper']">
		<div :class="$style['home-container']">
			<h1 :class="$style.title">
				<span>关于我</span>
				<featherIcon aria-hidden="true" />
			</h1>
			<section :class="$style.section">
				<introduction />
			</section>

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
import introduction from './introduction';
import githubIcon from 'simple-icons/icons/github.svg';
import discordIcon from 'simple-icons/icons/discord.svg';
import bilibiliIcon from 'simple-icons/icons/bilibili.svg';
import { Feather as featherIcon, Mail as mailIcon } from '@lucide/vue';

useSeoMeta({
	title: '首页',
});

const connectList = [
	{ name: 'GitHub', icon: markRaw(githubIcon), url: 'https://github.com/SharpIceX' },
	{ name: 'BiliBili', icon: markRaw(bilibiliIcon), url: 'https://space.bilibili.com/513364639' },
	{ name: 'Discord', icon: markRaw(discordIcon), url: 'https://discord.com/users/650534063492431891' },
	{ name: 'Email', icon: markRaw(mailIcon), url: 'mailto:SharpIce@SharpIce.top' },
];
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';

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
