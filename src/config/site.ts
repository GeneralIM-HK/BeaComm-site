/**
 * 站点内容配置（Site content configuration）
 * ------------------------------------------
 * 套餐价格、下载入口、联系方式、页脚链接均在此配置，组件会自动渲染并按当前语言显示对应文案。
 * Pricing plans, download entries, contact cards and footer links are all configured here.
 *
 * 每段文案是一个多语言记录，键为站点语言（见下方 `localeDefs`）；缺失的键会按
 * fallback 链自动回退（如 zh-hk → zh-cn → en），因此可以渐进补齐译文。
 */

/* ------------------------------------------------------------------ */
/* 站点语言定义（唯一配置源）                                            */
/* ------------------------------------------------------------------ */

/**
 * 新增语言的步骤：
 * 1. 在下方 `localeDefs` 增加一项（label / lang / fallback / browserTags）；
 * 2. 新建内容目录 src/content/docs/{locale}/（先放 index.mdx 即可）；
 * 3. 若侧边栏分组需要该语言名称，在 astro.config.mjs 的 sidebar `translations`
 *    中按 lang 码（如 'ja'）补充。
 * astro.config 的 locales、文案回退链、浏览器语言自动适配均自动跟随，无需改其他代码。
 */
export interface LocaleDef {
	/** Starlight 语言切换器中显示的名称 */
	label: string;
	/** BCP 47 语言标签（html lang 与 og:locale 使用） */
	lang: string;
	/** 是否为站点默认语言：URL 不带前缀（对应 Starlight 的 root locale），只能有一个 */
	root?: boolean;
	/** 文案缺失时的回退语言键（须为 localeDefs 中的键）；不填则直接回退到空 */
	fallback?: string;
	/** 浏览器语言标签匹配表（小写 BCP 47）。navigator.languages 中的标签会沿继承链
	 *  逐级在此查找（如 zh-hant-tw → zh-hant → zh），未命中任何语言时使用默认语言。 */
	browserTags: string[];
}

const localeDefsLiteral = {
	en: {
		label: 'English',
		lang: 'en',
		root: true,
		browserTags: ['en'],
	},
	'zh-cn': {
		label: '简体中文',
		lang: 'zh-CN',
		fallback: 'en',
		browserTags: ['zh', 'zh-hans', 'zh-cn', 'zh-sg', 'zh-my'],
	},
	'zh-hk': {
		label: '繁體中文（中国香港）',
		lang: 'zh-HK',
		fallback: 'zh-cn',
		// yue（粤语）是 Chrome 语言列表中的"中文（粤语，香港）"，界面惯例用繁体。
		browserTags: ['zh-hk', 'zh-mo', 'zh-hant-hk', 'zh-hant-mo', 'yue'],
	},
	'zh-tw': {
		label: '繁體中文（中国台灣）',
		lang: 'zh-TW',
		fallback: 'zh-cn',
		browserTags: ['zh-tw', 'zh-hant', 'zh-hant-tw'],
	},
} satisfies Record<string, LocaleDef>;

export type SiteLocale = keyof typeof localeDefsLiteral;

export const localeDefs: Record<SiteLocale, LocaleDef> = localeDefsLiteral;

export type LocalizedText = Partial<Record<SiteLocale, string>>;

/** 顶部导航链接 */
export interface NavItem {
	label: LocalizedText;
	/** 页面区块锚点 id；各语言标题生成的 id 不同时（如 Features）用对象形式逐语言指定。 */
	anchor: string | LocalizedText;
}

/** SEO 配置项 */
export interface SeoConfig {
	/** 站点正式对外域名（含协议、不含末尾斜杠）。canonical / sitemap / OG / robots.txt / llms.txt 都基于它，同时被 astro.config.mjs 的 `site` 引用。 */
	siteUrl: string;
	/** 站点名称（结构化数据 JSON-LD 与 llms.txt 使用，按语言提供；og:site_name 用的是 astro.config 的 title，全局一致） */
	siteName: LocalizedText;
	/** 默认社交分享图（public/ 下的路径，建议 1200×630 PNG） */
	ogImage: string;
	/** 社交分享图尺寸 */
	ogImageWidth?: number;
	ogImageHeight?: number;
	/** Twitter/X 账号（含 @，可选） */
	twitterHandle?: string;
	/** SEO 关键词（可选，按语言配置） */
	keywords?: LocalizedText;
	/** Google Search Console 验证码（可选，<meta name="google-site-verification">） */
	googleSiteVerification?: string;
	/** Bing 站长工具验证码（可选，<meta name="msvalidate.01">） */
	bingSiteVerification?: string;
	/** 站点分类（结构化数据 applicationCategory，可选） */
	appCategory?: string;
}

/** AI 爬虫友好配置（AI ready） */
export interface AiConfig {
	/** llms.txt 中的站点简介（面向爬虫，建议英文） */
	summary: string;
	/** 明确允许的 AI 爬虫（写入 robots.txt，逐个 Allow） */
	allowedBots: string[];
	/** llms.txt 中按主题分组的站内链接（爬虫-facing，建议英文） */
	sections: { name: string; links: { label: string; href: string; description?: string }[] }[];
}

/** 页脚栏目 */
export interface FooterColumn {
	title: LocalizedText;
	links: { label: LocalizedText; href: string; external?: boolean }[];
}

