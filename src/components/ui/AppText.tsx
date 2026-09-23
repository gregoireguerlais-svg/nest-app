import { Text, type TextProps, StyleSheet } from 'react-native';

import { colors, fonts } from '@/theme';

type Variant = 'title' | 'heading' | 'body' | 'caption';

type Props = TextProps & { variant?: Variant; muted?: boolean };

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  return <Text style={[styles[variant], muted && styles.muted, style]} {...rest} />;
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.extrabold, fontSize: 30, color: colors.text },
  heading: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  caption: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  muted: { color: colors.muted },
});
