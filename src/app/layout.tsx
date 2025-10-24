import type { Metadata } from "next";
import { Providers } from './providers';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "Analytics Platform",
  description: "Dashboard de Analytics para Plataforma de Assinaturas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
