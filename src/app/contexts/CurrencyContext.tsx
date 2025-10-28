'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { exchangeRateService, ExchangeRateResponse } from '../services/exchangeRateService';

export type Currency = 'USD' | 'BRL';

interface ExchangeRate {
  rate: number;
  lastUpdated: Date;
  isLoading: boolean;
  error?: string;
  source?: string;
}

interface CurrencyContextType {
  currency: Currency;
  exchangeRate: ExchangeRate;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number, targetCurrency?: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  refreshExchangeRate: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>('BRL');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    rate: 5.43,
    lastUpdated: new Date(),
    isLoading: false,
    error: undefined,
    source: 'Padrão',
  });

  const refreshExchangeRate = async () => {
    setExchangeRate(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const result: ExchangeRateResponse = await exchangeRateService.fetchExchangeRate();
      
      setExchangeRate({
        rate: result.rate,
        lastUpdated: new Date(result.timestamp),
        isLoading: false,
        error: undefined,
        source: result.source,
      });
    } catch (error) {
      setExchangeRate(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
    }
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);
  };

  const formatCurrency = (amount: number, targetCurrency?: Currency): string => {
    const currencyToUse = targetCurrency || currency;
    
    const formatters = {
      USD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }),
      BRL: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }),
    };

    return formatters[currencyToUse].format(amount);
  };

  const convertAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    if (fromCurrency === 'USD' && toCurrency === 'BRL') {
      return amount * exchangeRate.rate;
    }

    if (fromCurrency === 'BRL' && toCurrency === 'USD') {
      return amount / exchangeRate.rate;
    }

    return amount;
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency') as Currency;
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'BRL')) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  useEffect(() => {
    refreshExchangeRate();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshExchangeRate();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const contextValue: CurrencyContextType = {
    currency,
    exchangeRate,
    setCurrency,
    formatCurrency,
    convertAmount,
    refreshExchangeRate,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency deve ser usado dentro de um CurrencyProvider');
  }
  return context;
}