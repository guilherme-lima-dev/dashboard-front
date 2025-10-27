'use client';

import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../components/Dashboard';
import { LoadingOverlay, Box } from '@mantine/core';

export default function DashboardPage() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box style={{ position: 'relative', minHeight: '100vh' }}>
        <LoadingOverlay visible={true} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null; // O middleware de proteção de rota irá redirecionar
  }

  return <Dashboard />;
}