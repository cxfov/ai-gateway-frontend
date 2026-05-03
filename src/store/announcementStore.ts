import { create } from 'zustand';
import { systemApi } from '@/api/endpoints';

interface AnnouncementState {
  noticeContent: string;
  loading: boolean;
  fetchNotice: () => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementState>()((set) => ({
  noticeContent: '',
  loading: false,

  fetchNotice: async () => {
    set({ loading: true });
    try {
      const res = await systemApi.getNotice();
      if (res.data.success && res.data.data) {
        set({ noticeContent: res.data.data });
      }
    } catch {}
    set({ loading: false });
  },
}));
