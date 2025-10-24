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
import { apiClient } from '@/lib/api/client';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Senha deve conter letra maiúscula, minúscula, número e caractere especial'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const { login, setLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiClient.register(data);
      
      login(response.user, response.accessToken, response.refreshToken);
      
      // Redirecionar para dashboard
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} />
      
      <Title order={2} ta="center" mb="md">
        Criar Conta
      </Title>
      
      <Text size="sm" c="dimmed" ta="center" mb="xl">
        Crie sua conta para acessar o dashboard
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
            label="Nome Completo"
            placeholder="Seu nome completo"
            {...register('fullName')}
            error={errors.fullName?.message}
            required
          />

          <TextInput
            label="Email"
            placeholder="seu@email.com"
            {...register('email')}
            error={errors.email?.message}
            required
          />

          <PasswordInput
            label="Senha"
            placeholder="Sua senha"
            {...register('password')}
            error={errors.password?.message}
            required
          />


          <Button type="submit" fullWidth mt="md">
            Criar Conta
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
