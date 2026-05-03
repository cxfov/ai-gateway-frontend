import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { useAuthStore } from '@/store/authStore';

import { HomePage } from '@/pages/Home';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { TokensPage } from '@/pages/Tokens';
import { LogsPage } from '@/pages/Logs';
import { TopUpPage } from '@/pages/TopUp';
import { ProfilePage } from '@/pages/Profile';
import { AnnouncementsPage } from '@/pages/Announcements';
import { ClientsPage } from '@/pages/Clients';
import { DocsPage } from '@/pages/Docs';
import { PricingPage } from '@/pages/Pricing';
import { SupportPage } from '@/pages/Support';
import { PrivacyPage } from '@/pages/Privacy';
import { TermsPage } from '@/pages/Terms';

const App: React.FC = () => {
  const { isAuthenticated, fetchPricingData, fetchServerAddress } = useAuthStore();

  useEffect(() => {
    fetchPricingData();
    fetchServerAddress();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      useAuthStore.getState().fetchUser();
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/tokens" element={<AuthGuard><TokensPage /></AuthGuard>} />
        <Route path="/logs" element={<AuthGuard><LogsPage /></AuthGuard>} />
        <Route path="/topup" element={<AuthGuard><TopUpPage /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
      </Route>
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-black text-slate-300 mb-4">404</h1>
            <a href="/" className="text-sm font-bold text-[#F5A623] hover:underline">← Back to Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default App;