/** 套餐 */
export interface PricingPlan {
	id: string;
	/** 套餐名，如 Community / Commercial */
	name: LocalizedText;
	/** 一句话描述 */
	description: LocalizedText;
	/** 价格文案，如 “免费”、“¥299”，可用任意文本 */
	price: LocalizedText;
	/** 价格补充，如 “/ 月”、“per month”，可选 */
	priceNote?: LocalizedText;
	/** 卡片角标，如 “推荐”，可选 */
	badge?: LocalizedText;
	/** 是否高亮（推荐套餐） */
	highlight?: boolean;
	/** 套餐包含内容列表 */
	features: LocalizedText[];
	/** 操作按钮 */
	cta: { label: LocalizedText; href: string; variant?: 'primary' | 'secondary' | 'minimal' };
}

/** 下载按钮：列表中第一个为主要按钮，其余为次要按钮 */
export interface DownloadLink {
	label: LocalizedText;
	href: string;
	/** 外链时新窗口打开（内部链接会自动带上语言前缀） */
	external?: boolean;
}

/** 下载入口 */
export interface DownloadItem {
	id: string;
	/**
	 * 图标：优先使用 Starlight 内置图标名（apple / mobile-android / desktop / laptop / linux / download 等），
	 * 内置库里没有的（如 Windows 徽标）由组件内置补充，或直接给 `iconSvg` 传一段 <path> 的 SVG 内容。
	 */
	icon?: string;
	iconSvg?: string;
	label: LocalizedText;
	/** 副标题，如版本号、文件大小，可选 */
	sub?: LocalizedText;
	/** 下载按钮列表：第一个为主要按钮（高亮），其余为次要按钮 */
	links: DownloadLink[];
}

/** 联系方式卡片 */
export interface ContactCard {
	id: string;
	icon?: string;
	iconSvg?: string;
	title: LocalizedText;
	description?: LocalizedText;
	/** 卡片上的一个或多个按钮 */
	links: { label: LocalizedText; href: string; external?: boolean }[];
}

/* ------------------------------------------------------------------ */
/* 顶部导航链接（定位到首页各区块）                                      */
/* ------------------------------------------------------------------ */

const nav = {
	label: {
		en: 'Main navigation',
		'zh-cn': '主导航',
		'zh-hk': '主導覽',
		'zh-tw': '主導覽',
	},
	items: [
		{
			label: {
				en: 'Install',
				'zh-cn': '部署',
				'zh-hk': '部署',
				'zh-tw': '部署',
			},
			anchor: 'install',
		},
		{
			label: {
				en: 'Features',
				'zh-cn': '功能特性',
				'zh-hk': '功能特色',
				'zh-tw': '功能特色',
			},
			anchor: 'features',
		},
		{
			label: {
				en: 'Pricing',
				'zh-cn': '价格',
				'zh-hk': '價格',
				'zh-tw': '價格',
			},
			anchor: 'pricing',
		},
		{
			label: {
				en: 'Download',
				'zh-cn': '下载客户端',
				'zh-hk': '下載客戶端',
				'zh-tw': '下載用戶端',
			},
			anchor: 'download',
		},
		{
			label: {
				en: 'Contact',
				'zh-cn': '联系',
				'zh-hk': '聯絡',
				'zh-tw': '聯絡',
			},
			anchor: 'contact',
		},
		// 需要更多导航项时继续添加，anchor 填对应区块的 id。
		// Add more nav items as needed; `anchor` is the target section id.
	] satisfies NavItem[],
};

/** 功能特性卡片 */
export interface FeatureItem {
	/** Starlight 内置图标名（pencil / document / add-document / setting / open-book 等） */
	icon: string;
	title: LocalizedText;
	/** 卡片描述，支持 `行内代码` 与 [文字](链接) 两种行内写法 */
	body: LocalizedText;
}

/* ------------------------------------------------------------------ */
/* 运行代码                                                            */
/* ------------------------------------------------------------------ */

/** 运行代码区块配置 */
export interface RunCodeConfig {
	title: LocalizedText;
	/** 代码块上方的说明文字 */
	description: LocalizedText;
	/** 展示的命令与语言，由 Starlight 的 Code 组件（Expressive Code）渲染 */
	code: string;
	lang: string;
	/** 代码块下方的跳转链接（可选）：看不懂命令的用户可以前往文档 */
	link?: { label: LocalizedText; href: string; external?: boolean };
}

/* ------------------------------------------------------------------ */
/* 运行代码                                                            */
/* ------------------------------------------------------------------ */

const runCode = {
	title: {
		en: 'Deploy BeaComm Server',
		'zh-cn': '部署 BeaComm 服务器',
		'zh-hk': '部署 BeaComm 伺服器',
		'zh-tw': '部署 BeaComm 伺服器',
	},
	/** 展示的命令与语言，由 Starlight 的 Code 组件（Expressive Code）渲染 */
	description: {
		en: 'Copy the command below and run it on the terminal to install the BeaComm server software.',
		'zh-cn': '复制下方命令，在终端运行，即可安装 BeaComm 服务器软件。',
		'zh-hk': '複製下方指令，在終端機上運行，即可安裝 BeaComm 伺服器軟體。',
		'zh-tw': '複製下方指令，在終端機上執行，即可安裝 BeaComm 伺服器軟體。',
	},
	code: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/GeneralIM-HK/BeaComm-install/HEAD/install.sh)"',
	lang: 'shell',
	// 看不懂命令的用户可以点击前往文档；不需要时删除 link 即可隐藏。
	link: {
		label: {
			en: 'Not sure what this command does? Read the docs',
			'zh-cn': '有疑问？前往文档了解更多',
			'zh-hk': '有疑問？前往文檔了解更多',
			'zh-tw': '有疑問？前往文件瞭解更多',
		},
		href: '/intro/install-server/',
	},
} satisfies RunCodeConfig;

