import { Baby, ClipboardList, House, PawPrint, Wrench, type LucideIcon } from 'lucide-react-native';

import { colors } from '@/theme';

export const categoryIcons = {
  home: House,
  children: Baby,
  admin: ClipboardList,
  pets: PawPrint,
  works: Wrench,
} satisfies Record<string, LucideIcon>;

export type CategoryIconKey = keyof typeof categoryIcons;

type Props = { name: CategoryIconKey; size?: number; color?: string };

export function CategoryIcon({ name, size = 24, color = colors.sage }: Props) {
  const Icon = categoryIcons[name];
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}
