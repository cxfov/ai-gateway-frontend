import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/api/endpoints';
import { quotaToDisplay } from '@/utils/quota';
import toast from 'react-hot-toast';

export const TopUpPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, fetchUser } = useAuthStore();
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);

  const activeAmount = customAmount || selectedAmount;
  const amounts = [
    { value: '10', label: '$10', bonus: '', tag: t('topup.basicPack') },
    { value: '50', label: '$50', bonus: '$2.50', tag: '' },
    { value: '100', label: '$100', bonus: '$10.00', tag: '' },
  ];

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setRedeemLoading(true);
    try {
      const res = await userApi.topUp(redeemCode.trim());
      if (res.data.success) {
        toast.success(t('topup.redeemSuccess', { amount: quotaToDisplay(res.data.data || 0) }));
        setRedeemCode('');
        fetchUser();
      } else toast.error(res.data.message);
    } catch { toast.error(t('common.failed')); }
    setRedeemLoading(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center justify-center md:justify-start gap-3">
          <svg className="w-7 h-7 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
          {t('topup.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold">{t('topup.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-8">
          {/* Redeem Code */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 md:p-8">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-6">{t('topup.redeemTitle')}</h2>
            <form onSubmit={handleRedeem} className="flex gap-3">
              <input type="text" placeholder={t('topup.redeemPlaceholder')} value={redeemCode} onChange={(e) => setRedeemCode(e.target.value)} required
                className="flex-1 px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-md text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50" />
              <button type="submit" disabled={redeemLoading}
                className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-black shadow-lg disabled:opacity-50">
                {redeemLoading ? t('common.loading') : t('topup.redeem')}
              </button>
            </form>
          </div>

          {/* Amount Selection */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">{t('topup.selectAmount')}</h2>
              <span className="text-xs font-black px-2.5 py-1 rounded bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20">{t('topup.bonusUpTo', { percent: '10' })}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amounts.map((a) => (
                <button key={a.value} onClick={() => { setSelectedAmount(a.value); setCustomAmount(''); }}
                  className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all ${
                    selectedAmount === a.value && !customAmount
                      ? 'bg-[#F5A623]/10 border-[#F5A623] shadow-sm'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-400 text-slate-600 dark:text-slate-400'
                  }`}>
                  <span className="text-xl font-black font-mono text-slate-900 dark:text-slate-100 mb-1">{a.label}</span>
                  <span className={`text-xs font-bold ${a.bonus ? 'text-[#F5A623]' : 'text-slate-400'}`}>
                    {a.bonus ? `${t('topup.bonus')} ${a.bonus}` : a.tag}
                  </span>
                </button>
              ))}
              <div className="relative w-full h-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">$</span>
                </div>
                <input type="number" placeholder={t('topup.customAmount')} value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); }}
                  className="w-full h-full pl-8 pr-3 py-4 text-center rounded-md bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#F5A623] transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 sticky top-28">
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl p-6 relative overflow-hidden border border-slate-700/50">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <h3 className="text-lg font-black mb-6 border-b border-slate-700 pb-4">{t('topup.orderSummary')}</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">{t('topup.currentBalance')}</span>
                <span className="text-sm font-mono font-black">{quotaToDisplay(user.quota)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">{t('topup.topupAmount')}</span>
                <span className="text-sm font-mono font-black">${activeAmount || '0'}</span>
              </div>
            </div>
            <button onClick={async () => {
              try {
                const res = await userApi.requestAmount({ amount: activeAmount, pay_type: 'wx' });
                if (res.data.success && res.data.data) window.open(res.data.data as string, '_blank');
                else toast.error(res.data.message || t('topup.payNotSupported'));
              } catch { toast.error(t('topup.payNotSupported')); }
            }}
              className="w-full py-4 bg-white text-slate-900 rounded-md text-sm font-black shadow-lg hover:bg-slate-100 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              {t('topup.securePayment')} ${activeAmount || '0'}
            </button>
            <p className="text-center text-xs text-slate-500 font-bold mt-4">{t('topup.encrypted')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};