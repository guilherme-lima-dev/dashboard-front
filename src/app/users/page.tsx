'use client';

import { Container, Title, Text, Stack, Group, Card, Button, TextInput, Select, Modal, Textarea } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import { UsersTable } from '@/components/users/UsersTable';
import { UserStats } from '@/components/users/UserStats';
import { IconSearch, IconFilter, IconRefresh, IconUserPlus } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';

export default function UsersPage() {
  const { isClient } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

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

  return (
    <AppLayout>
      <Container size="xl">
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} c="gray.8" mb="xs" style={{
                fontSize: '2rem',
                fontWeight: '600'
              }}>
                Gestão de Usuários
              </Title>
              <Text size="lg" c="gray.6">
                Gerencie os usuários da sua plataforma
              </Text>
            </div>
            <Button
              leftSection={<IconUserPlus size={16} />}
              variant="filled"
              color="lilac"
              onClick={() => setCreateModalOpen(true)}
              size="sm"
            >
              Adicionar Usuário
            </Button>
          </Group>

          <UserStats />

          <Card padding="xl" radius="lg">
            <Group mb="lg" wrap="wrap">
              <TextInput
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                style={{ flex: 1, minWidth: 200 }}
              />
              <Select
                placeholder="Filtrar por função"
                data={['admin', 'manager', 'user', 'viewer']}
                value={roleFilter}
                onChange={setRoleFilter}
                leftSection={<IconFilter size={16} />}
                clearable
                style={{ minWidth: 150 }}
              />
              <Select
                placeholder="Filtrar por status"
                data={['active', 'inactive', 'pending']}
                value={statusFilter}
                onChange={setStatusFilter}
                leftSection={<IconFilter size={16} />}
                clearable
                style={{ minWidth: 150 }}
              />
              <Button
                leftSection={<IconRefresh size={16} />}
                variant="light"
                color="lilac"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter(null);
                  setStatusFilter(null);
                }}
                size="sm"
              >
                Limpar Filtros
              </Button>
            </Group>

            <UsersTable 
              searchTerm={searchTerm} 
              roleFilter={roleFilter} 
              statusFilter={statusFilter} 
            />
          </Card>
        </Stack>
      </Container>

      <Modal 
        opened={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        title="Adicionar Novo Usuário" 
        centered
        size="md"
      >
        <Stack>
          <TextInput label="Nome Completo" placeholder="Nome do usuário" required />
          <TextInput label="Email" placeholder="email@exemplo.com" required type="email" />
          <Select
            label="Função"
            placeholder="Selecione a função"
            data={['admin', 'manager', 'user', 'viewer']}
            required
          />
          <Textarea label="Observações" placeholder="Informações adicionais" rows={3} />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button color="lilac" onClick={() => setCreateModalOpen(false)}>
              Adicionar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppLayout>
  );
}