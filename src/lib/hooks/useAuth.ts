import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/api/auth';
import { LoginCredentials, RegisterData } from '@/lib/stores/authStore';
import { useApiToken } from './useApiToken';
import { useTokenRefresh } from './useTokenRefresh';
import { useEffect, useState } from 'react';

// Hook para autenticação
export function useAuth() {
  const store = useAuthStore();
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Garantir que o token seja definido no API client antes de fazer requisições
  useApiToken();
  
  // Renovar token automaticamente antes de expirar
  useTokenRefresh();

  // Query para obter perfil do usuário
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authService.getProfile,
    enabled: store.isAuthenticated && !!store.token,
    retry: false,
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      store.setUser(data.user);
      store.setToken(data.accessToken);
      store.setRefreshToken(data.refreshToken);
      store.setLoading(false);
      store.setError(null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      store.setError(error.message || 'Erro ao fazer login');
      store.setLoading(false);
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      store.setUser(data.user);
      store.setToken(data.accessToken);
      store.setRefreshToken(data.refreshToken);
      store.setLoading(false);
      store.setError(null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      store.setError(error.message || 'Erro ao criar conta');
      store.setLoading(false);
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      store.logout();
      queryClient.clear();
    },
    onError: () => {
      // Mesmo com erro, faz logout local
      store.logout();
      queryClient.clear();
    },
  });

  // Funções de autenticação
  const login = async (credentials: LoginCredentials) => {
    store.setLoading(true);
    store.setError(null);
    return loginMutation.mutateAsync(credentials);
  };

  const register = async (data: RegisterData) => {
    store.setLoading(true);
    store.setError(null);
    return registerMutation.mutateAsync(data);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const refreshAuth = async () => {
    if (!store.refreshToken) {
      throw new Error('No refresh token available');
    }
    return store.refreshAuth();
  };

  return {
    // Estado
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading || loginMutation.isPending || registerMutation.isPending,
    error: store.error,
    profile,
    isProfileLoading,

    // Ações
    login,
    register,
    logout,
    refreshAuth,
    clearError: store.clearError,

    // Permissões
    hasPermission: store.hasPermission,
    hasRole: store.hasRole,
    hasAnyPermission: store.hasAnyPermission,
    hasAnyRole: store.hasAnyRole,

    // Status das mutations
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    // Client-side flag
    isClient,
  };
}
