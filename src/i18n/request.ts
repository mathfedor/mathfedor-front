import { getRequestConfig } from 'next-intl/server';
import { routing, Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Si no se especifica o no es válido, usar default 'es'
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // Cargar namespaces de mensajes
  const commonMessages = (await import(`../../messages/${locale}/common.json`)).default;
  const authMessages = (await import(`../../messages/${locale}/auth.json`)).default;
  const homeMessages = (await import(`../../messages/${locale}/home.json`)).default;
  const booksMessages = (await import(`../../messages/${locale}/books.json`)).default;
  const dashboardMessages = (await import(`../../messages/${locale}/dashboard.json`)).default;
  const retosMessages = (await import(`../../messages/${locale}/retos.json`)).default;

  return {
    locale,
    messages: {
      ...commonMessages,
      auth: authMessages,
      home: homeMessages,
      books: booksMessages,
      dashboard: dashboardMessages,
      retos: retosMessages,
    },
  };
});
