'use client';

import { useState } from 'react';
import { AppShell, Stack, Title, Text } from '@mantine/core';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import KPICards from './KPICards';
import DashboardFilters from './DashboardFilters';
import DashboardCharts from './DashboardCharts';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Dashboard() {
  const { currency } = useCurrency();
  const [mobileOpened, setMobileOpened] = useState(false);
  const [desktopOpened, setDesktopOpened] = useState(true);
  const [filters, setFilters] = useState({
    platform: 'all',
    dateRange: 'last30days',
    acquisitionChannel: 'all'
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <Topbar />
      
      <Sidebar 
        expanded={desktopOpened}
        onToggle={() => setDesktopOpened(!desktopOpened)}
      />

      <AppShell.Main>
        <Stack gap="md">
          <DashboardFilters onFiltersChange={handleFiltersChange} />

          <KPICards />

          <DashboardCharts currency={currency} />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}