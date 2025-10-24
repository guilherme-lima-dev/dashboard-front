import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService, DataFilters } from '@/lib/api/data';

// Hook para clientes
export function useCustomers(filters: DataFilters = {}) {
  return useQuery({
    queryKey: ['data', 'customers', filters],
    queryFn: () => dataService.getCustomers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['data', 'customers', 'detail', id],
    queryFn: () => dataService.getCustomerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para assinaturas
export function useSubscriptions(filters: DataFilters = {}) {
  return useQuery({
    queryKey: ['data', 'subscriptions', filters],
    queryFn: () => dataService.getSubscriptions(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['data', 'subscriptions', 'detail', id],
    queryFn: () => dataService.getSubscriptionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para transações
export function useTransactions(filters: DataFilters = {}) {
  return useQuery({
    queryKey: ['data', 'transactions', filters],
    queryFn: () => dataService.getTransactions(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['data', 'transactions', 'detail', id],
    queryFn: () => dataService.getTransactionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para produtos
export function useProducts(filters: DataFilters = {}) {
  return useQuery({
    queryKey: ['data', 'products', filters],
    queryFn: () => dataService.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['data', 'products', 'detail', id],
    queryFn: () => dataService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para plataformas
export function usePlatforms(filters: DataFilters = {}) {
  return useQuery({
    queryKey: ['data', 'platforms', filters],
    queryFn: () => dataService.getPlatforms(filters),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function usePlatform(id: string) {
  return useQuery({
    queryKey: ['data', 'platforms', 'detail', id],
    queryFn: () => dataService.getPlatformById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// Hook para estatísticas gerais
export function useDataStats() {
  return useQuery({
    queryKey: ['data', 'stats'],
    queryFn: dataService.getDataStats,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations para clientes
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dataService.updateCustomer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['data', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['data', 'customers', 'detail', id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'customers'] });
    },
  });
}

// Mutations para assinaturas
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dataService.updateSubscription(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['data', 'subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['data', 'subscriptions', 'detail', id] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'subscriptions'] });
    },
  });
}

// Mutations para transações
export function useRefundTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataService.refundTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'transactions'] });
    },
  });
}

// Mutations para produtos
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dataService.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['data', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['data', 'products', 'detail', id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'products'] });
    },
  });
}

// Mutations para plataformas
export function useUpdatePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dataService.updatePlatform(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['data', 'platforms'] });
      queryClient.invalidateQueries({ queryKey: ['data', 'platforms', 'detail', id] });
    },
  });
}
