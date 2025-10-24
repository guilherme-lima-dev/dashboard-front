'use client';

import { useQuery } from '@tanstack/react-query';

interface ExchangeRateData {
  usd: {
    brl: number;
  };
}

export function useExchangeRate() {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: async (): Promise<number> => {
      try {
        // Tentar primeiro com Cloudflare (mais confiável)
        const response = await fetch(
          'https://latest.currency-api.pages.dev/v1/currencies/usd.json'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch from Cloudflare');
        }
        
        const data: ExchangeRateData = await response.json();
        return data.usd.brl;
      } catch (error) {
        // Fallback para jsdelivr
        try {
          const fallbackResponse = await fetch(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
          );
          
          if (!fallbackResponse.ok) {
            throw new Error('Failed to fetch from jsdelivr fallback');
          }
          
          const data: ExchangeRateData = await fallbackResponse.json();
          return data.usd.brl;
        } catch (fallbackError) {
          console.error('Both exchange rate APIs failed:', fallbackError);
          // Retornar valor padrão se ambas as APIs falharem
          return 5.43;
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
