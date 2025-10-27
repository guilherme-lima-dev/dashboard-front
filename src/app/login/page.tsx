'use client';

import { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Group, 
  Stack, 
  Checkbox, 
  Anchor,
  Box,
  Alert,
  LoadingOverlay
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login, forgotPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await forgotPassword(forgotEmail);
      setSuccessMessage('Link de recuperação enviado para seu email!');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error: any) {
      setError(error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Lado esquerdo - Formulário */}
        <Container
          size="sm"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '2rem',
          }}
        >
          <Paper
            p="xl"
            radius="lg"
            style={{
              width: '100%',
              maxWidth: 400,
              position: 'relative',
            }}
            shadow="none"
          >
            <LoadingOverlay visible={isLoading} />
            
            <Stack gap="lg">
              <Box ta="center">
                <Title order={2} fw={600} c="dark" mb="xs">
                  Recuperar Senha
                </Title>
                <Text size="sm" c="dimmed">
                  Digite seu email para receber o link de recuperação
                </Text>
              </Box>

              {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleForgotPassword}>
                <Stack gap="md">
                  <TextInput
                    label="Email"
                    placeholder="seu@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    leftSection={<IconMail size={16} />}
                    required
                    radius="md"
                    size="md"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="md"
                    radius="md"
                    color="purple"
                    loading={isLoading}
                  >
                    Enviar Link de Recuperação
                  </Button>

                  <Text ta="center" size="sm">
                    <Anchor
                      component="button"
                      type="button"
                      c="purple"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Voltar ao Login
                    </Anchor>
                  </Text>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Container>

        {/* Lado direito - Ilustração */}
        <Box
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Box
            style={{
              width: '80%',
              height: '80%',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="xl" c="white" fw={600}>
              Recuperação de Senha
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Lado esquerdo - Formulário */}
      <Container
        size="sm"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '2rem',
        }}
      >
        <Paper
          p="xl"
          radius="lg"
          style={{
            width: '100%',
            maxWidth: 400,
            position: 'relative',
          }}
          shadow="none"
        >
          <LoadingOverlay visible={isLoading} />
          
          <Stack gap="lg">
            <Box ta="center">
              <Title order={2} fw={600} c="dark" mb="xs">
                Bem-vindo de volta 👋
              </Title>
              <Text size="sm" c="dimmed">
                Por favor, insira seus dados
              </Text>
            </Box>

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert color="green" variant="light">
                {successMessage}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  required
                  radius="md"
                  size="md"
                />

                <PasswordInput
                  label="Senha"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  required
                  radius="md"
                  size="md"
                />

                <Group justify="space-between">
                  <Checkbox
                    label="Lembrar por 30 dias"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.currentTarget.checked)}
                    size="sm"
                  />
                  <Anchor
                    component="button"
                    type="button"
                    size="sm"
                    c="purple"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Esqueceu a senha?
                  </Anchor>
                </Group>

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  radius="md"
                  color="dark"
                  loading={isLoading}
                  style={{
                    backgroundColor: '#2d3748',
                    '&:hover': {
                      backgroundColor: '#1a202c',
                    },
                  }}
                >
                  Entrar
                </Button>

                <Text ta="center" size="sm">
                  Não tem uma conta?{' '}
                  <Anchor 
                    href="/register" 
                    fw={500}
                    style={{ color: '#5c7cfa', textDecoration: 'none' }}
                  >
                    Cadastre-se
                  </Anchor>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>

      {/* Lado direito - Logo Principal */}
      <Box
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '2rem',
        }}
      >
        <Box
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Logo Principal - Centralizada e Grande */}
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              zIndex: 2,
            }}
          >
            <Image
              src="/logo.jpg"
              alt="Logo da Empresa"
              width={200}
              height={200}
              style={{
                borderRadius: '20px',
                objectFit: 'cover',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                border: '4px solid rgba(255, 255, 255, 0.2)',
              }}
            />
            <Text size="xl" fw={700} c="white" ta="center">
              Dashboard Administrativo
            </Text>
            <Text size="md" c="rgba(255, 255, 255, 0.8)" ta="center">
              Sistema de Gestão e Controle
            </Text>
          </Box>

          {/* Elementos decorativos de fundo */}
          <Box
            style={{
              position: 'absolute',
              top: '10%',
              right: '15%',
              width: '60px',
              height: '20px',
              backgroundColor: 'rgba(255, 107, 53, 0.7)',
              borderRadius: '10px',
              transform: 'rotate(15deg)',
              zIndex: 1,
            }}
          />
          
          <Box
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '10%',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(78, 205, 196, 0.7)',
              borderRadius: '50%',
              zIndex: 1,
            }}
          />

          <Box
            style={{
              position: 'absolute',
              top: '25%',
              left: '8%',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              zIndex: 1,
            }}
          />

          <Box
            style={{
              position: 'absolute',
              bottom: '25%',
              right: '8%',
              width: '100px',
              height: '60px',
              backgroundColor: 'rgba(255, 71, 87, 0.7)',
              borderRadius: '8px',
              transform: 'rotate(-10deg)',
              zIndex: 1,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}