'use client';

import { useState, useEffect } from 'react';
import { 
  Title,
  Table,
  Button,
  Badge,
  Group,
  Text,
  Modal,
  Stack,
  Alert,
  Loader,
  Center,
  TextInput,
  Pagination,
  Card,
  ActionIcon,
  Tooltip,
  Container,
  Paper,
  Textarea
} from '@mantine/core';
import { 
  IconPlus,
  IconEdit,
  IconTrash,
  IconShield,
  IconAlertCircle,
  IconSearch
} from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import AdminLayout from '../../components/AdminLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRoleData {
  name: string;
  slug: string;
  description: string;
}

export default function RolesPage() {
  const { user, hasPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [createRoleForm, setCreateRoleForm] = useState<CreateRoleData>({
    name: '',
    slug: '',
    description: ''
  });

  const fetchRoles = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        notifications.show({
          title: 'Erro',
          message: 'Token de acesso não encontrado',
          color: 'red',
        });
        return;
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });

      const response = await fetch(`${API_BASE_URL}/permissions/roles?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar roles');
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setRoles(data);
        setTotalPages(1);
      } else if (data.roles) {
        setRoles(data.roles);
        setTotalPages(data.totalPages || 1);
      } else {
        setRoles(data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
      notifications.show({
        title: 'Erro',
        message: 'Falha ao carregar roles',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/permissions/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createRoleForm),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar role');
      }

      notifications.show({
        title: 'Sucesso',
        message: 'Role criado com sucesso',
        color: 'green',
      });

      setModalOpened(false);
      setCreateRoleForm({ name: '', slug: '', description: '' });
      fetchRoles(currentPage, searchTerm);
    } catch (error) {
      console.error('Erro ao criar role:', error);
      notifications.show({
        title: 'Erro',
        message: 'Falha ao criar role',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');

      const updateData = {
        name: createRoleForm.name,
        description: createRoleForm.description
      };

      const response = await fetch(`${API_BASE_URL}/permissions/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Falha ao editar role');
      }

      notifications.show({
        title: 'Sucesso',
        message: 'Role editado com sucesso',
        color: 'green',
      });

      setModalOpened(false);
      setSelectedRole(null);
      setCreateRoleForm({ name: '', slug: '', description: '' });
      fetchRoles(currentPage, searchTerm);
    } catch (error) {
      console.error('Erro ao editar role:', error);
      notifications.show({
        title: 'Erro',
        message: 'Falha ao editar role',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/permissions/roles/${selectedRole.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir role');
      }

      notifications.show({
        title: 'Sucesso',
        message: 'Role excluído com sucesso',
        color: 'green',
      });

      setModalOpened(false);
      setSelectedRole(null);
      fetchRoles(currentPage, searchTerm);
    } catch (error) {
      console.error('Erro ao excluir role:', error);
      notifications.show({
        title: 'Erro',
        message: 'Falha ao excluir role',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setCreateRoleForm({ name: '', slug: '', description: '' });
    setModalOpened(true);
  };

  const openEditModal = (role: Role) => {
    setModalType('edit');
    setSelectedRole(role);
    setCreateRoleForm({
      name: role.name,
      slug: role.slug,
      description: role.description || ''
    });
    setModalOpened(true);
  };

  const openDeleteModal = (role: Role) => {
    setModalType('delete');
    setSelectedRole(role);
    setModalOpened(true);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== '') {
        fetchRoles(1, searchTerm);
        setCurrentPage(1);
      } else {
        fetchRoles(currentPage);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRoles(page, searchTerm);
  };

  if (!user) {
    return (
      <AdminLayout>
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </AdminLayout>
    );
  }

  if (!hasPermission('roles:read')) {
    return (
      <AdminLayout>
        <Container size="md" py="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Acesso Negado"
            color="red"
          >
            Você não tem permissão para visualizar roles.
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2}>Gestão de Roles</Title>
          {hasPermission('roles:create') && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateModal}
            >
              Novo Role
            </Button>
          )}
        </Group>

        <Card withBorder>
          <Stack gap="md">
            <TextInput
              placeholder="Buscar roles..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
              <Center py="xl">
                <Loader size="md" />
              </Center>
            ) : roles.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <IconShield size={48} color="gray" />
                  <Text c="dimmed">
                    {searchTerm ? 'Nenhum role encontrado' : 'Nenhum role cadastrado'}
                  </Text>
                </Stack>
              </Center>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nome</Table.Th>
                    <Table.Th>Slug</Table.Th>
                    <Table.Th>Descrição</Table.Th>
                    <Table.Th>Data de Criação</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {roles.map((role) => (
                    <Table.Tr key={role.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <IconShield size={16} color="blue" />
                          <Text fw={500}>{role.name}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="blue">
                          {role.slug}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {role.description || 'Sem descrição'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(role.createdAt).toLocaleDateString('pt-BR')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {hasPermission('roles:update') && (
                            <Tooltip label="Editar">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => openEditModal(role)}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          {hasPermission('roles:delete') && (
                            <Tooltip label="Excluir">
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => openDeleteModal(role)}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}

            {totalPages > 1 && (
              <Group justify="center">
                <Pagination
                  value={currentPage}
                  onChange={handlePageChange}
                  total={totalPages}
                />
              </Group>
            )}
          </Stack>
        </Card>

        {/* Modal para Criar/Editar Role */}
        <Modal
          opened={modalOpened && (modalType === 'create' || modalType === 'edit')}
          onClose={() => {
            setModalOpened(false);
            setSelectedRole(null);
            setCreateRoleForm({ name: '', slug: '', description: '' });
          }}
          title={modalType === 'create' ? 'Criar Novo Role' : 'Editar Role'}
          size="md"
        >
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Digite o nome do role"
              value={createRoleForm.name}
              onChange={(e) => {
                const name = e.target.value;
                if (modalType === 'create') {
                  const slug = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                  setCreateRoleForm(prev => ({ ...prev, name, slug }));
                } else {
                  setCreateRoleForm(prev => ({ ...prev, name }));
                }
              }}
              required
            />
            <TextInput
              label="Slug"
              placeholder="slug_do_role"
              value={createRoleForm.slug}
              onChange={(e) => setCreateRoleForm(prev => ({ ...prev, slug: e.target.value }))}
              disabled={modalType === 'edit'}
              required
            />
            <Textarea
              label="Descrição"
              placeholder="Descreva as responsabilidades deste role"
              value={createRoleForm.description}
              onChange={(e) => setCreateRoleForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpened(false);
                  setSelectedRole(null);
                  setCreateRoleForm({ name: '', slug: '', description: '' });
                }}
              >
                Cancelar
              </Button>
              <Button
                loading={actionLoading}
                onClick={modalType === 'create' ? handleCreateRole : handleEditRole}
                disabled={!createRoleForm.name || !createRoleForm.slug}
              >
                {modalType === 'create' ? 'Criar Role' : 'Salvar Alterações'}
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Modal para Excluir Role */}
        <Modal
          opened={modalOpened && modalType === 'delete'}
          onClose={() => {
            setModalOpened(false);
            setSelectedRole(null);
          }}
          title="Excluir Role"
        >
          <Stack>
            <Text>
              Tem certeza que deseja excluir o role{' '}
              <strong>{selectedRole?.name}</strong>?
            </Text>
            <Text size="sm" c="dimmed">
              Esta ação não pode ser desfeita.
            </Text>
            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpened(false);
                  setSelectedRole(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                color="red"
                loading={actionLoading}
                onClick={handleDeleteRole}
              >
                Excluir
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </AdminLayout>
  );
}