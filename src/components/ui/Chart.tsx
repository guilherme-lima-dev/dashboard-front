'use client';

import { Card, Title, Text, Group, Skeleton } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ReactNode } from 'react';

interface ChartProps {
  title: string;
  description?: string;
  data: any[];
  type: 'line' | 'bar' | 'pie';
  height?: number;
  loading?: boolean;
  children?: ReactNode;
}

export function Chart({ 
  title, 
  description, 
  data, 
  type, 
  height = 300, 
  loading = false,
  children 
}: ChartProps) {
  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Skeleton height={24} width="60%" mb="xs" />
        <Skeleton height={16} width="40%" mb="md" />
        <Skeleton height={height} />
      </Card>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#9333ea" 
              strokeWidth={2}
              dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Legend />
            <Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'pie':
        const COLORS = ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div>
          <Title order={3} mb="xs" c="dark">
            {title}
          </Title>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </div>
        {children}
      </Group>
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// Componente específico para gráfico de receita
export function RevenueChart({ 
  data, 
  loading = false 
}: { 
  data: any[]; 
  loading?: boolean 
}) {
  return (
    <Chart
      title="Evolução da Receita"
      description="Receita ao longo do tempo"
      data={data}
      type="line"
      loading={loading}
    />
  );
}

// Componente específico para gráfico de assinaturas
export function SubscriptionsChart({ 
  data, 
  loading = false 
}: { 
  data: any[]; 
  loading?: boolean 
}) {
  return (
    <Chart
      title="Assinaturas por Período"
      description="Novas assinaturas ao longo do tempo"
      data={data}
      type="bar"
      loading={loading}
    />
  );
}

// Componente específico para gráfico de distribuição
export function DistributionChart({ 
  data, 
  loading = false 
}: { 
  data: any[]; 
  loading?: boolean 
}) {
  return (
    <Chart
      title="Distribuição"
      description="Distribuição por categoria"
      data={data}
      type="pie"
      loading={loading}
    />
  );
}
