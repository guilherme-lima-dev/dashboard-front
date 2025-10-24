'use client';

import { Container, Title, Text, Stack, Group, Card, Tabs, Button, Switch, TextInput, Select, Textarea, Divider, Badge } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import { IconSettings, IconBell, IconShield, IconPalette, IconDatabase, IconDeviceFloppy } from '@tabler/icons-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';

export default function SettingsPage() {
  const { isClient } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    weekly: true,
    monthly: false
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('pt-BR');

  const handleSaveSettings = () => {
    // Implementar salvamento das configurações
    console.log('Salvando configurações...');
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
                Configurações
              </Title>
              <Text size="lg" c="gray.6">
                Personalize sua experiência e gerencie preferências
              </Text>
            </div>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSaveSettings}
              color="lilac"
              size="sm"
            >
              Salvar Configurações
            </Button>
          </Group>

          <Card padding="xl" radius="lg">
            <Tabs defaultValue="general">
              <Tabs.List>
                <Tabs.Tab value="general" leftSection={<IconSettings size={18} />}>
                  Geral
                </Tabs.Tab>
                <Tabs.Tab value="notifications" leftSection={<IconBell size={18} />}>
                  Notificações
                </Tabs.Tab>
                <Tabs.Tab value="security" leftSection={<IconShield size={18} />}>
                  Segurança
                </Tabs.Tab>
                <Tabs.Tab value="appearance" leftSection={<IconPalette size={18} />}>
                  Aparência
                </Tabs.Tab>
                <Tabs.Tab value="integrations" leftSection={<IconDatabase size={18} />}>
                  Integrações
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="general" pt="xl">
                <Stack gap="md">
                  <TextInput label="Nome da Plataforma" placeholder="Analytics Platform" defaultValue="Analytics Platform" />
                  <TextInput label="Email de Contato" placeholder="contato@exemplo.com" defaultValue="admin@analytics.com" />
                  <Textarea label="Descrição" placeholder="Breve descrição da plataforma" defaultValue="Plataforma de analytics para gestão de assinaturas." autosize minRows={2} />
                  <Divider my="sm" />
                  <Group grow>
                    <TextInput label="Fuso Horário" placeholder="Ex: America/Sao_Paulo" defaultValue="America/Sao_Paulo" />
                    <Select
                      label="Idioma Padrão"
                      placeholder="Selecione o idioma"
                      data={['Português (Brasil)', 'English (US)']}
                      defaultValue="Português (Brasil)"
                    />
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="notifications" pt="xl">
                <Stack gap="md">
                  <Switch
                    label="Receber notificações por email"
                    checked={notifications.email}
                    onChange={(event) => setNotifications({...notifications, email: event.currentTarget.checked})}
                  />
                  <Switch
                    label="Notificações push no navegador"
                    checked={notifications.push}
                    onChange={(event) => setNotifications({...notifications, push: event.currentTarget.checked})}
                  />
                  <Switch
                    label="Notificações por SMS"
                    checked={notifications.sms}
                    onChange={(event) => setNotifications({...notifications, sms: event.currentTarget.checked})}
                  />
                  <Select
                    label="Frequência de relatórios"
                    placeholder="Selecione a frequência"
                    data={['Diário', 'Semanal', 'Mensal']}
                    defaultValue="Semanal"
                  />
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="security" pt="xl">
                <Stack gap="md">
                  <Switch
                    label="Autenticação de dois fatores (2FA)"
                    description="Adicione uma camada extra de segurança à sua conta"
                  />
                  <Button variant="outline" color="red" style={{ alignSelf: 'flex-start' }}>
                    Alterar Senha
                  </Button>
                  <Divider my="sm" />
                  <Text size="sm" c="dimmed">
                    Último login: 2025-01-22 14:30 (IP: 192.168.1.100)
                  </Text>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="appearance" pt="xl">
                <Stack gap="md">
                  <Select
                    label="Tema da Interface"
                    placeholder="Selecione o tema"
                    data={['Claro', 'Escuro', 'Sistema']}
                    value={theme}
                    onChange={setTheme}
                  />
                  <Group grow>
                    <TextInput label="Cor Primária" placeholder="#a855f7" defaultValue="#a855f7" />
                    <TextInput label="Cor Secundária" placeholder="#22c55e" defaultValue="#22c55e" />
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="integrations" pt="xl">
                <Stack gap="md">
                  <Text size="sm" c="dimmed">
                    Gerencie suas integrações com plataformas externas.
                  </Text>
                  <Button variant="outline" color="blue" style={{ alignSelf: 'flex-start' }}>
                    Conectar Nova Integração
                  </Button>
                  <Card withBorder radius="md" padding="md">
                    <Group justify="space-between">
                      <Text fw={500}>Stripe</Text>
                      <Badge color="green" variant="light">Conectado</Badge>
                    </Group>
                    <Text size="sm" c="dimmed" mt="xs">
                      Última sincronização: 2025-01-22 15:00
                    </Text>
                  </Card>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Stack>
      </Container>
    </AppLayout>
  );
}