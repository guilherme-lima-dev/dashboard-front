'use client';

import { Container, Title, Text, Stack, Group, Button, Tabs, Alert, Grid, Card, Badge } from '@mantine/core';
import { IconRefresh, IconAlertCircle, IconUsers, IconTrendingUp, IconCurrencyDollar, IconTarget } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAffiliates } from '@/lib/hooks/useAffiliates';
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataTable, StatusBadge, CurrencyValue } from '@/components/ui/DataTable';
import { useState } from 'react';

export default function AffiliatesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filters = {
    page: currentPage,
    limit: 10,
    search: searchTerm,
    tier: selectedTier || undefined,
    status: selectedStatus || undefined,
    sortBy,
    sortOrder,
  };

  const { 
    affiliates, 
    stats, 
    dashboard,
    isLoading, 
    isError, 
    error 
  } = useAffiliates(filters);

  const handleRefresh = () => {
    // Refetch será feito automaticamente pelos hooks
  };

  const handleExport = () => {
    console.log('Exportar dados de afiliados');
  };

  const handleViewAffiliate = (affiliate: any) => {
    console.log('Ver afiliado:', affiliate);
  };

  const handleEditAffiliate = (affiliate: any) => {
    console.log('Editar afiliado:', affiliate);
  };

  const handleDeleteAffiliate = (affiliate: any) => {
    console.log('Deletar afiliado:', affiliate);
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
          <p style={{ color: '#71717a' }}>Faça login para acessar os afiliados</p>
        </div>
      </div>
    );
  }

  const affiliateColumns = [
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
      accessor: 'tier',
      title: 'Tier',
      render: (row: any) => (
        <Badge 
          color={
            row.tier === 'diamond' ? 'blue' :
            row.tier === 'gold' ? 'yellow' :
            row.tier === 'silver' ? 'gray' : 'orange'
          }
          variant="light"
          size="sm"
        >
          {row.tier}
        </Badge>
      ),
    },
    {
      accessor: 'totalSalesCount',
      title: 'Vendas',
      render: (row: any) => (
        <Text fw={500}>{row.totalSalesCount?.toLocaleString() || '0'}</Text>
      ),
    },
    {
      accessor: 'totalRevenueBrl',
      title: 'Receita (BRL)',
      render: (row: any) => (
        <CurrencyValue value={row.totalRevenueBrl} currency="BRL" />
      ),
    },
    {
      accessor: 'totalRevenueUsd',
      title: 'Receita (USD)',
      render: (row: any) => (
        <CurrencyValue value={row.totalRevenueUsd} currency="USD" />
      ),
    },
    {
      accessor: 'isActive',
      title: 'Status',
      render: (row: any) => (
        <StatusBadge 
          status={row.isActive ? 'active' : 'inactive'} 
        />
      ),
    },
    {
      accessor: 'lastSaleAt',
      title: 'Última Venda',
      render: (row: any) => (
        <Text size="sm">
          {row.lastSaleAt ? new Date(row.lastSaleAt).toLocaleDateString('pt-BR') : 'Nunca'}
        </Text>
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
              Afiliados
            </Title>
            <Text c="dimmed" size="lg">
              Gestão e análise de performance dos afiliados
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
              {error?.message || 'Ocorreu um erro ao carregar os dados dos afiliados.'}
            </Alert>
          )}

          {/* Estatísticas */}
          {stats?.data && (
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Total de Afiliados</Text>
                    <IconUsers size={20} color="#9333ea" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.totalAffiliates?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Afiliados Ativos</Text>
                    <IconTrendingUp size={20} color="#22c55e" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.activeAffiliates?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Total de Vendas</Text>
                    <IconTarget size={20} color="#f59e0b" />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stats.data?.totalSales?.toLocaleString() || '0'}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Receita Total</Text>
                    <IconCurrencyDollar size={20} color="#ef4444" />
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
            searchPlaceholder="Buscar por nome ou email..."
            filters={[
              {
                key: 'tier',
                label: 'Tier',
                type: 'select',
                options: [
                  { value: '', label: 'Todos os tiers' },
                  { value: 'bronze', label: 'Bronze' },
                  { value: 'silver', label: 'Silver' },
                  { value: 'gold', label: 'Gold' },
                  { value: 'diamond', label: 'Diamond' },
                ],
                value: selectedTier,
                onChange: setSelectedTier,
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
              setSelectedTier('');
              setSelectedStatus('');
              setCurrentPage(1);
            }}
            onApplyFilters={handleRefresh}
            loading={isLoading}
          />

          {/* Tabela de Afiliados */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Lista de Afiliados</Title>
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
              data={affiliates.data?.data || []}
              columns={affiliateColumns}
              onView={handleViewAffiliate}
              onEdit={handleEditAffiliate}
              onDelete={handleDeleteAffiliate}
              loading={isLoading}
              emptyMessage="Nenhum afiliado encontrado"
            />

            {/* Paginação */}
            {affiliates.data?.pagination && (
              <Group justify="space-between" mt="md">
                <Text size="sm" c="dimmed">
                  Mostrando {((affiliates.data?.pagination?.page || 1) - 1) * (affiliates.data?.pagination?.limit || 10) + 1} a{' '}
                  {Math.min((affiliates.data?.pagination?.page || 1) * (affiliates.data?.pagination?.limit || 10), affiliates.data?.pagination?.total || 0)} de{' '}
                  {affiliates.data?.pagination?.total || 0} afiliados
                </Text>
                <Group gap="sm">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={affiliates.data?.pagination?.page === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={affiliates.data?.pagination?.page === affiliates.data?.pagination?.totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Próximo
                  </Button>
                </Group>
              </Group>
            )}
          </Card>
        </Stack>
      </Container>
    </AppLayout>
  );
}
