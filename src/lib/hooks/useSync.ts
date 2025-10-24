import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { syncService, SyncFilters } from '@/lib/api/sync';

// Hook para status de sincronização
export function useSyncStatus() {
  return useQuery({
    queryKey: ['sync', 'status'],
    queryFn: syncService.getStatus,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 30 * 1000, // 30 segundos
  });
}

export function useSyncStatusByPlatform(platform: string) {
  return useQuery({
    queryKey: ['sync', 'status', platform],
    queryFn: () => syncService.getStatusByPlatform(platform),
    enabled: !!platform,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// Hook para logs de sincronização
export function useSyncLogs(filters: SyncFilters = {}) {
  return useQuery({
    queryKey: ['sync', 'logs', filters],
    queryFn: () => syncService.getLogs(filters),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

export function useSyncLog(id: string) {
  return useQuery({
    queryKey: ['sync', 'logs', 'detail', id],
    queryFn: () => syncService.getLogById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para estatísticas de sincronização
export function useSyncStats() {
  return useQuery({
    queryKey: ['sync', 'stats'],
    queryFn: syncService.getStats,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para dashboard de sincronização
export function useSyncDashboard() {
  return useQuery({
    queryKey: ['sync', 'dashboard'],
    queryFn: syncService.getDashboard,
    staleTime: 1 * 60 * 1000,
  });
}

// Hook para configurações de sincronização
export function useSyncConfig() {
  return useQuery({
    queryKey: ['sync', 'config'],
    queryFn: syncService.getConfig,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para saúde das integrações
export function useSyncHealth() {
  return useQuery({
    queryKey: ['sync', 'health'],
    queryFn: syncService.checkHealth,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // 2 minutos
  });
}

// Mutations para controle de sincronização
export function useStartSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncService.startSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });
}

export function useStopSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncService.stopSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });
}

export function usePauseSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncService.pauseSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });
}

export function useResumeSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncService.resumeSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });
}

export function useForceFullSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncService.forceFullSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });
}

// Hook para atualizar configurações
export function useUpdateSyncConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncService.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync', 'config'] });
    },
  });
}

// Hook para múltiplos dados de sincronização
export function useMultipleSync(filters: SyncFilters = {}) {
  const status = useSyncStatus();
  const logs = useSyncLogs(filters);
  const stats = useSyncStats();
  const dashboard = useSyncDashboard();
  const config = useSyncConfig();
  const health = useSyncHealth();

  return {
    status,
    logs,
    stats,
    dashboard,
    config,
    health,
    isLoading: status.isLoading || logs.isLoading || stats.isLoading || dashboard.isLoading || config.isLoading || health.isLoading,
    isError: status.isError || logs.isError || stats.isError || dashboard.isError || config.isError || health.isError,
    error: status.error || logs.error || stats.error || dashboard.error || config.error || health.error,
  };
}
