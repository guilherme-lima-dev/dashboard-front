'use client';

import { 
  AppShell,
  Group, 
  Text, 
  Avatar, 
  Menu, 
  ActionIcon, 
  Select,
  Badge,
  Indicator,
  Paper,
  Loader,
  Tooltip
} from '@mantine/core';
import { 
  IconUser, 
  IconSettings, 
  IconLogout, 
  IconBell,
  IconChevronDown,
  IconRefresh
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Topbar() {
  const { logout, user } = useAuth();
  const { 
    currency,
    setCurrency,
    exchangeRate, 
    refreshExchangeRate 
  } = useCurrency();

  const formatExchangeRate = () => {
    if (exchangeRate.isLoading) {
      return 'Carregando...';
    }
    
    if (exchangeRate.error) {
      return 'Erro na cotação';
    }

    return `1 USD = R$ ${exchangeRate.rate.toFixed(2)}`;
  };

  const getBadgeColor = () => {
    if (exchangeRate.error) return 'red';
    if (exchangeRate.isLoading) return 'gray';
    return 'blue';
  };

  const getLastUpdatedText = () => {
    const now = new Date();
    const diffMs = now.getTime() - exchangeRate.lastUpdated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes === 1) return 'Há 1 minuto';
    return `Há ${diffMinutes} minutos`;
  };

  return (
    <AppShell.Header p="md">
      <Group justify="space-between" h="100%">
        <Group gap="sm">
          <img 
            src="/logo.jpg" 
            alt="Appyon Logo" 
            width={32} 
            height={32}
            style={{ 
              display: 'block',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <Text size="xl" fw={700} c="dark">
            Dashboard
          </Text>
        </Group>

        <Group gap="md">
          <Group gap="md">
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Moeda:
              </Text>
              <Select
                value={currency}
                onChange={(value) => setCurrency(value as 'USD' | 'BRL')}
                data={[
                  { value: 'USD', label: 'USD' },
                  { value: 'BRL', label: 'BRL' }
                ]}
                size="sm"
                w={80}
              />
            </Group>

            {/* Cotação sempre visível com destaque */}
            <Paper
              p="xs"
              radius="md"
              withBorder
              style={{
                backgroundColor: '#f8f9fa',
                borderColor: '#e9ecef',
                minWidth: '200px'
              }}
            >
              <Group gap="xs" justify="space-between">
                <Group gap="xs">
                  <Text size="xs" c="dimmed" fw={500}>
                    Cotação USD/BRL:
                  </Text>
                  <Tooltip 
                    label={`Última atualização: ${getLastUpdatedText()}${exchangeRate.source ? ` • Fonte: ${exchangeRate.source}` : ''}`}
                    position="bottom"
                  >
                    <Badge 
                      variant="filled" 
                      color={getBadgeColor()} 
                      size="md"
                      style={{ cursor: 'help', fontWeight: 600 }}
                    >
                      {exchangeRate.isLoading && <Loader size="xs" mr="xs" />}
                      {formatExchangeRate()}
                    </Badge>
                  </Tooltip>
                </Group>
                
                <Tooltip label="Atualizar cotação">
                  <ActionIcon 
                    variant="light" 
                    size="sm"
                    onClick={refreshExchangeRate}
                    loading={exchangeRate.isLoading}
                    color="blue"
                  >
                    <IconRefresh size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Paper>
          </Group>

          <Indicator inline color="red" size={8}>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconBell size={18} />
            </ActionIcon>
          </Indicator>

          <ActionIcon variant="subtle" color="gray" size="lg">
            <IconSettings size={18} />
          </ActionIcon>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Paper
                p="sm"
                radius="lg"
                shadow="xs"
                withBorder
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f1f3f4',
                  transition: 'all 0.2s ease',
                }}
                className="hover:shadow-md"
              >
                <Group gap="xs" wrap="nowrap">
                  <Avatar 
                    size="sm" 
                    color="blue"
                    style={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      fontWeight: 600
                    }}
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <Text size="sm" fw={600} c="dark.8">
                      {user?.fullName || 'Usuário'}
                    </Text>
                    <Text size="xs" c="dimmed" fw={500}>
                      {user?.email || 'email@exemplo.com'}
                    </Text>
                  </div>
                  <IconChevronDown 
                    size={14} 
                    style={{ 
                      color: '#667eea',
                      opacity: 0.7 
                    }} 
                  />
                </Group>
              </Paper>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Conta</Menu.Label>
              <Menu.Item leftSection={<IconUser size={14} />}>
                Perfil
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={14} />}>
                Configurações
              </Menu.Item>
              
              <Menu.Divider />
              
              <Menu.Item 
                color="red" 
                leftSection={<IconLogout size={14} />}
                onClick={logout}
              >
                Sair
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}