<template>
	<footer :class="$style['footer-container']" role="contentinfo">
		<p>
			<span>🥰 来自·</span>
			<a href="https://github.com/SharpIceX/Argon-Nexus-Center" target="_blank" rel="noopener noreferrer">
				SharpIceX/Argon-Nexus-Center
			</a>
		</p>
		<div :class="$style.buildInfo">
			<p>
				<span>构建日期：</span>
				<time :datetime="runtimeConfig.public.buildTimestampISO">
					{{ runtimeConfig.public.buildTimestamp }}
				</time>
			</p>
			<p>
				<span>构建版本：</span>
				<code>{{ buildId.substring(0, 7) }}</code>
			</p>
		</div>
	</footer>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AppFooter' });

declare module 'nitro/types' {
	interface NitroRuntimeConfigApp {
		buildId: string;
	}
}

const runtimeConfig = useRuntimeConfig();

const buildId = runtimeConfig.app.buildId;
if (!buildId) {
	const error = createError({
		fatal: true,
		statusCode: 500,
		statusMessage: 'Configuration Error',
		message: '无法从 `runtimeConfig().app.buildId` 获取到 buildId！',
	});

	console.error(error);
	throw error;
}
</script>

<style lang="less" module>
@import (reference) '@anc/fantasy-design/src/color.less';

.footer-container {
	flex-shrink: 0;
	color: @fantasy5;
	text-align: center;
	padding-block: 1rem;
	border-top: 1px solid @fantasy2;

	a {
		text-decoration: none;
	}
}

.buildInfo {
	display: flex;
	column-gap: 1rem;
	justify-content: center;
}
</style>
