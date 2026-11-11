/**
 * IndexNow 主动推送（https://www.indexnow.org/）
 * ------------------------------------------
 * 把 dist/sitemap-0.xml 中的全部 URL（含 /llms.txt 与 /robots.txt）推送到
 * IndexNow 聚合端点（api.indexnow.org），由其分发到 Bing / ChatGPT 搜索 /
 * Copilot / Yandex / Seznam 等支持方，实现内容更新后的即时收录通知。
 *
 * 前提：站点已部署上线（脚本直接请求线上 URL 所在域名的真实文件）。
 * 所有权验证：public/{key}.txt 在部署后可通过 https://<host>/{key}.txt 访问。
 *
 * 使用：npm run build 部署上线后执行 `npm run submit:indexnow`（可重复执行，
 * 索引方按 URL 去重；仅推送上次提交后变更的 URL 才是推荐用法，重复推送会被限速）。
 */
import { readFile } from 'node:fs/promises';

const KEY = '2dc08c3d0d11cbcf8be48c374c6a80ce';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const sitemapXml = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');

// 从 sitemap 提取全部 URL；host 取自第一条 URL，保证与站点配置一致。
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) {
	console.error('sitemap-0.xml 中未提取到任何 URL，请先执行 npm run build 并部署。');
	process.exit(1);
}
const host = new URL(urls[0]).host;
const origin = new URL(urls[0]).origin;

// llms.txt 与 robots.txt 本身也一并推送，让索引方第一时间感知这两个协议文件。
const extraUrls = [`${origin}/llms.txt`, `${origin}/robots.txt`].filter((u) => !urls.includes(u));
const urlList = [...urls, ...extraUrls];

const response = await fetch(ENDPOINT, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json; charset=utf-8' },
	body: JSON.stringify({
		host,
		key: KEY,
		keyLocation: `${origin}/${KEY}.txt`,
		urlList,
	}),
});

console.log(`IndexNow push: ${response.status} ${response.statusText}`);
console.log(`host: ${host}, urls: ${urlList.length}`);
if (response.ok) {
	console.log('OK —— 已接受（200 已索引 / 202 已接收排队，两者均表示成功）。');
} else {
	const body = await response.text().catch(() => '');
	console.error(`失败：${response.status} ${body}`);
	console.error('常见原因：key 文件尚未部署上线（先 build + deploy 再推送）；403 为 key 校验失败；422 为 URL 不属于该 host；429 为推送过于频繁。');
	process.exit(1);
}
