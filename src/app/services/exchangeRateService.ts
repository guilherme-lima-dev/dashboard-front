/**
 * Serviço para buscar cotações de moedas em tempo real
 * Utiliza múltiplas APIs como fallback para garantir disponibilidade
 */

export interface ExchangeRateResponse {
  rate: number;
  source: string;
  timestamp: number;
}

export class ExchangeRateError extends Error {
  source: string;
  code?: string;

  constructor(options: { message: string; source: string; code?: string }) {
    super(options.message);
    this.name = 'ExchangeRateError';
    this.source = options.source;
    this.code = options.code;
  }
}

class ExchangeRateService {
  private readonly APIs = [
    {
      name: 'ExchangeRate-API',
      url: 'https://api.exchangerate-api.com/v4/latest/USD',
      parser: (data: any) => ({
        rate: data.rates?.BRL || 0,
        source: 'ExchangeRate-API',
        timestamp: Date.now(),
      }),
    },
    {
      name: 'Fixer.io',
      url: 'https://api.fixer.io/latest?base=USD&symbols=BRL',
      parser: (data: any) => ({
        rate: data.rates?.BRL || 0,
        source: 'Fixer.io',
        timestamp: Date.now(),
      }),
    },
    {
      name: 'CurrencyAPI',
      url: 'https://api.currencyapi.com/v3/latest?apikey=free&currencies=BRL&base_currency=USD',
      parser: (data: any) => ({
        rate: data.data?.BRL?.value || 0,
        source: 'CurrencyAPI',
        timestamp: Date.now(),
      }),
    },
  ];

  private cache: {
    rate: number;
    timestamp: number;
    source: string;
  } | null = null;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Busca a cotação USD/BRL de uma API específica
   */
  private async fetchFromAPI(api: typeof this.APIs[0]): Promise<ExchangeRateResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(api.url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Appyon-Dashboard/1.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const result = api.parser(data);

      if (!result.rate || result.rate <= 0) {
        throw new Error('Taxa de câmbio inválida recebida');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const errorCode = error instanceof Error ? error.name : 'UNKNOWN_ERROR';
      
      throw new ExchangeRateError({
        message: errorMessage,
        source: api.name,
        code: errorCode,
      });
    }
  }

  /**
   * Busca cotação com fallback automático entre APIs
   */
  async fetchExchangeRate(forceRefresh = false): Promise<ExchangeRateResponse> {
    // Verificar cache se não for refresh forçado
    if (!forceRefresh && this.cache) {
      const cacheAge = Date.now() - this.cache.timestamp;
      if (cacheAge < this.CACHE_DURATION) {
        return {
          rate: this.cache.rate,
          source: `${this.cache.source} (cached)`,
          timestamp: this.cache.timestamp,
        };
      }
    }

    const errors: ExchangeRateError[] = [];

    // Tentar cada API em sequência
    for (const api of this.APIs) {
      try {
        const result = await this.fetchFromAPI(api);
        
        // Validar se a taxa está em um range razoável (4-7 BRL por USD)
        if (result.rate >= 4 && result.rate <= 7) {
          // Atualizar cache
          this.cache = {
            rate: result.rate,
            timestamp: result.timestamp,
            source: result.source,
          };
          
          return result;
        } else {
          errors.push(new ExchangeRateError({
            message: `Taxa fora do range esperado: ${result.rate}`,
            source: api.name,
            code: 'INVALID_RATE_RANGE',
          }));
        }
      } catch (error) {
        errors.push(error as ExchangeRateError);
      }
    }

    // Se todas as APIs falharam, usar valor simulado baseado no cache ou valor padrão
    const fallbackRate = this.generateFallbackRate();
    
    console.warn('Todas as APIs de cotação falharam, usando valor simulado:', {
      errors,
      fallbackRate,
    });

    return {
      rate: fallbackRate,
      source: 'Simulado (APIs indisponíveis)',
      timestamp: Date.now(),
    };
  }

  /**
   * Gera uma taxa de câmbio simulada baseada no último valor conhecido
   */
  private generateFallbackRate(): number {
    const baseRate = this.cache?.rate || 5.43; // Taxa padrão
    const variation = (Math.random() - 0.5) * 0.1; // Variação de ±5%
    const newRate = baseRate + variation;
    
    // Garantir que está dentro de um range razoável
    return Math.max(4.5, Math.min(6.5, newRate));
  }

  /**
   * Obtém a última cotação do cache (se disponível)
   */
  getCachedRate(): ExchangeRateResponse | null {
    if (!this.cache) return null;

    return {
      rate: this.cache.rate,
      source: `${this.cache.source} (cached)`,
      timestamp: this.cache.timestamp,
    };
  }

  /**
   * Limpa o cache forçando uma nova busca na próxima chamada
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * Verifica se o cache está válido
   */
  isCacheValid(): boolean {
    if (!this.cache) return false;
    
    const cacheAge = Date.now() - this.cache.timestamp;
    return cacheAge < this.CACHE_DURATION;
  }

  /**
   * Obtém informações sobre o status do cache
   */
  getCacheInfo() {
    if (!this.cache) {
      return { hasCache: false };
    }

    const cacheAge = Date.now() - this.cache.timestamp;
    const isValid = cacheAge < this.CACHE_DURATION;

    return {
      hasCache: true,
      isValid,
      ageInMinutes: Math.floor(cacheAge / (60 * 1000)),
      source: this.cache.source,
      rate: this.cache.rate,
    };
  }
}

// Instância singleton do serviço
export const exchangeRateService = new ExchangeRateService();

// Funções utilitárias para conversão
export const convertCurrency = (
  amount: number,
  fromCurrency: 'USD' | 'BRL',
  toCurrency: 'USD' | 'BRL',
  exchangeRate: number
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === 'USD' && toCurrency === 'BRL') {
    return amount * exchangeRate;
  }

  if (fromCurrency === 'BRL' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }

  return amount;
};

export const formatCurrency = (
  amount: number,
  currency: 'USD' | 'BRL'
): string => {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    BRL: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };

  return formatters[currency].format(amount);
};