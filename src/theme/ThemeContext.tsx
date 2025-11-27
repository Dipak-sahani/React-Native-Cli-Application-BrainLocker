import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  // Primary Colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background Colors
  background: string;
  card: string;
  header: string;
  
  // Text Colors
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Border & Divider Colors
  border: string;
  divider: string;
  
  // Status Colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Additional Colors
  shadow: string;
  inputBackground: string;
}

export interface AppTheme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

interface ThemeContextType {
  theme: Theme;
  currentTheme: AppTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const lightColors: ThemeColors = {
  // Primary Colors (Your brand colors)
  primary: '#407BFF',
  primaryLight: '#6B9AFF',
  primaryDark: '#2D5FCC',
  
  // Background Colors
  background: '#F5F7FB',
  card: '#FFFFFF',
  header: '#FFFFFF',
  
  // Text Colors
  text: '#1F2937',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  
  // Border & Divider Colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Status Colors
  success: '#2ECC71',
  warning: '#FF9F43',
  error: '#FF6B6B',
  info: '#8B5CF6',
  
  // Additional Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  inputBackground: '#F9FAFB',
};

const darkColors: ThemeColors = {
  // Primary Colors (Same brand colors)
  primary: '#407BFF',
  primaryLight: '#6B9AFF',
  primaryDark: '#2D5FCC',
  
  // Background Colors
  background: '#0F172A',
  card: '#1E293B',
  header: '#1E293B',
  
  // Text Colors
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  
  // Border & Divider Colors
  border: '#334155',
  divider: '#1E293B',
  
  // Status Colors
  success: '#2ECC71',
  warning: '#FF9F43',
  error: '#FF6B6B',
  info: '#8B5CF6',
  
  // Additional Colors
  shadow: 'rgba(0, 0, 0, 0.3)',
  inputBackground: '#334155',
};

const commonTheme: Omit<AppTheme, 'colors'> = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

const lightTheme: AppTheme = {
  ...commonTheme,
  colors: lightColors,
};

const darkTheme: AppTheme = {
  ...commonTheme,
  colors: darkColors,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('auto');

  const currentTheme: AppTheme = 
    theme === 'dark' || (theme === 'auto' && systemColorScheme === 'dark') 
      ? darkTheme 
      : lightTheme;

  const isDark = currentTheme === darkTheme;

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'auto';
      return 'light';
    });
  };

  // Load saved theme from storage
  useEffect(() => {
    // You can add AsyncStorage here to persist theme preference
    // For now, we'll use auto as default
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentTheme, 
      setTheme, 
      toggleTheme, 
      isDark 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};