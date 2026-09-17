/**
 * Constantes y helpers para el acceso a módulos.
 *
 * - Trial gratuito: módulos de Grado 1, 2 y 3 accesibles (solo ejercicios)
 *   hasta el 31 de octubre de 2026.
 * - Compra válida: 1 año desde la fecha de compra.
 */

/** Fecha límite del trial gratuito (31 Oct 2026, 23:59:59 hora Colombia). */
export const FREE_TRIAL_END_DATE = new Date('2026-10-31T23:59:59.999-05:00');

/** Grupos de módulos que aplican al trial gratuito en todos los idiomas. */
export const FREE_TRIAL_GRADES: string[] = [
  'Grado1', 'Grado2', 'Grado3',
  'Grade1', 'Grade2', 'Grade3',
  'Grade 1', 'Grade 2', 'Grade 3',
  '1º Ano', '2º Ano', '3º Ano',
  '1re Année', '2e Année', '3e Année',
  '1. Klasse', '2. Klasse', '3. Klasse',
];

/** Duración de validez de una compra en milisegundos (365 días). */
export const PURCHASE_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Verifica si un módulo está dentro del periodo de trial gratuito.
 * Aplica a módulos de Grado 1, Grado 2 y Grado 3, hasta el 31/Oct/2026.
 */
export function isModuleInFreeTrial(group: string | undefined | null): boolean {
  if (!group) return false;
  const now = new Date();
  if (now > FREE_TRIAL_END_DATE) return false;

  const normalized = group.trim().toLowerCase();
  if (FREE_TRIAL_GRADES.some(g => g.toLowerCase() === normalized)) return true;
  return /\b(grado|grade|ano|annee|klasse)\s*[123]\b|\b[123]º|\b[123]re|\b[123]\./i.test(normalized);
}

/**
 * Verifica si una compra ha expirado (más de 1 año desde la fecha de compra).
 */
export function isPurchaseExpired(purchaseDate: string | Date | null | undefined): boolean {
  if (!purchaseDate) return true;
  const purchased = new Date(purchaseDate);
  const now = new Date();
  return now.getTime() - purchased.getTime() > PURCHASE_VALIDITY_MS;
}

/**
 * Calcula la fecha de expiración de una compra.
 */
export function getPurchaseExpirationDate(purchaseDate: string | Date): Date {
  const purchased = new Date(purchaseDate);
  return new Date(purchased.getTime() + PURCHASE_VALIDITY_MS);
}

export type ModuleAccessType = 'free_trial' | 'purchased' | 'institutional' | 'expired' | 'none';

export interface ModuleAccessInfo {
  type: ModuleAccessType;
  /** true si el usuario puede acceder a los ejercicios */
  canAccessExercises: boolean;
  /** true si el usuario puede acceder a las descargas */
  canAccessDownloads: boolean;
  /** Fecha de expiración (solo si type === 'purchased') */
  expiresAt?: Date;
  /** Grupo del módulo */
  group?: string;
}
