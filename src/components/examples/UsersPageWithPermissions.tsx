'use client';

import React from 'react';
import { Container, Title, Text, Group, Button, Table, ActionIcon, Badge, Stack } from '@mantine/core';
import { IconPlus, IconDownload, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { ConditionalButton } from '@/components/ui/ConditionalButton';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { PERMISSIONS } from '@/lib/constants/permissions';

// Mock data
const users = [
  { id: '1', name: 'João Silva', email: 'joao@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Maria Santos', email: 'maria@example.com', role: 'analyst', status: 'active' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@example.com', role: 'viewer', status: 'inactive' },
];

export function UsersPageWithPermissions() {
  const { hasPermission } = usePermissions();
  
  const renderActions = (user: any) => (
    <Group gap="xs" justify="flex-end">
      {/* Ver usuário - apenas para quem pode ler */}
      <ConditionalButton
        permission={PERMISSIONS.USERS.READ}
        variant="subtle"
        size="sm"
        leftSection={<IconEye size={16} />}
        onClick={() => console.log('Ver usuário:', user.id)}
      >
        Ver
      </ConditionalButton>
      
      {/* Editar usuário - apenas para quem pode editar */}
      <ConditionalButton
        permission={PERMISSIONS.USERS.UPDATE}
        variant="subtle"
        size="sm"
        leftSection={<IconEdit size={16} />}
        onClick={() => console.log('Editar usuário:', user.id)}
      >
        Editar
      </ConditionalButton>
      
      {/* Excluir usuário - apenas para quem pode excluir */}
      <ConditionalButton
        permission={PERMISSIONS.USERS.DELETE}
        variant="subtle"
        size="sm"
        color="red"
        leftSection={<IconTrash size={16} />}
        onClick={() => console.log('Excluir usuário:', user.id)}
      >
        Excluir
      </ConditionalButton>
    </Group>
  );
  
  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Text fw={500}>{user.name}</Text>
        <Text size="sm" c="dimmed">{user.email}</Text>
      </Table.Td>
      <Table.Td>
        <Badge color="blue" variant="light">
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={user.status === 'active' ? 'green' : 'red'} variant="light">
          {user.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        {renderActions(user)}
      </Table.Td>
    </Table.Tr>
  ));
  
  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* Header com ações condicionais */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Usuários</Title>
            <Text c="dimmed">Gerencie usuários do sistema</Text>
          </div>
          
          <Group gap="sm">
            {/* Botão de criar usuário - apenas para quem pode criar */}
            <ConditionalButton
              permission={PERMISSIONS.USERS.CREATE}
              leftSection={<IconPlus size={16} />}
              onClick={() => console.log('Criar usuário')}
            >
              Novo Usuário
            </ConditionalButton>
            
            {/* Botão de exportar - apenas para quem pode exportar */}
            <ConditionalButton
              permission={PERMISSIONS.USERS.EXPORT}
              variant="outline"
              leftSection={<IconDownload size={16} />}
              onClick={() => console.log('Exportar usuários')}
            >
              Exportar
            </ConditionalButton>
          </Group>
        </Group>

        {/* Tabela de usuários - sempre visível para quem tem users:read */}
        <PermissionGuard 
          permission={PERMISSIONS.USERS.READ}
          fallback={
            <div>
              <Text c="dimmed">Você não tem permissão para visualizar usuários</Text>
            </div>
          }
        >
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Usuário</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </PermissionGuard>

        {/* Seção de administração - apenas para quem pode gerenciar */}
        <PermissionGuard permission={PERMISSIONS.USERS.MANAGE}>
          <div>
            <Title order={3} mb="md">Administração de Usuários</Title>
            <Text>Conteúdo administrativo avançado...</Text>
          </div>
        </PermissionGuard>

        {/* Estatísticas - apenas para quem pode ler */}
        <PermissionGuard permission={PERMISSIONS.USERS.READ}>
          <div>
            <Title order={3} mb="md">Estatísticas</Title>
            <Text>Total de usuários: {users.length}</Text>
            <Text>Usuários ativos: {users.filter(u => u.status === 'active').length}</Text>
          </div>
        </PermissionGuard>
      </Stack>
    </Container>
  );
}
