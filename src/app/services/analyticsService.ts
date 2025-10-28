export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  productId?: string;
  platformId?: string;
  acquisitionChannel?: string;
  affiliateId?: string;
  currency?: 'BRL' | 'USD';
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface MRRData {
  value: number;
  activeCount: number;
  change: string;
}

export interface KPIData {
  count?: number;
  value?: number;
  revenue?: number;
  change?: string;
  conversionRate?: number;
}

export interface DashboardKPIs {
  newSubscriptions: KPIData;
  mrr: MRRData;
  arr: KPIData;
  newRevenue: KPIData;
  totalRevenue: KPIData;
  trial: KPIData;
  cancellations: KPIData;
  churnRate: KPIData;
  ltv: KPIData;
  cac: KPIData;
  ltvCacRatio: KPIData;
}

export interface MRREvolutionPoint {
  month: string;
  mrr: number;
}

export interface UserGrowthPoint {
  month: string;
  new: number;
  canceled: number;
}

export interface DashboardCharts {
  mrrEvolution: MRREvolutionPoint[];
  userGrowth: UserGrowthPoint[];
}

export interface DashboardResponse {
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

export interface AnalyticsError {
  message: string;
  code: string;
  details?: any;
}

class AnalyticsService {
  private readonly baseURL: string;
  private readonly defaultTimeout: number = 10000;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }

