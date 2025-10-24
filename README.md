# 🎨 Analytics Platform - Frontend

Interface moderna e intuitiva para a Analytics Platform, desenvolvida com Next.js 15, TypeScript e Mantine UI.

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript 5.x
- **UI Library**: Mantine UI v8
- **State Management**: Zustand + TanStack Query
- **Charts**: Recharts
- **Icons**: Tabler Icons
- **Forms**: React Hook Form + Zod
- **Styling**: CSS-in-JS (Mantine)

## 📋 Funcionalidades

### ✅ Implementadas
- **Sistema de Autenticação** completo com JWT
- **Dashboard Principal** com KPIs e métricas
- **Analytics Detalhados** com gráficos interativos
- **Sistema de Afiliados** com gestão completa
- **Gestão de Dados** (Clientes, Assinaturas, Transações, Produtos)
- **Sistema de Auditoria** com logs e alertas
- **Sistema de Sincronização** com status em tempo real
- **Gerenciamento de Usuários** e permissões
- **Layout Responsivo** com sidebar expansível
- **Filtros Avançados** em todas as páginas
- **Exportação de Dados** (CSV, PDF, Excel)
- **Tema Customizado** com design system

### 🔄 Em Desenvolvimento
- **Real-time Updates** com WebSocket
- **Notificações** em tempo real
- **Dashboard Personalizável** (drag & drop)
- **Tema Escuro/Claro**
- **PWA** (Progressive Web App)

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Páginas de autenticação
│   ├── analytics/          # Analytics e relatórios
│   ├── affiliates/         # Sistema de afiliados
│   ├── data/              # Gestão de dados
│   ├── audit/             # Sistema de auditoria
│   ├── sync/              # Sincronização
│   ├── users/             # Gestão de usuários
│   ├── admin/             # Administração
│   ├── settings/          # Configurações
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base
│   ├── dashboard/         # Componentes do dashboard
│   ├── charts/           # Componentes de gráficos
│   ├── tables/           # Componentes de tabelas
│   ├── forms/            # Componentes de formulários
│   └── layout/           # Layout components
├── lib/                  # Utilities e configurações
│   ├── api/              # Cliente API
│   ├── hooks/            # Custom hooks
│   ├── stores/           # Estado global
│   ├── utils/            # Funções utilitárias
│   └── theme.ts          # Tema Mantine
└── types/                # Tipos TypeScript
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Backend rodando em `http://localhost:4000`

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar em desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
npm run test         # Testes
npm run e2e          # Testes E2E
```

## 🔧 Configuração

### Variáveis de Ambiente
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
```

### Tema Customizado
O projeto usa um tema customizado baseado no Mantine com:
- **Cores**: Lilás/Roxo como cor principal (#9333ea)
- **Tipografia**: Inter como fonte principal
- **Componentes**: Customizados para o design system
- **Responsividade**: Mobile-first approach

## 📊 Funcionalidades por Página

### 🏠 Dashboard (`/`)
- KPIs principais (MRR, ARR, Churn, etc.)
- Gráficos de receita e assinaturas
- Atividade recente
- Métricas em tempo real

### 📈 Analytics (`/analytics`)
- Análise de receita
- Análise de assinaturas
- Análise de churn
- Análise de trials
- Filtros avançados
- Exportação de relatórios

### 👥 Afiliados (`/affiliates`)
- Lista de afiliados
- Performance por afiliado
- Sistema de tiers
- Métricas de conversão
- Gestão de comissões

### 💾 Dados (`/data`)
- Gestão de clientes
- Gestão de assinaturas
- Gestão de transações
- Gestão de produtos
- CRUD completo
- Filtros e busca

### 🔍 Auditoria (`/audit`)
- Logs de atividades
- Alertas do sistema
- Métricas de segurança
- Exportação de logs
- Monitoramento em tempo real

### 🔄 Sincronização (`/sync`)
- Status das plataformas
- Logs de sincronização
- Controles de sync
- Métricas de performance
- Configurações

### 👤 Usuários (`/users`)
- Gestão de usuários
- Gestão de roles
- Gestão de permissões
- Estatísticas de uso
- Auditoria de acesso

## 🎨 Design System

### Cores
- **Primary**: #9333ea (Lilás)
- **Secondary**: #22c55e (Verde)
- **Accent**: #f59e0b (Amarelo)
- **Error**: #ef4444 (Vermelho)
- **Warning**: #f59e0b (Amarelo)
- **Success**: #22c55e (Verde)

### Componentes
- **Cards**: Com sombra e bordas arredondadas
- **Buttons**: Com variantes e estados
- **Tables**: Com paginação e ordenação
- **Charts**: Integrados com Recharts
- **Forms**: Com validação Zod

## 🔐 Autenticação

### Sistema JWT
- **Access Token**: Para requisições
- **Refresh Token**: Para renovação automática
- **Interceptors**: Para renovação automática
- **Persistência**: LocalStorage + SessionStorage

### Permissões
- **Granulares**: Por recurso e ação
- **Roles**: Sistema de papéis
- **Middleware**: Proteção de rotas
- **Context**: Estado global

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Layout
- **Sidebar**: Expansível/colapsável
- **Header**: Fixo com controles
- **Main**: Conteúdo principal
- **Mobile**: Menu hambúrguer

## 🧪 Testes

### Estratégia
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Componentes
- **E2E Tests**: Playwright
- **Coverage**: > 80%

### Comandos
```bash
npm run test         # Testes unitários
npm run test:watch   # Modo watch
npm run test:coverage # Com cobertura
npm run e2e          # Testes E2E
```

## 🚀 Deploy

### Produção
```bash
npm run build
npm run start
```

### Variáveis de Produção
```bash
NEXT_PUBLIC_API_URL=https://api.analytics-platform.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
```

## 📚 Documentação

### API Integration
- **Endpoints**: 73 endpoints implementados
- **Types**: TypeScript interfaces
- **Hooks**: Custom hooks para cada recurso
- **Error Handling**: Tratamento global de erros

### Performance
- **Code Splitting**: Automático (Next.js)
- **Lazy Loading**: Componentes pesados
- **Memoização**: React.memo e useMemo
- **Bundle Size**: < 500KB

## 🤝 Contribuição

### Padrões
- **ESLint**: Configuração Next.js
- **Prettier**: Formatação automática
- **TypeScript**: Tipagem estrita
- **Commits**: Conventional Commits

### Estrutura
- **Components**: Funcionais com hooks
- **Hooks**: Customizados para lógica
- **Types**: Interfaces TypeScript
- **Utils**: Funções utilitárias

## 📄 Licença

Este projeto é proprietário e confidencial.

---

**Status**: ✅ **Frontend Completo e Funcional**

Desenvolvido com ❤️ para a Analytics Platform.