<template>
	<RekaDialogRoot :open="true" @update:open="emit('close')">
		<RekaDialogPortal>
			<RekaDialogOverlay :class="$style['lightbox-overlay']" />

			<!-- 上工具栏和标题 -->
			<RekaDialogContent :class="$style['lightbox-content']" @interact-outside.prevent>
				<header :class="$style['lightbox-content-header']">
					<RekaDialogClose as-child>
						<button title="关闭预览">
							<CircleXIcon />
						</button>
					</RekaDialogClose>

					<RekaDialogTitle v-if="props.title" :class="$style['lightbox-title']">
						{{ props.title }}
					</RekaDialogTitle>

					<div :class="$style['lightbox-function-wrapper']">
						<button title="重置视图" @click="resetTransforms">
							<ResetIcon />
						</button>
						<button :title="isFullscreen ? '退出全屏' : '进入全屏'" @click="toggleDocumentFullscreen">
							<FullscreenIcon />
						</button>
					</div>
				</header>

				<!-- 下工具栏和描述 -->
				<footer :class="$style['lightbox-content-footer']">
					<RekaDialogDescription :class="$style['lightbox-description']">
						{{ props.description }}
					</RekaDialogDescription>

					<div :class="$style['lightbox-function-wrapper']">
						<button title="向左旋转" @click="rotation -= 90">
							<RotateLeftIcon />
						</button>

						<button title="向右旋转" @click="rotation += 90">
							<RotateRightIcon />
						</button>

						<button :class="$style['download-button']" @click="handleDownload">下载</button>

						<button title="左右翻转" @click="flipH = !flipH">
							<FlipHorizontalIcon />
						</button>

						<button title="上下翻转" @click="flipV = !flipV">
							<FlipVerticalIcon />
						</button>
					</div>
				</footer>

				<!-- 图片本体 -->
				<div :class="$style['lightbox-canvas']">
					<ImageLightboxCanvas :url="props.url" :rotate="rotation" :flip-h="flipH" :flip-v="flipV" />
				</div>
			</RekaDialogContent>
		</RekaDialogPortal>
	</RekaDialogRoot>
</template>

<script lang="ts" setup>
import ImageLightboxCanvas from './Canvas.vue';
import {
	CircleX as CircleXIcon,
	RefreshCcwDot as ResetIcon,
	RotateCcw as RotateLeftIcon,
	RotateCw as RotateRightIcon,
	Fullscreen as FullscreenIcon,
	FlipVertical as FlipVerticalIcon,
	FlipHorizontal as FlipHorizontalIcon,
} from '@lucide/vue';

// TODO: 下载按钮应该是可选的才对

defineOptions({
	name: 'ImageLightbox',
});

const props = defineProps<{
	url: string;
	title?: string | undefined;
	description?: string | undefined;
}>();

const emit = defineEmits<{
	(e: 'close'): void;
}>();

const rotation = ref(0);
const flipH = ref(false);
const flipV = ref(false);
const isFullscreen = ref(false);

/** 重置所有空间变换 */
function resetTransforms() {
	rotation.value = 0;
	flipH.value = false;
	flipV.value = false;
}

/** 切换到全屏 */
async function toggleDocumentFullscreen() {
	try {
		if (!document.fullscreenElement) {
			await document.documentElement.requestFullscreen();
		} else {
			await document.exitFullscreen();
		}
	} catch (err) {
		console.error('全屏切换失败:', err);
	}
}

/** 监听全屏状态变化 */
function handleFullscreenChange() {
	isFullscreen.value = !!document.fullscreenElement;
}

/** 下载图片  */
function handleDownload() {
	/** TODO: 下载暂时没实现，只能通过新标签页打开图片 */
	window.open(props.url, '_blank');
}

onMounted(() => {
	document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
	document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';
@import (reference) '@anc/fantasy-design/src/utils/radius.less';

.lightbox-overlay {
	inset: 0;
	z-index: 200;
	position: fixed;
	background-color: oklch(from @fantasy0 l c h / 0.85);
}

.lightbox-content {
	inset: 0;
	z-index: 201;
	display: flex;
	position: fixed;
	pointer-events: none;
	flex-direction: column;
	justify-content: space-between;

	header,
	footer {
		pointer-events: auto;
	}

	svg {
		width: 1.5rem;
		height: 1.5rem;
		color: @fantasy7;
		transition:
			color 0.2s ease,
			transform 0.1s ease;

		&:hover {
			color: @fantasy8;
		}

		&:active {
			color: @fantasy11;
			transform: scale(0.95);
		}
	}

	button {
		outline: none;
		user-select: none;
	}

	.lightbox-content-header {
		display: flex;
		margin: 1rem;
		justify-content: space-between;

		.lightbox-title {
			width: 50%;
			overflow-x: auto;
			text-align: center;
			white-space: nowrap;

			/* 小屏幕 */
			@media (max-width: 768px) {
				font-size: 1.2em;
			}
		}
	}

	.lightbox-content-footer {
		height: 20%;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.lightbox-description {
			width: 80%;
			overflow-y: auto;
			margin: 1rem auto;
			text-align: center;
		}

		.download-button {
			padding: 0.5rem;
			font-size: 1.5rem;
			align-items: center;
			display: inline-flex;
			justify-content: center;
			backdrop-filter: blur(8px);
			#utils > #radius > .smooth(12px);
			border: 1px solid oklch(from @fantasy8 l c h / 0.15);
			background-color: oklch(from @fantasy1 l c h / 0.4);
			transition:
				border-color 0.25s ease,
				background-color 0.25s ease,
				transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);

			&:hover {
				color: inherit;
				transform: translateY(-2px) scale(1.05);
				border-color: oklch(from @fantasy8 l c h / 0.4);
				background-color: oklch(from @fantasy1 l c h / 0.6);
			}

			&:active {
				color: inherit;
				transform: translateY(0) scale(0.95);
				border-color: oklch(from @fantasy8 l c h / 0.2);
				background-color: oklch(from @fantasy1 l c h / 0.7);
			}
		}
	}

	.lightbox-canvas {
		inset: 0;
		z-index: -1;
		width: 100vw;
		height: 100vh;
		position: fixed;
		pointer-events: auto;
	}
}

.lightbox-function-wrapper {
	display: flex;
	column-gap: 1.5rem;
	justify-content: center;
}
</style>