/* ------------------------------------------------------------------ */
/* 功能特性                                                            */
/* ------------------------------------------------------------------ */

const features = {
	title: {
		en: 'Features',
		'zh-cn': '功能特性',
		'zh-hk': '功能特色',
		'zh-tw': '功能特色',
	},
	description: {
		en: 'Packed with powerful features.',
		'zh-cn': '包含多种强大功能。',
		'zh-hk': '包含多種強大功能。',
		'zh-tw': '包含多種強大功能。',
	},
	items: [
		{
			icon: 'database',
			title: {
				en: 'Self-Hosted Deployment',
				'zh-cn': '私有化部署',
				'zh-hk': '私有化部署',
				'zh-tw': '私有化部署',
			},
			body: {
				en: 'Deploy to your own server or private cloud with a single command. Your data stays entirely in your hands — no third-party services required.',
				'zh-cn': '一行命令即可部署到自有服务器或私有云，数据完全保存在自己手中，无需依赖任何第三方服务。',
				'zh-hk': '一行指令即可部署到自有伺服器或私有雲，數據完全保存在自己手中，無需依賴任何第三方服務。',
				'zh-tw': '一行指令即可部署到自有伺服器或私有雲，資料完全保存在自己手中，無需依賴任何第三方服務。',
			},
		},
		{
			icon: 'padlock',
			title: {
				en: 'End-to-End Encryption',
				'zh-cn': '端到端加密',
				'zh-hk': '端對端加密',
				'zh-tw': '端對端加密',
			},
			body: {
				en: 'Messages are encrypted and decrypted on the device, and stay encrypted in transit and at rest — even server administrators cannot read them.',
				'zh-cn': '消息在设备端完成加解密，传输与存储全程密文，连服务器管理员也无法窥探对话内容。',
				'zh-hk': '訊息在裝置端完成加解密，傳輸與儲存全程密文，連伺服器管理員也無法窺探對話內容。',
				'zh-tw': '訊息在裝置端完成加解密，傳輸與儲存全程密文，連伺服器管理員也無法窺探對話內容。',
			},
		},
		{
			icon: 'code-branch',
			title: {
				en: 'Multi-Node Access',
				'zh-cn': '多节点接入',
				'zh-hk': '多節點接入',
				'zh-tw': '多節點接入',
			},
			body: {
				en: 'Distributed multi-node deployment with automatic data sync. Members connect to the nearest node for low latency, with no single point of failure.',
				'zh-cn': '支持分布式多节点部署，成员就近接入、数据自动同步，低延迟的同时告别单点故障。',
				'zh-hk': '支援分散式多節點部署，成員就近接入、數據自動同步，低延遲的同時告別單點故障。',
				'zh-tw': '支援分散式多節點部署，成員就近接入、資料自動同步，低延遲的同時告別單點故障。',
			},
		},
		{
			icon: 'setting',
			title: {
				en: 'Configure Your Server',
				'zh-cn': '配置你的服务器',
				'zh-hk': '設定你的伺服器',
				'zh-tw': '設定你的伺服器',
			},
			body: {
				en: 'Domain, storage, member permissions — everything is managed in one admin console. Changes apply instantly, no restart needed.',
				'zh-cn': '从域名、存储到成员权限，所有配置集中在一个管理后台面板中，修改即时生效，无需重启服务。',
				'zh-hk': '由網域、儲存到成員權限，所有設定集中在一個管理後台面板中，修改即時生效，無需重啟服務。',
				'zh-tw': '從網域、儲存空間到成員權限，所有設定集中在一個管理後台面板中，修改即時生效，無需重啟服務。',
			},
		},
		{
			icon: 'mobile-android',
			title: {
				en: 'Cross-Platform Compatibility',
				'zh-cn': '多平台兼容',
				'zh-hk': '多平台兼容',
				'zh-tw': '跨平台相容',
			},
			body: {
				en: 'Native clients for iOS, Android, Windows, and macOS, with a consistent look and feel — join the conversation from anywhere.',
				'zh-cn': '提供 iOS、Android、Windows、macOS 全平台客户端，界面与体验保持一致，随时随地加入对话。',
				'zh-hk': '提供 iOS、Android、Windows、macOS 全平台用戶端，介面與體驗保持一致，隨時隨地加入對話。',
				'zh-tw': '提供 iOS、Android、Windows、macOS 全平台用戶端，介面與體驗保持一致，隨時隨地加入對話。',
			},
		},
		{
			icon: 'desktop',
			title: {
				en: 'Multi-Device Login',
				'zh-cn': '多端登录',
				'zh-hk': '多端登入',
				'zh-tw': '多裝置登入',
			},
			body: {
				en: 'Stay signed in on your phone and computer at the same time. Messages and read states sync in real time, so switching devices is seamless.',
				'zh-cn': '同一账号可同时在手机与电脑在线，消息、未读与已读状态实时同步，切换设备无缝衔接。',
				'zh-hk': '同一帳號可同時在手機與電腦在線，訊息、未讀與已讀狀態實時同步，切換裝置無縫銜接。',
				'zh-tw': '同一帳號可同時在手機與電腦上線，訊息、未讀與已讀狀態即時同步，切換裝置無縫銜接。',
			},
		},
		// 需要更多特性卡片时继续添加。
		// Add more feature cards as needed.
	] satisfies FeatureItem[],
};

