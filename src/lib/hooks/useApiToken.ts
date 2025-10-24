'use client';

import { useAuthStore } from '@/lib/stores/authStore';
import { useTokenReady } from './useTokenReady';

export function useApiToken() {
  const { token, isAuthenticated } = useAuthStore();
  const isTokenReady = useTokenReady();

  return { token, isAuthenticated, isTokenReady };
}
