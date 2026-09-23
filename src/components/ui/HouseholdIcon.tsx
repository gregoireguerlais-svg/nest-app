import { Flower2, Heart, House, Leaf, Sparkles, Sun, type LucideIcon } from 'lucide-react-native';

import { NestMark } from '@/components/ui/NestMark';
import { colors } from '@/theme';

/** Icônes disponibles pour un foyer, proposées à l'onboarding. */
export const householdIcons: Record<string, LucideIcon> = {
  house: House,
  heart: Heart,
  sun: Sun,
  leaf: Leaf,
  sparkles: Sparkles,
  flower: Flower2,
};

type Props = { icon: string; size?: number };

/** Affiche l'icône du foyer. "nest" (données de démo) affiche l'emblème de l'app. */
export function HouseholdIcon({ icon, size = 24 }: Props) {
  if (icon === 'nest') return <NestMark size={size} />;
  const Icon = householdIcons[icon] ?? House;
  return <Icon size={size} color={colors.sage} strokeWidth={1.75} />;
}
