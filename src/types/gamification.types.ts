/**
 * Tipos de la capa de gamificación del libro "Matemáticas de Fedor 2°".
 * Migrado desde la lógica de localStorage del HTML original (XP, monedas,
 * rachas, insignias, rangos, avatares y tienda).
 */

/** Categorías de ítems de la tienda. */
export type ShopCategory = 'casco' | 'traje' | 'mascota' | 'nave';

/** Avatar desbloqueable por XP. */
export interface AvatarUnlock {
  /** Emoji del avatar. */
  av: string;
  /** XP requerido para desbloquearlo. */
  xp: number;
  label: string;
}

/** Definición de una insignia. */
export interface Badge {
  id: string;
  emoji: string;
  name: string;
  tip: string;
  /** Color de fondo. */
  bg: string;
  /** Color de borde. */
  bc: string;
}

/** Rango alcanzable según XP total. */
export interface Rank {
  /** XP mínimo para alcanzar el rango. */
  min: number;
  label: string;
  color: string;
}

/** Ítem comprable en la tienda. */
export interface ShopItem {
  id: string;
  cat: ShopCategory;
  emoji: string;
  name: string;
  /** Precio en monedas. */
  price: number;
  /** Avatar que aplica al equiparlo (cuando corresponde). */
  avatar: string | null;
  /** XP mínimo para poder comprarlo. */
  unlockXP: number;
  desc: string;
}

/** Estado de la tienda del estudiante. */
export interface ShopState {
  /** IDs de ítems comprados. */
  owned: string[];
  /** Ítem equipado por categoría. */
  equipped: Partial<Record<ShopCategory, string>>;
}

/** Catálogo estático de gamificación (no depende del estudiante). */
export interface GamificationCatalog {
  avatars: AvatarUnlock[];
  badges: Badge[];
  ranks: Rank[];
  shopItems: ShopItem[];
}

/** Estado de gamificación de un estudiante (persistible en backend). */
export interface GamificationState {
  /** XP total acumulado. */
  totalXP: number;
  /** Monedas disponibles. */
  coins: number;
  /** Estrellas acumuladas. */
  stars: number;
  /** Racha actual de respuestas correctas. */
  streak: number;
  /** Mejor racha histórica. */
  maxStreak: number;
  /** Avatar seleccionado. */
  avatar: string;
  /** IDs de insignias ganadas. */
  earnedBadges: string[];
  /** Última fecha (toDateString) en que se reclamó la recompensa diaria. */
  lastDaily: string;
  /** Última fecha (toDateString) de ingreso, para la racha de login. */
  lastLogin?: string;
  /** Días consecutivos de ingreso. */
  loginStreak?: number;
  /** Última fecha (YYYY-MM-DD) en que se completó el reto diario. */
  lastDailyChallenge?: string;
  /** IDs de misiones cuya recompensa ya fue reclamada. */
  claimedMissions?: string[];
  /** Estado de la tienda. */
  shop: ShopState;
}
