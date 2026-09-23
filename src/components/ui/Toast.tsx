import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme';

type Props = {
  message: string | null;
  onHide: () => void;
};

/** Petit message de confirmation qui s'efface tout seul après quelques secondes. */
export function Toast({ message, onHide }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, 2500);
    return () => clearTimeout(timer);
  }, [message, onHide]);

  if (!message) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.toast}>
        <AppText style={styles.text}>{message}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.xl,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    maxWidth: '85%',
  },
  text: { color: colors.surface },
});
