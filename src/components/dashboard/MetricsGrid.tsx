'use client';

import { Grid, Skeleton } from '@mantine/core';
import { IconUsers, IconTrendingUp, IconCurrencyDollar, IconTrendingDown, IconRefresh, IconTarget, IconClock } from '@tabler/icons-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DashboardMetrics } from '@/lib/api/analytics';
import { useSafeFormat } from '@/lib/hooks/useClientSide';

interface MetricsGridProps {
  data?: DashboardMetrics;
  currency: 'BRL' | 'USD';
  isLoading?: boolean;
  onMetricClick?: (metric: string) => void;
}

const METRICS = [
  {
    key: 'newSubscriptions',
    title: 'Novas Assinaturas',
    icon: IconUsers,
    color: 'blue',
    description: 'Assinaturas criadas no período',
    getValue: (data: DashboardMetrics) => data.subscriptions.newSubscriptionsCount,
    format: (value: number) => value.toString()
  },
  {
    key: 'mrr',
    title: 'MRR',
    icon: IconTrendingUp,
    color: 'green',
    description: 'Receita Recorrente Mensal',
    getValue: (data: DashboardMetrics) => data.revenue.mrrBrl,
    format: (value: number) => `R$ ${value.toFixed(2)}`
  },
  {
    key: 'arr',
    title: 'ARR',
    icon: IconCurrencyDollar,
    color: 'purple',
    description: 'Receita Recorrente Anual',
    getValue: (data: DashboardMetrics) => data.revenue.arrBrl,
    format: (value: number) => `R$ ${value.toFixed(2)}`
  },
  {
    key: 'churnRate',
    title: 'Taxa de Churn',
    icon: IconTrendingDown,
    color: 'red',
    description: 'Taxa de cancelamento',
    getValue: (data: DashboardMetrics) => data.subscriptions.churnRate,
    format: (value: number) => `${value.toFixed(1)}%`
  },
  {
    key: 'trialRate',
    title: 'Taxa de Trial',
    icon: IconTarget,
    color: 'orange',
    description: 'Conversão de trials',
    getValue: (data: DashboardMetrics) => data.subscriptions.trialConversionRate,
    format: (value: number) => `${value.toFixed(1)}%`
  },
  {
    key: 'ltv',
    title: 'LTV',
    icon: IconRefresh,
    color: 'cyan',
    description: 'Lifetime Value',
    getValue: (data: DashboardMetrics) => data.customers.customerLifetimeValueBrl,
    format: (value: number) => `R$ ${value.toFixed(2)}`
  },
  {
    key: 'activeSubscriptions',
    title: 'Assinaturas Ativas',
    icon: IconClock,
    color: 'teal',
    description: 'Total de assinaturas ativas',
    getValue: (data: DashboardMetrics) => data.subscriptions.activeSubscriptionsCount,
    format: (value: number) => value.toString()
  }
] as const;

export function MetricsGrid({ data, currency, isLoading, onMetricClick }: MetricsGridProps) {
  const { formatNumber, formatCurrency } = useSafeFormat();
  
  if (isLoading) {
    return (
      <Grid>
        {Array.from({ length: 7 }).map((_, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Skeleton height={120} radius="md" />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  const formatValue = (metric: any, data: DashboardMetrics) => {
    if (!data) return '0';
    return metric.format(metric.getValue(data));
  };

  const getChange = (metric: any) => {
    // Por enquanto, não temos dados de mudança do backend
    // Podemos implementar isso depois
    return { value: 0, trend: 'neutral' as const };
  };

  return (
    <Grid>
      {METRICS.map((metric) => {
        const formattedValue = formatValue(metric, data);
        const change = getChange(metric);

        return (
          <Grid.Col key={metric.key} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <MetricCard
              title={metric.title}
              value={formattedValue}
              change={change.value}
              trend={change.trend}
              icon={<metric.icon size={24} />}
              color={metric.color}
              description={metric.description}
              onClick={() => onMetricClick?.(metric.key)}
            />
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
