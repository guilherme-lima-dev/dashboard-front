'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import HttpInterceptor from '../utils/httpInterceptor';

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, fullName: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const handleSessionExpired = () => {
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    const interceptor = HttpInterceptor.getInstance();
    interceptor.configure({
      onUnauthorized: handleSessionExpired,
    });

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const data = await response.json();
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      setUser(data.user);
      
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {} finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.push('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao recuperar senha');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, fullName: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fullName, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = () => {
    return user?.roles?.some(role => 
      role === 'admin' || role === 'super-admin' || role === 'Admin' || role === 'Super Admin'
    ) || false;
  };

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    isAdmin,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}