'use client';

import { Table, Avatar, Badge, Group, Text, ActionIcon, Menu, Skeleton, Stack } from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconUserCheck, IconUserX, IconMail, IconPhone } from '@tabler/icons-react';
import { useUsers } from '@/lib/hooks/useUsers';

interface UsersTableProps {
  searchTerm: string;
  roleFilter: string | null;
  statusFilter: string | null;
}

export function UsersTable({ searchTerm, roleFilter, statusFilter }: UsersTableProps) {
  const { data: users = [], isLoading } = useUsers();

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      manager: 'Gerente',
      user: 'Usuário',
      viewer: 'Visualizador'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'red',
      manager: 'blue',
      user: 'green',
      viewer: 'gray'
    };
    return colors[role as keyof typeof colors] || 'gray';
  };

  const getStatusLabel = (status: string) => {
    const statuses = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente'
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      pending: 'yellow'
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (isLoading) {
    return (
      <Stack>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={60} radius="md" />
        ))}
      </Stack>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text c="gray.6" size="lg">
          Nenhum usuário encontrado
        </Text>
        <Text c="gray.5" size="sm" mt="xs">
          Os usuários aparecerão aqui quando a API estiver implementada
        </Text>
      </div>
    );
  }

  const rows = filteredUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} color="lilac" radius="xl">
            {user.avatar || user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Text fz="sm" fw={500}>
            {user.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <IconMail size={14} color="var(--mantine-color-gray-6)" />
          <Text fz="sm" c="dimmed">{user.email}</Text>
        </Group>
        {user.phone && (
          <Group gap="xs" mt={4}>
            <IconPhone size={14} color="var(--mantine-color-gray-6)" />
            <Text fz="sm" c="dimmed">{user.phone}</Text>
          </Group>
        )}
      </Table.Td>
      <Table.Td>
        <Badge color={getRoleColor(user.role)} variant="light">
          {getRoleLabel(user.role)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(user.status)} variant="light">
          {getStatusLabel(user.status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <Menu transitionProps={{ transition: 'pop' }} shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />}>
                Editar
              </Menu.Item>
              {user.status === 'active' ? (
                <Menu.Item leftSection={<IconUserX size={14} />} color="orange">
                  Desativar
                </Menu.Item>
              ) : (
                <Menu.Item leftSection={<IconUserCheck size={14} />} color="green">
                  Ativar
                </Menu.Item>
              )}
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                Deletar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Usuário</Table.Th>
            <Table.Th>Contato</Table.Th>
            <Table.Th>Função</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ width: 40 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}