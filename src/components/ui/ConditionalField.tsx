'use client';

import React from 'react';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface ConditionalFieldProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Campo condicional para múltiplas permissões
interface MultiPermissionFieldProps {
  permissions: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const MultiPermissionField: React.FC<MultiPermissionFieldProps> = ({
  permissions,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();
  
  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Campo condicional para role
interface RoleFieldProps {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleField: React.FC<RoleFieldProps> = ({
  role,
  children,
  fallback = null,
}) => {
  const { hasRole } = usePermissions();
  
  if (!hasRole(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
