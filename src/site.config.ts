export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME || 'Aihere',
  tagline: import.meta.env.VITE_SITE_TAGLINE || 'Unified API Platform',
  logo: '/logo.png',
  background: '/bg.png',
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '',
  support: {
    telegram: {
      bot: import.meta.env.VITE_TG_BOT || 'your_support_bot',
      group: import.meta.env.VITE_TG_GROUP || 'https://t.me/your_group',
    },
    email: import.meta.env.VITE_SUPPORT_EMAIL || 'support@aihere.com',
    wechat: import.meta.env.VITE_SUPPORT_WECHAT || '',
    discord: import.meta.env.VITE_SUPPORT_DISCORD || '',
  },
  adminPanelUrl: import.meta.env.VITE_ADMIN_PANEL_URL || '/admin',
  defaultLocale: 'zh-HK',
};
