import client from './client';
import type { ApiResponse, User, LoginUser, Token, Log, LogStat, StatusData, PricingResponse } from '@/types';

export const authApi = {
  register: (data: {
    username: string;
    password: string;
    email?: string;
    verification_code?: string;
    aff_code?: string;
  }) => client.post<ApiResponse>('/api/user/register', data),

  login: (data: { username: string; password: string }) =>
    client.post<ApiResponse<LoginUser>>('/api/user/login', data),

  logout: () => client.get<ApiResponse>('/api/user/logout'),
};

export const userApi = {
  getSelf: () => client.get<ApiResponse<User>>('/api/user/self'),

  updateSelf: (data: { display_name?: string; password?: string }) =>
    client.put<ApiResponse>('/api/user/self', data),

  deleteSelf: () => client.delete<ApiResponse>('/api/user/self'),

  getAffCode: () => client.get<ApiResponse<string>>('/api/user/aff'),

  topUp: (key: string) =>
    client.post<ApiResponse<number>>('/api/user/topup', { key }),

  requestAmount: (data: {
    amount: string;
    pay_type: string;
    top_up_code?: string;
  }) => client.post<ApiResponse>('/api/user/amount', data),
};

export const tokenApi = {
  getAll: (p = 0, order = '') =>
    client.get<ApiResponse<any>>('/api/token/', { params: { p, order } }),

  search: (keyword: string, p = 0, order = '') =>
    client.get<ApiResponse<any>>('/api/token/search', {
      params: { keyword, p, order },
    }),

  get: (id: number) => client.get<ApiResponse<Token>>(`/api/token/${id}`),

  create: (data: Partial<Token>) =>
    client.post<ApiResponse<Token>>('/api/token/', data),

  update: (data: Partial<Token>) =>
    client.put<ApiResponse<Token>>('/api/token/', data),

  delete: (id: number) => client.delete<ApiResponse>(`/api/token/${id}`),
};

export const logApi = {
  getUserLogs: (params: {
    p?: number;
    type?: number;
    start_timestamp?: number;
    end_timestamp?: number;
    order?: string;
  }) => client.get<ApiResponse<any>>('/api/log/self', { params }),

  searchUserLogs: (params: {
    keyword: string;
    p?: number;
    type?: number;
    start_timestamp?: number;
    end_timestamp?: number;
    order?: string;
  }) => client.get<ApiResponse<any>>('/api/log/self/search', { params }),

  getSelfStat: (params: {
    type?: number;
    start_timestamp?: number;
    end_timestamp?: number;
    token_name?: string;
    model_name?: string;
  }) => client.get<ApiResponse<LogStat[]>>('/api/log/self/stat', { params }),
};

export const systemApi = {
  getStatus: () => client.get<ApiResponse<StatusData>>('/api/status'),

  getNotice: () => client.get<ApiResponse<string>>('/api/notice'),

  getModels: () => client.get<ApiResponse<string[]>>('/api/models/list'),

  getPricing: () => client.get<PricingResponse>('/api/pricing'),
};