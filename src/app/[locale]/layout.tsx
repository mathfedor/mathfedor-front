import type { Metadata } from 'next';
import '../globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import RecaptchaProvider from '@/components/RecaptchaProvider';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { Analytics } from '@/components/analytics';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, Locale } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Matemáticas de Fedor',
  description: 'Plataforma Educativa de Matemáticas',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Habilitar renderizado estático con request locale
  setRequestLocale(locale);

  // Obtener mensajes para el cliente
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <RecaptchaProvider>
              <Navbar />
              <main>{children}</main>
              <CookieConsentBanner />
            </RecaptchaProvider>
          </ThemeProvider>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
