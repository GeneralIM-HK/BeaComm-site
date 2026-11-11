import type { SiteLocale } from '../config/site';
import { localizeHref } from './i18n';

/**
 * 渲染站点配置中的行内标记文本，支持两种写法：
 * - `` `行内代码` `` → <code>
 * - [文字](链接)   → <a>（内部链接自动加语言前缀，外链新窗口打开）
 *
 * 先做 HTML 转义再替换标记，配置内容中的特殊字符不会被当作 HTML 执行。
 */
export function renderInline(text: string, locale: SiteLocale): string {
	const escaped = text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');

	const withCode = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

	return withCode.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) => {
		const external = /^(https?:)?\/\//.test(href);
		const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
		return `<a href="${localizeHref(href, locale)}"${attrs}>${label}</a>`;
	});
}
