'use client';

import { SimpleGrid, Card, Text, Group, Badge, Skeleton, Progress } from '@mantine/core';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconCurrencyDollar, 
  IconUsers, 
  IconTarget,
  IconHeartHandshake,
  IconRefresh
} from '@tabler/icons-react';
import { DashboardData } from '@/types/dashboard';

interface AnalyticsKPIsProps {
  data?: DashboardData;
  loading?: boolean;
}

export function AnalyticsKPIs({ data, loading = false }: AnalyticsKPIsProps) {
  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} height={120} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  const kpis = [
    {
      title: 'MRR (BRL)',
      value: `R$ ${(data?.revenue?.mrrBrl || 0).toLocaleString('pt-BR')}`,
      change: '+8.2%',
      trend: 'up' as const,
      icon: <IconCurrencyDollar size={24} />,
      color: 'purple',
      progress: 85,
      description: 'Receita Recorrente Mensal'
    },
    {
      title: 'ARR (BRL)',
      value: `R$ ${(data?.revenue?.arrBrl || 0).toLocaleString('pt-BR')}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: <IconTrendingUp size={24} />,
      color: 'green',
      progress: 78,
      description: 'Receita Recorrente Anual'
    },
    {
      title: 'Taxa de Churn',
      value: `${(data?.subscriptions?.churnRate || 0).toFixed(2)}%`,
      change: '-2.1%',
      trend: 'down' as const,
      icon: <IconTarget size={24} />,
      color: 'red',
      progress: 65,
      description: 'Taxa de Cancelamento'
    },
    {
      title: 'LTV (BRL)',
      value: `R$ ${(data?.customers?.customerLifetimeValueBrl || 0).toLocaleString('pt-BR')}`,
      change: '+15.3%',
      trend: 'up' as const,
      icon: <IconHeartHandshake size={24} />,
      color: 'blue',
      progress: 92,
      description: 'Valor Vitalício do Cliente'
    },
    {
      title: 'Assinaturas Ativas',
      value: (data?.subscriptions?.activeSubscriptionsCount || 0).toLocaleString(),
      change: '+18.7%',
      trend: 'up' as const,
      icon: <IconUsers size={24} />,
      color: 'emerald',
      progress: 88,
      description: 'Total de Assinaturas Ativas'
    },
    {
      title: 'Novas Assinaturas',
      value: (data?.subscriptions?.newSubscriptionsCount || 0).toLocaleString(),
      change: '+22.1%',
      trend: 'up' as const,
      icon: <IconRefresh size={24} />,
      color: 'orange',
      progress: 95,
      description: 'Novas Assinaturas Este Mês'
    },
    {
      title: 'Taxa de Conversão',
      value: `${(data?.subscriptions?.trialConversionRate || 0).toFixed(1)}%`,
      change: '+5.4%',
      trend: 'up' as const,
      icon: <IconTarget size={24} />,
      color: 'cyan',
      progress: 72,
      description: 'Trial para Pagamento'
    },
    {
      title: 'ARPU (BRL)',
      value: `R$ ${(data?.customers?.averageRevenuePerUserBrl || 0).toLocaleString('pt-BR')}`,
      change: '+9.8%',
      trend: 'up' as const,
      icon: <IconCurrencyDollar size={24} />,
      color: 'violet',
      progress: 81,
      description: 'Receita por Usuário'
    }
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          padding="lg"
          radius="md"
          shadow="sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            border: '1px solid rgba(147, 51, 234, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(147, 51, 234, 0.15)',
              border: '1px solid rgba(147, 51, 234, 0.2)'
            }
          }}
        >
          <Group justify="space-between" mb="md">
            <div style={{ 
              padding: '8px', 
              borderRadius: '8px', 
              background: `linear-gradient(135deg, var(--mantine-color-${kpi.color}-1) 0%, var(--mantine-color-${kpi.color}-2) 100%)`,
              color: `var(--mantine-color-${kpi.color}-6)`
            }}>
              {kpi.icon}
            </div>
            <Badge 
              color={kpi.trend === 'up' ? 'green' : 'red'} 
              variant="light"
              size="sm"
              leftSection={kpi.trend === 'up' ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
            >
              {kpi.change}
            </Badge>
          </Group>
          
          <Text size="xs" c="dimmed" mb="xs">
            {kpi.description}
          </Text>
          
          <Text size="xl" fw={700} c="dark" mb="sm">
            {kpi.value}
          </Text>
          
          <Text size="sm" fw={600} c="dark" mb="xs">
            {kpi.title}
          </Text>
          
          <Progress
            value={kpi.progress}
            color={kpi.color}
            size="sm"
            radius="xl"
            style={{ marginTop: '8px' }}
          />
        </Card>
      ))}
    </SimpleGrid>
  );
}
