import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  delay?: number;
  highlight?: string;
};

export function MetricCard({ title, value, subtitle, delay = 0, highlight }: MetricCardProps) {
  return (
    <Animated.View entering={FadeInUp.duration(600).delay(delay)}>
      <ThemedView style={styles.card}>
        <View style={styles.headerRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {title}
          </ThemedText>
          {highlight ? (
            <ThemedView style={styles.badge}>
              <ThemedText type="code" themeColor="text">
                {highlight}
              </ThemedText>
            </ThemedView>
          ) : null}
        </View>

        <ThemedText type="subtitle" style={styles.value}>
          {value}
        </ThemedText>

        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    padding: Spacing.four,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.12)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  value: {
    marginTop: Spacing.one,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 210, 255, 0.15)',
  },
});