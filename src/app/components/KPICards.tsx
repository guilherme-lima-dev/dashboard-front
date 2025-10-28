'use client';

import { useEffect } from 'react';
import { 
  Paper, 
  Group, 
  Text, 
  ThemeIcon, 
  Stack, 
  SimpleGrid,
  Badge,
  Box,
  Loader,
  Alert
} from '@mantine/core';
import { 
  IconCurrencyDollar,
  IconCalendarStats,
  IconTrendingUp,
  IconRepeat,
  IconUsers,
  IconUserPlus,
  IconUserMinus,
  IconTarget,
  IconArrowUpRight,
  IconArrowDownRight,
  IconAlertCircle
} from '@tabler/icons-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface KPICardsProps {
}

export default function KPICards() {
  const { 
    dashboardData, 
    isLoading, 
    error, 
    fetchDashboardData,
    formatCurrency,
    formatPercentage 
  } = useAnalytics();
  
  const { currency } = useCurrency();

  useEffect(() => {
    fetchDashboardData({
      currency: currency,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
  }, [currency, fetchDashboardData]);

  const formatValue = (value: number, isPercentage = false, isCount = false) => {
    if (isPercentage) {
      return formatPercentage(value);
    }
    if (isCount) {
      return value.toLocaleString('pt-BR');
    }
    const safeCurrency = currency || 'BRL';
    return formatCurrency(value, safeCurrency);
  };

  const formatChange = (change: string) => {
    return change;
  };

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing="md">
        {Array.from({ length: 9 }).map((_, index) => (
          <Paper key={index} p="lg" radius="lg" shadow="xs" withBorder>
            <Stack gap="md" align="center">
              <Loader size="md" />
              <Text size="sm" c="dimmed">Carregando...</Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    );
  }

  if (error) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        title="Erro ao carregar métricas" 
        color="red"
        variant="light"
      >
        {error}
      </Alert>
    );
  }

  if (!dashboardData?.revenue || !dashboardData?.subscriptions || !dashboardData?.customers) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        title="Nenhum dado encontrado" 
        color="yellow"
        variant="light"
      >
        Não foi possível carregar as métricas da dashboard.
      </Alert>
    );
  }

  const { revenue, subscriptions, customers } = dashboardData;

  const kpiData = [
    {
      id: 'mrr',
      title: 'MRR',
      subtitle: 'Monthly Recurring Revenue',
      value: currency === 'USD' ? revenue.mrrUsd : revenue.mrrBrl,
      change: '+0%',
      trend: 'up',
      icon: IconCurrencyDollar,
      color: 'purple'
    },
    {
      id: 'arr',
      title: 'ARR',
      subtitle: 'Annual Recurring Revenue',
      value: currency === 'USD' ? (revenue.arrUsd || 0) : (revenue.arrBrl || 0),
      change: '+0%',
      trend: 'up',
      icon: IconCalendarStats,
      color: 'blue'
    },
    {
      id: 'total_revenue',
      title: 'Receita Total',
      subtitle: 'Receita acumulada do período',
      value: currency === 'USD' ? (revenue.revenueUsd || 0) : (revenue.revenueBrl || 0),
      change: '+0%',
      trend: 'up',
      icon: IconTrendingUp,
      color: 'green'
    },
    {
      id: 'new_revenue',
      title: 'Nova Receita',
      subtitle: 'Receita não-recorrente',
      value: currency === 'USD' ? (revenue.revenueUsd || 0) : (revenue.revenueBrl || 0),
      change: '+0%',
      trend: 'up',
      icon: IconRepeat,
      color: 'teal'
    },
    {
      id: 'new_subscriptions',
      title: 'Novas Assinaturas',
      subtitle: 'Assinantes do período',
      value: subscriptions.newSubscriptionsCount || 0,
      change: '+0%',
      trend: 'up',
      icon: IconUserPlus,
      color: 'green',
      isCount: true
    },
    {
      id: 'active_subscriptions',
      title: 'Assinaturas Ativas',
      subtitle: 'Total de assinantes ativos',
      value: subscriptions.activeSubscriptionsCount || 0,
      change: '+0%',
      trend: 'up',
      icon: IconUsers,
      color: 'indigo',
      isCount: true
    },
    {
      id: 'cancellations',
      title: 'Cancelamentos',
      subtitle: 'Churns do período',
      value: subscriptions.canceledSubscriptionsCount || 0,
      change: '+0%',
      trend: 'down',
      icon: IconUserMinus,
      color: 'red',
      isCount: true
    },
    {
      id: 'churn_rate',
      title: 'Taxa de Churn',
      subtitle: 'Percentual de cancelamento',
      value: subscriptions.churnRate || 0,
      change: '+0%',
      trend: 'down',
      icon: IconTarget,
      color: 'orange',
      isPercentage: true
    },
    {
      id: 'ltv',
      title: 'LTV',
      subtitle: 'Lifetime Value médio',
      value: currency === 'USD' ? (customers.averageRevenuePerUserUsd || 0) : (customers.averageRevenuePerUserBrl || 0),
      change: '+0%',
      trend: 'up',
      icon: IconCurrencyDollar,
      color: 'violet'
    }
  ];

  return (
    <SimpleGrid 
      cols={{ base: 1, sm: 2, md: 3, lg: 3 }} 
      spacing="md"
    >
      {kpiData.map((kpi) => {
        const IconComponent = kpi.icon;
        const isPositive = kpi.trend === 'up';
        
        return (
          <Paper 
            key={kpi.id} 
            p="lg" 
            radius="lg"
            shadow="xs"
            withBorder
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f1f3f4',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            className="hover:shadow-md"
          >
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    {kpi.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {kpi.subtitle}
                  </Text>
                </Box>
                
                <ThemeIcon
                  size="lg"
                  radius="md"
                  variant="light"
                  color={kpi.color}
                  style={{
                    backgroundColor: `var(--mantine-color-${kpi.color}-0)`,
                    border: `1px solid var(--mantine-color-${kpi.color}-2)`
                  }}
                >
                  <IconComponent size={20} stroke={1.5} />
                </ThemeIcon>
              </Group>

              <Box>
                <Text size="xl" fw={700} c="dark.8">
                  {formatValue(kpi.value, kpi.isPercentage, kpi.isCount)}
                </Text>
              </Box>

              {/*<Group justify="space-between" align="center">*/}
              {/*  <Badge*/}
              {/*    size="sm"*/}
              {/*    radius="md"*/}
              {/*    variant="light"*/}
              {/*    color={isPositive ? 'green' : 'red'}*/}
              {/*    leftSection={*/}
              {/*      isPositive ? */}
              {/*        <IconArrowUpRight size={12} /> : */}
              {/*        <IconArrowDownRight size={12} />*/}
              {/*    }*/}
              {/*    style={{*/}
              {/*      backgroundColor: isPositive ? '#f0fdf4' : '#fef2f2',*/}
              {/*      color: isPositive ? '#16a34a' : '#dc2626',*/}
              {/*      border: `1px solid ${isPositive ? '#bbf7d0' : '#fecaca'}`*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    {formatChange(kpi.change)}*/}
              {/*  </Badge>*/}

              {/*  <Text size="xs" c="dimmed">*/}
              {/*    vs mês anterior*/}
              {/*  </Text>*/}
              {/*</Group>*/}
            </Stack>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}