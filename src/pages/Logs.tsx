import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { logApi } from '@/api/endpoints';
import { formatTimestamp, quotaToDisplay } from '@/utils/quota';
import type { Log } from '@/types';
import toast from 'react-hot-toast';

function extractLogs(data: any): Log[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.items && Array.isArray(data.items)) return data.items;
  return [];
}

export const LogsPage: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [logType, setLogType] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { p: page };
      if (logType > 0) params.type = logType;
      const res = await logApi.getUserLogs(params);
      if (res.data.success) setLogs(extractLogs(res.data.data));
    } catch { toast.error(t('common.failed')); }
    setLoading(false);
  }, [page, logType, t]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <svg className="w-7 h-7 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            {t('log.title')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold">{t('log.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={logType} onChange={(e) => { setLogType(Number(e.target.value)); setPage(0); }}
            className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 backdrop-blur-sm shadow-sm cursor-pointer">
            <option value={0}>{t('log.allTypes')}</option>
            <option value={2}>{t('log.requestSuccess')}</option>
            <option value={1}>{t('log.requestFailed')}</option>
          </select>
          <button onClick={fetchLogs}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-black shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            {t('log.exportCSV')}
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">{t('common.loading')}</div>
      ) : logs.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-12 text-center text-slate-500 font-bold">{t('log.noLogs')}</div>
      ) : (
        <>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden md:grid">
              <div className="col-span-3 pl-2">{t('log.time')}</div>
              <div className="col-span-3">{t('log.model')}</div>
              <div className="col-span-3 text-right">{t('log.tokens')}</div>
              <div className="col-span-1 text-right">{t('log.quota')}</div>
              <div className="col-span-2 text-right pr-2">{t('log.status')}</div>
            </div>

            {logs.map((log, i) => {
              const isError = log.quota === 0 && log.prompt_tokens === 0;
              return (
                <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-5 border-b border-slate-200/50 dark:border-slate-700/50 items-center hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="col-span-12 md:col-span-3 flex flex-col md:pl-2">
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100">{formatTimestamp(log.created_at).split(' ')[0]}</span>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">{formatTimestamp(log.created_at).split(' ')[1]}</span>
                  </div>
                  <div className="col-span-12 md:col-span-3 flex items-center gap-2 min-w-0 mt-2 md:mt-0">
                    <span className="px-2 py-1 bg-slate-100/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono font-black text-slate-700 dark:text-slate-300 truncate max-w-full">
                      {log.model_name || '-'}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-3 text-left md:text-right mt-2 md:mt-0">
                    <span className="text-sm font-mono font-black text-slate-700 dark:text-slate-300">
                      {(log.prompt_tokens ?? 0).toLocaleString()} <span className="text-slate-400 font-bold mx-1">/</span> {(log.completion_tokens ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-1 text-left md:text-right mt-2 md:mt-0">
                    <span className={`text-sm font-mono font-black ${isError ? 'text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {quotaToDisplay(log.quota ?? 0)}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-2 text-left md:text-right mt-2 md:mt-0 flex justify-start md:justify-end md:pr-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black shadow-sm ${
                      isError
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {isError ? 'ERROR' : 'SUCCESS'}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm font-black border border-slate-200 dark:border-slate-600 rounded-md bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 disabled:opacity-40">
              {t('common.prevPage')}
            </button>
            <span className="text-xs font-bold text-slate-500">{t('common.page', { page: page + 1 })}</span>
            <button disabled={logs.length < 10} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-black border border-slate-200 dark:border-slate-600 rounded-md bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 disabled:opacity-40">
              {t('common.nextPage')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};