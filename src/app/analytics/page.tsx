'use client';

import { Container, Title, Text, Stack, Group, Button, Tabs, Alert } from '@mantine/core';
import { IconRefresh, IconAlertCircle, IconChartLine, IconTrendingUp, IconUsers, IconTarget } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMultipleAnalytics } from '@/lib/hooks/useAnalytics';
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterBar, PeriodFilter, PlatformFilter } from '@/components/ui/FilterBar';
import { Chart } from '@/components/ui/Chart';
import { useState } from 'react';

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('revenue');

  const filters = {
    period: selectedPeriod,
    platformId: selectedPlatform || undefined,
  };

  const { 
    dashboard, 
    revenue, 
    subscriptions, 
    churn, 
    trials,
    isLoading, 
    isError, 
    error 
  } = useMultipleAnalytics(filters);

  const handleRefresh = () => {
    // Refetch será feito automaticamente pelos hooks
  };

  const handleExport = () => {
    console.log('Exportar dados de analytics');
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
          <p style={{ color: '#71717a' }}>Faça login para acessar os analytics</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Header */}
            <div>
            <Title order={1} mb="xs" c="dark">
              Analytics
              </Title>
            <Text c="dimmed" size="lg">
              Análise detalhada de receita, assinaturas e métricas
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
              {error?.message || 'Ocorreu um erro ao carregar os dados de analytics.'}
            </Alert>
          )}

          {/* Filtros */}
          <FilterBar
            searchValue=""
            onSearchChange={() => {}}
            searchPlaceholder="Buscar por produto ou cliente..."
            filters={[
              {
                key: 'period',
                label: 'Período',
                type: 'select',
                options: [
                  { value: '7d', label: 'Últimos 7 dias' },
                  { value: '30d', label: 'Últimos 30 dias' },
                  { value: '90d', label: 'Últimos 90 dias' },
                  { value: '1y', label: 'Último ano' },
                ],
                value: selectedPeriod,
                onChange: setSelectedPeriod,
              },
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
                key: 'currency',
                label: 'Moeda',
                type: 'select',
                options: [
                  { value: 'BRL', label: 'Real (BRL)' },
                  { value: 'USD', label: 'Dólar (USD)' },
                ],
                value: 'BRL',
                onChange: () => {},
              },
            ]}
            onClearFilters={() => {
              setSelectedPeriod('monthly');
              setSelectedPlatform('');
            }}
            onApplyFilters={handleRefresh}
            loading={isLoading}
          />

          {/* Tabs de Analytics */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'revenue')}>
            <Tabs.List>
              <Tabs.Tab value="revenue" leftSection={<IconChartLine size={16} />}>
                Receita
              </Tabs.Tab>
              <Tabs.Tab value="subscriptions" leftSection={<IconTrendingUp size={16} />}>
                Assinaturas
              </Tabs.Tab>
              <Tabs.Tab value="churn" leftSection={<IconUsers size={16} />}>
                Churn
              </Tabs.Tab>
              <Tabs.Tab value="trials" leftSection={<IconTarget size={16} />}>
                Trials
              </Tabs.Tab>
            </Tabs.List>

            {/* Tab Receita */}
            <Tabs.Panel value="revenue" pt="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={2}>Análise de Receita</Title>
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

                {revenue?.data && (
                  <Stack gap="md">
                    {/* Métricas de Receita */}
                    <Group>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Receita Total</Text>
                        <Text size="xl" fw={700}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(revenue.data?.totalRevenue || 0)}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Receita Recorrente</Text>
                        <Text size="xl" fw={700}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(revenue.data?.recurringRevenue || 0)}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Receita Não Recorrente</Text>
                        <Text size="xl" fw={700}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(revenue.data?.nonRecurringRevenue || 0)}
                        </Text>
                      </div>
                    </Group>

                    {/* Gráficos */}
                    <Group>
                      <div style={{ flex: 2 }}>
                        <Chart
                          title="Evolução da Receita"
                          description="Receita ao longo do tempo"
                          data={revenue.data?.monthlyTrend?.map(item => ({
                            name: item.month,
                            value: item.revenue
                          })) || []}
                          type="line"
                          loading={isLoading}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Chart
                          title="Receita por Produto"
                          description="Distribuição por produto"
                          data={revenue.data?.revenueByProduct?.map(item => ({
                            name: item.productName,
                            value: item.revenue
                          })) || []}
                          type="pie"
                          loading={isLoading}
                        />
                      </div>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Tabs.Panel>

            {/* Tab Assinaturas */}
            <Tabs.Panel value="subscriptions" pt="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={2}>Análise de Assinaturas</Title>
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

                {subscriptions?.data && (
                  <Stack gap="md">
                    {/* Métricas de Assinaturas */}
                    <Group>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Total de Assinaturas</Text>
                        <Text size="xl" fw={700}>
                          {subscriptions.data?.totalSubscriptions?.toLocaleString() || '0'}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Assinaturas Ativas</Text>
                        <Text size="xl" fw={700}>
                          {subscriptions.data?.activeSubscriptions?.toLocaleString() || '0'}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Assinaturas Canceladas</Text>
                        <Text size="xl" fw={700}>
                          {subscriptions.data?.cancelledSubscriptions?.toLocaleString() || '0'}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Trials</Text>
                        <Text size="xl" fw={700}>
                          {subscriptions.data?.trialSubscriptions?.toLocaleString() || '0'}
                        </Text>
                      </div>
                    </Group>

                    {/* Gráficos */}
                    <Group>
                      <div style={{ flex: 2 }}>
                        <Chart
                          title="Evolução das Assinaturas"
                          description="Assinaturas ao longo do tempo"
                          data={subscriptions.data?.monthlyTrend?.map(item => ({
                            name: item.month,
                            value: item.subscriptions
                          })) || []}
                          type="bar"
                          loading={isLoading}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Chart
                          title="Assinaturas por Produto"
                          description="Distribuição por produto"
                          data={subscriptions.data?.subscriptionsByProduct?.map(item => ({
                            name: item.productName,
                            value: item.count
                          })) || []}
                          type="pie"
                          loading={isLoading}
                        />
                      </div>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Tabs.Panel>

            {/* Tab Churn */}
            <Tabs.Panel value="churn" pt="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={2}>Análise de Churn</Title>
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

                {churn?.data && (
                  <Stack gap="md">
                    {/* Métricas de Churn */}
                    <Group>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Taxa de Churn</Text>
                        <Text size="xl" fw={700} c="red">
                          {churn.data?.churnRate?.toFixed(2) || '0.00'}%
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Churn Count</Text>
                        <Text size="xl" fw={700}>
                          {churn.data?.churnCount?.toLocaleString() || '0'}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Taxa de Retenção</Text>
                        <Text size="xl" fw={700} c="green">
                          {churn.data?.retentionRate?.toFixed(2) || '0.00'}%
                        </Text>
                      </div>
                    </Group>

                    {/* Gráficos */}
                    <Group>
                      <div style={{ flex: 2 }}>
                        <Chart
                          title="Evolução do Churn"
                          description="Taxa de churn ao longo do tempo"
                          data={churn.data?.monthlyTrend?.map(item => ({
                            name: item.month,
                            value: item.churnRate
                          })) || []}
                          type="line"
                          loading={isLoading}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Chart
                          title="Churn por Produto"
                          description="Distribuição por produto"
                          data={churn.data?.churnByProduct?.map(item => ({
                            name: item.productName,
                            value: item.churnRate
                          })) || []}
                          type="bar"
                          loading={isLoading}
                        />
                      </div>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Tabs.Panel>

            {/* Tab Trials */}
            <Tabs.Panel value="trials" pt="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={2}>Análise de Trials</Title>
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

                {trials?.data && (
                  <Stack gap="md">
                    {/* Métricas de Trials */}
                    <Group>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Taxa de Trial</Text>
                        <Text size="xl" fw={700}>
                          {trials.data?.trialRate?.toFixed(2) || '0.00'}%
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Total de Trials</Text>
                        <Text size="xl" fw={700}>
                          {trials.data?.trialCount?.toLocaleString() || '0'}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">Taxa de Conversão</Text>
                        <Text size="xl" fw={700} c="green">
                          {trials.data?.conversionRate?.toFixed(2) || '0.00'}%
                        </Text>
                      </div>
                    </Group>

                    {/* Gráficos */}
                    <Group>
                      <div style={{ flex: 2 }}>
                        <Chart
                          title="Evolução dos Trials"
                          description="Trials ao longo do tempo"
                          data={trials.data?.monthlyTrend?.map(item => ({
                            name: item.month,
                            value: item.trialCount
                          })) || []}
                          type="bar"
                          loading={isLoading}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Chart
                          title="Conversão por Produto"
                          description="Taxa de conversão por produto"
                          data={trials.data?.trialsByProduct?.map(item => ({
                            name: item.productName,
                            value: item.conversionRate
                          })) || []}
                          type="pie"
                          loading={isLoading}
                        />
                      </div>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </AppLayout>
  );
}