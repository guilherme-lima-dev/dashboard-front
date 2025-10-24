'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { DashboardData } from '@/types/dashboard';
import { useApiToken } from './useApiToken';

export function useDashboard() {
  const { isTokenReady } = useApiToken();
  
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      console.log('📊 Buscando dados do dashboard...');
      const response = await apiClient.getDashboard({
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });
      return response as DashboardData; // API retorna dados diretamente
    },
    enabled: isTokenReady,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

