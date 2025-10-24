'use client';

import { Container, Title, Text, Stack, Group, Button, Tabs, Alert, Grid, Card, Badge } from '@mantine/core';
import { IconRefresh, IconAlertCircle, IconUsers, IconCreditCard, IconShoppingCart, IconPackage } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDataStats } from '@/lib/hooks/useData';
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataTable, StatusBadge, CurrencyValue, FormattedDate } from '@/components/ui/DataTable';
import { useState } from 'react';

export default function DataPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = {
    page: currentPage,
    limit: 10,
    search: searchTerm,
    platform: selectedPlatform || undefined,
    status: selectedStatus || undefined,
  };

  const { 
    customers, 
    subscriptions, 
    transactions, 
    products, 
    platforms,
    stats,
    isLoading, 
    isError, 
    error 
  } = useDataStats();

  const handleRefresh = () => {
    // Refetch será feito automaticamente pelos hooks
  };

  const handleExport = () => {
    console.log('Exportar dados');
  };

  const handleView = (item: any) => {
    console.log('Ver item:', item);
  };

  const handleEdit = (item: any) => {
    console.log('Editar item:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Deletar item:', item);
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
          <p style={{ color: '#71717a' }}>Faça login para acessar os dados</p>
        </div>
      </div>
    );
  }

  const customerColumns = [
    {
      accessor: 'name',
      title: 'Nome',
      render: (row: any) => (
        <div>
          <Text fw={500}>{row.name}</Text>
          <Text size="sm" c="dimmed">{row.email}</Text>
        </div>
      ),
    },
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
      accessor: 'totalSpent',
      title: 'Total Gasto',
      render: (row: any) => (
        <CurrencyValue value={row.totalSpent} currency="BRL" />
      ),
    },
    {
      accessor: 'subscriptionCount',
      title: 'Assinaturas',
      render: (row: any) => (
        <Text fw={500}>{row.subscriptionCount}</Text>
      ),
    },
    {
      accessor: 'isActive',
      title: 'Status',
      render: (row: any) => (
        <StatusBadge status={row.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      accessor: 'lastPurchaseAt',
      title: 'Última Compra',
      render: (row: any) => (
        <FormattedDate date={row.lastPurchaseAt} />
      ),
    },
  ];

  const subscriptionColumns = [
    {
      accessor: 'customerName',
      title: 'Cliente',
      render: (row: any) => (
        <Text fw={500}>{row.customerName}</Text>
      ),
    },
    {
      accessor: 'productName',
      title: 'Produto',
      render: (row: any) => (
        <Text>{row.productName}</Text>
      ),
    },
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
      accessor: 'status',
      title: 'Status',
      render: (row: any) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      accessor: 'recurringAmount',
      title: 'Valor',
      render: (row: any) => (
        <CurrencyValue value={row.recurringAmount} currency={row.currency} />
      ),
    },
    {
      accessor: 'startDate',
      title: 'Data Início',
      render: (row: any) => (
        <FormattedDate date={row.startDate} />
      ),
    },
  ];

  const transactionColumns = [
    {
      accessor: 'customerName',
      title: 'Cliente',
      render: (row: any) => (
        <Text fw={500}>{row.customerName}</Text>
      ),
    },
    {
      accessor: 'productName',
      title: 'Produto',
      render: (row: any) => (
        <Text>{row.productName}</Text>
      ),
    },
    {
      accessor: 'type',
      title: 'Tipo',
      render: (row: any) => (
        <Badge 
          color={
            row.type === 'subscription' ? 'green' :
            row.type === 'one_time' ? 'blue' :
            row.type === 'refund' ? 'red' : 'orange'
          }
          variant="light"
          size="sm"
        >
          {row.type}
        </Badge>
      ),
    },
    {
      accessor: 'amount',
      title: 'Valor',
      render: (row: any) => (
        <CurrencyValue value={row.amount} currency={row.currency} />
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      render: (row: any) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      accessor: 'transactionDate',
      title: 'Data',
      render: (row: any) => (
        <FormattedDate date={row.transactionDate} />
      ),
    },
  ];

  const productColumns = [
    {
      accessor: 'name',
      title: 'Nome',
      render: (row: any) => (
        <div>
          <Text fw={500}>{row.name}</Text>
          {row.description && (
            <Text size="sm" c="dimmed">{row.description}</Text>
          )}
        </div>
      ),
    },
    {
      accessor: 'type',
      title: 'Tipo',
      render: (row: any) => (
        <Badge 
          color={row.type === 'subscription' ? 'green' : 'blue'}
          variant="light"
          size="sm"
        >
          {row.type}
        </Badge>
      ),
    },
    {
      accessor: 'platforms',
      title: 'Plataformas',
      render: (row: any) => (
        <Group gap="xs">
          {row.platforms?.map((platform: any, index: number) => (
            <Badge key={index} color="blue" variant="light" size="xs">
              {platform.platformName}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessor: 'isActive',
      title: 'Status',
      render: (row: any) => (
        <StatusBadge status={row.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      accessor: 'createdAt',
      title: 'Criado em',
      render: (row: any) => (
        <FormattedDate date={row.createdAt} />
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
              Gestão de Dados
            </Title>
            <Text c="dimmed" size="lg">
              Visualize e gerencie clientes, assinaturas, transações e produtos
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
              {error?.message || 'Ocorreu um erro ao carregar os dados.'}
            </Alert>
          )}

          {/* Estatísticas */}
          {stats?.data && (
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Total de Clientes</Text>
                    <IconUsers size={20} color="#9333ea" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.totalCustomers?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Assinaturas Ativas</Text>
                    <IconCreditCard size={20} color="#22c55e" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.activeSubscriptions?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Total de Transações</Text>
                    <IconShoppingCart size={20} color="#f59e0b" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.totalTransactions?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Receita Total</Text>
                    <IconPackage size={20} color="#ef4444" />
                  </Group>
                  <Text size="xl" fw={700}>
                    <CurrencyValue value={stats.data?.totalRevenue || 0} currency="BRL" />
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          )}

          {/* Filtros */}
          <FilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por nome, email ou ID..."
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
                  { value: 'active', label: 'Ativo' },
                  { value: 'inactive', label: 'Inativo' },
                ],
                value: selectedStatus,
                onChange: setSelectedStatus,
              },
            ]}
            onClearFilters={() => {
              setSearchTerm('');
              setSelectedPlatform('');
              setSelectedStatus('');
              setCurrentPage(1);
            }}
            onApplyFilters={handleRefresh}
            loading={isLoading}
          />

          {/* Tabs de Dados */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'customers')}>
            <Tabs.List>
              <Tabs.Tab value="customers" leftSection={<IconUsers size={16} />}>
                Clientes
              </Tabs.Tab>
              <Tabs.Tab value="subscriptions" leftSection={<IconCreditCard size={16} />}>
                Assinaturas
              </Tabs.Tab>
              <Tabs.Tab value="transactions" leftSection={<IconShoppingCart size={16} />}>
                Transações
              </Tabs.Tab>
              <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
                Produtos
              </Tabs.Tab>
            </Tabs.List>

            {/* Tab Clientes */}
            <Tabs.Panel value="customers" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Clientes</Title>
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
                  data={customers.data?.data || []}
                  columns={customerColumns}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={isLoading}
                  emptyMessage="Nenhum cliente encontrado"
                />
              </Card>
            </Tabs.Panel>

            {/* Tab Assinaturas */}
            <Tabs.Panel value="subscriptions" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Assinaturas</Title>
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
                  data={subscriptions.data?.data || []}
                  columns={subscriptionColumns}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={isLoading}
                  emptyMessage="Nenhuma assinatura encontrada"
                />
              </Card>
            </Tabs.Panel>

            {/* Tab Transações */}
            <Tabs.Panel value="transactions" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Transações</Title>
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
                  data={transactions.data?.data || []}
                  columns={transactionColumns}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={isLoading}
                  emptyMessage="Nenhuma transação encontrada"
                />
              </Card>
            </Tabs.Panel>

            {/* Tab Produtos */}
            <Tabs.Panel value="products" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Produtos</Title>
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
                  data={products.data?.data || []}
                  columns={productColumns}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={isLoading}
                  emptyMessage="Nenhum produto encontrado"
                />
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </AppLayout>
  );
}
