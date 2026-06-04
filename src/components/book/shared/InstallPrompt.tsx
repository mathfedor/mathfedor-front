'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'fedor2_pwa_dismissed';

/** Banner de instalación de la PWA (Android / Chrome de escritorio). */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(DISMISS_KEY) === '1') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  if (!deferred) return null;

  const dismiss = () => {
    setDeferred(null);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* almacenamiento no disponible */
    }
  };

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  return (
    <div className="install-prompt">
      <span className="ip-icon">🚀</span>
      <div className="ip-body">
        <div className="ip-title">Instala Matemáticas de Fedor</div>
        <div className="ip-sub">Acceso directo y uso sin conexión</div>
      </div>
      <button className="ip-install" onClick={install}>Instalar</button>
      <button className="ip-close" onClick={dismiss} aria-label="Cerrar">✕</button>
    </div>
  );
}
