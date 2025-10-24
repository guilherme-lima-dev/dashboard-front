'use client';

import { useState } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  Table, 
  Group, 
  Badge, 
  Checkbox,
  Stack,
  TextInput,
  Select,
  Alert
} from '@mantine/core';
import { 
  IconSearch,
  IconShield,
  IconInfoCircle
} from '@tabler/icons-react';
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES } from '@/types/permissions';

export function PermissionsMatrix() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string>('');

  // Filtrar permissões
  const filteredPermissions = SYSTEM_PERMISSIONS.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || permission.category === selectedCategory;
    const matchesResource = !selectedResource || permission.resource === selectedResource;
    
    return matchesSearch && matchesCategory && matchesResource;
  });

  // Obter categorias únicas
  const categories = Array.from(new Set(SYSTEM_PERMISSIONS.map(p => p.category)));
  
  // Obter recursos únicos
  const resources = Array.from(new Set(SYSTEM_PERMISSIONS.map(p => p.resource)));

  // Verificar se role tem permissão
  const roleHasPermission = (roleId: string, permissionId: string): boolean => {
    const role = SYSTEM_ROLES.find(r => r.id === roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  const rows = filteredPermissions.map((permission) => (
    <Table.Tr key={permission.id}>
      <Table.Td>
        <Stack gap="xs">
          <Text fw={500} size="sm">{permission.name}</Text>
          <Text size="xs" c="dimmed">{permission.description}</Text>
          <Group gap="xs">
            <Badge size="xs" color="blue" variant="light">
              {permission.resource}
            </Badge>
            <Badge size="xs" color="green" variant="light">
              {permission.action}
            </Badge>
            <Badge size="xs" color="purple" variant="light">
              {permission.category}
            </Badge>
          </Group>
        </Stack>
      </Table.Td>
      
      {SYSTEM_ROLES.map((role) => (
        <Table.Td key={role.id} style={{ textAlign: 'center' }}>
          <Checkbox
            checked={roleHasPermission(role.id, permission.id)}
            disabled={role.isSystem}
            size="sm"
            color="blue"
          />
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Stack gap="md">
      {/* Header */}
      <div>
        <Title order={3}>Matriz de Permissões</Title>
        <Text c="dimmed" size="sm">
          Visualize e gerencie as permissões de cada role
        </Text>
      </div>

      {/* Filtros */}
      <Card>
        <Stack gap="md">
          <Group grow>
            <TextInput
              placeholder="Buscar permissões..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              placeholder="Filtrar por categoria"
              data={categories.map(cat => ({ value: cat, label: cat }))}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value || '')}
              clearable
            />
            
            <Select
              placeholder="Filtrar por recurso"
              data={resources.map(res => ({ value: res, label: res }))}
              value={selectedResource}
              onChange={(value) => setSelectedResource(value || '')}
              clearable
            />
          </Group>
        </Stack>
      </Card>

      {/* Informações */}
      <Alert color="blue" title="Como usar" icon={<IconInfoCircle size={16} />}>
        <Text size="sm">
          Esta matriz mostra quais permissões cada role possui. 
          Roles do sistema (marcadas com 🔒) não podem ser editadas.
          Use os filtros para encontrar permissões específicas.
        </Text>
      </Alert>

      {/* Tabela de Permissões */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ minWidth: 300 }}>Permissão</Table.Th>
                {SYSTEM_ROLES.map((role) => (
                  <Table.Th key={role.id} style={{ textAlign: 'center', minWidth: 120 }}>
                    <Stack gap="xs" align="center">
                      <Text fw={500} size="sm">{role.name}</Text>
                      {role.isSystem && (
                        <Badge size="xs" color="blue" variant="light">
                          🔒 Sistema
                        </Badge>
                      )}
                    </Stack>
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </Card>

      {/* Estatísticas */}
      <Card>
        <Group justify="space-between">
          <div>
            <Text fw={500}>Total de Permissões</Text>
            <Text size="lg" c="blue">{filteredPermissions.length}</Text>
          </div>
          <div>
            <Text fw={500}>Total de Roles</Text>
            <Text size="lg" c="green">{SYSTEM_ROLES.length}</Text>
          </div>
          <div>
            <Text fw={500}>Categorias</Text>
            <Text size="lg" c="purple">{categories.length}</Text>
          </div>
        </Group>
      </Card>
    </Stack>
  );
}
