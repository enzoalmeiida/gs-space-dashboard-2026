import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { fetchWeatherByCoords, WeatherInfo } from '@/utils/weatherService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type Props = {
  lat?: number;
  lon?: number;
};

export function WeatherCard({ lat, lon }: Props) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (lat == null || lon == null) return;
      setLoading(true);
      const w = await fetchWeatherByCoords(lat, lon);
      if (mounted) setWeather(w);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [lat, lon]);

  return (
    <ThemedView style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="subtitle">Clima local</ThemedText>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : weather ? (
        <View>
          <ThemedText type="title">{Math.round(weather.tempC)}°C</ThemedText>
          <ThemedText themeColor="textSecondary">{weather.description}</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">{weather.location}</ThemedText>
        </View>
      ) : (
        <ThemedText themeColor="textSecondary">Nenhum dado disponível</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(0,210,255,0.08)'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WeatherCard;
