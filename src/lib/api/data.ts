import { apiClient } from './client';

// Interfaces para Dados
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  platform: string;
  platformId: string;
  isActive: boolean;
  totalSpent: number;
  subscriptionCount: number;
  firstPurchaseAt: string;
  lastPurchaseAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  platform: string;
  platformId: string;
  status: 'active' | 'cancelled' | 'paused' | 'trial';
  recurringAmount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily';
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  subscriptionId?: string;
  productId: string;
  productName: string;
  platform: string;
  platformId: string;
  type: 'subscription' | 'one_time' | 'refund' | 'chargeback';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  type: 'subscription' | 'one_time';
  isActive: boolean;
  platforms: Array<{
    platformId: string;
    platformName: string;
    externalId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  integrationStatus: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Filtros e paginação
export interface DataFilters {
  page?: number;
  limit?: number;
  search?: string;
  platform?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Serviços de Dados
export const dataService = {
  // Clientes
  async getCustomers(filters: DataFilters = {}): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<Customer>>(`/customers?${params.toString()}`);
    return response.data;
  },

  async getCustomerById(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },

  // Assinaturas
  async getSubscriptions(filters: DataFilters = {}): Promise<PaginatedResponse<Subscription>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<Subscription>>(`/subscriptions?${params.toString()}`);
    return response.data;
  },

  async getSubscriptionById(id: string): Promise<Subscription> {
    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`);
    return response.data;
  },

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    const response = await apiClient.patch<Subscription>(`/subscriptions/${id}`, data);
    return response.data;
  },

  async cancelSubscription(id: string): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  // Transações
  async getTransactions(filters: DataFilters = {}): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<Transaction>>(`/transactions?${params.toString()}`);
    return response.data;
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  async refundTransaction(id: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/refund`);
    return response.data;
  },

  // Produtos
  async getProducts(filters: DataFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  // Plataformas
  async getPlatforms(filters: DataFilters = {}): Promise<PaginatedResponse<Platform>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<Platform>>(`/platforms?${params.toString()}`);
    return response.data;
  },

  async getPlatformById(id: string): Promise<Platform> {
    const response = await apiClient.get<Platform>(`/platforms/${id}`);
    return response.data;
  },

  async updatePlatform(id: string, data: Partial<Platform>): Promise<Platform> {
    const response = await apiClient.patch<Platform>(`/platforms/${id}`, data);
    return response.data;
  },

  // Estatísticas gerais
  async getDataStats(): Promise<{
    totalCustomers: number;
    totalSubscriptions: number;
    totalTransactions: number;
    totalRevenue: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    monthlyGrowth: number;
  }> {
    const response = await apiClient.get('/data/stats');
    return response.data;
  },
};
