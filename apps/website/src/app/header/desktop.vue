<template>
	<RekaNavigationMenuRoot :class="$style['nav-root']">
		<RekaNavigationMenuList :class="$style['nav-list']">
			<RekaNavigationMenuItem v-for="item in config" :key="item.label">
				<RekaNavigationMenuLink as-child>
					<NuxtLink :class="$style['nav-link']" active-class="is-active" :to="item.path">
						<component :is="item.icon" aria-hidden="true" />
						<span>{{ item.label }}</span>
					</NuxtLink>
				</RekaNavigationMenuLink>
			</RekaNavigationMenuItem>
		</RekaNavigationMenuList>
	</RekaNavigationMenuRoot>
</template>

<script lang="ts" setup>
import config from './config';

defineOptions({
	name: 'AppHeaderDesktop',
});
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';
@import (reference) '@anc/fantasy-design/src/utils/radius.less';

.nav-root {
	height: 100%;

	& > div {
		height: 100%;
	}
}

.nav-list {
	height: 100%;
	display: flex;
	column-gap: 1.5rem;
}

.nav-link {
	height: 100%;
	border: none;
	cursor: pointer;
	column-gap: 0.5rem;
	align-items: center;
	display: inline-flex;
	text-decoration: none;
	padding: 0 calc(1lh * 0.5);
	#utils > #radius > .smooth(9px);
	transition:
		background-color 0.2s ease,
		color 0.2s ease;

	&:not(:hover):not(:active):not(:global(.is-active)) {
		color: @fantasy5;
	}

	&:hover {
		background-color: oklab(from @fantasy10 l a b / 0.2);
	}

	&:global(.is-active) {
		font-weight: 600;
		color: color-mix(in oklch, @fantasy8, @fantasy18);
	}
}
</style>
