<template>
	<footer :class="$style['footer-container']" role="contentinfo">
		<p>
			<span>🥰 来自·</span>
			<a href="https://github.com/SharpIceX/Argon-Nexus-Center" target="_blank" rel="noopener noreferrer">
				SharpIceX/Argon-Nexus-Center
			</a>
		</p>
	</footer>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AppFooter' });
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';

.footer-container {
	flex-shrink: 0;
	color: @fantasy5;
	user-select: none;
	text-align: center;
	padding-block: 1rem;
	border-top: 1px solid @fantasy2;

	a {
		text-decoration: none;
	}
}
</style>
