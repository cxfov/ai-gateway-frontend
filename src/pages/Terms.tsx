import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  const { t } = useTranslation();
  const items2 = t('terms.section2Items', { returnObjects: true }) as string[];
  const items3 = t('terms.section3Items', { returnObjects: true }) as string[];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4">{t('terms.title')}</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{t('terms.lastUpdated')}</p>
      </div>

      <article className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-8 md:p-12">
        {/* Regional Restriction Warning */}
        <div className="bg-red-50/80 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-md p-5 mb-10 shadow-sm">
          <h3 className="text-red-700 dark:text-red-400 font-black text-lg mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            {t('terms.restrictionTitle')}
          </h3>
          <p className="text-sm font-bold text-red-600 dark:text-red-400 leading-relaxed">{t('terms.restrictionContent')}</p>
        </div>

        <div className="space-y-10 text-slate-700 dark:text-slate-300 text-sm md:text-base font-bold leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('terms.section1Title')}</h2>
            <p>{t('terms.section1Content')}</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('terms.section2Title')}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {Array.isArray(items2) && items2.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('terms.section3Title')}</h2>
            <p className="mb-2">{t('terms.section3Intro')}</p>
            <ul className="list-disc pl-5 space-y-2">
              {Array.isArray(items3) && items3.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('terms.section4Title')}</h2>
            <p>{t('terms.section4Content')}</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">{t('terms.section5Title')}</h2>
            <p>{t('terms.section5Content')}</p>
          </section>
        </div>
      </article>

      <div className="mt-12 flex justify-center gap-6 text-sm font-black text-slate-700 dark:text-slate-400">
        <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">{t('nav.privacy')}</Link>
        <span className="text-slate-900 dark:text-slate-100">{t('nav.terms')}</span>
      </div>
    </div>
  );
};