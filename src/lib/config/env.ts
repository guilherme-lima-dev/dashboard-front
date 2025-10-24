export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Analytics Platform',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
  ENABLE_QUERY_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS === 'true',
} as const;
