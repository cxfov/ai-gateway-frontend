import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';
  const variants: Record<string, string> = {
    primary: 'bg-[#1C1917] dark:bg-[#FAFAF9] text-white dark:text-[#1C1917] hover:opacity-90 shadow-md',
    secondary: 'bg-transparent text-[#1C1917] dark:text-[#FAFAF9] border border-[#D4C8B8] dark:border-[#57534E] hover:border-[#1C1917] dark:hover:border-[#FAFAF9]',
    ghost: 'bg-transparent text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#FAFAF9] hover:bg-[#F5EDE4]/50 dark:hover:bg-[#44403C]/50',
    danger: 'bg-[#FEF2F2] dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border border-[#DC2626]/20 hover:bg-[#DC2626] hover:text-white',
    success: 'bg-[#F0FDF4] dark:bg-[#052E16] text-[#16A34A] dark:text-[#22C55E] border border-[#16A34A]/20',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-sm gap-2',
  };
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      ) : icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
};
