'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themes, type Theme } from '@/lib/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme = themes[0];

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedThemeName = localStorage.getItem('app-theme');
    const savedTheme = themes.find(t => t.name === savedThemeName);
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', newTheme.name);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.body.className = theme.className;
    }
  }, [theme, isMounted]);

  const value = {
    theme,
    setTheme,
    themes,
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
