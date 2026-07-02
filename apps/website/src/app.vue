<template>
	<AppCursor />
	<AppHeader />
	<main :class="$style['main-container']">
		<NuxtLayout>
			<NuxtPage :transition="{ name: 'page-fade', mode: 'out-in' }" />
		</NuxtLayout>
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

defineOg({
	type: 'website',
	imageTemplate: 'default',
});

// TODO: 添加检查是否 JPEG XL，不支持就弹窗，要包裹在 ClientOnly运行
</script>

<style lang="less">
#nexus_app {
	display: flex;
	min-block-size: 100dvh;
	flex-direction: column;
}

.page-fade-enter-active,
.page-fade-leave-active {
	transition:
		opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1),
		transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.page-fade-enter-from {
	opacity: 0;
	transform: translateY(5px);
}

.page-fade-leave-to {
	opacity: 0;
	transform: translateY(0);
}
</style>

<style lang="less" module>
.main-container {
	flex: 1 0 auto;

	/** 消除 Nuxt Island 的代理包装层干扰  */
	& > div:not([class]) {
		display: contents;
	}
}
</style>
