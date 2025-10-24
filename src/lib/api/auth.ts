import { apiClient } from './client';
import { LoginCredentials, RegisterData, User, AuthTokens } from '@/lib/stores/authStore';

// Interfaces para requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Interfaces para responses
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

// Serviços de autenticação
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // Registro
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  // Obter perfil do usuário
  async getProfile(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
