'use client';

import { Container, Title, Text, Stack, Group, Button, Tabs, Alert, Grid, Card, Badge } from '@mantine/core';
import { IconRefresh, IconAlertCircle, IconShield, IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMultipleAudit } from '@/lib/hooks/useAudit';
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataTable, StatusBadge, FormattedDate } from '@/components/ui/DataTable';
import { useState } from 'react';

export default function AuditPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = {
    page: currentPage,
    limit: 10,
    search: searchTerm,
    userId: selectedUser || undefined,
    action: selectedAction || undefined,
    severity: selectedSeverity || undefined,
  };

  const { 
    logs, 
    alerts, 
    stats, 
    dashboard,
    isLoading, 
    isError, 
    error 
  } = useMultipleAudit(filters);

  const handleRefresh = () => {
    // Refetch será feito automaticamente pelos hooks
  };

  const handleExport = () => {
    console.log('Exportar logs de auditoria');
  };

  const handleResolveAlert = (alert: any) => {
    console.log('Resolver alerta:', alert);
  };

  const handleViewLog = (log: any) => {
    console.log('Ver log:', log);
  };

  // Renderizar loading durante SSR para evitar hydration mismatch
  if (authLoading) {
    return (
      <div style={{
        background: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'pulse 2s infinite'
            }}
          >
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>AP</span>
          </div>
          <h2 style={{ color: '#a855f7', marginBottom: '8px' }}>Analytics Platform</h2>
          <p style={{ color: '#71717a' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        background: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#a855f7', marginBottom: '8px' }}>Acesso Negado</h2>
          <p style={{ color: '#71717a' }}>Faça login para acessar a auditoria</p>
        </div>
      </div>
    );
  }

  const logColumns = [
    {
      accessor: 'userName',
      title: 'Usuário',
      render: (row: any) => (
        <div>
          <Text fw={500}>{row.userName}</Text>
          <Text size="sm" c="dimmed">{row.userId}</Text>
        </div>
      ),
    },
    {
      accessor: 'action',
      title: 'Ação',
      render: (row: any) => (
        <Badge 
          color={
            row.action.includes('create') ? 'green' :
            row.action.includes('update') ? 'blue' :
            row.action.includes('delete') ? 'red' : 'gray'
          }
          variant="light"
          size="sm"
        >
          {row.action}
        </Badge>
      ),
    },
    {
      accessor: 'resource',
      title: 'Recurso',
      render: (row: any) => (
        <Text fw={500}>{row.resource}</Text>
      ),
    },
    {
      accessor: 'details',
      title: 'Detalhes',
      render: (row: any) => (
        <Text size="sm" c="dimmed" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {JSON.stringify(row.details).substring(0, 50)}...
        </Text>
      ),
    },
    {
      accessor: 'ipAddress',
      title: 'IP',
      render: (row: any) => (
        <Text size="sm" c="dimmed">{row.ipAddress}</Text>
      ),
    },
    {
      accessor: 'timestamp',
      title: 'Data/Hora',
      render: (row: any) => (
        <FormattedDate date={row.timestamp} format="time" />
      ),
    },
  ];

  const alertColumns = [
    {
      accessor: 'type',
      title: 'Tipo',
      render: (row: any) => (
        <Badge 
          color={
            row.type === 'security' ? 'red' :
            row.type === 'performance' ? 'yellow' :
            row.type === 'error' ? 'red' : 'orange'
          }
          variant="light"
          size="sm"
        >
          {row.type}
        </Badge>
      ),
    },
    {
      accessor: 'severity',
      title: 'Severidade',
      render: (row: any) => (
        <Badge 
          color={
            row.severity === 'critical' ? 'red' :
            row.severity === 'high' ? 'orange' :
            row.severity === 'medium' ? 'yellow' : 'green'
          }
          variant="light"
          size="sm"
        >
          {row.severity}
        </Badge>
      ),
    },
    {
      accessor: 'title',
      title: 'Título',
      render: (row: any) => (
        <div>
          <Text fw={500}>{row.title}</Text>
          <Text size="sm" c="dimmed">{row.description}</Text>
        </div>
      ),
    },
    {
      accessor: 'isResolved',
      title: 'Status',
      render: (row: any) => (
        <StatusBadge 
          status={row.isResolved ? 'resolved' : 'active'} 
        />
      ),
    },
    {
      accessor: 'createdAt',
      title: 'Criado em',
      render: (row: any) => (
        <FormattedDate date={row.createdAt} />
      ),
    },
    {
      accessor: 'resolvedAt',
      title: 'Resolvido em',
      render: (row: any) => (
        row.resolvedAt ? <FormattedDate date={row.resolvedAt} /> : <Text size="sm" c="dimmed">-</Text>
      ),
    },
  ];

  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Header */}
          <div>
            <Title order={1} mb="xs" c="dark">
              Auditoria
            </Title>
            <Text c="dimmed" size="lg">
              Logs de atividades, alertas e monitoramento do sistema
            </Text>
          </div>

          {/* Error State */}
          {isError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Erro ao carregar dados"
              color="red"
              variant="light"
            >
              {error?.message || 'Ocorreu um erro ao carregar os dados de auditoria.'}
            </Alert>
          )}

          {/* Estatísticas */}
          {stats?.data && (
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Total de Logs</Text>
                    <IconShield size={20} color="#9333ea" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.totalLogs?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Logs Hoje</Text>
                    <IconCheck size={20} color="#22c55e" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.logsToday?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Eventos de Segurança</Text>
                    <IconAlertTriangle size={20} color="#f59e0b" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.securityEvents?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Eventos de Erro</Text>
                    <IconX size={20} color="#ef4444" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.errorEvents?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          )}

          {/* Filtros */}
          <FilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por usuário, ação ou recurso..."
            filters={[
              {
                key: 'user',
                label: 'Usuário',
                type: 'select',
                options: [
                  { value: '', label: 'Todos os usuários' },
                  // Adicionar opções dinâmicas baseadas nos dados
                ],
                value: selectedUser,
                onChange: setSelectedUser,
              },
              {
                key: 'action',
                label: 'Ação',
                type: 'select',
                options: [
                  { value: '', label: 'Todas as ações' },
                  { value: 'create', label: 'Criar' },
                  { value: 'update', label: 'Atualizar' },
                  { value: 'delete', label: 'Deletar' },
                  { value: 'login', label: 'Login' },
                  { value: 'logout', label: 'Logout' },
                ],
                value: selectedAction,
                onChange: setSelectedAction,
              },
              {
                key: 'severity',
                label: 'Severidade',
                type: 'select',
                options: [
                  { value: '', label: 'Todas as severidades' },
                  { value: 'low', label: 'Baixa' },
                  { value: 'medium', label: 'Média' },
                  { value: 'high', label: 'Alta' },
                  { value: 'critical', label: 'Crítica' },
                ],
                value: selectedSeverity,
                onChange: setSelectedSeverity,
              },
            ]}
            onClearFilters={() => {
              setSearchTerm('');
              setSelectedUser('');
              setSelectedAction('');
              setSelectedSeverity('');
              setCurrentPage(1);
            }}
            onApplyFilters={handleRefresh}
            loading={isLoading}
          />

          {/* Tabs de Auditoria */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'logs')}>
            <Tabs.List>
              <Tabs.Tab value="logs" leftSection={<IconShield size={16} />}>
                Logs
              </Tabs.Tab>
              <Tabs.Tab value="alerts" leftSection={<IconAlertTriangle size={16} />}>
                Alertas
              </Tabs.Tab>
            </Tabs.List>

            {/* Tab Logs */}
            <Tabs.Panel value="logs" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Logs de Auditoria</Title>
                  <Group gap="sm">
                    <Button
                      variant="outline"
                      color="lilac"
                      leftSection={<IconRefresh size={16} />}
                      onClick={handleRefresh}
                      loading={isLoading}
                    >
                      Atualizar
                    </Button>
                    <Button
                      variant="filled"
                      color="lilac"
                      onClick={handleExport}
                    >
                      Exportar
                    </Button>
                  </Group>
                </Group>

                <DataTable
                  data={logs.data?.data || []}
                  columns={logColumns}
                  onView={handleViewLog}
                  loading={isLoading}
                  emptyMessage="Nenhum log encontrado"
                  showActions={false}
                />
              </Card>
            </Tabs.Panel>

            {/* Tab Alertas */}
            <Tabs.Panel value="alerts" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Alertas do Sistema</Title>
                  <Group gap="sm">
                    <Button
                      variant="outline"
                      color="lilac"
                      leftSection={<IconRefresh size={16} />}
                      onClick={handleRefresh}
                      loading={isLoading}
                    >
                      Atualizar
                    </Button>
                    <Button
                      variant="filled"
                      color="lilac"
                      onClick={handleExport}
                    >
                      Exportar
                    </Button>
                  </Group>
                </Group>

                <DataTable
                  data={alerts.data?.data || []}
                  columns={alertColumns}
                  onView={handleViewLog}
                  onEdit={handleResolveAlert}
                  loading={isLoading}
                  emptyMessage="Nenhum alerta encontrado"
                />
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </AppLayout>
  );
}
