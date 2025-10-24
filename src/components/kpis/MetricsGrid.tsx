'use client';

import { Grid, Skeleton } from '@mantine/core';
import { 
  IconUsers, 
  IconCurrencyDollar, 
  IconTrendingUp, 
  IconUserX,
  IconHeartHandshake
} from '@tabler/icons-react';
import { MetricCard } from './MetricCard';
import { KPIData } from '@/types/dashboard';

interface MetricsGridProps {
  data: KPIData;
  loading?: boolean;
}

export function MetricsGrid({ data, loading = false }: MetricsGridProps) {
  if (loading) {
    return (
      <Grid>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
            <Skeleton height={120} radius="md" />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  const metrics = [
    {
      title: 'Novas Assinaturas',
      value: data.subscriptions?.newSubscriptionsCount || 0,
      change: '+0%', // API não retorna change, usando valor fixo
      trend: 'up' as const,
      icon: <IconUsers size={20} />,
      color: 'purple'
    },
    {
      title: 'Assinaturas Ativas',
      value: data.subscriptions?.activeSubscriptionsCount || 0,
      change: '+0%', // API não retorna change, usando valor fixo
      trend: 'up' as const,
      icon: <IconTrendingUp size={20} />,
      color: 'green'
    },
    {
      title: 'MRR (BRL)',
      value: `R$ ${(data.revenue?.mrrBrl || 0).toLocaleString('pt-BR')}`,
      change: '+0%', // API não retorna change, usando valor fixo
      trend: 'up' as const,
      icon: <IconCurrencyDollar size={20} />,
      color: 'blue'
    },
    {
      title: 'ARR (BRL)',
      value: `R$ ${(data.revenue?.arrBrl || 0).toLocaleString('pt-BR')}`,
      change: '+0%', // API não retorna change, usando valor fixo
      trend: 'up' as const,
      icon: <IconTrendingUp size={20} />,
      color: 'emerald'
    },
    {
      title: 'Taxa de Churn',
      value: `${(data.subscriptions?.churnRate || 0).toFixed(2)}%`,
      change: '+0%', // API não retorna change, usando valor fixo
      trend: 'down' as const,
      icon: <IconUserX size={20} />,
      color: 'red'
    },
    {
      title: 'LTV (BRL)',
      value: `R$ ${(data.customers?.customerLifetimeValueBrl || 0).toLocaleString('pt-BR')}`,
      change: '+0%', // API não retorna change, usando valor fixo
      trend: 'up' as const,
      icon: <IconHeartHandshake size={20} />,
      color: 'orange'
    }
  ];

  return (
    <Grid>
      {metrics.map((metric, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
          <MetricCard
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            color={metric.color}
            loading={loading}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}