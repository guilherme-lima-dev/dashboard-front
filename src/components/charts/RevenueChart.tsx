'use client';

import { Skeleton, Text, Group, Badge } from '@mantine/core';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { DashboardData } from '@/types/dashboard';

interface RevenueChartProps {
  data?: DashboardData;
  loading?: boolean;
}

export function RevenueChart({ data, loading = false }: RevenueChartProps) {
  if (loading) {
    return <Skeleton height={300} radius="md" />;
  }

  // Dados reais da API
  const chartData = data?.revenueChart || [];

  const currentRevenue = data?.revenue?.revenueBrl || 89000;
  const previousRevenue = 78000;
  const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed">
          Receita Mensal (BRL)
        </Text>
        <Badge 
          color={growth >= 0 ? 'green' : 'red'} 
          variant="light"
          leftSection={growth >= 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
        >
          {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
        </Badge>
      </Group>
      
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="month" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#9333ea"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#9333ea', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}