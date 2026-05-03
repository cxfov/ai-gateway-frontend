import React, { useState } from 'react';
import { copyToClipboard } from '@/utils/clipboard';
import { Copy, Check, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  downloadFilename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code, language, filename, showCopy = true, showDownload, downloadFilename,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(code, t('common.copied'));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename || filename || 'config.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-[#E8DFD3] dark:border-[#44403C] overflow-hidden">
      {(filename || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#F5EDE4] dark:bg-[#1C1917] border-b border-[#E8DFD3] dark:border-[#44403C]">
          <span className="text-xs text-[#A8A29E] dark:text-[#78716C] font-mono">{filename || language || ''}</span>
          <div className="flex gap-1">
            {showDownload && (
              <button onClick={handleDownload} className="p-1 rounded hover:bg-white/50 dark:hover:bg-white/10 text-[#A8A29E] transition-colors">
                <Download size={14} />
              </button>
            )}
            {showCopy && (
              <button onClick={handleCopy} className="p-1 rounded hover:bg-white/50 dark:hover:bg-white/10 text-[#A8A29E] transition-colors">
                {copied ? <Check size={14} className="text-[#16A34A]" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-[#1C1917] text-sm leading-relaxed">
        <code className="text-[#FAFAF9] font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};
