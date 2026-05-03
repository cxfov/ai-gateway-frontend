import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/site.config';

export const SupportPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4">{t('support.title')}</h1>
        <p className="text-base text-slate-600 dark:text-slate-400 font-bold max-w-2xl">{t('support.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6">{t('support.submitTicket')}</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('support.yourName')}</label>
                <input type="text" className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('support.contactEmail')}</label>
                <input type="email" className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('support.issueType')}</label>
              <select className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 cursor-pointer">
                <option>{t('support.issueTypes.api')}</option>
                <option>{t('support.issueTypes.billing')}</option>
                <option>{t('support.issueTypes.account')}</option>
                <option>{t('support.issueTypes.other')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('support.description')}</label>
              <textarea rows={5} placeholder={t('support.descPlaceholder')}
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 resize-none" />
            </div>
            <button type="button"
              className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-black shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
              {t('support.sendRequest')}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-md bg-[#F5A623]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">{t('support.directEmail')}</h3>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">{t('support.directEmailDesc')}</p>
            <a href={`mailto:${siteConfig.support.email}`} className="text-sm font-black text-[#F5A623] hover:underline">{siteConfig.support.email}</a>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-xl p-6 relative overflow-hidden border border-slate-700/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform translate-x-8 -translate-y-8" />
            <h3 className="text-lg font-black mb-2">{t('support.devDocs')}</h3>
            <p className="text-sm font-bold text-slate-400 mb-6 leading-relaxed">{t('support.devDocsDesc')}</p>
            <Link to="/docs"
              className="px-5 py-2.5 bg-white text-slate-900 rounded-md text-sm font-black hover:bg-slate-100 transition-all inline-flex items-center gap-2">
              {t('support.goToDocs')}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};