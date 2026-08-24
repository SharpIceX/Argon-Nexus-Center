<template>
	<div :class="$style['gallery-container']">
		<h1>艺术图库</h1>
		<RekaTooltipProvider :delay-duration="100" :skip-delay-duration="300">
			<ul :class="$style['gallery-list']">
				<li v-for="item in galleryList" :key="item.urlName" :class="$style['gallery-item']">
					<RekaTooltipRoot>
						<RekaTooltipTrigger as-child>
							<NuxtLink
								:title="item.title"
								:to="`/gallery/${item.urlName}/`"
								@dragstart="handleDragStart($event, item)">
								<figure>
									<img :src="item.thumb" :aria-hidden="true" loading="lazy" />
								</figure>
							</NuxtLink>
						</RekaTooltipTrigger>

						<!-- 悬浮提示 -->
						<RekaTooltipPortal>
							<RekaTooltipContent :class="$style['hover-tooltip']" :side-offset="10">
								<span>{{ item.title }}</span>
							</RekaTooltipContent>
						</RekaTooltipPortal>
					</RekaTooltipRoot>
				</li>
			</ul>
		</RekaTooltipProvider>

		<!-- 拖拽预览 -->
		<div ref="dragPreview" :class="$style['drag-preview-ghost']">
			<img :class="$style['drag-preview-ghost-thumb']" src="" alt="" />
			<span :class="$style['drag-preview-ghost-text']"></span>
		</div>

		<NuxtPage />
	</div>
</template>

<script lang="ts" setup>
import { galleryList } from '~/data/gallery/main';
import type { galleryType } from '~/data/gallery/main';

/**
 * TODO: 「外面的缩略图」和「灯箱内图片」都需要改成手动懒加载
 * 需要处理：加载中、加载完成、加载错误、解码错误、加载超时间（灯箱内的，需要获取文件大小来动态设定，并且要有提示）
 */

definePageMeta({
	key: 'gallery-page',
	pageTransition: false,
});

const $style = useCssModule();

useSeoMeta({
	title: '艺术图库',
	description: '这里有我做的CG渲染图之类的东西~',
});

// 自定义拖拽预览
const dragPreview = ref<HTMLElement | null>(null);
const handleDragStart = (e: DragEvent, item: galleryType) => {
	if (dragPreview.value && e.dataTransfer) {
		const imgNode = dragPreview.value.querySelector<HTMLImageElement>(`.${$style['drag-preview-ghost-thumb']}`);
		const textNode = dragPreview.value.querySelector<HTMLElement>(`.${$style['drag-preview-ghost-text']}`);

		if (imgNode) imgNode.src = item.thumb;
		if (textNode) textNode.textContent = item.title;

		e.dataTransfer.setDragImage(dragPreview.value, 24, dragPreview.value.offsetHeight / 2);
	}
};
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';
@import (reference) '@anc/fantasy-design/src/utils/radius.less';

.gallery-container {
	width: 80%;
	display: flex;
	row-gap: 1rem;
	margin: 1rem auto;
	flex-direction: column;
}

.gallery-list {
	gap: 2rem;
	display: flex;
	flex-wrap: wrap;
	user-select: none;
	justify-content: center;

	/* 小屏幕 */
	@media (max-width: 768px) {
		gap: 1rem;
	}
}

.gallery-item {
	width: 90px;
	height: 90px;
	content-visibility: auto;
	contain-intrinsic-size: 90px;
	border: 2px solid @fantasy-avali;
	#utils > #radius > .nested(4px, 10px);
	transition:
		border-color 0.2s ease,
		transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

	&:focus-within {
		border-color: @fantasy8;
		transform: translateY(-4px);
		box-shadow:
			0 0 0 2px @fantasy0,
			0 0 0 4px @fantasy8;
	}

	&:hover {
		border-color: @fantasy8;
		transform: translateY(-6px);
	}

	&:active {
		border-color: @fantasy8;
		transform: translateY(0px);
		transition:
			transform 0.08s ease-out,
			border-color 0.08s ease-out;
	}

	a {
		text-decoration: none;

		figure {
			margin: 0;
			width: 100%;
			height: 100%;

			img {
				width: 100%;
				height: 100%;
				display: block;
				object-fit: cover;
			}
		}
	}
}

.drag-preview-ghost {
	left: 0;
	top: -500px;
	display: flex;
	position: fixed;
	color: @fantasy4;
	align-items: center;
	white-space: nowrap;
	pointer-events: none;
	padding: 0.5rem 1rem;
	border: 2px solid @fantasy8;
	background-color: @fantasy2;
	#utils > #radius > .smooth(16px);

	.drag-preview-ghost-text {
		font-weight: 600;
		font-size: 1.3rem;
	}

	.drag-preview-ghost-thumb {
		width: 50px;
		height: 50px;
		object-fit: cover;
		margin-inline: 2rem 1rem;
		#utils > #radius > .smooth(10px);
	}
}

.hover-tooltip {
	z-index: 100;
	color: @fantasy4;
	font-weight: 600;
	font-size: 1.1rem;
	white-space: nowrap;
	pointer-events: none;
	background: @fantasy2;
	padding: 0.4rem 0.8rem;
	animation-duration: 0.15s;
	border: 2px solid @fantasy8;
	#utils > #radius > .smooth(12px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	transform-origin: var(--reka-tooltip-content-transform-origin);

	/* 小屏幕 */
	@media (max-width: 768px) {
		display: none;
	}

	&[data-side='top'] {
		animation-name: slide-up;

		@keyframes slide-up {
			from {
				opacity: 0;
				transform: translateY(4px) scale(0.95);
			}
			to {
				opacity: 1;
				transform: translateY(0) scale(1);
			}
		}
	}
	&[data-side='bottom'] {
		animation-name: slide-down;

		@keyframes slide-down {
			from {
				opacity: 0;
				transform: translateY(-4px) scale(0.95);
			}
			to {
				opacity: 1;
				transform: translateY(0) scale(1);
			}
		}
	}
	&[data-side='left'] {
		animation-name: slide-left;

		@keyframes slide-left {
			from {
				opacity: 0;
				transform: translateX(4px) scale(0.95);
			}
			to {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}
	}
	&[data-side='right'] {
		animation-name: slide-right;

		@keyframes slide-right {
			from {
				opacity: 0;
				transform: translateX(-4px) scale(0.95);
			}
			to {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}
	}
}
</style>
