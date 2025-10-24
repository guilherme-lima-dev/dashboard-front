# 🎨 Guia de Desenvolvimento Frontend - Analytics Platform

## 📋 Visão Geral do Projeto

### **Contexto Atual**
- ✅ **Backend 100% funcional** com 73 endpoints implementados
- ✅ **8 fases completas** (Auth, Products, Integrations, Core Business, Analytics, Affiliates, Audit, Sync)
- ✅ **Sistema de autenticação** JWT com permissões granulares
- ✅ **Integração real** com Stripe funcionando
- ✅ **Analytics avançados** com métricas em tempo real
- ✅ **Sistema de afiliados** completo
- ✅ **Auditoria e logs** implementados

### **Objetivo do Frontend**
Criar uma **interface moderna e intuitiva** para a Analytics Platform que permita visualização e gestão completa dos dados de assinaturas multi-plataforma.

---

## 🚀 Stack Tecnológica Recomendada

### **Framework Principal**
```json
{
  "framework": "Next.js 14+ (App Router)",
  "react": "18+",
  "typescript": "5.x",
  "rendering": "CSR (Client-Side Rendering)"
}
```

**Justificativa:**
- ✅ **Next.js 14+** com App Router (decisão tomada)
- ✅ **TypeScript** para type safety
- ✅ **CSR** adequado para dashboard privado
- ✅ **Performance** otimizada com Turbopack

### **Gerenciamento de Estado**
```json
{
  "serverState": "TanStack Query (React Query)",
  "clientState": "Zustand",
  "persistence": "localStorage + sessionStorage"
}
```

**Justificativa:**
- ✅ **TanStack Query** para cache de API
- ✅ **Zustand** para estado global (mais simples que Redux)
- ✅ **Evita Context** para estado complexo

### **UI & Styling**
```json
{
  "css": "Mantine CSS-in-JS",
  "components": "Mantine UI",
  "icons": "Tabler Icons",
  "charts": "Recharts",
  "tables": "Mantine DataTable"
}
```

**Justificativa:**
- ✅ **Mantine UI** para componentes completos e acessíveis
- ✅ **CSS-in-JS** integrado com tema
- ✅ **Tabler Icons** para ícones consistentes
- ✅ **DataTable** nativo para tabelas avançadas
- ✅ **Recharts** para gráficos React-friendly

### **Formulários & Validação**
```json
{
  "forms": "React Hook Form + Mantine",
  "validation": "Zod",
  "datePicker": "Mantine DateRangePicker",
  "select": "Mantine Select"
}
```

**Justificativa:**
- ✅ **React Hook Form** para performance (melhor que Mantine Form)
- ✅ **Mantine components** para UI
- ✅ **Zod** para schemas de validação
- ✅ **Integração perfeita** entre as duas bibliotecas

### **Desenvolvimento**
```json
{
  "bundler": "Turbopack",
  "linting": "ESLint + Prettier",
  "testing": "Jest + React Testing Library",
  "e2e": "Playwright"
}
```

---

## 🏗️ Arquitetura do Projeto

### **Estrutura de Pastas**
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Dashboard principal
│   ├── analytics/         # Analytics e relatórios
│   ├── affiliates/        # Sistema de afiliados
│   ├── data/             # Gestão de dados
│   ├── audit/            # Sistema de auditoria
│   ├── settings/         # Configurações
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout raiz
│   └── page.tsx          # Home page
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Mantine customizados)
│   ├── charts/           # Componentes de gráficos
│   ├── tables/           # Componentes de tabelas
│   ├── forms/            # Componentes de formulários
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── hooks/                # Custom hooks
├── lib/                  # Utilities e configurações
│   ├── api/              # API client
│   ├── auth/             # Autenticação
│   ├── utils/            # Funções utilitárias
│   └── validations/      # Schemas Zod
├── stores/               # Estado global (Context)
├── types/                # Tipos TypeScript
└── constants/            # Constantes
```

### **Padrões de Componentes**

#### **1. Componentes Base (UI)**
```typescript
// components/ui/metric-card.tsx
import { Card, Text, Group, ThemeIcon, Badge } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color = 'blue',
  onClick 
}: MetricCardProps) {
  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Group justify="space-between" mb="xs">
        <Text size="sm" color="dimmed">{title}</Text>
        <ThemeIcon color={color} variant="light" size="lg">
          {icon}
        </ThemeIcon>
      </Group>
      
      <Text size="xl" fw={700} mb="xs">
        {value}
      </Text>
      
      {change && (
        <Group spacing="xs">
          {trend === 'up' ? (
            <IconTrendingUp size={16} color="green" />
          ) : (
            <IconTrendingDown size={16} color="red" />
          )}
          <Badge 
            color={trend === 'up' ? 'green' : 'red'} 
            variant="light"
            size="sm"
          >
            {trend === 'up' ? '+' : ''}{change}%
          </Badge>
        </Group>
      )}
    </Card>
  );
}
```

#### **2. Componentes de Feature**
```typescript
// components/features/dashboard/metrics-grid.tsx
import { Grid, Skeleton } from '@mantine/core';
import { MetricCard } from '@/components/ui/metric-card';
import { IconUsers, IconTrendingUp, IconDollarSign, IconTrendingDown } from '@tabler/icons-react';

interface MetricsGridProps {
  data: DashboardMetrics;
  currency: 'BRL' | 'USD';
  isLoading?: boolean;
}

