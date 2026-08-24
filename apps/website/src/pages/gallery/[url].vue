<template>
	<ImageLightbox
		v-if="currentItem"
		:url="currentItem.image"
		:title="currentItem.title"
		:description="currentItem.description"
		@close="onLightboxClose" />
</template>

<script lang="ts" setup>
import { galleryList } from '~/data/gallery/main';
import ImageLightbox from '~/components/ImageLightbox/index.vue';

/**
 * TODO: 「外面的缩略图」和「灯箱内图片」都需要改成手动懒加载
 * 需要处理：加载中、加载完成、加载错误、解码错误、加载超时间（灯箱内的，需要获取文件大小来动态设定，并且要有提示）
 */

definePageMeta({
	key: 'gallery-page',
});

const route = useRoute();
const router = useRouter();

const currentItem = computed(() => {
	const paramsUrl = route.params.url;
	if (!paramsUrl) {
		return;
	}

	return galleryList.find((item) => item.urlName === paramsUrl);
});

if (!currentItem.value) {
	throw showError({
		fatal: true,
		status: 404,
	});
}

useSeoMeta({
	title: `艺术图库 / ${currentItem.value.title}`,
});

// 灯箱
const onLightboxClose = () => {
	router.push('/gallery');
};
</script>
