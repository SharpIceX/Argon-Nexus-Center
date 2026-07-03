<template>
	<div :class="$style['canvas-viewport']" @wheel.prevent="handleWheel" @pointerdown="handlePointerDown">
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

	const ratio = newScale / scale.value;
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
	const mouseX = e.clientX - rect.left - rect.width / 2;
	const mouseY = e.clientY - rect.top - rect.height / 2;

	translateX.value = mouseX - (mouseX - translateX.value) * ratio;
	translateY.value = mouseY - (mouseY - translateY.value) * ratio;

	scale.value = newScale;
};

let nextTranslateX = 0;
let nextTranslateY = 0;
let pointerStartOffsetX = 0;
let pointerStartOffsetY = 0;
let rafId: number | null = null;

// 移动端多点触控缓存
const activePointers: PointerEvent[] = [];
let initialTouchDistance = 0;
let initialTouchScale = 0;

// 计算两点间距离
const getDistance = (p1: PointerEvent, p2: PointerEvent) => {
	const dx = p1.clientX - p2.clientX;
	const dy = p1.clientY - p2.clientY;
	return Math.sqrt(dx * dx + dy * dy);
};

const handlePointerMove = (e: PointerEvent) => {
	const index = activePointers.findIndex((p) => p.pointerId === e.pointerId);
	if (index !== -1) activePointers[index] = e;

	// 双指缩放逻辑
	if (activePointers.length === 2) {
		isDragging.value = false;
		const currentDistance = getDistance(activePointers[0]!, activePointers[1]!);
		if (initialTouchDistance > 0) {
			const zoomFactor = currentDistance / initialTouchDistance;
			const newScale = initialTouchScale * zoomFactor;
			scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
		}
		return;
	}

	// 单指/鼠标拖拽逻辑
	if (!isDragging.value) return;

	nextTranslateX = e.clientX - pointerStartOffsetX;
	nextTranslateY = e.clientY - pointerStartOffsetY;

	// 避免高频触发导致丢帧
	if (rafId === null) {
		rafId = requestAnimationFrame(() => {
			translateX.value = nextTranslateX;
			translateY.value = nextTranslateY;
			rafId = null;
		});
	}
};

const handlePointerUp = (e: PointerEvent) => {
	const index = activePointers.findIndex((p) => p.pointerId === e.pointerId);
	if (index !== -1) activePointers.splice(index, 1);

	if (activePointers.length < 2) {
		initialTouchDistance = 0;
	}

	if (activePointers.length === 0) {
		isDragging.value = false;
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
		window.removeEventListener('pointercancel', handlePointerUp);
	}
};

const handlePointerDown = (e: PointerEvent) => {
	if (e.pointerType === 'mouse' && e.button !== 0) return;

	activePointers.push(e);

	if (activePointers.length === 2) {
		isDragging.value = false;
		initialTouchDistance = getDistance(activePointers[0]!, activePointers[1]!);
		initialTouchScale = scale.value;
	} else if (activePointers.length === 1) {
		isDragging.value = true;
		pointerStartOffsetX = e.clientX - translateX.value;
		pointerStartOffsetY = e.clientY - translateY.value;
	}

	window.addEventListener('pointerup', handlePointerUp);
	window.addEventListener('pointermove', handlePointerMove);
	window.addEventListener('pointercancel', handlePointerUp);
};

const handleVisibilityChange = () => {
	if (document.visibilityState === 'hidden') {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
		isDragging.value = false;
		activePointers.length = 0;
		initialTouchDistance = 0;
		window.removeEventListener('pointerup', handlePointerUp);
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointercancel', handlePointerUp);
	}
};

onMounted(() => {
	document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
	if (rafId !== null) cancelAnimationFrame(rafId);
	window.removeEventListener('pointerup', handlePointerUp);
	window.removeEventListener('pointermove', handlePointerMove);
	window.removeEventListener('pointercancel', handlePointerUp);
	document.removeEventListener('visibilitychange', handleVisibilityChange);
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
