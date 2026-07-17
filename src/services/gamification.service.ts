/**
 * Lógica de gamificación (pura, sin estado global).
 * Portada desde las funciones `grade`, `getRank`, `getUnlockedAvatars`,
 * `gainXP`, `awardBadge` del HTML original.
 */

import type {
  AvatarUnlock,
  Badge,
  Rank,
  GamificationCatalog,
  GamificationState,
  ShopState,
} from '@/types/gamification.types';
import type { Grade, ScoreMap } from '@/types/book-progress.types';
import type { Book } from '@/types/book.types';

/** Estado de gamificación inicial para un estudiante nuevo. */
export function createInitialGamificationState(avatar = '🧑‍🚀'): GamificationState {
  return {
    totalXP: 0,
    coins: 0,
    stars: 0,
    streak: 0,
    maxStreak: 0,
    avatar,
    earnedBadges: [],
    lastDaily: '',
    lastLogin: '',
    loginStreak: 0,
    shop: defaultShopState(),
  };
}

export function defaultShopState(): ShopState {
  return { owned: ['helm_basic', 'ship_basic'], equipped: { casco: 'helm_basic', nave: 'ship_basic' } };
}

/**
 * Calcula la calificación tipo MEN a partir de puntos/máximo.
 * Réplica fiel de `grade(pts,max)` del HTML.
 */
export function computeGrade(pts: number, max: number): Grade {
  const p = max > 0 ? (pts / max) * 100 : 0;
  const stars =
    p >= 95 ? '⭐⭐⭐⭐⭐' : p >= 80 ? '⭐⭐⭐⭐' : p >= 65 ? '⭐⭐⭐' : p >= 50 ? '⭐⭐' : '⭐';
  const adaptive =
    p >= 95
      ? '¡Dominio total! Eres un maestro 🚀'
      : p >= 80
        ? '¡Excelente! Sigue avanzando 🌟'
        : p >= 65
          ? '¡Muy bien! Un poco más de práctica 💪'
          : p >= 50
            ? 'Buen intento. Repasa los ejemplos 📚'
            : 'Necesitas repasar. ¡Tú puedes! 🔄';
  const pct = Math.round(p);

  if (p >= 90)
    return { letter: 'S', num: '5.0', lbl: '🏆 Superior', stars, adaptive, cls: 'rg-s', desc: 'Dominio completo · MEN: Desempeño Superior', barColor: '#06A570', pct };
  if (p >= 70)
    return { letter: 'A', num: '4.0', lbl: '✅ Alto', stars, adaptive, cls: 'rg-a', desc: 'Muy buen desempeño · MEN: Desempeño Alto', barColor: '#1A6CB4', pct };
  if (p >= 50)
    return { letter: 'B', num: '3.0', lbl: '📘 Básico', stars, adaptive, cls: 'rg-b', desc: 'Desempeño mínimo logrado · MEN: Básico', barColor: '#BA7517', pct };
  return { letter: 'L', num: '2.0', lbl: '⚠️ Bajo', stars, adaptive, cls: 'rg-l', desc: 'Necesita refuerzo · MEN: Bajo', barColor: '#C94B22', pct };
}

/** Rango actual según XP. */
export function getRank(ranks: Rank[], xp: number): Rank {
  return [...ranks].reverse().find((r) => xp >= r.min) ?? ranks[0];
}

/** Índice de rango según XP (0..ranks.length-1). */
export function getRankIndex(ranks: Rank[], xp: number): number {
  let idx = 0;
  ranks.forEach((r, i) => {
    if (xp >= r.min) idx = i;
  });
  return idx;
}

/** Recompensa (XP + monedas) por insignia (réplica de `rewardTier` del HTML). */
const BADGE_REWARDS: Record<string, { xp: number; coins: number }> = {
  first_correct: { xp: 25, coins: 10 },
  streak3: { xp: 30, coins: 15 },
  streak5: { xp: 50, coins: 25 },
  streak10: { xp: 100, coins: 50 },
  speed_demon: { xp: 60, coins: 30 },
  perfect_level: { xp: 100, coins: 60 },
  topic_master: { xp: 200, coins: 100 },
  unit_complete: { xp: 300, coins: 150 },
  daily_login: { xp: 50, coins: 25 },
  xp_500: { xp: 75, coins: 50 },
  xp_1000: { xp: 150, coins: 100 },
};

export function getBadgeReward(id: string): { xp: number; coins: number } {
  return BADGE_REWARDS[id] ?? { xp: 50, coins: 25 };
}

/** Avatares desbloqueados según XP. */
export function getUnlockedAvatars(avatars: AvatarUnlock[], xp: number): AvatarUnlock[] {
  return avatars.filter((a) => a.xp <= xp);
}

