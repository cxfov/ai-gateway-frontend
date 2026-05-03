/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string;
  readonly VITE_SITE_TAGLINE: string;
  readonly VITE_SITE_LOGO: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_TG_BOT: string;
  readonly VITE_TG_GROUP: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_SUPPORT_WECHAT: string;
  readonly VITE_SUPPORT_DISCORD: string;
  readonly VITE_ADMIN_PANEL_URL: string;
  readonly VITE_DEFAULT_LOCALE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}