/* ------------------------------------------------------------------ */
/* 套餐价格                                                            */
/* ------------------------------------------------------------------ */

const pricing = {
	title: {
		en: 'Pricing',
		'zh-cn': '套餐价格',
		'zh-hk': '套餐價格',
		'zh-tw': '套餐價格',
	},
	description: {
		en: 'Start free with the Startup plan and upgrade as your team grows — with a fully customizable Enterprise option.',
		'zh-cn': '使用初创版免费起步，团队壮大后随时升级到商业版，如需可定制企业版。',
		'zh-hk': '使用初創版免費起步，團隊壯大後隨時升級到商業版，如需可定制企業版。',
		'zh-tw': '使用新創版免費起步，團隊壯大後隨時升級到商業版，如需可客製化企業版。',
	},
	plans: [
		{
			id: 'startup',
			name: {
				en: 'Start Up',
				'zh-cn': '初创版',
				'zh-hk': '初創版',
				'zh-tw': '新創版',
			},
			description: {
				en: 'For individuals and small startup teams.',
				'zh-cn': '适合个人使用或小型初创团队。',
				'zh-hk': '適合個人或小型初創團隊。',
				'zh-tw': '適合個人或小型新創團隊。',
			},
			price: { en: 'Free', 'zh-cn': '免费', 'zh-hk': '免費', 'zh-tw': '免費' },
			priceNote: { en: 'forever', 'zh-cn': '永久', 'zh-hk': '永久', 'zh-tw': '永久' },
			features: [
				{
					en: 'Unlimited messages and chat history',
					'zh-cn': '不限消息数量与聊天记录',
					'zh-hk': '不限訊息數量與聊天記錄',
					'zh-tw': '不限訊息數量與聊天記錄',
				},
				{
					en: 'Up to 5 members per server',
					'zh-cn': '单服务器最多 5 名成员',
					'zh-hk': '單伺服器最多 5 名成員',
					'zh-tw': '單一伺服器最多 5 名成員',
				},
				{
					en: 'All platform clients (iOS, Android, Windows, macOS)',
					'zh-cn': '全平台客户端（iOS、Android、Windows、macOS）',
					'zh-hk': '全平台用戶端（iOS、Android、Windows、macOS）',
					'zh-tw': '全平台用戶端（iOS、Android、Windows、macOS）',
				},
				{
					en: 'Email and live chat support on our website',
					'zh-cn': '邮件与官网 Live Chat 支持',
					'zh-hk': '電郵與官網 Live Chat 支援',
					'zh-tw': '電郵與官網 Live Chat 支援',
				},
			],
			cta: {
				label: { en: 'Deploy Now', 'zh-cn': '立即部署', 'zh-hk': '立即部署', 'zh-tw': '立即部署' },
				href: '#install',
			},
		},
		{
			id: 'business',
			name: {
				en: 'Business',
				'zh-cn': '商业版',
				'zh-hk': '商業版',
				'zh-tw': '商業版',
			},
			description: {
				en: 'Built for growing teams that need scale, performance, and dedicated support.',
				'zh-cn': '专为追求规模化、高性能与专属支持的成长型团队打造。',
				'zh-hk': '專為追求規模化、高效能與專屬支援的成長型團隊打造。',
				'zh-tw': '專為追求規模化、高效能與專屬支援的成長型團隊打造。',
			},
			price: { en: 'US $1599', 'zh-cn': 'US $1599', 'zh-hk': 'US $1599', 'zh-tw': 'US $1599' },
			priceNote: { en: 'per month', 'zh-cn': '/ 月', 'zh-hk': '/ 月', 'zh-tw': '/ 月' },
			badge: {
				en: 'Recommended',
				'zh-cn': '推荐',
				'zh-hk': '推薦',
				'zh-tw': '推薦',
			},
			highlight: true,
			features: [
				{
					en: 'Everything in Start Up',
					'zh-cn': '包含初创版全部功能',
					'zh-hk': '包含初創版全部功能',
					'zh-tw': '包含新創版全部功能',
				},
				{
					en: 'Up to 500 members',
					'zh-cn': '最多 500 名成员',
					'zh-hk': '最多 500 名成員',
					'zh-tw': '最多 500 名成員',
				},
				{
					en: 'Dedicated technical support contact, with priority email and live chat response within 12 hours',
					'zh-cn': '配备专属技术支持人员，邮件与官网 Live Chat 优先响应（12 小时内）',
					'zh-hk': '配備專屬技術支援人員，電郵與官網 Live Chat 優先回應（12 小時內）',
					'zh-tw': '配備專屬技術支援人員，電郵與官網 Live Chat 優先回應（12 小時內）',
				},
			],
			cta: {
				label: { en: 'Coming soon', 'zh-cn': '即将推出', 'zh-hk': '即將推出', 'zh-tw': '即將推出' },
				href: '#contact',
			},
		},
		{
			id: 'enterprise',
			name: {
				en: 'Enterprise',
				'zh-cn': '企业版',
				'zh-hk': '企業版',
				'zh-tw': '企業版',
			},
			description: {
				en: 'Tailored for large enterprises looking for custom integrations, maximum scalability, and a dedicated partner to ensure success.',
				'zh-cn': '专为寻求定制集成、极致扩展性以及专属成功伙伴的大型企业量身定制。',
				'zh-hk': '專為尋求定制整合、極致擴展性以及專屬成功夥伴的大型企業量身打造。',
				'zh-tw': '專為尋求客製化整合、極致擴充性以及專屬成功夥伴的大型企業量身打造。',
			},
			price: { en: 'Customize for You', 'zh-cn': '为您定制', 'zh-hk': '為您定制', 'zh-tw': '為您客製化' },
			priceNote: { en: 'per month', 'zh-cn': '/ 月', 'zh-hk': '/ 月', 'zh-tw': '/ 月' },
			// badge: {
			// 	en: 'Recommended',
			// 	'zh-cn': '推荐',
			// 	'zh-hk': '推薦',
			// 	'zh-tw': '推薦',
			// },
			// highlight: true,
			features: [
				{
					en: 'Everything in Business',
					'zh-cn': '包含商业版全部功能',
					'zh-hk': '包含商業版全部功能',
					'zh-tw': '包含商業版全部功能',
				},
				{
					en: 'Customizable registered member limit per server',
					'zh-cn': '服务器注册成员数可定制',
					'zh-hk': '伺服器註冊成員數可定制',
					'zh-tw': '伺服器註冊成員數可客製',
				},
				{
					en: 'Group capacity, configurable on demand',
					'zh-cn': '群组容量支持按需定制',
					'zh-hk': '群組容量支援按需定制',
					'zh-tw': '群組容量支援按需客製',
				},
				{
					en: 'Multi-node distributed deployment and access',
					'zh-cn': '支持多节点分布式部署与接入',
					'zh-hk': '支援多節點分散式部署與接入',
					'zh-tw': '支援多節點分散式部署與接入',
				},
				{
					en: 'Dedicated web portal for desktop and mobile',
					'zh-cn': '配备独立专属网页端（适配桌面与移动设备）',
					'zh-hk': '配備獨立專屬網頁端（適配桌面與流動裝置）',
					'zh-tw': '配備獨立專屬網頁端（支援桌面與行動裝置）',
				},
				{
					en: 'Dedicated support team across multiple channels, priority response within 1 hour',
					'zh-cn': '配备多种沟通渠道专属技术支持团队，优先响应（1 小时内）',
					'zh-hk': '配備多種溝通渠道專屬技術支援團隊，優先回應（1 小時內）',
					'zh-tw': '配備多種溝通管道專屬技術支援團隊，優先回應（1 小時內）',
				},
				{
					en: 'Optional commercial licenses for production environments',
					'zh-cn': '可选购多种生产环境商用授权',
					'zh-hk': '可選購多種正式環境商用授權',
					'zh-tw': '可選購多種正式環境商用授權',
				},
			],
			cta: {
				label: { en: 'Coming soon', 'zh-cn': '即将推出', 'zh-hk': '即將推出', 'zh-tw': '即將推出' },
				href: '#contact',
			},
		},
		// 需要更多套餐时，向上面的 plans 数组继续添加对象即可。
		// Add more plan objects to this array to display additional tiers.
	] satisfies PricingPlan[],
};

