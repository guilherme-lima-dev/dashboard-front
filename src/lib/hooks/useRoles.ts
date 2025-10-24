'use client';

import { useMemo } from 'react';
import { usePermissions } from './usePermissions';
import { ROLES } from '@/lib/constants/permissions';

export function useRoles() {
  const { hasRole } = usePermissions();
  
  const roles = useMemo(() => {
    return {
      isSuperAdmin: () => hasRole(ROLES.SUPER_ADMIN),
      isAdmin: () => hasRole(ROLES.ADMIN),
      isAnalyst: () => hasRole(ROLES.ANALYST),
      
      // Verificações combinadas
      isAdminOrSuper: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      isAnalystOrAbove: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Verificações específicas
      canManageUsers: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageSystem: () => hasRole(ROLES.SUPER_ADMIN),
      canViewAnalytics: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canExportData: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Verificações de nível
      hasAdminLevel: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      hasAnalystLevel: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      hasSuperAdminLevel: () => hasRole(ROLES.SUPER_ADMIN),
    };
  }, [hasRole]);
  
  return roles;
}

// Hook para verificação de roles específicas
export function useRolePermissions() {
  const { hasRole } = usePermissions();
  
  const rolePermissions = useMemo(() => {
    return {
      // Permissões de usuários
      canCreateUsers: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canEditUsers: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canDeleteUsers: () => hasRole(ROLES.SUPER_ADMIN),
      canManageUserRoles: () => hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de analytics
      canViewAnalytics: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canExportAnalytics: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageAnalytics: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de afiliados
      canViewAffiliates: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageAffiliates: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canCreateAffiliates: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de produtos
      canViewProducts: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageProducts: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canCreateProducts: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de pedidos
      canViewOrders: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageOrders: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canUpdateOrders: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de assinaturas
      canViewSubscriptions: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageSubscriptions: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canUpdateSubscriptions: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de transações
      canViewTransactions: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canExportTransactions: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de clientes
      canViewCustomers: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageCustomers: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canCreateCustomers: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de integrações
      canViewIntegrations: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageIntegrations: () => hasRole(ROLES.SUPER_ADMIN),
      canUpdateIntegrations: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de relatórios
      canViewReports: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canExportReports: () => hasRole(ROLES.ANALYST) || hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageReports: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de configurações
      canViewSettings: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageSettings: () => hasRole(ROLES.SUPER_ADMIN),
      canUpdateSettings: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de auditoria
      canViewAudit: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canExportAudit: () => hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN),
      canManageAudit: () => hasRole(ROLES.SUPER_ADMIN),
      
      // Permissões de sistema
      canViewSystem: () => hasRole(ROLES.SUPER_ADMIN),
      canManageSystem: () => hasRole(ROLES.SUPER_ADMIN),
    };
  }, [hasRole]);
  
  return rolePermissions;
}
