import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditService, AuditFilters } from '@/lib/api/audit';

// Hook para logs de auditoria
export function useAuditLogs(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: ['audit', 'logs', filters],
    queryFn: () => auditService.getLogs(filters),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: ['audit', 'logs', 'detail', id],
    queryFn: () => auditService.getLogById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para alertas de auditoria
export function useAuditAlerts(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: ['audit', 'alerts', filters],
    queryFn: () => auditService.getAlerts(filters),
    staleTime: 1 * 60 * 1000,
  });
}

export function useAuditAlert(id: string) {
  return useQuery({
    queryKey: ['audit', 'alerts', 'detail', id],
    queryFn: () => auditService.getAlertById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para estatísticas de auditoria
export function useAuditStats() {
  return useQuery({
    queryKey: ['audit', 'stats'],
    queryFn: auditService.getStats,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para dashboard de auditoria
export function useAuditDashboard() {
  return useQuery({
    queryKey: ['audit', 'dashboard'],
    queryFn: auditService.getDashboard,
    staleTime: 1 * 60 * 1000,
  });
}

// Hook para resolver alerta
export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auditService.resolveAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit', 'alerts'] });
      queryClient.invalidateQueries({ queryKey: ['audit', 'stats'] });
    },
  });
}

// Hook para exportar logs
export function useExportAuditLogs() {
  return useMutation({
    mutationFn: async ({ filters, format }: { filters: AuditFilters; format: 'csv' | 'json' }) => {
      const blob = await auditService.exportLogs(filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}

// Hook para limpar logs antigos
export function useCleanOldLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auditService.cleanOldLogs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit'] });
    },
  });
}

// Hook para múltiplos dados de auditoria
export function useMultipleAudit(filters: AuditFilters = {}) {
  const logs = useAuditLogs(filters);
  const alerts = useAuditAlerts(filters);
  const stats = useAuditStats();
  const dashboard = useAuditDashboard();

  return {
    logs,
    alerts,
    stats,
    dashboard,
    isLoading: logs.isLoading || alerts.isLoading || stats.isLoading || dashboard.isLoading,
    isError: logs.isError || alerts.isError || stats.isError || dashboard.isError,
    error: logs.error || alerts.error || stats.error || dashboard.error,
  };
}
