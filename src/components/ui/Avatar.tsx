import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, type MemberColor } from '@/theme';

type Props = { name: string; color: MemberColor; size?: number };

export function Avatar({ name, color, size = 44 }: Props) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors[color] },
      ]}>
      <Text style={[styles.initial, { fontSize: size * 0.45 }]}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.bold, color: colors.surface },
});
