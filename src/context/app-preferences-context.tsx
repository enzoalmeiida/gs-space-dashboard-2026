import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { Colors } from '@/constants/theme';

export type ThemePreference = 'light' | 'dark';

export type AppThemePalette = (typeof Colors)[ThemePreference];

type AppPreferencesContextValue = {
  themePreference: ThemePreference;
  resolvedTheme: ThemePreference;
  palette: AppThemePalette;
  isReady: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  toggleThemePreference: () => void;
};

const STORAGE_KEY = '@gs-space-dashboard/preferences';

const AppPreferencesContext = createContext<AppPreferencesContextValue | undefined>(undefined);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored) as Partial<{ themePreference: ThemePreference }>;

          if (parsed.themePreference === 'light' || parsed.themePreference === 'dark') {
            setThemePreferenceState(parsed.themePreference);
          }
        }
      } catch {
        // Ignore storage read errors and keep the default theme.
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ themePreference })).catch(() => {
      // Ignore write errors to keep the app responsive.
    });
  }, [isReady, themePreference]);

  const resolvedTheme = themePreference;
  const palette = Colors[resolvedTheme];

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      themePreference,
      resolvedTheme,
      palette,
      isReady,
      setThemePreference: setThemePreferenceState,
      toggleThemePreference: () => {
        setThemePreferenceState(current => (current === 'dark' ? 'light' : 'dark'));
      },
    }),
    [isReady, palette, resolvedTheme, themePreference],
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }

  return context;
}