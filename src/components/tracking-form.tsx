import { useState, type ComponentProps } from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TrackingFormValues = {
  cargoCode: string;
  origin: string;
  destination: string;
  satelliteWindow: string;
};

type TrackingFormProps = {
  onSubmit?: (values: TrackingFormValues & { latitude?: number; longitude?: number }) => void;
};

type FormErrors = Partial<Record<keyof TrackingFormValues, string>>;

const initialValues: TrackingFormValues = {
  cargoCode: '',
  origin: '',
  destination: '',
  satelliteWindow: '',
};

export function TrackingForm({ onSubmit }: TrackingFormProps) {
  const theme = useTheme();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  function updateField(field: keyof TrackingFormValues, nextValue: string) {
    setValues(current => ({ ...current, [field]: nextValue }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setSuccessMessage('');
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const cargoCode = values.cargoCode.trim().toUpperCase();
    const origin = values.origin.trim();
    const destination = values.destination.trim();
    const satelliteWindow = values.satelliteWindow.trim();

    if (!cargoCode) {
      nextErrors.cargoCode = 'Informe o código da carga.';
    } else if (!/^[A-Z0-9-]{5,}$/.test(cargoCode)) {
      nextErrors.cargoCode = 'Use ao menos 5 caracteres com letras, números ou hífen.';
    }

    if (origin.length < 3) {
      nextErrors.origin = 'Informe a origem da remessa.';
    }

    if (destination.length < 3) {
      nextErrors.destination = 'Informe o destino da remessa.';
    }

    if (!/^\d{2}:\d{2}$/.test(satelliteWindow)) {
      nextErrors.satelliteWindow = 'Use o formato 00:00 para a janela de captura.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    const normalizedValues = {
      cargoCode: values.cargoCode.trim().toUpperCase(),
      origin: values.origin.trim(),
      destination: values.destination.trim(),
      satelliteWindow: values.satelliteWindow.trim(),
    };

    onSubmit?.(normalizedValues);
    setSuccessMessage(`Carga ${normalizedValues.cargoCode} cadastrada com sucesso.`);
    setValues(initialValues);
  }

  async function useCurrentLocation() {
    try {
      if (Platform.OS === 'web') {
        if (!navigator?.geolocation) {
          Alert.alert('Erro', 'Geolocalização não está disponível neste navegador.');
          return;
        }
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords = pos.coords;
          setValues(current => ({ ...current, origin: current.origin || `Lat:${coords.latitude.toFixed(4)}`, destination: current.destination || `Lon:${coords.longitude.toFixed(4)}` }));
          setSuccessMessage('Localização capturada e aplicada ao formulário.');
        }, () => {
          Alert.alert('Erro', 'Não foi possível obter a localização.');
        });
        return;
      }

      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível obter a localização do dispositivo.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = pos.coords;
      // attach coords to form as origin/destination hint or submit with coords
      setValues(current => ({ ...current, origin: current.origin || `Lat:${coords.latitude.toFixed(4)}`, destination: current.destination || `Lon:${coords.longitude.toFixed(4)}` }));
      setSuccessMessage('Localização capturada e aplicada ao formulário.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    }
  }

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <Field
        theme={theme}
        label="Código da carga"
        placeholder="EX: SP-2048"
        value={values.cargoCode}
        onChangeText={text => updateField('cargoCode', text.toUpperCase())}
        error={errors.cargoCode}
      />

      <Field
        theme={theme}
        label="Origem"
        placeholder="Ex: Porto de Santos"
        value={values.origin}
        onChangeText={text => updateField('origin', text)}
        error={errors.origin}
      />

      <Field
        theme={theme}
        label="Destino"
        placeholder="Ex: Hub de Lisboa"
        value={values.destination}
        onChangeText={text => updateField('destination', text)}
        error={errors.destination}
      />

      <Field
        theme={theme}
        label="Janela de captura por satélite"
        placeholder="Ex: 14:30"
        value={values.satelliteWindow}
        keyboardType="numbers-and-punctuation"
        onChangeText={text => updateField('satelliteWindow', text)}
        error={errors.satelliteWindow}
      />

      <View style={{ flexDirection: 'row', gap: Spacing.two }}>
        <Pressable
          style={({ pressed }) => [styles.submitButton, pressed && styles.pressed, { flex: 1 }]}
          onPress={handleSubmit}>
          <ThemedText type="smallBold" style={styles.submitLabel}>
            Cadastrar carga
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, { paddingVertical: Spacing.three, paddingHorizontal: Spacing.three, borderRadius: Spacing.three }]}
          onPress={useCurrentLocation}>
          <ThemedText type="smallBold">Usar minha localização</ThemedText>
        </Pressable>
      </View>

      {successMessage ? (
        <ThemedView style={styles.successBox}>
          <ThemedText type="smallBold">{successMessage}</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            A operação foi registrada para acompanhamento em tempo real.
          </ThemedText>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

function Field({
  theme,
  label,
  error,
  ...props
}: { theme: ReturnType<typeof useTheme>; label: string; error?: string } & ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
          error && styles.inputError,
        ]}
        {...props}
      />
      {error ? (
        <ThemedText type="small" style={styles.errorText}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.five,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF8A3D',
  },
  errorText: {
    color: '#FF8A3D',
  },
  submitButton: {
    marginTop: Spacing.one,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#00D2FF',
  },
  submitLabel: {
    color: '#0B0D17',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
  },
  pressed: {
    opacity: 0.85,
  },
  successBox: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});