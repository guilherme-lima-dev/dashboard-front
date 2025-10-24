import { apiClient } from './client';

// Interfaces para Auditoria
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  createdAt: string;
}

export interface AuditAlert {
  id: string;
  type: 'security' | 'performance' | 'error' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditStats {
  totalLogs: number;
  logsToday: number;
  logsThisWeek: number;
  logsThisMonth: number;
  topActions: Array<{
    action: string;
    count: number;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    count: number;
  }>;
  securityEvents: number;
  errorEvents: number;
  warningEvents: number;
}

export interface AuditFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resource?: string;
  dateFrom?: string;
  dateTo?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  type?: 'security' | 'performance' | 'error' | 'warning';
  isResolved?: boolean;
  sortBy?: 'timestamp' | 'action' | 'userName';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Serviços de Auditoria
export const auditService = {
  // Logs de auditoria
  async getLogs(filters: AuditFilters = {}): Promise<AuditResponse<AuditLog>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<AuditResponse<AuditLog>>(`/audit/logs?${params.toString()}`);
    return response.data;
  },

  async getLogById(id: string): Promise<AuditLog> {
    const response = await apiClient.get<AuditLog>(`/audit/logs/${id}`);
    return response.data;
  },

  // Alertas de auditoria
  async getAlerts(filters: AuditFilters = {}): Promise<AuditResponse<AuditAlert>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<AuditResponse<AuditAlert>>(`/audit/alerts?${params.toString()}`);
    return response.data;
  },

  async getAlertById(id: string): Promise<AuditAlert> {
    const response = await apiClient.get<AuditAlert>(`/audit/alerts/${id}`);
    return response.data;
  },

  async resolveAlert(id: string): Promise<AuditAlert> {
    const response = await apiClient.post<AuditAlert>(`/audit/alerts/${id}/resolve`);
    return response.data;
  },

  // Estatísticas de auditoria
  async getStats(): Promise<AuditStats> {
    const response = await apiClient.get<AuditStats>('/audit/stats');
    return response.data;
  },

  // Dashboard de auditoria
  async getDashboard(): Promise<{
    stats: AuditStats;
    recentLogs: AuditLog[];
    activeAlerts: AuditAlert[];
    securityEvents: AuditLog[];
    performanceMetrics: {
      averageResponseTime: number;
      errorRate: number;
      uptime: number;
    };
  }> {
    const response = await apiClient.get('/audit/dashboard');
    return response.data;
  },

  // Exportar logs
  async exportLogs(filters: AuditFilters = {}, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    params.append('format', format);

    const response = await apiClient.get(`/audit/export?${params.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  },

  // Limpar logs antigos
  async cleanOldLogs(daysToKeep: number = 90): Promise<{
    deletedCount: number;
    message: string;
  }> {
    const response = await apiClient.post('/audit/clean', { daysToKeep });
    return response.data;
  },
};
