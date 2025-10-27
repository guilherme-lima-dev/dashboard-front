import { createTheme, MantineColorsTuple } from '@mantine/core';

const purple: MantineColorsTuple = [
  '#f8f6ff',
  '#e9e4ff', 
  '#d4c7ff',
  '#bea8ff',
  '#a88dff',
  '#9575ff',
  '#8b5cf6',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6'
];

export const theme = createTheme({
  colors: {
    purple,
  },
  primaryColor: 'purple',
  primaryShade: { light: 5, dark: 6 },
  
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
  },

  white: '#ffffff',
  black: '#1a1a1a',
  
  components: {
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
        withBorder: true,
      },
    },
    
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
        withBorder: true,
      },
    },

    Button: {
      defaultProps: {
        radius: 'md',
      },
    },

    AppShell: {
      defaultProps: {
        padding: 'md',
      },
    },

    NavLink: {
      defaultProps: {
        variant: 'filled',
      },
    },

    Select: {
      defaultProps: {
        radius: 'md',
      },
    },

    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },

    DateInput: {
      defaultProps: {
        radius: 'md',
      },
    },
  },

  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },
});