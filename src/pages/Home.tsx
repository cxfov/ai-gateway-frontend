import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAnnouncementStore } from '@/store/announcementStore';
import { useApiEndpoint } from '@/features/tokens/useApiEndpoint';
import { quotaToDisplay } from '@/utils/quota';
import { tokenApi } from '@/api/endpoints';
import { clients as allClientsData } from '@/data/clients';
import type { Token } from '@/types';

export const HomePage: React.FC = () => {
  const { user, isAuthenticated, fetchPricingData, fetchServerAddress } = useAuthStore();
  const { noticeContent, fetchNotice } = useAnnouncementStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const baseUrl = useApiEndpoint();

  const [catTab, setCatTab] = useState<'ide' | 'chat' | 'cli'>('ide');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);

  useEffect(() => {
    fetchPricingData();
    fetchServerAddress();
    fetchNotice();
  }, [fetchPricingData, fetchServerAddress, fetchNotice]);

  useEffect(() => {
    if (!isAuthenticated) return;
    tokenApi.getAll(0).then((res) => {
      if (res.data.success && res.data.data) {
        const raw: any = res.data.data;
        const items: Token[] = Array.isArray(raw) ? raw : (raw.items || []);
        setTokens(items.filter((tk) => tk.status === 1));
        if (items.length > 0) setSelectedTokenId(items[0].id);
      }
    }).catch(() => {});
  }, [isAuthenticated]);

  const categoryMap: Record<string, string[]> = {
    ide: ['cursor', 'windsurf', 'continue-dev', 'cline', 'zed'],
    chat: ['chatbox', 'cherry-studio', 'lobechat', 'nextchat', 'opencat', 'jan'],
    cli: ['claude-code', 'codex-cli', 'aider'],
  };
  const catClients = allClientsData.filter((c) => categoryMap[catTab]?.includes(c.id)).slice(0, 5);

  useEffect(() => {
    if (catClients.length > 0 && !catClients.find((c) => c.id === selectedClientId)) {
      setSelectedClientId(catClients[0].id);
    }
  }, [catTab]);

  const selectedClient = allClientsData.find((c) => c.id === selectedClientId);
  const selectedToken = tokens.find((tk) => tk.id === selectedTokenId);
  const fullApiKey = selectedToken ? `sk-${selectedToken.key}` : 'sk-YOUR_API_KEY';

  return (
    <div className="space-y-20 pt-4">
      {/* ===== HERO + CLIENT PANEL ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-5 space-y-8 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0 backdrop-blur-md">
            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <span className="text-xs font-black tracking-widest text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">{t('home.running')}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black leading-[1.05] tracking-tight uppercase">
            <span className="block text-[#F5A623]">{t('home.heroTagline', 'NEW FUTURE DIMENSION').split(' ')[0] || 'NEW'}</span>
            <span className="block text-slate-900 dark:text-slate-100">{t('home.heroTagline', 'NEW FUTURE DIMENSION').split(' ')[1] || 'FUTURE'}</span>
            <span className="block text-slate-900 dark:text-slate-100">{t('home.heroTagline', 'NEW FUTURE DIMENSION').split(' ').slice(2).join(' ') || 'DIMENSION'}</span>
          </h1>

          <p className="text-slate-800 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-md font-black">
            {t('home.heroDesc')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 shrink-0">
            {!isAuthenticated ? (
              <>
                <button onClick={() => navigate('/register')}
                  className="px-8 py-3.5 text-sm font-black bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md shadow-lg flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-0.5 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  {t('home.freeRegister')}
                </button>
                <button onClick={() => navigate('/docs')}
                  className="px-8 py-3.5 text-sm font-black bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-900 dark:text-slate-100 border-2 border-slate-300/50 dark:border-slate-600/50 rounded-md hover:border-slate-900 dark:hover:border-slate-100 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  {t('home.viewDocs')}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/tokens')}
                  className="px-8 py-3.5 text-sm font-black bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md shadow-lg flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-0.5 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /></svg>
                  {t('home.manageKeys')}
                </button>
                <button onClick={() => navigate('/docs')}
                  className="px-8 py-3.5 text-sm font-black bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-900 dark:text-slate-100 border-2 border-slate-300/50 dark:border-slate-600/50 rounded-md hover:border-slate-900 dark:hover:border-slate-100 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  {t('home.viewDocs')}
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Client Integration Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7 min-w-0">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden flex flex-col h-full ring-1 ring-[#F5A623]/20">
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <svg className="w-5 h-5 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /></svg>
                  {t('home.clientIntegration')}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-400 mt-1">{t('home.clientIntegrationDesc')}</p>
              </div>
              <div className="flex bg-white/60 dark:bg-slate-700/60 p-1 rounded-md border border-slate-200/50 dark:border-slate-600/50 overflow-x-auto shrink-0">
                {(['ide', 'chat', 'cli'] as const).map((tab) => (
                  <button key={tab} onClick={() => setCatTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-black rounded transition-all whitespace-nowrap ${
                      catTab === tab ? 'bg-[#F5A623] text-white shadow-sm' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}>
                    {tab === 'ide' ? t('home.ide') : tab === 'chat' ? t('home.chatApps') : t('home.cli')}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 flex flex-col md:flex-row gap-8 min-w-0">
              <div className="w-full md:w-56 shrink-0 space-y-3 border-r-0 md:border-r border-slate-200/50 dark:border-slate-700/50 pr-0 md:pr-6">
                {catClients.map((c) => (
                  <div key={c.id} onClick={() => setSelectedClientId(c.id)}
                    className={`p-4 rounded-md cursor-pointer border-2 transition-all ${
                      selectedClientId === c.id
                        ? 'border-[#F5A623]/50 bg-[#F5A623]/10 shadow-sm'
                        : 'border-transparent hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-base">{c.icon}</span>
                      <span className={`text-sm font-black truncate ${selectedClientId === c.id ? 'text-[#F5A623]' : 'text-slate-700 dark:text-slate-400'}`}>{c.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-1 min-w-0 space-y-6">
                {isAuthenticated && tokens.length > 0 ? (
                  <div className="flex items-center justify-between bg-white/50 dark:bg-slate-700/50 px-4 py-3 rounded-md border border-slate-200/50 dark:border-slate-600/50 overflow-hidden">
                    <span className="text-sm font-black text-slate-700 dark:text-slate-400 whitespace-nowrap shrink-0">{t('home.selectToken')}:</span>
                    <select value={selectedTokenId ?? ''} onChange={(e) => setSelectedTokenId(Number(e.target.value))}
                      className="text-sm bg-transparent border-none font-mono focus:ring-0 text-[#F5A623] font-black cursor-pointer outline-none w-full text-right truncate">
                      {tokens.map((tk) => (
                        <option key={tk.id} value={tk.id}>sk-{tk.key.slice(0, 4)}...{tk.key.slice(-4)}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="bg-white/50 dark:bg-slate-700/50 px-4 py-3 rounded-md border border-slate-200/50 dark:border-slate-600/50 text-sm font-black text-slate-500">
                    {isAuthenticated ? t('client.noKeys') : t('client.loginToSeeKey')}
                  </div>
                )}

                {selectedClient && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('home.configGuide')}</h4>
                    <ol className="space-y-4">
                      {selectedClient.setup.guiSteps?.(baseUrl, fullApiKey).slice(0, 2).map((step, i) => (
                        <li key={i} className="flex gap-4 text-sm font-black text-slate-900 dark:text-slate-200">
                          <svg className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                          <div className="w-full min-w-0">
                            <span>{step}</span>
                            {i === 1 && (
                              <div className="mt-3 bg-slate-900 text-white rounded-md p-3 text-xs font-mono overflow-x-auto whitespace-nowrap shadow-sm">
                                {baseUrl}/v1
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== BILLING BANNER ===== */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="flex items-center gap-6 mb-6 md:mb-0">
          <div className="w-14 h-14 rounded-md bg-white dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600 shadow-sm shrink-0">
            <svg className="w-6 h-6 text-slate-900 dark:text-slate-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 truncate">{t('home.featureBilling')}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-400 mt-1 truncate">{t('home.featureBillingDesc')}</p>
          </div>
        </div>
        <button onClick={() => navigate('/pricing')}
          className="px-8 py-4 text-sm font-black bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 shadow-sm rounded-md hover:border-[#F5A623] hover:text-[#F5A623] transition-all flex items-center gap-2 whitespace-nowrap shrink-0">
          {t('home.viewAllModels')}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      </div>

      {/* ===== ANNOUNCEMENTS ===== */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            {t('home.announcements')}
          </h2>
        </div>

        {noticeContent ? (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md">
            <div className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: noticeContent }} />
          </div>
        ) : (
          /* Fallback static announcements when backend returns empty */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'GPT-4o / Claude 4', desc: t('home.featureModelsDesc'), time: '2d', hot: true },
              { title: 'Claude 3.5 Sonnet', desc: t('home.featureSecureDesc'), time: '1w', hot: false },
              { title: t('home.featureFast'), desc: t('home.featureFastDesc'), time: '2w', hot: false },
            ].map((a, i) => (
              <Link key={i} to="/announcements">
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-md flex flex-col justify-between border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:border-[#F5A623]/50 transition-all cursor-pointer min-w-0 h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-2 h-2 rounded-sm shrink-0 ${a.hot ? 'bg-[#F5A623]' : 'bg-slate-400'}`} />
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100 truncate">{a.title}</h3>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-400 line-clamp-2 leading-relaxed font-black">{a.desc}</p>
                  </div>
                  <span className="text-xs text-slate-500 mt-6 font-mono font-black">{a.time}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ===== STATS / FEATURES ===== */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
          {t('home.features')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isAuthenticated && user ? (
            [
              { label: t('home.balance'), value: quotaToDisplay(user.quota) },
              { label: t('home.used'), value: quotaToDisplay(user.used_quota) },
              { label: t('home.requests'), value: user.request_count.toLocaleString() },
              { label: t('home.group'), value: user.group || 'default' },
            ].map((s) => (
              <div key={s.label} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-md flex flex-col justify-between border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-shadow min-w-0">
                <p className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4 truncate">{s.label}</p>
                <p className="text-3xl font-black font-mono tracking-tighter text-slate-900 dark:text-slate-100 truncate">{s.value}</p>
              </div>
            ))
          ) : (
            [
              { title: t('home.featureFast'), desc: t('home.featureFastDesc') },
              { title: t('home.featureSecure'), desc: t('home.featureSecureDesc') },
              { title: t('home.featureModels'), desc: t('home.featureModelsDesc') },
              { title: t('home.featureBilling'), desc: t('home.featureBillingDesc') },
            ].map((f, i) => (
              <div key={i} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-md border border-slate-200/50 dark:border-slate-700/50 shadow-md h-full">
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-700 dark:text-slate-400 font-bold">{f.desc}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
