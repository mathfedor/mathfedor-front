'use client';

import React, { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter, Locale } from '@/i18n/routing';

interface LocaleOption {
  code: Locale;
  label: string;
  flag: string;
}

const LOCALES: LocaleOption[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function LocaleSwitcher({ className = '' }: { className?: string }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    if (nextLocale === currentLocale) return;

    // Persistir cookie NEXT_LOCALE (httpOnly: false, sameSite: lax, maxAge: 365 días)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Transición no bloqueante sin recargar la página completa
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor="locale-switcher-select" className="sr-only">
        Seleccionar idioma / Select language
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-2.5 pointer-events-none text-xs select-none" aria-hidden="true">
          🌐
        </span>
        <select
          id="locale-switcher-select"
          aria-label="Seleccionar idioma"
          value={currentLocale}
          disabled={isPending}
          onChange={handleLocaleChange}
          className={`
            appearance-none cursor-pointer pl-7 pr-6 py-1.5 rounded-lg text-xs font-bold
            bg-white/95 dark:bg-gray-800 text-gray-800 dark:text-gray-100
            border border-gray-200 dark:border-gray-700
            shadow-xs hover:bg-white hover:border-orange-300
            focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]
            transition-all duration-150
            ${isPending ? 'opacity-60 cursor-wait' : ''}
          `}
        >
          {LOCALES.map((loc) => (
            <option key={loc.code} value={loc.code} className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white">
              {loc.flag} {loc.code.toUpperCase()}
            </option>
          ))}
        </select>
        <span className="absolute right-2 pointer-events-none text-gray-400 text-[9px] select-none" aria-hidden="true">
          ▼
        </span>
      </div>
    </div>
  );
}
