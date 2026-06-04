'use client';

import { useEffect } from 'react';

/**
 * Registra el service worker e inyecta el manifest/theme-color para que el
 * libro sea instalable como PWA. No renderiza nada.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Manifest
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.webmanifest';
      document.head.appendChild(link);
    }
    // Theme color
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#6C28B4';
      document.head.appendChild(meta);
    }
    // Service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* registro no disponible (entorno sin SW) */
      });
    }
  }, []);

  return null;
}
