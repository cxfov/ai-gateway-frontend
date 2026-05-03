import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginUser, PricingModel } from '@/types';
import { authApi, userApi, systemApi, tokenApi } from '@/api/endpoints';
import toast from 'react-hot-toast';
import i18n from '@/i18n';

interface AuthState {
  user: User | null;
  loginUser: LoginUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  autoGroups: string[];
  allGroups: string[];
  pricingModels: PricingModel[];
  serverAddress: string;

  login: (username: string, password: string) => Promise<boolean>;
  register: (data: {
    username: string;
    password: string;
    email?: string;
    aff_code?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<boolean>;
  fetchPricingData: () => Promise<void>;
  fetchServerAddress: () => Promise<string>;
  autoCreateGroupTokens: () => Promise<number>;
  getDisplayUser: () => Partial<User>;
}

function loginUserToUser(lu: LoginUser): User {
  return {
    id: lu.id,
    username: lu.username,
    display_name: lu.display_name,
    role: lu.role,
    status: lu.status,
    group: lu.group,
    email: '',
    quota: 0,
    used_quota: 0,
    request_count: 0,
    aff_code: '',
    aff_count: 0,
    aff_quota: 0,
    aff_history_quota: 0,
    inviter_id: 0,
    access_token: '',
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loginUser: null,
      isAuthenticated: false,
      isLoading: false,
      autoGroups: [],
      allGroups: [],
      pricingModels: [],
      serverAddress: '',

      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ username, password });
          if (!res.data.success) {
            toast.error(res.data.message || i18n.t('common.failed'));
            set({ isLoading: false });
            return false;
          }
          const loginUser = res.data.data as LoginUser;
          set({
            loginUser,
            user: loginUserToUser(loginUser),
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success(i18n.t('auth.loginSuccess'));
          get().fetchUser();
          get().fetchPricingData();
          get().fetchServerAddress();
          return true;
        } catch (e: any) {
          toast.error(e?.response?.data?.message || 'Network error');
          set({ isLoading: false });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(data);
          if (!res.data.success) {
            toast.error(res.data.message || i18n.t('common.failed'));
            set({ isLoading: false });
            return false;
          }
          toast.success(i18n.t('auth.registerSuccess'));
          set({ isLoading: false });
          return true;
        } catch (e: any) {
          toast.error(e?.response?.data?.message || 'Network error');
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch {}
        set({ user: null, loginUser: null, isAuthenticated: false });
        toast.success(i18n.t('common.success'));
      },

      fetchUser: async () => {
        try {
          const res = await userApi.getSelf();
          if (res.data.success && res.data.data) {
            set({ user: res.data.data, isAuthenticated: true });
            return true;
          }
        } catch (e) {
          console.warn('[Auth] fetchUser failed, keeping login state:', e);
        }
        return false;
      },

      fetchPricingData: async () => {
        try {
          const res = await systemApi.getPricing();
          if (res.data) {
            const models = Array.isArray(res.data.data) ? res.data.data : [];
            const autoGroups = Array.isArray(res.data.auto_groups) ? res.data.auto_groups : [];
            const groupSet = new Set<string>();
            for (const m of models) {
              if (Array.isArray(m.enable_groups)) {
                for (const g of m.enable_groups) {
                  if (g !== 'admin') groupSet.add(g);
                }
              }
            }
            for (const g of autoGroups) {
              if (g !== 'admin') groupSet.add(g);
            }
            set({
              pricingModels: models,
              autoGroups: autoGroups.filter((g) => g !== 'admin'),
              allGroups: Array.from(groupSet).sort(),
            });
          }
        } catch {}
      },

      fetchServerAddress: async () => {
        try {
          const res = await systemApi.getStatus();
          if (res.data.success && res.data.data?.server_address) {
            set({ serverAddress: res.data.data.server_address });
            return res.data.data.server_address;
          }
        } catch {}
        return '';
      },

      autoCreateGroupTokens: async () => {
        const t = i18n.t;
        toast.loading(t('auth.creatingKeys'), { id: 'auto-keys' });
        try {
          await get().fetchPricingData();
          const { autoGroups } = get();
          if (autoGroups.length === 0) {
            toast.dismiss('auto-keys');
            return 0;
          }
          let existingGroups = new Set<string>();
          try {
            const existingRes = await tokenApi.getAll(0);
            if (existingRes.data.success && existingRes.data.data) {
              const raw: any = existingRes.data.data;
              const items: any[] = Array.isArray(raw) ? raw : (raw.items || []);
              existingGroups = new Set(
                items.map((tk: any) => tk.group).filter(Boolean)
              );
            }
          } catch {
            toast.dismiss('auto-keys');
            return 0;
          }
          let created = 0;
          for (const group of autoGroups) {
            if (existingGroups.has(group)) continue;
            try {
              const res = await tokenApi.create({
                name: group,
                group: group,
                unlimited_quota: true,
                expired_time: -1,
              });
              if (res.data.success) created++;
            } catch {}
          }
          if (created > 0) {
            toast.success(t('auth.keysCreated', { count: created }), { id: 'auto-keys' });
          } else {
            toast.dismiss('auto-keys');
          }
          return created;
        } catch {
          toast.dismiss('auto-keys');
          return 0;
        }
      },

      getDisplayUser: () => {
        const state = get();
        if (state.user) return state.user;
        if (state.loginUser) return loginUserToUser(state.loginUser);
        return {} as Partial<User>;
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        loginUser: state.loginUser,
        isAuthenticated: state.isAuthenticated,
        autoGroups: state.autoGroups,
        allGroups: state.allGroups,
        serverAddress: state.serverAddress,
      }),
    }
  )
);