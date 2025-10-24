'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/api/auth';

export function useTokenRefresh() {
  const { token, refreshToken, isAuthenticated, setToken, logout } = useAuthStore();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token || !refreshToken) {
      return;
    }

    // Função para decodificar o JWT e obter a expiração
    const getTokenExpiration = (token: string): number | null => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? payload.exp * 1000 : null; // Converter para milliseconds
      } catch {
        return null;
      }
    };

    // Função para renovar o token
    const refreshTokenIfNeeded = async () => {
      try {
        console.log('🔄 Renovando token automaticamente...');
        const response = await authService.refreshToken(refreshToken);
        setToken(response.accessToken);
        console.log('✅ Token renovado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao renovar token:', error);
        logout();
      }
    };

    // Limpar timeout anterior
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const expirationTime = getTokenExpiration(token);
    if (expirationTime) {
      const now = new Date().getTime();
      const timeUntilExpiry = expirationTime - now;
      
      // Renovar o token 5 minutos antes de expirar (15m - 5m = 10m)
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
      
      console.log(`⏰ Token expira em ${Math.round(timeUntilExpiry / 60000)} minutos. Renovando em ${Math.round(refreshTime / 60000)} minutos.`);
      
      refreshTimeoutRef.current = setTimeout(refreshTokenIfNeeded, refreshTime);
    }

    // Cleanup
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [token, refreshToken, isAuthenticated, setToken, logout]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);
}
