import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-[#57534E] dark:text-[#D6D3D1]">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A8A29E]">{icon}</div>}
      <input
        className={clsx(
          'w-full rounded-xl bg-white dark:bg-[#1C1917] border border-[#E8DFD3] dark:border-[#44403C] text-[#1C1917] dark:text-[#FAFAF9] placeholder-[#A8A29E] dark:placeholder-[#78716C]',
          'focus:outline-none focus:ring-2 focus:ring-[#C2410C]/30 focus:border-[#C2410C] dark:focus:ring-[#FB923C]/30 dark:focus:border-[#FB923C] transition-all duration-200',
          icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
          'text-sm',
          error && 'border-[#DC2626]/50',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-[#DC2626] dark:text-[#EF4444]">{error}</p>}
  </div>
);
