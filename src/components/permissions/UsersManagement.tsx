'use client';

import { useState } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  Table, 
  Group, 
  Button, 
  Badge, 
  ActionIcon, 
  Menu, 
  Modal,
  Stack,
  Select,
  TextInput,
  Alert,
  Loader
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconShield, 
  IconUser, 
  IconMail,
  IconCalendar,
  IconAlertCircle
} from '@tabler/icons-react';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { ProtectedElement } from '@/components/auth/ProtectedRoute';

interface User {
  id: string;
  name: string;
  email: string;
  roles: Array<{ id: string; name: string; }>;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export function UsersManagement() {
  const { canManageUsers, canManagePermissions } = usePermissions();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - substituir por dados reais da API
  const users: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      roles: [{ id: 'admin', name: 'Administrador' }],
      isActive: true,
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      roles: [{ id: 'analyst', name: 'Analista' }],
      isActive: true,
      createdAt: '2024-01-10',
      lastLogin: '2024-01-19'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@example.com',
      roles: [{ id: 'viewer', name: 'Visualizador' }],
      isActive: false,
      createdAt: '2024-01-05',
      lastLogin: '2024-01-18'
    }
  ];

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async () => {
    setIsLoading(true);
    try {
      // Implementar lógica de salvamento
      console.log('Salvando usuário:', selectedUser);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      // Implementar lógica de exclusão
      console.log('Excluindo usuário:', selectedUser);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <IconUser size={16} />
          <div>
            <Text fw={500}>{user.name}</Text>
            <Text size="sm" c="dimmed">{user.email}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          {user.roles.map((role) => (
            <Badge key={role.id} color="blue" variant="light">
              {role.name}
            </Badge>
          ))}
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={user.isActive ? 'green' : 'red'} variant="light">
          {user.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ProtectedElement
            requiredPermissions={['users:write']}
            fallback={null}
          >
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => handleEditUser(user)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </ProtectedElement>
          
          <ProtectedElement
            requiredPermissions={['users:write']}
            fallback={null}
          >
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDeleteUser(user)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </ProtectedElement>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={3}>Usuários do Sistema</Title>
          <Text c="dimmed" size="sm">
            Gerencie usuários e suas permissões
          </Text>
        </div>
        
        <ProtectedElement
          requiredPermissions={['users:write']}
          fallback={null}
        >
          <Button leftSection={<IconPlus size={16} />}>
            Novo Usuário
          </Button>
        </ProtectedElement>
      </Group>

      {/* Tabela de Usuários */}
      <Card>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuário</Table.Th>
              <Table.Th>Roles</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Criado em</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>

      {/* Modal de Edição */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Usuário"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Nome"
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
            leftSection={<IconUser size={16} />}
          />
          
          <TextInput
            label="Email"
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
            leftSection={<IconMail size={16} />}
          />
          
          <Select
            label="Status"
            value={selectedUser?.isActive ? 'active' : 'inactive'}
            onChange={(value) => setSelectedUser(prev => prev ? { ...prev, isActive: value === 'active' } : null)}
            data={[
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' }
            ]}
          />
          
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} loading={isLoading}>
              Salvar
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Usuário"
        size="sm"
      >
        <Stack gap="md">
          <Alert color="red" title="Atenção" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
              Esta ação não pode ser desfeita.
            </Text>
          </Alert>
          
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button color="red" onClick={handleDeleteConfirm} loading={isLoading}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
