<template>
	<div>
		<p>{{ prop.title }}</p>
	</div>
</template>

<script setup lang="ts">
const prop = defineProps<{
	title?: string;
}>();
</script>
