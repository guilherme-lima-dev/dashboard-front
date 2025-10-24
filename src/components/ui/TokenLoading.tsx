'use client';

import { useTokenReady } from '@/lib/hooks/useTokenReady';
import { Loader, Text, Center, Stack } from '@mantine/core';

interface TokenLoadingProps {
  children: React.ReactNode;
}

export function TokenLoading({ children }: TokenLoadingProps) {
  const isTokenReady = useTokenReady();

  if (!isTokenReady) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="violet" />
          <Text size="sm" c="dimmed">
            Preparando autenticação...
          </Text>
        </Stack>
      </Center>
    );
  }

  return <>{children}</>;
}
