import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'midnight' | 'slate' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isLight: boolean;
  isMidnight: boolean;
  isSlate: boolean;
}

const STORAGE_KEY = 'gis_portfolio_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === 'midnight' || saved === 'slate' || saved === 'light')) {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load theme preference', e);
    }
    return 'slate'; // Default balanced dark
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  };

  const toggleTheme = () => {
    if (theme === 'slate') setTheme('midnight');
    else if (theme === 'midnight') setTheme('light');
    else setTheme('slate');
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-midnight', 'theme-slate', 'theme-light');
    root.classList.add(`theme-${theme}`);
    root.setAttribute('data-theme', theme);

    // Update meta theme-color if present
    let metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    if (theme === 'midnight') {
      metaThemeColor.setAttribute('content', '#000000');
    } else if (theme === 'light') {
      metaThemeColor.setAttribute('content', '#f8fafc');
    } else {
      metaThemeColor.setAttribute('content', '#0b0f19');
    }
  }, [theme]);

  const isLight = theme === 'light';
  const isMidnight = theme === 'midnight';
  const isSlate = theme === 'slate';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight, isMidnight, isSlate }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
