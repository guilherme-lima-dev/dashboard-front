'use client';

import { Card, Title, Text, Group, Badge, Skeleton, Stack, Timeline, Avatar } from '@mantine/core';
import { IconUser, IconCreditCard, IconTrendingUp, IconAlertCircle } from '@tabler/icons-react';
import { useSafeFormat } from '@/lib/hooks/useClientSide';
import { useRecentActivities } from '@/lib/hooks/useAnalytics';
// import { RecentActivity as RecentActivityType } from '@/lib/api/analytics';

interface RecentActivityProps {
  filters: {
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    platformId?: string;
    productId?: string;
    startDate?: string;
    endDate?: string;
  };
  maxItems?: number;
}

const ACTIVITY_ICONS = {
  subscription: IconTrendingUp,
  payment: IconCreditCard,
  user: IconUser,
  alert: IconAlertCircle,
};

const ACTIVITY_COLORS = {
  subscription: 'green',
  payment: 'blue',
  user: 'purple',
  alert: 'red',
};

export function RecentActivity({ 
  filters,
  maxItems = 10 
}: RecentActivityProps) {
  const { formatCurrency, formatDateTime, isClient } = useSafeFormat();
  const { data: activities = [], isLoading } = useRecentActivities(filters);
  
  // Garantir que activities é um array
  const activitiesArray = Array.isArray(activities) ? activities : [];
  
  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">Atividade Recente</Title>
        <Stack gap="md">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <Skeleton height={20} width="80%" mb="xs" />
              <Skeleton height={16} width="60%" />
            </div>
          ))}
        </Stack>
      </Card>
    );
  }

  const recentActivities = activitiesArray.slice(0, maxItems);

  const formatTimestamp = (timestamp: string) => {
    if (!isClient) return 'Agora'; // Fallback para SSR
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return formatDateTime(date);
  };

  const formatAmount = (amount: number, currency: string) => {
    return formatCurrency(amount, currency);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Atividade Recente</Title>
        <Badge color="lilac" variant="light" size="sm">
          {recentActivities.length} atividades
        </Badge>
      </Group>

      {recentActivities.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Nenhuma atividade recente
        </Text>
      ) : (
        <Timeline active={-1} bulletSize={24} lineWidth={2}>
          {recentActivities.map((activity) => {
            const Icon = ACTIVITY_ICONS[activity.type];
            const color = ACTIVITY_COLORS[activity.type];

            return (
              <Timeline.Item
                key={activity.id}
                bullet={<Icon size={12} />}
                title={
                  <Group gap="xs" mb="xs">
                    <Text fw={500} size="sm">
                      {activity.title}
                    </Text>
                    <Badge color={color} variant="light" size="xs">
                      {activity.type}
                    </Badge>
                  </Group>
                }
              >
                <Text size="sm" c="dimmed" mb="xs">
                  {activity.description}
                </Text>
                
                <Group gap="xs" mb="xs">
                  <Text size="xs" c="dimmed">
                    {formatTimestamp(activity.timestamp)}
                  </Text>
                  {activity.user && (
                    <>
                      <Text size="xs" c="dimmed">•</Text>
                      <Group gap="xs">
                        <Avatar size="xs" color="lilac">
                          {activity.user.charAt(0).toUpperCase()}
                        </Avatar>
                        <Text size="xs" c="dimmed">
                          {activity.user}
                        </Text>
                      </Group>
                    </>
                  )}
                </Group>

                {activity.amount && (
                  <Badge color="green" variant="light" size="sm">
                    {formatAmount(activity.amount, activity.currency || 'BRL')}
                  </Badge>
                )}
              </Timeline.Item>
            );
          })}
        </Timeline>
      )}
    </Card>
  );
}
