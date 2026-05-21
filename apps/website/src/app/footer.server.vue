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
				<time :datetime="runtimeConfig.public.buildTimestamp">
					{{ formatDateTime(runtimeConfig.public.buildTimestamp) }}
				</time>
			</p>
			<p>
				<span>构建版本：</span>
				<code>{{ runtimeConfig.app.buildId.substring(0, 7) }}</code>
			</p>
		</div>
	</footer>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AppFooter' });

const runtimeConfig = useRuntimeConfig();

declare module 'nitro/types' {
	interface NitroRuntimeConfigApp {
		buildId: string;
	}
}

function formatDateTime(isoString: string): string {
	const date = new Date(isoString);
	if (Number.isNaN(date.getTime())) return isoString;

	return new Intl.DateTimeFormat('zh-CN', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})
		.format(date)
		.replace(/\//g, '-');
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
