'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { apiClient } from '@/lib/api/client';

export function useTokenReady() {
  const { token, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      // Garantir que o token esteja definido no API client
      apiClient.setAuthToken(token);
      setIsReady(true);
      console.log('🔑 Token pronto para requisições:', token.substring(0, 20) + '...');
    } else {
      apiClient.clearAuthToken();
      setIsReady(false);
    }
  }, [token, isAuthenticated]);

  return isReady;
}
