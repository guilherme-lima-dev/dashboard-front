'use client';

import { 
  Paper, 
  Group, 
  Text, 
  SimpleGrid,
  Stack,
  Loader,
  Center
} from '@mantine/core';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface DashboardChartsProps {
  currency: 'USD' | 'BRL';
}

export default function DashboardCharts({ currency }: DashboardChartsProps) {
  const { userGrowthData, mrrEvolutionData, isLoading } = useAnalytics();
  const exchangeRate = 5.43;

  const formatCurrency = (value: number) => {
    if (currency === 'BRL') {
      return `R$ ${(value * exchangeRate / 1000).toFixed(0)}k`;
    }
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const processedUserGrowthData = userGrowthData ? userGrowthData.map(item => ({
    month: item.month,
    novos: item.new,
    cancelamentos: item.canceled,
    liquido: item.new - item.canceled
  })) : [];

  const processedMRRData = mrrEvolutionData ? mrrEvolutionData.map(item => ({
    month: item.month,
    mrr: item.mrr
  })) : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper p="xs" shadow="md" withBorder>
          <Text size="sm" fw={500} mb="xs">{label}</Text>
          {payload.map((entry: any, index: number) => (
            <Text key={index} size="xs" c={entry.color}>
              {entry.name}: {entry.name.includes('MRR') ? formatCurrency(entry.value) : entry.value}
            </Text>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">
                Crescimento de Usuários
              </Text>
              <Text size="sm" c="dimmed">
                Novos assinantes vs Cancelamentos
              </Text>
            </div>
          </Group>

          <div style={{ width: '100%', height: 300 }}>
            {isLoading ? (
              <Center h={300}>
                <Loader size="md" />
              </Center>
            ) : (
              <ResponsiveContainer>
                <LineChart data={processedUserGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="novos" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    name="Novos Assinantes"
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cancelamentos" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Cancelamentos"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="liquido" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Crescimento Líquido"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Stack>
      </Paper>

      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">
                Crescimento do MRR
              </Text>
              <Text size="sm" c="dimmed">
                Monthly Recurring Revenue por mês
              </Text>
            </div>
          </Group>

          <div style={{ width: '100%', height: 300 }}>
            {isLoading ? (
              <Center h={300}>
                <Loader size="lg" />
              </Center>
            ) : (
              <ResponsiveContainer>
                <BarChart data={processedMRRData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="mrr" 
                    fill="#8b5cf6" 
                    name="MRR"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}