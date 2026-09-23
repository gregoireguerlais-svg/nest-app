import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme';
import type { Member } from '@/types';

type Props = {
  members: Member[];
  currentId: string;
  onSwitch: (id: string) => void;
};

/** Deux avatars côte à côte : celui du profil actif est plus grand et entouré, l'autre est estompé. */
export function ProfileSwitcher({ members, currentId, onSwitch }: Props) {
  return (
    <View style={styles.row}>
      {members.map((m) => {
        const active = m.id === currentId;
        return (
          <Pressable
            key={m.id}
            accessibilityRole="button"
            accessibilityLabel={active ? `Profil actif : ${m.name}` : `Passer au profil de ${m.name}`}
            accessibilityState={{ selected: active }}
            onPress={() => !active && onSwitch(m.id)}
            style={[styles.item, active && [styles.itemActive, { borderColor: colors[m.color] }]]}>
            <Avatar name={m.name} color={m.color} size={active ? 44 : 32} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  item: { borderRadius: 999, padding: 2, opacity: 0.45 },
  itemActive: { borderWidth: 2, opacity: 1 },
});
