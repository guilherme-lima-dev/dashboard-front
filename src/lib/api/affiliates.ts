import { apiClient } from './client';

// Interfaces para Afiliados
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  totalSalesCount: number;
  totalRevenueBrl: number;
  totalRevenueUsd: number;
  firstSaleAt: string;
  lastSaleAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliatePerformance {
  affiliateId: string;
  affiliateName: string;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  monthlyTrend: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }>;
}

export interface AffiliateStats {
  totalAffiliates: number;
  activeAffiliates: number;
  totalSales: number;
  totalRevenue: number;
  averageRevenuePerAffiliate: number;
  topPerformers: Array<{
    affiliateId: string;
    affiliateName: string;
    revenue: number;
    sales: number;
  }>;
  tierDistribution: Array<{
    tier: string;
    count: number;
    percentage: number;
  }>;
}

export interface AffiliateFilters {
  page?: number;
  limit?: number;
  search?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  platform?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'revenue' | 'sales' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AffiliateResponse {
  data: Affiliate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Serviços de Afiliados
export const affiliatesService = {
  // Listar afiliados
  async getAffiliates(filters: AffiliateFilters = {}): Promise<AffiliateResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.tier) params.append('tier', filters.tier);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<AffiliateResponse>(`/affiliates?${params.toString()}`);
    return response.data;
  },

  // Obter afiliado por ID
  async getAffiliateById(id: string): Promise<Affiliate> {
    const response = await apiClient.get<Affiliate>(`/affiliates/${id}`);
    return response.data;
  },

  // Obter performance de afiliado
  async getAffiliatePerformance(id: string): Promise<AffiliatePerformance> {
    const response = await apiClient.get<AffiliatePerformance>(`/affiliates/${id}/performance`);
    return response.data;
  },

  // Obter estatísticas de afiliados
  async getAffiliateStats(): Promise<AffiliateStats> {
    const response = await apiClient.get<AffiliateStats>('/affiliates/stats');
    return response.data;
  },

  // Dashboard de afiliados
  async getAffiliateDashboard(): Promise<{
    stats: AffiliateStats;
    topPerformers: Affiliate[];
    recentActivity: Array<{
      id: string;
      type: 'sale' | 'signup' | 'tier_change';
      description: string;
      timestamp: string;
    }>;
  }> {
    const response = await apiClient.get('/affiliates/dashboard');
    return response.data;
  },

  // Criar afiliado
  async createAffiliate(data: {
    name: string;
    email: string;
    tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  }): Promise<Affiliate> {
    const response = await apiClient.post<Affiliate>('/affiliates', data);
    return response.data;
  },

  // Atualizar afiliado
  async updateAffiliate(id: string, data: Partial<{
    name: string;
    email: string;
    tier: 'bronze' | 'silver' | 'gold' | 'diamond';
    isActive: boolean;
  }>): Promise<Affiliate> {
    const response = await apiClient.patch<Affiliate>(`/affiliates/${id}`, data);
    return response.data;
  },

  // Deletar afiliado
  async deleteAffiliate(id: string): Promise<void> {
    await apiClient.delete(`/affiliates/${id}`);
  },
};
