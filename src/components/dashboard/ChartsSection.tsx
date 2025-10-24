'use client';

import { Grid, Card, Title, Text, Group, Button, Skeleton } from '@mantine/core';
import { IconRefresh, IconDownload } from '@tabler/icons-react';
import { Chart, RevenueChart, SubscriptionsChart, DistributionChart } from '@/components/ui/Chart';
import { RevenueAnalytics, SubscriptionAnalytics, RevenueTrend, RevenueByProduct, SubscriptionTrend, SubscriptionByProduct } from '@/lib/api/analytics';
import { useRevenueTrend, useRevenueByProduct, useSubscriptionTrend, useSubscriptionByProduct } from '@/lib/hooks/useAnalytics';

interface ChartsSectionProps {
  filters: {
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    platformId?: string;
    productId?: string;
    startDate?: string;
    endDate?: string;
  };
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ChartsSection({ 
  filters,
  onRefresh, 
  onExport 
}: ChartsSectionProps) {
  // Usar os novos hooks para buscar dados reais
  const revenueTrend = useRevenueTrend(filters);
  const revenueByProduct = useRevenueByProduct(filters);
  const subscriptionTrend = useSubscriptionTrend(filters);
  const subscriptionByProduct = useSubscriptionByProduct(filters);

  const isLoading = revenueTrend.isLoading || revenueByProduct.isLoading || 
                   subscriptionTrend.isLoading || subscriptionByProduct.isLoading;

  // Transformar dados para os gráficos
  const revenueChartData = revenueTrend.data?.monthlyTrend?.map(item => ({
    name: item.month,
    value: item.revenue,
    subscriptions: item.subscriptions
  })) || [];

  const subscriptionChartData = subscriptionTrend.data?.monthlyTrend?.map(item => ({
    name: item.month,
    value: item.subscriptions,
    revenue: item.revenue
  })) || [];

  const revenueByProductData = revenueByProduct.data?.revenueByProduct?.map(item => ({
    name: item.productName,
    value: item.revenue,
    percentage: item.percentage
  })) || [];

  const subscriptionByProductData = subscriptionByProduct.data?.subscriptionsByProduct?.map(item => ({
    name: item.productName,
    value: item.count,
    percentage: item.percentage
  })) || [];

  if (isLoading) {
    return (
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Skeleton height={400} radius="md" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Skeleton height={400} radius="md" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Skeleton height={300} radius="md" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Skeleton height={300} radius="md" />
        </Grid.Col>
      </Grid>
    );
  }

  return (
    <Grid>
      {/* Gráfico de Receita */}
      <Grid.Col span={{ base: 12, md: 8 }}>
        <RevenueChart 
          data={revenueChartData}
          loading={isLoading}
        />
      </Grid.Col>

      {/* Gráfico de Distribuição de Receita */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <DistributionChart 
          data={revenueByProductData}
          loading={isLoading}
        />
      </Grid.Col>

      {/* Gráfico de Assinaturas */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <SubscriptionsChart 
          data={subscriptionChartData}
          loading={isLoading}
        />
      </Grid.Col>

      {/* Gráfico de Distribuição de Assinaturas */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DistributionChart 
          data={subscriptionByProductData}
          loading={isLoading}
        />
      </Grid.Col>

      {/* Ações */}
      <Grid.Col span={12}>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={4} mb="xs">Ações Rápidas</Title>
              <Text size="sm" c="dimmed">
                Atualize os dados ou exporte relatórios
              </Text>
            </div>
            <Group gap="sm">
              <Button
                variant="outline"
                color="lilac"
                leftSection={<IconRefresh size={16} />}
                onClick={onRefresh}
                loading={isLoading}
              >
                Atualizar
              </Button>
              <Button
                variant="filled"
                color="lilac"
                leftSection={<IconDownload size={16} />}
                onClick={onExport}
              >
                Exportar
              </Button>
            </Group>
          </Group>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
