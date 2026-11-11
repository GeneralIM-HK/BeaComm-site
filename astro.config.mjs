// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import { siteConfig, localeDefs } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
	// 站点域名在 src/config/site.ts 的 `seo.siteUrl` 中配置，
	// 用于 canonical / sitemap / Open Graph 等所有 SEO 信息。
	site: siteConfig.seo.siteUrl,
	integrations: [
		// 显式接管 sitemap 生成（Starlight 检测到已有 sitemap 集成时跳过内置版本）：
		// 复刻 Starlight 内置的多语言 i18n 配置（sitemap 内输出 hreflang 交替链接），
		// 并补充 lastmod（本次构建时间），便于 Google / Bing 判断内容新鲜度。
		// robots.txt 已声明 Sitemap 地址，提交入口：Google Search Console 与 Bing 站长工具。
		sitemap({
			i18n: {
				defaultLocale: 'root',
				locales: Object.fromEntries(
					Object.entries(localeDefs).map(([key, def]) => [def.root ? 'root' : key, def.lang]),
				),
			},
			lastmod: new Date(),
		}),
		starlight({
			
			// 站点标题：显示在顶部导航栏，并作为各页 <title> 的尾缀。
			// Beta 标识由各页面 frontmatter 的 title（纯文本）与 hero.title（<sup> 上标）分别承担。
			title: 'BeaComm (Beta)',
			description: 'One line of code to start your own chat server',
			
			// Logo shown next to the site title in the header. Replace this file to change it.
			logo: { src: './src/assets/logo.svg', alt: 'BeaComm logo' },
			
			social: [
				// { icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' },
				// { icon: 'x.com', label: 'GitHub', href: 'https://github.com/withastro/starlight' },
				{ icon: 'email', label: 'Email', href: 'mailto:support@beacomm.chat' },
				{ icon: 'comment', label: 'Livechat', href: 'https://tawk.to/chat/6ade0c6da136913473132020/1k5pm13v5?layout=modern' }
			],
			// Multilingual: 站点语言由 src/config/site.ts 的 `localeDefs` 统一定义
			// （含语言切换器名称、文案回退链与浏览器语言自动适配映射），此处自动生成：
			// root 语言为 URL 不带前缀的默认语言（英文），其余语言按 locale 键建目录。
			locales: Object.fromEntries(
				Object.entries(localeDefs).map(([key, def]) => [
					def.root ? 'root' : key,
					{ label: def.label, lang: def.lang },
				]),
			),
			defaultLocale: 'root',

			sidebar: [
				{
					label: 'Intro',
					translations: { 'zh-CN': '快速开始', 'zh-HK': '介紹', 'zh-TW': '介紹' },
					items: [{ autogenerate: { directory: 'intro' } }],
				},
				{
					label: 'Guides',
					translations: { 'zh-CN': '指南', 'zh-HK': '指南', 'zh-TW': '指南' },
					items: [
						// Each item here is one entry in the navigation menu.
						// label 为默认（英文）文案，translations 按各语言 lang 码提供对应标签；
						// Reference 组使用 autogenerate，自动采用各语言页面的 frontmatter title。
						{
							label: 'Apply a License',
							slug: 'guides/apply-license',
							translations: { 'zh-CN': '应用 License', 'zh-HK': '套用 License', 'zh-TW': '套用 License' },
						},
						{
							label: 'Configure a Domain',
							slug: 'guides/config-domain',
							translations: { 'zh-CN': '配置域名', 'zh-HK': '設定網域', 'zh-TW': '設定網域' },
						},
						{
							label: 'Configure Email Delivery',
							slug: 'guides/config-email',
							translations: { 'zh-CN': '配置邮件服务', 'zh-HK': '設定電郵服務', 'zh-TW': '設定郵件服務' },
						},
						{
							label: 'Enable HTTPS',
							slug: 'guides/config-https',
							translations: { 'zh-CN': '配置 HTTPS', 'zh-HK': '設定 HTTPS', 'zh-TW': '設定 HTTPS' },
						},
					],
				},
				{
					label: 'Reference',
					translations: { 'zh-CN': '参考', 'zh-HK': '參考', 'zh-TW': '參考' },
					items: [{ autogenerate: { directory: 'reference' } }],
				},
				{
					label: 'Legal & Terms',
					translations: { 'zh-CN': '法务与条款', 'zh-HK': '法律與條款', 'zh-TW': '法務與條款' },
					// items: [{ autogenerate: { directory: 'legal' } }],
					items: [
						// Each item here is one entry in the navigation menu.
						// label 为默认（英文）文案，translations 按各语言 lang 码提供对应标签；
						// Reference 组使用 autogenerate，自动采用各语言页面的 frontmatter title。
						{
							label: 'Customer Terms of Service',
							slug: 'legal/customer-terms-of-service',
							translations: { 'zh-CN': '客户服务条款', 'zh-HK': '客戶服務條款', 'zh-TW': '客戶服務條款' },
						},
						{
							label: 'Terms of Use (EULA)',
							slug: 'legal/terms-of-use',
							translations: { 'zh-CN': '用户使用条款(EULA)', 'zh-HK': '用戶使用條款(EULA)', 'zh-TW': '使用者條款(EULA)' },
						},
						{
							label: 'Privacy Policy',
							slug: 'legal/privacy-policy',
							translations: { 'zh-CN': '隐私政策', 'zh-HK': '私隱政策', 'zh-TW': '隱私政策' },
						},
						{
							label: 'Guidelines for Law Enforcement',
							slug: 'legal/guidelines-for-law-enforcement',
							translations: { 'zh-CN': '执法部门指引', 'zh-HK': '執法部門指引', 'zh-TW': '執法部門指引' },
						},
					],
				}
			],
			
			// Custom UI component overrides.
			components: {
				Head: './src/overrides/Head.astro',
				Header: './src/overrides/Header.astro',
				Footer: './src/overrides/Footer.astro',
				// 社交图标覆盖：social 外链以新窗口打开（target="_blank"）。
				SocialIcons: './src/overrides/SocialIcons.astro',
			},
		}),
	],
});
