'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Container, Stack, Title, Text, Button, Alert } from '@mantine/core';
import { IconShield, IconLock, IconAlertCircle } from '@tabler/icons-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAll?: boolean; // Se true, precisa de TODAS as permissões/roles
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasRole, hasAnyPermission, hasAnyRole, hasAllPermissions, hasAllRoles } = usePermissions();
  const router = useRouter();

  // Loading state
  if (isLoading) {
    return (
      <Container size="sm" py="xl">
        <Stack align="center" gap="md">
          <IconShield size={48} stroke={1.5} />
          <Title order={3}>Verificando permissões...</Title>
          <Text c="dimmed">Aguarde enquanto verificamos seu acesso.</Text>
        </Stack>
      </Container>
    );
  }

  // Não autenticado
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <Container size="sm" py="xl">
        <Stack align="center" gap="md">
          <IconLock size={48} stroke={1.5} color="red" />
          <Title order={3} c="red">Acesso Negado</Title>
          <Text c="dimmed">Você precisa estar logado para acessar esta página.</Text>
          <Button onClick={() => router.push(redirectTo)}>
            Fazer Login
          </Button>
        </Stack>
      </Container>
    );
  }

  // Verificar permissões
  let hasRequiredAccess = true;

  if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasRequiredAccess = hasAllPermissions(requiredPermissions);
    } else {
      hasRequiredAccess = hasAnyPermission(requiredPermissions);
    }
  }

  if (requiredRoles.length > 0) {
    if (requireAll) {
      hasRequiredAccess = hasRequiredAccess && hasAllRoles(requiredRoles);
    } else {
      hasRequiredAccess = hasRequiredAccess && hasAnyRole(requiredRoles);
    }
  }

  // Sem acesso
  if (!hasRequiredAccess) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <Container size="sm" py="xl">
        <Stack align="center" gap="md">
          <IconAlertCircle size={48} stroke={1.5} color="orange" />
          <Title order={3} c="orange">Permissão Insuficiente</Title>
          <Text c="dimmed">
            Você não tem permissão para acessar esta página.
          </Text>
          <Alert color="orange" title="Acesso Negado" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              Entre em contato com o administrador para solicitar as permissões necessárias.
            </Text>
          </Alert>
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
        </Stack>
      </Container>
    );
  }

  // Acesso autorizado
  return <>{children}</>;
}

// Componente para proteger elementos específicos
interface ProtectedElementProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function ProtectedElement({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallback = null
}: ProtectedElementProps) {
  const { hasPermission, hasRole, hasAnyPermission, hasAnyRole, hasAllPermissions, hasAllRoles } = usePermissions();

  let hasRequiredAccess = true;

  if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasRequiredAccess = hasAllPermissions(requiredPermissions);
    } else {
      hasRequiredAccess = hasAnyPermission(requiredPermissions);
    }
  }

  if (requiredRoles.length > 0) {
    if (requireAll) {
      hasRequiredAccess = hasRequiredAccess && hasAllRoles(requiredRoles);
    } else {
      hasRequiredAccess = hasRequiredAccess && hasAnyRole(requiredRoles);
    }
  }

  if (!hasRequiredAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
