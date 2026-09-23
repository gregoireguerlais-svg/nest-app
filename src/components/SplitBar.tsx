import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';
import type { MemberShare } from '@/utils/stats';

type Props = { shares: MemberShare[]; height?: number };

/** Barre proportionnelle montrant la part de chaque membre. Grise si personne n'a rien fait. */
export function SplitBar({ shares, height = 12 }: Props) {
  const total = shares.reduce((sum, s) => sum + s.count, 0);
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      {total === 0 ? (
        <View style={styles.empty} />
      ) : (
        shares
          .filter((s) => s.percent > 0)
          .map((s) => (
            <View key={s.member.id} style={{ flex: s.percent, backgroundColor: colors[s.member.color] }} />
          ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', overflow: 'hidden', backgroundColor: colors.sageSoft, width: '100%' },
  empty: { flex: 1 },
});
