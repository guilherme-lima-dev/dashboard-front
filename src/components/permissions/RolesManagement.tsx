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
  Modal,
  Stack,
  TextInput,
  Textarea,
  MultiSelect,
  Switch,
  Alert,
  Loader
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconShield, 
  IconLock,
  IconAlertCircle
} from '@tabler/icons-react';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { ProtectedElement } from '@/components/auth/ProtectedRoute';
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES, Role, CreateRoleRequest } from '@/types/permissions';

export function RolesManagement() {
  const { canManagePermissions } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - substituir por dados reais da API
  const roles: Role[] = SYSTEM_ROLES;

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsCreateModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleSaveRole = async (isCreate: boolean) => {
    setIsLoading(true);
    try {
      // Implementar lógica de salvamento
      console.log(isCreate ? 'Criando role:' : 'Editando role:', selectedRole);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Erro ao salvar role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      // Implementar lógica de exclusão
      console.log('Excluindo role:', selectedRole);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Erro ao excluir role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rows = roles.map((role) => (
    <Table.Tr key={role.id}>
      <Table.Td>
        <Group gap="sm">
          <IconShield size={16} />
          <div>
            <Text fw={500}>{role.name}</Text>
            <Text size="sm" c="dimmed">{role.description}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{role.permissions.length} permissões</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          {role.isSystem && (
            <Badge color="blue" variant="light" leftSection={<IconLock size={12} />}>
              Sistema
            </Badge>
          )}
          <Badge color="green" variant="light">
            Ativo
          </Badge>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {new Date(role.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ProtectedElement
            requiredPermissions={['users:permissions']}
            fallback={null}
          >
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => handleEditRole(role)}
              disabled={role.isSystem}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </ProtectedElement>
          
          <ProtectedElement
            requiredPermissions={['users:permissions']}
            fallback={null}
          >
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDeleteRole(role)}
              disabled={role.isSystem}
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
          <Title order={3}>Roles do Sistema</Title>
          <Text c="dimmed" size="sm">
            Gerencie roles e suas permissões
          </Text>
        </div>
        
        <ProtectedElement
          requiredPermissions={['users:permissions']}
          fallback={null}
        >
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreateRole}>
            Nova Role
          </Button>
        </ProtectedElement>
      </Group>

      {/* Tabela de Roles */}
      <Card>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Role</Table.Th>
              <Table.Th>Permissões</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Criado em</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>

      {/* Modal de Criação/Edição */}
      <Modal
        opened={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isCreateModalOpen ? "Nova Role" : "Editar Role"}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Nome da Role"
            placeholder="Ex: Gerente de Vendas"
            value={selectedRole?.name || ''}
            onChange={(e) => setSelectedRole(prev => prev ? { ...prev, name: e.target.value } : null)}
          />
          
          <Textarea
            label="Descrição"
            placeholder="Descreva as responsabilidades desta role"
            value={selectedRole?.description || ''}
            onChange={(e) => setSelectedRole(prev => prev ? { ...prev, description: e.target.value } : null)}
            rows={3}
          />
          
          <MultiSelect
            label="Permissões"
            placeholder="Selecione as permissões"
            data={SYSTEM_PERMISSIONS.map(p => ({ value: p.id, label: p.name }))}
            value={selectedRole?.permissions || []}
            onChange={(value) => setSelectedRole(prev => prev ? { ...prev, permissions: value } : null)}
            searchable
            clearable
          />
          
          <Alert color="blue" title="Dica">
            <Text size="sm">
              Selecione as permissões que esta role deve ter. 
              Use a busca para encontrar permissões específicas.
            </Text>
          </Alert>
          
          <Group justify="flex-end" gap="sm">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSaveRole(isCreateModalOpen)} 
              loading={isLoading}
            >
              {isCreateModalOpen ? 'Criar' : 'Salvar'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Role"
        size="sm"
      >
        <Stack gap="md">
          <Alert color="red" title="Atenção" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              Tem certeza que deseja excluir a role <strong>{selectedRole?.name}</strong>?
              Esta ação não pode ser desfeita e pode afetar usuários que possuem esta role.
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
