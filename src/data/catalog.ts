import type { Category, Member, Task } from '@/types';

export const GREGOIRE_ID = 'member-gregoire';
export const MARINE_ID = 'member-marine';

export const members: Member[] = [
  { id: GREGOIRE_ID, name: 'Grégoire', avatarIcon: 'gregoire', color: 'sage' },
  { id: MARINE_ID, name: 'Marine', avatarIcon: 'marine', color: 'terracotta' },
];

export const categories: Category[] = [
  { id: 'cat-home', name: 'Maison', icon: 'home' },
  { id: 'cat-children', name: 'Enfants', icon: 'children' },
  { id: 'cat-admin', name: 'Administratif', icon: 'admin' },
  { id: 'cat-pets', name: 'Animaux', icon: 'pets' },
  { id: 'cat-works', name: 'Travaux', icon: 'works' },
];

/**
 * Suggestions pas encore configurées, réparties sur toutes les catégories — utilisées à
 * la fois pour les données de démo et pour pré-remplir un foyer qui sort de l'onboarding.
 */
export function buildSuggestions(createdAt: string): Task[] {
  const s = (id: string, name: string, categoryId: string, frequency: Task['frequency']): Task => ({
    id,
    name,
    categoryId,
    frequency,
    assigneeIds: [],
    isSuggested: true,
    createdAt,
  });

  const weekdays = [0, 1, 2, 3, 4]; // Lun-Ven, pour approximer "jour d'école"

  return [
    // Maison
    s('sugg-aspirateur', "Passer l'aspirateur", 'cat-home', { count: 2, unit: 'week' }),
    s('sugg-courses', 'Faire les courses', 'cat-home', { count: 1, unit: 'week' }),
    s('sugg-poubelles', 'Sortir les poubelles', 'cat-home', { count: 3, unit: 'week' }),
    s('sugg-vaisselle', 'Faire la vaisselle', 'cat-home', { count: 1, unit: 'day' }),
    s('sugg-machine', 'Faire une machine', 'cat-home', { count: 2, unit: 'week' }),

    // Enfants — "jour d'école" est approximé en Lun-Ven (5×/semaine)
    s('sugg-reveil', 'Gérer le réveil', 'cat-children', { count: 1, unit: 'day' }),
    s('sugg-repas-enfants', 'Préparer les repas des enfants', 'cat-children', { count: 1, unit: 'day' }),
    s('sugg-bain', 'Donner le bain', 'cat-children', { count: 3, unit: 'week' }),
    s('sugg-emmener-ecole', "Emmener à l'école", 'cat-children', { count: 5, unit: 'week', days: weekdays }),
    s('sugg-recuperer-ecole', "Récupérer à l'école", 'cat-children', { count: 5, unit: 'week', days: weekdays }),

    // Administratif
    s('sugg-factures', 'Payer les factures', 'cat-admin', { count: 1, unit: 'month' }),
    s('sugg-impots', "Faire la déclaration d'impôts", 'cat-admin', { count: 1, unit: 'year' }),
    s('sugg-budget', 'Gérer le budget du foyer', 'cat-admin', { count: 1, unit: 'month' }),
    s('sugg-assurances', 'Renouveler les assurances', 'cat-admin', { count: 1, unit: 'year' }),
    s('sugg-nounou', 'Faire la déclaration de la nounou', 'cat-admin', { count: 1, unit: 'month' }),

    // Animaux
    s('sugg-promener-chien', 'Promener le chien', 'cat-pets', { count: 2, unit: 'day' }),
    s('sugg-nourrir-animal', 'Donner à manger', 'cat-pets', { count: 2, unit: 'day' }),
    s('sugg-litiere', 'Nettoyer la litière', 'cat-pets', { count: 1, unit: 'week' }),
    s('sugg-brosser', "Brosser l'animal", 'cat-pets', { count: 2, unit: 'week' }),
    s('sugg-laver-animal', "Laver l'animal", 'cat-pets', { count: 1, unit: 'month' }),

    // Travaux — "1×/2 semaines" → 2×/mois, "au besoin" → 1×/mois, "1×/trimestre" → 4×/an
    // (approximations : notre modèle ne connaît que jour / semaine / mois / an)
    s('sugg-jardin', 'Tondre la pelouse / entretenir le jardin', 'cat-works', { count: 2, unit: 'month' }),
    s('sugg-reparations', 'Petites réparations diverses', 'cat-works', { count: 1, unit: 'month' }),
    s('sugg-detartrer', 'Détartrer les appareils (cafetière, bouilloire)', 'cat-works', { count: 4, unit: 'year' }),
    s('sugg-garage', 'Ranger et trier le garage/la cave', 'cat-works', { count: 2, unit: 'year' }),
    s('sugg-voiture', 'Entretenir la voiture (lavage, vidange)', 'cat-works', { count: 1, unit: 'month' }),
  ];
}
