import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { spacing } from '@/theme';
import type { Member, Task } from '@/types';
import { formatFrequency } from '@/utils/schedule';

type Props = {
  task: Task;
  assignees: Member[];
  onPress: () => void;
};

/** Ligne d'une tâche déjà configurée, dans l'écran Tâches (pas de coche, on ouvre le détail). */
export function TaskCatalogRow({ task, assignees, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.body}>
          <AppText numberOfLines={1}>{task.name}</AppText>
          <AppText variant="caption" muted>
            {formatFrequency(task.frequency)}
          </AppText>
        </View>
        <View style={styles.avatars}>
          {assignees.map((m) => (
            <Avatar key={m.id} name={m.name} color={m.color} size={28} />
          ))}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
  body: { flex: 1, gap: 2 },
  avatars: { flexDirection: 'row', gap: 4 },
});
