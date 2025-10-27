'use client';

import { useState } from 'react';
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
  Paper
} from '@mantine/core';
import { 
  IconUser, 
  IconSettings, 
  IconLogout, 
  IconBell,
  IconChevronDown
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';

interface TopbarProps {
  currency: 'USD' | 'BRL';
  onCurrencyChange: (currency: 'USD' | 'BRL') => void;
}

export default function Topbar({ currency, onCurrencyChange }: TopbarProps) {
  const [exchangeRate] = useState(5.43);
  const { logout, user } = useAuth();

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
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Moeda:
            </Text>
            <Select
              value={currency}
              onChange={(value) => onCurrencyChange(value as 'USD' | 'BRL')}
              data={[
                { value: 'USD', label: 'USD' },
                { value: 'BRL', label: 'BRL' }
              ]}
              size="sm"
              w={80}
            />
            {currency === 'BRL' && (
              <Badge variant="light" color="blue" size="sm">
                1 USD = R$ {exchangeRate.toFixed(2)}
              </Badge>
            )}
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