/**
 * Constantes y helpers para el acceso a módulos.
 *
 * - Trial gratuito: módulos de Grado 1, 2, 3, 4 y 5 accesibles (solo ejercicios, sin descargas)
 *   durante 17 días contados desde el registro de cada usuario.
 * - Compra válida: 1 año desde la fecha de compra.
 */

/** Duración de la prueba gratuita, contada desde el registro de cada usuario. */
export const FREE_TRIAL_DAYS = 17;

/**
 * Fecha en que termina la prueba del usuario con sesión, o null si no hay sesión.
 * El registro se toma del id de MongoDB: sus primeros 8 caracteres son la fecha de creación en segundos.
 */
export function getTrialEndDate(): Date | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = JSON.parse(window.localStorage.getItem('user') || 'null');
    const id = String(user?.id || user?._id || '');
    if (!/^[0-9a-f]{24}$/i.test(id)) return null;
    const createdAt = parseInt(id.slice(0, 8), 16) * 1000;
    return new Date(createdAt + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000);
  } catch {
    return null;
  }
}

/** true mientras el usuario con sesión esté dentro de sus días de prueba. */
export function isTrialActive(): boolean {
  const end = getTrialEndDate();
  return end !== null && new Date() <= end;
}

/** Grupos de módulos que aplican al trial gratuito en todos los idiomas. */
export const FREE_TRIAL_GRADES: string[] = [
  'Grado1', 'Grado2', 'Grado3', 'Grado4', 'Grado5',
  'Grade1', 'Grade2', 'Grade3', 'Grade4', 'Grade5',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  '1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano',
  '1re Année', '2e Année', '3e Année', '4e Année', '5e Année',
  '1. Klasse', '2. Klasse', '3. Klasse', '4. Klasse', '5. Klasse',
];

/** Duración de validez de una compra en milisegundos (365 días). */
export const PURCHASE_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Verifica si un módulo está dentro del periodo de trial gratuito.
 * Aplica a módulos de Grado 1, 2, 3, 4 y 5, durante los días de prueba del usuario.
 */
