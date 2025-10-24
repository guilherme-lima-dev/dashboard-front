import { apiClient } from './client';

// Interfaces para Analytics
export interface DashboardMetrics {
  revenue: {
    mrrBrl: number;
    mrrUsd: number;
    arrBrl: number;
    arrUsd: number;
    revenueBrl: number;
    revenueUsd: number;
    refundsBrl: number;
    refundsUsd: number;
  };
  subscriptions: {
    activeSubscriptionsCount: number;
    trialSubscriptionsCount: number;
    canceledSubscriptionsCount: number;
    newSubscriptionsCount: number;
    churnCount: number;
    churnRate: number;
    trialConversionRate: number;
  };
  customers: {
    newCustomersCount: number;
    totalCustomersCount: number;
    averageRevenuePerUserBrl: number;
    averageRevenuePerUserUsd: number;
    customerLifetimeValueBrl: number;
    customerLifetimeValueUsd: number;
  };
  date: string;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  recurringRevenue: number;
  nonRecurringRevenue: number;
  revenueByProduct: Array<{
    productId: string;
    productName: string;
    revenue: number;
    percentage: number;
  }>;
  revenueByPlatform: Array<{
    platformId: string;
    platformName: string;
    revenue: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
  }>;
}

export interface RevenueTrend {
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
  }>;
  totalRevenue: number;
  totalSubscriptions: number;
}

export interface RevenueByProduct {
  revenueByProduct: Array<{
    productId: string;
    productName: string;
    revenue: number;
    percentage: number;
  }>;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  trialSubscriptions: number;
  subscriptionsByProduct: Array<{
    productId: string;
    productName: string;
    count: number;
    percentage: number;
  }>;
  subscriptionsByPlatform: Array<{
    platformId: string;
    platformName: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    subscriptions: number;
    revenue: number;
  }>;
}

export interface SubscriptionTrend {
  monthlyTrend: Array<{
    month: string;
    subscriptions: number;
    revenue: number;
  }>;
  totalSubscriptions: number;
}

export interface SubscriptionByProduct {
  subscriptionsByProduct: Array<{
    productId: string;
    productName: string;
    count: number;
    percentage: number;
  }>;
}

export interface RecentActivity {
  id: string;
  type: 'subscription' | 'payment' | 'user' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  amount?: number;
  currency?: string;
}

export interface ChurnAnalytics {
  churnRate: number;
  churnCount: number;
  retentionRate: number;
  churnByProduct: Array<{
    productId: string;
    productName: string;
    churnRate: number;
    churnCount: number;
  }>;
  churnByPlatform: Array<{
    platformId: string;
    platformName: string;
    churnRate: number;
    churnCount: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    churnRate: number;
    churnCount: number;
  }>;
}

export interface TrialAnalytics {
  trialRate: number;
  trialCount: number;
  conversionRate: number;
  trialsByProduct: Array<{
    productId: string;
    productName: string;
    trialCount: number;
    conversionRate: number;
  }>;
  trialsByPlatform: Array<{
    platformId: string;
    platformName: string;
    trialCount: number;
    conversionRate: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    trialCount: number;
    conversionRate: number;
  }>;
}

export interface AnalyticsFilters {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  platformId?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
}

// Serviços de Analytics
export const analyticsService = {
  // Dashboard principal
  async getDashboard(filters: AnalyticsFilters): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>('/analytics/dashboard', { params: filters });
    return response.data;
  },

  // Analytics de receita
  async getRevenue(filters: AnalyticsFilters): Promise<RevenueAnalytics> {
    const response = await apiClient.get<RevenueAnalytics>('/analytics/revenue', { params: filters });
    return response.data;
  },

  // Analytics de assinaturas
  async getSubscriptions(filters: AnalyticsFilters): Promise<SubscriptionAnalytics> {
    const response = await apiClient.get<SubscriptionAnalytics>('/analytics/subscriptions', { params: filters });
    return response.data;
  },

  // Analytics de churn
  async getChurn(filters: AnalyticsFilters): Promise<ChurnAnalytics> {
    const response = await apiClient.get<ChurnAnalytics>('/analytics/cohort', { params: filters });
    return response.data;
  },

  // Analytics de trials
  async getTrials(filters: AnalyticsFilters): Promise<TrialAnalytics> {
    const response = await apiClient.get<TrialAnalytics>('/analytics/affiliates', { params: filters });
    return response.data;
  },

  // Métricas em tempo real
  async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    revenue: number;
    subscriptions: number;
    churn: number;
  }> {
    const response = await apiClient.get('/analytics/realtime');
    return response.data;
  },

  // Novos métodos para gráficos
  async getRevenueTrend(filters: AnalyticsFilters): Promise<RevenueTrend> {
    const response = await apiClient.get<RevenueTrend>('/analytics/revenue/trend', { params: filters });
    return response.data;
  },

  async getRevenueByProduct(filters: AnalyticsFilters): Promise<RevenueByProduct> {
    const response = await apiClient.get<RevenueByProduct>('/analytics/revenue/by-product', { params: filters });
    return response.data;
  },

  async getSubscriptionTrend(filters: AnalyticsFilters): Promise<SubscriptionTrend> {
    const response = await apiClient.get<SubscriptionTrend>('/analytics/subscriptions/trend', { params: filters });
    return response.data;
  },

  async getSubscriptionByProduct(filters: AnalyticsFilters): Promise<SubscriptionByProduct> {
    const response = await apiClient.get<SubscriptionByProduct>('/analytics/subscriptions/by-product', { params: filters });
    return response.data;
  },

  async getRecentActivities(filters: AnalyticsFilters): Promise<RecentActivity[]> {
    const response = await apiClient.get<RecentActivity[]>('/analytics/activities', { params: filters });
    return response.data;
  },
};
