import type { Completion, Frequency, Task } from '@/types';

import { DAY_LABELS, parseDateKey, startOfWeek, toDateKey, weekdayIndex } from './date';

function periodKey(date: Date, unit: Frequency['unit']): string {
  switch (unit) {
    case 'day':
      return toDateKey(date);
    case 'week':
      return toDateKey(startOfWeek(date));
    case 'month':
      return `${date.getFullYear()}-${date.getMonth()}`;
    case 'year':
      return String(date.getFullYear());
  }
}

/**
 * Faut-il afficher cette tâche ce jour-là ?
 * - tous les jours / jours précis de la semaine : selon le calendrier
 * - mensuelle, annuelle, ou hebdo sans jour précis : affichée à partir d'aujourd'hui
 *   tant qu'elle n'est pas faite sur la période, et le jour où elle a été faite
 */
export function isTaskShownOn(task: Task, date: Date, completions: Completion[], today: Date): boolean {
  if (task.isSuggested) return false;
  const key = toDateKey(date);
  if (key < toDateKey(new Date(task.createdAt))) return false;

  const { unit, days } = task.frequency;
  if (unit === 'day') return true;
  if (unit === 'week' && days?.length) return days.includes(weekdayIndex(date));

  const mine = completions.filter((c) => c.taskId === task.id);
  if (mine.some((c) => c.date === key)) return true;
  if (key < toDateKey(today)) return false;
  const period = periodKey(date, unit);
  return !mine.some((c) => periodKey(parseDateKey(c.date), unit) === period);
}

const UNIT_LABELS = { day: 'jour', week: 'semaine', month: 'mois', year: 'an' } as const;

export function formatFrequency({ count, unit }: Frequency): string {
  if (count === 1 && unit === 'day') return 'Tous les jours';
  return `${count}×/${UNIT_LABELS[unit]}`;
}

/** ex : "Lun, Jeu" (uniquement pour les tâches hebdomadaires avec jours précis) */
export function formatDays({ unit, days }: Frequency): string | null {
  if (unit !== 'week' || !days?.length) return null;
  return [...days].sort((a, b) => a - b).map((d) => DAY_LABELS[d]).join(', ');
}
