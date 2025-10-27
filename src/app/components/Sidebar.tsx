'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  AppShell, 
  NavLink, 
  Stack, 
  ActionIcon, 
  Group, 
  Text,
  Divider,
  Box,
  Tooltip,
  Collapse
} from '@mantine/core';
import { 
  IconDashboard,
  IconUsers,
  IconSettings,
  IconReport,
  IconDatabase,
  IconChevronLeft,
  IconChevronRight,
  IconUsersGroup,
  IconTarget,
  IconBrandGoogleAnalytics,
  IconChevronDown,
  IconChevronUp,
  IconShield,
  IconList
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

interface SubmenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  active?: boolean;
  hasSubmenu?: boolean;
  submenu?: SubmenuItem[];
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const menuItems: MenuCategory[] = [
  {
    category: 'Principal',
    items: [
      { 
        icon: IconDashboard, 
        label: 'Dashboard', 
        href: '/dashboard'
      },
      { 
        icon: IconReport, 
        label: 'Relatórios', 
        href: '/reports' 
      },
      { 
        icon: IconUsersGroup, 
        label: 'Coortes', 
        href: '/cohorts' 
      },
      { 
        icon: IconTarget, 
        label: 'Cenários', 
        href: '/scenarios' 
      },
    ]
  },
  {
    category: 'Gestão',
    items: [
      { 
        icon: IconUsers, 
        label: 'Usuários', 
        href: '/users',
        hasSubmenu: true,
        submenu: [
          {
            label: 'Lista de Usuários',
            href: '/users',
            icon: IconList
          },
          {
            label: 'Roles',
            href: '/users/roles',
            icon: IconShield
          }
        ]
      },
      { 
        icon: IconBrandGoogleAnalytics, 
        label: 'Clientes', 
        href: '/clients' 
      },
      { 
        icon: IconDatabase, 
        label: 'Integrações', 
        href: '/integrations' 
      },
    ]
  },
  {
    category: 'Sistema',
    items: [
      { 
        icon: IconSettings, 
        label: 'Configurações', 
        href: '/settings' 
      },
    ]
  }
];

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const { isAdmin } = useAuth();
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    return pathname === href;
  };

  const hasActiveSubmenuItem = (submenu?: SubmenuItem[]) => {
    if (!submenu) return false;
    return submenu.some(item => isItemActive(item.href));
  };

  const isMenuActive = (item: MenuItem) => {
    if (isItemActive(item.href)) return true;
    if (item.submenu) return hasActiveSubmenuItem(item.submenu);
    return false;
  };

  useEffect(() => {
    const activeSubmenus: string[] = [];
    
    menuItems.forEach(category => {
      category.items.forEach(item => {
        if (item.hasSubmenu && hasActiveSubmenuItem(item.submenu)) {
          activeSubmenus.push(item.label);
        }
      });
    });

    setOpenSubmenus(prev => {
      const newSubmenus = [...new Set([...prev, ...activeSubmenus])];
      return newSubmenus;
    });
  }, [pathname]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => {
      const newSubmenus = prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label];
      
      const activeSubmenus: string[] = [];
      menuItems.forEach(category => {
        category.items.forEach(item => {
          if (item.hasSubmenu && hasActiveSubmenuItem(item.submenu)) {
            activeSubmenus.push(item.label);
          }
        });
      });
      
      return [...new Set([...newSubmenus, ...activeSubmenus])];
    });
  };

  return (
    <AppShell.Navbar p="md">
      <Stack gap="md" h="100%">
        <Group justify="space-between" mb="md">
          {expanded && (
            <Text fw={700} size="lg" c="purple.6">
              Analytics
            </Text>
          )}
          <ActionIcon
            variant="subtle"
            color="purple"
            onClick={onToggle}
            size="sm"
          >
            {expanded ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
          </ActionIcon>
        </Group>

        <Stack gap="lg" style={{ flex: 1 }}>
          {menuItems.map((category, categoryIndex) => {
            if (category.category === 'Gestão' && !isAdmin()) {
              return null;
            }
            
            return (
              <Box key={categoryIndex}>
                {expanded && (
                  <Text 
                    size="xs" 
                    fw={600} 
                    tt="uppercase" 
                    c="dimmed" 
                    mb="xs"
                    px="xs"
                  >
                    {category.category}
                  </Text>
                )}
                
                <Stack gap="xs">
                  {category.items.map((item, itemIndex) => {
                    const IconComponent = item.icon;
                    const hasSubmenu = item.hasSubmenu && expanded;
                    const isSubmenuOpen = openSubmenus.includes(item.label);
                  
                  if (!expanded) {
                    return (
                      <Tooltip 
                        key={itemIndex}
                        label={item.label}
                        position="right"
                        withArrow
                      >
                        <NavLink
                          href={item.href}
                          active={isMenuActive(item)}
                          leftSection={<IconComponent size={20} stroke={1.5} />}
                          styles={{
                            root: {
                              borderRadius: '8px',
                              padding: '12px',
                              justifyContent: 'center',
                            }
                          }}
                        />
                      </Tooltip>
                    );
                  }

                  return (
                    <Box key={itemIndex}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        active={isMenuActive(item)}
                        leftSection={<IconComponent size={20} stroke={1.5} />}
                        rightSection={hasSubmenu ? (
                          isSubmenuOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                        ) : undefined}
                        onClick={hasSubmenu ? (e) => {
                          e.preventDefault();
                          toggleSubmenu(item.label);
                        } : undefined}
                        styles={{
                          root: {
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontWeight: 500,
                          }
                        }}
                      />
                      
                      {hasSubmenu && (
                        <Collapse in={isSubmenuOpen}>
                          <Stack gap="xs" mt="xs" ml="md">
                            {item.submenu?.map((subItem, subIndex) => {
                              const SubIconComponent = subItem.icon;
                              const isSubItemActive = isItemActive(subItem.href);
                              return (
                                <NavLink
                                  key={subIndex}
                                  href={subItem.href}
                                  label={subItem.label}
                                  active={isSubItemActive}
                                  leftSection={SubIconComponent ? <SubIconComponent size={16} stroke={1.5} /> : undefined}
                                  styles={{
                                    root: {
                                      borderRadius: '6px',
                                      padding: '8px 12px',
                                      fontSize: '14px',
                                      backgroundColor: isSubItemActive ? 'var(--mantine-color-blue-light)' : 'transparent',
                                      color: isSubItemActive ? 'var(--mantine-color-blue-filled)' : 'inherit',
                                      '&:hover': {
                                        backgroundColor: 'var(--mantine-color-gray-1)',
                                      }
                                    },
                                    label: {
                                      color: isSubItemActive ? 'var(--mantine-color-blue-filled)' : 'inherit',
                                      fontWeight: isSubItemActive ? 600 : 400,
                                    }
                                  }}
                                />
                              );
                            })}
                          </Stack>
                        </Collapse>
                      )}
                    </Box>
                  );
                })}
              </Stack>
              
              {categoryIndex < menuItems.length - 1 && expanded && (
                <Divider my="md" color="gray.2" />
              )}
            </Box>
            );
          })}
        </Stack>

        {expanded && (
          <Box 
            p="md" 
            style={{ 
              backgroundColor: '#f8f6ff', 
              borderRadius: '8px',
              border: '1px solid #e9e4ff'
            }}
          >
            <Text size="xs" c="dimmed" ta="center">
              Dashboard v1.0
            </Text>
            <Text size="xs" c="purple.6" ta="center" fw={500}>
              Analytics Platform
            </Text>
          </Box>
        )}
      </Stack>
    </AppShell.Navbar>
  );
}