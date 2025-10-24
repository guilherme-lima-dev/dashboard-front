// Sistema de Permissões RBAC
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string; // dashboard, analytics, users, settings, etc.
  action: string; // read, write, delete, manage
  category: string; // analytics, management, system, etc.
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array de permission IDs
  isSystem: boolean; // Se é um role do sistema (não pode ser deletado)
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
}

// Permissões do Sistema
export const SYSTEM_PERMISSIONS: Permission[] = [
  // Dashboard
  { id: 'dashboard:read', name: 'Visualizar Dashboard', description: 'Acesso ao dashboard principal', resource: 'dashboard', action: 'read', category: 'analytics' },
  { id: 'dashboard:export', name: 'Exportar Dashboard', description: 'Exportar dados do dashboard', resource: 'dashboard', action: 'export', category: 'analytics' },
  
  // Analytics
  { id: 'analytics:read', name: 'Visualizar Analytics', description: 'Acesso aos relatórios de analytics', resource: 'analytics', action: 'read', category: 'analytics' },
  { id: 'analytics:write', name: 'Editar Analytics', description: 'Editar configurações de analytics', resource: 'analytics', action: 'write', category: 'analytics' },
  { id: 'analytics:export', name: 'Exportar Analytics', description: 'Exportar relatórios de analytics', resource: 'analytics', action: 'export', category: 'analytics' },
  
  // Usuários
  { id: 'users:read', name: 'Visualizar Usuários', description: 'Visualizar lista de usuários', resource: 'users', action: 'read', category: 'management' },
  { id: 'users:write', name: 'Gerenciar Usuários', description: 'Criar, editar e excluir usuários', resource: 'users', action: 'write', category: 'management' },
  { id: 'users:permissions', name: 'Gerenciar Permissões', description: 'Gerenciar permissões de usuários', resource: 'users', action: 'permissions', category: 'management' },
  
  // Afiliados
  { id: 'affiliates:read', name: 'Visualizar Afiliados', description: 'Acesso à lista de afiliados', resource: 'affiliates', action: 'read', category: 'management' },
  { id: 'affiliates:write', name: 'Gerenciar Afiliados', description: 'Criar, editar e excluir afiliados', resource: 'affiliates', action: 'write', category: 'management' },
  { id: 'affiliates:performance', name: 'Visualizar Performance', description: 'Acesso às métricas de performance', resource: 'affiliates', action: 'performance', category: 'analytics' },
  
  // Dados
  { id: 'data:read', name: 'Visualizar Dados', description: 'Acesso aos dados de clientes, assinaturas e transações', resource: 'data', action: 'read', category: 'management' },
  { id: 'data:write', name: 'Gerenciar Dados', description: 'Criar, editar e excluir dados', resource: 'data', action: 'write', category: 'management' },
  { id: 'data:export', name: 'Exportar Dados', description: 'Exportar dados do sistema', resource: 'data', action: 'export', category: 'management' },
  
  // Auditoria
  { id: 'audit:read', name: 'Visualizar Auditoria', description: 'Acesso aos logs de auditoria', resource: 'audit', action: 'read', category: 'system' },
  { id: 'audit:export', name: 'Exportar Auditoria', description: 'Exportar logs de auditoria', resource: 'audit', action: 'export', category: 'system' },
  
  // Configurações
  { id: 'settings:read', name: 'Visualizar Configurações', description: 'Acesso às configurações do sistema', resource: 'settings', action: 'read', category: 'system' },
  { id: 'settings:write', name: 'Gerenciar Configurações', description: 'Editar configurações do sistema', resource: 'settings', action: 'write', category: 'system' },
  { id: 'settings:integrations', name: 'Gerenciar Integrações', description: 'Configurar integrações externas', resource: 'settings', action: 'integrations', category: 'system' },
  
  // Sistema
  { id: 'system:admin', name: 'Administrador do Sistema', description: 'Acesso total ao sistema', resource: 'system', action: 'admin', category: 'system' },
  { id: 'system:logs', name: 'Visualizar Logs', description: 'Acesso aos logs do sistema', resource: 'system', action: 'logs', category: 'system' },
];

// Roles do Sistema
export const SYSTEM_ROLES: Role[] = [
  {
    id: 'super-admin',
    name: 'Super Administrador',
    description: 'Acesso total ao sistema',
    permissions: SYSTEM_PERMISSIONS.map(p => p.id),
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso administrativo completo',
    permissions: [
      'dashboard:read', 'dashboard:export',
      'analytics:read', 'analytics:write', 'analytics:export',
      'users:read', 'users:write', 'users:permissions',
      'affiliates:read', 'affiliates:write', 'affiliates:performance',
      'data:read', 'data:write', 'data:export',
      'audit:read', 'audit:export',
      'settings:read', 'settings:write', 'settings:integrations',
    ],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'analyst',
    name: 'Analista',
    description: 'Acesso a analytics e relatórios',
    permissions: [
      'dashboard:read', 'dashboard:export',
      'analytics:read', 'analytics:export',
      'affiliates:read', 'affiliates:performance',
      'data:read', 'data:export',
      'audit:read',
    ],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'viewer',
    name: 'Visualizador',
    description: 'Acesso somente leitura',
    permissions: [
      'dashboard:read',
      'analytics:read',
      'affiliates:read',
      'data:read',
    ],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Tipos para API
export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface AssignRoleRequest {
  userId: string;
  roleId: string;
}

export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
