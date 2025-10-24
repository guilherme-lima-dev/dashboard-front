import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/api/auth';
import { LoginCredentials, RegisterData } from '@/lib/stores/authStore';

// Hook simples para autenticação
export function useSimpleAuth() {
  const store = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      store.setUser(response.user);
      store.setToken(response.accessToken);
      store.setRefreshToken(response.refreshToken);
      store.setLoading(false);
      store.setError(null);
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao fazer login';
      setError(errorMessage);
      store.setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      
      store.setUser(response.user);
      store.setToken(response.accessToken);
      store.setRefreshToken(response.refreshToken);
      store.setLoading(false);
      store.setError(null);
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar conta';
      setError(errorMessage);
      store.setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    store.logout();
  };

  const clearError = () => {
    setError(null);
    store.clearError();
  };

  return {
    // Estado
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: isLoading || store.isLoading,
    error: error || store.error,

    // Ações
    login,
    register,
    logout,
    clearError,

    // Permissões
    hasPermission: store.hasPermission,
    hasRole: store.hasRole,
    hasAnyPermission: store.hasAnyPermission,
    hasAnyRole: store.hasAnyRole,
  };
}
