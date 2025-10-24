'use client';

import { AppShell, Burger, Group, Text, Avatar, Menu, UnstyledButton, ActionIcon, Select, Badge, Stack, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBell, IconLogout, IconSettings, IconChevronDown, IconCurrencyDollar } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { TokenLoading } from '@/components/ui/TokenLoading';
import { usePermissionCheck } from '@/lib/hooks/usePermissionCheck';
import { usePathname } from 'next/navigation';
import { NavLink } from '@mantine/core';
import {
  IconDashboard,
  IconChartBar,
  IconUsers,
  IconSettings as IconSettingsNav,
  IconChevronRight,
  IconShield,
  IconAffiliate,
  IconDatabase,
  IconRefresh,
} from '@tabler/icons-react';
import { useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/', permission: 'dashboard:read' },
  { label: 'Analytics', icon: IconChartBar, href: '/analytics', permission: 'analytics:read' },
  { label: 'Afiliados', icon: IconAffiliate, href: '/affiliates', permission: 'affiliates:read' },
  { label: 'Dados', icon: IconDatabase, href: '/data', permission: 'data:read' },
  { label: 'Auditoria', icon: IconShield, href: '/audit', permission: 'audit:read' },
  { label: 'Sincronização', icon: IconRefresh, href: '/sync', permission: 'sync:read' },
  { label: 'Usuários', icon: IconUsers, href: '/users', permission: 'users:read' },
  { label: 'Admin', icon: IconShield, href: '/admin', permission: 'users:manage' },
  { label: 'Configurações', icon: IconSettingsNav, href: '/settings', permission: 'integrations:read' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure(true); // Sidebar aberto por padrão
  const { user, logout, isAuthenticated, isLoading: authLoading, isClient } = useAuth();
  const { data: exchangeRate, isLoading: isRateLoading } = useExchangeRate();
  const { hasPermission, canManageUsers, canManageRoles } = usePermissionCheck(); // Hook de permissões
  const pathname = usePathname();
  const [currency, setCurrency] = useState('BRL');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Renderizar loading durante SSR para evitar hydration mismatch
  if (!isClient) {
    return (
      <div style={{
        background: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'pulse 2s infinite'
            }}
          >
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>AP</span>
          </div>
          <h2 style={{ color: '#a855f7', marginBottom: '8px' }}>Analytics Platform</h2>
          <p style={{ color: '#71717a' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div style={{
        background: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'pulse 2s infinite'
            }}
          >
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>AP</span>
          </div>
          <h2 style={{ color: '#a855f7', marginBottom: '8px' }}>Analytics Platform</h2>
          <p style={{ color: '#71717a' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: opened ? 280 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="xl"
      style={{
        background: '#ffffff',
      }}
    >
      {/* Header Minimalista */}
      <AppShell.Header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #f4f4f5',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Group h="100%" px="xl" justify="space-between">
          <Group>
            <Burger 
              opened={opened} 
              onClick={toggle} 
              size="sm"
              color="#71717a"
              style={{ transition: 'all 0.2s ease' }}
            />
            {opened && (
              <Text fw={600} size="lg" c="gray.8" style={{ transition: 'all 0.3s ease' }}>
              Analytics Platform
            </Text>
            )}
          </Group>
          
          <Group gap="md">
            {/* Cotação USD/BRL */}
            <Group gap="xs">
              <IconCurrencyDollar size={16} color="#71717a" />
              <Text size="sm" c="gray.6" fw={500}>
                USD/BRL:
              </Text>
              {isRateLoading ? (
                <Badge size="sm" color="gray" variant="light">
                  Carregando...
                </Badge>
              ) : (
                <Badge size="sm" color="lilac" variant="light" style={{ 
                  animation: exchangeRate ? 'pulse 2s infinite' : 'none' 
                }}>
                  R$ {exchangeRate?.toFixed(2) || '5.43'}
                </Badge>
              )}
            </Group>

            {/* Notificações */}
            <ActionIcon variant="subtle" color="gray" size="lg" style={{ color: '#71717a' }}>
              <IconBell size={20} />
            </ActionIcon>
            
            {/* Perfil */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar size="sm" color="lilac" radius="xl">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Text size="sm" fw={500} c="gray.8">
                      {user?.name || 'Usuário'}
                    </Text>
                    <IconChevronDown size={14} color="#71717a" />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Minha Conta</Menu.Label>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Configurações
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Sair
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar Expandível */}
      <AppShell.Navbar
        style={{
          background: opened ? '#ffffff' : '#faf5ff',
          borderRight: '1px solid #f4f4f5',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <AppShell.Section p={opened ? "xl" : "md"}>
          {/* Logo */}
          <Group mb="xl" justify={opened ? "flex-start" : "center"}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: '#a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                transition: 'all 0.3s ease',
              }}
            >
              AP
            </div>
            {opened && (
              <div style={{ transition: 'all 0.3s ease' }}>
                <Text fw={600} c="gray.8" size="lg">
                  Analytics
                </Text>
                <Text size="xs" c="gray.5">
                  Platform
                </Text>
              </div>
            )}
          </Group>

          {/* User Info - Só aparece quando expandido */}
          {opened && (
            <Box
              style={{
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                backgroundColor: '#faf5ff',
                border: '1px solid #f3e8ff',
                transition: 'all 0.3s ease',
              }}
            >
              <Group>
                <Avatar color="lilac" radius="xl" size="sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <div>
                  <Text size="sm" fw={500} c="gray.8">
                    {user?.name || 'Usuário'}
                  </Text>
                  <Text size="xs" c="gray.5">
                    {user?.email || 'email@exemplo.com'}
                  </Text>
                </div>
              </Group>
            </Box>
          )}

          {/* Navigation */}
          <Stack gap="xs">
            {navItems
              .filter(item => !item.permission || hasPermission(item.permission))
              .map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={opened ? item.label : undefined}
                leftSection={<item.icon size={20} stroke={1.5} />}
                rightSection={opened ? <IconChevronRight size={16} stroke={1.5} /> : undefined}
                active={pathname === item.href}
                style={{
                  borderRadius: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  minHeight: opened ? '44px' : '40px',
                  justifyContent: opened ? 'flex-start' : 'center',
                }}
                styles={{
                  root: {
                    color: '#71717a',
                    '&:hover': {
                      backgroundColor: '#faf5ff',
                      color: '#a855f7',
                      transform: 'translateX(2px)',
                    },
                    '&[dataActive]': {
                      backgroundColor: '#a855f7',
                      color: 'white',
                      fontWeight: 600,
                      transform: 'translateX(2px)',
                      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                    },
                  },
                  label: {
                    color: 'inherit',
                    fontSize: opened ? '14px' : '0px',
                    transition: 'all 0.3s ease',
                  },
                }}
              />
            ))}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main
        style={{
          background: '#ffffff',
        }}
      >
        <TokenLoading>
          {children}
        </TokenLoading>
      </AppShell.Main>
    </AppShell>
  );
}