/* ------------------------------------------------------------------ */
/* 下载                                                                */
/* ------------------------------------------------------------------ */

const downloads = {
	title: {
		en: 'Download',
		'zh-cn': '下载',
		'zh-hk': '下載',
		'zh-tw': '下載',
	},
	description: {
		en: 'BeaComm runs on all major platforms. Pick yours and start chatting.',
		'zh-cn': 'BeaComm 支持所有主流平台，选择你的设备，开始聊天。',
		'zh-hk': 'BeaComm 支援所有主流平台，選擇你的裝置，開始聊天。',
		'zh-tw': 'BeaComm 支援所有主流平台，選擇你的裝置，開始聊天。',
	},
	items: [
		{
			id: 'ios',
			icon: 'apple',
			label: { en: 'iOS', 'zh-cn': 'iOS', 'zh-hk': 'iOS', 'zh-tw': 'iOS' },
			sub: { en: 'Requires iOS 15+', 'zh-cn': '需要 iOS 15 及以上', 'zh-hk': '需要 iOS 15 或以上', 'zh-tw': '需要 iOS 15 以上' },
			links: [
				{
					// label: { en: 'App Store', 'zh-cn': 'App Store', 'zh-hk': 'App Store', 'zh-tw': 'App Store' },
					label: { en: 'Coming soon', 'zh-cn': '即将推出', 'zh-hk': '即將推出', 'zh-tw': '即將推出' },
					// href: 'https://apps.apple.com/',
					href: '/#download',
					// external: true,
				},
			],
		},
		{
			id: 'android',
			icon: 'mobile-android',
			label: { en: 'Android', 'zh-cn': '安卓', 'zh-hk': 'Android', 'zh-tw': 'Android' },
			sub: { en: 'Requires Android 10+', 'zh-cn': '需要 Android 10 及以上', 'zh-hk': '需要 Android 10 或以上', 'zh-tw': '需要 Android 10 以上' },
			links: [
				{
					// label: { en: 'Google Play', 'zh-cn': 'Google Play', 'zh-hk': 'Google Play', 'zh-tw': 'Google Play' },
					label: { en: 'Coming soon', 'zh-cn': '即将推出', 'zh-hk': '即將推出', 'zh-tw': '即將推出' },
					// href: 'https://play.google.com/',
					href: '/#download',
					// external: true,
				},
				// {
				// 	label: { en: 'Download APK', 'zh-cn': '下载 APK', 'zh-hk': '下載 APK', 'zh-tw': '下載 APK' },
				// 	href: '/downloads/BeaComm-android.apk',
				// },
			],
		},
		{
			id: 'windows',
			icon: 'windows',
			label: { en: 'Windows', 'zh-cn': 'Windows', 'zh-hk': 'Windows', 'zh-tw': 'Windows' },
			sub: { en: '64-bit', 'zh-cn': '64 位', 'zh-hk': '64 位元', 'zh-tw': '64 位元' },
			links: [
				{
					// label: { en: 'Windows 10/11', 'zh-cn': 'Windows 10/11', 'zh-hk': 'Windows 10/11', 'zh-tw': 'Windows 10/11' },
					label: { en: 'Coming soon', 'zh-cn': '即将推出', 'zh-hk': '即將推出', 'zh-tw': '即將推出' },
					href: 'https://www.microsoft.com/store',
					external: true,
				},
				// {
				// 	label: { en: 'Windows 7/8', 'zh-cn': 'Windows 7/8', 'zh-hk': 'Windows 7/8', 'zh-tw': 'Windows 7/8' },
				// 	href: '/downloads/BeaComm-legacy.exe',
				// },
			],
		},
		{
			id: 'macos',
			icon: 'apple',
			label: { en: 'macOS', 'zh-cn': 'macOS', 'zh-hk': 'macOS', 'zh-tw': 'macOS' },
			sub: { en: 'Requires macOS 12+', 'zh-cn': '需要 macOS 12 及以上', 'zh-hk': '需要 macOS 12 或以上', 'zh-tw': '需要 macOS 12 以上' },
			links: [
				{
					// label: { en: 'Apple silicon', 'zh-cn': 'Apple 芯片', 'zh-hk': 'Apple 晶片', 'zh-tw': 'Apple 晶片' },
					label: { en: 'Coming soon', 'zh-cn': '即将推出', 'zh-hk': '即將推出', 'zh-tw': '即將推出' },
					// href: '/downloads/BeaComm-macos-arm64.dmg',
					href: '/#download',
				},
				// {
				// 	label: { en: 'Intel chip', 'zh-cn': 'Intel 芯片', 'zh-hk': 'Intel 晶片', 'zh-tw': 'Intel 晶片' },
				// 	href: '/downloads/BeaComm-macos-x64.dmg',
				// },
			],
		},
		// 需要更多下载入口（如 Linux）时，继续向 items 添加对象即可；
		// 每个平台的 links 数组中第一个为主要按钮，其余为次要按钮。
		// Add more entries (e.g. Linux) to extend the download section;
		// within each platform's `links`, the first button is primary and the rest are secondary.
	] satisfies DownloadItem[],
};

