import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, UserFilters, RoleFilters, PermissionFilters } from '@/lib/api/users';

// Hook para usuários
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: () => usersService.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para roles
export function useRoles(filters: RoleFilters = {}) {
  return useQuery({
    queryKey: ['users', 'roles', filters],
    queryFn: () => usersService.getRoles(filters),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['users', 'roles', 'detail', id],
    queryFn: () => usersService.getRoleById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// Hook para permissões
export function usePermissions(filters: PermissionFilters = {}) {
  return useQuery({
    queryKey: ['users', 'permissions', filters],
    queryFn: () => usersService.getPermissions(filters),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function usePermission(id: string) {
  return useQuery({
    queryKey: ['users', 'permissions', 'detail', id],
    queryFn: () => usersService.getPermissionById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// Hook para estatísticas de usuários
export function useUserStats() {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: usersService.getStats,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para dashboard de usuários
export function useUserDashboard() {
  return useQuery({
    queryKey: ['users', 'dashboard'],
    queryFn: usersService.getDashboard,
    staleTime: 2 * 60 * 1000,
  });
}

// Mutations para usuários
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      usersService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) => 
      usersService.resetPassword(id, newPassword),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', id] });
    },
  });
}

// Mutations para roles
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'roles'] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      usersService.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'roles'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'roles', 'detail', id] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'roles'] });
    },
  });
}

// Mutations para permissões
export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'permissions'] });
    },
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      usersService.updatePermission(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'permissions', 'detail', id] });
    },
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'permissions'] });
    },
  });
}

// Hook para múltiplos dados de usuários
export function useMultipleUsers(filters: UserFilters = {}) {
  const users = useUsers(filters);
  const roles = useRoles();
  const permissions = usePermissions();
  const stats = useUserStats();
  const dashboard = useUserDashboard();

  return {
    users,
    roles,
    permissions,
    stats,
    dashboard,
    isLoading: users.isLoading || roles.isLoading || permissions.isLoading || stats.isLoading || dashboard.isLoading,
    isError: users.isError || roles.isError || permissions.isError || stats.isError || dashboard.isError,
    error: users.error || roles.error || permissions.error || stats.error || dashboard.error,
  };
}