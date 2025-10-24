import { apiClient } from './client';

// Interfaces para Usuários
export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  roles: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PermissionFilters {
  page?: number;
  limit?: number;
  search?: string;
  resource?: string;
  action?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'resource' | 'action';
  sortOrder?: 'asc' | 'desc';
}

export interface UserResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Serviços de Usuários
export const usersService = {
  // Usuários
  async getUsers(filters: UserFilters = {}): Promise<UserResponse<User>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<UserResponse<User>>(`/users?${params.toString()}`);
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    roles: string[];
    permissions: string[];
  }): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: Partial<{
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
    isActive: boolean;
  }>): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async resetPassword(id: string, newPassword: string): Promise<{
    message: string;
  }> {
    const response = await apiClient.post(`/users/${id}/reset-password`, { newPassword });
    return response.data;
  },

  // Roles
  async getRoles(filters: RoleFilters = {}): Promise<UserResponse<Role>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<UserResponse<Role>>(`/roles?${params.toString()}`);
    return response.data;
  },

  async getRoleById(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data;
  },

  async createRole(data: {
    name: string;
    description?: string;
    permissions: string[];
  }): Promise<Role> {
    const response = await apiClient.post<Role>('/roles', data);
    return response.data;
  },

  async updateRole(id: string, data: Partial<{
    name: string;
    description?: string;
    permissions: string[];
    isActive: boolean;
  }>): Promise<Role> {
    const response = await apiClient.patch<Role>(`/roles/${id}`, data);
    return response.data;
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/roles/${id}`);
  },

  // Permissões
  async getPermissions(filters: PermissionFilters = {}): Promise<UserResponse<Permission>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<UserResponse<Permission>>(`/permissions?${params.toString()}`);
    return response.data;
  },

  async getPermissionById(id: string): Promise<Permission> {
    const response = await apiClient.get<Permission>(`/permissions/${id}`);
    return response.data;
  },

  async createPermission(data: {
    name: string;
    description?: string;
    resource: string;
    action: string;
  }): Promise<Permission> {
    const response = await apiClient.post<Permission>('/permissions', data);
    return response.data;
  },

  async updatePermission(id: string, data: Partial<{
    name: string;
    description?: string;
    resource: string;
    action: string;
    isActive: boolean;
  }>): Promise<Permission> {
    const response = await apiClient.patch<Permission>(`/permissions/${id}`, data);
    return response.data;
  },

  async deletePermission(id: string): Promise<void> {
    await apiClient.delete(`/permissions/${id}`);
  },

  // Estatísticas
  async getStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalRoles: number;
    totalPermissions: number;
    usersByRole: Array<{
      role: string;
      count: number;
    }>;
    recentActivity: Array<{
      id: string;
      type: 'login' | 'logout' | 'permission_change' | 'role_change';
      description: string;
      timestamp: string;
    }>;
  }> {
    const response = await apiClient.get('/users/stats');
    return response.data;
  },

  // Dashboard de usuários
  async getDashboard(): Promise<{
    stats: {
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      totalRoles: number;
      totalPermissions: number;
    };
    recentUsers: User[];
    topRoles: Array<{
      role: string;
      count: number;
    }>;
    activityLog: Array<{
      id: string;
      type: string;
      description: string;
      timestamp: string;
    }>;
  }> {
    const response = await apiClient.get('/users/dashboard');
    return response.data;
  },
};
