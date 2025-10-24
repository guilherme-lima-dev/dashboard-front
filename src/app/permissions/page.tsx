'use client';

import { useState } from 'react';
import { Container, Title, Text, Tabs, Stack, Group, Button, Alert } from '@mantine/core';
import { IconUsers, IconShield, IconSettings, IconAlertCircle } from '@tabler/icons-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UsersManagement } from '@/components/permissions/UsersManagement';
import { RolesManagement } from '@/components/permissions/RolesManagement';
import { PermissionsMatrix } from '@/components/permissions/PermissionsMatrix';
import { usePermissions } from '@/lib/hooks/usePermissions';

export default function PermissionsPage() {
  const { canManagePermissions, canManageUsers } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>('users');

  return (
    <ProtectedRoute
      requiredPermissions={['users:permissions']}
      fallback={
        <Container size="sm" py="xl">
          <Stack align="center" gap="md">
            <IconAlertCircle size={48} stroke={1.5} color="red" />
            <Title order={3} c="red">Acesso Negado</Title>
            <Text c="dimmed">
              Você não tem permissão para gerenciar permissões do sistema.
            </Text>
          </Stack>
        </Container>
      }
    >
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Header */}
          <div>
            <Title order={1} mb="xs">Gerenciamento de Permissões</Title>
            <Text c="dimmed" size="lg">
              Gerencie usuários, roles e permissões do sistema
            </Text>
          </div>

          {/* Alertas de Permissão */}
          {!canManageUsers && (
            <Alert color="orange" title="Permissão Limitada" icon={<IconAlertCircle size={16} />}>
              <Text size="sm">
                Você tem acesso limitado ao gerenciamento de usuários. 
                Entre em contato com o administrador para solicitar permissões adicionais.
              </Text>
            </Alert>
          )}

          {/* Tabs de Gerenciamento */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'users')}>
            <Tabs.List>
              <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
                Usuários
              </Tabs.Tab>
              <Tabs.Tab value="roles" leftSection={<IconShield size={16} />}>
                Roles
              </Tabs.Tab>
              <Tabs.Tab value="permissions" leftSection={<IconSettings size={16} />}>
                Permissões
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="users" pt="md">
              <UsersManagement />
            </Tabs.Panel>

            <Tabs.Panel value="roles" pt="md">
              <RolesManagement />
            </Tabs.Panel>

            <Tabs.Panel value="permissions" pt="md">
              <PermissionsMatrix />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
}
