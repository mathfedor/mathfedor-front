/**
 * Constantes y helpers para el acceso a módulos.
 *
 * - Trial gratuito: módulos de Grado1 y Grado2 accesibles (solo ejercicios)
 *   hasta el 17 de septiembre de 2026.
 * - Compra válida: 1 año desde la fecha de compra.
 */

/** Fecha límite del trial gratuito (17 Sep 2026, 23:59:59 hora Colombia). */
export const FREE_TRIAL_END_DATE = new Date('2026-09-17T23:59:59.999-05:00');

/** Grupos de módulos que aplican al trial gratuito. */
export const FREE_TRIAL_GRADES: string[] = ['Grado1', 'Grado2'];

/** Duración de validez de una compra en milisegundos (365 días). */
export const PURCHASE_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Verifica si un módulo está dentro del periodo de trial gratuito.
 * Solo aplica a módulos de Grado1 y Grado2, y solo antes del 17/Sep/2026.
 */
export function isModuleInFreeTrial(group: string | undefined | null): boolean {
  if (!group) return false;
  const now = new Date();
  return FREE_TRIAL_GRADES.includes(group) && now <= FREE_TRIAL_END_DATE;
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
