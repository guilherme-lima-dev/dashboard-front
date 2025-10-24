'use client';

import { SimpleGrid, Card, Text, Group, Badge, Progress } from '@mantine/core';
import { IconUsers, IconUserCheck, IconUserX, IconUserPlus, IconShield, IconClock } from '@tabler/icons-react';

export function UserStats() {
  const stats = [
    {
      title: 'Total de Usuários',
      value: '1,247',
      change: '+12.5%',
      trend: 'up' as const,
      icon: <IconUsers size={24} />,
      color: 'purple',
      progress: 85
    },
    {
      title: 'Usuários Ativos',
      value: '1,089',
      change: '+8.2%',
      trend: 'up' as const,
      icon: <IconUserCheck size={24} />,
      color: 'green',
      progress: 87
    },
    {
      title: 'Usuários Inativos',
      value: '158',
      change: '-2.1%',
      trend: 'down' as const,
      icon: <IconUserX size={24} />,
      color: 'red',
      progress: 13
    },
    {
      title: 'Novos Este Mês',
      value: '89',
      change: '+22.1%',
      trend: 'up' as const,
      icon: <IconUserPlus size={24} />,
      color: 'blue',
      progress: 95
    },
    {
      title: 'Administradores',
      value: '12',
      change: '+0%',
      trend: 'neutral' as const,
      icon: <IconShield size={24} />,
      color: 'orange',
      progress: 100
    },
    {
      title: 'Pendentes',
      value: '23',
      change: '+5.4%',
      trend: 'up' as const,
      icon: <IconClock size={24} />,
      color: 'yellow',
      progress: 18
    }
  ];

  return (
    <div>
      <Text size="lg" fw={600} c="dark" mb="lg">
        📊 Estatísticas de Usuários
      </Text>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {stats.map((stat, index) => (
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
                background: `linear-gradient(135deg, var(--mantine-color-${stat.color}-1) 0%, var(--mantine-color-${stat.color}-2) 100%)`,
                color: `var(--mantine-color-${stat.color}-6)`
              }}>
                {stat.icon}
              </div>
              <Badge 
                color={stat.trend === 'up' ? 'green' : stat.trend === 'down' ? 'red' : 'gray'} 
                variant="light"
                size="sm"
              >
                {stat.change}
              </Badge>
            </Group>
            
            <Text size="xl" fw={700} c="dark" mb="xs">
              {stat.value}
            </Text>
            
            <Text size="sm" fw={600} c="dark" mb="sm">
              {stat.title}
            </Text>
            
            <Progress
              value={stat.progress}
              color={stat.color}
              size="sm"
              radius="xl"
            />
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}
