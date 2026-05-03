import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme/ThemeProvider';
import { quotaToDisplay } from '@/utils/quota';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { siteConfig } from '@/site.config';
import {
  Key, BarChart3, CreditCard, Settings, MessageSquare, Megaphone,
  User, LogOut, Wallet, Menu, X, Moon, Sun
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const publicLinks = [
    { path: '/', label: t('nav.home'), end: true },
    { path: '/clients', label: t('nav.clients') },
    { path: '/docs', label: t('nav.docs') },
    { path: '/pricing', label: t('nav.pricing') },
  ];

  const userLinks = [
    { path: '/tokens', label: t('nav.tokens'), icon: Key },
    { path: '/logs', label: t('nav.logs'), icon: BarChart3 },
    { path: '/topup', label: t('nav.topup'), icon: CreditCard },
    { path: '/profile', label: t('nav.profile'), icon: Settings },
    { path: '/announcements', label: t('nav.announcements'), icon: Megaphone },
    { path: '/support', label: t('nav.support'), icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between overflow-x-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-black text-xl tracking-tight text-slate-900 dark:text-slate-100 shrink-0">
          <img src={siteConfig.logo} alt={siteConfig.name} className="h-7 w-auto object-contain" />
          <span>{siteConfig.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-black shrink-0 mx-6">
          {publicLinks.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.end}
              className={({ isActive }) =>
                isActive
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
              }>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {/* Language & Theme */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-400">
            <LanguageSwitcher />
            <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all">
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="w-px h-5 bg-slate-300/50 dark:bg-slate-600/50 mx-1" />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Balance */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm font-black border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-md">
                <Wallet className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                {quotaToDisplay(user.quota)}
              </div>
              {/* Token Manager */}
              <Link to="/tokens"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm font-black hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0 whitespace-nowrap backdrop-blur-md">
                <Key className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                {t('nav.tokens')}
              </Link>
              {/* Avatar */}
              <div ref={menuRef} className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-md bg-slate-900 dark:bg-slate-100 flex items-center justify-center hover:-translate-y-0.5 transition-all shadow-md shrink-0 ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                  <User className="w-4 h-4 text-white dark:text-slate-900" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">{user.display_name || user.username}</p>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{user.group || 'default'}</p>
                    </div>
                    {userLinks.map((link) => (
                      <Link key={link.path} to={link.path} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                        <link.icon size={15} className="text-slate-400" /> {link.label}
                      </Link>
                    ))}
                    <div className="border-t border-slate-200/50 dark:border-slate-700/50 mt-1 pt-1">
                      <button onClick={async () => { setUserMenuOpen(false); await logout(); navigate('/login'); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-black w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={15} /> {t('common.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-black text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                {t('common.login')}
              </button>
              <button onClick={() => navigate('/register')}
                className="px-5 py-2 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm">
                {t('common.register')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-1">
            {publicLinks.map((link) => (
              <NavLink key={link.path} to={link.path} end={link.end} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-md text-sm font-black transition-colors ${isActive ? 'bg-[#F5A623]/10 text-[#F5A623]' : 'text-slate-700 dark:text-slate-300'}`
                }>{link.label}</NavLink>
            ))}
            {isAuthenticated && userLinks.map((link) => (
              <NavLink key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-black transition-colors ${isActive ? 'bg-[#F5A623]/10 text-[#F5A623]' : 'text-slate-700 dark:text-slate-300'}`
                }><link.icon size={15} /> {link.label}</NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};