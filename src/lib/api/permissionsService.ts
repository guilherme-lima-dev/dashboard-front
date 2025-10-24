import { apiClient } from './client';

// Tipos baseados na API real
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // Array de permission IDs
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: Role[];
  permissions: string[]; // Array de permission IDs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface AssignRoleRequest {
  userId: string;
  roleId: string;
}

export interface UserPermissionsResponse {
  permissions: Permission[];
  roles: Role[];
}

class PermissionsService {
  // Buscar todas as permissões disponíveis
  async getAllPermissions(): Promise<Permission[]> {
    const response = await apiClient.request('/permissions', {
      method: 'GET',
    });
    return response;
  }

  // Buscar todas as roles
  async getAllRoles(): Promise<Role[]> {
    const response = await apiClient.request('/permissions/roles', {
      method: 'GET',
    });
    return response;
  }

  // Criar nova role
  async createRole(data: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.request('/permissions/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  // Atualizar role
  async updateRole(roleId: string, data: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.request(`/permissions/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  // Deletar role
  async deleteRole(roleId: string): Promise<void> {
    await apiClient.request(`/permissions/roles/${roleId}`, {
      method: 'DELETE',
    });
  }

  // Buscar usuários
  async getUsers(): Promise<User[]> {
    const response = await apiClient.request('/users', {
      method: 'GET',
    });
    return response;
  }

  // Buscar usuário específico
  async getUser(userId: string): Promise<User> {
    const response = await apiClient.request(`/users/${userId}`, {
      method: 'GET',
    });
    return response;
  }

  // Atribuir role a usuário
  async assignRoleToUser(data: AssignRoleRequest): Promise<void> {
    await apiClient.request('/permissions/users/assign-role', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Remover role de usuário
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await apiClient.request(`/permissions/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
    });
  }

  // Buscar permissões de um usuário
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const response = await apiClient.request(`/permissions/users/${userId}/permissions`, {
      method: 'GET',
    });
    return response;
  }

  // Buscar roles de um usuário
  async getUserRoles(userId: string): Promise<Role[]> {
    const response = await apiClient.request(`/permissions/users/${userId}/roles`, {
      method: 'GET',
    });
    return response;
  }

  // Buscar recursos disponíveis
  async getResources(): Promise<string[]> {
    const response = await apiClient.request('/permissions/resources', {
      method: 'GET',
    });
    return response;
  }

  // Buscar ações disponíveis
  async getActions(): Promise<string[]> {
    const response = await apiClient.request('/permissions/actions', {
      method: 'GET',
    });
    return response;
  }

  // Buscar permissões por recurso
  async getPermissionsByResource(resourceSlug: string): Promise<Permission[]> {
    const response = await apiClient.request(`/permissions/by-resource/${resourceSlug}`, {
      method: 'GET',
    });
    return response;
  }
}

export const permissionsService = new PermissionsService();
