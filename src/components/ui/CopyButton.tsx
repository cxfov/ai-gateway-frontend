import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/utils/clipboard';
import { useTranslation } from 'react-i18next';

export const CopyButton: React.FC<{ text: string; label?: string; className?: string }> = ({ text, label, className }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const ok = await copyToClipboard(text, t('common.copied'));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <button onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
        copied
          ? 'bg-[#F0FDF4] dark:bg-[#052E16] text-[#16A34A] dark:text-[#22C55E]'
          : 'bg-[#F5EDE4] dark:bg-[#44403C] text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#FAFAF9]'
      } ${className || ''}`}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {label || (copied ? t('common.copied') : t('common.copy'))}
    </button>
  );
};
