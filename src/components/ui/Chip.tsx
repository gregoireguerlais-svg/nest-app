import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CategoryIcon, type CategoryIconKey } from '@/components/ui/CategoryIcon';
import { colors, fonts, radius, type MemberColor } from '@/theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: MemberColor;
  icon?: CategoryIconKey;
  /** 'sm' pour des filtres compacts (ex : catégories) */
  size?: 'md' | 'sm';
};

export function Chip({ label, selected, onPress, color = 'sage', icon, size = 'md' }: Props) {
  const tint = colors[color];
  const compact = size === 'sm';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        compact && styles.chipCompact,
        { borderColor: tint },
        selected && { backgroundColor: tint },
      ]}>
      {icon && (
        <View style={styles.icon}>
          <CategoryIcon name={icon} size={compact ? 13 : 16} color={selected ? colors.surface : tint} />
        </View>
      )}
      <Text style={[styles.label, compact && styles.labelCompact, { color: selected ? colors.surface : tint }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  chipCompact: { paddingHorizontal: 10, paddingVertical: 6 },
  icon: { marginRight: 5 },
  label: { fontFamily: fonts.semibold, fontSize: 14 },
  labelCompact: { fontSize: 12 },
});
