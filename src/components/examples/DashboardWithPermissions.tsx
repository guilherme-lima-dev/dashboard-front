'use client';

import React from 'react';
import { Container, Title, Text, Group, Button, Card, Stack } from '@mantine/core';
import { IconPlus, IconDownload, IconSettings, IconChartBar } from '@tabler/icons-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { ConditionalButton } from '@/components/ui/ConditionalButton';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { PERMISSIONS } from '@/lib/constants/permissions';

export function DashboardWithPermissions() {
  const { hasPermission } = usePermissions();
  
  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* Header com botões condicionais */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Dashboard</Title>
            <Text c="dimmed">Visão geral das métricas principais</Text>
          </div>
          
          <Group gap="sm">
            {/* Botão de criar widget - apenas para quem pode criar */}
            <ConditionalButton
              permission={PERMISSIONS.DASHBOARD.CREATE}
              leftSection={<IconPlus size={16} />}
              onClick={() => console.log('Criar widget')}
            >
              Novo Widget
            </ConditionalButton>
            
            {/* Botão de exportar - apenas para quem pode exportar */}
            <ConditionalButton
              permission={PERMISSIONS.DASHBOARD.EXPORT}
              variant="outline"
              leftSection={<IconDownload size={16} />}
              onClick={() => console.log('Exportar dashboard')}
            >
              Exportar
            </ConditionalButton>
            
            {/* Botão de configurações - apenas para quem pode gerenciar */}
            <ConditionalButton
              permission={PERMISSIONS.DASHBOARD.MANAGE}
              variant="light"
              leftSection={<IconSettings size={16} />}
              onClick={() => console.log('Configurações')}
            >
              Configurações
            </ConditionalButton>
          </Group>
        </Group>

        {/* Métricas básicas - sempre visíveis para quem tem dashboard:read */}
        <Card>
          <Title order={3} mb="md">Métricas Principais</Title>
          <Text>Conteúdo das métricas...</Text>
        </Card>

        {/* Gráficos avançados - apenas para quem pode ler analytics */}
        <PermissionGuard permission={PERMISSIONS.ANALYTICS.READ}>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={3}>Gráficos Avançados</Title>
              <ConditionalButton
                permission={PERMISSIONS.ANALYTICS.EXPORT}
                variant="outline"
                size="sm"
                leftSection={<IconChartBar size={16} />}
                onClick={() => console.log('Exportar analytics')}
              >
                Exportar Analytics
              </ConditionalButton>
            </Group>
            <Text>Conteúdo dos gráficos avançados...</Text>
          </Card>
        </PermissionGuard>

        {/* Seção de administração - apenas para admins */}
        <PermissionGuard 
          permission={PERMISSIONS.USERS.MANAGE}
          fallback={
            <Card>
              <Text c="dimmed">Seção administrativa não disponível</Text>
            </Card>
          }
        >
          <Card>
            <Title order={3} mb="md">Administração</Title>
            <Text>Conteúdo administrativo...</Text>
          </Card>
        </PermissionGuard>

        {/* Ações em lote - apenas para quem tem múltiplas permissões */}
        <PermissionGuard 
          permission={PERMISSIONS.DASHBOARD.MANAGE}
        >
          <Card>
            <Title order={3} mb="md">Ações em Lote</Title>
            <Group gap="sm">
              <ConditionalButton
                permission={PERMISSIONS.DASHBOARD.UPDATE}
                variant="outline"
                onClick={() => console.log('Atualizar widgets')}
              >
                Atualizar Widgets
              </ConditionalButton>
              
              <ConditionalButton
                permission={PERMISSIONS.DASHBOARD.DELETE}
                variant="outline"
                color="red"
                onClick={() => console.log('Limpar dashboard')}
              >
                Limpar Dashboard
              </ConditionalButton>
            </Group>
          </Card>
        </PermissionGuard>
      </Stack>
    </Container>
  );
}
