# 🚀 Guia de Setup Técnico - Analytics Platform Frontend

## 📋 **PRÉ-REQUISITOS**

- ✅ **Node.js 18+** instalado
- ✅ **Git** configurado
- ✅ **VS Code** com extensões recomendadas
- ✅ **Backend funcionando** em `http://localhost:4000`

---

## 🎯 **FASE 1: SETUP INICIAL (2-3 dias)**

### **1.1 Criar Projeto Next.js**

```bash
# Criar projeto com configurações otimizadas
npx create-next-app@latest analytics-platform \
  --typescript \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --tailwind=false \
  --use-npm

cd analytics-platform
```

### **1.2 Instalar Dependências Mantine**

```bash
# Mantine Core
npm install @mantine/core @mantine/hooks @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/data-table

# Icons
npm install @tabler/icons-react

# State Management
npm install @tanstack/react-query zustand

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Charts
npm install recharts

# Utils
npm install dayjs clsx
```

### **1.3 Instalar Dev Dependencies**

```bash
# Testing
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# E2E Testing
npm install -D @playwright/test

# Types
npm install -D @types/node
```

### **1.4 Configurar Estrutura de Pastas**

```bash
# Criar estrutura completa
mkdir -p src/{app,components/{ui,charts,tables,forms,layouts,features},lib/{api,hooks,stores,utils,constants},types}

# Criar arquivos base
touch src/lib/theme.ts
touch src/lib/api/client.ts
touch src/lib/stores/auth.ts
touch src/types/{api,entities,components}.ts
```

---

## 🔧 **FASE 2: CONFIGURAÇÃO TÉCNICA**

### **2.1 Configurar Tema Mantine**

```typescript
// src/lib/theme.ts
import { createTheme, MantineColorsTuple } from '@mantine/core';

const purple: MantineColorsTuple = [
  '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc',
  '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'
];

const emerald: MantineColorsTuple = [
  '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80',
  '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'
];

const amber: MantineColorsTuple = [
  '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24',
  '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'
];

export const theme = createTheme({
  colors: { purple, emerald, amber },
  primaryColor: 'purple',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  headings: { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', fontWeight: '600' },
  defaultRadius: 'md',
  components: {
    Card: { defaultProps: { shadow: 'sm', withBorder: true } },
    Button: { defaultProps: { radius: 'md' } },
    DataTable: { defaultProps: { highlightOnHover: true, withTableBorder: true, withColumnBorders: true, striped: true } }
  }
});
```

### **2.2 Configurar Root Layout**

```typescript
// src/app/layout.tsx
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/lib/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
    mutations: { retry: 1 }
  }
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications />
              {children}
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### **2.3 Configurar API Client**

```typescript
// src/lib/api/client.ts
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshToken();
        return this.request(endpoint, options);
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async refreshToken() {
    // Implementation...
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getMe(): Promise<User> {
    return this.request('/auth/me');
  }

  // Analytics endpoints
  async getDashboard(filters: DashboardFilters): Promise<DashboardKPIs> {
    return this.request('/analytics/dashboard', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
```

### **2.4 Configurar Zustand Store**

```typescript
// src/lib/stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token, refreshToken) => {
        set({ user, token, refreshToken, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) || false;
      }
    }),
    { name: 'auth-storage' }
  )
);
```

### **2.5 Configurar Types**

```typescript
// src/types/api.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    permissions: string[];
  };
}

export interface DashboardKPIs {
  newSubscriptions: {
    count: number;
    revenue: number;
    change: string;
  };
  mrr: {
    value: number;
    activeCount: number;
    change: string;
  };
  arr: {
    value: number;
    change: string;
  };
  churnRate: {
    value: number;
    change: string;
  };
}

export interface DashboardFilters {
  period: '7d' | '30d' | '90d' | '1y';
  platform?: string;
  currency: 'BRL' | 'USD';
}
```

---

## 🧪 **FASE 3: CONFIGURAÇÃO DE TESTES**

### **3.1 Configurar Jest**

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
```

### **3.2 Configurar Playwright**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📦 **FASE 4: CONFIGURAÇÃO DE DEPLOY**

### **4.1 Configurar Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=Analytics Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### **4.2 Configurar Scripts**

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui"
  }
}
```

---

## ✅ **CHECKLIST DE VALIDAÇÃO**

### **Fase 1 - Setup:**
- [ ] `npm run dev` funciona sem erros
- [ ] TypeScript compila sem erros
- [ ] ESLint configurado e funcionando
- [ ] Estrutura de pastas criada
- [ ] Git configurado com .gitignore

### **Fase 2 - Configuração:**
- [ ] Mantine UI renderizando
- [ ] Tema customizado aplicado
- [ ] API client configurado
- [ ] Zustand store funcionando
- [ ] Types definidos

### **Fase 3 - Testes:**
- [ ] Jest configurado
- [ ] Playwright configurado
- [ ] Testes unitários rodando
- [ ] Testes E2E rodando

### **Fase 4 - Deploy:**
- [ ] Build de produção funcionando
- [ ] Environment variables configuradas
- [ ] Scripts funcionando

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Executar Fase 1** - Setup inicial
2. **Validar checklist** - Verificar se tudo funciona
3. **Implementar Fase 2** - Autenticação
4. **Seguir cronograma** - Fases 3-11

---

**Status**: ✅ **Guia de Setup Técnico Executável**

Este guia fornece passos exatos e executáveis para configurar o projeto frontend da Analytics Platform.
