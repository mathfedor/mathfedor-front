'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

const COOKIE_CONSENT_KEY = 'metodo_fedor_cookie_consent';

type CookieConsent = 'accepted' | 'rejected';

export default function CookieConsentBanner() {
  const t = useTranslations('cookies');
  const [consent, setConsent] = useState<CookieConsent | null | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsent | null;
    setConsent(storedConsent);
  }, []);

  const saveConsent = (nextConsent: CookieConsent) => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, nextConsent);
    setConsent(nextConsent);
  };

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  if (consent !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[60] max-w-[400px] rounded-lg border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-[#232323]">
      <p className="mb-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
        {t('text')}{' '}
        <Link href="/legal/politica-cookies" className="text-gray-600 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-white font-medium">
          {t('policy_link')}
        </Link>{' '}
        {t('or_manage')}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => saveConsent('accepted')}
          className="flex-1 rounded-md border border-gray-200 py-2.5 text-sm font-bold text-indigo-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-indigo-400 dark:hover:bg-[#1C1D1F]"
        >
          {t('accept_all')}
        </button>
        <button
          type="button"
          onClick={() => saveConsent('rejected')}
          className="flex-1 rounded-md border border-gray-200 py-2.5 text-sm font-bold text-indigo-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-indigo-400 dark:hover:bg-[#1C1D1F]"
        >
          {t('reject_all')}
        </button>
      </div>
    </div>
  );
}
