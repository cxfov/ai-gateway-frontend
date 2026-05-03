export interface User {
  id: number;
  username: string;
  display_name: string;
  role: number;
  status: number;
  email: string;
  quota: number;
  used_quota: number;
  request_count: number;
  group: string;
  aff_code: string;
  aff_count: number;
  aff_quota: number;
  aff_history_quota: number;
  inviter_id: number;
  access_token: string;
}

export interface LoginUser {
  id: number;
  username: string;
  display_name: string;
  role: number;
  status: number;
  group: string;
}

export interface Token {
  id: number;
  user_id: number;
  key: string;
  status: number;
  name: string;
  created_time: number;
  accessed_time: number;
  expired_time: number;
  remain_quota: number;
  unlimited_quota: boolean;
  used_quota: number;
  models: string;
  group: string;
  subnet: string;
  model_limits_enabled?: boolean;
  model_limits?: string;
  allow_ips?: string;
  cross_group_retry?: boolean;
  DeletedAt?: string | null;
}

export interface Log {
  id: number;
  user_id: number;
  created_at: number;
  type: number;
  content: string;
  username: string;
  token_name: string;
  model_name: string;
  quota: number;
  prompt_tokens: number;
  completion_tokens: number;
  channel: number;
  token_id: number;
  use_time: number;
  is_stream: boolean;
}

export interface LogStat {
  date: string;
  model_name: string;
  quota: number;
  prompt_tokens: number;
  completion_tokens: number;
  request_count: number;
}

export interface StatusData {
  version: string;
  start_time: number;
  email_verification: boolean;
  github_oauth: boolean;
  github_client_id: string;
  system_name: string;
  logo: string;
  footer_html: string;
  server_address: string;
  turnstile_check: boolean;
  turnstile_site_key: string;
  top_up_link: string;
  chat_link: string;
  quota_per_unit: number;
  display_in_currency: boolean;
  announcements_enabled: boolean;
  announcements: any[];
  auto_groups: string[];
  telegram_bot_name: string;
  telegram_oauth: boolean;
  theme: string;
  passkey_login: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  group_ratio?: Record<string, number>;
}

export interface PricingModel {
  model_name: string;
  vendor_id?: number;
  quota_type: number;
  model_ratio: number;
  model_price: number;
  owner_by: string;
  completion_ratio: number;
  enable_groups: string[];
  supported_endpoint_types: string[];
}

export interface PricingResponse {
  success?: boolean;
  message?: string;
  data: PricingModel[];
  auto_groups: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  pinned: boolean;
  created_at: number;
  updated_at: number;
}

export interface ClientDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'cli' | 'ide' | 'chat' | 'agent' | 'browser';
  platforms: string[];
  website: string;
  setup: {
    cliCommand?: (baseUrl: string, key: string) => string;
    envVars?: (baseUrl: string, key: string) => Record<string, string>;
    configFile?: (baseUrl: string, key: string) => {
      path: string;
      content: string;
      format: 'json' | 'yaml' | 'toml' | 'shell';
    };
    guiSteps?: (baseUrl: string, key: string) => string[];
    importUri?: (baseUrl: string, key: string) => string;
  };
}