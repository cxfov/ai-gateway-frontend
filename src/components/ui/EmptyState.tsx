import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-[#A8A29E] dark:text-[#78716C] mb-3">{icon}</div>
    <p className="text-[#57534E] dark:text-[#D6D3D1] font-medium mb-1">{title}</p>
    {description && <p className="text-sm text-[#A8A29E] dark:text-[#78716C] mb-4">{description}</p>}
    {action}
  </div>
);
