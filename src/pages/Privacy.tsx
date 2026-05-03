import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();
  const items1 = t('privacy.section1Items', { returnObjects: true }) as string[];
  const items2 = t('privacy.section2Items', { returnObjects: true }) as string[];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4">{t('privacy.title')}</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{t('privacy.lastUpdated')}</p>
      </div>

      <article className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-8 md:p-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] mb-8 shadow-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span className="text-xs font-black tracking-widest uppercase">{t('privacy.corePromise')}</span>
        </div>

        <p className="text-base text-slate-700 dark:text-slate-300 font-bold leading-relaxed mb-10">{t('privacy.intro')}</p>

        <div className="space-y-10 text-slate-700 dark:text-slate-300 text-sm md:text-base font-bold leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('privacy.section1Title')}</h2>
            <p className="mb-2">{t('privacy.section1Intro')}</p>
            <ul className="list-disc pl-5 space-y-2">
              {Array.isArray(items1) && items1.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('privacy.section2Title')}</h2>
            <p className="mb-2">{t('privacy.section2Intro')}</p>
            <ul className="list-disc pl-5 space-y-2">
              {Array.isArray(items2) && items2.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('privacy.section3Title')}</h2>
            <p>{t('privacy.section3Content')}</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('privacy.section4Title')}</h2>
            <p>{t('privacy.section4Content')}</p>
          </section>
        </div>
      </article>

      <div className="mt-12 flex justify-center gap-6 text-sm font-black text-slate-700 dark:text-slate-400">
        <span className="text-slate-900 dark:text-slate-100">{t('nav.privacy')}</span>
        <Link to="/terms" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">{t('nav.terms')}</Link>
      </div>
    </div>
  );
};