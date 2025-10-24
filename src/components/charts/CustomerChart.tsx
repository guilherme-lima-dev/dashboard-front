'use client';

import { Skeleton, Text, Group, Badge, SimpleGrid } from '@mantine/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IconUsers, IconTrendingUp, IconTarget } from '@tabler/icons-react';
import { DashboardData } from '@/types/dashboard';

interface CustomerChartProps {
  data?: DashboardData;
  loading?: boolean;
}

export function CustomerChart({ data, loading = false }: CustomerChartProps) {
  if (loading) {
    return <Skeleton height={400} radius="md" />;
  }

  // Dados para gráfico de pizza - Segmentação de clientes
  const customerSegments = [
    { name: 'Premium', value: 25, color: '#9333ea' },
    { name: 'Standard', value: 45, color: '#10B981' },
    { name: 'Basic', value: 30, color: '#F59E0B' },
  ];

  // Dados para gráfico de barras - LTV por segmento
  const ltvData = [
    { segment: 'Premium', ltv: 2500, customers: 300 },
    { segment: 'Standard', ltv: 1200, customers: 540 },
    { segment: 'Basic', ltv: 600, customers: 360 },
  ];

  const totalCustomers = data?.customers?.totalCustomersCount || 1200;
  const avgLTV = data?.customers?.customerLifetimeValueBrl || 1500;

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed">
          Análise de Clientes
        </Text>
        <Badge color="purple" variant="light" leftSection={<IconUsers size={12} />}>
          {totalCustomers.toLocaleString()} clientes
        </Badge>
      </Group>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        {/* Gráfico de Pizza - Segmentação */}
        <div>
          <Text size="sm" fw={600} mb="md" c="dark">
            📊 Segmentação de Clientes
          </Text>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Participação']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <Group justify="center" mt="md" gap="lg">
            {customerSegments.map((segment, index) => (
              <Group key={index} gap="xs">
                <div 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: segment.color, 
                    borderRadius: '50%' 
                  }} 
                />
                <Text size="xs" c="dimmed">{segment.name}</Text>
              </Group>
            ))}
          </Group>
        </div>

        {/* Gráfico de Barras - LTV por Segmento */}
        <div>
          <Text size="sm" fw={600} mb="md" c="dark">
            💰 LTV por Segmento
          </Text>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="segment" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'ltv' ? `R$ ${value.toLocaleString('pt-BR')}` : value,
                    name === 'ltv' ? 'LTV' : 'Clientes'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="ltv" 
                  fill="#9333ea"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SimpleGrid>
      
      {/* Métricas Resumidas */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt="xl">
        <Group gap="xs" p="md" style={{ 
          background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <IconTarget size={20} />
          <div>
            <Text size="xs" opacity={0.8}>LTV Médio</Text>
            <Text size="lg" fw={700}>R$ {avgLTV.toLocaleString('pt-BR')}</Text>
          </div>
        </Group>
        
        <Group gap="xs" p="md" style={{ 
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <IconUsers size={20} />
          <div>
            <Text size="xs" opacity={0.8}>Total Clientes</Text>
            <Text size="lg" fw={700}>{totalCustomers.toLocaleString()}</Text>
          </div>
        </Group>
        
        <Group gap="xs" p="md" style={{ 
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <IconTrendingUp size={20} />
          <div>
            <Text size="xs" opacity={0.8}>Crescimento</Text>
            <Text size="lg" fw={700}>+12.5%</Text>
          </div>
        </Group>
      </SimpleGrid>
    </div>
  );
}