const METRICS = [
  {
    key: 'newSubscriptions',
    title: 'Novas Assinaturas',
    icon: IconUsers,
    color: 'blue'
  },
  {
    key: 'mrr',
    title: 'MRR',
    icon: IconTrendingUp,
    color: 'green'
  },
  {
    key: 'arr',
    title: 'ARR',
    icon: IconDollarSign,
    color: 'purple'
  },
  {
    key: 'churnRate',
    title: 'Taxa de Churn',
    icon: IconTrendingDown,
    color: 'red'
  }
] as const;

export function MetricsGrid({ data, currency, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <Grid>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
            <Skeleton height={120} radius="md" />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  return (
    <Grid>
      {METRICS.map((metric) => (
        <Grid.Col key={metric.key} span={{ base: 12, sm: 6, md: 3 }}>
          <MetricCard
            title={metric.title}
            value={formatValue(data[metric.key], currency)}
            change={data[`${metric.key}Change`]}
            trend={data[`${metric.key}Trend`]}
            icon={<metric.icon size={24} />}
            color={metric.color}
            onClick={() => navigateToAnalytics(metric.key)}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}
```

#### **3. Custom Hooks**
```typescript
// hooks/use-analytics.ts
export function useAnalytics(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsApi.getDashboard(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
}

// hooks/use-auth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 🎨 Design System

### **Tema Mantine (Baseado no Design Analytics)**
```typescript
// lib/theme.ts
import { createTheme, MantineColorsTuple } from '@mantine/core';

// Cores principais baseadas no design dos PDFs
const purple: MantineColorsTuple = [
  '#faf5ff',
  '#f3e8ff',
  '#e9d5ff',
  '#d8b4fe',
  '#c084fc',
  '#a855f7', // primary
  '#9333ea', // primary-dark
  '#7e22ce',
  '#6b21a8',
  '#581c87'
];

const emerald: MantineColorsTuple = [
  '#f0fdf4',
  '#dcfce7',
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#22c55e', // secondary
  '#16a34a',
  '#15803d',
  '#166534',
  '#14532d'
];

const amber: MantineColorsTuple = [
  '#fffbeb',
  '#fef3c7',
  '#fde68a',
  '#fcd34d',
  '#fbbf24',
  '#f59e0b', // accent
  '#d97706',
  '#b45309',
  '#92400e',
  '#78350f'
];

export const theme = createTheme({
  colors: {
    purple,
    emerald,
    amber,
  },
  primaryColor: 'purple',
  primaryShade: 6, // #9333ea - cor principal do design
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  components: {
    Card: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    DataTable: {
      defaultProps: {
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: true,
        striped: true,
      },
    },
  },
});
```

### **Componentes Base**

#### **Buttons**
```typescript
// Mantine Button com variantes customizadas
import { Button, ButtonProps } from '@mantine/core';

interface CustomButtonProps extends ButtonProps {
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

export function CustomButton({ 
  variant = 'filled', 
  size = 'md', 
  loading, 
  children, 
  ...props 
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      {...props}
    >
      {children}
    </Button>
  );
}
```

#### **Cards**
```typescript
// Mantine Card com variantes
import { Card, CardProps } from '@mantine/core';

interface CustomCardProps extends CardProps {
  variant?: 'default' | 'elevated' | 'bordered';
}

export function CustomCard({ 
  variant = 'default', 
  children, 
  ...props 
}: CustomCardProps) {
  const variantProps = {
    default: { shadow: 'sm', withBorder: true },
    elevated: { shadow: 'lg', withBorder: true },
    bordered: { shadow: 'xs', withBorder: true, style: { borderWidth: 2 } }
  };

  return (
    <Card {...variantProps[variant]} {...props}>
      {children}
    </Card>
  );
}
```

---

## 📱 Estrutura de Páginas

### **1. Dashboard Principal (`/dashboard`)**
```typescript
// app/dashboard/page.tsx
import { Container, Stack, Title, Text } from '@mantine/core';
import { MetricsGrid } from '@/components/features/dashboard/metrics-grid';
import { ChartsSection } from '@/components/features/dashboard/charts-section';
import { RecentActivity } from '@/components/features/dashboard/recent-activity';

export default function DashboardPage() {
  const { data: metrics, isLoading } = useAnalytics({ period: '30d' });
  const { data: charts } = useCharts({ period: '30d' });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">Dashboard</Title>
          <Text c="dimmed">Visão geral das métricas principais</Text>
        </div>
        
        <MetricsGrid metrics={metrics} />
        <ChartsSection charts={charts} />
        <RecentActivity />
      </Stack>
    </Container>
  );
}
```

**Componentes:**
- **MetricsGrid**: Cards com KPIs principais
- **ChartsSection**: Gráficos de tendência
- **RecentActivity**: Atividades recentes
- **QuickActions**: Ações rápidas

### **2. Analytics (`/analytics`)**
```typescript
// app/analytics/page.tsx
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      <AnalyticsFilters />
      <AnalyticsCharts />
      <AnalyticsTable />
    </div>
  );
}
```

**Subpáginas:**
- `/analytics/revenue` - Análise de receita
- `/analytics/subscriptions` - Análise de assinaturas
- `/analytics/churn` - Análise de churn
- `/analytics/trials` - Análise de trials

### **3. Afiliados (`/affiliates`)**
```typescript
// app/affiliates/page.tsx
export default function AffiliatesPage() {
  const { data: affiliates } = useAffiliates();
  const { data: performance } = useAffiliatePerformance();

  return (
    <div className="space-y-6">
      <AffiliatesHeader />
      <AffiliatesFilters />
      <AffiliatesTable data={affiliates} />
      <AffiliatePerformanceCharts data={performance} />
    </div>
  );
}
```

### **4. Gestão de Dados (`/data`)**
```typescript
// app/data/page.tsx
export default function DataPage() {
  return (
    <div className="space-y-6">
      <DataHeader />
      <DataTabs>
        <CustomersTab />
        <SubscriptionsTab />
        <TransactionsTab />
      </DataTabs>
    </div>
  );
}
```

### **5. Auditoria (`/audit`)**
```typescript
// app/audit/page.tsx
export default function AuditPage() {
  return (
    <div className="space-y-6">
      <AuditHeader />
      <AuditFilters />
      <AuditLogsTable />
      <AuditAlerts />
    </div>
  );
}
```

---

## 🔌 Especificação de Integração com Backend

### **API Endpoints Disponíveis**

#### **Autenticação**
```typescript
// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    permissions: string[];
  };
}

// GET /auth/me
interface UserResponse {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// POST /auth/refresh
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}
```

#### **Dashboard Analytics**
```typescript
// POST /analytics/dashboard
interface DashboardRequest {
  period: '7d' | '30d' | '90d' | '1y';
  platform?: string;
  currency: 'BRL' | 'USD';
  startDate?: string;
  endDate?: string;
}

interface DashboardResponse {
  newSubscriptions: {
    count: number;
    revenue: number;
    change: string; // "+12.5%"
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
  trialRate: {
    value: number;
    change: string;
  };
  ltv: {
    value: number;
    change: string;
  };
  cac: {
    value: number;
    change: string;
  };
}
```

#### **Analytics Detalhados**
```typescript
// GET /analytics/revenue
interface RevenueAnalyticsRequest {
  period: '7d' | '30d' | '90d' | '1y';
  platform?: string;
  currency: 'BRL' | 'USD';
}

interface RevenueAnalyticsResponse {
  totalRevenue: number;
  recurringRevenue: number;
  nonRecurringRevenue: number;
  revenueByProduct: Array<{
    productId: string;
    productName: string;
    revenue: number;
    percentage: number;
  }>;
  revenueByPlatform: Array<{
    platformId: string;
    platformName: string;
    revenue: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
  }>;
}
```

#### **Sistema de Afiliados**
```typescript
// GET /affiliates
interface AffiliatesRequest {
  page?: number;
  limit?: number;
  search?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  platform?: string;
}

interface AffiliatesResponse {
  data: Array<{
    id: string;
    name: string;
    email: string;
    tier: string;
    totalSalesCount: number;
    totalRevenueBrl: number;
    totalRevenueUsd: number;
    firstSaleAt: string;
    lastSaleAt: string;
    isActive: boolean;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### **Error Handling**
```typescript
interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: any;
}

// Exemplos de erros comuns
const API_ERRORS = {
  UNAUTHORIZED: { status: 401, message: 'Token inválido ou expirado' },
  FORBIDDEN: { status: 403, message: 'Acesso negado' },
  NOT_FOUND: { status: 404, message: 'Recurso não encontrado' },
  VALIDATION_ERROR: { status: 400, message: 'Dados inválidos' },
  SERVER_ERROR: { status: 500, message: 'Erro interno do servidor' }
};
```

### **Headers Necessários**
```typescript
// Headers padrão para todas as requisições
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Headers com autenticação
const AUTH_HEADERS = {
  ...DEFAULT_HEADERS,
  'Authorization': `Bearer ${accessToken}`
};
```

---

## 🔐 Sistema de Autenticação

### **Auth Context**
```typescript
// lib/auth/auth-context.tsx
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  permissions: string[];
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    permissions: [],
    isLoading: true
  });

  // Implementation...
};
```

### **Protected Routes**
```typescript
// components/auth/protected-route.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  fallback = <LoginPage /> 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) return fallback;

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(hasPermission);
    if (!hasAllPermissions) {
      return <UnauthorizedPage />;
    }
  }

  return <>{children}</>;
}
```

### **API Client com Auth**
```typescript
// lib/api/api-client.ts
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

    const response = await fetch(url, {
      ...options,
      headers,
    });

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
}
```

---

## 📊 Componentes de Dados

### **Data Tables**
```typescript
// components/tables/data-table.tsx
import { DataTable, DataTableProps } from '@mantine/data-table';
import { Badge, Group, Text, ActionIcon } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

