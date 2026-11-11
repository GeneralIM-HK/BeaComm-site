import type { APIRoute } from 'astro';
import config from 'virtual:starlight/user-config';
import { siteConfig } from '../config/site';
import { t } from '../lib/i18n';

/**
 * llms.txt（https://llmstxt.org/）：面向大模型爬虫的站点说明文件，
 * 内容由 src/config/site.ts 的 `siteConfig`（站点信息）与 `ai`（简介 / 链接分组）生成。
 * llms.txt 是单一文件（无语言目录），固定输出英文（面向爬虫的惯例）。
 */
export const GET: APIRoute = ({ site }) => {
	const origin = (site ?? new URL(siteConfig.seo.siteUrl)).href.replace(/\/$/, '');
	const lines: string[] = [
		`# ${t(siteConfig.seo.siteName, 'en')}`,
		'',
		`> ${siteConfig.ai.summary}`,
		'',
	];

	// 各语言首页
	lines.push('## Homepages', '');
	for (const [key, locale] of Object.entries(config.locales)) {
		const lang = locale?.lang ?? key;
		const label = locale?.label ?? lang;
		const path = key === 'root' ? '/' : `/${key}/`;
		lines.push(`- [${label}](${origin}${path}): Homepage in ${lang}`);
	}
	lines.push('');

	// 配置的内容分组
	for (const section of siteConfig.ai.sections) {
		lines.push(`## ${section.name}`, '');
		for (const link of section.links) {
			const url = link.href.startsWith('http') ? link.href : `${origin}${link.href}`;
			lines.push(`- [${link.label}](${url})${link.description ? `: ${link.description}` : ''}`);
		}
		lines.push('');
	}

	return new Response(`${lines.join('\n')}`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
