import DetailsModal from '@/components/details-modal';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TrackingForm } from '@/components/tracking-form';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RegisteredCargo = {
  cargoCode: string;
  origin: string;
  destination: string;
  latitude?: number;
  longitude?: number;
};

export default function TrackingScreen() {
  const router = useRouter();
  const [recentCargoes, setRecentCargoes] = useState<RegisteredCargo[]>([]);


  const [selected, setSelected] = useState<RegisteredCargo | null>(null);

  const STORAGE_KEY = '@gs-space-dashboard/recent-cargoes';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && mounted) {
          const parsed = JSON.parse(raw) as RegisteredCargo[];
          setRecentCargoes(parsed);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroCard}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold">Voltar</ThemedText>
          </Pressable>
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
          onSubmit={async values => {
            const entry: RegisteredCargo = {
              cargoCode: values.cargoCode,
              origin: values.origin,
              destination: values.destination,
              latitude: values.latitude,
              longitude: values.longitude,
            };
            setRecentCargoes(current => {
              const next = [entry, ...current].slice(0, 30);
              AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
              return next;
            });
          }}
        />

        <ThemedView type="backgroundElement" style={styles.listCard}>
          <ThemedText type="subtitle">Cadastros recentes</ThemedText>
          <View style={styles.listContent}>
            {recentCargoes.map(item => (
              <Pressable key={item.cargoCode} onPress={() => setSelected(item)}>
                <ThemedView style={styles.listItem}>
                  <ThemedText type="smallBold">{item.cargoCode}</ThemedText>
                  <ThemedText themeColor="textSecondary" type="small">
                    {item.origin} → {item.destination}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </View>
        </ThemedView>
        <DetailsModal visible={!!selected} onClose={() => setSelected(null)} title={selected?.cargoCode}>
          {selected ? (
            <>
              <ThemedText type="smallBold">Origem</ThemedText>
              <ThemedText>{selected.origin}</ThemedText>

              <ThemedText type="smallBold">Destino</ThemedText>
              <ThemedText>{selected.destination}</ThemedText>

              {selected.latitude !== undefined && selected.longitude !== undefined ? (
                <>
                  <ThemedText type="smallBold">Coordenadas</ThemedText>
                  <ThemedText>{`${selected.latitude.toFixed(5)}, ${selected.longitude.toFixed(5)}`}</ThemedText>
                </>
              ) : null}

              <ThemedText type="smallBold">Código</ThemedText>
              <ThemedText>{selected.cargoCode}</ThemedText>
            </>
          ) : null}
        </DetailsModal>
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
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(0, 210, 255, 0.06)',
  },
  pressed: {
    opacity: 0.85,
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