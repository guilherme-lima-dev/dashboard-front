'use client';

import React from 'react';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children,
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Componente para múltiplas permissões
interface MultiPermissionGuardProps {
  permissions: string[];
  requireAll?: boolean; // true = todas, false = qualquer uma
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const MultiPermissionGuard: React.FC<MultiPermissionGuardProps> = ({
  permissions,
  requireAll = false,
  fallback = null,
  children,
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

// Componente para verificação de role
interface RoleGuardProps {
  role: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  role,
  fallback = null,
  children,
}) => {
  const { hasRole } = usePermissions();
  
  if (!hasRole(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Componente para verificação de múltiplas roles
interface MultiRoleGuardProps {
  roles: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const MultiRoleGuard: React.FC<MultiRoleGuardProps> = ({
  roles,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasAnyRole, hasAllRoles } = usePermissions();
  
  const hasAccess = requireAll 
    ? hasAllRoles(roles)
    : hasAnyRole(roles);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
