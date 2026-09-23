import type { CategoryIconKey } from '@/components/ui/CategoryIcon';
import type { MemberColor } from '@/theme';

export type Member = {
  id: string;
  name: string;
  avatarIcon: string;
  color: MemberColor;
};

export type Category = {
  id: string;
  name: string;
  icon: CategoryIconKey;
};

export type Frequency = {
  count: number;
  unit: 'day' | 'week' | 'month' | 'year';
  /** 0 = lundi ... 6 = dimanche, surtout pertinent pour unit = 'week' */
  days?: number[];
};

export type Task = {
  id: string;
  name: string;
  categoryId: string;
  frequency: Frequency;
  assigneeIds: string[];
  /** true = suggérée, pas encore configurée */
  isSuggested?: boolean;
  createdAt: string;
};

export type Completion = {
  id: string;
  taskId: string;
  memberId: string;
  /** date locale au format YYYY-MM-DD */
  date: string;
};

export type ThankYou = {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  message: string;
  date: string;
  read: boolean;
};

export type Household = {
  id: string;
  name: string;
  icon: string;
  categoryIds: string[];
  members: Member[];
  createdAt: string;
};

/** Tout ce qui est stocké sur l'appareil. */
export type AppData = {
  household: Household;
  categories: Category[];
  tasks: Task[];
  completions: Completion[];
  thankYous: ThankYou[];
  /** profil actuellement actif (Grégoire ou Marine) */
  currentMemberId: string;
};
