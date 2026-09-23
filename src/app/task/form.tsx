import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Chip } from '@/components/ui/Chip';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ensureCategoryEnabled, upsertTask } from '@/storage/actions';
import { useApp } from '@/storage/AppProvider';
import { colors, fonts, radius, spacing } from '@/theme';
import type { Frequency } from '@/types';
import { DAY_LABELS } from '@/utils/date';

const UNIT_OPTIONS: { value: Frequency['unit']; label: string }[] = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'An' },
];

export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, updateData } = useApp();
  const existing = id ? data.tasks.find((t) => t.id === id) : undefined;
  const isEditing = !!existing;

  const [name, setName] = useState(existing?.name ?? '');
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? data.categories[0]?.id ?? '');
  const [count, setCount] = useState(existing?.frequency.count ?? 1);
  const [unit, setUnit] = useState<Frequency['unit']>(existing?.frequency.unit ?? 'week');
  const [days, setDays] = useState<number[]>(existing?.frequency.days ?? []);
  const [assigneeIds, setAssigneeIds] = useState<string[]>(existing?.assigneeIds ?? []);
  const [error, setError] = useState<string | null>(null);

  const members = data.household.members;
  // Toutes les catégories sont proposées ici, même celles pas encore activées pour le foyer :
  // en choisir une l'active automatiquement (voir save()).
  const allCategories = data.categories;

  const toggleDay = (day: number) =>
    setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort()));

  const toggleAssignee = (memberId: string) =>
    setAssigneeIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    );

  const save = () => {
    if (!name.trim()) return setError('Donne un nom à la tâche.');
    if (!categoryId) return setError('Choisis une catégorie.');
    if (assigneeIds.length === 0) return setError('Assigne la tâche à au moins une personne.');

    const frequency: Frequency = { count, unit, ...(unit === 'week' && days.length ? { days } : {}) };
    updateData((d) => {
      const withTask = upsertTask(d, {
        id: existing?.id ?? `task-${Date.now()}`,
        name: name.trim(),
        categoryId,
        frequency,
        assigneeIds,
        isSuggested: false,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      });
      return ensureCategoryEnabled(withTask, categoryId);
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityLabel="Retour" hitSlop={12} onPress={() => router.back()} style={styles.back}>
          <ChevronLeft size={26} color={colors.sage} strokeWidth={1.75} />
        </Pressable>

        <AppText variant="title">{isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}</AppText>

        <View style={styles.field}>
          <AppText variant="caption" muted>Nom</AppText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="ex : Sortir les poubelles"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText variant="caption" muted>Catégorie</AppText>
          <View style={styles.wrap}>
            {allCategories.map((c) => {
              const selected = c.id === categoryId;
              return (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setCategoryId(c.id)}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}>
                  <CategoryIcon name={c.icon} size={18} />
                  <AppText variant="caption" style={selected && styles.categoryLabelSelected}>
                    {c.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <AppText variant="caption" muted>Fréquence</AppText>
          <View style={styles.stepperRow}>
            <Pressable
              accessibilityLabel="Diminuer"
              hitSlop={8}
              onPress={() => setCount((c) => Math.max(1, c - 1))}
              style={styles.stepperButton}>
              <Minus size={18} color={colors.sage} />
            </Pressable>
            <AppText variant="heading" style={styles.stepperValue}>{count}</AppText>
            <Pressable
              accessibilityLabel="Augmenter"
              hitSlop={8}
              onPress={() => setCount((c) => Math.min(30, c + 1))}
              style={styles.stepperButton}>
              <Plus size={18} color={colors.sage} />
            </Pressable>
            <View style={styles.grow}>
              <SegmentedControl options={UNIT_OPTIONS} value={unit} onChange={setUnit} />
            </View>
          </View>
        </View>

        {unit === 'week' && (
          <View style={styles.field}>
            <AppText variant="caption" muted>Jours (optionnel)</AppText>
            <View style={styles.wrap}>
              {DAY_LABELS.map((label, i) => (
                <Chip key={label} label={label} selected={days.includes(i)} onPress={() => toggleDay(i)} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.field}>
          <AppText variant="caption" muted>Assigné à</AppText>
          <View style={styles.wrap}>
            {members.map((m) => (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                accessibilityState={{ selected: assigneeIds.includes(m.id) }}
                onPress={() => toggleAssignee(m.id)}
                style={[
                  styles.memberChip,
                  { borderColor: colors[m.color] },
                  assigneeIds.includes(m.id) && { backgroundColor: colors[m.color] },
                ]}>
                <Avatar name={m.name} color={m.color} size={24} />
                <AppText
                  variant="caption"
                  style={assigneeIds.includes(m.id) ? styles.categoryLabelSelected : undefined}>
                  {m.name}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {error && (
          <AppText variant="caption" style={styles.error}>
            {error}
          </AppText>
        )}

        <Button label={isEditing ? 'Enregistrer' : 'Ajouter la tâche'} onPress={save} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  back: { alignSelf: 'flex-start', marginLeft: -6 },
  field: { gap: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: { backgroundColor: colors.sage, borderColor: colors.sage },
  categoryLabelSelected: { color: colors.surface },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { minWidth: 24, textAlign: 'center' },
  grow: { flex: 1 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  error: { color: colors.terracotta },
});
