import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hover, onClick }) => (
  <div onClick={onClick}
    className={clsx(
      'rounded-2xl bg-white dark:bg-[#292524] border border-[#E8DFD3] dark:border-[#44403C] shadow-sm transition-all duration-200',
      hover && 'hover:border-[#1C1917]/30 dark:hover:border-[#FAFAF9]/20 cursor-pointer',
      className
    )}>
    {children}
  </div>
);
