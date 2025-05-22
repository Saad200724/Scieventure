import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'sciencebridge-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      // Get theme from localStorage or use system preference as fallback
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme) {
        return savedTheme;
      }
      
      // Check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return defaultTheme;
    }
  );

  // Get current path to determine if theme toggle should be applied
  const [currentPath, setCurrentPath] = useState<string>('');
  
  useEffect(() => {
    // Set initial path
    setCurrentPath(window.location.pathname);
    
    // Listen for path changes
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePathChange);
    
    // Custom event listener for programmatic navigation changes
    window.addEventListener('locationchange', handlePathChange);
    
    return () => {
      window.removeEventListener('popstate', handlePathChange);
      window.removeEventListener('locationchange', handlePathChange);
    };
  }, []);
  
  // List of paths that should always be light mode
  const lightOnlyPaths = ['/', '/login', '/register'];
  
  // Determine the actual theme to apply
  const effectiveTheme = lightOnlyPaths.includes(currentPath) ? 'light' : theme;

  useEffect(() => {
    // Apply theme to document root
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0F1011' : '#F5F5F5');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = effectiveTheme === 'dark' ? '#0F1011' : '#F5F5F5';
      document.head.appendChild(meta);
    }
  }, [effectiveTheme, currentPath]);

  // Listen for system theme changes
  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      // Only apply system preference changes if user hasn't explicitly set a theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // Only store the theme if we're not on a light-only path
      if (!lightOnlyPaths.includes(currentPath)) {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
