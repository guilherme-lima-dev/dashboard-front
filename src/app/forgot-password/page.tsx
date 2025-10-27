'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Anchor,
  Alert,
  Box,
  Image,
  Stack,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconMail, IconCheck, IconX } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { forgotPassword } = useAuth();
  const router = useRouter();

  const validateEmail = (value: string) => {
    if (!value) return 'Email é obrigatório';
    if (!/^\S+@\S+$/.test(value)) return 'Email inválido';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    
    setEmailError('');
    setLoading(true);
    
    try {
      await forgotPassword(email);
      setEmailSent(true);
      notifications.show({
        title: 'Email enviado!',
        message: 'Verifique sua caixa de entrada para redefinir sua senha.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error: any) {
      notifications.show({
        title: 'Erro',
        message: error.message || 'Erro ao enviar email de recuperação',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container size={420} my={40}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{
            backgroundColor: 'white',
            border: 'none',
          }}
        >
          <Stack align="center" mb={30}>
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={80}
              height={80}
              style={{ borderRadius: '12px' }}
            />
            <Title
              order={2}
              style={{
                fontWeight: 600,
                color: '#2d3748',
                textAlign: 'center',
              }}
            >
              Recuperar Senha
            </Title>
            <Text
              c="dimmed"
              size="sm"
              ta="center"
              style={{ maxWidth: 300 }}
            >
              {emailSent
                ? 'Enviamos um link de recuperação para seu email'
                : 'Digite seu email para receber um link de recuperação'}
            </Text>
          </Stack>

          {emailSent ? (
            <Stack>
              <Alert
                icon={<IconMail size={16} />}
                title="Email enviado!"
                color="green"
                variant="light"
              >
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </Alert>
              
              <Group justify="space-between" mt="lg">
                <Anchor
                  component="button"
                  type="button"
                  c="dimmed"
                  onClick={() => router.push('/login')}
                  size="xs"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <IconArrowLeft size={12} />
                  Voltar ao login
                </Anchor>
                
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                    setEmailError('');
                  }}
                >
                  Enviar novamente
                </Button>
              </Group>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                radius="md"
                size="md"
                styles={{
                  input: {
                    backgroundColor: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    '&:focus': {
                      borderColor: '#667eea',
                      backgroundColor: 'white',
                    },
                  },
                }}
              />

              <Button
                fullWidth
                mt="xl"
                size="md"
                radius="md"
                loading={loading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  },
                }}
                type="submit"
              >
                Enviar Link de Recuperação
              </Button>

              <Group justify="center" mt="lg">
                <Anchor
                  component="button"
                  type="button"
                  c="dimmed"
                  onClick={() => router.push('/login')}
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <IconArrowLeft size={14} />
                  Voltar ao login
                </Anchor>
              </Group>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}