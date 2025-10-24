'use client';

import { Card, Title, Table, Badge, Skeleton, Text, Group, Avatar } from '@mantine/core';
import { RecentSubscription } from '@/types/dashboard';
import { useSafeFormat } from '@/lib/hooks/useClientSide';

interface RecentSubscriptionsTableProps {
  data: RecentSubscription[];
  loading?: boolean;
  title?: string;
}

export function RecentSubscriptionsTable({ 
  data, 
  loading = false, 
  title = 'Assinaturas Recentes' 
}: RecentSubscriptionsTableProps) {
  const { formatCurrency, formatDateTime } = useSafeFormat();
  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">{title}</Title>
        <Skeleton height={200} radius="md" />
      </Card>
    );
  }

  const formatCurrencyValue = (value: number) => {
    return formatCurrency(value);
  };

  const formatDateValue = (date: string) => {
    return formatDateTime(new Date(date), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'trial':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'cancelled':
        return 'Cancelada';
      case 'trial':
        return 'Trial';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const rows = data.map((subscription) => (
    <Table.Tr key={subscription.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size="sm" color="purple" radius="xl">
            {getInitials(subscription.customerName)}
          </Avatar>
          <div>
            <Text fw={500} c="dark" size="sm">
              {subscription.customerName}
            </Text>
            <Text size="xs" c="dimmed">
              {subscription.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw={500} c="dark" size="sm">
          {subscription.plan}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw={500} c="green" size="sm">
          {formatCurrencyValue(subscription.amount)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={getStatusColor(subscription.status)}
          variant="light"
        >
          {getStatusLabel(subscription.status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          {formatDateValue(subscription.createdAt)}
        </Text>
      </Table.Td>
      <Table.Td>
        {subscription.affiliateId ? (
          <Badge color="purple" variant="light" size="sm">
            Afiliado
          </Badge>
        ) : (
          <Text size="xs" c="dimmed">
            Direto
          </Text>
        )}
      </Table.Td>
    </Table.Tr>
  ));

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
      <Title order={3} mb="md" c="dark">
        {title}
      </Title>
      
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Cliente</Table.Th>
            <Table.Th>Plano</Table.Th>
            <Table.Th>Valor</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Data</Table.Th>
            <Table.Th>Origem</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed" py="md">
                  Nenhuma assinatura encontrada
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
