'use client';

import { Card, Title, Table, Badge, Skeleton, Text } from '@mantine/core';
import { TopAffiliate } from '@/types/dashboard';

interface TopAffiliatesTableProps {
  data: TopAffiliate[];
  loading?: boolean;
  title?: string;
}

export function TopAffiliatesTable({ 
  data, 
  loading = false, 
  title = 'Top Afiliados' 
}: TopAffiliatesTableProps) {
  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">{title}</Title>
        <Skeleton height={200} radius="md" />
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const rows = data.map((affiliate, index) => (
    <Table.Tr key={affiliate.id}>
      <Table.Td>
        <Text fw={500} c="dark">
          #{index + 1}
        </Text>
      </Table.Td>
      <Table.Td>
        <div>
          <Text fw={500} c="dark" size="sm">
            {affiliate.name}
          </Text>
          <Text size="xs" c="dimmed">
            {affiliate.email}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text fw={500} c="green">
          {formatCurrency(affiliate.totalRevenue)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw={500} c="blue">
          {formatCurrency(affiliate.commission)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw={500} c="dark">
          {affiliate.conversions}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={affiliate.conversionRate >= 5 ? 'green' : affiliate.conversionRate >= 2 ? 'yellow' : 'red'}
          variant="light"
        >
          {formatPercentage(affiliate.conversionRate)}
        </Badge>
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
            <Table.Th>Rank</Table.Th>
            <Table.Th>Afiliado</Table.Th>
            <Table.Th>Receita Total</Table.Th>
            <Table.Th>Comissão</Table.Th>
            <Table.Th>Conversões</Table.Th>
            <Table.Th>Taxa</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed" py="md">
                  Nenhum afiliado encontrado
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
