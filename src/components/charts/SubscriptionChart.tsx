'use client';

import { Skeleton, Text, Group, Badge, Stack } from '@mantine/core';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { IconUsers, IconUserPlus, IconUserMinus } from '@tabler/icons-react';
import { DashboardData } from '@/types/dashboard';

interface SubscriptionChartProps {
  data?: DashboardData;
  loading?: boolean;
}

export function SubscriptionChart({ data, loading = false }: SubscriptionChartProps) {
  if (loading) {
    return <Skeleton height={300} radius="md" />;
  }

  // Dados reais da API
  const chartData = data?.subscriptionChart || [];

  const totalActive = data?.subscriptions?.activeSubscriptionsCount || 1200;
  const newSubs = data?.subscriptions?.newSubscriptionsCount || 89;
  const churned = data?.subscriptions?.churnCount || 5;

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed">
          Crescimento de Assinaturas
        </Text>
        <Badge color="blue" variant="light" leftSection={<IconUsers size={12} />}>
          {totalActive.toLocaleString()} ativas
        </Badge>
      </Group>
      
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="month" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value, 
                name === 'new' ? 'Novas' : name === 'churned' ? 'Canceladas' : 'Líquido'
              ]}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar 
              dataKey="new" 
              fill="#10B981" 
              name="new"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="churned" 
              fill="#EF4444" 
              name="churned"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="net" 
              fill="#9333ea" 
              name="net"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <Stack gap="xs" mt="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconUserPlus size={16} color="#10B981" />
            <Text size="sm" c="dimmed">Novas este mês:</Text>
          </Group>
          <Text size="sm" fw={600} c="green">{newSubs}</Text>
        </Group>
        
        <Group justify="space-between">
          <Group gap="xs">
            <IconUserMinus size={16} color="#EF4444" />
            <Text size="sm" c="dimmed">Canceladas este mês:</Text>
          </Group>
          <Text size="sm" fw={600} c="red">{churned}</Text>
        </Group>
      </Stack>
    </div>
  );
}