import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

type Props = { size?: number };

/** Emblème du logo : un nid qui berce une petite maison avec un cœur — porté fidèlement du design. */
export function NestMark({ size = 64 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* nid */}
      <Path d="M10 38 Q32 60 54 38" stroke={colors.sage} strokeWidth={3.2} strokeLinecap="round" fill="none" />
      <Path
        d="M15 41 Q32 56 49 41"
        stroke={colors.sage}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
      {/* petite maison */}
      <Path
        d="M32 12 L48 26 L48 41 Q48 43 46 43 L18 43 Q16 43 16 41 L16 26 Z"
        fill={colors.sageFill}
        opacity={0.18}
      />
      <Path
        d="M14 27 L32 12 L50 27"
        stroke={colors.sage}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M18 26 L18 42 L46 42 L46 26"
        stroke={colors.sage}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* cœur-nichée */}
      <Path
        d="M32 38 C28.5 34.5 26.5 32.8 26.5 30.6 C26.5 29 27.8 28 29.2 28 C30.3 28 31.4 28.7 32 29.8 C32.6 28.7 33.7 28 34.8 28 C36.2 28 37.5 29 37.5 30.6 C37.5 32.8 35.5 34.5 32 38 Z"
        fill={colors.sageFill}
      />
    </Svg>
  );
}
