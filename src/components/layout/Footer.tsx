import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-12 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-black text-slate-700 dark:text-slate-400">
        <p>{t('footer.copyright', { year })}</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">{t('nav.privacy')}</Link>
          <Link to="/terms" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">{t('nav.terms')}</Link>
          <Link to="/support" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">{t('nav.support')}</Link>
        </div>
      </div>
    </footer>
  );
};