'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Box,
  Alert,
  Anchor
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconMail, IconLock, IconUser } from '@tabler/icons-react';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { register } = useAuth();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !fullName || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (fullName.length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (!validatePassword(password)) {
      setError('Senha deve conter letra maiúscula, minúscula, número e caractere especial');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      await register(email, fullName, password);
      setSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

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
          <Stack gap="lg">
            <Box ta="center">
              <Title order={2} fw={600} c="dark" mb="xs">
                Criar conta 🚀
              </Title>
              <Text size="sm" c="dimmed">
                Preencha os dados para criar sua conta
              </Text>
            </Box>

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}

            {success && (
              <Alert icon={<IconCheck size={16} />} color="green" variant="light">
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Nome completo"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftSection={<IconUser size={16} />}
                  required
                  radius="md"
                  size="md"
                />

                <TextInput
                  label="Email"
                  placeholder="seu@email.com"
                  type="email"
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

                <PasswordInput
                  label="Confirmar senha"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  required
                  radius="md"
                  size="md"
                />

                <Text size="xs" c="dimmed">
                  A senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.
                </Text>

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  radius="md"
                  color="purple"
                  loading={loading}
                >
                  Criar conta
                </Button>

                <Text ta="center" size="sm">
                  Já tem uma conta?{' '}
                  <Anchor 
                    href="/login" 
                    c="purple"
                  >
                    Fazer login
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem',
        }}
      >
        {/* Elementos decorativos */}
        <Box
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            transform: 'rotate(45deg)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            transform: 'rotate(-15deg)',
          }}
        />

        {/* Conteúdo principal */}
        <Box style={{ textAlign: 'center', zIndex: 1, maxWidth: '400px' }}>
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={200}
            height={200}
            style={{
              marginBottom: '2rem',
              borderRadius: '12px',
              objectFit: 'contain',
            }}
          />
          <Title order={2} c="white" mb="md" fw={600}>
            Junte-se à nossa plataforma
          </Title>
          <Text 
            size="md" 
            c="rgba(255, 255, 255, 0.8)"
            style={{ lineHeight: 1.6 }}
          >
            Crie sua conta e tenha acesso a todas as funcionalidades da nossa plataforma de gestão.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}