/** Contexto opcional para evaluar insignias al terminar una lección. */
export interface BadgeContext {
  book: Book;
  /** Mapa de puntuaciones YA actualizado con el nivel recién terminado. */
  scores: ScoreMap;
  /** Clave del nivel recién completado (`u{u}t{t}-n{n}`). */
  justFinishedLevelKey?: string;
  /** Porcentaje de la lección recién terminada. */
  lessonPct?: number;
  /** Hubo al menos una respuesta correcta en la lección. */
  anyCorrectThisLesson?: boolean;
  /** Tiempo de respuesta más rápido de la lección (ms). */
  fastestMs?: number;
}

/** Descompone una clave de nivel `u{u}t{t}-n{n}`. */
export function parseLevelKey(key: string): { u: number; t: number; n: number } | null {
  const m = /^u(\d+)t(\d+)-n(\d+)$/.exec(key);
  if (!m) return null;
  return { u: Number(m[1]), t: Number(m[2]), n: Number(m[3]) };
}

function isTopicComplete(book: Book, u: number, t: number, scores: ScoreMap): boolean {
  const topic = book.units[u]?.topics[t];
  if (!topic) return false;
  return topic.levels.every((_, li) => Boolean(scores[`u${u}t${t}-n${li + 1}`]));
}

function isUnitComplete(book: Book, u: number, scores: ScoreMap): boolean {
  const unit = book.units[u];
  if (!unit) return false;
  return unit.topics.every((_, ti) => isTopicComplete(book, u, ti, scores));
}

/**
 * Asegura que el estado de gamificación sea válido y tenga todas las propiedades
 * necesarias (utiliza valores por defecto si está ausente o incompleto).
 */
export function ensureGamificationState(state?: any): GamificationState {
  const defaults = createInitialGamificationState(state?.avatar || '🧑‍🚀');
  if (!state) return defaults;
  return {
    ...defaults,
    ...state,
    shop: state.shop ? { ...defaults.shop, ...state.shop } : defaults.shop,
  };
}

/**
 * Calcula el conjunto de insignias ganadas dado el estado y, opcionalmente,
 * el contexto de la lección recién terminada. Cubre las 11 insignias del HTML.
 */
export function evaluateBadges(
  catalog: GamificationCatalog,
  state: GamificationState,
  ctx?: BadgeContext
): string[] {
  const s = ensureGamificationState(state);
  const earned = new Set(s.earnedBadges);

  // XP y rachas (no requieren contexto).
  if (s.streak >= 3) earned.add('streak3');
  if (s.streak >= 5) earned.add('streak5');
  if (s.streak >= 10) earned.add('streak10');
  if (s.totalXP >= 500) earned.add('xp_500');
  if (s.totalXP >= 1000) earned.add('xp_1000');
  if ((s.loginStreak ?? 0) >= 3) earned.add('daily_login');

  if (ctx) {
    const { book, scores, justFinishedLevelKey, lessonPct, anyCorrectThisLesson, fastestMs } = ctx;

    // Primera respuesta correcta (de esta lección o de cualquier nivel previo).
    const hadCorrectBefore = Object.values(scores).some((sc) => sc.ok > 0);
    if (anyCorrectThisLesson || hadCorrectBefore) earned.add('first_correct');

    if (typeof fastestMs === 'number' && fastestMs > 0 && fastestMs < 5000) earned.add('speed_demon');
    if (typeof lessonPct === 'number' && lessonPct >= 100) earned.add('perfect_level');

    const parsed = justFinishedLevelKey ? parseLevelKey(justFinishedLevelKey) : null;
    if (parsed) {
      if (isTopicComplete(book, parsed.u, parsed.t, scores)) earned.add('topic_master');
      if (isUnitComplete(book, parsed.u, scores)) earned.add('unit_complete');
    }
  }

  return catalog.badges.filter((b) => earned.has(b.id)).map((b) => b.id);
}

/** Actualiza la racha de login (días consecutivos). Devuelve nuevo estado. */
export function registerLogin(state: GamificationState): GamificationState {
  const s = ensureGamificationState(state);
  const today = new Date();
  const todayStr = today.toDateString();
  if (s.lastLogin === todayStr) return s;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const consecutive = s.lastLogin === yesterday.toDateString();

  return {
    ...s,
    lastLogin: todayStr,
    loginStreak: consecutive ? (s.loginStreak ?? 0) + 1 : 1,
  };
}

/** Resuelve los objetos `Badge` ganados. */
export function resolveBadges(catalog: GamificationCatalog, ids: string[]): Badge[] {
  return catalog.badges.filter((b) => ids.includes(b.id));
}

/** Aplica la ganancia de XP/monedas tras completar un nivel, sin mutar el original. */
export function applyLevelReward(
  state: GamificationState,
  reward: { xp: number; coins: number; stars: number; ok: number; wrong: number }
): GamificationState {
  const s = ensureGamificationState(state);
  const streak = reward.wrong === 0 ? s.streak + reward.ok : 0;
  return {
    ...s,
    totalXP: s.totalXP + reward.xp,
    coins: s.coins + reward.coins,
    stars: s.stars + reward.stars,
    streak,
    maxStreak: Math.max(s.maxStreak, streak),
  };
}
