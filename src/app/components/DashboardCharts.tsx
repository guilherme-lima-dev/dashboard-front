'use client';

import { 
  Paper, 
  Group, 
  Text, 
  SimpleGrid,
  Stack
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

const userGrowthData = [
  { month: 'Jan', novos: 120, cancelamentos: 15, liquido: 105 },
  { month: 'Fev', novos: 145, cancelamentos: 22, liquido: 123 },
  { month: 'Mar', novos: 180, cancelamentos: 18, liquido: 162 },
  { month: 'Abr', novos: 165, cancelamentos: 25, liquido: 140 },
  { month: 'Mai', novos: 200, cancelamentos: 20, liquido: 180 },
  { month: 'Jun', novos: 220, cancelamentos: 28, liquido: 192 },
  { month: 'Jul', novos: 195, cancelamentos: 23, liquido: 172 },
  { month: 'Ago', novos: 240, cancelamentos: 30, liquido: 210 },
  { month: 'Set', novos: 260, cancelamentos: 25, liquido: 235 },
  { month: 'Out', novos: 280, cancelamentos: 32, liquido: 248 },
  { month: 'Nov', novos: 300, cancelamentos: 28, liquido: 272 },
  { month: 'Dez', novos: 320, cancelamentos: 35, liquido: 285 }
];

const mrrGrowthData = [
  { month: 'Jan', mrr: 65000 },
  { month: 'Fev', mrr: 68500 },
  { month: 'Mar', mrr: 72000 },
  { month: 'Abr', mrr: 74500 },
  { month: 'Mai', mrr: 78000 },
  { month: 'Jun', mrr: 81200 },
  { month: 'Jul', mrr: 79800 },
  { month: 'Ago', mrr: 83500 },
  { month: 'Set', mrr: 86700 },
  { month: 'Out', mrr: 89200 },
  { month: 'Nov', mrr: 92000 },
  { month: 'Dez', mrr: 95500 }
];

interface DashboardChartsProps {
  currency: 'USD' | 'BRL';
}

export default function DashboardCharts({ currency }: DashboardChartsProps) {
  const exchangeRate = 5.43;

  const formatCurrency = (value: number) => {
    if (currency === 'BRL') {
      return `R$ ${(value * exchangeRate / 1000).toFixed(0)}k`;
    }
    return `$${(value / 1000).toFixed(0)}k`;
  };

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
            <ResponsiveContainer>
              <LineChart data={userGrowthData}>
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
            <ResponsiveContainer>
              <BarChart data={mrrGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="mrr" 
                  fill="#8b5cf6"
                  name="MRR"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}