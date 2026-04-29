<template>
	<AppCursor />
	<AppHeader />
	<main :class="$style['main-container']">
		<NuxtPage />
	</main>
	<AppFooter />
</template>

<script lang="ts" setup>
import AppCursor from './app/cursor.vue';
import AppHeader from './app/header/main.vue';
import AppFooter from './app/footer.server.vue';

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
	flex: 1 0 auto;
}
</style>
