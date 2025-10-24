'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsService, Permission, Role, User, CreateRoleRequest, UpdateRoleRequest, AssignRoleRequest } from '@/lib/api/permissionsService';
import { useAuthStore } from '@/lib/stores/authStore';

// Hook para buscar todas as permissões disponíveis
export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionsService.getAllPermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
}

// Hook para buscar todas as roles
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => permissionsService.getAllRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
}

// Hook para buscar usuários
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => permissionsService.getUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 3,
  });
}

// Hook para buscar usuário específico
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => permissionsService.getUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    retry: 3,
  });
}

// Hook para buscar permissões de um usuário
export function useUserPermissions(userId: string) {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: () => permissionsService.getUserPermissions(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    retry: 3,
  });
}

// Hook para buscar roles de um usuário
export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: () => permissionsService.getUserRoles(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    retry: 3,
  });
}

// Hook para buscar recursos
export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => permissionsService.getResources(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
  });
}

// Hook para buscar ações
export function useActions() {
  return useQuery({
    queryKey: ['actions'],
    queryFn: () => permissionsService.getActions(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
  });
}

// Hook para buscar permissões por recurso
export function usePermissionsByResource(resourceSlug: string) {
  return useQuery({
    queryKey: ['permissions-by-resource', resourceSlug],
    queryFn: () => permissionsService.getPermissionsByResource(resourceSlug),
    enabled: !!resourceSlug,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}

// Hook para criar role
export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => permissionsService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// Hook para atualizar role
export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleRequest }) => 
      permissionsService.updateRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// Hook para deletar role
export function useDeleteRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (roleId: string) => permissionsService.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// Hook para atribuir role a usuário
export function useAssignRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AssignRoleRequest) => permissionsService.assignRoleToUser(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions', variables.userId] });
    },
  });
}

// Hook para remover role de usuário
export function useRemoveRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => 
      permissionsService.removeRoleFromUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions', variables.userId] });
    },
  });
}

// Hook para verificar permissões do usuário atual
export function useCurrentUserPermissions() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['current-user-permissions', user?.id],
    queryFn: () => user?.id ? permissionsService.getUserPermissions(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: 3,
  });
}

// Hook para verificar roles do usuário atual
export function useCurrentUserRoles() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['current-user-roles', user?.id],
    queryFn: () => user?.id ? permissionsService.getUserRoles(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: 3,
  });
}
