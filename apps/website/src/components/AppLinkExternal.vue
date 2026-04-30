<template>
	<a :href="props.to" target="_blank" rel="noopener noreferrer" v-bind="$attrs">
		<slot />
	</a>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'AppLinkExternal',
});

const props = defineProps<{
	to: string;
}>();
</script>
