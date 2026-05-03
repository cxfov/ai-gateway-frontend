export function quotaToDisplay(
  quota: number,
  quotaPerUnit = 500000
): string {
  if (quotaPerUnit <= 0) quotaPerUnit = 500000;
  const dollars = quota / quotaPerUnit;
  if (Math.abs(dollars) >= 0.01) return `$${dollars.toFixed(2)}`;
  if (Math.abs(quota) >= 1000) return `${(quota / 1000).toFixed(1)}k`;
  return `${quota}`;
}

export function formatTimestamp(ts: number): string {
  if (ts <= 0 || ts === -1) return '∞';
  const d = new Date(ts * 1000);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 2_592_000_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function getTokenStatusInfo(status: number) {
  switch (status) {
    case 1: return { label: 'token.statusEnabled', color: 'text-emerald-600 dark:text-emerald-400' };
    case 2: return { label: 'token.statusDisabled', color: 'text-red-600 dark:text-red-400' };
    case 3: return { label: 'token.statusExpired', color: 'text-amber-600 dark:text-amber-400' };
    case 4: return { label: 'token.statusDepleted', color: 'text-orange-600 dark:text-orange-400' };
    default: return { label: 'common.unknown', color: 'text-stone-500' };
  }
}

export function getLogTypeInfo(type: number) {
  switch (type) {
    case 1: return { label: 'log.typeTopUp', variant: 'success' as const };
    case 2: return { label: 'log.typeConsume', variant: 'info' as const };
    case 3: return { label: 'log.typeAdmin', variant: 'purple' as const };
    case 4: return { label: 'log.typeSystem', variant: 'warning' as const };
    default: return { label: 'common.other', variant: 'default' as const };
  }
}