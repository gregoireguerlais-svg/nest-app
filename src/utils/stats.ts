import type { Completion, Member } from '@/types';

import { startOfMonth, startOfWeek, toDateKey } from './date';

export type Period = 'week' | 'month';

export function periodStart(period: Period, today: Date): Date {
  return period === 'week' ? startOfWeek(today) : startOfMonth(today);
}

/** Complétions dans la période, jusqu'à aujourd'hui inclus. */
export function completionsInPeriod(completions: Completion[], period: Period, today: Date): Completion[] {
  const startKey = toDateKey(periodStart(period, today));
  const todayKey = toDateKey(today);
  return completions.filter((c) => c.date >= startKey && c.date <= todayKey);
}

export type MemberShare = { member: Member; count: number; percent: number };

/** Répartition des complétions entre les membres (arrondi à 100 au total). */
export function shareByMember(members: Member[], completions: Completion[]): MemberShare[] {
  const total = completions.length;
  const shares = members.map((member) => {
    const count = completions.filter((c) => c.memberId === member.id).length;
    return { member, count, percent: total === 0 ? 0 : Math.round((count / total) * 100) };
  });
  // Corrige l'arrondi pour que le total fasse toujours 100 quand il y a des données.
  const drift = 100 - shares.reduce((sum, s) => sum + s.percent, 0);
  if (total > 0 && drift !== 0) {
    const leader = shares.reduce((a, b) => (b.count > a.count ? b : a));
    leader.percent += drift;
  }
  return shares;
}

/** Message chaleureux qui reflète la répartition de la période, jamais compétitif. */
export function gratitudeMessage(shares: MemberShare[], periodLabel: string): string {
  const total = shares.reduce((sum, s) => sum + s.count, 0);
  if (total === 0) return `Rien de coché pour l'instant ${periodLabel} — ça va venir 🌱`;

  const [a, b] = [...shares].sort((x, y) => y.count - x.count);
  if (!b || a.percent - b.percent <= 15) {
    return `Bel équilibre entre vous deux ${periodLabel} 💚`;
  }
  return `${a.member.name} a pris en charge ${a.percent}% des tâches ${periodLabel}. Beau travail d'équipe 🌿`;
}
