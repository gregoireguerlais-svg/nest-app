import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Checkbox } from '@/components/ui/Checkbox';
import { spacing } from '@/theme';
import type { Category, Member, Task } from '@/types';
import { formatFrequency } from '@/utils/schedule';

type Props = {
  task: Task;
  category?: Category;
  assignees: Member[];
  done: boolean;
  /** qui a fait la tâche, si elle est faite */
  doneBy?: Member;
  disabled?: boolean;
  onToggle: () => void;
  /** ouvre le détail de la tâche */
  onPress?: () => void;
};

export function TaskRow({ task, category, assignees, done, doneBy, disabled, onToggle, onPress }: Props) {
  const tint = doneBy?.color ?? assignees[0]?.color ?? 'sage';
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
    <Card style={[styles.card, done && styles.cardDone]}>
      <Checkbox checked={done} onChange={onToggle} color={tint} disabled={disabled} />
      <View style={styles.body}>
        <AppText style={done && styles.nameDone} numberOfLines={1}>
          {task.name}
        </AppText>
        <View style={styles.meta}>
          {category && <CategoryIcon name={category.icon} size={14} />}
          <AppText variant="caption" muted>
            {category?.name} · {formatFrequency(task.frequency)}
          </AppText>
        </View>
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
  cardDone: { opacity: 0.6 },
  body: { flex: 1, gap: 2 },
  nameDone: { textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatars: { flexDirection: 'row', gap: 4 },
});
