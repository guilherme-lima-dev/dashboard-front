import { createTheme, MantineColorsTuple } from '@mantine/core';

// Design Minimalista - Cores Lilás/Roxo Suave
const lilac: MantineColorsTuple = [
  '#fefcff', // 0 - fundo mais claro
  '#faf5ff', // 1 - fundo suave
  '#f3e8ff', // 2 - lilás muito claro
  '#e9d5ff', // 3 - lilás claro
  '#d8b4fe', // 4 - lilás médio
  '#c084fc', // 5 - lilás
  '#a855f7', // 6 - roxo suave (primary)
  '#9333ea', // 7 - roxo principal
  '#7e22ce', // 8 - roxo escuro
  '#6b21a8'  // 9 - roxo mais escuro
];

const gray: MantineColorsTuple = [
  '#fafafa', // 0 - cinza muito claro
  '#f4f4f5', // 1 - cinza claro
  '#e4e4e7', // 2 - cinza médio claro
  '#d4d4d8', // 3 - cinza médio
  '#a1a1aa', // 4 - cinza
  '#71717a', // 5 - cinza escuro
  '#52525b', // 6 - cinza mais escuro
  '#3f3f46', // 7 - cinza muito escuro
  '#27272a', // 8 - quase preto
  '#18181b'  // 9 - preto
];

export const theme = createTheme({
  colors: {
    lilac,
    gray,
  },
  primaryColor: 'lilac',
  primaryShade: 6, // #a855f7 - roxo suave
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    fontWeight: '500',
  },
  defaultRadius: 'lg', // Cantos mais arredondados
  components: {
    Card: {
      defaultProps: {
        shadow: 'xs',
        withBorder: false,
        style: {
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #f4f4f5',
        }
      },
    },
    Button: {
      defaultProps: {
        radius: 'lg',
        style: {
          fontWeight: '500',
        }
      },
    },
    NavLink: {
      defaultProps: {
        style: {
          borderRadius: '12px',
          transition: 'all 0.2s ease',
          fontWeight: '500',
        }
      },
    },
    AppShell: {
      defaultProps: {
        style: {
          background: '#ffffff',
        }
      },
    },
    Text: {
      defaultProps: {
        style: {
          color: '#18181b',
        }
      },
    },
  },
});