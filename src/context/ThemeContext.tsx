import React, { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'indigo' | 'blue' | 'violet' | 'emerald' | 'rose' | 'amber';
export type BgTheme = 'slate' | 'warm' | 'midnight' | 'emerald' | 'oled';

export interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
  setDarkMode: (val: boolean) => void;
  bgTheme: BgTheme;
  setBgTheme: (theme: BgTheme) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('campushire_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [bgTheme, setBgThemeState] = useState<BgTheme>(() => {
    return (localStorage.getItem('campushire_bg_theme') as BgTheme) || 'slate';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    return (localStorage.getItem('campushire_accent') as AccentColor) || 'indigo';
  });

  // Apply dark mode & root class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('campushire_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('campushire_theme', 'light');
    }
  }, [isDark]);

  // Apply background theme data-attribute and CSS color
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-bg', bgTheme);
    localStorage.setItem('campushire_bg_theme', bgTheme);

    // If OLED chosen, enforce dark mode
    if (bgTheme === 'oled' && !isDark) {
      setIsDark(true);
    }
  }, [bgTheme, isDark]);

  // Apply accent color
  useEffect(() => {
    localStorage.setItem('campushire_accent', accent);
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const setDarkMode = (val: boolean) => {
    setIsDark(val);
  };

  const setBgTheme = (newTheme: BgTheme) => {
    setBgThemeState(newTheme);
    if (newTheme === 'oled') {
      setIsDark(true);
    }
  };

  const setAccent = (newAccent: AccentColor) => setAccentState(newAccent);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDark,
        setDarkMode,
        bgTheme,
        setBgTheme,
        accent,
        setAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
