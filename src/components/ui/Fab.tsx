import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors, spacing } from '@/theme';

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Bouton rond fixé en bas à droite, toujours visible même en scrollant. */
export function Fab({ onPress, accessibilityLabel = 'Ajouter une tâche' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.fab}>
      <Plus size={26} color={colors.surface} strokeWidth={2.25} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
