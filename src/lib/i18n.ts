import type { LocalizedText, SiteLocale } from '../config/site';
import { localeDefs } from '../config/site';

const SITE_LOCALES = Object.keys(localeDefs) as SiteLocale[];
const ROOT_LOCALE: SiteLocale =
	SITE_LOCALES.find((locale) => localeDefs[locale].root) ?? SITE_LOCALES[0];

/** Starlight 的 locale 目录名（`undefined` 表示根语言英文）→ 站点配置使用的 locale 键。 */
export function resolveSiteLocale(starlightLocale: string | undefined): SiteLocale {
	if (starlightLocale && (SITE_LOCALES as string[]).includes(starlightLocale)) {
		return starlightLocale as SiteLocale;
	}
	return ROOT_LOCALE;
}

/**
 * 读取一段多语言文案：按 `localeDefs` 的 fallback 链回退（如 zh-hk → zh-cn → en）。
 * 返回空串表示所有语言均未提供该文案。
 */
export function t(text: LocalizedText | undefined, locale: SiteLocale): string {
	if (!text) return '';
	let current: SiteLocale | undefined = locale;
	for (let depth = 0; current && depth < SITE_LOCALES.length; depth++) {
		const value = text[current];
		if (value !== undefined) return value;
		current = localeDefs[current].fallback as SiteLocale | undefined;
	}
	return '';
}

/**
 * 按浏览器语言偏好列表（navigator.languages）匹配站点语言。
 * 匹配规则：每个标签转小写后沿继承链逐级查找 `localeDefs` 的 browserTags
 * （如 zh-hant-tw → zh-hant → zh），按用户偏好顺序取第一个命中项。
 * 无匹配返回 null，调用方应回退到默认语言（英文）。
 */
export function matchBrowserLocale(languages: readonly string[]): SiteLocale | null {
	for (const rawTag of languages) {
		const parts = rawTag.toLowerCase().split('-');
		while (parts.length > 0) {
			const tag = parts.join('-');
			const hit = SITE_LOCALES.find((locale) => localeDefs[locale].browserTags.includes(tag));
			if (hit) return hit;
			parts.pop();
		}
	}
	return null;
}

/** 同 `t`，但允许直接传固定字符串（如跨语言相同的锚点 id）。 */
export function tText(value: string | LocalizedText | undefined, locale: SiteLocale): string {
	return typeof value === 'string' ? value : t(value, locale);
}

/** 内部链接（以 `/` 开头）自动加上当前语言前缀；外链与锚点原样返回。 */
export function localizeHref(href: string, locale: SiteLocale): string {
	if (!href.startsWith('/')) return href;
	const prefix = locale === ROOT_LOCALE ? '' : `/${locale}`;
	return `${prefix}${href}`;
}

/** 判断链接是否指向站外，用于决定是否新窗口打开。 */
export function isExternalHref(href: string): boolean {
	return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');
}

/** copyright 模板中的 {year} 替换。 */
export function fillCopyright(template: string): string {
	return template.replaceAll('{year}', String(new Date().getFullYear()));
}
