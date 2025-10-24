'use client';

import { Container, Title, Text, Stack, Group, Button, Tabs, Alert, Grid, Card, Badge, Progress } from '@mantine/core';
import { IconRefresh, IconAlertCircle, IconCheck, IconX, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMultipleSync } from '@/lib/hooks/useSync';
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataTable, StatusBadge, FormattedDate } from '@/components/ui/DataTable';
import { useState } from 'react';

export default function SyncPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('status');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = {
    page: currentPage,
    limit: 10,
    search: searchTerm,
    platform: selectedPlatform || undefined,
    status: selectedStatus || undefined,
    level: selectedLevel || undefined,
  };

  const { 
    status, 
    logs, 
    stats, 
    dashboard,
    health,
    isLoading, 
    isError, 
    error 
  } = useMultipleSync(filters);

  const handleRefresh = () => {
    // Refetch será feito automaticamente pelos hooks
  };

  const handleExport = () => {
    console.log('Exportar logs de sincronização');
  };

  const handleStartSync = () => {
    console.log('Iniciar sincronização');
  };

  const handleStopSync = () => {
    console.log('Parar sincronização');
  };

  const handlePauseSync = () => {
    console.log('Pausar sincronização');
  };

  const handleResumeSync = () => {
    console.log('Retomar sincronização');
  };

  const handleForceFullSync = () => {
    console.log('Forçar sincronização completa');
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
          <p style={{ color: '#71717a' }}>Faça login para acessar a sincronização</p>
        </div>
      </div>
    );
  }

  const logColumns = [
    {
      accessor: 'platform',
      title: 'Plataforma',
      render: (row: any) => (
        <Badge color="blue" variant="light" size="sm">
          {row.platform}
        </Badge>
      ),
    },
    {
      accessor: 'level',
      title: 'Nível',
      render: (row: any) => (
        <Badge 
          color={
            row.level === 'error' ? 'red' :
            row.level === 'warning' ? 'yellow' : 'green'
          }
          variant="light"
          size="sm"
        >
          {row.level}
        </Badge>
      ),
    },
    {
      accessor: 'message',
      title: 'Mensagem',
      render: (row: any) => (
        <div>
          <Text fw={500}>{row.message}</Text>
          {row.details && (
            <Text size="sm" c="dimmed" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {JSON.stringify(row.details).substring(0, 50)}...
            </Text>
          )}
        </div>
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

  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Header */}
          <div>
            <Title order={1} mb="xs" c="dark">
              Sincronização
            </Title>
            <Text c="dimmed" size="lg">
              Status e logs de sincronização entre plataformas
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
              {error?.message || 'Ocorreu um erro ao carregar os dados de sincronização.'}
            </Alert>
          )}

          {/* Estatísticas */}
          {stats?.data && (
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Total de Syncs</Text>
                    <IconRefresh size={20} color="#9333ea" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.totalSyncs?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Syncs Bem-sucedidos</Text>
                    <IconCheck size={20} color="#22c55e" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.successfulSyncs?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Syncs Falharam</Text>
                    <IconX size={20} color="#ef4444" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.failedSyncs?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Duração Média</Text>
                    <IconRefresh size={20} color="#f59e0b" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {Math.round((stats.data?.averageDuration || 0) / 1000)}s
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          )}

          {/* Status de Sincronização */}
          {status?.data && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">Status das Plataformas</Title>
              <Stack gap="md">
                {status.data?.map((platform: any) => (
                  <div key={platform.id}>
                    <Group justify="space-between" mb="xs">
                      <Group gap="sm">
                        <Text fw={500}>{platform.platform}</Text>
                        <StatusBadge 
                          status={platform.status} 
                        />
                      </Group>
                      <Text size="sm" c="dimmed">
                        {platform.progress}% concluído
                      </Text>
                    </Group>
                    <Progress 
                      value={platform.progress} 
                      color={
                        platform.status === 'completed' ? 'green' :
                        platform.status === 'failed' ? 'red' :
                        platform.status === 'running' ? 'blue' : 'gray'
                      }
                      size="sm"
                      mb="xs"
                    />
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        {platform.processedItems} de {platform.totalItems} itens
                      </Text>
                      <Text size="sm" c="dimmed">
                        {platform.duration ? `${Math.round(platform.duration / 1000)}s` : 'Em andamento...'}
                      </Text>
                    </Group>
                  </div>
                ))}
              </Stack>
            </Card>
          )}

          {/* Controles de Sincronização */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Controles de Sincronização</Title>
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

            <Group gap="sm" wrap="wrap">
              <Button
                variant="filled"
                color="green"
                leftSection={<IconPlayerPlay size={16} />}
                onClick={handleStartSync}
                loading={isLoading}
              >
                Iniciar Sync
              </Button>
              <Button
                variant="outline"
                color="red"
                leftSection={<IconX size={16} />}
                onClick={handleStopSync}
                loading={isLoading}
              >
                Parar Sync
              </Button>
              <Button
                variant="outline"
                color="yellow"
                leftSection={<IconPlayerPause size={16} />}
                onClick={handlePauseSync}
                loading={isLoading}
              >
                Pausar
              </Button>
              <Button
                variant="outline"
                color="blue"
                leftSection={<IconPlayerPlay size={16} />}
                onClick={handleResumeSync}
                loading={isLoading}
              >
                Retomar
              </Button>
              <Button
                variant="outline"
                color="orange"
                leftSection={<IconRefresh size={16} />}
                onClick={handleForceFullSync}
                loading={isLoading}
              >
                Forçar Sync Completo
              </Button>
            </Group>
          </Card>

          {/* Filtros */}
          <FilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por plataforma ou mensagem..."
            filters={[
              {
                key: 'platform',
                label: 'Plataforma',
                type: 'select',
                options: [
                  { value: '', label: 'Todas as plataformas' },
                  { value: 'stripe', label: 'Stripe' },
                  { value: 'hotmart', label: 'Hotmart' },
                  { value: 'cartpanda', label: 'Cartpanda' },
                ],
                value: selectedPlatform,
                onChange: setSelectedPlatform,
              },
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: '', label: 'Todos os status' },
                  { value: 'running', label: 'Executando' },
                  { value: 'completed', label: 'Concluído' },
                  { value: 'failed', label: 'Falhou' },
                  { value: 'paused', label: 'Pausado' },
                ],
                value: selectedStatus,
                onChange: setSelectedStatus,
              },
              {
                key: 'level',
                label: 'Nível',
                type: 'select',
                options: [
                  { value: '', label: 'Todos os níveis' },
                  { value: 'info', label: 'Info' },
                  { value: 'warning', label: 'Aviso' },
                  { value: 'error', label: 'Erro' },
                ],
                value: selectedLevel,
                onChange: setSelectedLevel,
              },
            ]}
            onClearFilters={() => {
              setSearchTerm('');
              setSelectedPlatform('');
              setSelectedStatus('');
              setSelectedLevel('');
              setCurrentPage(1);
            }}
            onApplyFilters={handleRefresh}
            loading={isLoading}
          />

          {/* Tabs de Sincronização */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'status')}>
            <Tabs.List>
              <Tabs.Tab value="status" leftSection={<IconRefresh size={16} />}>
                Status
              </Tabs.Tab>
              <Tabs.Tab value="logs" leftSection={<IconRefresh size={16} />}>
                Logs
              </Tabs.Tab>
            </Tabs.List>

            {/* Tab Status */}
            <Tabs.Panel value="status" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Status de Sincronização</Title>
                
                {status?.data && status.data.length > 0 ? (
                  <Stack gap="md">
                    {status.data?.map((platform: any) => (
                      <Card key={platform.id} shadow="sm" padding="md" radius="md" withBorder>
                        <Group justify="space-between" mb="md">
                          <Group gap="sm">
                            <Text fw={500} size="lg">{platform.platform}</Text>
                            <StatusBadge status={platform.status} />
                          </Group>
                          <Text size="sm" c="dimmed">
                            {platform.startTime ? new Date(platform.startTime).toLocaleString('pt-BR') : 'Não iniciado'}
                          </Text>
                        </Group>
                        
                        <Progress 
                          value={platform.progress} 
                          color={
                            platform.status === 'completed' ? 'green' :
                            platform.status === 'failed' ? 'red' :
                            platform.status === 'running' ? 'blue' : 'gray'
                          }
                          size="lg"
                          mb="md"
                        />
                        
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">
                            {platform.processedItems} de {platform.totalItems} itens processados
                          </Text>
                          <Text size="sm" c="dimmed">
                            {platform.duration ? `Duração: ${Math.round(platform.duration / 1000)}s` : 'Em andamento...'}
                          </Text>
                        </Group>
                        
                        {platform.error && (
                          <Alert color="red" variant="light" mt="md">
                            <Text size="sm">{platform.error}</Text>
                          </Alert>
                        )}
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text c="dimmed" ta="center" py="xl">
                    Nenhum status de sincronização disponível
                  </Text>
                )}
              </Card>
            </Tabs.Panel>

            {/* Tab Logs */}
            <Tabs.Panel value="logs" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Logs de Sincronização</Title>
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
          </Tabs>
        </Stack>
      </Container>
    </AppLayout>
  );
}
