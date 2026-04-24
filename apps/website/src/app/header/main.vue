<template>
	<header :class="$style['header-container']">
		<ClientOnly>
			<AppHeaderWrapper />

			<template #fallback>
				<div :class="$style['loading-bar']" role="presentation" aria-hidden="true"></div>
			</template>
		</ClientOnly>
	</header>
</template>

<script lang="ts" setup>
import AppHeaderWrapper from './wrapper.vue';

defineOptions({
	name: 'AppHeader',
});
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';
@import (reference) '@anc/fantasy-design/src/utils/radius.less';

.header-container {
	height: 3.5rem;
	padding: 0.5rem;
	position: relative;
	margin-bottom: 0.5rem;
	border-bottom: 1px solid @fantasy3;

	/* 小屏幕 */
	@media (max-width: 768px) {
		height: 3rem;
	}
}

.loading-bar {
	left: 0;
	width: 100%;
	height: 1px;
	bottom: -1px;
	overflow: hidden;
	position: absolute;
	background-color: @fantasy2;

	&::after {
		width: 40%;
		content: '';
		height: 100%;
		position: absolute;
		background-color: @fantasy8;
		animation: slide 2s infinite ease-in-out;
		@keyframes slide {
			0% {
				left: -40%;
			}
			100% {
				left: 100%;
			}
		}
	}
}
</style>
