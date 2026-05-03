<template>
	<div :class="$style['friend-container']">
		<h1 :class="$style.title">朋友们</h1>
		<ul :class="$style['friend-list']">
			<li v-for="item in friendsList" :key="item.title" :class="$style['friend-card-container']">
				<a
					:href="item.url"
					target="_blank"
					:class="$style['friend-card']"
					rel="opener"
					@dragstart="handleDragStart($event, item.title)">
					<div v-if="item.avatar" aria-hidden="true">
						<img :src="item.avatar" :class="[$style.avatar, { [$style['is-rounded']]: !item.noRounded }]" />
					</div>
					<p :class="$style.name">{{ item.title }}</p>
				</a>
			</li>
		</ul>

		<div ref="dragPreview" :class="$style['drag-preview-ghost']">
			<span :class="$style['drag-preview-ghost-text']"></span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import friendsList from '~/data/friends/main';

useSeoMeta({
	title: '朋友们',
	description: '友谊连接',
});

const $style = useCssModule();

// 自定义拖拽预览
const dragPreview = ref<HTMLElement | null>(null);
const handleDragStart = (e: DragEvent, title: string) => {
	if (dragPreview.value && e.dataTransfer) {
		const textNode = dragPreview.value.querySelector(`.${$style['drag-preview-ghost-text']}`);
		if (textNode) textNode.textContent = title;
		e.dataTransfer.setDragImage(dragPreview.value, 24, dragPreview.value.offsetHeight / 2);
	}
};
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';

.title {
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	border-width: 0;
	overflow: hidden;
	position: absolute;
	white-space: nowrap;
	clip: rect(0, 0, 0, 0);
}

.friend-container {
	width: 100%;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.friend-list {
	gap: 1.5rem;
	display: flex;
	max-width: 90%;
	margin: 0 auto;
	flex-wrap: wrap;
	padding: 0 1rem;
	list-style: none;
	justify-content: center;
}

.friend-card-container {
	width: 240px;
}

.friend-card {
	display: flex;
	height: 240px;
	padding: 1.8rem;
	position: relative;
	align-items: center;
	border-radius: 18px;
	text-decoration: none;
	flex-direction: column;
	justify-content: center;
	border: 1px solid oklch(from @fantasy8 l c h / 0.4);
	background-color: oklch(from @fantasy1 l c h / 0.6);
	transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

	&:hover {
		border-color: @fantasy8;
		transform: translateY(-8px);
		box-shadow: 0 10px 30px oklch(0 0 0 / 0.3);
		background-color: oklch(from @fantasy2 l c h / 0.8);
	}
}

.name {
	font-weight: 600;
	color: @fantasy4;
	font-size: 1.15rem;
	margin-bottom: 0.6rem;
	letter-spacing: 0.5px;

	&:first-child {
		margin: unset;
		font-size: 2rem;
	}
}

.avatar {
	width: 85px;
	height: 85px;
	display: flex;
	object-fit: cover;
	margin-bottom: 1.2rem;
	transition: transform 0.5s ease;

	&.is-rounded {
		border-radius: 50%;
	}
}

.drag-preview-ghost {
	left: 0;
	top: -500px;
	display: flex;
	position: fixed;
	color: @fantasy4;
	align-items: center;
	border-radius: 20px;
	white-space: nowrap;
	pointer-events: none;
	padding: 0.5rem 1rem;
	border: 1px solid @fantasy8;
	background-color: @fantasy2;
}

.drag-preview-ghost-text {
	font-weight: 600;
	font-size: 1.2rem;
	margin-left: 1.5rem;
}
</style>
