<template>
	<div :class="$style['canvas-viewport']" @wheel.prevent="handleWheel" @mousedown="handleMouseDown">
		<div :class="$style['canvas-container']">
			<img
				alt=""
				:src="props.url"
				draggable="false"
				:class="$style['canvas-img']"
				:style="{
					transform: `rotate(${props.rotate}deg) scaleX(${props.flipH ? -1 : 1}) scaleY(${props.flipV ? -1 : 1})`,
				}" />
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'ImageLightboxCanvas',
});

const props = defineProps<{
	url: string;
	rotate: number;
	flipH: boolean;
	flipV: boolean;
}>();

const MIN_SCALE = 0.15;
const MAX_SCALE = 10.0;
const ZOOM_SPEED = 0.12;

const scale = ref(0.7);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);

const transformString = computed(
	() => `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value})`,
);
const cursorStyle = computed(() => (isDragging.value ? 'grabbing' : 'grab'));

// 缩放逻辑
const handleWheel = (e: WheelEvent) => {
	e.preventDefault();

	const zoomFactor = e.deltaY < 0 ? 1 + ZOOM_SPEED : 1 - ZOOM_SPEED;
	const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value * zoomFactor));

	// 计算缩放比例变化
	const ratio = newScale / scale.value;
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
	const mouseX = e.clientX - rect.left - rect.width / 2;
	const mouseY = e.clientY - rect.top - rect.height / 2;

	translateX.value = mouseX - (mouseX - translateX.value) * ratio;
	translateY.value = mouseY - (mouseY - translateY.value) * ratio;

	scale.value = newScale;
};

// 拖拽逻辑
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let rafId: number | null = null;

const handleMouseMove = (e: MouseEvent) => {
	if (!isDragging.value) return;

	currentX = e.clientX - startX;
	currentY = e.clientY - startY;

	// 避免高频触发 mousemove 导致视图渲染丢帧
	if (rafId === null) {
		rafId = requestAnimationFrame(() => {
			translateX.value = currentX;
			translateY.value = currentY;
			rafId = null;
		});
	}
};

const handleMouseUp = () => {
	isDragging.value = false;
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}
	window.removeEventListener('mousemove', handleMouseMove);
	window.removeEventListener('mouseup', handleMouseUp);
};

const handleMouseDown = (e: MouseEvent) => {
	if (e.button !== 0) return; // 仅响应鼠标左键

	isDragging.value = true;
	startX = e.clientX - translateX.value;
	startY = e.clientY - translateY.value;

	window.addEventListener('mousemove', handleMouseMove);
	window.addEventListener('mouseup', handleMouseUp);
};

onUnmounted(() => {
	if (rafId !== null) cancelAnimationFrame(rafId);
	window.removeEventListener('mousemove', handleMouseMove);
	window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';
@import (reference) '@anc/fantasy-design/src/utils/radius.less';

.canvas-viewport {
	width: 100%;
	height: 100%;
	display: flex;
	overflow: hidden;
	touch-action: none;
	align-items: center;
	justify-content: center;
}

.canvas-container {
	align-items: center;
	display: inline-flex;
	will-change: transform;
	justify-content: center;
	cursor: v-bind(cursorStyle);
	transform: v-bind(transformString);
}

.canvas-img {
	max-width: 100%;
	max-height: 100%;
	user-select: none;
	object-fit: contain;
	will-change: transform;
	-webkit-user-drag: none;
	transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