interface CustomDataTableProps<T> extends DataTableProps<T> {
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
}

export function CustomDataTable<T>({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  ...props
}: CustomDataTableProps<T>) {
  const enhancedColumns = [
    ...columns,
    {
      accessor: 'actions',
      title: 'Ações',
      textAlign: 'right' as const,
      render: (row: T) => (
        <Group gap="xs" justify="flex-end">
          {onView && (
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => onView(row)}
            >
              <IconEye size={16} />
            </ActionIcon>
          )}
          {onEdit && (
            <ActionIcon
              variant="subtle"
              color="orange"
              onClick={() => onEdit(row)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => onDelete(row)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Group>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={enhancedColumns}
      highlightOnHover
      withTableBorder
      withColumnBorders
      striped
      onRowClick={onRowClick}
      {...props}
    />
  );
}

// Exemplo de uso
export function SubscriptionsTable({ data }: { data: Subscription[] }) {
  const columns = [
    {
      accessor: 'customerName',
      title: 'Cliente',
      render: (row: Subscription) => (
        <Text fw={500}>{row.customerName}</Text>
      ),
    },
    {
      accessor: 'productName',
      title: 'Produto',
    },
    {
      accessor: 'status',
      title: 'Status',
      render: (row: Subscription) => (
        <Badge 
          color={row.status === 'active' ? 'green' : 'red'}
          variant="light"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      accessor: 'recurringAmount',
      title: 'Valor',
      render: (row: Subscription) => (
        <Text fw={500}>{formatCurrency(row.recurringAmount)}</Text>
      ),
    },
  ];

  return (
    <CustomDataTable
      data={data}
      columns={columns}
      onView={(row) => navigateToSubscription(row.id)}
      onEdit={(row) => editSubscription(row.id)}
      onDelete={(row) => deleteSubscription(row.id)}
    />
  );
}
```

### **Charts Components**
```typescript
// components/charts/revenue-chart.tsx
import { Card, Title, Text, Group } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: RevenueData[];
  period: '7d' | '30d' | '90d' | '1y';
  currency: 'BRL' | 'USD';
}

export function RevenueChart({ data, period, currency }: RevenueChartProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div>
          <Title order={3} mb="xs">Evolução da Receita</Title>
          <Text size="sm" c="dimmed">
            Receita {period} em {currency}
          </Text>
        </div>
      </Group>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [formatCurrency(value, currency), 'Receita']}
              labelFormatter={(label) => formatDate(label)}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#9333ea" 
              strokeWidth={2}
              dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
```

---

## 🎯 Funcionalidades Específicas

### **1. Dashboard com KPIs**
```typescript
// components/features/dashboard/metrics-grid.tsx
const METRICS = [
  {
    key: 'newSubscriptions',
    title: 'Novas Assinaturas',
    icon: UserPlus,
    color: 'blue',
    format: 'currency'
  },
  {
    key: 'mrr',
    title: 'MRR',
    icon: TrendingUp,
    color: 'green',
    format: 'currency'
  },
  {
    key: 'arr',
    title: 'ARR',
    icon: DollarSign,
    color: 'purple',
    format: 'currency'
  },
  {
    key: 'churnRate',
    title: 'Taxa de Churn',
    icon: TrendingDown,
    color: 'red',
    format: 'percentage'
  }
] as const;

export function MetricsGrid({ data, currency }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {METRICS.map((metric) => (
        <MetricCard
          key={metric.key}
          title={metric.title}
          value={formatValue(data[metric.key], metric.format, currency)}
          change={data[`${metric.key}Change`]}
          trend={data[`${metric.key}Trend`]}
          icon={<metric.icon className="h-6 w-6" />}
          color={metric.color}
          onClick={() => navigateToAnalytics(metric.key)}
        />
      ))}
    </div>
  );
}
```

### **2. Filtros Avançados**
```typescript
// components/filters/analytics-filters.tsx
interface AnalyticsFiltersProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
}

export function AnalyticsFilters({ filters, onFiltersChange }: AnalyticsFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateRangePicker
            value={filters.dateRange}
            onChange={(dateRange) => onFiltersChange({ ...filters, dateRange })}
          />
          <PlatformSelect
            value={filters.platform}
            onChange={(platform) => onFiltersChange({ ...filters, platform })}
          />
          <ChannelSelect
            value={filters.channel}
            onChange={(channel) => onFiltersChange({ ...filters, channel })}
          />
        </div>
        <div className="flex justify-between items-center">
          <AffiliateSelect
            value={filters.affiliate}
            onChange={(affiliate) => onFiltersChange({ ...filters, affiliate })}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **3. Exportação de Dados**
```typescript
// lib/export/export-utils.ts
export async function exportToCSV<T>(
  data: T[],
  columns: ColumnDef<T>[],
  filename: string
) {
  const csvContent = convertToCSV(data, columns);
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export async function exportToPDF<T>(
  data: T[],
  columns: ColumnDef<T>[],
  filename: string
) {
  const pdf = new jsPDF();
  // Implementation...
  pdf.save(`${filename}.pdf`);
}

// components/export/export-button.tsx
export function ExportButton<T>({ data, columns, filename }: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      switch (format) {
        case 'csv':
          await exportToCSV(data, columns, filename);
          break;
        case 'pdf':
          await exportToPDF(data, columns, filename);
          break;
        case 'excel':
          await exportToExcel(data, columns, filename);
          break;
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="h-4 w-4 mr-2" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileText className="h-4 w-4 mr-2" />
          Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🧪 Estratégia de Testes

### **Testes Unitários**
```typescript
// __tests__/components/metric-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricCard } from '@/components/features/dashboard/metric-card';

describe('MetricCard', () => {
  it('renders metric data correctly', () => {
    const props = {
      title: 'MRR',
      value: 'R$ 10.000',
      change: 5.2,
      trend: 'up' as const,
      icon: <TrendingUp />,
      color: 'green' as const
    };

    render(<MetricCard {...props} />);

    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('R$ 10.000')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<MetricCard {...props} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### **Testes de Integração**
```typescript
// __tests__/pages/dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '@/app/dashboard/page';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Dashboard Page', () => {
  it('renders dashboard with metrics', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('MRR')).toBeInTheDocument();
    });
  });
});
```

### **Testes E2E**
```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('displays metrics correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="metric-mrr"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-arr"]')).toBeVisible();
  });

  test('navigates to analytics when clicking metric', async ({ page }) => {
    await page.click('[data-testid="metric-mrr"]');
    await expect(page).toHaveURL('/analytics/revenue');
  });
});
```

---

## 📱 Responsividade

### **Breakpoints**
```css
/* Tailwind breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

### **Layout Adaptativo**
```typescript
// components/layout/responsive-grid.tsx
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

// components/layout/sidebar.tsx
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:static"
      )}>
        <SidebarContent />
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

---

## 🚀 Performance

### **Code Splitting**
```typescript
// Lazy loading de páginas
const AnalyticsPage = lazy(() => import('@/app/analytics/page'));
const AffiliatesPage = lazy(() => import('@/app/affiliates/page'));

// Lazy loading de componentes pesados
const RevenueChart = lazy(() => import('@/components/charts/revenue-chart'));
```

### **Memoização**
```typescript
// Memoização de componentes pesados
export const MetricCard = memo(function MetricCard({ title, value, change, trend, icon, color, onClick }: MetricCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      {/* Component content */}
    </Card>
  );
});

// Memoização de cálculos pesados
const expensiveCalculation = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);
```

### **Virtual Scrolling**
```typescript
// Para listas grandes
import { FixedSizeList as List } from 'react-window';

export function VirtualizedTable({ data }: { data: any[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <TableRow data={data[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={data.length}
      itemSize={50}
    >
      {Row}
    </List>
  );
}
```

---

## 🔧 Configuração do Projeto

### **package.json**
```json
{
  "name": "analytics-platform-frontend",
  "version": "1.0.0",
  "private": true,
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
  },
  "dependencies": {
    "next": "^15.5.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0",
    "@mantine/form": "^7.0.0",
    "@mantine/dates": "^7.0.0",
    "@mantine/notifications": "^7.0.0",
    "@mantine/modals": "^7.0.0",
    "@mantine/spotlight": "^7.0.0",
    "@mantine/dropzone": "^7.0.0",
    "@mantine/data-table": "^7.0.0",
    "@tabler/icons-react": "^3.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "recharts": "^2.0.0",
    "dayjs": "^1.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.5.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### **Configuração de Providers (CRÍTICO)**
```typescript
// app/layout.tsx
'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/lib/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// QueryClient configurado com defaults otimizados
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

### **Configuração de Zustand Store**
```typescript
// lib/stores/auth.ts
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

### **Mantine CSS Variables**
```css
/* app/globals.css */
@import '@mantine/core/styles.css';
@import '@mantine/notifications/styles.css';
@import '@mantine/dates/styles.css';

/* Custom CSS variables for Mantine theme */
:root {
  --mantine-color-purple-6: #9333ea;
  --mantine-color-emerald-6: #10B981;
  --mantine-color-amber-6: #F59E0B;
  --mantine-color-red-6: #EF4444;
}
```

---

## 📋 Plano de Fases de Desenvolvimento

### **🎯 Fase 1: Setup e Estrutura Base**
**Duração estimada**: 2-3 dias  
**Objetivo**: Configurar ambiente de desenvolvimento e estrutura base

#### **Comandos Executáveis:**
```bash
# 1. Criar projeto Next.js
npx create-next-app@latest analytics-platform \
  --typescript \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --tailwind=false \
  --use-npm

cd analytics-platform

# 2. Instalar Mantine UI
npm install @mantine/core @mantine/hooks @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/data-table

# 3. Instalar outras dependências
npm install @tabler/icons-react @tanstack/react-query zustand react-hook-form @hookform/resolvers zod recharts dayjs clsx

# 4. Instalar dev dependencies
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom @playwright/test @types/node
```

#### **Arquivos a Criar:**
```typescript
// src/lib/theme.ts
import { createTheme, MantineColorsTuple } from '@mantine/core';

const purple: MantineColorsTuple = [
  '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc',
  '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'
];

export const theme = createTheme({
  colors: { purple },
  primaryColor: 'purple',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  headings: { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', fontWeight: '600' },
  defaultRadius: 'md'
});
```

#### **Definition of Done:**
- [ ] `npm run dev` funciona sem erros
- [ ] TypeScript compila sem erros
- [ ] Mantine UI renderizando com tema roxo (#9333ea)
- [ ] Estrutura de pastas criada conforme especificação
- [ ] ESLint configurado e funcionando
- [ ] Git configurado com .gitignore
- [ ] Environment variables documentadas
- [ ] Providers configurados (MantineProvider, QueryClientProvider)
- [ ] Tema customizado aplicado corretamente
- [ ] Hot reload funcionando

---

### **🔐 Fase 2: Sistema de Autenticação**
**Duração estimada**: 3-4 dias  
**Objetivo**: Implementar autenticação completa com JWT

#### **Comandos Executáveis:**
```bash
# 1. Criar estrutura de autenticação
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/register
mkdir -p src/lib/stores
mkdir -p src/lib/api
mkdir -p src/components/auth

# 2. Criar arquivos de autenticação
touch src/app/\(auth\)/login/page.tsx
touch src/app/\(auth\)/register/page.tsx
touch src/lib/stores/authStore.ts
touch src/lib/api/auth.ts
touch src/components/auth/LoginForm.tsx
touch src/components/auth/RegisterForm.tsx

# 3. Instalar dependências de autenticação
npm install js-cookie
npm install -D @types/js-cookie
```

#### **Arquivos a Criar:**
```typescript
// src/lib/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false })
    }),
    { name: 'auth-storage' }
  )
);
```

#### **Definition of Done:**
- [ ] Páginas de login/register funcionando
- [ ] AuthStore configurado e persistindo
- [ ] API client com interceptors funcionando
- [ ] Proteção de rotas implementada
- [ ] Refresh token automático funcionando
- [ ] Logout limpa estado corretamente
- [ ] Fluxo completo testado manualmente
- [ ] Error handling implementado
- [ ] Loading states funcionando
- [ ] Validação de formulários funcionando

---

### **🏠 Fase 3: Dashboard Principal**
**Duração estimada**: 4-5 dias  
**Objetivo**: Criar dashboard principal com KPIs e gráficos

#### **Comandos Executáveis:**
```bash
# 1. Criar estrutura do dashboard
mkdir -p src/app/\(dashboard\)/layout.tsx
mkdir -p src/app/\(dashboard\)/page.tsx
mkdir -p src/components/dashboard
mkdir -p src/components/charts
mkdir -p src/components/ui

# 2. Criar componentes do dashboard
touch src/components/dashboard/MetricsGrid.tsx
touch src/components/dashboard/KPICard.tsx
touch src/components/dashboard/RevenueChart.tsx
touch src/components/dashboard/SubscriptionsChart.tsx
touch src/components/charts/LineChart.tsx
touch src/components/charts/BarChart.tsx
touch src/components/ui/MetricCard.tsx

# 3. Criar hooks customizados
touch src/lib/hooks/useDashboardData.ts
touch src/lib/hooks/useKPIs.ts
touch src/lib/hooks/useCharts.ts
```

#### **Definition of Done:**
- [ ] Layout com sidebar e header funcionando
- [ ] KPIs exibindo dados reais da API
- [ ] Gráficos interativos com Recharts
- [ ] Filtros de período, plataforma e moeda funcionando
- [ ] Responsividade em mobile, tablet e desktop
- [ ] Loading states e error handling implementados
- [ ] Refresh automático de dados funcionando
- [ ] Performance otimizada (< 2s load time)
- [ ] Testes manuais realizados
- [ ] Acessibilidade implementada

---

### **📊 Fase 4: Analytics e Relatórios**
**Duração estimada**: 5-6 dias  
**Objetivo**: Implementar páginas de analytics detalhadas

#### **Tarefas:**
- [ ] **Implementar páginas de analytics** (revenue, subscriptions, churn, trials)
- [ ] **Criar componentes de filtros avançados** (DateRangePicker, Select, etc.)
- [ ] **Implementar tabelas de dados** com Mantine DataTable
- [ ] **Adicionar funcionalidade de export** (CSV, PDF, Excel)
- [ ] **Implementar gráficos avançados** (cohort, funnel, etc.)
- [ ] **Adicionar paginação** e ordenação
- [ ] **Implementar busca** em tempo real
- [ ] **Criar relatórios personalizáveis**

#### **Entregáveis:**
- ✅ Páginas de analytics funcionando
- ✅ Filtros avançados implementados
- ✅ Tabelas com paginação e ordenação
- ✅ Funcionalidade de export
- ✅ Gráficos avançados
- ✅ Busca em tempo real

---

### **👥 Fase 5: Sistema de Afiliados**
**Duração estimada**: 4-5 dias  
**Objetivo**: Implementar gestão completa de afiliados

#### **Tarefas:**
- [ ] **Implementar página de afiliados** com lista e filtros
- [ ] **Criar dashboard de afiliados** individual
- [ ] **Implementar gestão de tiers** (Bronze, Silver, Gold, Diamond)
- [ ] **Criar métricas de performance** por afiliado
- [ ] **Implementar busca e filtros** avançados
- [ ] **Criar página de detalhes** do afiliado
- [ ] **Implementar exportação** de dados de afiliados
- [ ] **Adicionar gráficos de performance** por afiliado

#### **Entregáveis:**
- ✅ Lista de afiliados funcionando
- ✅ Dashboard individual de afiliado
- ✅ Sistema de tiers implementado
- ✅ Métricas de performance
- ✅ Filtros e busca avançados
- ✅ Exportação de dados

---

### **📋 Fase 6: Gestão de Dados**
**Duração estimada**: 4-5 dias  
**Objetivo**: Implementar CRUD completo para entidades principais

#### **Tarefas:**
- [ ] **Implementar página de clientes** com CRUD
- [ ] **Implementar página de assinaturas** com CRUD
- [ ] **Implementar página de transações** com CRUD
- [ ] **Criar formulários de criação/edição** com validação
- [ ] **Implementar modais** para ações rápidas
- [ ] **Adicionar filtros e busca** em todas as páginas
- [ ] **Implementar ações em lote** (bulk actions)
- [ ] **Criar páginas de detalhes** para cada entidade

#### **Entregáveis:**
- ✅ CRUD de clientes funcionando
- ✅ CRUD de assinaturas funcionando
- ✅ CRUD de transações funcionando
- ✅ Formulários com validação
- ✅ Modais para ações rápidas
- ✅ Filtros e busca implementados
- ✅ Ações em lote funcionando

---

### **🔍 Fase 7: Sistema de Auditoria**
**Duração estimada**: 3-4 dias  
**Objetivo**: Implementar sistema de auditoria e logs

#### **Tarefas:**
- [ ] **Implementar página de auditoria** com logs
- [ ] **Criar filtros de auditoria** (data, usuário, ação)
- [ ] **Implementar tabela de logs** com paginação
- [ ] **Criar sistema de alertas** e notificações
- [ ] **Implementar métricas de sistema**
- [ ] **Adicionar exportação** de logs
- [ ] **Criar dashboard de alertas**
- [ ] **Implementar busca** em logs

#### **Entregáveis:**
- ✅ Página de auditoria funcionando
- ✅ Filtros de auditoria implementados
- ✅ Tabela de logs com paginação
- ✅ Sistema de alertas funcionando
- ✅ Métricas de sistema
- ✅ Exportação de logs

---

### **⚙️ Fase 8: Configurações e Sincronização**
**Duração estimada**: 3-4 dias  
**Objetivo**: Implementar configurações e sistema de sincronização

#### **Tarefas:**
- [ ] **Implementar página de configurações** do usuário
- [ ] **Criar configurações de integração** (Stripe, Hotmart, Cartpanda)
- [ ] **Implementar sistema de sincronização** com status
- [ ] **Criar logs de sincronização** com filtros
- [ ] **Implementar configurações de sistema**
- [ ] **Adicionar gerenciamento de permissões**
- [ ] **Criar configurações de notificações**
- [ ] **Implementar backup e restore**

#### **Entregáveis:**
- ✅ Página de configurações funcionando
- ✅ Configurações de integração
- ✅ Sistema de sincronização com status
- ✅ Logs de sincronização
- ✅ Gerenciamento de permissões
- ✅ Configurações de notificações

---

### **🚀 Fase 9: Funcionalidades Avançadas**
**Duração estimada**: 4-5 dias  
**Objetivo**: Implementar funcionalidades avançadas e otimizações

#### **Tarefas:**
- [ ] **Implementar real-time updates** com WebSocket
- [ ] **Adicionar notificações** em tempo real
- [ ] **Implementar sistema de favoritos** e bookmarks
- [ ] **Criar dashboard personalizável** (drag & drop)
- [ ] **Implementar tema escuro/claro**
- [ ] **Adicionar atalhos de teclado**
- [ ] **Implementar busca global** (Spotlight)
- [ ] **Criar sistema de relatórios agendados**

#### **Entregáveis:**
- ✅ Real-time updates funcionando
- ✅ Notificações em tempo real
- ✅ Sistema de favoritos
- ✅ Dashboard personalizável
- ✅ Tema escuro/claro
- ✅ Atalhos de teclado
- ✅ Busca global
- ✅ Relatórios agendados

---

### **🧪 Fase 10: Testes e Qualidade**
**Duração estimada**: 3-4 dias  
**Objetivo**: Implementar testes e garantir qualidade

#### **Tarefas:**
- [ ] **Implementar testes unitários** (Jest + React Testing Library)
- [ ] **Criar testes de integração** para componentes
- [ ] **Implementar testes E2E** (Playwright)
- [ ] **Adicionar cobertura de testes** (> 80%)
- [ ] **Implementar testes de acessibilidade**
- [ ] **Criar testes de performance**
- [ ] **Implementar CI/CD** pipeline
- [ ] **Adicionar monitoramento** de erros

#### **Entregáveis:**
- ✅ Testes unitários implementados
- ✅ Testes de integração funcionando
- ✅ Testes E2E implementados
- ✅ Cobertura de testes > 80%
- ✅ Testes de acessibilidade
- ✅ Pipeline CI/CD funcionando
- ✅ Monitoramento de erros

---

### **🎨 Fase 11: Polimento e Deploy**
**Duração estimada**: 2-3 dias  
**Objetivo**: Finalizar e fazer deploy da aplicação

#### **Tarefas:**
- [ ] **Otimizar performance** (code splitting, lazy loading)
- [ ] **Implementar responsividade** completa
- [ ] **Adicionar acessibilidade** (WCAG 2.1)
- [ ] **Criar documentação** da aplicação
- [ ] **Implementar PWA** (Progressive Web App)
- [ ] **Configurar deploy** (Vercel/Netlify)
- [ ] **Implementar monitoramento** (Sentry, Analytics)
- [ ] **Criar guia de usuário**

#### **Entregáveis:**
- ✅ Performance otimizada
- ✅ Responsividade completa
- ✅ Acessibilidade implementada
- ✅ Documentação criada
- ✅ PWA funcionando
- ✅ Deploy configurado
- ✅ Monitoramento ativo
- ✅ Guia de usuário

---

## 📊 Resumo das Fases

| Fase | Duração | Objetivo Principal | Entregáveis |
|------|---------|-------------------|-------------|
| **Fase 1** | 2-3 dias | Setup e Estrutura | Projeto configurado |
| **Fase 2** | 3-4 dias | Autenticação | Login/logout funcionando |
| **Fase 3** | 4-5 dias | Dashboard | KPIs e gráficos principais |
| **Fase 4** | 5-6 dias | Analytics | Relatórios detalhados |
| **Fase 5** | 4-5 dias | Afiliados | Gestão de afiliados |
| **Fase 6** | 4-5 dias | Gestão de Dados | CRUD completo |
| **Fase 7** | 3-4 dias | Auditoria | Logs e alertas |
| **Fase 8** | 3-4 dias | Configurações | Sistema de config |
| **Fase 9** | 4-5 dias | Funcionalidades Avançadas | Real-time, PWA |
| **Fase 10** | 3-4 dias | Testes | Qualidade garantida |
| **Fase 11** | 2-3 dias | Polimento | Deploy e monitoramento |

**Duração Total Estimada**: 35-45 dias (7-9 semanas)

---

## 🎯 Critérios de Sucesso por Fase

### **Fase 1-2**: Base Sólida
- ✅ Projeto funcionando localmente
- ✅ Autenticação completa
- ✅ Estrutura de código organizada

### **Fase 3-4**: Core Features
- ✅ Dashboard com KPIs
- ✅ Analytics funcionando
- ✅ Integração com API

### **Fase 5-6**: Gestão de Dados
- ✅ CRUD completo
- ✅ Filtros e busca
- ✅ Exportação de dados

### **Fase 7-8**: Sistema Completo
- ✅ Auditoria funcionando
- ✅ Configurações implementadas
- ✅ Sincronização ativa

### **Fase 9-11**: Produção
- ✅ Performance otimizada
- ✅ Testes implementados
- ✅ Deploy funcionando

---

## 🚀 Próximos Passos

1. **Revisar plano de fases** e ajustar conforme necessário
2. **Definir prioridades** das funcionalidades
3. **Configurar ambiente** de desenvolvimento
4. **Iniciar Fase 1** (Setup e Estrutura)
5. **Seguir cronograma** de implementação

**Status**: ✅ **Plano de Fases Completo e Detalhado**

---

## 🎯 Próximos Passos

1. **Revisar plano de fases** e ajustar conforme necessário
2. **Definir prioridades** das funcionalidades
3. **Configurar ambiente** de desenvolvimento
4. **Iniciar Fase 1** (Setup e Estrutura)
5. **Seguir cronograma** de implementação

---

## 🔐 Environment Variables

### **Desenvolvimento (.env.local)**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_TIMEOUT=10000

# App Configuration
NEXT_PUBLIC_APP_NAME=Analytics Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=development

# Development Tools
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS=true

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-here
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY=7d

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### **Produção (.env.production)**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.analytics-platform.com
NEXT_PUBLIC_API_TIMEOUT=5000

# App Configuration
NEXT_PUBLIC_APP_NAME=Analytics Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=production

# Development Tools
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS=false

# Authentication
NEXT_PUBLIC_JWT_SECRET=production-jwt-secret
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY=7d

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_SENTRY_DSN=production-sentry-dsn
```

### **Configuração de Environment**
```typescript
// src/lib/config/env.ts
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Analytics Platform',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
  ENABLE_QUERY_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS === 'true',
} as const;
```

---

## 📊 Performance Targets

### **Métricas de Performance**
| Métrica | Target | Como Medir |
|---------|--------|------------|
| **First Contentful Paint** | < 1.8s | Lighthouse |
| **Largest Contentful Paint** | < 2.5s | Lighthouse |
| **Time to Interactive** | < 3.0s | Lighthouse |
| **Cumulative Layout Shift** | < 0.1 | Lighthouse |
| **Bundle Size (JS)** | < 500KB | `npm run build` |
| **Bundle Size (CSS)** | < 100KB | `npm run build` |
| **API Response Time** | < 200ms | Network tab |
| **Time to First Byte** | < 600ms | Lighthouse |

### **Comandos de Performance**
```bash
# Analisar bundle size
npm run build
npx @next/bundle-analyzer

# Lighthouse audit
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Bundle analyzer
npm install -D @next/bundle-analyzer
ANALYZE=true npm run build
```

### **Otimizações Implementadas**
- ✅ **Code Splitting** automático (Next.js)
- ✅ **Lazy Loading** de componentes
- ✅ **Image Optimization** (next/image)
- ✅ **Font Optimization** (next/font)
- ✅ **Tree Shaking** automático
- ✅ **Minification** em produção
- ✅ **Gzip Compression** (servidor)
- ✅ **CDN** para assets estáticos

---

## 🔧 Troubleshooting

### **Problemas Comuns e Soluções**

#### **1. Erro de Hydration (Next.js)**
```bash
# Problema: Warning: Text content did not match
# Solução: Adicionar 'use client' em componentes com state
'use client';

import { useState } from 'react';
```

#### **2. Mantine Theme não aplicado**
```typescript
// Problema: Tema não está sendo aplicado
// Solução: Verificar se MantineProvider está no root layout
import { MantineProvider } from '@mantine/core';
import { theme } from '@/lib/theme';

// No app/layout.tsx
<MantineProvider theme={theme}>
  {children}
</MantineProvider>
```

#### **3. TanStack Query não funcionando**
```typescript
// Problema: useQuery não retorna dados
// Solução: Verificar se QueryClientProvider está configurado
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 }
  }
});
```

#### **4. Zustand Store não persiste**
```typescript
// Problema: Estado não persiste após reload
// Solução: Verificar se persist middleware está configurado
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ /* state */ }),
    { name: 'auth-storage' }
  )
);
```

#### **5. API Client não autentica**
```typescript
// Problema: Requisições retornam 401
// Solução: Verificar se token está sendo enviado
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### **Comandos de Debug**

```bash
# Verificar se dependências estão instaladas
npm list @mantine/core @tanstack/react-query zustand

# Verificar se TypeScript está funcionando
npx tsc --noEmit

# Verificar se ESLint está funcionando
npm run lint

# Verificar se build funciona
npm run build

# Verificar se testes funcionam
npm test
```

### **Logs Úteis**

```typescript
// Debug de API calls
console.log('API Request:', { url, method, headers, body });

// Debug de Zustand store
console.log('Auth State:', useAuthStore.getState());

// Debug de TanStack Query
console.log('Query Status:', { isLoading, isError, data });
```

---

## 📚 Recursos Adicionais

### **Documentação Oficial**
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Mantine UI v7](https://mantine.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)

### **Ferramentas de Desenvolvimento**
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [TanStack Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Mantine DevTools](https://mantine.dev/guides/development/)

---

**Status**: ✅ **Guia de Desenvolvimento Completo e Corrigido**

Este guia fornece uma base sólida para desenvolver o frontend da Analytics Platform, com todas as correções implementadas, especificações de API detalhadas, configurações de providers, e um plano de fases executável.
