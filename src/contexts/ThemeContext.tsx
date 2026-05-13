import React, { createContext, useContext, useEffect, useState } from 'react';
import { useContent } from '../hooks/useFirebase';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: Record<string, string>;
  updateColor: (key: string, value: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { content } = useContent();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load colors from content (Firebase)
  useEffect(() => {
    const themeColors: Record<string, string> = {};
    const lightKeys = ['primary', 'on-primary', 'secondary', 'surface', 'on-surface', 'admin-sidebar', 'surface-variant'];
    const darkKeys = ['dark-primary', 'dark-on-primary', 'dark-secondary', 'dark-surface', 'dark-on-surface', 'dark-admin-sidebar', 'dark-surface-variant'];
    
    lightKeys.forEach(key => {
      const val = content[`theme_${key}`]?.value;
      if (val) {
        themeColors[key] = val;
        document.documentElement.style.setProperty(`--theme-${key}`, val);
      } else {
        document.documentElement.style.removeProperty(`--theme-${key}`);
      }
    });

    darkKeys.forEach(key => {
      const val = content[`theme_${key}`]?.value;
      if (val) {
        themeColors[key] = val;
        document.documentElement.style.setProperty(`--theme-${key}`, val);
      } else {
        document.documentElement.style.removeProperty(`--theme-${key}`);
      }
    });

    setColors(themeColors);
  }, [content]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const updateColor = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
    document.documentElement.style.setProperty(`--theme-${key}`, value);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors, updateColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
