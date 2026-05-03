import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

interface ThemeCtx {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function getSystemTheme(): Resolved {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolve(t: Theme): Resolved {
  return t === 'system' ? getSystemTheme() : t;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const s = localStorage.getItem('theme');
    if (s === 'light' || s === 'dark' || s === 'system') return s;
    return 'system';
  });
  const [resolvedTheme, setResolved] = useState<Resolved>(() => resolve(theme));

  const apply = useCallback((t: Theme) => {
    const r = resolve(t);
    setResolved(r);
    // Standard Tailwind dark mode: toggle .dark class on <html>
    if (r === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    apply(t);
  }, [apply]);

  useEffect(() => { apply(theme); }, [theme, apply]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const h = () => apply('system');
    mql.addEventListener('change', h);
    return () => mql.removeEventListener('change', h);
  }, [theme, apply]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
