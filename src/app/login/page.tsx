import { Container, Center, Stack, Text, Anchor } from '@mantine/core';
import { LoginFormWrapper } from '@/components/auth/LoginFormWrapper';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <Container size="sm" py="xl">
        <Center>
          <Stack align="center" gap="md">
            <Text size="xl" fw={700} c="lilac">
              Analytics Platform
            </Text>
            
            <LoginFormWrapper />
            
            <Text size="sm" c="dimmed">
              Não tem uma conta?{' '}
              <Anchor component={Link} href="/register">
                Criar conta
              </Anchor>
            </Text>
          </Stack>
        </Center>
      </Container>
    </div>
  );
}
