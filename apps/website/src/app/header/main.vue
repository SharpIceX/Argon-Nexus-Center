<template>
	<header :class="$style['header-container']">
		<AppHeaderMobile />
		<AppHeaderDesktop />
	</header>
</template>

<script lang="ts" setup>
import AppHeaderMobile from './mobile.vue';
import AppHeaderDesktop from './desktop.vue';

defineOptions({
	name: 'AppHeader',
});
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';
@import (reference) '@anc/fantasy-design/src/utils/radius.less';

.header-container {
	flex-shrink: 0;
	height: 3.5rem;
	padding: 0.5rem;
	user-select: none;
	position: relative;
	margin-bottom: 0.5rem;
	border-bottom: 1px solid @fantasy3;

	/* 小屏幕 */
	@media (max-width: 768px) {
		height: 3rem;
	}
}
</style>
