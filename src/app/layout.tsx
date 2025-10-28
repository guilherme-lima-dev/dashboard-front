import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript } from '@mantine/core';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import ClientMantineProvider from './components/ClientMantineProvider';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Appyon Dashboard',
  description: 'Dashboard de Analytics e Métricas',
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={inter.className}>
        <ClientMantineProvider>
          <AuthProvider>
            <CurrencyProvider>
              <AnalyticsProvider>
                {children}
              </AnalyticsProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ClientMantineProvider>
      </body>
    </html>
  );
}
