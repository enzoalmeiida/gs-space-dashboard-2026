import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppPreferencesProvider, useAppPreferences } from '@/context/app-preferences-context';

function AppNavigation() {
  const { palette, resolvedTheme } = useAppPreferences();
  const baseTheme = resolvedTheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: palette.background,
      card: palette.backgroundElement,
      text: palette.text,
      border: palette.border,
      primary: palette.primary,
      notification: palette.alert,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: navigationTheme.colors.background },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tracking" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppPreferencesProvider>
        <AppNavigation />
      </AppPreferencesProvider>
    </SafeAreaProvider>
  );
}
