import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}

const styles: Record<string, string> = {
  default: 'bg-[#F5EDE4] dark:bg-[#44403C] text-[#78716C] dark:text-[#A8A29E] border-[#E8DFD3] dark:border-[#57534E]',
  success: 'bg-[#F0FDF4] dark:bg-[#052E16] text-[#16A34A] dark:text-[#22C55E] border-[#16A34A]/20',
  warning: 'bg-[#FEFCE8] dark:bg-[#422006] text-[#CA8A04] dark:text-[#EAB308] border-[#CA8A04]/20',
  danger: 'bg-[#FEF2F2] dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border-[#DC2626]/20',
  info: 'bg-[#EFF6FF] dark:bg-[#172554] text-[#2563EB] dark:text-[#3B82F6] border-[#2563EB]/20',
  purple: 'bg-[#F5F3FF] dark:bg-[#2E1065] text-[#7C3AED] dark:text-[#A78BFA] border-[#7C3AED]/20',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => (
  <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', styles[variant], className)}>
    {children}
  </span>
);
