// Tipos para o Dashboard Principal - Baseado na API Real

export interface KPIData {
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
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  subscriptions: number;
}

export interface SubscriptionChartData {
  date: string;
  new: number;
  churned: number;
  net: number;
}

export interface TopAffiliate {
  id: string;
  name: string;
  email: string;
  totalRevenue: number;
  commission: number;
  conversions: number;
  conversionRate: number;
}

export interface RecentSubscription {
  id: string;
  customerName: string;
  email: string;
  plan: string;
  amount: number;
  status: 'active' | 'cancelled' | 'trial';
  createdAt: string;
  affiliateId?: string;
}

export interface DashboardData {
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

export interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
}

export interface ChartProps {
  data: ChartData[];
  height?: number;
  loading?: boolean;
  title?: string;
}

export interface TableProps {
  data: Record<string, unknown>[];
  columns: Record<string, unknown>[];
  loading?: boolean;
  pagination?: boolean;
  searchable?: boolean;
}