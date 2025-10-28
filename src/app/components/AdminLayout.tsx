'use client';

import { useState, ReactNode } from 'react';
import { AppShell } from '@mantine/core';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useCurrency } from '../contexts/CurrencyContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { currency, setCurrency } = useCurrency();
  const [mobileOpened, setMobileOpened] = useState(false);
  const [desktopOpened, setDesktopOpened] = useState(true);

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
      <Topbar 
        currency={currency} 
        onCurrencyChange={setCurrency} 
      />
      
      <Sidebar 
        expanded={desktopOpened}
        onToggle={() => setDesktopOpened(!desktopOpened)}
      />

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}