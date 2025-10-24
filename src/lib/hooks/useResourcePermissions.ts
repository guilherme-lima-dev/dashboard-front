'use client';

import { useMemo } from 'react';
import { usePermissions } from './usePermissions';
import { PERMISSIONS } from '@/lib/constants/permissions';

export function useResourcePermissions(resource: keyof typeof PERMISSIONS) {
  const { hasPermission } = usePermissions();
  
  const permissions = useMemo(() => {
    const resourcePermissions = PERMISSIONS[resource];
    
    return {
      canCreate: () => hasPermission(resourcePermissions.CREATE),
      canRead: () => hasPermission(resourcePermissions.READ),
      canUpdate: () => hasPermission(resourcePermissions.UPDATE),
      canDelete: () => hasPermission(resourcePermissions.DELETE),
      canExport: () => hasPermission(resourcePermissions.EXPORT),
      canManage: () => hasPermission(resourcePermissions.MANAGE),
      
      // Verificações combinadas
      canEdit: () => hasPermission(resourcePermissions.UPDATE) || hasPermission(resourcePermissions.MANAGE),
      canView: () => hasPermission(resourcePermissions.READ) || hasPermission(resourcePermissions.MANAGE),
      canFullAccess: () => hasPermission(resourcePermissions.MANAGE),
      
      // Verificações específicas
      canCreateOrUpdate: () => hasPermission(resourcePermissions.CREATE) || hasPermission(resourcePermissions.UPDATE),
      canReadOrExport: () => hasPermission(resourcePermissions.READ) || hasPermission(resourcePermissions.EXPORT),
      canDeleteOrManage: () => hasPermission(resourcePermissions.DELETE) || hasPermission(resourcePermissions.MANAGE),
    };
  }, [hasPermission, resource]);
  
  return permissions;
}

// Hook para verificação de múltiplos recursos
export function useMultiResourcePermissions(resources: (keyof typeof PERMISSIONS)[]) {
  const { hasPermission } = usePermissions();
  
  const permissions = useMemo(() => {
    return resources.reduce((acc, resource) => {
      const resourcePermissions = PERMISSIONS[resource];
      
      acc[resource] = {
        canCreate: () => hasPermission(resourcePermissions.CREATE),
        canRead: () => hasPermission(resourcePermissions.READ),
        canUpdate: () => hasPermission(resourcePermissions.UPDATE),
        canDelete: () => hasPermission(resourcePermissions.DELETE),
        canExport: () => hasPermission(resourcePermissions.EXPORT),
        canManage: () => hasPermission(resourcePermissions.MANAGE),
      };
      
      return acc;
    }, {} as Record<keyof typeof PERMISSIONS, any>);
  }, [hasPermission, resources]);
  
  return permissions;
}

// Hook para verificação de ações específicas
export function useActionPermissions(action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'manage') {
  const { hasPermission } = usePermissions();
  
  const permissions = useMemo(() => {
    const actionUpper = action.toUpperCase() as keyof typeof PERMISSIONS.DASHBOARD;
    
    return {
      dashboard: () => hasPermission(PERMISSIONS.DASHBOARD[actionUpper]),
      users: () => hasPermission(PERMISSIONS.USERS[actionUpper]),
      analytics: () => hasPermission(PERMISSIONS.ANALYTICS[actionUpper]),
      affiliates: () => hasPermission(PERMISSIONS.AFFILIATES[actionUpper]),
      products: () => hasPermission(PERMISSIONS.PRODUCTS[actionUpper]),
      orders: () => hasPermission(PERMISSIONS.ORDERS[actionUpper]),
      subscriptions: () => hasPermission(PERMISSIONS.SUBSCRIPTIONS[actionUpper]),
      transactions: () => hasPermission(PERMISSIONS.TRANSACTIONS[actionUpper]),
      customers: () => hasPermission(PERMISSIONS.CUSTOMERS[actionUpper]),
      integrations: () => hasPermission(PERMISSIONS.INTEGRATIONS[actionUpper]),
      reports: () => hasPermission(PERMISSIONS.REPORTS[actionUpper]),
      settings: () => hasPermission(PERMISSIONS.SETTINGS[actionUpper]),
      audit: () => hasPermission(PERMISSIONS.AUDIT[actionUpper]),
      system: () => hasPermission(PERMISSIONS.SYSTEM[actionUpper]),
    };
  }, [hasPermission, action]);
  
  return permissions;
}
