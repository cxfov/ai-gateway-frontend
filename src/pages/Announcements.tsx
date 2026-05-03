import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnouncementStore } from '@/store/announcementStore';

export const AnnouncementsPage: React.FC = () => {
  const { t } = useTranslation();
  const { noticeContent, fetchNotice, loading } = useAnnouncementStore();

  useEffect(() => { fetchNotice(); }, [fetchNotice]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] mb-6 shadow-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span className="text-xs font-black tracking-widest uppercase">Updates & News</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4">{t('announcement.title')}</h1>
        <p className="text-base text-slate-600 dark:text-slate-400 font-bold">{t('announcement.subtitle')}</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">{t('common.loading')}</div>
      ) : noticeContent ? (
        <article className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 md:p-8">
          <div className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: noticeContent }} />
        </article>
      ) : (
        <div className="text-center py-16 text-slate-500 font-bold">{t('announcement.noAnnouncements')}</div>
      )}
    </div>
  );
};