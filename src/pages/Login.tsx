import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { siteConfig } from '@/site.config';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const from = (location.state as any)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-black antialiased selection:bg-[#F5A623] selection:text-white relative flex flex-col justify-center items-center py-12 px-6">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/85" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900 dark:text-slate-100 mb-10 hover:scale-105 transition-transform">
          <img src={siteConfig.logo} alt={siteConfig.name} className="h-8 w-auto object-contain" />
          <span>{siteConfig.name}</span>
        </Link>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-8 sm:p-10 relative overflow-hidden ring-1 ring-[#F5A623]/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent opacity-50" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">{t('auth.loginTitle')}</h1>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{t('auth.loginDesc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('auth.usernameOrEmail')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <input type="text" placeholder={t('auth.usernameOrEmailPlaceholder')} value={username} onChange={(e) => setUsername(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] focus:bg-white dark:focus:bg-slate-700 transition-all backdrop-blur-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('auth.password')}</label>
                <a href="#" className="text-xs font-bold text-[#F5A623] hover:text-orange-600 transition-colors">{t('auth.forgotPassword')}</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all backdrop-blur-sm" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-black shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              {isLoading ? t('common.loading') : t('auth.loginAction')}
              {!isLoading && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {t('auth.noAccount')} <Link to="/register" className="text-slate-900 dark:text-slate-100 hover:text-[#F5A623] transition-colors underline decoration-2 underline-offset-4">{t('auth.registerNow')}</Link>
            </p>
          </div>
        </motion.div>

        <div className="mt-10 text-xs font-bold text-slate-500">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </div>
  );
};