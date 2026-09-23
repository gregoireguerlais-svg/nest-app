import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SplitBar } from '@/components/SplitBar';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { HouseholdIcon } from '@/components/ui/HouseholdIcon';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Toast } from '@/components/ui/Toast';
import { sendLocalThankYouNotification } from '@/notifications';
import { sendThankYou } from '@/storage/actions';
import { useApp } from '@/storage/AppProvider';
import { colors, spacing } from '@/theme';
import { completionsInPeriod, gratitudeMessage, shareByMember, type Period } from '@/utils/stats';

export default function StatsScreen() {
  const { data, updateData } = useApp();
  const [period, setPeriod] = useState<Period>('week');
  const [toast, setToast] = useState<string | null>(null);
  const today = new Date();

  const members = data.household.members;
  const current = members.find((m) => m.id === data.currentMemberId)!;
  const partner = members.find((m) => m.id !== data.currentMemberId)!;
  const enabledCategories = data.categories.filter((c) => data.household.categoryIds.includes(c.id));
  const periodLabel = period === 'week' ? 'cette semaine' : 'ce mois-ci';

  const periodCompletions = completionsInPeriod(data.completions, period, today);
  const overallShares = shareByMember(members, periodCompletions);
  const message = gratitudeMessage(overallShares, periodLabel);
  const partnerCount = overallShares.find((s) => s.member.id === partner.id)?.count ?? 0;

  const thankPartner = () => {
    updateData((d) => sendThankYou(d, current.id, partner.id));
    setToast(`Merci envoyé à ${partner.name} 💚`);
    sendLocalThankYouNotification('Merci envoyé 💚', `${current.name} remercie ${partner.name}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="title">Stats</AppText>

        <SegmentedControl
          options={[
            { value: 'week', label: 'Semaine' },
            { value: 'month', label: 'Mois' },
          ]}
          value={period}
          onChange={setPeriod}
        />

        <View style={styles.header}>
          <HouseholdIcon icon={data.household.icon} size={22} />
          <AppText variant="heading">{data.household.name}</AppText>
        </View>

        <Card style={styles.card}>
          <AppText variant="heading">Répartition</AppText>
          <SplitBar shares={overallShares} />
          <View style={styles.legend}>
            {overallShares.map((s) => (
              <View key={s.member.id} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: colors[s.member.color] }]} />
                <AppText variant="caption">
                  {s.member.name} · {s.percent}% ({s.count})
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <AppText>{message}</AppText>
          {partnerCount > 0 && (
            <Button label={`Remercier ${partner.name}`} variant="secondary" onPress={thankPartner} />
          )}
        </Card>

        <View style={styles.section}>
          <AppText variant="heading">Détail par catégorie</AppText>
          {enabledCategories.map((category) => {
            const taskIds = new Set(data.tasks.filter((t) => t.categoryId === category.id).map((t) => t.id));
            const categoryCompletions = periodCompletions.filter((c) => taskIds.has(c.taskId));
            const shares = shareByMember(members, categoryCompletions);
            const total = categoryCompletions.length;
            return (
              <Card key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <CategoryIcon name={category.icon} size={18} />
                  <AppText style={styles.grow}>{category.name}</AppText>
                  <AppText variant="caption" muted>
                    {total === 0 ? 'Rien pour l’instant' : `${total} fait${total > 1 ? 'es' : 'e'}`}
                  </AppText>
                </View>
                <SplitBar shares={shares} height={8} />
              </Card>
            );
          })}
        </View>
      </ScrollView>
      <Toast message={toast} onHide={() => setToast(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  card: { gap: spacing.md },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  section: { gap: spacing.sm, marginTop: spacing.sm },
  categoryCard: { gap: spacing.sm },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  grow: { flex: 1 },
});
