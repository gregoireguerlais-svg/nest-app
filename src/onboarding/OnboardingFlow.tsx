import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categories } from '@/data/catalog';
import { buildFreshData } from '@/data/onboarding';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { householdIcons } from '@/components/ui/HouseholdIcon';
import { NestMark } from '@/components/ui/NestMark';
import { HomeScene } from '@/onboarding/HomeScene';
import { colors, fonts, radius, spacing, type MemberColor } from '@/theme';
import type { AppData, Member } from '@/types';

const HOUSEHOLD_ICON_ENTRIES = Object.entries(householdIcons);

const MEMBER_COLORS: MemberColor[] = ['sage', 'terracotta'];

type Step = 'splash' | 'welcome' | 'household' | 'members' | 'categories';

type MemberDraft = { name: string; color: MemberColor };

type Props = { onComplete: (data: AppData) => void };

export function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('splash');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(HOUSEHOLD_ICON_ENTRIES[0][0]);
  const [memberDrafts, setMemberDrafts] = useState<MemberDraft[]>([
    { name: '', color: 'sage' },
    { name: '', color: 'terracotta' },
  ]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const membersReady = memberDrafts.every((m) => m.name.trim());

  const setMemberName = (index: number, value: string) =>
    setMemberDrafts((current) => current.map((m, i) => (i === index ? { ...m, name: value } : m)));

  // Les deux profils doivent rester distinguables : si on prend la couleur de l'autre, elle lui rend la sienne.
  const setMemberColor = (index: number, color: MemberColor) =>
    setMemberDrafts((current) => {
      const other = index === 0 ? 1 : 0;
      const next = [...current];
      if (current[other].color === color) next[other] = { ...next[other], color: current[index].color };
      next[index] = { ...next[index], color };
      return next;
    });

  const toggleCategory = (id: string) =>
    setCategoryIds((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));

  const finish = () => {
    const members: Member[] = memberDrafts.map((m, i) => ({
      id: `member-${i + 1}`,
      name: m.name.trim(),
      avatarIcon: m.color,
      color: m.color,
    }));
    onComplete(buildFreshData(name.trim(), icon, categoryIds, members));
  };

  if (step === 'splash') {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable accessibilityRole="button" style={styles.splash} onPress={() => setStep('welcome')}>
          <View style={styles.splashLogo}>
            <NestMark size={52} />
          </View>
          <AppText style={styles.splashTitle}>Nest</AppText>
          <AppText style={styles.splashSubtitle}>GESTION DU FOYER</AppText>
          <View style={styles.splashHint}>
            <View style={styles.splashDot} />
            <AppText variant="caption" style={styles.splashHintText}>Appuyez pour commencer</AppText>
          </View>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === 'welcome' && (
          <View style={styles.center}>
            <HomeScene />
            <AppText variant="title" style={styles.centerText}>Gérez votre foyer,{'\n'}ensemble.</AppText>
            <AppText muted style={styles.centerText}>
              Partagez les tâches du quotidien avec votre partenaire, sans charge mentale.
            </AppText>
            <Button label="Créer mon foyer" onPress={() => setStep('household')} />
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Bientôt disponible',
                  'La synchronisation entre appareils pour rejoindre un foyer existant arrive dans une prochaine version 🌱',
                )
              }>
              <AppText style={styles.link}>J’ai déjà un foyer</AppText>
            </Pressable>
          </View>
        )}

        {step === 'household' && (
          <View style={styles.step}>
            <AppText variant="title">Votre foyer</AppText>
            <AppText muted>Donnez-lui un nom et une icône qui vous ressemblent.</AppText>

            <View style={styles.field}>
              <AppText variant="caption" muted>Nom du foyer</AppText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="ex : Notre nid"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <AppText variant="caption" muted>Icône</AppText>
              <View style={styles.iconGrid}>
                {HOUSEHOLD_ICON_ENTRIES.map(([key, Icon]) => {
                  const selected = key === icon;
                  return (
                    <Pressable
                      key={key}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setIcon(key)}
                      style={[styles.iconOption, selected && styles.iconOptionSelected]}>
                      <Icon size={24} color={selected ? colors.surface : colors.sage} strokeWidth={1.75} />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Button label="Continuer" onPress={() => setStep('members')} disabled={!name.trim()} />
          </View>
        )}

        {step === 'members' && (
          <View style={styles.step}>
            <AppText variant="title">Vos profils</AppText>
            <AppText muted>Les prénoms des deux personnes du foyer, et leur couleur.</AppText>

            {memberDrafts.map((m, index) => (
              <Card key={index} style={styles.memberCard}>
                <View style={styles.memberRow}>
                  <Avatar name={m.name || '?'} color={m.color} size={40} />
                  <TextInput
                    value={m.name}
                    onChangeText={(value) => setMemberName(index, value)}
                    placeholder={index === 0 ? 'ex : Grégoire' : 'ex : Marine'}
                    placeholderTextColor={colors.muted}
                    style={[styles.input, styles.grow]}
                  />
                </View>
                <View style={styles.wrap}>
                  {MEMBER_COLORS.map((c) => {
                    const selected = m.color === c;
                    return (
                      <Pressable
                        key={c}
                        accessibilityRole="button"
                        accessibilityLabel={c === 'sage' ? 'Vert sauge' : 'Terracotta'}
                        accessibilityState={{ selected }}
                        onPress={() => setMemberColor(index, c)}
                        style={[styles.swatch, { backgroundColor: colors[c] }, selected && styles.swatchSelected]}
                      />
                    );
                  })}
                </View>
              </Card>
            ))}

            <Button label="Continuer" onPress={() => setStep('categories')} disabled={!membersReady} />
          </View>
        )}

        {step === 'categories' && (
          <View style={styles.step}>
            <AppText variant="title">Vos catégories</AppText>
            <AppText muted>Choisissez celles qui concernent votre foyer. Vous pourrez en ajouter plus tard.</AppText>

            <View style={styles.wrap}>
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  icon={c.icon}
                  selected={categoryIds.includes(c.id)}
                  onPress={() => toggleCategory(c.id)}
                />
              ))}
            </View>

            <Button label="Terminer" onPress={finish} disabled={categoryIds.length === 0} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  center: { alignItems: 'center', gap: spacing.md },
  centerText: { textAlign: 'center' },
  link: { color: colors.sage, fontFamily: fonts.bold, fontSize: 15, textAlign: 'center' },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  splashLogo: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  splashTitle: { fontFamily: fonts.extrabold, fontSize: 44, color: colors.text },
  splashSubtitle: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 3, color: colors.sage },
  splashHint: {
    position: 'absolute',
    bottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  splashDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sage },
  splashHintText: { color: colors.sage },
  step: { gap: spacing.lg },
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
  grow: { flex: 1 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionSelected: { backgroundColor: colors.sage, borderColor: colors.sage },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  memberCard: { gap: spacing.md },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: colors.text },
});
