import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors, type MemberColor } from '@/theme';

type Props = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  color?: MemberColor;
  disabled?: boolean;
};

export function Checkbox({ checked, onChange, color = 'sage', disabled }: Props) {
  const tint = colors[color];
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={8}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      style={[styles.box, { borderColor: tint }, checked && { backgroundColor: tint }, disabled && styles.disabled]}>
      {checked && <Check size={16} color={colors.surface} strokeWidth={3} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: { opacity: 0.4 },
  box: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
