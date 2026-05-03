import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { siteConfig } from '@/site.config';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [sp] = useSearchParams();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPwd: '', aff_code: sp.get('aff') || '', agreeTerms: false });
  const [showPwd, setShowPwd] = useState(false);
  const { register, login, isLoading, autoCreateGroupTokens } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const upd = (field: string, value: any) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error(t('auth.passwordPlaceholder')); return; }
    if (form.password !== form.confirmPwd) { toast.error(t('auth.passwordMismatch')); return; }
    if (!form.agreeTerms) { toast.error(t('auth.agreeTerms')); return; }

    const ok = await register({
      username: form.username,
      password: form.password,
      email: form.email || undefined,
      aff_code: form.aff_code || undefined,
    });
    if (ok) {
      const loggedIn = await login(form.username, form.password);
      if (loggedIn) {
        await autoCreateGroupTokens();
        navigate('/clients');
      } else {
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-black antialiased selection:bg-[#F5A623] selection:text-white relative flex flex-col justify-center items-center py-12 px-6">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/85" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <Link to="/" className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900 dark:text-slate-100 mb-10 hover:scale-105 transition-transform">
          <img src={siteConfig.logo} alt={siteConfig.name} className="h-8 w-auto object-contain" />
          <span>{siteConfig.name}</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-8 sm:p-10 relative overflow-hidden ring-1 ring-[#F5A623]/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent opacity-50" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">{t('auth.registerTitle')}</h1>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{t('auth.registerDesc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('auth.username')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <input type="text" placeholder={t('auth.usernamePlaceholder')} value={form.username} onChange={(e) => upd('username', e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all backdrop-blur-sm" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('auth.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <input type="email" placeholder={t('auth.emailPlaceholder')} value={form.email} onChange={(e) => upd('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all backdrop-blur-sm" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('auth.password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <input type={showPwd ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={form.password} onChange={(e) => upd('password', e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all backdrop-blur-sm" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <input type="password" placeholder={t('auth.confirmPasswordPlaceholder')} value={form.confirmPwd} onChange={(e) => upd('confirmPwd', e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all backdrop-blur-sm" />
              </div>
            </div>

            {/* Invite Code */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('auth.affCode')} ({t('common.optional')})</label>
              <input type="text" placeholder={t('auth.affCodePlaceholder')} value={form.aff_code} onChange={(e) => upd('aff_code', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all backdrop-blur-sm" />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" checked={form.agreeTerms} onChange={(e) => upd('agreeTerms', e.target.checked)}
                className="mt-1 w-4 h-4 text-[#F5A623] border-slate-300 rounded focus:ring-[#F5A623]" />
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-tight">
                {t('auth.agreeTerms')}{' '}
                <Link to="/terms" className="text-slate-900 dark:text-slate-100 hover:text-[#F5A623] underline decoration-2 underline-offset-2">{t('auth.termsLink')}</Link>
                {' '}{t('auth.and')}{' '}
                <Link to="/privacy" className="text-slate-900 dark:text-slate-100 hover:text-[#F5A623] underline decoration-2 underline-offset-2">{t('auth.privacyLink')}</Link>
              </label>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-[#F5A623] text-white rounded-md text-sm font-black shadow-lg hover:bg-[#E0901A] hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              {isLoading ? t('common.loading') : t('auth.registerAction')}
              {!isLoading && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {t('auth.hasAccount')} <Link to="/login" className="text-slate-900 dark:text-slate-100 hover:text-[#F5A623] transition-colors underline decoration-2 underline-offset-4">{t('auth.loginNow')}</Link>
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