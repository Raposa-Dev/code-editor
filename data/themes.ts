export interface Theme {
  name: string;
  type: 'light' | 'dark';
  colors: {
    // UI Colors
    'bg-primary': string;
    'bg-secondary': string;
    'bg-tertiary': string;
    'bg-accent': string;
    'bg-accent-hover': string;
    
    'text-primary': string;
    'text-secondary': string;
    'text-accent': string;

    'border-primary': string;

    'status-success': string;
    'status-warning': string;
    'status-danger': string;
    'status-danger-hover': string;
    
    // Terminal colors
    'terminal-bg': string;
    'terminal-fg': string;
  };
}

// FIX: Defined base dark theme object to be referenced by other themes.
// This prevents "used before its declaration" errors when creating theme variants.
const darkTheme: Theme = {
  name: 'Dark',
  type: 'dark',
  colors: {
    'bg-primary': '#1e1e1e',
    'bg-secondary': '#252526',
    'bg-tertiary': '#333333',
    'bg-accent': '#007acc',
    'bg-accent-hover': '#009afe',
    'text-primary': '#cccccc',
    'text-secondary': '#8e8e8e',
    'text-accent': '#ffffff',
    'border-primary': '#3c3c3c',
    'status-success': '#4caf50',
    'status-warning': '#ffc107',
    'status-danger': '#f44336',
    'status-danger-hover': '#e53935',
    'terminal-bg': '#1e1e1e',
    'terminal-fg': '#cccccc',
  },
};

const lightTheme: Theme = {
  name: 'Light',
  type: 'light',
  colors: {
    'bg-primary': '#ffffff',
    'bg-secondary': '#f3f3f3',
    'bg-tertiary': '#e4e4e4',
    'bg-accent': '#007acc',
    'bg-accent-hover': '#005a9e',
    'text-primary': '#24292e',
    'text-secondary': '#586069',
    'text-accent': '#ffffff',
    'border-primary': '#d1d5da',
    'status-success': '#22863a',
    'status-warning': '#b08800',
    'status-danger': '#d73a49',
    'status-danger-hover': '#cb2431',
    'terminal-bg': '#f9f9f9',
    'terminal-fg': '#333333',
  },
};

export const themes: Theme[] = [
  darkTheme,
  lightTheme,
  {
    name: 'Pink',
    type: 'dark',
    colors: {
       ...darkTheme.colors,
      'bg-accent': '#e91e63',
      'bg-accent-hover': '#c2185b',
    },
  },
  {
    name: 'Purple',
    type: 'dark',
    colors: {
      ...darkTheme.colors,
      'bg-accent': '#9c27b0',
      'bg-accent-hover': '#7b1fa2',
    },
  },
  {
    name: 'Fuchsia',
    type: 'dark',
    colors: {
      ...darkTheme.colors,
      'bg-accent': '#ea00ff',
      'bg-accent-hover': '#b500c4',
    },
  },
  {
    name: 'Blue',
    type: 'dark',
    colors: {
       ...darkTheme.colors,
      'bg-accent': '#2196F3',
      'bg-accent-hover': '#1976D2',
    },
  },
  {
    name: 'High Contrast',
    type: 'dark',
    colors: {
      'bg-primary': '#000000',
      'bg-secondary': '#111111',
      'bg-tertiary': '#222222',
      'bg-accent': '#00aeff',
      'bg-accent-hover': '#40c8ff',
      'text-primary': '#ffffff',
      'text-secondary': '#bbbbbb',
      'text-accent': '#ffffff',
      'border-primary': '#555555',
      'status-success': '#3add85',
      'status-warning': '#ffd300',
      'status-danger': '#ff6347',
      'status-danger-hover': '#ff4500',
      'terminal-bg': '#000000',
      'terminal-fg': '#ffffff',
    },
  },
];
