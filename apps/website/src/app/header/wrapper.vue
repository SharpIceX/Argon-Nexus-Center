<template>
	<AppHeaderDesktop v-if="isDesktop" />
	<AppHeaderMobile v-else />
</template>

<script lang="ts" setup>
defineOptions({
	name: 'AppHeaderWrapper',
});

const { isDesktop } = useDevice();
const AppHeaderMobile = defineAsyncComponent(() => import('./mobile.vue'));
const AppHeaderDesktop = defineAsyncComponent(() => import('./desktop.vue'));
</script>
