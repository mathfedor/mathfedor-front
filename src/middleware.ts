import createMiddleware from 'next-intl/middleware';
import { routing, Locale } from './i18n/routing';
import { NextRequest } from 'next/server';

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Prioridad 1: Cookie NEXT_LOCALE (gestionada automáticamente por next-intl)
  const nextLocaleCookie = request.cookies.get('NEXT_LOCALE')?.value;

  // Prioridad 2: Preferencia del usuario autenticado guardada en cookie 'user_locale'
  if (!nextLocaleCookie) {
    const userLocale = request.cookies.get('user_locale')?.value;
    if (userLocale && routing.locales.includes(userLocale as Locale)) {
      request.cookies.set('NEXT_LOCALE', userLocale);
    }
  }

  // Prioridad 3 y 4: Accept-Language del navegador -> default 'es' (gestionado por handleI18n)
  return handleI18n(request);
}

export const config = {
  // Rutas que intercepta el middleware (excluyendo /api, /_next, archivos estáticos con punto)
  matcher: [
    '/',
    '/(es|en|pt|fr|de)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
