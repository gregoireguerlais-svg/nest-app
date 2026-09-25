import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { TaskRow } from '@/components/TaskRow';
import { ThankYouBanner } from '@/components/ThankYouBanner';
import { WeekStrip } from '@/components/WeekStrip';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { markThankYouRead, toggleCompletion } from '@/storage/actions';
import { useApp } from '@/storage/AppProvider';
import { colors, radius, spacing } from '@/theme';
import type { Task } from '@/types';
import { formatLongDate, toDateKey } from '@/utils/date';
import { isTaskShownOn } from '@/utils/schedule';

type Filter = 'all' | 'me';

export default function DashboardScreen() {
  const { data, updateData, resetToDemo, restartOnboarding } = useApp();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [filter, setFilter] = useState<Filter>('all');

  const members = data.household.members;
  const current = members.find((m) => m.id === data.currentMemberId)!;
  const unreadThankYous = data.thankYous.filter((t) => t.toMemberId === current.id && !t.read);
  const dateKey = toDateKey(selectedDate);
  const isFuture = dateKey > toDateKey(today);

  const dueTasks = data.tasks.filter(
    (t) =>
      isTaskShownOn(t, selectedDate, data.completions, today) &&
      (filter === 'all' || t.assigneeIds.includes(current.id)),
  );
  const completionOf = (task: Task) =>
    data.completions.find((c) => c.taskId === task.id && c.date === dateKey);
  const sorted = [...dueTasks].sort((a, b) => Number(!!completionOf(a)) - Number(!!completionOf(b)));
  const doneCount = dueTasks.filter((t) => completionOf(t)).length;

  const toggle = (task: Task) => updateData((d) => toggleCompletion(d, task.id, dateKey));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.grow}>
            <AppText variant="title" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              Bonjour {current.name}
            </AppText>
            <AppText muted>{formatLongDate(today)}</AppText>
          </View>
          <ProfileSwitcher
            members={members}
            currentId={data.currentMemberId}
            onSwitch={(id) => updateData((d) => ({ ...d, currentMemberId: id }))}
          />
        </View>

        <ThankYouBanner
          thankYous={unreadThankYous}
          members={members}
          onDismiss={(id) => updateData((d) => markThankYouRead(d, id))}
        />

        <WeekStrip selectedDate={selectedDate} today={today} onSelect={setSelectedDate} />

        <SegmentedControl
          options={[
            { value: 'all', label: 'Nous' },
            { value: 'me', label: 'Moi' },
          ]}
          value={filter}
          onChange={setFilter}
        />

        <Card style={styles.progressCard}>
          <AppText variant="heading">
            {dueTasks.length === 0
              ? 'Rien de prévu 🌿'
              : doneCount === dueTasks.length
                ? 'Tout est fait, bravo 💚'
                : `${doneCount} sur ${dueTasks.length} faites`}
          </AppText>
          {dueTasks.length > 0 && (
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(doneCount / dueTasks.length) * 100}%` }]} />
            </View>
          )}
        </Card>

        {isFuture && (
          <AppText variant="caption" muted>
            Ce jour n’est pas encore arrivé : les tâches se cochent à partir d’aujourd’hui.
          </AppText>
        )}

        <View style={styles.list}>
          {sorted.map((task) => {
            const completion = completionOf(task);
            return (
              <TaskRow
                key={task.id}
                task={task}
                category={data.categories.find((c) => c.id === task.categoryId)}
                assignees={members.filter((m) => task.assigneeIds.includes(m.id))}
                done={!!completion}
                doneBy={members.find((m) => m.id === completion?.memberId)}
                disabled={isFuture}
                onToggle={() => toggle(task)}
                onPress={() => router.push({ pathname: '/task/[id]', params: { id: task.id } })}
              />
            );
          })}
        </View>

        <Button label="Ajouter une tâche" variant="secondary" onPress={() => router.push('/tasks')} />

        {/* Outils de démo temporaires, remplacés par les Paramètres plus tard */}
        <View style={styles.tools}>
          <Pressable onPress={resetToDemo}>
            <AppText variant="caption" muted>Réinitialiser les données de démo</AppText>
          </Pressable>
          <Pressable onPress={restartOnboarding}>
            <AppText variant="caption" muted>Recommencer l’onboarding</AppText>
          </Pressable>
          {__DEV__ && (
            <Link href="/design-system">
              <AppText variant="caption" muted>Aperçu du design system</AppText>
            </Link>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  grow: { flex: 1 },
  progressCard: { gap: spacing.sm },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.sageSoft, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.sage },
  list: { gap: spacing.sm },
  tools: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
});
