import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const opts = [
    { value: 'light' as const, icon: Sun },
    { value: 'dark' as const, icon: Moon },
    { value: 'system' as const, icon: Monitor },
  ];
  return (
    <div className="flex gap-0.5 p-0.5 rounded-lg bg-[#F5EDE4] dark:bg-[#1C1917] border border-[#E8DFD3] dark:border-[#44403C]">
      {opts.map((o) => (
        <button key={o.value} onClick={() => setTheme(o.value)}
          className={`p-1.5 rounded-md transition-all ${
            theme === o.value
              ? 'bg-[#FFF7ED] dark:bg-[#431407] text-[#C2410C] dark:text-[#FB923C] shadow-sm'
              : 'text-[#A8A29E] dark:text-[#78716C] hover:text-[#1C1917] dark:hover:text-[#FAFAF9]'
          }`}>
          <o.icon size={14} />
        </button>
      ))}
    </div>
  );
};
