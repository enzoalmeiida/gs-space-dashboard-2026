import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

export function DetailsModal({ visible, onClose, title, children }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="subtitle">{title ?? 'Detalhes'}</ThemedText>
            <Pressable onPress={onClose} style={({ pressed }) => [{ padding: Spacing.one, opacity: pressed ? 0.7 : 1 }]}>
              <ThemedText type="smallBold">Fechar</ThemedText>
            </Pressable>
          </View>

          <View style={styles.content}>{children}</View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  container: {
    padding: Spacing.four,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  content: {
    gap: Spacing.two,
  },
});

export default DetailsModal;