/* ------------------------------------------------------------------ */
/* 联系方式                                                            */
/* ------------------------------------------------------------------ */

const contact = {
	title: {
		en: 'Contact Us',
		'zh-cn': '联系我们',
		'zh-hk': '聯絡我們',
		'zh-tw': '聯絡我們',
	},
	description: {
		en: 'Questions about pricing, licensing or deployment? Reach us anytime.',
		'zh-cn': '关于价格、授权或部署的任何问题，欢迎随时联系我们。',
		'zh-hk': '關於價格、授權或部署的任何問題，歡迎隨時聯絡我們。',
		'zh-tw': '關於價格、授權或部署的任何問題，歡迎隨時聯絡我們。',
	},
	cards: [
		{
			id: 'email',
			icon: 'email',
			title: { en: 'Email', 'zh-cn': '邮件', 'zh-hk': '電郵', 'zh-tw': '信箱' },
			description: {
				en: 'Sales and support, replies within 24 hours.',
				'zh-cn': '销售与技术支持，24 小时内回复。',
				'zh-hk': '銷售與技術支援，24 小時內回覆。',
				'zh-tw': '銷售與技術支援，24 小時內回覆。',
			},
			links: [
				{
					label: { en: 'support@BeaComm.chat', 'zh-cn': 'support@BeaComm.chat', 'zh-hk': 'support@BeaComm.chat', 'zh-tw': 'support@BeaComm.chat' },
					href: 'mailto:support@BeaComm.chat',
				},
			],
		},
		{
			id: 'livechat',
			icon: 'comment',
			title: { en: 'Live Chat', 'zh-cn': '在线客服', 'zh-hk': '在線客服', 'zh-tw': '在線客服' },
			description: {
				en: 'Chat with the customer service online, anything.',
				'zh-cn': '与客服人员在线交流，任何问题。',
				'zh-hk': '與客服人員在線交流，任何問題',
				'zh-tw': '與客服人員在線交流，任何問題',
			},
			links: [
				{
					label: { en: 'Start Chat', 'zh-cn': '开始联系', 'zh-hk': '开始联系', 'zh-tw': '开始联系' },
					href: 'https://tawk.to/chat/6ade0c6da136913473132020/1k5pm13v5?layout=modern',
					external: true,
				},
			],
		}
		// {
		// 	id: 'github',
		// 	icon: 'github',
		// 	title: { en: 'GitHub', 'zh-cn': 'GitHub', 'zh-hk': 'GitHub', 'zh-tw': 'GitHub' },
		// 	description: {
		// 		en: 'Issues, discussions and contributions.',
		// 		'zh-cn': '提交 Issue、参与讨论与贡献代码。',
		// 		'zh-hk': '提交 Issue、參與討論與貢獻程式碼。',
		// 		'zh-tw': '提交 Issue、參與討論與貢獻程式碼。',
		// 	},
		// 	links: [
		// 		{
		// 			label: { en: 'Open issues', 'zh-cn': '问题反馈', 'zh-hk': '問題回報', 'zh-tw': '問題回報' },
		// 			href: 'https://github.com/',
		// 			external: true,
		// 		},
		// 	],
		// },
		// {
		// 	id: 'wechat',
		// 	icon: 'comment',
		// 	title: { en: 'WeChat', 'zh-cn': '微信', 'zh-hk': '微信', 'zh-tw': '微信' },
		// 	description: {
		// 		en: 'Follow our official account for updates.',
		// 		'zh-cn': '关注公众号获取最新动态。',
		// 		'zh-hk': '關注公眾號獲取最新動態。',
		// 		'zh-tw': '追蹤公眾號取得最新動態。',
		// 	},
		// 	links: [
		// 		{
		// 			label: { en: 'BeaCommChat', 'zh-cn': 'BeaCommChat', 'zh-hk': 'BeaCommChat', 'zh-tw': 'BeaCommChat' },
		// 			href: '#',
		// 		},
		// 	],
		// },
		// 需要更多联系方式（Telegram / X / 微博……）时，继续向 cards 添加对象即可。
		// Add more contact cards (Telegram / X / …) as needed.
	] satisfies ContactCard[],
};

