import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SuggestedTaskRow } from '@/components/SuggestedTaskRow';
import { TaskCatalogRow } from '@/components/TaskCatalogRow';
import { AppText } from '@/components/ui/AppText';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Chip } from '@/components/ui/Chip';
import { Fab } from '@/components/ui/Fab';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useApp } from '@/storage/AppProvider';
import { colors, spacing } from '@/theme';

export default function TasksScreen() {
  const { data } = useApp();
  // Vide = "Toutes". Sinon, une catégorie touchée s'ajoute à la sélection ; la retoucher l'enlève.
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [memberFilter, setMemberFilter] = useState<string>('all');

  const toggleCategoryFilter = (id: string) =>
    setCategoryFilter((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));

  const members = data.household.members;
  const enabledCategories = data.categories.filter((c) => data.household.categoryIds.includes(c.id));
  const categoriesToShow =
    categoryFilter.length === 0 ? enabledCategories : enabledCategories.filter((c) => categoryFilter.includes(c.id));
  const memberOptions = [
    { value: 'all', label: 'Nous' },
    ...members.map((m) => ({ value: m.id, label: m.name })),
  ];

  const sections = categoriesToShow
    .map((category) => ({
      category,
      configured: data.tasks.filter(
        (t) =>
          t.categoryId === category.id &&
          !t.isSuggested &&
          (memberFilter === 'all' || t.assigneeIds.includes(memberFilter)),
      ),
      // Une suggestion n'est encore assignée à personne : elle ne concerne que la vue "Nous".
      suggested:
        memberFilter === 'all' ? data.tasks.filter((t) => t.categoryId === category.id && t.isSuggested) : [],
    }))
    .filter(({ configured, suggested }) => configured.length > 0 || suggested.length > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="title">Tâches</AppText>

        <View style={styles.filters}>
          <Chip label="Toutes" size="sm" selected={categoryFilter.length === 0} onPress={() => setCategoryFilter([])} />
          {enabledCategories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              icon={c.icon}
              size="sm"
              selected={categoryFilter.includes(c.id)}
              onPress={() => toggleCategoryFilter(c.id)}
            />
          ))}
        </View>

        <SegmentedControl options={memberOptions} value={memberFilter} onChange={setMemberFilter} />

        {sections.length === 0 && (
          <AppText muted>Aucune tâche pour ce filtre.</AppText>
        )}

        {sections.map(({ category, configured, suggested }) => {
          return (
            <View key={category.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <CategoryIcon name={category.icon} size={20} />
                <AppText variant="heading">{category.name}</AppText>
              </View>

              <View style={styles.list}>
                {configured.map((task) => (
                  <TaskCatalogRow
                    key={task.id}
                    task={task}
                    assignees={members.filter((m) => task.assigneeIds.includes(m.id))}
                    onPress={() => router.push({ pathname: '/task/[id]', params: { id: task.id } })}
                  />
                ))}
                {suggested.map((task) => (
                  <SuggestedTaskRow
                    key={task.id}
                    task={task}
                    onPress={() => router.push({ pathname: '/task/form', params: { id: task.id } })}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Fab onPress={() => router.push('/task/form')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, gap: spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  list: { gap: spacing.sm },
});
