import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme';
import type { Member, ThankYou } from '@/types';

type Props = {
  thankYous: ThankYou[];
  members: Member[];
  onDismiss: (id: string) => void;
};

/** Mini-inbox des remerciements reçus et pas encore lus, pour le profil actif. */
export function ThankYouBanner({ thankYous, members, onDismiss }: Props) {
  if (thankYous.length === 0) return null;

  return (
    <View style={styles.stack}>
      {thankYous.map((t) => {
        const from = members.find((m) => m.id === t.fromMemberId);
        const soft = from?.color === 'terracotta' ? colors.terracottaSoft : colors.sageSoft;
        return (
          <Pressable
            key={t.id}
            accessibilityRole="button"
            accessibilityLabel="Marquer ce remerciement comme lu"
            onPress={() => onDismiss(t.id)}
            style={[styles.banner, { backgroundColor: soft }]}>
            <AppText>
              💌 {from?.name} te remercie : « {t.message} »
            </AppText>
            <AppText variant="caption" muted>
              Touche pour marquer comme lu
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.sm },
  banner: { borderRadius: radius.card, padding: spacing.md, gap: 4 },
});
