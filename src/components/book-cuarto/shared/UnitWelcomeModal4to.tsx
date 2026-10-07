'use client';

import React, { useEffect } from 'react';
import tutsRaw from '@/mocks/data/book-unit-tuts-4.data.json';

interface UnitTutorialItem {
  icon: string;
  title: string;
  text: string;
  steps: string[];
}

interface UnitWelcomeModal4toProps {
  isOpen: boolean;
  unitIndex: number;
  unit?: any;
  onClose: () => void;
}

const UNIT_TUTS_4TO: UnitTutorialItem[] = (tutsRaw as any).UNIT_TUTS || [];

export function UnitOperationIcon3D4to({
  unitIndex,
  fallbackIcon,
}: {
  unitIndex: number;
  fallbackIcon?: string;
}) {
  // Unit 0: Adición (+) - 3D glossy purple plus matching screenshot exactly
  if (unitIndex === 0) {
    return (
      <svg
        width="58"
        height="58"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(123, 47, 190, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u4_plus_grad" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A864E8" />
            <stop offset="45%" stopColor="#873EE0" />
            <stop offset="100%" stopColor="#691FA8" />
          </linearGradient>
          <linearGradient id="u4_highlight" x1="32" y1="6" x2="32" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D6B4FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A864E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Horizontal bar */}
        <rect x="9" y="26" width="46" height="12" rx="6" fill="url(#u4_plus_grad)" />
        <rect x="11" y="27" width="42" height="4" rx="2" fill="url(#u4_highlight)" opacity="0.65" />
        {/* Vertical bar */}
        <rect x="26" y="9" width="12" height="46" rx="6" fill="url(#u4_plus_grad)" />
        <rect x="27" y="11" width="10" height="16" rx="3" fill="url(#u4_highlight)" opacity="0.65" />
      </svg>
    );
  }

  // Unit 1: Sustracción (-) - 3D glossy purple minus
  if (unitIndex === 1) {
    return (
      <svg
        width="58"
        height="58"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(123, 47, 190, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u4_minus_grad" x1="32" y1="26" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A864E8" />
            <stop offset="50%" stopColor="#873EE0" />
            <stop offset="100%" stopColor="#691FA8" />
          </linearGradient>
          <linearGradient id="u4_m_hl" x1="32" y1="26" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D6B4FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A864E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="9" y="26" width="46" height="12" rx="6" fill="url(#u4_minus_grad)" />
        <rect x="11" y="27" width="42" height="4" rx="2" fill="url(#u4_m_hl)" opacity="0.65" />
      </svg>
    );
  }

  // Unit 2: Multiplicación (×) - 3D glossy purple times
  if (unitIndex === 2) {
    return (
      <svg
        width="58"
        height="58"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(123, 47, 190, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u4_mult_grad" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A864E8" />
            <stop offset="50%" stopColor="#873EE0" />
            <stop offset="100%" stopColor="#691FA8" />
          </linearGradient>
        </defs>
        <g transform="rotate(45 32 32)">
          <rect x="9" y="26" width="46" height="12" rx="6" fill="url(#u4_mult_grad)" />
          <rect x="26" y="9" width="12" height="46" rx="6" fill="url(#u4_mult_grad)" />
        </g>
      </svg>
    );
  }

  // Unit 3: División (÷) - 3D glossy purple division
  if (unitIndex === 3) {
    return (
      <svg
        width="58"
        height="58"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(123, 47, 190, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u4_div_grad" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A864E8" />
            <stop offset="50%" stopColor="#873EE0" />
            <stop offset="100%" stopColor="#691FA8" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="14" r="5.5" fill="url(#u4_div_grad)" />
        <rect x="9" y="26" width="46" height="12" rx="6" fill="url(#u4_div_grad)" />
        <circle cx="32" cy="50" r="5.5" fill="url(#u4_div_grad)" />
      </svg>
    );
  }

  // Other units: colorful emoji symbol with drop shadow
  return (
    <span
      style={{
        fontSize: 52,
        lineHeight: 1,
        display: 'inline-block',
        filter: 'drop-shadow(0 4px 10px rgba(123, 47, 190, 0.25))',
        fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
      }}
    >
      {fallbackIcon || '📘'}
    </span>
  );
}

function getUnitTutorial(unitIndex: number, unit?: any): UnitTutorialItem {
  const norm = (s: string) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const uName = norm(unit?.name || '');

  // 1. Try matching by subject keyword
  const matched = UNIT_TUTS_4TO.find((t) => {
    const tTitle = norm(t.title || '');
    if (uName.includes('adicion') && tTitle.includes('adicion')) return true;
    if (uName.includes('sustraccion') && tTitle.includes('sustraccion')) return true;
    if (uName.includes('multiplicacion') && tTitle.includes('multiplicacion')) return true;
    if (uName.includes('division') && tTitle.includes('division')) return true;
    if (uName.includes('problemas') && tTitle.includes('problemas')) return true;
    if (uName.includes('divisores') && tTitle.includes('divisores')) return true;
    if (uName.includes('mcd') && tTitle.includes('mcd')) return true;
    if (uName.includes('aplicaciones con fracciones') && tTitle.includes('aplicaciones con fracciones')) return true;
    if (
      uName.includes('fracciones') &&
      !uName.includes('aplicaciones') &&
      tTitle.includes('fracciones') &&
      !tTitle.includes('aplicaciones')
    )
      return true;
    if (uName.includes('metrico') && tTitle.includes('metrico')) return true;
    if (uName.includes('potenciacion') && tTitle.includes('potenciacion')) return true;
    if (uName.includes('geometria') && tTitle.includes('geometria')) return true;
    if (uName.includes('probabilidad') && tTitle.includes('probabilidad')) return true;
    return false;
  });

  if (matched) {
    return matched;
  }

  // 2. Bonus units
  if (uName.includes('calculo mental')) {
    return {
      icon: '🚀',
      title: '¡Unidad 14 — Bonus: Cálculo Mental!',
      text: 'Entrena tu velocidad y agilidad mental resolviendo operaciones a la velocidad de la luz.',
      steps: (unit?.topics || []).slice(0, 4).map((t: any) =>
        t.desc ? `${t.title}: ${t.desc}` : t.title
      ),
    };
  }

  if (uName.includes('retos multiplicativos')) {
    return {
      icon: '🏆',
      title: '¡Unidad 15 — Bonus: Retos Multiplicativos!',
      text: 'Domina los desafíos finales de multiplicación y conviértete en un piloto estelar experto.',
      steps: (unit?.topics || []).slice(0, 4).map((t: any) =>
        t.desc ? `${t.title}: ${t.desc}` : t.title
      ),
    };
  }

  // 3. Fallback by index in UNIT_TUTS_4TO
  if (UNIT_TUTS_4TO[unitIndex]) {
    return UNIT_TUTS_4TO[unitIndex];
  }

  // 4. Fallback generated from unit
  if (unit) {
    return {
      icon: unit.icon || '📘',
      title: `¡${unit.name}!`,
      text: unit.intro || 'Aprende y practica los conceptos matemáticos fundamentales con retos interactivos de 4°.',
      steps: (unit.topics || []).slice(0, 4).map((t: any) =>
        t.desc ? `${t.title}: ${t.desc}` : t.title
      ),
    };
  }

  return {
    icon: '➕',
    title: `¡Unidad ${unitIndex + 1}!`,
    text: 'Aprende y practica los conceptos matemáticos con los retos espaciales de Fedor.',
    steps: [
      'Observa el Proceso paso a paso en los ejemplos',
      'Resuelve cada reto antes de que se agote el tiempo',
      'Acumula puntos XP y estrellas para tu perfil',
    ],
  };
}

export default function UnitWelcomeModal4to({
  isOpen,
  unitIndex,
  unit,
  onClose,
}: UnitWelcomeModal4toProps) {
  const tut = getUnitTutorial(unitIndex, unit);

  // Stop any speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  // Dynamically ensure unit number matches unitIndex + 1
  let formattedTitle = tut.title;
  if (/Unidad\s+\d+/i.test(formattedTitle)) {
    formattedTitle = formattedTitle.replace(/Unidad\s+\d+/i, `Unidad ${unitIndex + 1}`);
  } else {
    formattedTitle = `¡Unidad ${unitIndex + 1} — ${formattedTitle.replace(/^[¡!]+|[¡!]+$/g, '')}!`;
  }
  formattedTitle = formattedTitle.replace(/\s*·\s*/g, ' • ');

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanTitle = formattedTitle.replace(/[¡!•·—]/g, ' ');
      const textToSpeak = `${cleanTitle}. ${tut.text}. ${tut.steps.join('. ')}.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-CO';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      id="tutOverlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99995,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 24,
          maxWidth: 380,
          width: '92%',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          fontFamily: "'Nunito', sans-serif",
          position: 'relative',
        }}
      >
        {/* Top 3D / Floating Unit Icon */}
        <div
          id="tutIcon"
          style={{
            marginBottom: '0.4rem',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UnitOperationIcon3D4to unitIndex={unitIndex} fallbackIcon={tut.icon} />
        </div>

        {/* Title in Purple/Lila */}
        <div
          id="tutTitle"
          style={{
            fontFamily: "'Baloo 2', 'Nunito', sans-serif",
            fontSize: 20,
            fontWeight: 900,
            color: '#7B2FBE',
            lineHeight: 1.25,
            marginBottom: '0.45rem',
            textAlign: 'center',
          }}
        >
          {formattedTitle}
        </div>

        {/* Sound / Read Aloud Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <button
            type="button"
            onClick={handleSpeak}
            title="Escuchar tutorial"
            style={{
              width: 32,
              height: 32,
              border: '1.5px solid #E2DDF5',
              borderRadius: 8,
              background: '#F9F8FE',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              cursor: 'pointer',
              color: '#7B2FBE',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#7B2FBE';
              e.currentTarget.style.background = '#F0EAFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2DDF5';
              e.currentTarget.style.background = '#F9F8FE';
            }}
          >
            🔊
          </button>
        </div>

        {/* Subtitle / Description */}
        <div
          id="tutText"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#666666',
            lineHeight: 1.55,
            marginBottom: '0.85rem',
            textAlign: 'center',
          }}
        >
          {tut.text}
        </div>

        {/* 4 Steps with Lila/Purple Number Badges */}
        <div
          id="tutSteps"
          style={{
            textAlign: 'left',
            marginBottom: '1rem',
            display: 'grid',
            gap: 7,
          }}
        >
          {tut.steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '6px 10px',
                background: '#F7F4FF',
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 900,
                  color: '#ffffff',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#333333',
                  lineHeight: 1.45,
                }}
              >
                {s}
              </div>
            </div>
          ))}
        </div>

        {/* Primary Action Button: Lila/Purple gradient */}
        <button
          type="button"
          onClick={handleClose}
          style={{
            width: '100%',
            padding: 13,
            fontSize: 14,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            marginBottom: '0.65rem',
            boxShadow: '0 4px 14px rgba(123, 47, 190, 0.35)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(123, 47, 190, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(123, 47, 190, 0.35)';
          }}
        >
          ¡Empezar Aventura! 🚀
        </button>

        {/* Skip Link */}
        <div
          onClick={handleClose}
          style={{
            fontSize: 12,
            color: '#aaaaaa',
            cursor: 'pointer',
            textDecoration: 'underline',
            userSelect: 'none',
            fontFamily: "'Nunito', sans-serif",
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#7B2FBE';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#aaaaaa';
          }}
        >
          Omitir tutorial
        </div>
      </div>
    </div>
  );
}

