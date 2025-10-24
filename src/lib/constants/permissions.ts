// PERMISSÕES REAIS DO BACKEND - 84 permissões totais
// 14 recursos × 6 ações = 84 permissões exatas retornadas pela API

export const PERMISSIONS = {
  // Dashboard (6 permissões)
  DASHBOARD: {
    CREATE: 'dashboard:create',
    READ: 'dashboard:read',
    UPDATE: 'dashboard:update',
    DELETE: 'dashboard:delete',
    EXPORT: 'dashboard:export',
    MANAGE: 'dashboard:manage',
  },
  
  // Users (6 permissões)
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    EXPORT: 'users:export',
    MANAGE: 'users:manage',
  },
  
  // Roles (6 permissões) - NOVO: Adicionado conforme backend
  ROLES: {
    CREATE: 'roles:create',
    READ: 'roles:read',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
    EXPORT: 'roles:export',
    MANAGE: 'roles:manage',
  },
  
  // Permissions (6 permissões) - NOVO: Adicionado conforme backend
  PERMISSIONS: {
    CREATE: 'permissions:create',
    READ: 'permissions:read',
    UPDATE: 'permissions:update',
    DELETE: 'permissions:delete',
    EXPORT: 'permissions:export',
    MANAGE: 'permissions:manage',
  },
  
  // Products (6 permissões)
  PRODUCTS: {
    CREATE: 'products:create',
    READ: 'products:read',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
    EXPORT: 'products:export',
    MANAGE: 'products:manage',
  },
  
  // Offers (6 permissões) - NOVO: Adicionado conforme backend
  OFFERS: {
    CREATE: 'offers:create',
    READ: 'offers:read',
    UPDATE: 'offers:update',
    DELETE: 'offers:delete',
    EXPORT: 'offers:export',
    MANAGE: 'offers:manage',
  },
  
  // Customers (6 permissões)
  CUSTOMERS: {
    CREATE: 'customers:create',
    READ: 'customers:read',
    UPDATE: 'customers:update',
    DELETE: 'customers:delete',
    EXPORT: 'customers:export',
    MANAGE: 'customers:manage',
  },
  
  // Subscriptions (6 permissões)
  SUBSCRIPTIONS: {
    CREATE: 'subscriptions:create',
    READ: 'subscriptions:read',
    UPDATE: 'subscriptions:update',
    DELETE: 'subscriptions:delete',
    EXPORT: 'subscriptions:export',
    MANAGE: 'subscriptions:manage',
  },
  
  // Transactions (6 permissões)
  TRANSACTIONS: {
    CREATE: 'transactions:create',
    READ: 'transactions:read',
    UPDATE: 'transactions:update',
    DELETE: 'transactions:delete',
    EXPORT: 'transactions:export',
    MANAGE: 'transactions:manage',
  },
  
  // Affiliates (6 permissões)
  AFFILIATES: {
    CREATE: 'affiliates:create',
    READ: 'affiliates:read',
    UPDATE: 'affiliates:update',
    DELETE: 'affiliates:delete',
    EXPORT: 'affiliates:export',
    MANAGE: 'affiliates:manage',
  },
  
  // Analytics (6 permissões)
  ANALYTICS: {
    CREATE: 'analytics:create',
    READ: 'analytics:read',
    UPDATE: 'analytics:update',
    DELETE: 'analytics:delete',
    EXPORT: 'analytics:export',
    MANAGE: 'analytics:manage',
  },
  
  // Integrations (6 permissões)
  INTEGRATIONS: {
    CREATE: 'integrations:create',
    READ: 'integrations:read',
    UPDATE: 'integrations:update',
    DELETE: 'integrations:delete',
    EXPORT: 'integrations:export',
    MANAGE: 'integrations:manage',
  },
  
  // Audit Logs (6 permissões) - NOVO: Adicionado conforme backend
  AUDIT_LOGS: {
    CREATE: 'audit-logs:create',
    READ: 'audit-logs:read',
    UPDATE: 'audit-logs:update',
    DELETE: 'audit-logs:delete',
    EXPORT: 'audit-logs:export',
    MANAGE: 'audit-logs:manage',
  },
  
  // Sync (6 permissões) - NOVO: Adicionado conforme backend
  SYNC: {
    CREATE: 'sync:create',
    READ: 'sync:read',
    UPDATE: 'sync:update',
    DELETE: 'sync:delete',
    EXPORT: 'sync:export',
    MANAGE: 'sync:manage',
  },
} as const;

// Constantes de Roles - Baseadas no Backend
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  ANALYST: 'analyst',
} as const;

