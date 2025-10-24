'use client';

import { Card, Text, Group, ThemeIcon, Badge, Skeleton } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  color?: string;
  onClick?: () => void;
  loading?: boolean;
  description?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color = 'lilac',
  onClick,
  loading = false,
  description
}: MetricCardProps) {
  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Skeleton height={20} width="60%" mb="xs" />
        <Skeleton height={32} width="40%" mb="xs" />
        <Skeleton height={16} width="30%" />
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <IconTrendingUp size={16} color="green" />;
      case 'down':
        return <IconTrendingDown size={16} color="red" />;
      default:
        return <IconMinus size={16} color="gray" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'green';
      case 'down':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        background: '#ffffff',
        border: '1px solid #f4f4f5',
      }}
      onClick={onClick}
      className={onClick ? 'hover:shadow-md' : ''}
    >
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>
        <ThemeIcon color={color} variant="light" size="lg" radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      
      <Text size="xl" fw={700} mb="xs" c="dark">
        {value}
      </Text>
      
      {description && (
        <Text size="xs" c="dimmed" mb="xs">
          {description}
        </Text>
      )}
      
      {change !== undefined && (
        <Group spacing="xs">
          {getTrendIcon()}
          <Badge 
            color={getTrendColor()} 
            variant="light"
            size="sm"
            radius="md"
          >
            {trend === 'up' ? '+' : ''}{change}%
          </Badge>
        </Group>
      )}
    </Card>
  );
}