export function isModuleInFreeTrial(group: string | undefined | null): boolean {
  if (!group) return false;
  if (!isTrialActive()) return false;

  const normalized = group.trim().toLowerCase();
  if (FREE_TRIAL_GRADES.some(g => g.toLowerCase() === normalized)) return true;
  return /\b(grado|grade|ano|annee|klasse)\s*[12345]\b|\b[12345]º|\b[12345]re|\b[12345]e|\b[12345]\./i.test(normalized);
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

/**
 * Identifica si un módulo o identificador corresponde a 1°, 2°, 3°, 4° o 5° grado
 * dentro de los días de prueba del usuario.
 */
export function isFreeTrialGrade(
  identifierOrModule: string | { _id?: string; slug?: string; title?: string; group?: string } | undefined | null
): boolean {
  if (!identifierOrModule) return false;
  if (!isTrialActive()) return false;

  if (typeof identifierOrModule === 'object') {
    const mod = identifierOrModule;
    if (isModuleInFreeTrial(mod.group)) return true;
    if (mod._id && isFreeTrialGrade(mod._id)) return true;
    if (mod.slug && isFreeTrialGrade(mod.slug)) return true;
    if (mod.title && isFreeTrialGrade(mod.title)) return true;
    return false;
  }

  const raw = String(identifierOrModule).trim();
  const normalized = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const freeIds = [
    '1', '2', '3', '4', '5',
    'libro-1ro', 'matematicas-fedor-1',
    'libro-2do', 'matematicas-fedor-2',
    'libro-3ro', 'matematicas-fedor-3',
    'libro-4to', 'matematicas-fedor-4',
    'libro-5to', 'matematicas-fedor-5',
    '6830d368fecd7406dc6f9525', '6830d619fecd7406dc6f96ad',
    '6832543f6fee7c84b2f077c0', '6832543f6fee7c84b2f077c1',
    '694c7c4322a78467aa1783b6', '6832543f6fee7c84b2f077c2',
    '694c7c4322a78467aa1783b7'
  ];

  if (freeIds.includes(normalized) || freeIds.includes(raw)) return true;
  if (FREE_TRIAL_GRADES.some(g => g.toLowerCase() === normalized)) return true;

  return /\b(grado|grade|ano|annee|klasse|libro|matematicas-fedor)\s*[-_ ]*[12345]\b|\b[12345]º|\b[12345]re|\b[12345]e|\b[12345]\.|\b1ro\b|\b2do\b|\b3ro\b|\b4to\b|\b5to\b|\bprimero\b|\bsegundo\b|\btercero\b|\bcuarto\b|\bquinto\b/i.test(normalized);
}

/**
 * Determina si una compra corresponde a un Plan Anual válido y no expirado.
 * Las descargas de Excel están restringidas a usuarios con Plan Anual (o compras institucionales).
 */
export function isAnnualPlanPurchase(purchase: any): boolean {
  if (!purchase) return false;
  if (purchase.transaction?.status !== 'APPROVED') return false;
  if (isPurchaseExpired(purchase.purchase_date)) return false;

  // Si es institucional, siempre tiene acceso completo
  if (purchase.institutionId) return true;

  const extId = (purchase.transaction?.payment_method?.extra?.external_identifier || '').toUpperCase();
  const planSlug = (purchase.planSlug || purchase.plan || '').toLowerCase();

  // Si explícitamente es mensual o trial, NO es anual
  if (extId.includes('PLAN_MENSUAL') || planSlug === 'mensual') return false;
  if (extId.includes('PLAN_TRIAL') || planSlug.includes('trial') || planSlug.includes('prueba')) return false;

  // Si explícitamente es anual o semestral (ambos incluyen descargas según especificación de planes)
  if (extId.includes('PLAN_ANUAL') || extId.includes('PLAN_ANNUAL') || planSlug === 'anual' || planSlug === 'annual') {
    return true;
  }
  if (extId.includes('PLAN_SEMESTRAL') || planSlug === 'semestral') {
    return true;
  }

  // Compras directas de módulo de 365 días sin prefijo especial
  return true;
}

/**
 * Verifica si un usuario tiene permiso para descargar el Excel de un módulo.
 * Si el usuario no ha comprado un Plan Anual para ese módulo (o está usando el módulo gratis),
 * la descarga no está permitida.
 */
export function canUserDownloadModule(
  moduleId: string,
  purchases: any[],
  moduleGroup?: string,
  moduleSlug?: string
): boolean {
  if (!purchases || purchases.length === 0) return false;

  const targetId = (moduleId || '').toLowerCase().trim();
  const targetSlug = (moduleSlug || '').toLowerCase().trim();

  const matchingPurchase = purchases.find((p) => {
    if (!p || p.transaction?.status !== 'APPROVED') return false;
    if (isPurchaseExpired(p.purchase_date)) return false;
    const pModId = (p.module_id || '').toLowerCase().trim();
    return pModId === targetId || (targetSlug && pModId === targetSlug);
  });

  if (!matchingPurchase) return false;
  return isAnnualPlanPurchase(matchingPurchase);
}

/**
 * Definición estándar de los 5 módulos con periodo de prueba gratuito.
 */
export const FREE_TRIAL_MODULE_METADATA = [
  {
    module_id: '6830d368fecd7406dc6f9525',
    slug: 'libro-1ro',
    title: 'Matemáticas de Fedor 1°',
    group: 'Grado1',
    description: 'Módulo interactivo digital para grado 1°. Incluido en la prueba gratuita de 17 días.',
  },
  {
    module_id: '6830d619fecd7406dc6f96ad',
    slug: 'matematicas-fedor-2',
    title: 'Matemáticas de Fedor 2°',
    group: 'Grado2',
    description: 'Módulo interactivo digital para grado 2°. Incluido en la prueba gratuita de 17 días.',
  },
  {
    module_id: '6832543f6fee7c84b2f077c0',
    slug: 'matematicas-fedor-3',
    title: 'Matemáticas de Fedor 3°',
    group: 'Grado3',
    description: 'Módulo interactivo digital para grado 3°. Incluido en la prueba gratuita de 17 días.',
  },
  {
    module_id: '6832543f6fee7c84b2f077c1',
    slug: 'matematicas-fedor-4',
    title: 'Matemáticas de Fedor 4°',
    group: 'Grado4',
    description: 'Módulo interactivo digital para grado 4°. Incluido en la prueba gratuita de 17 días.',
  },
  {
    module_id: '6832543f6fee7c84b2f077c2',
    slug: 'matematicas-fedor-5',
    title: 'Matemáticas de Fedor 5°',
    group: 'Grado5',
    description: 'Módulo interactivo digital para grado 5°. Incluido en la prueba gratuita de 17 días.',
  },
];