/* ------------------------------------------------------------------ */
/* SEO 配置                                                            */
/* ------------------------------------------------------------------ */

const seo = {
	siteUrl: 'https://www.beacomm.chat',
	siteName: {
		en: 'BeaComm - One line of code to start your own chat server',
		'zh-cn': 'BeaComm - 一行代码启动你自己的聊天服务器',
		'zh-hk': 'BeaComm - 一行程式碼啟動你自己的聊天伺服器',
		'zh-tw': 'BeaComm - 一行程式碼啟動你自己的聊天伺服器',
	},
	ogImage: '/og.png',
	ogImageWidth: 1200,
	ogImageHeight: 630,
	twitterHandle: '',
	keywords: {
		en: 'BeaComm, chat server, self-hosted chat, team messaging, real-time chat, bonchat',
		'zh-cn': 'BeaComm, 聊天服务器, 自托管聊天, 团队通讯, 即时通讯, bonchat',
		'zh-hk': 'BeaComm, 聊天伺服器, 自託管聊天, 團隊通訊, 即時通訊, bonchat',
		'zh-tw': 'BeaComm, 聊天伺服器, 自架聊天, 團隊通訊, 即時通訊, bonchat',
	},
	googleSiteVerification: '',
	bingSiteVerification: '',
	appCategory: 'CommunicationApplication',
} satisfies SeoConfig;

/* ------------------------------------------------------------------ */
/* 在线客服（Tawk.to）                                                  */
/* ------------------------------------------------------------------ */

/**
 * Tawk.to 客服窗口：每个页面的 <head> 会注入对应脚本，右下角展示客服窗口。
 * embedSrc 从 Tawk.to 控制台获取（Administration → Chat Widget → Copy code 中的 src），
 * 形如 https://embed.tawk.to/{PropertyID}/{WidgetID}；留空字符串时不注入。
 */
const tawk = {
	embedSrc: 'https://embed.tawk.to/6ade0c6da136913473132020/1k5pm13v5',
} satisfies { embedSrc: string };

/* ------------------------------------------------------------------ */
/* AI 爬虫友好配置（AI ready）                                          */
/* ------------------------------------------------------------------ */

const ai = {
	summary:
		'BeaComm is a self-hosted chat server you can start with one line of code. It ships with clients for iOS, Android, Windows and macOS, a free community edition and a commercial license for teams.',
	allowedBots: [
		// 主流 AI / 大模型爬虫，明确定义允许规则，便于模型抓取与引用。
		'GPTBot',
		'OAI-SearchBot',
		'ChatGPT-User',
		'ClaudeBot',
		'Claude-SearchBot',
		'Claude-User',
		'PerplexityBot',
		'Perplexity-User',
		'Google-Extended',
		'Applebot-Extended',
		'CCBot',
		'Bytespider',
		'Amazonbot',
		'meta-externalagent',
		// 按需增删。
		// Add or remove crawlers as needed.
	],
	sections: [
		{
			name: 'Product',
			links: [
				{ label: 'Pricing', href: '/#pricing', description: 'Community edition (free) and commercial license.' },
				{ label: 'Download', href: '/#download', description: 'Clients for iOS, Android, Windows and macOS.' },
				{ label: 'Contact', href: '/#contact', description: 'Email, Discord, GitHub and WeChat.' },
			],
		},
		{
			name: 'Docs',
			links: [
				{ label: 'Installation', href: '/intro/install-server/', description: 'Deploy a BeaComm server with a single command.' },
				{ label: 'Maintenance Commands', href: '/intro/ops/', description: 'Commands for the day-to-day operation of your BeaComm server.' },
				{ label: 'FAQ', href: '/reference/faq/', description: 'Answers to frequently asked questions about BeaComm.' },
			],
		},
		// 需要在 llms.txt 中暴露更多内容时，继续添加分组即可。
		// Add more sections to expose more content in llms.txt.
	],
} satisfies AiConfig;

