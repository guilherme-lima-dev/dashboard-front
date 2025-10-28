'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  analyticsService, 
  DashboardResponse, 
  DashboardFilters, 
  MRRData, 
  UserGrowthPoint,
  MRREvolutionPoint,
  AnalyticsServiceError 
} from '../services/analyticsService';

export interface AnalyticsState {
  dashboardData: DashboardResponse | null;
  mrrData: MRRData | null;
  userGrowthData: UserGrowthPoint[] | null;
  mrrEvolutionData: MRREvolutionPoint[] | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: DashboardFilters;
  lastUpdated: Date | null;
}

export interface AnalyticsContextType extends AnalyticsState {
  fetchDashboardData: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateFilters: (newFilters: Partial<DashboardFilters>) => void;
  clearError: () => void;
  recalculateMetrics: () => Promise<void>;
  formatCurrency: (value: number, currency?: 'BRL' | 'USD') => string;
  formatPercentage: (value: string | number) => string;
}
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [state, setState] = useState<AnalyticsState>({
    dashboardData: null,
    mrrData: null,
    userGrowthData: null,
    mrrEvolutionData: null,
    isLoading: false,
    isRefreshing: false,
    error: null,
    filters: {
      startDate: getDefaultStartDate(),
      endDate: getDefaultEndDate(),
      currency: 'BRL',
      period: 'monthly'
    },
    lastUpdated: null,
  });

  const fetchDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [dashboardData, userGrowthData, mrrEvolutionData] = await Promise.all([
        analyticsService.getDashboardData(state.filters),
        analyticsService.getUserGrowthData(state.filters),
        analyticsService.getMRREvolutionData(state.filters)
      ]);

      const mrrData: MRRData = {
        value: dashboardData.revenue.mrrBrl,
        activeCount: dashboardData.subscriptions.activeSubscriptionsCount,
        change: '+0%'
      };
      
      setState(prev => ({
        ...prev,
        dashboardData,
        mrrData,
        userGrowthData,
        mrrEvolutionData,
        isLoading: false,
        lastUpdated: new Date(),
      }));

    } catch (error) {
      const errorMessage = error instanceof AnalyticsServiceError 
        ? error.message 
        : 'Erro ao carregar dados de analytics';

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [state.filters]);

  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isRefreshing: true, error: null }));

    try {
      const [dashboardData, userGrowthData, mrrEvolutionData] = await Promise.all([
        analyticsService.getDashboardData(state.filters),
        analyticsService.getUserGrowthData(state.filters),
        analyticsService.getMRREvolutionData(state.filters)
      ]);
      
      setState(prev => ({
        ...prev,
        dashboardData,
        mrrData: {
          value: dashboardData.revenue.mrrBrl,
          activeCount: dashboardData.subscriptions.activeSubscriptionsCount,
          change: '+0%'
        },
        userGrowthData,
        mrrEvolutionData,
        isRefreshing: false,
        lastUpdated: new Date(),
      }));

    } catch (error) {
      const errorMessage = error instanceof AnalyticsServiceError 
        ? error.message 
        : 'Erro ao atualizar dados de analytics';

      setState(prev => ({
        ...prev,
        isRefreshing: false,
        error: errorMessage,
      }));
    }
  }, [state.filters]);

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      error: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const recalculateMetrics = useCallback(async () => {
    setState(prev => ({ ...prev, isRefreshing: true, error: null }));

    try {
      await analyticsService.recalculateMetrics();
      setTimeout(() => {
        fetchDashboardData();
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof AnalyticsServiceError 
        ? error.message 
        : 'Erro ao recalcular métricas';

      setState(prev => ({
        ...prev,
        isRefreshing: false,
        error: errorMessage,
      }));
    }
  }, [fetchDashboardData]);

  const formatCurrency = useCallback((value: number, currency: 'BRL' | 'USD' = 'BRL') => {
    const safeCurrency = currency || 'BRL';
    return analyticsService.formatCurrency(value, safeCurrency);
  }, []);

  const formatPercentage = useCallback((value: string | number) => {
    return analyticsService.formatPercentage(value);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (state.lastUpdated) {
      fetchDashboardData();
    }
  }, [state.filters, fetchDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isLoading && !state.isRefreshing) {
        refreshData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.isLoading, state.isRefreshing, refreshData]);

  const contextValue: AnalyticsContextType = {
    ...state,
    fetchDashboardData,
    refreshData,
    updateFilters,
    clearError,
    recalculateMetrics,
    formatCurrency,
    formatPercentage,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  
  if (context === undefined) {
    throw new Error('useAnalytics deve ser usado dentro de um AnalyticsProvider');
  }
  
  return context;
}

function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

export default AnalyticsContext;