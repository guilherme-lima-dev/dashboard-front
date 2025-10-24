'use client';

import { useState } from 'react';
import {
  Table, Group, Text, ActionIcon, Badge, Button, Modal, TextInput, Select, Checkbox, Stack, Title,
  Pagination, Flex, Loader, Center, Alert, Tabs, Card, ScrollArea, MultiSelect, Switch
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash, IconUserCheck, IconUserOff, IconSearch, IconShield, IconAlertCircle } from '@tabler/icons-react';
import { useUsers, useRoles, useUserRoles, useUserPermissions, useAssignRole, useRemoveRole } from '@/lib/hooks/useDynamicPermissions';
import { usePermissionCheck } from '@/lib/hooks/usePermissionCheck';
import { User, Role } from '@/lib/api/permissionsService';

export function UsersManagement() {
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useUsers();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { canManageUsers, canManageRoles, hasPermission } = usePermissionCheck();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>('users');
  
  const itemsPerPage = 10;

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      roles: [] as string[],
      isActive: true,
    },
    validate: {
      fullName: (value) => (value.length < 2 ? 'Nome completo deve ter pelo menos 2 caracteres' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      roles: (value) => (value.length === 0 ? 'Selecione pelo menos uma role' : null),
    },
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    form.setValues({
      fullName: user.fullName,
      email: user.email,
      roles: user.roles.map(r => r.id),
      isActive: user.isActive,
    });
    open();
  };

  const handleSubmit = (values: typeof form.values) => {
    if (selectedUser) {
      console.log('Updating user:', selectedUser.id, values);
      // TODO: Implementar atualização de usuário
      close();
    }
  };

  const filteredUsers = users?.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoadingUsers) {
    return (
      <Center style={{ height: 300 }}>
        <Loader color="lilac" />
      </Center>
    );
  }

  if (usersError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Erro">
        Erro ao carregar usuários: {usersError.message}
      </Alert>
    );
  }

  const rows = paginatedUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Text fw={500}>{user.fullName}</Text>
        <Text size="sm" c="dimmed">{user.email}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          {user.roles.map(role => (
            <Badge key={role.id} color="lilac" variant="light">{role.name}</Badge>
          ))}
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={user.isActive ? 'green' : 'red'} variant="light">
          {user.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          {canManageUsers() && (
            <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(user)}>
              <IconEdit size={18} />
            </ActionIcon>
          )}
          {canManageUsers() && (
            <ActionIcon variant="subtle" color={user.isActive ? 'red' : 'green'} onClick={() => console.log('Toggle active status for', user.id)}>
              {user.isActive ? <IconUserOff size={18} /> : <IconUserCheck size={18} />}
            </ActionIcon>
          )}
          {hasPermission('users:delete') && (
            <ActionIcon variant="subtle" color="red" onClick={() => console.log('Delete user', user.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack>
      <Group justify="space-between">
        <TextInput
          placeholder="Buscar usuários..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.currentTarget.value);
            setCurrentPage(1);
          }}
          style={{ flex: 1, maxWidth: 300 }}
        />
        {canManageUsers() && (
          <Button color="lilac" onClick={() => console.log('Add new user')}>
            Adicionar Usuário
          </Button>
        )}
      </Group>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Usuário</Table.Th>
            <Table.Th>Roles</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Flex justify="flex-end">
        <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} color="lilac" />
      </Flex>

      <Modal opened={opened} onClose={close} title={<Title order={3}>Editar Usuário</Title>} centered size="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="Nome Completo" placeholder="Nome do usuário" {...form.getInputProps('fullName')} />
            <TextInput label="Email" placeholder="email@example.com" {...form.getInputProps('email')} disabled />
            
            <MultiSelect
              label="Roles"
              placeholder="Selecione as roles"
              data={roles?.map(role => ({ value: role.id, label: role.name })) || []}
              searchable
              clearable
              {...form.getInputProps('roles')}
            />
            
            <Switch
              label="Usuário Ativo"
              {...form.getInputProps('isActive', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={close}>Cancelar</Button>
              <Button type="submit" color="lilac">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

// Componente para gerenciar roles de um usuário específico
export function UserRolesManagement({ userId }: { userId: string }) {
  const { data: userRoles, isLoading: isLoadingUserRoles } = useUserRoles(userId);
  const { data: allRoles, isLoading: isLoadingAllRoles } = useRoles();
  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();
  
  const [assigningRole, setAssigningRole] = useState<string | null>(null);

  const handleAssignRole = async (roleId: string) => {
    setAssigningRole(roleId);
    try {
      await assignRoleMutation.mutateAsync({ userId, roleId });
    } catch (error) {
      console.error('Erro ao atribuir role:', error);
    } finally {
      setAssigningRole(null);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      await removeRoleMutation.mutateAsync({ userId, roleId });
    } catch (error) {
      console.error('Erro ao remover role:', error);
    }
  };

  if (isLoadingUserRoles || isLoadingAllRoles) {
    return <Loader color="lilac" />;
  }

  const availableRoles = allRoles?.filter(role => 
    !userRoles?.some(userRole => userRole.id === role.id)
  ) || [];

  return (
    <Stack>
      <Title order={4}>Roles Atuais</Title>
      <Group gap="sm">
        {userRoles?.map(role => (
          <Badge 
            key={role.id} 
            color="lilac" 
            variant="filled"
            rightSection={
              <ActionIcon 
                size="xs" 
                color="white" 
                variant="transparent"
                onClick={() => handleRemoveRole(role.id)}
                loading={removeRoleMutation.isPending}
              >
                <IconTrash size={12} />
              </ActionIcon>
            }
          >
            {role.name}
          </Badge>
        ))}
      </Group>

      <Title order={4}>Roles Disponíveis</Title>
      <Group gap="sm">
        {availableRoles.map(role => (
          <Badge 
            key={role.id} 
            color="gray" 
            variant="outline"
            rightSection={
              <ActionIcon 
                size="xs" 
                color="lilac" 
                variant="transparent"
                onClick={() => handleAssignRole(role.id)}
                loading={assigningRole === role.id}
              >
                <IconUserCheck size={12} />
              </ActionIcon>
            }
          >
            {role.name}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
}
