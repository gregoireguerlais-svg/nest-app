import type { AppData, Task } from '@/types';

const DEFAULT_THANK_YOU_MESSAGE = 'Merci pour tout ce que tu fais 💚';

/** Coche la tâche pour ce jour (au nom du profil actif), ou la décoche si elle l'était déjà. */
export function toggleCompletion(data: AppData, taskId: string, dateKey: string): AppData {
  const existing = data.completions.find((c) => c.taskId === taskId && c.date === dateKey);
  return {
    ...data,
    completions: existing
      ? data.completions.filter((c) => c.id !== existing.id)
      : [
          ...data.completions,
          { id: `comp-${taskId}-${dateKey}-${Date.now()}`, taskId, memberId: data.currentMemberId, date: dateKey },
        ],
  };
}

/** Crée une nouvelle tâche, ou remplace une tâche existante (même id) — la configuration d'une suggestion passe par ici. */
export function upsertTask(data: AppData, task: Task): AppData {
  const exists = data.tasks.some((t) => t.id === task.id);
  return {
    ...data,
    tasks: exists ? data.tasks.map((t) => (t.id === task.id ? task : t)) : [...data.tasks, task],
  };
}

/** Envoie un remerciement local, pas encore lu par le destinataire. */
export function sendThankYou(
  data: AppData,
  fromMemberId: string,
  toMemberId: string,
  message: string = DEFAULT_THANK_YOU_MESSAGE,
): AppData {
  return {
    ...data,
    thankYous: [
      ...data.thankYous,
      {
        id: `thanks-${Date.now()}`,
        fromMemberId,
        toMemberId,
        message,
        date: new Date().toISOString(),
        read: false,
      },
    ],
  };
}

/** Marque un remerciement comme lu (une fois que le destinataire l'a vu). */
export function markThankYouRead(data: AppData, thankYouId: string): AppData {
  return {
    ...data,
    thankYous: data.thankYous.map((t) => (t.id === thankYouId ? { ...t, read: true } : t)),
  };
}

/** Active une catégorie pour le foyer si elle ne l'était pas déjà (ex : choisie pour une nouvelle tâche). */
export function ensureCategoryEnabled(data: AppData, categoryId: string): AppData {
  if (data.household.categoryIds.includes(categoryId)) return data;
  return {
    ...data,
    household: { ...data.household, categoryIds: [...data.household.categoryIds, categoryId] },
  };
}

/** Supprime la tâche et tout son historique. */
export function deleteTask(data: AppData, taskId: string): AppData {
  return {
    ...data,
    tasks: data.tasks.filter((t) => t.id !== taskId),
    completions: data.completions.filter((c) => c.taskId !== taskId),
  };
}
