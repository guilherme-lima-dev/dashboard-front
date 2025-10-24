import { apiClient } from './client';

// Interfaces para Sincronização
export interface SyncStatus {
  id: string;
  platform: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
  lastSyncAt?: string;
  nextSyncAt?: string;
}

export interface SyncLog {
  id: string;
  syncId: string;
  platform: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SyncStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  averageDuration: number;
  lastSyncAt: string;
  nextSyncAt: string;
  platformsStatus: Array<{
    platform: string;
    status: string;
    lastSyncAt: string;
    nextSyncAt: string;
  }>;
}

export interface SyncFilters {
  page?: number;
  limit?: number;
  platform?: string;
  status?: 'running' | 'completed' | 'failed' | 'paused';
  dateFrom?: string;
  dateTo?: string;
  level?: 'info' | 'warning' | 'error';
  sortBy?: 'timestamp' | 'platform' | 'level';
  sortOrder?: 'asc' | 'desc';
}

export interface SyncResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Serviços de Sincronização
export const syncService = {
  // Status de sincronização
  async getStatus(): Promise<SyncStatus[]> {
    const response = await apiClient.get<SyncStatus[]>('/sync/status');
    return response.data;
  },

  async getStatusByPlatform(platform: string): Promise<SyncStatus> {
    const response = await apiClient.get<SyncStatus>(`/sync/status/${platform}`);
    return response.data;
  },

  // Iniciar sincronização
  async startSync(platform?: string): Promise<{
    message: string;
    syncId: string;
  }> {
    const response = await apiClient.post('/sync/start', { platform });
    return response.data;
  },

  async stopSync(platform?: string): Promise<{
    message: string;
  }> {
    const response = await apiClient.post('/sync/stop', { platform });
    return response.data;
  },

  async pauseSync(platform?: string): Promise<{
    message: string;
  }> {
    const response = await apiClient.post('/sync/pause', { platform });
    return response.data;
  },

  async resumeSync(platform?: string): Promise<{
    message: string;
  }> {
    const response = await apiClient.post('/sync/resume', { platform });
    return response.data;
  },

  // Logs de sincronização
  async getLogs(filters: SyncFilters = {}): Promise<SyncResponse<SyncLog>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<SyncResponse<SyncLog>>(`/sync/logs?${params.toString()}`);
    return response.data;
  },

  async getLogById(id: string): Promise<SyncLog> {
    const response = await apiClient.get<SyncLog>(`/sync/logs/${id}`);
    return response.data;
  },

  // Estatísticas de sincronização
  async getStats(): Promise<SyncStats> {
    const response = await apiClient.get<SyncStats>('/sync/stats');
    return response.data;
  },

  // Dashboard de sincronização
  async getDashboard(): Promise<{
    stats: SyncStats;
    currentStatus: SyncStatus[];
    recentLogs: SyncLog[];
    platformHealth: Array<{
      platform: string;
      health: 'healthy' | 'warning' | 'error';
      lastSyncAt: string;
      nextSyncAt: string;
      errorRate: number;
    }>;
  }> {
    const response = await apiClient.get('/sync/dashboard');
    return response.data;
  },

  // Configurações de sincronização
  async getConfig(): Promise<{
    platforms: Array<{
      name: string;
      enabled: boolean;
      syncInterval: number;
      lastSyncAt: string;
      nextSyncAt: string;
    }>;
    globalSettings: {
      autoSync: boolean;
      syncInterval: number;
      retryAttempts: number;
      timeout: number;
    };
  }> {
    const response = await apiClient.get('/sync/config');
    return response.data;
  },

  async updateConfig(config: {
    platforms?: Array<{
      name: string;
      enabled: boolean;
      syncInterval: number;
    }>;
    globalSettings?: {
      autoSync: boolean;
      syncInterval: number;
      retryAttempts: number;
      timeout: number;
    };
  }): Promise<{
    message: string;
  }> {
    const response = await apiClient.post('/sync/config', config);
    return response.data;
  },

  // Forçar sincronização completa
  async forceFullSync(): Promise<{
    message: string;
    syncId: string;
  }> {
    const response = await apiClient.post('/sync/force-full');
    return response.data;
  },

  // Verificar saúde das integrações
  async checkHealth(): Promise<{
    overall: 'healthy' | 'warning' | 'error';
    platforms: Array<{
      platform: string;
      status: 'connected' | 'disconnected' | 'error';
      lastCheck: string;
      responseTime: number;
      error?: string;
    }>;
  }> {
    const response = await apiClient.get('/sync/health');
    return response.data;
  },
};