  async getDashboardData(filters: DashboardFilters = {}): Promise<DashboardResponse> {
    try {
      const defaultFilters: DashboardFilters = {
        startDate: this.getDefaultStartDate(),
        endDate: this.getDefaultEndDate(),
        ...filters
      };

      const { currency, ...backendFilters } = defaultFilters;

      const queryParams = new URLSearchParams();
      
      Object.entries(backendFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${this.baseURL}/analytics/dashboard?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        signal: AbortSignal.timeout(this.defaultTimeout),
      });

      if (!response.ok) {
        throw new AnalyticsServiceError(
          `Erro ao buscar dados do dashboard: ${response.status}`,
          'DASHBOARD_FETCH_ERROR',
          { status: response.status, statusText: response.statusText }
        );
      }

      const data: DashboardResponse = await response.json();

      this.validateDashboardResponse(data);
      
      return data;

    } catch (error) {
      if (error instanceof AnalyticsServiceError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new AnalyticsServiceError(
          'Erro de conexão com a API de analytics',
          'CONNECTION_ERROR',
          { originalError: error.message }
        );
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AnalyticsServiceError(
          'Timeout ao buscar dados de analytics',
          'TIMEOUT_ERROR',
          { timeout: this.defaultTimeout }
        );
      }

      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new AnalyticsServiceError(
        'Erro inesperado ao buscar dados de analytics',
        'UNKNOWN_ERROR',
        { originalError: errorMessage }
      );
    }
  }

  /**
   * Busca apenas dados de MRR
   */
  async getMRRData(filters: DashboardFilters = {}): Promise<MRRData> {
    const dashboardData = await this.getDashboardData(filters);
    return {
      value: dashboardData.revenue.mrrBrl,
      activeCount: dashboardData.subscriptions.activeSubscriptionsCount,
      change: '+0%'
    };
  }

  async getMRREvolutionData(filters: DashboardFilters = {}): Promise<MRREvolutionPoint[]> {
    try {
      const queryParams = this.buildQueryParams(filters);
      const response = await fetch(`${this.baseURL}/analytics/revenue/trend?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        signal: AbortSignal.timeout(this.defaultTimeout),
      });

      if (!response.ok) {
        throw new AnalyticsServiceError(
          `Erro ao buscar dados de evolução do MRR: ${response.status}`,
          'MRR_EVOLUTION_FETCH_ERROR',
          { status: response.status }
        );
      }

      const data = await response.json();
      
      return data.monthlyTrend.map((item: any) => ({
        month: this.formatMonthName(item.month),
        mrr: item.revenue
      }));

    } catch (error) {
      if (error instanceof AnalyticsServiceError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new AnalyticsServiceError(
        'Erro ao buscar dados de evolução do MRR',
        'MRR_EVOLUTION_UNKNOWN_ERROR',
        { originalError: errorMessage }
      );
    }
  }

  async getUserGrowthData(filters: DashboardFilters = {}): Promise<UserGrowthPoint[]> {
    try {
      const queryParams = this.buildQueryParams(filters);
      const response = await fetch(`${this.baseURL}/analytics/subscriptions/trend?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        signal: AbortSignal.timeout(this.defaultTimeout)
      });

      if (!response.ok) {
        throw new AnalyticsServiceError(
          `Failed to fetch user growth data: ${response.statusText}`,
          'FETCH_ERROR',
          { status: response.status }
        );
      }

      const data = await response.json();
      
      if (!data.monthlyTrend || !Array.isArray(data.monthlyTrend)) {
        throw new AnalyticsServiceError(
          'Invalid user growth data format',
          'INVALID_DATA',
          data
        );
      }

      return data.monthlyTrend.map((item: any) => ({
        month: this.formatMonthName(item.month),
        new: item.subscriptions || 0,
        canceled: Math.floor(item.subscriptions * 0.1) || 0
      }));

    } catch (error) {
      if (error instanceof AnalyticsServiceError) {
        throw error;
      }
      
      throw new AnalyticsServiceError(
        'Failed to fetch user growth data',
        'NETWORK_ERROR',
        error
      );
    }
  }

  /**
   * Força recálculo das métricas
   */
  async recalculateMetrics(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/analytics/recalculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        signal: AbortSignal.timeout(this.defaultTimeout),
      });

      if (!response.ok) {
        throw new AnalyticsServiceError(
          `Erro ao recalcular métricas: ${response.status}`,
          'RECALCULATE_ERROR',
          { status: response.status }
        );
      }

      return await response.json();

    } catch (error) {
      if (error instanceof AnalyticsServiceError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new AnalyticsServiceError(
        'Erro ao recalcular métricas',
        'RECALCULATE_UNKNOWN_ERROR',
        { originalError: errorMessage }
      );
    }
  }

  private buildQueryParams(filters: DashboardFilters): string {
    const defaultFilters: DashboardFilters = {
      startDate: this.getDefaultStartDate(),
      endDate: this.getDefaultEndDate(),
      ...filters
    };

    const { currency, ...backendFilters } = defaultFilters;
    const queryParams = new URLSearchParams();
    
    Object.entries(backendFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return queryParams.toString();
  }

  private formatMonthName(monthStr: string): string {
    try {
      const date = new Date(monthStr + '-01');
      return date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return monthStr;
    }
  }

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  /**
   * Data padrão de fim (hoje)
   */
  private getDefaultEndDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  /**
   * Obtém token de autenticação do localStorage
   */
  private getAuthToken(): string {
    if (typeof window === 'undefined') return '';
    
    try {
      return localStorage.getItem('accessToken') || '';
    } catch {
      return '';
    }
  }

  /**
   * Valida estrutura básica da resposta do dashboard
   */
  private validateDashboardResponse(data: any): void {
    if (!data || typeof data !== 'object') {
      throw new AnalyticsServiceError(
        'Resposta inválida da API de analytics',
        'INVALID_RESPONSE',
        { data }
      );
    }

    if (!data.revenue || typeof data.revenue !== 'object') {
      throw new AnalyticsServiceError(
        'Dados de receita não encontrados na resposta',
        'MISSING_REVENUE_DATA',
        { data }
      );
    }

    if (typeof data.revenue.mrrBrl !== 'number') {
      throw new AnalyticsServiceError(
        'Valor de MRR em BRL inválido',
        'INVALID_MRR_VALUE',
        { mrrBrl: data.revenue.mrrBrl }
      );
    }

    if (!data.subscriptions || typeof data.subscriptions !== 'object') {
      throw new AnalyticsServiceError(
        'Dados de assinaturas não encontrados na resposta',
        'MISSING_SUBSCRIPTIONS_DATA',
        { data }
      );
    }

    if (!data.customers || typeof data.customers !== 'object') {
      throw new AnalyticsServiceError(
        'Dados de clientes não encontrados na resposta',
        'MISSING_CUSTOMERS_DATA',
        { data }
      );
    }
  }

  formatCurrency(value: number, currency: 'BRL' | 'USD' = 'BRL'): string {
    if (!currency) {
      currency = 'BRL';
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  /**
   * Formata percentual
   */
  formatPercentage(value: string | number): string {
    if (typeof value === 'string') {
      return value;
    }
    
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }
}

export class AnalyticsServiceError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'AnalyticsServiceError';
    this.code = code;
    this.details = details;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;