// MAPEAMENTO REAL DE PERMISSÕES POR ROLE - Baseado no Backend
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS).flatMap(resource => Object.values(resource)),
  [ROLES.ADMIN]: [
    // Dashboard
    PERMISSIONS.DASHBOARD.READ,
    PERMISSIONS.DASHBOARD.EXPORT,
    // Users
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.UPDATE,
    PERMISSIONS.USERS.DELETE,
    PERMISSIONS.USERS.EXPORT,
    PERMISSIONS.USERS.MANAGE,
    // Roles
    PERMISSIONS.ROLES.READ,
    PERMISSIONS.ROLES.UPDATE,
    // Permissions
    PERMISSIONS.PERMISSIONS.READ,
    // Products
    PERMISSIONS.PRODUCTS.CREATE,
    PERMISSIONS.PRODUCTS.READ,
    PERMISSIONS.PRODUCTS.UPDATE,
    PERMISSIONS.PRODUCTS.DELETE,
    PERMISSIONS.PRODUCTS.EXPORT,
    PERMISSIONS.PRODUCTS.MANAGE,
    // Offers
    PERMISSIONS.OFFERS.CREATE,
    PERMISSIONS.OFFERS.READ,
    PERMISSIONS.OFFERS.UPDATE,
    PERMISSIONS.OFFERS.DELETE,
    PERMISSIONS.OFFERS.EXPORT,
    PERMISSIONS.OFFERS.MANAGE,
    // Customers
    PERMISSIONS.CUSTOMERS.CREATE,
    PERMISSIONS.CUSTOMERS.READ,
    PERMISSIONS.CUSTOMERS.UPDATE,
    PERMISSIONS.CUSTOMERS.DELETE,
    PERMISSIONS.CUSTOMERS.EXPORT,
    PERMISSIONS.CUSTOMERS.MANAGE,
    // Subscriptions
    PERMISSIONS.SUBSCRIPTIONS.READ,
    PERMISSIONS.SUBSCRIPTIONS.UPDATE,
    PERMISSIONS.SUBSCRIPTIONS.EXPORT,
    // Transactions
    PERMISSIONS.TRANSACTIONS.READ,
    PERMISSIONS.TRANSACTIONS.EXPORT,
    // Affiliates
    PERMISSIONS.AFFILIATES.CREATE,
    PERMISSIONS.AFFILIATES.READ,
    PERMISSIONS.AFFILIATES.UPDATE,
    PERMISSIONS.AFFILIATES.DELETE,
    PERMISSIONS.AFFILIATES.EXPORT,
    PERMISSIONS.AFFILIATES.MANAGE,
    // Analytics
    PERMISSIONS.ANALYTICS.READ,
    PERMISSIONS.ANALYTICS.EXPORT,
    // Integrations
    PERMISSIONS.INTEGRATIONS.READ,
    PERMISSIONS.INTEGRATIONS.UPDATE,
    // Audit Logs
    PERMISSIONS.AUDIT_LOGS.READ,
    PERMISSIONS.AUDIT_LOGS.EXPORT,
    // Sync
    PERMISSIONS.SYNC.READ,
    PERMISSIONS.SYNC.UPDATE,
  ],
  [ROLES.ANALYST]: [
    // Dashboard
    PERMISSIONS.DASHBOARD.READ,
    PERMISSIONS.DASHBOARD.EXPORT,
    // Users
    PERMISSIONS.USERS.READ,
    // Products
    PERMISSIONS.PRODUCTS.READ,
    PERMISSIONS.PRODUCTS.EXPORT,
    // Offers
    PERMISSIONS.OFFERS.READ,
    PERMISSIONS.OFFERS.EXPORT,
    // Customers
    PERMISSIONS.CUSTOMERS.READ,
    PERMISSIONS.CUSTOMERS.EXPORT,
    // Subscriptions
    PERMISSIONS.SUBSCRIPTIONS.READ,
    PERMISSIONS.SUBSCRIPTIONS.EXPORT,
    // Transactions
    PERMISSIONS.TRANSACTIONS.READ,
    PERMISSIONS.TRANSACTIONS.EXPORT,
    // Affiliates
    PERMISSIONS.AFFILIATES.READ,
    PERMISSIONS.AFFILIATES.EXPORT,
    // Analytics
    PERMISSIONS.ANALYTICS.READ,
    PERMISSIONS.ANALYTICS.EXPORT,
    // Integrations
    PERMISSIONS.INTEGRATIONS.READ,
    // Audit Logs
    PERMISSIONS.AUDIT_LOGS.READ,
    // Sync
    PERMISSIONS.SYNC.READ,
  ],
} as const;

// Helper para obter todas as permissões
export const getAllPermissions = (): string[] => {
  return Object.values(PERMISSIONS).flatMap(resource => Object.values(resource));
};

// Helper para obter permissões por recurso
export const getPermissionsByResource = (resource: keyof typeof PERMISSIONS): string[] => {
  return Object.values(PERMISSIONS[resource]);
};

// Helper para obter permissões por ação
export const getPermissionsByAction = (action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'manage'): string[] => {
  return Object.values(PERMISSIONS).map(resource => resource[action.toUpperCase() as keyof typeof resource]);
};

// Helper para verificar se permissão existe
export const isValidPermission = (permission: string): boolean => {
  return getAllPermissions().includes(permission);
};

// Helper para obter recurso de uma permissão
export const getResourceFromPermission = (permission: string): string | null => {
  const [resource] = permission.split(':');
  return resource || null;
};

// Helper para obter ação de uma permissão
export const getActionFromPermission = (permission: string): string | null => {
  const [, action] = permission.split(':');
  return action || null;
};
