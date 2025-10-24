import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsService, AnalyticsFilters } from '@/lib/api/analytics';
import { useApiToken } from './useApiToken';

// Hook para dashboard principal
export function useDashboard(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'dashboard', filters],
    queryFn: () => analyticsService.getDashboard(filters),
    enabled: isTokenReady, // Só executar quando o token estiver pronto
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30 * 1000, // 30 segundos
  });
}

// Hook para analytics de receita
export function useRevenue(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'revenue', filters],
    queryFn: () => analyticsService.getRevenue(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para analytics de assinaturas
export function useSubscriptions(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'subscriptions', filters],
    queryFn: () => analyticsService.getSubscriptions(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para analytics de churn
export function useChurn(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'churn', filters],
    queryFn: () => analyticsService.getChurn(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para analytics de trials
export function useTrials(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'trials', filters],
    queryFn: () => analyticsService.getTrials(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para métricas em tempo real
export function useRealTimeMetrics() {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: analyticsService.getRealTimeMetrics,
    enabled: isTokenReady,
    refetchInterval: 10 * 1000, // 10 segundos
    staleTime: 0, // Sempre buscar dados frescos
  });
}

// Hook para exportar dados
export function useExportAnalytics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ filters, format }: { filters: AnalyticsFilters; format: 'csv' | 'pdf' | 'excel' }) => {
      // Implementar exportação baseada no formato
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters, format }),
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

// Novos hooks para gráficos
export function useRevenueTrend(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'revenue-trend', filters],
    queryFn: () => analyticsService.getRevenueTrend(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueByProduct(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'revenue-by-product', filters],
    queryFn: () => analyticsService.getRevenueByProduct(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubscriptionTrend(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'subscription-trend', filters],
    queryFn: () => analyticsService.getSubscriptionTrend(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubscriptionByProduct(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'subscription-by-product', filters],
    queryFn: () => analyticsService.getSubscriptionByProduct(filters),
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentActivities(filters: AnalyticsFilters) {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['analytics', 'recent-activities', filters],
    queryFn: () => analyticsService.getRecentActivities(filters),
    enabled: isTokenReady,
    staleTime: 1 * 60 * 1000, // 1 minuto para atividades
    refetchInterval: 30 * 1000, // 30 segundos
  });
}

// Hook para múltiplos analytics
export function useMultipleAnalytics(filters: AnalyticsFilters) {
  const dashboard = useDashboard(filters);
  const revenue = useRevenue(filters);
  const subscriptions = useSubscriptions(filters);
  const churn = useChurn(filters);
  const trials = useTrials(filters);

  return {
    dashboard,
    revenue,
    subscriptions,
    churn,
    trials,
    isLoading: dashboard.isLoading || revenue.isLoading || subscriptions.isLoading || churn.isLoading || trials.isLoading,
    isError: dashboard.isError || revenue.isError || subscriptions.isError || churn.isError || trials.isError,
    error: dashboard.error || revenue.error || subscriptions.error || churn.error || trials.error,
  };
}
