import Link from 'next/link';
import { Container, Title, Text, Button, Stack } from '@mantine/core';

export default function NotFound() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container size="sm" style={{ textAlign: 'center' }}>
        <Stack gap="xl">
          <div>
            <Title order={1} c="purple" size="4rem" fw={900}>
              404
            </Title>
            <Title order={2} c="dark" mb="md">
              Página não encontrada
            </Title>
            <Text size="lg" c="dimmed" mb="xl">
              A página que você está procurando não existe ou foi movida.
            </Text>
          </div>
          
          <Button
            component={Link}
            href="/"
            size="lg"
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
              border: 'none'
            }}
          >
            Voltar ao Dashboard
          </Button>
        </Stack>
      </Container>
    </div>
  );
}
