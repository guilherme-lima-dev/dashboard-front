import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliatesService, AffiliateFilters } from '@/lib/api/affiliates';

// Hook para listar afiliados
export function useAffiliates(filters: AffiliateFilters = {}) {
  return useQuery({
    queryKey: ['affiliates', 'list', filters],
    queryFn: () => affiliatesService.getAffiliates(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para obter afiliado por ID
export function useAffiliate(id: string) {
  return useQuery({
    queryKey: ['affiliates', 'detail', id],
    queryFn: () => affiliatesService.getAffiliateById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para performance de afiliado
export function useAffiliatePerformance(id: string) {
  return useQuery({
    queryKey: ['affiliates', 'performance', id],
    queryFn: () => affiliatesService.getAffiliatePerformance(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para estatísticas de afiliados
export function useAffiliateStats() {
  return useQuery({
    queryKey: ['affiliates', 'stats'],
    queryFn: affiliatesService.getAffiliateStats,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para dashboard de afiliados
export function useAffiliateDashboard() {
  return useQuery({
    queryKey: ['affiliates', 'dashboard'],
    queryFn: affiliatesService.getAffiliateDashboard,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para criar afiliado
export function useCreateAffiliate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: affiliatesService.createAffiliate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
    },
  });
}

// Hook para atualizar afiliado
export function useUpdateAffiliate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      affiliatesService.updateAffiliate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      queryClient.invalidateQueries({ queryKey: ['affiliates', 'detail', id] });
    },
  });
}

// Hook para deletar afiliado
export function useDeleteAffiliate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: affiliatesService.deleteAffiliate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
    },
  });
}

// Hook para múltiplos afiliados
export function useMultipleAffiliates(filters: AffiliateFilters = {}) {
  const affiliates = useAffiliates(filters);
  const stats = useAffiliateStats();
  const dashboard = useAffiliateDashboard();

  return {
    affiliates,
    stats,
    dashboard,
    isLoading: affiliates.isLoading || stats.isLoading || dashboard.isLoading,
    isError: affiliates.isError || stats.isError || dashboard.isError,
    error: affiliates.error || stats.error || dashboard.error,
  };
}
