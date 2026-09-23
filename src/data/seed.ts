import { buildSuggestions, categories, GREGOIRE_ID, MARINE_ID, members } from '@/data/catalog';
import type { AppData, Completion, Task } from '@/types';
import { addDays, toDateKey, weekdayIndex } from '@/utils/date';

function buildConfiguredTasks(createdAt: string): Task[] {
  const both = [GREGOIRE_ID, MARINE_ID];
  const t = (
    id: string,
    name: string,
    categoryId: string,
    frequency: Task['frequency'],
    assigneeIds: string[],
  ): Task => ({ id, name, categoryId, frequency, assigneeIds, isSuggested: false, createdAt });

  return [
    t('task-poubelles', 'Sortir les poubelles', 'cat-home', { count: 2, unit: 'week', days: [1, 4] }, [GREGOIRE_ID]),
    t('task-vaisselle', 'Faire la vaisselle', 'cat-home', { count: 1, unit: 'day' }, both),
    t('task-aspirateur', "Passer l'aspirateur", 'cat-home', { count: 1, unit: 'week', days: [5] }, [MARINE_ID]),
    t('task-lessive', 'Faire la lessive', 'cat-home', { count: 2, unit: 'week', days: [0, 3] }, [MARINE_ID]),
    t('task-courses', 'Faire les courses', 'cat-home', { count: 1, unit: 'week', days: [5] }, both),
    t('task-ecole', "Emmener à l'école", 'cat-children', { count: 5, unit: 'week', days: [0, 1, 2, 3, 4] }, [GREGOIRE_ID]),
    t('task-bain', 'Donner le bain', 'cat-children', { count: 1, unit: 'day' }, both),
    t('task-factures', 'Payer les factures', 'cat-admin', { count: 1, unit: 'month' }, [GREGOIRE_ID]),
    t('task-impots', 'Déclaration de revenus', 'cat-admin', { count: 1, unit: 'year' }, [MARINE_ID]),
    t('task-chien', 'Promener le chien', 'cat-pets', { count: 1, unit: 'day' }, [GREGOIRE_ID]),
    t('task-chat', 'Nourrir le chat', 'cat-pets', { count: 1, unit: 'day' }, [MARINE_ID]),
    t('task-litiere', 'Changer la litière', 'cat-pets', { count: 1, unit: 'week', days: [6] }, [GREGOIRE_ID]),
  ];
}

/**
 * Historique des 14 derniers jours (aujourd'hui exclu) : chaque tâche prévue ce jour-là
 * est faite dans ~75 % des cas. Le hash rend le résultat identique à chaque lancement.
 */
function buildCompletions(tasks: Task[], today: Date): Completion[] {
  const completions: Completion[] = [];
  for (const task of tasks) {
    if (task.isSuggested) continue;
    const { unit, days } = task.frequency;
    for (let back = 1; back <= 14; back++) {
      const date = addDays(today, -back);
      const scheduled =
        unit === 'day' || (unit === 'week' && (!days || days.includes(weekdayIndex(date))));
      if (!scheduled) continue;
      const hash = (task.id.length * 7 + back * 13 + task.name.charCodeAt(0)) % 8;
      if (hash < 2) continue;
      completions.push({
        id: `comp-${task.id}-${back}`,
        taskId: task.id,
        memberId: task.assigneeIds[hash % task.assigneeIds.length],
        date: toDateKey(date),
      });
    }
  }
  return completions;
}

/** Foyer entièrement pré-rempli, utilisé au premier lancement en développement et par "Réinitialiser les données de démo". */
export function buildSeedData(today = new Date()): AppData {
  const createdAt = addDays(today, -30).toISOString();
  const configured = buildConfiguredTasks(createdAt);
  // On ne propose pas en suggestion une tâche déjà configurée dans la démo (même nom).
  const configuredNames = new Set(configured.map((t) => t.name));
  const suggestions = buildSuggestions(createdAt).filter((t) => !configuredNames.has(t.name));
  const tasks = [...configured, ...suggestions];
  return {
    household: {
      id: 'household-1',
      name: 'Notre nid',
      icon: 'nest',
      categoryIds: categories.map((c) => c.id),
      members,
      createdAt,
    },
    categories,
    tasks,
    completions: buildCompletions(tasks, today),
    thankYous: [],
    currentMemberId: GREGOIRE_ID,
  };
}
