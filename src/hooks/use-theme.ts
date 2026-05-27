import { useAppPreferences } from '@/context/app-preferences-context';

export function useTheme() {
  const { palette } = useAppPreferences();

  return palette;
}
