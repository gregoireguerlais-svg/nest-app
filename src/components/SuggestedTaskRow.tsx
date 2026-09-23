import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme';
import type { Task } from '@/types';

type Props = {
  task: Task;
  onPress: () => void;
};

/** Ligne d'une suggestion pas encore configurée : tap pour l'assigner et l'activer. */
export function SuggestedTaskRow({ task, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.body}>
        <AppText numberOfLines={1}>{task.name}</AppText>
        <AppText variant="caption" muted>
          Suggestion · à configurer
        </AppText>
      </View>
      <View style={styles.addIcon}>
        <Plus size={16} color={colors.sage} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  body: { flex: 1, gap: 2 },
  addIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
