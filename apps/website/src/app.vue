<template>
	<AppHeader />
	<main :class="$style['main-container']">
		<NuxtPage />
	</main>
</template>

<script lang="ts" setup>
import AppHeader from './app/header/main.vue';

defineOptions({
	name: 'App',
});
</script>

<style lang="less">
#nexus_app {
	display: flex;
	min-block-size: 100dvh;
	flex-direction: column;
}
</style>

<style lang="less" module>
.main-container {
	flex: 1;
}
</style>
