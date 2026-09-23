import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

type Props = { size?: number };

/** Scène de bienvenue : une maison chaleureuse avec fenêtre, porte et petite plante — porté fidèlement du design. */
export function HomeScene({ size = 230 }: Props) {
  return (
    <Svg width={size} height={size * 0.82} viewBox="0 0 230 190" fill="none">
      <Ellipse cx={115} cy={172} rx={96} ry={16} fill={colors.sageFill} opacity={0.12} />

      {/* corps de la maison */}
      <Rect x={58} y={78} width={114} height={92} rx={14} fill={colors.surface} stroke={colors.sage} strokeWidth={3} />

      {/* toit */}
      <Path
        d="M48 84 L115 36 L182 84"
        stroke={colors.sage}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M58 80 L115 39 L172 80 Z" fill={colors.sageFill} opacity={0.22} />

      {/* fenêtre ronde */}
      <Circle cx={115} cy={108} r={20} fill={colors.background} stroke={colors.sage} strokeWidth={2.6} />
      <Path d="M115 88 L115 128 M95 108 L135 108" stroke={colors.sage} strokeWidth={2} opacity={0.5} />

      {/* porte */}
      <Rect x={98} y={142} width={34} height={28} rx={8} fill={colors.sageFill} opacity={0.3} />
      <Rect x={98} y={142} width={34} height={28} rx={8} fill="none" stroke={colors.sage} strokeWidth={2.6} />
      <Circle cx={124} cy={157} r={2.2} fill={colors.sage} />

      {/* petite plante */}
      <Path d="M170 170 L170 150" stroke={colors.sage} strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx={170} cy={146} r={8} fill={colors.sageFill} opacity={0.5} />
      <Circle cx={161} cy={152} r={6} fill={colors.sageFill} opacity={0.4} />
      <Rect x={162} y={168} width={16} height={6} rx={3} fill={colors.border} />

      {/* petits nuages cocooning */}
      <Circle cx={150} cy={60} r={5} fill={colors.sageFill} opacity={0.25} />
      <Circle cx={160} cy={48} r={4} fill={colors.sageFill} opacity={0.18} />
    </Svg>
  );
}