/* ------------------------------------------------------------------ */
/* 页脚                                                                */
/* ------------------------------------------------------------------ */

const footer = {
	columns: [
		{
			title: { en: 'Product', 'zh-cn': '产品', 'zh-hk': '產品', 'zh-tw': '產品' },
			links: [
				{ label: { en: 'Pricing', 'zh-cn': '套餐价格', 'zh-hk': '套餐價格', 'zh-tw': '套餐價格' }, href: '/#pricing' },
				{ label: { en: 'Download', 'zh-cn': '下载', 'zh-hk': '下載', 'zh-tw': '下載' }, href: '/#download' },
				// { label: { en: 'Contact', 'zh-cn': '联系我们', 'zh-hk': '聯絡我們', 'zh-tw': '聯絡我們' }, href: '/#contact' },
			],
		},
		{
			title: { en: 'Download & Install', 'zh-cn': '下载与安装', 'zh-hk': '下载与安装', 'zh-tw': '下载与安装' },
			links: [
				{ label: { en: 'Mobile', 'zh-cn': '移动端', 'zh-hk': '移动端', 'zh-tw': '移动端' }, href: '/#download' },
				{ label: { en: 'Desktop', 'zh-cn': '电脑端/桌面端', 'zh-hk': '电脑端/桌面端', 'zh-tw': '电脑端/桌面端' }, href: '/#download' },
				{ label: { en: 'Installation', 'zh-cn': '安装部署', 'zh-hk': '安裝部署', 'zh-tw': '安裝部署' }, href: '/intro/install-server/' }
			],
		},
		{
			title: { en: 'Resources', 'zh-cn': '资源', 'zh-hk': '資源', 'zh-tw': '資源' },
			links: [
				{ label: { en: 'FAQ', 'zh-cn': '常见问题', 'zh-hk': '常見問題', 'zh-tw': '常見問題' }, href: '/reference/faq/' , external: true},
				{ label: { en: 'Customer Terms of Service', 'zh-cn': '客户服务条款', 'zh-hk': '客戶服務條款', 'zh-tw': '客戶服務條款' }, href: '/legal/customer-terms-of-service', external: true },
				{ label: { en: 'Terms of Use (EULA)', 'zh-cn': '用户使用条款(EULA)', 'zh-hk': '用戶使用條款(EULA)', 'zh-tw': '使用者條款(EULA)' }, href: '/legal/terms-of-use', external: true },
				{ label: { en: 'Privacy Policy', 'zh-cn': '隐私政策', 'zh-hk': '私隱政策', 'zh-tw': '隱私政策' }, href: '/legal/privacy-policy', external: true },
				{ label: { en: 'Guidelines for Law Enforcement', 'zh-cn': '执法部门指引', 'zh-hk': '執法部門指引', 'zh-tw': '執法部門指引' }, href: '/legal/guidelines-for-law-enforcement', external: true },
			],
		},
		{
			title: { en: 'Support', 'zh-cn': '支持', 'zh-hk': '支援', 'zh-tw': '支援' },
			links: [
				{ label: { en: 'Contact us', 'zh-cn': '联系我们', 'zh-hk': '聯絡我們', 'zh-tw': '聯絡我們' }, href: '/#contact' },
				{ label: { en: 'Email support', 'zh-cn': '邮件支持', 'zh-hk': '電郵支援', 'zh-tw': '信件支援' }, href: 'mailto:support@BeaComm.chat' },
			],
		}
		// 可继续添加更多栏目。
		// Add more columns as needed.
	] satisfies FooterColumn[],
	
	friends: {
		// title: { en: 'Friendly links', 'zh-cn': '友情链接', 'zh-hk': '友情連結', 'zh-tw': '友情連結' },
		title: { en: '', 'zh-cn': '', 'zh-hk': '', 'zh-tw': '' },
		links: [
			// { label: { en: 'Astro', 'zh-cn': 'Astro', 'zh-hk': 'Astro', 'zh-tw': 'Astro' }, href: 'https://astro.build/', external: true },
			// { label: { en: 'Starlight', 'zh-cn': 'Starlight', 'zh-hk': 'Starlight', 'zh-tw': 'Starlight' }, href: 'https://starlight.astro.build/', external: true },
			// { label: { en: 'npm', 'zh-cn': 'npm', 'zh-hk': 'npm', 'zh-tw': 'npm' }, href: 'https://www.npmjs.com/', external: true },
			// 继续添加友情链接。
			// Add more friend links as needed.
		],
	},

	copyright: {
		en: '© {year} BeaComm Team & HK General IM Tech Ltd. All rights reserved.',
		'zh-cn': '© {year} BeaComm 团队及香港通用即通科技有限公司· 保留所有权利',
		'zh-hk': '© {year} BeaComm 團隊及香港通用即通科技有限公司. 保留所有權利',
		'zh-tw': '© {year} BeaComm 團隊及香港通用即通科技有限公司· 保留所有權利',
	},
};

export const siteConfig = { nav, runCode, features, pricing, downloads, contact, footer, seo, tawk, ai };