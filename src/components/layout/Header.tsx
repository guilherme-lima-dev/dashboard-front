'use client';

import { Group, Text, Button, Badge, ActionIcon, Menu, Avatar, UnstyledButton } from '@mantine/core';
import { IconBell, IconLogout, IconSettings } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout, isClient } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Renderizar apenas no cliente para evitar hydration mismatch
  if (!isClient) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Group justify="space-between" align="center">
          <Group>
            <Button
              variant="subtle"
              color="gray"
              size="sm"
              style={{ borderRadius: '8px' }}
            >
              ☰ Menu
            </Button>
            <Text fw={600} size="lg" c="purple">
              Analytics Platform
            </Text>
          </Group>
          <Group>
            <Badge color="green" variant="light" size="sm">
              Online
            </Badge>
            <Avatar size="sm" color="purple">
              U
            </Avatar>
          </Group>
        </Group>
      </div>
    );
  }

  return (
    <div 
      className="glass fade-in"
      style={{
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(147, 51, 234, 0.1)'
      }}
    >
      <Group justify="space-between" align="center">
        {/* Left side - Logo and Menu Button */}
        <Group>
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            onClick={onMenuToggle}
            style={{ 
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                color: '#9333ea'
              }
            }}
          >
            ☰ Menu
          </Button>
          <Text fw={600} size="lg" c="purple">
            Analytics Platform
          </Text>
        </Group>

        {/* Right side - User info and actions */}
        <Group>
          <Badge color="green" variant="light" size="sm">
            Online
          </Badge>
          
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            style={{
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                color: '#9333ea'
              }
            }}
          >
            <IconBell size={18} />
          </ActionIcon>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Avatar size="sm" color="purple">
                  {user?.fullName?.charAt(0) || 'U'}
                </Avatar>
                <div>
                  <Text size="sm" fw={500}>
                    {user?.fullName || 'Usuário'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user?.email}
                  </Text>
                </div>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Conta</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Configurações
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                color="red" 
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                Sair
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </div>
  );
}
