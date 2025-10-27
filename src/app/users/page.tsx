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
  Select,
  Pagination,
  Card,
  ActionIcon,
  Tooltip,
  Container,
  Paper,
  PasswordInput
} from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconSearch,
  IconAlertCircle,
  IconUser,
  IconMail,
  IconCalendar,
  IconInfoCircle,
  IconPlus,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import AdminLayout from '../components/AdminLayout';

interface User {
  id: string;
  email: string;
  fullName: string;
  status: 'pending_approval' | 'active' | 'suspended';
  createdAt: string;
  roles?: string[];
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Permission {
  id: string;
  name: string;
  slug: string;
  resource: string;
  action: string;
}

interface CreateUserData {
  email: string;
  fullName: string;
  password: string;
  status: string;
  roleId?: string;
}

export default function UsersPage() {
  const { user, isAuthenticated, isLoading: authLoading, hasPermission } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'create' | 'edit' | 'delete' | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionLoading, setActionLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [createUserForm, setCreateUserForm] = useState<CreateUserData>({
    email: '',
    fullName: '',
    password: '',
    status: 'pending_approval',
    roleId: ''
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`${API_BASE_URL}/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar usuários');
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/permissions/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const rolesData: Role[] = await response.json();
        setRoles(rolesData);
      }
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const permissionsData: Permission[] = await response.json();
        setPermissions(permissionsData);
      }
    } catch (error) {
      console.error('Erro ao carregar permissions:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasPermission('users:read')) {
      fetchUsers();
      fetchRoles();
      fetchPermissions();
    }
  }, [isAuthenticated, hasPermission, page, search, statusFilter]);

  const handleCreateUser = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const { roleId, ...userPayload } = createUserForm;
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar usuário');
      }

      if (createUserForm.roleId) {
        const newUser = await response.json();
        await fetch(`${API_BASE_URL}/permissions/users/assign-role`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: newUser.id,
            roleId: createUserForm.roleId
          }),
        });
      }

      notifications.show({
        title: 'Sucesso',
        message: 'Usuário criado com sucesso',
        color: 'green',
      });

      setModalType(null);
      setModalOpened(false);
      setCreateUserForm({
        email: '',
        fullName: '',
        password: '',
        status: 'pending_approval',
        roleId: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao criar usuário',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserAction = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/users/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          approved: actionType === 'approve',
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar ação');
      }

      notifications.show({
        title: 'Sucesso',
        message: `Usuário ${actionType === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso`,
        color: 'green',
      });

      setModalOpened(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao processar ação:', error);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao processar ação',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const editPayload = {
        fullName: createUserForm.fullName,
        status: createUserForm.status
      };
      
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPayload),
      });

      if (!response.ok) {
        throw new Error('Falha ao editar usuário');
      }

      if (createUserForm.roleId && createUserForm.roleId !== selectedUser.roles?.[0]) {
        await fetch(`${API_BASE_URL}/permissions/users/assign-role`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            roleId: createUserForm.roleId
          }),
        });
      }

      notifications.show({
        title: 'Sucesso',
        message: 'Usuário editado com sucesso',
        color: 'green',
      });

      setModalOpened(false);
      setSelectedUser(null);
      setCreateUserForm({
        email: '',
        fullName: '',
        password: '',
        status: 'pending_approval',
        roleId: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao editar usuário',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir usuário');
      }

      notifications.show({
        title: 'Sucesso',
        message: 'Usuário excluído com sucesso',
        color: 'green',
      });

      setModalOpened(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao excluir usuário',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (user: User, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setActionType(action);
    setModalType(action);
    setModalOpened(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    
    let userRoleId = '';
    if (user.roles && user.roles.length > 0) {
      const userRoleSlug = user.roles[0];
      const matchingRole = roles.find(role => role.slug === userRoleSlug);
      if (matchingRole) {
        userRoleId = matchingRole.id;
      }
    }
    
    setCreateUserForm({
      email: user.email,
      fullName: user.fullName,
      password: '',
      status: user.status,
      roleId: userRoleId
    });
    setModalType('edit');
    setModalOpened(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setModalType('delete');
    setModalOpened(true);
  };

  const openCreateModal = () => {
    setModalType('create');
    setModalOpened(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_approval: { color: 'yellow', label: 'Pendente' },
      active: { color: 'green', label: 'Ativo' },
      suspended: { color: 'red', label: 'Suspenso' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', label: status };
    return <Badge color={config.color}>{config.label}</Badge>;
  };

  const getRoleBadges = (userRoles?: string[]) => {
    if (!userRoles || userRoles.length === 0) {
      return <Badge color="gray" variant="light">Sem role</Badge>;
    }

    return (
      <Group gap="xs">
        {userRoles.map((roleSlug) => {
          const role = roles.find(r => r.slug === roleSlug);
          const roleName = role ? role.name : roleSlug;
          
          const getRoleColor = (slug: string) => {
            if (slug.includes('super-admin')) return 'red';
            if (slug.includes('admin')) return 'blue';
            if (slug.includes('manager')) return 'purple';
            if (slug.includes('analyst')) return 'green';
            return 'gray';
          };

          return (
            <Badge 
              key={roleSlug} 
              color={getRoleColor(roleSlug)} 
              variant="light"
              size="sm"
            >
              {roleName}
            </Badge>
          );
        })}
      </Group>
    );
  };

  if (authLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container size="sm" mt="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Acesso Negado" color="red">
          Você precisa estar logado para acessar esta página.
        </Alert>
      </Container>
    );
  }

  if (!hasPermission('users:read')) {
    return (
      <Container size="sm" mt="xl">
        <Alert icon={<IconInfoCircle size="1rem" />} title="Acesso Negado" color="blue">
          Você não tem permissão para visualizar usuários.
        </Alert>
      </Container>
    );
  }

  return (
    <AdminLayout>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2}>Gestão de Usuários</Title>
          {hasPermission('users:create') && (
            <Button leftSection={<IconPlus size="1rem" />} onClick={openCreateModal}>
              Criar Usuário
            </Button>
          )}
        </Group>

        <Card withBorder>
          <Group mb="md">
            <TextInput
              placeholder="Buscar por nome ou email..."
              leftSection={<IconSearch size="1rem" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Status"
              data={[
                { value: '', label: 'Todos' },
                { value: 'pending_approval', label: 'Pendente' },
                { value: 'active', label: 'Ativo' },
                { value: 'suspended', label: 'Suspenso' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || '')}
              clearable
            />
          </Group>

          {loading ? (
            <Center p="xl">
              <Loader />
            </Center>
          ) : (
            <>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Usuário</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Data de Criação</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {users.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <IconUser size="1rem" />
                          <Text fw={500}>{user.fullName}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <IconMail size="1rem" />
                          <Text>{user.email}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{getRoleBadges(user.roles)}</Table.Td>
                      <Table.Td>{getStatusBadge(user.status)}</Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <IconCalendar size="1rem" />
                          <Text>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {/* Botões para usuários pendentes */}
                          {user.status === 'pending_approval' && hasPermission('users:approve') && (
                            <>
                              <Tooltip label="Aprovar">
                                <ActionIcon
                                  color="green"
                                  variant="light"
                                  onClick={() => openActionModal(user, 'approve')}
                                >
                                  <IconCheck size="1rem" />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Rejeitar">
                                <ActionIcon
                                  color="red"
                                  variant="light"
                                  onClick={() => openActionModal(user, 'reject')}
                                >
                                  <IconX size="1rem" />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          
                          {/* Botões para todos os usuários */}
                          {hasPermission('users:update') && (
                            <Tooltip label="Editar">
                              <ActionIcon
                                color="blue"
                                variant="light"
                                onClick={() => openEditModal(user)}
                              >
                                <IconEdit size="1rem" />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          
                          {hasPermission('users:delete') && (
                            <Tooltip label="Excluir">
                              <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => openDeleteModal(user)}
                              >
                                <IconTrash size="1rem" />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {users.length === 0 && (
                <Center p="xl">
                  <Text c="dimmed">Nenhum usuário encontrado</Text>
                </Center>
              )}

              {totalPages > 1 && (
                <Group justify="center" mt="md">
                  <Pagination
                    value={page}
                    onChange={setPage}
                    total={totalPages}
                  />
                </Group>
              )}
            </>
          )}
        </Card>

        {/* Modal para Aprovar/Rejeitar */}
        <Modal
          opened={modalOpened && (modalType === 'approve' || modalType === 'reject')}
          onClose={() => {
            setModalOpened(false);
            setSelectedUser(null);
          }}
          title={`${actionType === 'approve' ? 'Aprovar' : 'Rejeitar'} Usuário`}
        >
          <Stack>
            <Text>
              Tem certeza que deseja {actionType === 'approve' ? 'aprovar' : 'rejeitar'} o usuário{' '}
              <strong>{selectedUser?.fullName}</strong>?
            </Text>
            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpened(false);
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                color={actionType === 'approve' ? 'green' : 'red'}
                loading={actionLoading}
                onClick={handleUserAction}
              >
                {actionType === 'approve' ? 'Aprovar' : 'Rejeitar'}
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Modal para Criar Usuário */}
        <Modal
          opened={modalOpened && modalType === 'create'}
          onClose={() => {
            setModalOpened(false);
            setCreateUserForm({
              email: '',
              fullName: '',
              password: '',
              status: 'pending_approval',
              roleId: ''
            });
          }}
          title="Criar Novo Usuário"
          size="md"
        >
          <Stack>
            <TextInput
              label="Nome Completo"
              placeholder="Digite o nome completo"
              value={createUserForm.fullName}
              onChange={(e) => setCreateUserForm(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
            <TextInput
              label="Email"
              placeholder="Digite o email"
              type="email"
              value={createUserForm.email}
              onChange={(e) => setCreateUserForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <PasswordInput
              label="Senha"
              placeholder="Digite a senha"
              value={createUserForm.password}
              onChange={(e) => setCreateUserForm(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            <Select
              label="Status Inicial"
              data={[
                { value: 'pending_approval', label: 'Pendente de Aprovação' },
                { value: 'active', label: 'Ativo' },
                { value: 'suspended', label: 'Suspenso' }
              ]}
              value={createUserForm.status}
              onChange={(value) => setCreateUserForm(prev => ({ ...prev, status: value || 'pending_approval' }))}
            />
            <Select
              label="Role (Opcional)"
              placeholder="Selecione um role"
              data={roles.map(role => ({ value: role.id, label: role.name }))}
              value={createUserForm.roleId}
              onChange={(value) => setCreateUserForm(prev => ({ ...prev, roleId: value || '' }))}
              clearable
            />
            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpened(false);
                  setCreateUserForm({
                    email: '',
                    fullName: '',
                    password: '',
                    status: 'pending_approval',
                    roleId: ''
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                loading={actionLoading}
                onClick={handleCreateUser}
                disabled={!createUserForm.email || !createUserForm.fullName || !createUserForm.password}
              >
                Criar Usuário
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Modal para Editar Usuário */}
        <Modal
          opened={modalOpened && modalType === 'edit'}
          onClose={() => {
            setModalOpened(false);
            setSelectedUser(null);
            setCreateUserForm({
              email: '',
              fullName: '',
              password: '',
              status: 'pending_approval',
              roleId: ''
            });
          }}
          title="Editar Usuário"
          size="md"
        >
          <Stack>
            <TextInput
              label="Email"
              placeholder="Digite o email"
              type="email"
              value={createUserForm.email}
              disabled
              description="O email não pode ser alterado"
            />
            <TextInput
              label="Nome Completo"
              placeholder="Digite o nome completo"
              value={createUserForm.fullName}
              onChange={(e) => setCreateUserForm(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
            <Select
              label="Status"
              data={[
                { value: 'pending_approval', label: 'Pendente de Aprovação' },
                { value: 'active', label: 'Ativo' },
                { value: 'suspended', label: 'Suspenso' },
              ]}
              value={createUserForm.status}
              onChange={(value) => setCreateUserForm(prev => ({ ...prev, status: value || 'pending_approval' }))}
            />
            <Select
              label="Role (Opcional)"
              placeholder="Selecione um role"
              data={roles.map(role => ({ value: role.id, label: role.name }))}
              value={createUserForm.roleId}
              onChange={(value) => setCreateUserForm(prev => ({ ...prev, roleId: value || '' }))}
            />


            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpened(false);
                  setSelectedUser(null);
                  setCreateUserForm({
                    email: '',
                    fullName: '',
                    password: '',
                    status: 'pending_approval',
                    roleId: ''
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                loading={actionLoading}
                onClick={handleEditUser}
                disabled={!createUserForm.email || !createUserForm.fullName}
              >
                Salvar Alterações
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Modal para Excluir Usuário */}
        <Modal
          opened={modalOpened && modalType === 'delete'}
          onClose={() => {
            setModalOpened(false);
            setSelectedUser(null);
          }}
          title="Excluir Usuário"
        >
          <Stack>
            <Text>
              Tem certeza que deseja excluir o usuário{' '}
              <strong>{selectedUser?.fullName}</strong>?
            </Text>
            <Text size="sm" c="dimmed">
              Esta ação não pode ser desfeita.
            </Text>
            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpened(false);
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                color="red"
                loading={actionLoading}
                onClick={handleDeleteUser}
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