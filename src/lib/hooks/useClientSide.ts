'use client';

import { useEffect, useState } from 'react';

export function useClientSide() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Hook para formatação segura de números e datas
export function useSafeFormat() {
  const isClient = useClientSide();

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    if (!isClient) return value.toString();
    return value.toLocaleString('pt-BR', options);
  };

  const formatCurrency = (value: number, currency = 'BRL') => {
    if (!isClient) return `R$ ${value}`;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value);
  };

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    if (!isClient) return date.toString();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', options);
  };

  const formatDateTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    if (!isClient) return date.toString();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('pt-BR', options);
  };

  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatDateTime,
    isClient,
  };
}
