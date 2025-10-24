'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { PERMISSIONS } from '@/lib/constants/permissions';

export function usePermissions() {
  const { user } = useAuthStore();

  const userPermissions = useMemo(() => {
    if (!user?.permissions) return [];
    return user.permissions;
  }, [user?.permissions]);

  const userRoles = useMemo(() => {
    if (!user?.roles) return [];
    return user.roles;
  }, [user?.roles]);

  // Verificar se usuário tem permissão específica
  const hasPermission = (permission: string): boolean => {
    if (!userPermissions.length) return false;
    return userPermissions.includes(permission);
  };

  // Verificar se usuário tem qualquer uma das permissões
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!userPermissions.length) return false;
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Verificar se usuário tem todas as permissões
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!userPermissions.length) return false;
    return permissions.every(permission => userPermissions.includes(permission));
  };

  // Verificar se usuário tem role específica
  const hasRole = (roleId: string): boolean => {
    if (!userRoles.length) return false;
    return userRoles.some(role => role.id === roleId);
  };

  // Verificar se usuário tem qualquer uma das roles
  const hasAnyRole = (roleIds: string[]): boolean => {
    if (!userRoles.length) return false;
    return roleIds.some(roleId => userRoles.some(role => role.id === roleId));
  };

  // Verificar se é super admin
  const isSuperAdmin = (): boolean => {
    return hasRole('super-admin') || hasPermission('system:admin');
  };

  // Verificar se é admin
  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('super-admin') || hasPermission('system:admin');
  };

  // Obter permissões por recurso
  const getPermissionsByResource = (resource: keyof typeof PERMISSIONS): string[] => {
    return Object.values(PERMISSIONS[resource]);
  };

  // Obter permissões por ação
  const getPermissionsByAction = (action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'manage'): string[] => {
    return Object.values(PERMISSIONS).map(resource => resource[action.toUpperCase() as keyof typeof resource]);
  };

  // Verificar se permissão existe
  const isValidPermission = (permission: string): boolean => {
    const allPermissions = Object.values(PERMISSIONS).flatMap(resource => Object.values(resource));
    return allPermissions.includes(permission);
  };

  // Verificar se pode acessar recurso
  const canAccessResource = (resource: string, action: string = 'read'): boolean => {
    const permission = `${resource}:${action}`;
    return hasPermission(permission);
  };

  // Verificar se pode gerenciar usuários
  const canManageUsers = (): boolean => {
    return hasPermission('users:write') || hasPermission('users:permissions');
  };

  // Verificar se pode gerenciar permissões
  const canManagePermissions = (): boolean => {
    return hasPermission('users:permissions') || isSuperAdmin();
  };

  // Verificar se pode acessar auditoria
  const canAccessAudit = (): boolean => {
    return hasPermission('audit:read') || isAdmin();
  };

  // Verificar se pode acessar configurações
  const canAccessSettings = (): boolean => {
    return hasPermission('settings:read') || isAdmin();
  };

  // Verificar se pode gerenciar configurações
  const canManageSettings = (): boolean => {
    return hasPermission('settings:write') || isAdmin();
  };

  // Verificar se pode exportar dados
  const canExportData = (resource: string): boolean => {
    return hasPermission(`${resource}:export`) || isAdmin();
  };

  return {
    // Estado
    userPermissions,
    userRoles,
    
    // Verificações básicas
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    
    // Verificações de nível
    isSuperAdmin,
    isAdmin,
    
    // Utilitários
    getPermissionsByResource,
    getPermissionsByAction,
    isValidPermission,
    
    // Verificações específicas
    canAccessResource,
    canManageUsers,
    canManagePermissions,
    canAccessAudit,
    canAccessSettings,
    canManageSettings,
    canExportData,
  };
}
