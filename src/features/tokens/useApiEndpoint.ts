import { useMemo } from 'react';
import { siteConfig } from '@/site.config';
import { useAuthStore } from '@/store/authStore';

/**
 * Returns the API Base URL to show users for client configuration.
 * Priority: siteConfig.apiEndpoint > serverAddress from backend > current origin
 */
export function useApiEndpoint(): string {
  const { serverAddress } = useAuthStore();

  return useMemo(() => {
    if (siteConfig.apiEndpoint) return siteConfig.apiEndpoint;
    if (serverAddress) return serverAddress;
    return window.location.origin;
  }, [serverAddress]);
}