'use client';

import React from 'react';
import { Button, ButtonProps } from '@mantine/core';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface ConditionalButtonProps extends ButtonProps {
  permission: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
}

export const ConditionalButton: React.FC<ConditionalButtonProps> = ({
  permission,
  children,
  onClick,
  variant = 'filled',
  color = 'blue',
  disabled = false,
  ...props
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return null;
  }
  
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

// Botão condicional para múltiplas permissões
interface MultiPermissionButtonProps extends ButtonProps {
  permissions: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
}

export const MultiPermissionButton: React.FC<MultiPermissionButtonProps> = ({
  permissions,
  requireAll = false,
  children,
  onClick,
  variant = 'filled',
  color = 'blue',
  disabled = false,
  ...props
}) => {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();
  
  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);
  
  if (!hasAccess) {
    return null;
  }
  
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

// Botão condicional para role
interface RoleButtonProps extends ButtonProps {
  role: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
}

export const RoleButton: React.FC<RoleButtonProps> = ({
  role,
  children,
  onClick,
  variant = 'filled',
  color = 'blue',
  disabled = false,
  ...props
}) => {
  const { hasRole } = usePermissions();
  
  if (!hasRole(role)) {
    return null;
  }
  
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};
