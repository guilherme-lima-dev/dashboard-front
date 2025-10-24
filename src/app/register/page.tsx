import { Container, Center, Stack, Text, Anchor } from '@mantine/core';
import { RegisterFormWrapper } from '@/components/auth/RegisterFormWrapper';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <Container size="sm" py="xl">
        <Center>
          <Stack align="center" gap="md">
            <Text size="xl" fw={700} c="lilac">
              Analytics Platform
            </Text>
            
            <RegisterFormWrapper />
            
            <Text size="sm" c="dimmed">
              Já tem uma conta?{' '}
              <Anchor component={Link} href="/login">
                Fazer login
              </Anchor>
            </Text>
          </Stack>
        </Center>
      </Container>
    </div>
  );
}
