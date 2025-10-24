'use client';

import { Box, Group, Text, NavLink, Avatar, UnstyledButton, Stack } from '@mantine/core';
import { 
  IconDashboard, 
  IconChartBar, 
  IconUsers, 
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconX
} from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/' },
  { label: 'Analytics', icon: IconChartBar, href: '/analytics' },
  { label: 'Usuários', icon: IconUsers, href: '/users' },
  { label: 'Configurações', icon: IconSettings, href: '/settings' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout, isClient } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Não renderizar durante SSR para evitar hydration mismatch
  if (!isClient) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
        }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <Box
        className="slide-in"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          background: 'linear-gradient(180deg, #9333ea 0%, #7e22ce 100%)',
          zIndex: 999,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 20px rgba(147, 51, 234, 0.3)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Header */}
        <Group justify="space-between" mb="xl">
          <Group>
            <Box
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              AP
            </Box>
            <div>
              <Text fw={600} c="white" size="lg">
                Analytics
              </Text>
              <Text size="xs" c="dimmed">
                Platform
              </Text>
            </div>
          </Group>
          
          <UnstyledButton
            onClick={onClose}
            style={{
              color: '#a0a0a0',
              '&:hover': {
                color: '#9333ea'
              }
            }}
          >
            <IconX size={20} />
          </UnstyledButton>
        </Group>

        {/* Navigation */}
        <Stack gap="xs" style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={20} />}
              rightSection={<IconChevronRight size={16} />}
              styles={{
                root: {
                  borderRadius: '8px',
                  color: '#a0a0a0',
                  '&:hover': {
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    color: '#9333ea'
                  }
                }
              }}
            />
          ))}
        </Stack>

        {/* User Section */}
        <Box>
          <UnstyledButton
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              width: '100%',
              marginBottom: '16px',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <Avatar size="sm" color="purple">
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fw={500} c="white" truncate>
                {user?.fullName || 'Usuário'}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user?.email}
              </Text>
            </div>
          </UnstyledButton>

          <UnstyledButton
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              color: '#a0a0a0',
              width: '100%',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#9333ea'
              }
            }}
            onClick={handleLogout}
          >
            <IconLogout size={16} />
            <Text size="sm">Sair</Text>
          </UnstyledButton>
        </Box>
      </Box>
    </>
  );
}
