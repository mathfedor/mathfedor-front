'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { trackWhatsAppContact } from '@/lib/analytics/whatsapp';

interface WhatsAppFloatingButtonProps {
  /** Número de WhatsApp en formato internacional sin signos (ej: 573107199897) */
  phoneNumber?: string;
  /** Mensaje predeterminado opcional */
  customMessage?: string;
  /** Nombre del grado o contexto opcional para analítica */
  gradeName?: string;
  /** Texto del tooltip de acompañamiento */
  tooltipText?: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

interface LandingGradeConfig {
  gradeName: string;
  message: string;
  tooltipText: string;
}

/**
 * Determina la configuración contextual de WhatsApp según la URL de la landing
 */
function getLandingGradeConfig(pathname: string | null): LandingGradeConfig {
  const path = pathname || '';

  if (path.includes('/landing/primero') || path.includes('/primero')) {
    return {
      gradeName: '1° Primaria',
      message: 'Hola, tengo una pregunta sobre el Módulo de 1° Primaria',
      tooltipText: '¿Dudas de 1° Primaria? Escríbenos',
    };
  }

  if (path.includes('/landing/segundo') || path.includes('/segundo')) {
    return {
      gradeName: '2° Primaria',
      message: 'Hola, tengo una pregunta sobre el Módulo de 2° Primaria',
      tooltipText: '¿Dudas de 2° Primaria? Escríbenos',
    };
  }

  if (path.includes('/landing/tercero') || path.includes('/tercero')) {
    return {
      gradeName: '3° Primaria',
      message: 'Hola, tengo una pregunta sobre el Módulo de 3° Primaria',
      tooltipText: '¿Dudas de 3° Primaria? Escríbenos',
    };
  }

  // Predeterminado: Landing principal (Grado 11 - ICFES Saber 11°)
  return {
    gradeName: 'Grado 11',
    message: 'Hola, tengo una pregunta sobre el Módulo de Grado 11',
    tooltipText: '¿Dudas de Grado 11? Escríbenos',
  };
}

export default function WhatsAppFloatingButton({
  phoneNumber = '573107199897',
  customMessage,
  gradeName,
  tooltipText,
  className = '',
}: WhatsAppFloatingButtonProps) {
  const pathname = usePathname();
  const config = getLandingGradeConfig(pathname);

  const activeGradeName = gradeName || config.gradeName;
  const activeMessage = customMessage || config.message;
  const activeTooltip = tooltipText || config.tooltipText;

  const encodedMessage = encodeURIComponent(activeMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const handleClick = () => {
    // Disparar los 3 eventos de analítica:
    // 1. Meta / Facebook: fbq('track', 'Contact')
    // 2. TikTok: ttq.track('Contact')
    // 3. Google Tag Manager: dataLayer.push({ event: 'whatsapp_click' })
    trackWhatsAppContact({
      grade: activeGradeName,
      placement: 'floating',
      url: whatsappUrl,
    });
  };

  return (
    <aside
      aria-label="Atención al cliente vía WhatsApp"
      className={`fixed right-4 sm:right-6 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-24 z-40 flex items-center group ${className}`}
    >
      {/* Tooltip / Pill de acompañamiento al lector en pantallas sm en adelante */}
      <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 mr-3 rounded-full bg-white/95 text-slate-800 text-xs font-bold shadow-lg border border-slate-100 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-emerald-200 pointer-events-none select-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{activeTooltip}</span>
      </div>

      {/* Botón flotante interactivo con enlace a WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={`Contactar por WhatsApp para asesoría sobre ${activeGradeName}`}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#25D366] via-[#20ba5a] to-[#128C7E] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Efecto de pulso / radar para captar atención amigablemente */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Indicador de estado en línea */}
        <span
          className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full shadow-sm"
          aria-hidden="true"
        />

        {/* Ícono oficial vectorial de WhatsApp */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z" />
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.22-1.31C8.6 21.49 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.63 0-3.15-.47-4.44-1.29l-.32-.2-3.1.81.83-3.02-.21-.34A8.17 8.17 0 0 1 3.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
        </svg>
      </a>
    </aside>
  );
}
