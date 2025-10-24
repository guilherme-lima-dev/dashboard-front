'use client';

import { Card, Text, Group, ThemeIcon, Skeleton } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';
import { MetricCardProps } from '@/types/dashboard';

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color = 'purple',
  loading = false 
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <IconTrendingUp size={16} color="#10B981" />;
      case 'down':
        return <IconTrendingDown size={16} color="#EF4444" />;
      default:
        return <IconMinus size={16} color="#6B7280" />;
    }
  };

  const getChangeColor = () => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Skeleton height={20} width="60%" />
          <Skeleton height={24} width={24} radius="xl" />
        </Group>
        <Skeleton height={32} width="80%" mb="xs" />
        <Skeleton height={16} width="40%" />
      </Card>
    );
  }

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500} c="dimmed">
          {title}
        </Text>
        {icon && (
          <ThemeIcon 
            color={color} 
            variant="light" 
            size="lg" 
            radius="xl"
          >
            {icon}
          </ThemeIcon>
        )}
      </Group>

      <Text size="xl" fw={700} c="dark" mb="xs">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </Text>

      <Group gap="xs" align="center">
        {getTrendIcon()}
        <Text 
          size="sm" 
          fw={500}
          c={getChangeColor()}
        >
          {change}
        </Text>
        <Text size="sm" c="dimmed">
          vs mês anterior
        </Text>
      </Group>
    </Card>
  );
}
