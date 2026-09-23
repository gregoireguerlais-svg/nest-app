import { buildSuggestions, categories } from '@/data/catalog';
import type { AppData, Member } from '@/types';

/** Foyer flambant neuf, tel que choisi à l'onboarding : profils et suggestions des catégories retenues. */
export function buildFreshData(householdName: string, icon: string, categoryIds: string[], members: Member[]): AppData {
  const createdAt = new Date().toISOString();
  const tasks = buildSuggestions(createdAt).filter((t) => categoryIds.includes(t.categoryId));

  return {
    household: {
      id: 'household-1',
      name: householdName,
      icon,
      categoryIds,
      members,
      createdAt,
    },
    categories,
    tasks,
    completions: [],
    thankYous: [],
    currentMemberId: members[0]?.id ?? '',
  };
}
