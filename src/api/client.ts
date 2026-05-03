import axios from 'axios';

const client = axios.create({
  baseURL: '',
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Inject New-Api-User header with user ID from localStorage
client.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('auth-store');
      if (stored) {
        const parsed = JSON.parse(stored);
        const state = parsed?.state;
        const userId = state?.user?.id || state?.loginUser?.id;
        if (userId) {
          config.headers['New-Api-User'] = String(userId);
        }
      }
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] 401:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default client;