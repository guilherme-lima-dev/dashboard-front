import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Interface para resposta da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// Interface para erros da API
export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: any;
}

// Classe principal do cliente API
class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token
    this.instance.interceptors.request.use(
      (config) => {
        // Token será adicionado dinamicamente quando necessário
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratar refresh token
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Se já está fazendo refresh, adiciona à fila
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.instance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Importar dinamicamente para evitar dependência circular
            const { useAuthStore } = await import('@/lib/stores/authStore');
            const refreshToken = useAuthStore.getState().refreshToken;
            
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data;
              
              // Atualizar token no store
              useAuthStore.getState().setToken(accessToken);
              
              // Atualizar header da requisição original
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              this.processQueue(null);
              return this.instance(originalRequest);
            } else {
              this.processQueue(error);
              useAuthStore.getState().logout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.processQueue(refreshError);
            // Importar dinamicamente para evitar dependência circular
            const { useAuthStore } = await import('@/lib/stores/authStore');
            useAuthStore.getState().logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  private async refreshToken(refreshToken: string) {
    return this.instance.post('/auth/refresh', { refreshToken });
  }

  // Método para configurar token
  setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Método para remover token
  clearAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }
}

// Instância singleton do cliente
export const apiClient = new ApiClient();

// Função helper para tratar erros
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'Erro na requisição',
      code: error.response.data?.code || 'UNKNOWN_ERROR',
      details: error.response.data?.details,
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'Erro de conexão com o servidor',
      code: 'NETWORK_ERROR',
    };
  } else {
    return {
      status: 0,
      message: error.message || 'Erro desconhecido',
      code: 'UNKNOWN_ERROR',
    };
  }
};