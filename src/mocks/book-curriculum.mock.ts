/**
 * Mock del currículo del libro "Matemáticas de Fedor 2°".
 *
 * Los datos provienen del HTML original (extraídos a JSON) y se normalizan
 * al modelo tipado (`Book`) añadiendo identificadores e índices estables.
 *
 * Cuando exista el backend Node.js, `book.service` dejará de usar este mock
 * y consumirá el endpoint real; las interfaces se mantienen idénticas.
 */

import rawData from './data/book-curriculum.data.json';
import type {
  Book,
  Unit,
  Topic,
  Level,
  Exercise,
} from '@/types/book.types';
import type {
  AvatarUnlock,
  Badge,
  Rank,
  ShopItem,
  GamificationCatalog,
} from '@/types/gamification.types';

/* ── Tipos crudos del JSON (sin ids ni índices) ───────────────── */

interface RawExercise {
  type: 'mcq' | 'input' | 'seq';
  q: string;
  pts: number;
  badge?: string;
  bst?: string;
  mascot?: string;
  ctx?: string;
  figure?: string;
  fig_data?: Record<string, unknown>;
  opts?: string[];
  ans?: string;
  hint?: string;
  items?: Array<{ t: 'f' | 'b'; v?: string; a?: string }>;
}

interface RawLevel {
  label: string;
  short: string;
  dot: string;
  bg: string;
  color: string;
  exercises?: RawExercise[];
}

interface RawTopic {
  title: string;
  icon: string;
  desc: string;
  levels: RawLevel[];
}

interface RawUnit {
  name: string;
  short: string;
  std: string;
  heroCls: string;
  icon: string;
  topics: RawTopic[];
}

interface RawData {
  UNITS: RawUnit[];
  AVATAR_UNLOCKS: AvatarUnlock[];
  ALL_BADGES: Badge[];
  RANKS: Rank[];
  SHOP_ITEMS: ShopItem[];
}

const data = rawData as unknown as RawData;

/* ── Normalización a tipos del dominio ────────────────────────── */

function mapExercise(raw: RawExercise, id: string): Exercise {
  const base = {
    id,
    q: raw.q,
    pts: raw.pts,
    badge: raw.badge,
    bst: raw.bst,
    mascot: raw.mascot,
    ctx: raw.ctx,
    figure: raw.figure,
    fig_data: raw.fig_data,
  };

  switch (raw.type) {
    case 'mcq':
      return { ...base, type: 'mcq', opts: raw.opts ?? [], ans: raw.ans ?? '' };
    case 'input':
      return { ...base, type: 'input', ans: raw.ans ?? '', hint: raw.hint };
    case 'seq':
      return { ...base, type: 'seq', items: raw.items ?? [] };
    default:
      // Fallback defensivo: tratar como input.
      return { ...base, type: 'input', ans: raw.ans ?? '' };
  }
}

function mapLevel(raw: RawLevel, levelIndex: number, topicId: string): Level {
  return {
    index: levelIndex,
    label: raw.label,
    short: raw.short,
    dot: raw.dot,
    bg: raw.bg,
    color: raw.color,
    exercises: (raw.exercises ?? []).map((ex, i) =>
      mapExercise(ex, `${topicId}-n${levelIndex + 1}-e${i + 1}`)
    ),
  };
}

function mapTopic(raw: RawTopic, topicIndex: number, unitId: string): Topic {
  const id = `${unitId}-t${topicIndex}`;
  return {
    id,
    title: raw.title,
    icon: raw.icon,
    desc: raw.desc,
    levels: raw.levels.map((lv, i) => mapLevel(lv, i, id)),
  };
}

function mapUnit(raw: RawUnit, unitIndex: number): Unit {
  const id = `u${unitIndex}`;
  return {
    id,
    index: unitIndex,
    name: raw.name,
    short: raw.short,
    std: raw.std,
    heroCls: raw.heroCls,
    icon: raw.icon,
    topics: raw.topics.map((t, i) => mapTopic(t, i, id)),
  };
}

/** Libro completo normalizado (mock). */
export const mockBook: Book = {
  id: 'book-fedor-2',
  slug: 'matematicas-fedor-2',
  title: 'Matemáticas de Fedor',
  grade: '2° de Primaria',
  standard: 'Pensamiento Numérico · MEN Colombia',
  units: data.UNITS.map(mapUnit),
};

/** Catálogo de gamificación (mock). */
export const mockGamificationCatalog: GamificationCatalog = {
  avatars: data.AVATAR_UNLOCKS,
  badges: data.ALL_BADGES,
  ranks: data.RANKS,
  shopItems: data.SHOP_ITEMS,
};
