import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaces
export interface User {
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshAuth: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// Store principal de autenticação
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Ações
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const { authService } = await import('@/lib/api/auth');
          const response = await authService.login(credentials);
          
          const { user, accessToken, refreshToken } = response;
          
          set({
            user,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const { authService } = await import('@/lib/api/auth');
          const response = await authService.register(data);
          
          const { user, accessToken, refreshToken } = response;
          
          set({
            user,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar conta';
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token });
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      hasPermission: (permission: string) => {
        // Por enquanto, retorna true para todos os usuários autenticados
        const { isAuthenticated } = get();
        return isAuthenticated;
      },

      hasRole: (role: string) => {
        // Por enquanto, retorna true para todos os usuários autenticados
        const { isAuthenticated } = get();
        return isAuthenticated;
      },

      hasAnyPermission: (permissions: string[]) => {
        // Por enquanto, retorna true para todos os usuários autenticados
        const { isAuthenticated } = get();
        return isAuthenticated;
      },

      hasAnyRole: (roles: string[]) => {
        // Por enquanto, retorna true para todos os usuários autenticados
        const { isAuthenticated } = get();
        return isAuthenticated;
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const { authService } = await import('@/lib/api/auth');
          const response = await authService.refreshToken(refreshToken);
          
          const { accessToken } = response;
          set({ token: accessToken });
        } catch (error) {
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);