import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SatelliteStatusChart } from '@/components/charts/satellite-status-chart';
import SatelliteImageViewer from '@/components/satellite-image-viewer';
import { MetricCard } from '@/components/metric-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { mockTelemetryApiResponse } from '@/utils/mockData';

export default function HomeScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [snapshot, setSnapshot] = useState<typeof mockTelemetryApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pieChartWidth = Math.max(280, Math.min(width - 48, 720));
  const contentWidth = Math.min(MaxContentWidth, width - Spacing.four * 2);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSnapshot(mockTelemetryApiResponse);
      setIsLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroCard}>
          <ThemedText type="code" themeColor="textSecondary">
            ECOSSISTEMA ESPACIAL
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Dashboard central de logística global
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.heroDescription}>
            Rastreamento em tempo real com dados de satélite, clima de rota e telemetria da frota.
          </ThemedText>

          <View style={styles.quickActions}>
            <Link href="/tracking" asChild>
              <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold">Novo rastreio</ThemedText>
              </Pressable>
            </Link>
            <Link href="/settings" asChild>
              <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold">Configurações</ThemedText>
              </Pressable>
            </Link>
          </View>
        </ThemedView>

        <View style={[styles.metricsGrid, { maxWidth: contentWidth }] }>
          <MetricCard
            title="Sinal do Satélite"
            value={snapshot ? `${snapshot.fleetSummary.averageSignalStrength}%` : '...'}
            subtitle="Qualidade média do enlace orbital"
            highlight="LIVE"
            delay={80}
          />
          <MetricCard
            title="Cargas em Trânsito"
            value={snapshot ? snapshot.fleetSummary.loadsInTransit.toString() : '...'}
            subtitle="Carga ativa aguardando confirmação de entrega"
            highlight="OPS"
            delay={160}
          />
          <MetricCard
            title="Alertas Climáticos"
            value={snapshot ? snapshot.fleetSummary.loadsWithAlerts.toString() : '...'}
            subtitle="Rotas com anomalias térmicas ou tempestades"
            highlight="WARN"
            delay={240}
          />
        </View>

        <View style={[styles.chartRow, { maxWidth: contentWidth }] }>
          <ThemedView style={styles.chartCard}>
            <View style={styles.sectionHeader}>
              <View>
                <ThemedText type="subtitle">Variação térmica da rota</ThemedText>
                <ThemedText themeColor="textSecondary">
                  {isLoading
                    ? 'Sincronizando telemetria orbital...'
                    : `Última leitura em ${snapshot?.generatedAt}`}
                </ThemedText>
              </View>
              <ThemedText type="code" themeColor="textSecondary">
                ROUTE TEMP
              </ThemedText>
            </View>

            {snapshot ? (
              <View style={{ width: '100%' }}>
                <SatelliteStatusChart
                  labels={snapshot.routes[0].temperatureSeries.map(item => item.timestamp)}
                  values={snapshot.routes[0].temperatureSeries.map(item => item.temperatureCelsius)}
                  height={260}
                />

                <View style={{ marginTop: Spacing.three }}>
                  <SatelliteImageViewer uri={snapshot.routes[0].latestImageUri} aspect={16 / 9} />
                </View>
              </View>
            ) : (
              <ThemedView type="backgroundElement" style={styles.chartPlaceholder}>
                <ThemedText themeColor="textSecondary">Carregando dados do satélite...</ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView style={styles.chartCard}>
            <View style={styles.sectionHeader}>
              <View>
                <ThemedText type="subtitle">Status operacional da frota</ThemedText>
                <ThemedText themeColor="textSecondary">
                  Distribuição dos nós conectados à constelação.
                </ThemedText>
              </View>
              <ThemedText type="code" themeColor="textSecondary">
                FLEET STATUS
              </ThemedText>
            </View>

            {snapshot ? (
              <PieChart
                data={[...snapshot.operationalStatusBreakdown]}
                width={pieChartWidth}
                height={240}
                chartConfig={{
                  backgroundColor: theme.backgroundElement,
                  backgroundGradientFrom: theme.backgroundElement,
                  backgroundGradientTo: theme.backgroundElement,
                  color: () => theme.primary,
                  labelColor: () => theme.textSecondary,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="12"
                center={[8, 0]}
                absolute
              />
            ) : (
              <ThemedView type="backgroundElement" style={styles.chartPlaceholder}>
                <ThemedText themeColor="textSecondary">Carregando gráfico operacional...</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.four,
  },
  title: {
    maxWidth: 520,
  },
  chartRow: {
    gap: Spacing.four,
  },
  heroCard: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.12)',
  },
  heroDescription: {
    maxWidth: 540,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  primaryButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    backgroundColor: '#00D2FF',
  },
  secondaryButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
  },
  pressed: {
    opacity: 0.85,
  },
  metricsGrid: {
    gap: Spacing.three,
    flexDirection: Platform.select({ default: 'column', web: 'row' }),
  },
  chartCard: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.12)',
  },
  sectionHeader: {
    gap: Spacing.two,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  chartPlaceholder: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
    borderRadius: Spacing.three,
  },
});