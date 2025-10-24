'use client';

import { Container, Title, Text, Stack, Group, Button, Alert } from '@mantine/core';
import { IconRefresh, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMultipleAnalytics } from '@/lib/hooks/useAnalytics';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const filters = {
    period: selectedPeriod,
  };

  const { 
    dashboard, 
    revenue, 
    subscriptions, 
    isLoading, 
    isError, 
    error 
  } = useMultipleAnalytics(filters);

  const handleRefresh = () => {
    // Refetch será feito automaticamente pelos hooks
  };

  const handleExport = () => {
    // Implementar exportação
    console.log('Exportar dados');
  };

  const handleMetricClick = (metric: string) => {
    console.log('Clicou na métrica:', metric);
    // Implementar navegação para detalhes da métrica
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
          <p style={{ color: '#71717a' }}>Faça login para acessar o dashboard</p>
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
              Dashboard
            </Title>
            <Text c="dimmed" size="lg">
              Visão geral das métricas principais
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
              {error?.message || 'Ocorreu um erro ao carregar os dados do dashboard.'}
            </Alert>
          )}

          {/* KPIs Grid */}
          <MetricsGrid
            data={dashboard.data}
            currency="BRL"
            isLoading={isLoading}
            onMetricClick={handleMetricClick}
          />

          {/* Charts Section */}
          <ChartsSection
            filters={filters}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />

          {/* Recent Activity */}
          <RecentActivity
            filters={filters}
          />
        </Stack>
      </Container>
    </AppLayout>
  );
}