/**
 * Configuración HTTP compartida para los servicios del libro.
 * Centraliza la URL base, el slug, el flag de backend y las cabeceras
 * con el token Bearer (consistente con `api.config.ts` / `module.service.ts`).
 */

import { authService } from './auth.service';

export const BOOK_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/learning`;
export const BOOK_SLUG = 'matematicas-fedor-2';

/** ¿Operar contra el backend real? Basta con tener definida la URL del backend. */
export function bookBackendEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL);
}

/** Cabeceras JSON + Authorization si hay sesión. */
export function bookHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = authService.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
