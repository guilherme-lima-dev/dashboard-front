'use client';

import { Container, Title, Text, Tabs, Stack, Alert, Loader, Center } from '@mantine/core';
import { IconUsers, IconShield, IconListDetails, IconAlertCircle } from '@tabler/icons-react';
import { UsersManagement, UserRolesManagement } from '@/components/admin/UsersManagement';
import { RolesManagement, RolePermissionsView } from '@/components/admin/RolesManagement';
import { usePermissionCheck } from '@/lib/hooks/usePermissionCheck';
import { useUsers, useRoles } from '@/lib/hooks/useDynamicPermissions';
import { AppLayout } from '@/components/layout/AppLayout';
import { useState } from 'react';

export default function AdminPage() {
  const { canManageUsers, canManageRoles, canManagePermissions, isLoading } = usePermissionCheck();
  const { data: users } = useUsers();
  const { data: roles } = useRoles();
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <AppLayout>
        <Center style={{ height: '100vh' }}>
          <Loader color="lilac" size="xl" />
        </Center>
      </AppLayout>
    );
  }

  // Verificar se tem permissão para acessar a página
  if (!canManageUsers() && !canManageRoles() && !canManagePermissions()) {
    return (
      <AppLayout>
        <Container size="xl" py="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Acesso Negado">
            Você não tem permissão para acessar esta página.
          </Alert>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="xl">
          <div>
            <Title order={1} mb="xs" c="lilac.7">Gestão de Usuários e Permissões</Title>
            <Text c="gray.6">
              Gerencie usuários, roles e permissões do sistema de forma dinâmica.
              <br />
              <Text span c="green" fw={500}>
                ✅ Sistema dinâmico - não precisa alterar código para modificar permissões!
              </Text>
            </Text>
          </div>

          <Tabs defaultValue="users" color="lilac">
            <Tabs.List>
              {canManageUsers() && (
                <Tabs.Tab value="users" leftSection={<IconUsers size={20} />}>
                  Usuários ({users?.length || 0})
                </Tabs.Tab>
              )}
              {canManageRoles() && (
                <Tabs.Tab value="roles" leftSection={<IconShield size={20} />}>
                  Roles ({roles?.length || 0})
                </Tabs.Tab>
              )}
              {canManagePermissions() && (
                <Tabs.Tab value="permissions" leftSection={<IconListDetails size={20} />}>
                  Permissões
                </Tabs.Tab>
              )}
            </Tabs.List>

            {canManageUsers() && (
              <Tabs.Panel value="users" pt="xs">
                <UsersManagement />
                
                {selectedUserId && (
                  <div style={{ marginTop: '2rem' }}>
                    <Title order={3} mb="md">Gerenciar Roles do Usuário</Title>
                    <UserRolesManagement userId={selectedUserId} />
                  </div>
                )}
              </Tabs.Panel>
            )}

            {canManageRoles() && (
              <Tabs.Panel value="roles" pt="xs">
                <RolesManagement />
                
                {selectedRoleId && (
                  <div style={{ marginTop: '2rem' }}>
                    <RolePermissionsView roleId={selectedRoleId} />
                  </div>
                )}
              </Tabs.Panel>
            )}

            {canManagePermissions() && (
              <Tabs.Panel value="permissions" pt="xs">
                <Alert icon={<IconAlertCircle size={16} />} color="blue" title="Sistema Dinâmico">
                  <Text>
                    As permissões são gerenciadas dinamicamente através da API.
                    <br />
                    <strong>Vantagens:</strong>
                    <br />
                    • Não precisa alterar código para modificar permissões
                    <br />
                    • Cliente pode gerenciar roles e permissões autonomamente
                    <br />
                    • Atualizações em tempo real
                    <br />
                    • Sistema escalável e flexível
                  </Text>
                </Alert>
              </Tabs.Panel>
            )}
          </Tabs>
        </Stack>
      </Container>
    </AppLayout>
  );
}
