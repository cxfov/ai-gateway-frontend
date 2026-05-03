import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, pricingModels, allGroups, fetchPricingData } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { setLoading(true); fetchPricingData().finally(() => setLoading(false)); }, [fetchPricingData]);

  const filtered = useMemo(() => {
    let models = pricingModels;
    if (selectedGroup !== 'all') models = models.filter((m) => m.enable_groups.includes(selectedGroup));
    if (search) models = models.filter((m) => m.model_name.toLowerCase().includes(search.toLowerCase()));
    return models.sort((a, b) => a.model_name.localeCompare(b.model_name));
  }, [pricingModels, selectedGroup, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            {t('pricing.title')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold">{t('pricing.subtitle')}</p>
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <input type="text" placeholder={t('pricing.searchModel')} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 backdrop-blur-sm shadow-sm" />
        </div>
      </div>

      {/* Group Filter */}
      <div className="flex bg-white/70 dark:bg-slate-800/70 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto shadow-sm backdrop-blur-xl w-fit">
        <button onClick={() => setSelectedGroup('all')}
          className={`px-5 py-2 text-sm font-black rounded-lg whitespace-nowrap transition-all ${selectedGroup === 'all' ? 'bg-[#F5A623] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>
          {t('pricing.allModels')}
        </button>
        {allGroups.map((g) => (
          <button key={g} onClick={() => setSelectedGroup(g)}
            className={`px-5 py-2 text-sm font-black rounded-lg whitespace-nowrap transition-all ${selectedGroup === g ? 'bg-[#F5A623] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>
            {g}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">{t('common.loading')}</div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 text-xs font-black text-slate-500 uppercase tracking-widest hidden md:grid">
            <div className="col-span-5 pl-2">{t('pricing.model')}</div>
            <div className="col-span-2 text-right">{t('pricing.inputPrice')}</div>
            <div className="col-span-2 text-right">{t('pricing.outputPrice')}</div>
            <div className="col-span-3 text-right pr-2">Groups</div>
          </div>
          {filtered.map((model, i) => (
            <motion.div key={model.model_name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-5 border-b border-slate-200/50 dark:border-slate-700/50 items-center hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors">
              <div className="col-span-12 md:col-span-5 flex items-center gap-3 min-w-0">
                <div className="truncate">
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">{model.model_name}</p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-2 text-left md:text-right mt-2 md:mt-0">
                <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{model.model_ratio}x</span>
              </div>
              <div className="col-span-12 md:col-span-2 text-left md:text-right mt-2 md:mt-0">
                <span className="text-sm font-mono font-black text-orange-600 dark:text-orange-400">{model.completion_ratio}x</span>
              </div>
              <div className="col-span-12 md:col-span-3 text-left md:text-right mt-2 md:mt-0 pr-2">
                <div className="flex flex-wrap gap-1 justify-start md:justify-end">
                  {model.enable_groups.filter((g) => g !== 'admin').map((g) => (
                    <span key={g} className={`text-[10px] px-1.5 py-0.5 rounded font-black ${user?.group === g ? 'bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>{g}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          <div className="px-4 py-3 text-xs font-bold text-slate-500">{filtered.length} models</div>
        </div>
      )}
    </div>
  );
};