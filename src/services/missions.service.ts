/**
 * Sistema de misiones del libro. Las misiones son objetivos cuyo progreso se
 * deriva del estado actual (sin estado propio salvo "reclamada"). Portado del
 * espíritu de `fedor2_misiones` del HTML original.
 */

import type { Book } from '@/types/book.types';
import type { BookProgress } from '@/types/book-progress.types';

export type MissionMetric = 'levels' | 'xp' | 'streak' | 'badges' | 'units';

export interface Mission {
  id: string;
  emoji: string;
  title: string;
  metric: MissionMetric;
  target: number;
  /** Recompensa en monedas al reclamar. */
  reward: number;
}

export interface MissionProgress {
  mission: Mission;
  current: number;
  done: boolean;
  claimed: boolean;
  claimable: boolean;
}

export const MISSIONS: Mission[] = [
  { id: 'm_levels_3', emoji: '🎯', title: 'Completa 3 niveles', metric: 'levels', target: 3, reward: 30 },
  { id: 'm_levels_10', emoji: '🚀', title: 'Completa 10 niveles', metric: 'levels', target: 10, reward: 80 },
  { id: 'm_xp_300', emoji: '⭐', title: 'Alcanza 300 XP', metric: 'xp', target: 300, reward: 40 },
  { id: 'm_streak_5', emoji: '🔥', title: 'Racha de 5 correctas', metric: 'streak', target: 5, reward: 30 },
  { id: 'm_badges_5', emoji: '🏅', title: 'Gana 5 insignias', metric: 'badges', target: 5, reward: 50 },
  { id: 'm_unit_1', emoji: '🌌', title: 'Completa una unidad', metric: 'units', target: 1, reward: 100 },
];

/** Cuenta niveles de currículo completados (excluye el reto diario). */
function countCompletedLevels(progress: BookProgress): number {
  return Object.keys(progress.scores).filter((k) => /^u\d+t\d+-n\d+$/.test(k)).length;
}

/** Cuenta unidades completadas al 100 %. */
function countCompletedUnits(book: Book, progress: BookProgress): number {
  return book.units.filter((unit) =>
    unit.topics.every((topic, ti) =>
      topic.levels.every((_, li) => Boolean(progress.scores[`u${unit.index}t${ti}-n${li + 1}`]))
    )
  ).length;
}

function metricValue(metric: MissionMetric, book: Book, progress: BookProgress): number {
  const g = progress.gamification;
  switch (metric) {
    case 'levels':
      return countCompletedLevels(progress);
    case 'xp':
      return g.totalXP;
    case 'streak':
      return g.maxStreak;
    case 'badges':
      return g.earnedBadges.length;
    case 'units':
      return countCompletedUnits(book, progress);
    default:
      return 0;
  }
}

/** Evalúa el progreso de todas las misiones. */
export function evaluateMissions(book: Book, progress: BookProgress): MissionProgress[] {
  const claimed = new Set(progress.gamification.claimedMissions ?? []);
  return MISSIONS.map((mission) => {
    const current = Math.min(metricValue(mission.metric, book, progress), mission.target);
    const done = current >= mission.target;
    const isClaimed = claimed.has(mission.id);
    return { mission, current, done, claimed: isClaimed, claimable: done && !isClaimed };
  });
}
