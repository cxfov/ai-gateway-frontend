import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/api/endpoints';
import { quotaToDisplay } from '@/utils/quota';
import { CopyButton } from '@/components/ui';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, fetchUser } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [affCode, setAffCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => { if (user) setDisplayName(user.display_name || user.username || ''); }, [user]);
  useEffect(() => { userApi.getAffCode().then((r) => { if (r.data.success) setAffCode(r.data.data || ''); }).catch(() => {}); }, []);

  const handleSave = async () => {
    if (password && password !== confirmPwd) { toast.error(t('auth.passwordMismatch')); return; }
    setLoading(true);
    try {
      const res = await userApi.updateSelf({ display_name: displayName, password: password || undefined });
      if (res.data.success) { toast.success(t('profile.saved')); setPassword(''); setConfirmPwd(''); fetchUser(); }
      else toast.error(res.data.message);
    } catch { toast.error(t('common.failed')); }
    setLoading(false);
  };

  if (!user) return null;
  const affLink = `${window.location.origin}/register?aff=${affCode}`;

  const tabs = [
    { id: 'basic', label: t('profile.tabs.basic'), icon: 'M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM21 15l-5-5L5 21' },
    { id: 'security', label: t('profile.tabs.security'), icon: 'M3 11h18v11H3zM7 11V7a5 5 0 0 1 10 0v4' },
    { id: 'affiliate', label: t('profile.affiliate'), icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <svg className="w-7 h-7 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          {t('profile.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold">{t('profile.subtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Tabs */}
        <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-black whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`}>
              <svg className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#F5A623]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 w-full space-y-8 min-w-0">
          {activeTab === 'basic' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 md:p-8">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">{t('profile.publicProfile')}</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('profile.displayName')}</label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('profile.registeredEmail')}</label>
                    <input type="email" value={user.email || ''} disabled
                      className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-600/50 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-black text-slate-500 cursor-not-allowed" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={handleSave} disabled={loading}
                    className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-black shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all disabled:opacity-50">
                    {loading ? t('common.loading') : t('profile.saveChanges')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <>
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 md:p-8">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">{t('profile.tabs.security')}</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('profile.newPassword')}</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 transition-all" />
                  </div>
                  {password && (
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t('profile.confirmNewPass')}</label>
                      <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 transition-all" />
                    </div>
                  )}
                  <div className="pt-4 flex justify-end">
                    <button onClick={handleSave} disabled={loading}
                      className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-black shadow-lg disabled:opacity-50">
                      {loading ? t('common.loading') : t('profile.saveChanges')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50/40 dark:bg-red-900/10 backdrop-blur-xl rounded-xl border border-red-200 dark:border-red-800 shadow-sm p-6 md:p-8">
                <h2 className="text-lg font-black text-red-600 dark:text-red-400 mb-2">{t('profile.dangerZone')}</h2>
                <p className="text-sm text-red-500 dark:text-red-400 font-bold mb-6">{t('profile.dangerDesc')}</p>
                <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm font-black shadow-sm hover:bg-red-600 hover:text-white transition-all">
                  {t('profile.deleteAccount')}
                </button>
              </div>
            </>
          )}

          {activeTab === 'affiliate' && affCode && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 md:p-8">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">{t('profile.affiliate')}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bold mb-6">{t('profile.affiliateDesc')}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-500 uppercase">{t('profile.affCode')}:</span>
                  <code className="text-sm font-mono font-black text-[#F5A623]">{affCode}</code>
                  <CopyButton text={affCode} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-500 uppercase">{t('profile.affLink')}:</span>
                  <code className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate flex-1">{affLink}</code>
                  <CopyButton text={affLink} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/50 dark:bg-slate-700/50 rounded-md p-4 border border-slate-200/50 dark:border-slate-600/50">
                    <p className="text-xs font-black text-slate-500 uppercase">{t('profile.invited')}</p>
                    <p className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{user.aff_count} {t('profile.persons')}</p>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-700/50 rounded-md p-4 border border-slate-200/50 dark:border-slate-600/50">
                    <p className="text-xs font-black text-slate-500 uppercase">{t('profile.totalReward')}</p>
                    <p className="text-2xl font-black font-mono text-[#F5A623]">{quotaToDisplay(user.aff_history_quota)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};