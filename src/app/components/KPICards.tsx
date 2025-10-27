'use client';

import { 
  Paper, 
  Group, 
  Text, 
  ThemeIcon, 
  Stack, 
  SimpleGrid,
  Badge,
  Box
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
  IconArrowDownRight
} from '@tabler/icons-react';

interface KPICardsProps {
  currency: 'USD' | 'BRL';
}

const kpiData = [
  {
    id: 'mrr',
    title: 'MRR',
    subtitle: 'Monthly Recurring Revenue',
    value: 95500,
    change: -2.3,
    trend: 'down',
    icon: IconCurrencyDollar,
    color: 'purple'
  },
  {
    id: 'arr',
    title: 'ARR',
    subtitle: 'Annual Recurring Revenue',
    value: 1146000,
    change: 8.7,
    trend: 'up',
    icon: IconCalendarStats,
    color: 'blue'
  },
  {
    id: 'total_revenue',
    title: 'Receita Total',
    subtitle: 'Receita acumulada do período',
    value: 287500,
    change: 12.4,
    trend: 'up',
    icon: IconTrendingUp,
    color: 'green'
  },
  {
    id: 'recurring_value',
    title: 'Valor Recorrente',
    subtitle: 'MRR efetivado no ciclo',
    value: 89200,
    change: 5.2,
    trend: 'up',
    icon: IconRepeat,
    color: 'teal'
  },
  {
    id: 'active_subscriptions',
    title: 'Assinaturas Ativas',
    subtitle: 'Total de assinantes ativos',
    value: 2847,
    change: 3.8,
    trend: 'up',
    icon: IconUsers,
    color: 'indigo'
  },
  {
    id: 'new_subscribers',
    title: 'Novos Assinantes',
    subtitle: 'Assinantes do mês atual',
    value: 320,
    change: 15.6,
    trend: 'up',
    icon: IconUserPlus,
    color: 'green'
  },
  {
    id: 'cancellations',
    title: 'Cancelamentos',
    subtitle: 'Churns do mês atual',
    value: 35,
    change: -8.2,
    trend: 'down',
    icon: IconUserMinus,
    color: 'red'
  },
  {
    id: 'churn_rate',
    title: 'Taxa de Churn',
    subtitle: 'Percentual de cancelamento',
    value: 1.23,
    change: -0.4,
    trend: 'down',
    icon: IconTarget,
    color: 'orange',
    isPercentage: true
  },
  {
    id: 'ltv',
    title: 'LTV',
    subtitle: 'Lifetime Value médio',
    value: 2850,
    change: 7.9,
    trend: 'up',
    icon: IconCurrencyDollar,
    color: 'violet'
  }
];

export default function KPICards({ currency }: KPICardsProps) {
  const exchangeRate = 5.43;

  const formatValue = (value: number, isPercentage = false) => {
    if (isPercentage) {
      return `${value.toFixed(2)}%`;
    }
    
    if (currency === 'BRL') {
      return `R$ ${(value * exchangeRate).toLocaleString('pt-BR')}`;
    }
    return `$${value.toLocaleString('en-US')}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

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
                  {formatValue(kpi.value, kpi.isPercentage)}
                </Text>
              </Box>

              <Group justify="space-between" align="center">
                <Badge
                  size="sm"
                  radius="md"
                  variant="light"
                  color={isPositive ? 'green' : 'red'}
                  leftSection={
                    isPositive ? 
                      <IconArrowUpRight size={12} /> : 
                      <IconArrowDownRight size={12} />
                  }
                  style={{
                    backgroundColor: isPositive ? '#f0fdf4' : '#fef2f2',
                    color: isPositive ? '#16a34a' : '#dc2626',
                    border: `1px solid ${isPositive ? '#bbf7d0' : '#fecaca'}`
                  }}
                >
                  {formatChange(kpi.change)}
                </Badge>
                
                <Text size="xs" c="dimmed">
                  vs mês anterior
                </Text>
              </Group>
            </Stack>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}