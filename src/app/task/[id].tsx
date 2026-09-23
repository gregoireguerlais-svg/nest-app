import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { deleteTask, toggleCompletion } from '@/storage/actions';
import { useApp } from '@/storage/AppProvider';
import { colors, spacing } from '@/theme';
import { capitalize, formatLongDate, parseDateKey, toDateKey } from '@/utils/date';
import { formatDays, formatFrequency } from '@/utils/schedule';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updateData } = useApp();

  const task = data.tasks.find((t) => t.id === id);
  // La tâche vient d'être supprimée : on laisse l'écran se refermer.
  if (!task) return null;

  const members = data.household.members;
  const category = data.categories.find((c) => c.id === task.categoryId);
  const assignees = members.filter((m) => task.assigneeIds.includes(m.id));
  const todayKey = toDateKey(new Date());
  const doneToday = data.completions.some((c) => c.taskId === task.id && c.date === todayKey);
  const days = formatDays(task.frequency);
  const history = data.completions
    .filter((c) => c.taskId === task.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 20);

  const confirmDelete = () =>
    Alert.alert('Supprimer cette tâche ?', 'Son historique sera aussi supprimé.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          router.back();
          updateData((d) => deleteTask(d, task.id));
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityLabel="Retour" hitSlop={12} onPress={() => router.back()} style={styles.back}>
          <ChevronLeft size={26} color={colors.sage} strokeWidth={1.75} />
        </Pressable>

        <AppText variant="title">{task.name}</AppText>

        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <AppText muted>Catégorie</AppText>
            <View style={styles.inline}>
              {category && <CategoryIcon name={category.icon} size={20} />}
              <AppText>{category?.name}</AppText>
            </View>
          </View>
          <View style={styles.infoRow}>
            <AppText muted>Fréquence</AppText>
            <AppText>{formatFrequency(task.frequency)}</AppText>
          </View>
          {days && (
            <View style={styles.infoRow}>
              <AppText muted>Jours</AppText>
              <AppText>{days}</AppText>
            </View>
          )}
          <View style={styles.infoRow}>
            <AppText muted>Assigné à</AppText>
            <View style={styles.inline}>
              {assignees.map((m) => (
                <View key={m.id} style={styles.inline}>
                  <Avatar name={m.name} color={m.color} size={28} />
                  <AppText>{m.name}</AppText>
                </View>
              ))}
              {assignees.length === 0 && <AppText muted>Personne</AppText>}
            </View>
          </View>
        </Card>

        <Button
          label={doneToday ? "Fait aujourd’hui ✓ (annuler)" : 'Marquer fait aujourd’hui'}
          variant={doneToday ? 'secondary' : 'primary'}
          onPress={() => updateData((d) => toggleCompletion(d, task.id, todayKey))}
        />

        <Button
          label="Modifier"
          variant="secondary"
          onPress={() => router.push({ pathname: '/task/form', params: { id: task.id } })}
        />

        <View style={styles.section}>
          <AppText variant="heading">Historique</AppText>
          {history.length === 0 ? (
            <AppText muted>Pas encore de trace, ça viendra 🌱</AppText>
          ) : (
            <Card style={styles.card}>
              {history.map((c) => {
                const who = members.find((m) => m.id === c.memberId);
                return (
                  <View key={c.id} style={styles.infoRow}>
                    <AppText>{capitalize(formatLongDate(parseDateKey(c.date)))}</AppText>
                    <View style={styles.inline}>
                      {who && <Avatar name={who.name} color={who.color} size={24} />}
                      <AppText muted>{who?.name}</AppText>
                    </View>
                  </View>
                );
              })}
            </Card>
          )}
        </View>

        <Pressable onPress={confirmDelete} style={styles.delete}>
          <AppText style={styles.deleteLabel}>Supprimer la tâche</AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  back: { alignSelf: 'flex-start', marginLeft: -6 },
  card: { gap: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  section: { gap: spacing.sm, marginTop: spacing.sm },
  delete: { alignItems: 'center', paddingVertical: spacing.md },
  deleteLabel: { color: colors.terracotta },
});
