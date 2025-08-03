'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ThemeName } from '@/lib/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const initialState: ThemeProviderState = {
  theme: 'cozy-evening',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'cozy-evening',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as ThemeName | null;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (e) {
      // localStorage is not available
      console.error('Error reading theme from localStorage', e);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-cozy-evening', 'theme-serene-garden', 'theme-soft-night-sky');
    
    if (theme) {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: (newTheme: ThemeName) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch(e) {
         console.error('Error saving theme to localStorage', e);
      }
      setTheme(newTheme);
    },
  }), [theme, storageKey]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }

  return context;
};
