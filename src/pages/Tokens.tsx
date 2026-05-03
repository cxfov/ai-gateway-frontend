import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { Modal, Input, CopyButton } from '@/components/ui';
import { useTokens } from '@/features/tokens/useTokens';
import { useApiEndpoint } from '@/features/tokens/useApiEndpoint';
import { useAuthStore } from '@/store/authStore';
import { formatTimestamp, quotaToDisplay } from '@/utils/quota';
import { copyToClipboard } from '@/utils/clipboard';

export const TokensPage: React.FC = () => {
  const { t } = useTranslation();
  const { tokens, loading, fetch, create, remove, toggle } = useTokens();
  const baseUrl = useApiEndpoint();
  const [showCreate, setShowCreate] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});

  const activeCount = tokens.filter((tk) => tk.status === 1).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /><circle cx="16.5" cy="7.5" r=".5" /></svg>
            {t('token.title')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold">{t('token.subtitle')}</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-6 py-3 text-sm font-black bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md shadow-lg flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-0.5 transition-all">
          <Plus size={16} strokeWidth={2.5} />
          {t('token.createToken')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div>
            <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('token.activeTokens')}</p>
            <p className="text-2xl font-black font-mono">{activeCount} <span className="text-sm text-slate-400">/ {tokens.length}</span></p>
          </div>
        </div>
      </div>

      {/* Token List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">{t('common.loading')}</div>
      ) : tokens.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-12 text-center">
          <p className="text-slate-500 font-bold mb-4">{t('token.noTokensDesc')}</p>
          <button onClick={() => setShowCreate(true)} className="px-6 py-3 text-sm font-black bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md shadow-lg">
            {t('token.createFirst')}
          </button>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden md:grid">
            <div className="col-span-3 pl-2">{t('token.name')}</div>
            <div className="col-span-4">API Key</div>
            <div className="col-span-2 text-right">{t('token.usedQuota')}</div>
            <div className="col-span-3 text-right pr-2">{t('common.edit')}</div>
          </div>

          {/* Token Rows */}
          {tokens.map((tk, i) => {
            const vis = visibleKeys[tk.id];
            const isActive = tk.status === 1;
            return (
              <motion.div key={tk.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-5 border-b border-slate-200/50 dark:border-slate-700/50 items-center hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors ${!isActive ? 'opacity-70' : ''}`}>
                {/* Name */}
                <div className="col-span-12 md:col-span-3 flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <div className="truncate">
                    <p className={`text-sm font-black truncate ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 line-through'}`}>{tk.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{formatTimestamp(tk.created_time)}</p>
                  </div>
                </div>

                {/* API Key */}
                <div className="col-span-12 md:col-span-4 min-w-0 mt-2 md:mt-0">
                  <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 w-full">
                    <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 truncate w-full">
                      {vis ? `sk-${tk.key}` : `sk-${tk.key.slice(0, 5)}...${tk.key.slice(-5)}`}
                    </span>
                    <button onClick={() => setVisibleKeys((p) => ({ ...p, [tk.id]: !p[tk.id] }))}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0">
                      {vis ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => copyToClipboard(`sk-${tk.key}`, t('common.copied'))}
                      className="text-slate-400 hover:text-[#F5A623] transition-colors shrink-0" title={t('common.copy')}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    </button>
                  </div>
                </div>

                {/* Used Quota */}
                <div className="col-span-12 md:col-span-2 text-left md:text-right mt-2 md:mt-0">
                  <p className="text-sm font-black font-mono text-slate-900 dark:text-slate-100">{quotaToDisplay(tk.used_quota)}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{tk.unlimited_quota ? t('token.noLimit') : quotaToDisplay(tk.remain_quota)}</p>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-3 flex justify-start md:justify-end gap-2 mt-4 md:mt-0">
                  <button onClick={() => toggle(tk)}
                    className={`px-3 py-1.5 text-xs font-black border shadow-sm rounded transition-all ${isActive
                      ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400'
                      : 'bg-white dark:bg-slate-700 text-emerald-600 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white'}`}>
                    {isActive ? t('common.disabled') : t('token.enable')}
                  </button>
                  <button onClick={() => { if (confirm(t('token.deleteConfirm'))) remove(tk.id); }}
                    className="px-3 py-1.5 text-xs font-black bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 shadow-sm rounded hover:bg-red-600 hover:text-white transition-all">
                    {t('common.delete')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <CreateTokenModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={create} />
    </div>
  );
};

const CreateTokenModal: React.FC<{ open: boolean; onClose: () => void; onCreate: (d: any) => Promise<any> }> = ({ open, onClose, onCreate }) => {
  const { t } = useTranslation();
  const { autoGroups, allGroups } = useAuthStore();
  const groups = autoGroups.length > 0 ? autoGroups : allGroups;
  const [form, setForm] = useState({ name: '', group: groups[0] || 'default', unlimited_quota: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (groups.length > 0 && !groups.includes(form.group)) setForm((p) => ({ ...p, group: groups[0] }));
  }, [groups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onCreate({ name: form.name, group: form.group, unlimited_quota: form.unlimited_quota, expired_time: -1 });
    setLoading(false);
    onClose();
    setForm({ name: '', group: groups[0] || 'default', unlimited_quota: true });
  };

  return (
    <Modal open={open} onClose={onClose} title={t('token.createTitle')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('token.name')}</label>
          <input type="text" placeholder={t('token.namePlaceholder')} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required
            className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('token.group')}</label>
          <select value={form.group} onChange={(e) => setForm((p) => ({ ...p, group: e.target.value }))}
            className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 transition-all">
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={form.unlimited_quota} onChange={(e) => setForm((p) => ({ ...p, unlimited_quota: e.target.checked }))} className="w-4 h-4 rounded" />
          {t('token.unlimitedQuota')}
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-black shadow-lg disabled:opacity-50">
            {loading ? t('common.loading') : t('common.create')}
          </button>
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md text-sm font-black">
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </Modal>
  );
};