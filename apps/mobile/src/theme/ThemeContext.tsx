import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors, typography, spacing, radii, ThemeType, ThemeColors } from './index';

interface ThemeContextValue {
  theme: ThemeType;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode; initialTheme?: ThemeType }> = ({
  children,
  initialTheme = 'light',
}) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(initialTheme);

  const activeTheme = theme === 'oled' ? 'oled' : theme === 'dark' ? 'dark' : 'light';
  const currentColors = colors[activeTheme];

  const value: ThemeContextValue = {
    theme: activeTheme,
    colors: currentColors,
    typography,
    spacing,
    radii,
    setTheme,
    isDark: activeTheme === 'dark' || activeTheme === 'oled',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
