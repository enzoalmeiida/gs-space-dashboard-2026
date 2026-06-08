import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemePreference, useAppPreferences } from '@/context/app-preferences-context';

const preferenceLabels: Record<ThemePreference, string> = {
  dark: 'Escuro',
  light: 'Claro',
};

export default function SettingsScreen() {
  const router = useRouter();
  const { isReady, resolvedTheme, themePreference, setThemePreference, toggleThemePreference } =
    useAppPreferences();
  const [syncLabel, setSyncLabel] = useState('Carregando preferências locais...');

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setSyncLabel(
      `Preferências sincronizadas às ${new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    );
  }, [isReady, themePreference]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroCard}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold">Voltar</ThemedText>
          </Pressable>
          <ThemedText type="code" themeColor="textSecondary">
            PREFERÊNCIAS GLOBAIS
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Configurações persistidas do aplicativo
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            O tema espacial é salvo em AsyncStorage e reaplicado automaticamente no próximo acesso.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.settingsCard}>
          <ThemedText type="subtitle">Tema</ThemedText>
          <ThemedText themeColor="textSecondary">Atual: {preferenceLabels[themePreference]}</ThemedText>

          <View style={styles.toggleRow}>
            {(['dark', 'light'] as ThemePreference[]).map(option => {
              const selected = themePreference === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setThemePreference(option)}
                  style={({ pressed }) => [
                    styles.preferenceButton,
                    selected && styles.preferenceButtonSelected,
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText type="smallBold" themeColor={selected ? 'text' : 'textSecondary'}>
                    {preferenceLabels[option]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Alternar tema button removed per user preference; keep explicit Dark/Light options only */}

          <ThemedView style={styles.summaryBox}>
            <ThemedText type="smallBold">Tema resolvido: {resolvedTheme}</ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              {syncLabel}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    flex: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  heroCard: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.12)',
  },
  title: {
    maxWidth: 560,
  },
  settingsCard: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.12)',
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  preferenceButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
  },
  preferenceButtonSelected: {
    backgroundColor: '#00D2FF',
  },
  secondaryAction: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(0, 210, 255, 0.2)',
  },
  summaryBox: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  pressed: {
    opacity: 0.85,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(0, 210, 255, 0.06)',
    marginBottom: Spacing.two,
  },
});