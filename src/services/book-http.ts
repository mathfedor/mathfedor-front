/**
 * Configuración HTTP compartida para los servicios del libro.
 * Centraliza la URL base, el slug, el flag de backend y las cabeceras
 * con el token Bearer (consistente con `api.config.ts` / `module.service.ts`).
 */

import { authService } from './auth.service';

export const BOOK_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const BOOK_SLUG = 'matematicas-fedor-2';

/** ¿Operar contra el backend real? Requiere URL y flag explícito. */
export function bookBackendEnabled(): boolean {
  return Boolean(BOOK_API_URL && process.env.NEXT_PUBLIC_BOOK_API === 'true');
}

/** Cabeceras JSON + Authorization si hay sesión. */
export function bookHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = authService.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
