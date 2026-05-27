import { useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { useTheme } from '@/hooks/use-theme';

type SatelliteStatusChartProps = {
  labels: string[];
  values: number[];
  height?: number;
};

export function SatelliteStatusChart({ labels, values, height = 240 }: SatelliteStatusChartProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(280, Math.min(width - 48, 720));

  return (
    <LineChart
      data={{
        labels,
        datasets: [
          {
            data: values,
            color: () => theme.primary,
            strokeWidth: 3,
          },
        ],
      }}
      width={chartWidth}
      height={height}
      withDots
      bezier
      fromZero
      chartConfig={{
        backgroundColor: theme.backgroundElement,
        backgroundGradientFrom: theme.backgroundElement,
        backgroundGradientTo: theme.backgroundElement,
        decimalPlaces: 0,
        color: () => theme.primary,
        labelColor: () => theme.textSecondary,
        propsForDots: {
          r: '4',
          strokeWidth: '2',
          stroke: theme.primary,
        },
        propsForBackgroundLines: {
          strokeDasharray: '',
          stroke: theme.backgroundSelected,
        },
      }}
      style={{ borderRadius: 24 }}
    />
  );
}