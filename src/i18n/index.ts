import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { siteConfig } from '@/site.config';

import zhHK from './locales/zh-HK.json';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
import pt from './locales/pt.json';
import ar from './locales/ar.json';
import vi from './locales/vi.json';

export const languages = [
  { code: 'zh-HK', label: '繁體中文（中國香港）', flag: '🇭🇰' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];

// IP-based language detection
async function detectLanguageByIP(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = await res.json();
    const country = data.country_code;
    const langMap: Record<string, string> = {
      HK: 'zh-HK', TW: 'zh-HK', MO: 'zh-HK',
      CN: 'zh-CN',
      JP: 'ja', KR: 'ko',
      FR: 'fr', DE: 'de', AT: 'de', CH: 'de',
      ES: 'es', MX: 'es', AR: 'es', CO: 'es',
      RU: 'ru', UA: 'ru',
      BR: 'pt', PT: 'pt',
      SA: 'ar', AE: 'ar', EG: 'ar',
      VN: 'vi',
      US: 'en', GB: 'en', AU: 'en', CA: 'en',
    };
    return langMap[country] || null;
  } catch {
    return null;
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-HK': { translation: zhHK },
      'zh-CN': { translation: zhCN },
      en: { translation: en },
      ja: { translation: ja },
      ko: { translation: ko },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      ru: { translation: ru },
      pt: { translation: pt },
      ar: { translation: ar },
      vi: { translation: vi },
    },
    fallbackLng: siteConfig.defaultLocale,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// After init, attempt IP-based detection if no stored preference
if (!localStorage.getItem('i18nextLng')) {
  detectLanguageByIP().then((lang) => {
    if (lang && languages.some((l) => l.code === lang)) {
      i18n.changeLanguage(lang);
    }
  });
}

export default i18n;
