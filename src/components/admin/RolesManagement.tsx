'use client';

import { useState } from 'react';
import {
  Table, Group, Text, ActionIcon, Badge, Button, Modal, TextInput, Stack, Title,
  Pagination, Flex, Loader, Center, Alert, ScrollArea, MultiSelect, Switch, Textarea, Card
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle, IconShield } from '@tabler/icons-react';
import { useRoles, usePermissions, useCreateRole, useUpdateRole, useDeleteRole } from '@/lib/hooks/useDynamicPermissions';
import { usePermissionCheck } from '@/lib/hooks/usePermissionCheck';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@/lib/api/permissionsService';

export function RolesManagement() {
  const { data: roles, isLoading: isLoadingRoles, error: rolesError } = useRoles();
  const { data: permissions, isLoading: isLoadingPermissions } = usePermissions();
  const { canManageRoles, hasPermission } = usePermissionCheck();
  
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [isCreating, setIsCreating] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      permissions: [] as string[],
    },
    validate: {
      name: (value) => (value.length < 3 ? 'Nome da role deve ter pelo menos 3 caracteres' : null),
      description: (value) => (value.length < 5 ? 'Descrição deve ter pelo menos 5 caracteres' : null),
      permissions: (value) => (value.length === 0 ? 'Selecione pelo menos uma permissão' : null),
    },
  });

  const handleCreateRole = () => {
    setIsCreating(true);
    form.reset();
    open();
  };

  const handleEditRole = (role: Role) => {
    setIsCreating(false);
    setSelectedRole(role);
    form.setValues({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions,
    });
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (isCreating) {
        await createRoleMutation.mutateAsync(values);
      } else if (selectedRole) {
        await updateRoleMutation.mutateAsync({
          roleId: selectedRole.id,
          data: values,
        });
      }
      close();
    } catch (error) {
      console.error('Erro ao salvar role:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta role?')) {
      try {
        await deleteRoleMutation.mutateAsync(roleId);
      } catch (error) {
        console.error('Erro ao excluir role:', error);
      }
    }
  };

  const totalPages = Math.ceil((roles?.length || 0) / itemsPerPage);
  const paginatedRoles = roles?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  if (isLoadingRoles) {
    return (
      <Center style={{ height: 300 }}>
        <Loader color="lilac" />
      </Center>
    );
  }

  if (rolesError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Erro">
        Erro ao carregar roles: {rolesError.message}
      </Alert>
    );
  }

  const rows = paginatedRoles.map((role) => (
    <Table.Tr key={role.id}>
      <Table.Td>
        <Group gap="xs">
          <Text fw={500}>{role.name}</Text>
          {role.isSystem && <Badge size="xs" variant="outline" color="gray">Sistema</Badge>}
        </Group>
        {role.description && (
          <Text size="sm" c="dimmed">{role.description}</Text>
        )}
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          {role.permissions.slice(0, 3).map(permission => (
            <Badge key={permission} variant="light" color="blue" size="xs">
              {permission.split(':')[1]}
            </Badge>
          ))}
          {role.permissions.length > 3 && (
            <Badge variant="light" color="gray" size="xs">
              +{role.permissions.length - 3} mais
            </Badge>
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          {canManageRoles() && !role.isSystem && (
            <ActionIcon variant="subtle" color="blue" onClick={() => handleEditRole(role)}>
              <IconEdit size={18} />
            </ActionIcon>
          )}
          {canManageRoles() && !role.isSystem && (
            <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteRole(role.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          )}
          {role.isSystem && (
            <Text size="sm" c="dimmed">Sistema</Text>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack>
      <Group justify="flex-end">
        {canManageRoles() && (
          <Button 
            color="lilac" 
            leftSection={<IconPlus size={18} />} 
            onClick={handleCreateRole}
            loading={createRoleMutation.isPending}
          >
            Criar Nova Role
          </Button>
        )}
      </Group>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Permissões</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Flex justify="flex-end">
        <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} color="lilac" />
      </Flex>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={
          <Title order={3}>
            {isCreating ? 'Criar Nova Role' : 'Editar Role'}
          </Title>
        } 
        centered 
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Nome da Role"
              placeholder="Ex: editor-de-conteudo"
              {...form.getInputProps('name')}
              disabled={!isCreating && selectedRole?.isSystem}
            />
            
            <Textarea
              label="Descrição"
              placeholder="Descreva as responsabilidades desta role"
              minRows={3}
              {...form.getInputProps('description')}
            />
            
            <MultiSelect
              label="Permissões"
              placeholder="Selecione as permissões para esta role"
              data={permissions?.map(p => ({ 
                value: p.name, 
                label: `${p.resource}:${p.action}` 
              })) || []}
              searchable
              clearable
              {...form.getInputProps('permissions')}
            />

            {!isCreating && selectedRole?.isSystem && (
              <Alert icon={<IconAlertCircle size={16} />} color="orange" title="Role do Sistema">
                Roles do sistema não podem ter seu nome ou permissões alteradas diretamente.
              </Alert>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={close}>Cancelar</Button>
              <Button 
                type="submit" 
                color="lilac" 
                disabled={!canManageRoles() || (!isCreating && selectedRole?.isSystem)}
                loading={createRoleMutation.isPending || updateRoleMutation.isPending}
              >
                {isCreating ? 'Criar Role' : 'Salvar Alterações'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

// Componente para visualizar permissões de uma role
export function RolePermissionsView({ roleId }: { roleId: string }) {
  const { data: role } = useRoles();
  const { data: permissions } = usePermissions();
  
  const roleData = role?.find(r => r.id === roleId);
  
  if (!roleData) {
    return <Text c="dimmed">Role não encontrada</Text>;
  }

  const rolePermissions = permissions?.filter(p => 
    roleData.permissions.includes(p.name)
  ) || [];

  const permissionsByResource = rolePermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, typeof rolePermissions>);

  return (
    <Stack>
      <Title order={4}>Permissões da Role: {roleData.name}</Title>
      
      {Object.entries(permissionsByResource).map(([resource, perms]) => (
        <Card key={resource} withBorder>
          <Text fw={500} mb="sm" c="lilac.7">
            {resource.charAt(0).toUpperCase() + resource.slice(1)}
          </Text>
          <Group gap="xs">
            {perms.map(permission => (
              <Badge 
                key={permission.id} 
                variant="light" 
                color="blue"
              >
                {permission.action}
              </Badge>
            ))}
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
