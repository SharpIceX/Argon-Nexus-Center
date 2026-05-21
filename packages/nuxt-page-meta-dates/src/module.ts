import os from 'node:os';
import simpleGit from 'simple-git';
import { defineNuxtModule } from '@nuxt/kit';

interface RouteMetaTime {
	/** 页面源代码文件创建时间（ISO 8601格式，UTC+8） */
	createdAt?: string;

	/** 页面源代码文件修改时间（ISO 8601格式，UTC+8） */
	updatedAt?: string;
}

declare module 'vue-router' {
	interface RouteMeta extends RouteMetaTime {}
}

const utc8Formatter = new Intl.DateTimeFormat('sv-SE', {
	timeZone: 'Asia/Shanghai',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false,
});

/** 将任意时区的时间字符串转换为 UTC+8 ISO 8601 */
function formatToUTC8(dateStr: string): string {
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return dateStr;

	const formatted = utc8Formatter.format(date);

	return `${formatted.replace(' ', 'T')}+08:00`;
}

const git = simpleGit({
	baseDir: import.meta.dirname,
	maxConcurrentProcesses: Math.max(2, os.cpus().length * 1.5),
});

async function getRouteMetaTime(filePath: string): Promise<RouteMetaTime> {
	const result: RouteMetaTime = {};

	// 获取文件的所有提交
	const logLines = await git.raw(['log', '--follow', '--format=%cI', '--', filePath]);
	const dates = logLines.trim().split('\n').filter(Boolean);

	if (dates.length > 0) {
		result.updatedAt = formatToUTC8(dates[0]!);
		result.createdAt = formatToUTC8(dates[dates.length - 1]!);
	}

	return result;
}

export default defineNuxtModule({
	meta: {
		name: '@anc/nuxt-page-meta-dates',
	},
	setup(_options, nuxt) {
		nuxt.hook('pages:resolved', async (pages) => {
			await Promise.all(
				pages.map(async (page) => {
					if (page.file === undefined) {
						return;
					}

					const time = await getRouteMetaTime(page.file);

					page.meta = {
						...page.meta,
						...time,
					};
				}),
			);
		});
	},
});

export type { RouteMetaTime };
