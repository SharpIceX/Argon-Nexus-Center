<template>
	<RekaPopoverRoot v-model:open="isOpen">
		<RekaPopoverTrigger as-child>
			<button :class="$style['menu-trigger']" aria-label="打开菜单">
				<barsIcon />
			</button>
		</RekaPopoverTrigger>

		<RekaPopoverPortal>
			<RekaPopoverContent :class="$style['popover-content']" :side-offset="8" align="end">
				<nav :class="$style['nav-list']">
					<NuxtLink
						v-for="item in config"
						:key="item.path"
						:to="item.path"
						:class="$style['nav-link']"
						active-class="is-active"
						@click="isOpen = false">
						<component :is="item.icon" aria-hidden="true" :class="$style.icon" />
						<span>{{ item.label }}</span>
					</NuxtLink>
				</nav>
			</RekaPopoverContent>
		</RekaPopoverPortal>
	</RekaPopoverRoot>
</template>

<script lang="ts" setup>
import config from './config';
import barsIcon from '@fortawesome/fontawesome-free/svgs/solid/bars.svg?component';

defineOptions({
	name: 'AppHeaderMobile',
});

const isOpen = ref(false);
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';
@import (reference) '@anc/fantasy-design/src/utils/radius.less';

.menu-trigger {
	display: flex;
	padding: 0.5rem;
	cursor: pointer;
	font-size: 1.25rem;
	#utils > #radius > .smooth(8px);
	transition:
		background-color 0.25s ease,
		color 0.25s ease;
}

.popover-content {
	outline: none;
	padding: 0.5rem;
	min-width: 180px;
	backdrop-filter: blur(12px);
	border: 1px solid @fantasy3;
	#utils > #radius > .smooth(12px);
	box-shadow: 0 10px 30px oklch(0 0 0 / 0.5);
	background-color: oklch(from @fantasy1 l c h / 0.8);
	transform-origin: var(--reka-popover-content-transform-origin);

	&[data-state='open'] {
		animation: slide-in 0.2s ease-out;
		@keyframes slide-in {
			from {
				opacity: 0;
				transform: scale(0.95) translateY(-4px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
		}
	}

	&[data-state='closed'] {
		animation: slide-out 0.2s ease-in;
		@keyframes slide-out {
			from {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
			to {
				opacity: 0;
				transform: scale(0.95) translateY(-4px);
			}
		}
	}
}

.nav-list {
	gap: 0.25rem;
	display: flex;
	flex-direction: column;
}

.nav-link {
	gap: 0.75rem;
	display: flex;
	color: @fantasy5;
	font-size: 0.95rem;
	align-items: center;
	border-bottom: none;
	padding: 0.75rem 1rem;
	#utils > #radius > .smooth(8px);
	transition:
		background-color 0.2s ease,
		color 0.2s ease,
		padding-left 0.2s ease;

	.icon {
		width: 1rem;
		height: 1rem;
		color: @fantasy6;
		transition: color 0.2s ease;
	}

	&:global(.is-active) {
		color: @fantasy8;
		font-weight: 500;
		background-color: oklch(from @fantasy8 l c h / 0.1);

		.icon {
			color: @fantasy8;
		}
	}
}
</style>
