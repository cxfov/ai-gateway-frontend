import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-black antialiased selection:bg-[#F5A623] selection:text-white relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/85" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        <main className="w-full max-w-7xl mx-auto px-6 pt-12 pb-24 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};