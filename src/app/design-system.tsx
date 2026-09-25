import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryIcon, type CategoryIconKey } from '@/components/ui/CategoryIcon';
import { Checkbox } from '@/components/ui/Checkbox';
import { useApp } from '@/storage/AppProvider';
import { colors, spacing } from '@/theme';

const categories: { key: CategoryIconKey; label: string }[] = [
  { key: 'home', label: 'Maison' },
  { key: 'children', label: 'Enfants' },
  { key: 'admin', label: 'Administratif' },
  { key: 'pets', label: 'Animaux' },
  { key: 'works', label: 'Travaux' },
];

// Vitrine du design system, réservée au développement : en production (site web, testeurs),
// cette adresse ramène simplement à l'accueil.
export default function DesignSystemScreen() {
  return __DEV__ ? <DesignSystemPreview /> : <Redirect href="/" />;
}

function DesignSystemPreview() {
  const [done, setDone] = useState(false);
  const [doneMarine, setDoneMarine] = useState(true);
  const { data, updateData, resetToDemo } = useApp();
  const current = data.household.members.find((m) => m.id === data.currentMemberId)!;
  const other = data.household.members.find((m) => m.id !== data.currentMemberId)!;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="title">Nest 🪺</AppText>
        <AppText muted>Design system — aperçu</AppText>

        <Card style={styles.card}>
          <AppText variant="heading">Données locales (étape 3)</AppText>
          <AppText>Foyer : {data.household.name}</AppText>
          <AppText>
            {data.tasks.filter((t) => !t.isSuggested).length} tâches ·{' '}
            {data.tasks.filter((t) => t.isSuggested).length} suggestions ·{' '}
            {data.completions.length} complétions
          </AppText>
          <View style={styles.row}>
            <Avatar name={current.name} color={current.color} size={32} />
            <AppText style={styles.grow}>Profil actif : {current.name}</AppText>
          </View>
          <Button
            label={`Passer à ${other.name}`}
            variant="secondary"
            onPress={() => updateData((d) => ({ ...d, currentMemberId: other.id }))}
          />
          <Button label="Réinitialiser les données de démo" variant="secondary" onPress={resetToDemo} />
        </Card>

        <Card style={styles.card}>
          <AppText variant="heading">Avatars</AppText>
          <View style={styles.row}>
            <Avatar name="Grégoire" color="sage" />
            <Avatar name="Marine" color="terracotta" />
          </View>
        </Card>

        <Card style={styles.card}>
          <AppText variant="heading">Tâches</AppText>
          <View style={styles.row}>
            <Checkbox checked={done} onChange={setDone} color="sage" />
            <AppText style={styles.grow}>Sortir les poubelles</AppText>
            <Avatar name="Grégoire" color="sage" size={32} />
          </View>
          <View style={styles.row}>
            <Checkbox checked={doneMarine} onChange={setDoneMarine} color="terracotta" />
            <AppText style={styles.grow}>Faire les courses</AppText>
            <Avatar name="Marine" color="terracotta" size={32} />
          </View>
        </Card>

        <Card style={styles.card}>
          <AppText variant="heading">Catégories</AppText>
          {categories.map((c) => (
            <View key={c.key} style={styles.row}>
              <CategoryIcon name={c.key} />
              <AppText>{c.label}</AppText>
            </View>
          ))}
        </Card>

        <Button label="Ajouter une tâche" onPress={() => {}} />
        <Button label="Plus tard" variant="secondary" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  grow: { flex: 1 },
});
