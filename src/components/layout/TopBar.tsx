import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LogIn, Wallet, Key, Menu, X, TerminalSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { quotaToDisplay } from '@/utils/quota';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const TopBar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home') || 'Home' },
    { path: '/clients', label: t('nav.clients') || 'Clients' },
    { path: '/docs', label: t('nav.docs') || 'Docs' },
    { path: '/pricing', label: t('nav.pricing') || 'Pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 bg-[#FAF6F1]/80 backdrop-blur-xl border-b border-[#E8DFD3] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* 左侧 Logo */}
        <Link to="/" className="flex items-center gap-3 font-bold text-lg tracking-tight text-[#C2410C]">
          <TerminalSquare size={24} strokeWidth={2.5} />
          <span>AI GATEWAY</span>
        </Link>

        {/* PC端 中部主导航 */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`transition-colors ${
                location.pathname === link.path 
                  ? 'text-[#1C1917] font-bold' 
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* PC端 右侧操作区 */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#78716C]">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          
          <div className="w-px h-4 bg-[#E8DFD3] mx-1"></div>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 text-[#1C1917] text-xs font-bold border border-[#E8DFD3] shadow-sm">
                <Wallet size={14} className="text-[#A8A29E]" />
                {quotaToDisplay(user.quota)}
              </div>
              <Link to="/tokens" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent text-[#1C1917] text-xs font-bold hover:bg-white/80 transition-all border border-[#E8DFD3] shadow-sm">
                <Key size={14} className="text-[#A8A29E]" />
                {t('nav.tokens') || 'API Keys'}
              </Link>
              <Link to="/profile" className="w-8 h-8 rounded-full bg-[#1C1917] flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm">
                <User size={14} className="text-[#FAF6F1]" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1C1917] hover:text-[#C2410C] transition-colors">
                <LogIn size={14} /> {t('common.login')}
              </button>
              <button onClick={() => navigate('/register')} className="px-4 py-1.5 rounded-lg bg-[#1C1917] text-white text-xs font-bold hover:bg-[#292524] transition-colors shadow-sm">
                {t('common.register')}
              </button>
            </div>
          )}
        </div>

        {/* 移动端菜单按钮 */}
        <button className="md:hidden p-2 text-[#1C1917]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#FAF6F1] border-b border-[#E8DFD3] shadow-lg p-4 flex flex-col gap-4 z-50">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[#1C1917] p-2 rounded-lg hover:bg-[#E8DFD3]/50">
              {link.label}
            </Link>
          ))}
          <div className="h-px w-full bg-[#E8DFD3]"></div>
          <div className="flex justify-between items-center p-2">
             <LanguageSwitcher />
             <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
};