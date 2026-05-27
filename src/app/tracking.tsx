import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TrackingForm } from '@/components/tracking-form';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type RegisteredCargo = {
  cargoCode: string;
  origin: string;
  destination: string;
};

export default function TrackingScreen() {
  const [recentCargoes, setRecentCargoes] = useState<RegisteredCargo[]>([
    {
      cargoCode: 'ORBIT-104',
      origin: 'São Paulo',
      destination: 'Roterdã',
    },
  ]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroCard}>
          <ThemedText type="code" themeColor="textSecondary">
            REGISTRO OPERACIONAL
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Cadastro de carga rastreável por satélite
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            Validação simples para registrar novas remessas e alimentar o painel com dados
            operacionais.
          </ThemedText>
        </ThemedView>

        <TrackingForm
          onSubmit={values => {
            setRecentCargoes(current => [
              {
                cargoCode: values.cargoCode,
                origin: values.origin,
                destination: values.destination,
              },
              ...current,
            ]);
          }}
        />

        <ThemedView type="backgroundElement" style={styles.listCard}>
          <ThemedText type="subtitle">Cadastros recentes</ThemedText>
          <View style={styles.listContent}>
            {recentCargoes.map(item => (
              <ThemedView key={item.cargoCode} style={styles.listItem}>
                <ThemedText type="smallBold">{item.cargoCode}</ThemedText>
                <ThemedText themeColor="textSecondary" type="small">
                  {item.origin} → {item.destination}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
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
  },
  title: {
    maxWidth: 560,
  },
  listCard: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.five,
  },
  listContent: {
    gap: Spacing.two,
  },
  listItem: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});