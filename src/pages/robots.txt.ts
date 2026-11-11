import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

/**
 * robots.txt：允许常规搜索引擎与 `siteConfig.ai.allowedBots` 中配置的 AI 爬虫，
 * 并声明 sitemap 地址。域名来自 src/config/site.ts 的 `seo.siteUrl`。
 */
export const GET: APIRoute = ({ site }) => {
	const origin = (site ?? new URL(siteConfig.seo.siteUrl)).href.replace(/\/$/, '');
	const lines: string[] = [
		'User-agent: *',
		'Allow: /',
		'',
	];

	for (const bot of siteConfig.ai.allowedBots) {
		lines.push(`User-agent: ${bot}`, 'Allow: /', '');
	}

	lines.push(`Sitemap: ${origin}/sitemap-index.xml`);

	return new Response(`${lines.join('\n')}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
