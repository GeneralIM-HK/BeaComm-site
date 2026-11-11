import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// Starlight 界面文案翻译集合：src/content/i18n/<lang>.json（如 zh-HK.json），
	// 可覆盖内置 UI 文案；zh-HK 未提供内置翻译，因此这里维护了一份完整译文。
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
