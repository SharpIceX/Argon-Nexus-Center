<template>
	<footer :class="$style['footer-container']" role="contentinfo">
		<p>
			<span>🥰 来自·</span>
			<a href="https://github.com/SharpIceX/Argon-Nexus-Center" target="_blank" rel="noopener noreferrer">
				SharpIceX/Argon-Nexus-Center
			</a>
		</p>
		<div :class="$style.buildInfo">
			<div :class="$style['buildRow']">
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

			<div :class="$style['buildRow']">
				<p v-if="nuxtApp.versions['nuxt']">
					<span>Nuxt 版本：</span>
					<code>{{ nuxtApp.versions['nuxt'] }}</code>
				</p>
				<p v-if="nuxtApp.versions['vue']">
					<span>Vue 版本：</span>
					<code>{{ nuxtApp.versions['vue'] }}</code>
				</p>
			</div>
		</div>
	</footer>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AppFooter' });

const nuxtApp = useNuxtApp();
const runtimeConfig = useRuntimeConfig();

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
	flex-direction: column;

	.buildRow {
		display: flex;
		column-gap: 1rem;
		justify-content: center;
	}
}
</style>
