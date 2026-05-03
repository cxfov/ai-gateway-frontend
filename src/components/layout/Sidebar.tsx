import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home, Key, BarChart3, CreditCard, Settings,
  BookOpen, Blocks, MessageSquare, LogOut, ChevronLeft,
  ChevronRight, Megaphone, Zap
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { siteConfig } from '@/site.config';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const publicNav = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/announcements', icon: Megaphone, label: t('nav.announcements') },
    { path: '/clients', icon: Blocks, label: t('nav.clients') },
    { path: '/docs', icon: BookOpen, label: t('nav.docs') },
    { path: '/pricing', icon: Zap, label: t('nav.pricing') },
  ];
  const userNav = [
    { path: '/tokens', icon: Key, label: t('nav.tokens') },
    { path: '/logs', icon: BarChart3, label: t('nav.logs') },
    { path: '/topup', icon: CreditCard, label: t('nav.topup') },
    { path: '/profile', icon: Settings, label: t('nav.profile') },
  ];
  const helpNav = [
    { path: '/support', icon: MessageSquare, label: t('nav.support') },
  ];

  const renderLink = (item: { path: string; icon: any; label: string }) => (
    <NavLink
      key={item.path}
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-[var(--color-sidebar-active)] text-[var(--color-accent-text)] border-l-2 border-[var(--color-sidebar-active-border)]'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] border-l-2 border-transparent'
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
    >
      <item.icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );

  const renderDivider = (label: string) =>
    collapsed ? (
      <div key={label} className="h-px bg-[var(--color-border)] my-2" />
    ) : (
      <div key={label} className="px-3 pt-5 pb-1">
        <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</span>
      </div>
    );

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border)] ${collapsed ? 'w-[68px]' : 'w-[250px]'}`}>
      {/* Logo */}
      <div className={`flex items-center h-14 px-4 border-b border-[var(--color-border)] ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <img src={siteConfig.logo} alt="" className="w-8 h-8 shrink-0" />
        {!collapsed && (
          <span className="text-base font-bold text-[var(--color-text-primary)] truncate">{siteConfig.name}</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {publicNav.map(renderLink)}
        {isAuthenticated && (
          <>
            {renderDivider(t('nav.userCenter'))}
            {userNav.map(renderLink)}
          </>
        )}
        {renderDivider(t('nav.help'))}
        {helpNav.map(renderLink)}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] p-2 space-y-1">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
          <ThemeToggle />
          {!collapsed && <LanguageSwitcher />}
        </div>

        {isAuthenticated && user && !collapsed && (
          <div className="px-2 py-1.5 text-xs text-[var(--color-text-muted)] truncate">
            {user.display_name || user.username}
          </div>
        )}

        {isAuthenticated && (
          <button onClick={async () => { await logout(); navigate('/login'); }}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-all ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={16} />
            {!collapsed && t('common.logout')}
          </button>
        )}

        <button onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-xl text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-all ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};