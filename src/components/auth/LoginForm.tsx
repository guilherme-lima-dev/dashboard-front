'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { 
  Paper, 
  TextInput, 
  PasswordInput, 
  Button, 
  Stack, 
  Title, 
  Text, 
  Alert,
  LoadingOverlay
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuthStore } from '@/lib/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { login, setLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Usar apenas o login do store (que já chama authService internamente)
      await login(data);
      
      // Redirecionar para dashboard
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} />
      
      <Title order={2} ta="center" mb="md">
        Entrar
      </Title>
      
      <Text size="sm" c="dimmed" ta="center" mb="xl">
        Faça login para acessar o dashboard
      </Text>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Erro"
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="admin@analytics.com"
            {...register('email')}
            error={errors.email?.message}
            required
          />

          <PasswordInput
            label="Senha"
            placeholder="Admin@123"
            {...register('password')}
            error={errors.password?.message}
            required
          />

          <Button type="submit" fullWidth mt="md">
            Entrar
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
