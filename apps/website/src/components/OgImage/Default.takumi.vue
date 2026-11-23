<template>
	<div class="og-container">
		<div class="inner-border">
			<div class="header">
				<img :src="faviconIcon" class="logo" />
				<p class="text">
					<span>Argon Nexus Center</span>
					<span v-if="props.type"> / Blog</span>
				</p>
			</div>

			<h1 class="title">{{ title }}</h1>
			<h1 class="description">{{ description }}</h1>

			<div class="footer">
				<span class="tag">Nexus Network</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { RouteMeta } from 'vue-router';
import faviconIcon from '~/../public/favicon.webp?url&inline';

const props = defineProps<{
	title: string;
	description?: string;
	type?: RouteMeta['type'];
}>();

if (!props.title?.trim()) {
	throw new Error('没有标题');
}
</script>

<style lang="less" scoped>
@import (reference) '@anc/fantasy-design/src/color.less';

.og-container {
	width: 100%;
	height: 100%;
	display: flex;
	padding: 50px;
	align-items: center;
	color: @fantasy4;
	justify-content: center;
	background-color: @fantasy0;
}

.inner-border {
	width: 100%;
	height: 100%;
	display: flex;
	padding: 60px;
	position: relative;
	flex-direction: column;
	justify-content: center;
	border: 2px solid @fantasy3;

	.header {
		gap: 12px;
		top: -30px;
		left: 40px;
		display: flex;
		padding: 0 15px;
		position: absolute;
		align-items: center;
		flex-direction: row;
		background-color: @fantasy0;

		.logo {
			width: 4em;
			height: 4em;
		}

		.text {
			font-size: 2em;
		}
	}

	.title,
	.description {
		text-wrap: balance;
		word-break: keep-all;
		overflow-wrap: break-word;
		text-autospace: ideograph-alpha;
	}

	.title {
		font-size: 3em;
		font-weight: bold;
	}

	.description {
		color: @fantasy7;
	}

	.footer {
		right: 40px;
		bottom: -15px;
		padding: 0 15px;
		position: absolute;
		background-color: @fantasy0;

		.tag {
			font-size: 1.5em;
			letter-spacing: 4px;
			color: @fantasy7;
		}
	}
}
</style>
