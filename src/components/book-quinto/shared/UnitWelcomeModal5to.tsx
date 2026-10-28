'use client';

import React, { useEffect } from 'react';
import tutsRaw from '@/mocks/data/book-unit-tuts-5.data.json';
import { fedorTTS } from '@/services/tts.service';

interface UnitTutorialItem {
  icon: string;
  title: string;
  text: string;
  steps: string[];
}

interface UnitWelcomeModal5toProps {
  isOpen: boolean;
  unitIndex: number;
  unit?: any;
  onClose: () => void;
}

const UNIT_TUTS_5TO: UnitTutorialItem[] = (tutsRaw as any).UNIT_TUTS || [];

export function UnitOperationIcon3D5to({
  unitIndex,
  fallbackIcon,
  size = 58,
}: {
  unitIndex: number;
  fallbackIcon?: string;
  size?: number;
}) {
  // Unit 0: Adición (+) - 3D purple plus
  if (unitIndex === 0) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(123, 47, 190, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u5_plus_grad" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A864E8" />
            <stop offset="45%" stopColor="#873EE0" />
            <stop offset="100%" stopColor="#691FA8" />
          </linearGradient>
          <linearGradient id="u5_highlight" x1="32" y1="6" x2="32" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D6B4FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A864E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="9" y="26" width="46" height="12" rx="6" fill="url(#u5_plus_grad)" />
        <rect x="11" y="27" width="42" height="4" rx="2" fill="url(#u5_highlight)" opacity="0.65" />
        <rect x="26" y="9" width="12" height="46" rx="6" fill="url(#u5_plus_grad)" />
        <rect x="27" y="11" width="10" height="16" rx="3" fill="url(#u5_highlight)" opacity="0.65" />
      </svg>
    );
  }

  // Unit 1: Sustracción (-) - 3D orange minus
  if (unitIndex === 1) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(232, 101, 10, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u5_minus_grad" x1="32" y1="22" x2="32" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF9B4E" />
            <stop offset="50%" stopColor="#E8650A" />
            <stop offset="100%" stopColor="#C04B00" />
          </linearGradient>
          <linearGradient id="u5_minus_hi" x1="32" y1="22" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFDEBF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF9B4E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="8" y="24" width="48" height="16" rx="8" fill="url(#u5_minus_grad)" />
        <rect x="11" y="26" width="42" height="5" rx="2.5" fill="url(#u5_minus_hi)" opacity="0.75" />
      </svg>
    );
  }

  // Unit 2: Multiplicación (×) - 3D purple times
  if (unitIndex === 2) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(123, 47, 190, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u5_mult_grad" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A864E8" />
            <stop offset="50%" stopColor="#873EE0" />
            <stop offset="100%" stopColor="#691FA8" />
          </linearGradient>
        </defs>
        <g transform="rotate(45 32 32)">
          <rect x="9" y="26" width="46" height="12" rx="6" fill="url(#u5_mult_grad)" />
          <rect x="26" y="9" width="12" height="46" rx="6" fill="url(#u5_mult_grad)" />
        </g>
      </svg>
    );
  }

  // Unit 3: División (÷) - 3D cyan division
  if (unitIndex === 3) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(14, 116, 144, 0.4))',
          display: 'inline-block',
        }}
      >
        <defs>
          <linearGradient id="u5_div_grad" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="14" r="5.5" fill="url(#u5_div_grad)" />
        <rect x="9" y="26" width="46" height="12" rx="6" fill="url(#u5_div_grad)" />
        <circle cx="32" cy="50" r="5.5" fill="url(#u5_div_grad)" />
      </svg>
    );
  }

  // Other units: High resolution 3D floating icon
  return (
    <span
      style={{
        fontSize: size ? size - 6 : 52,
        lineHeight: 1,
        display: 'inline-block',
        filter: 'drop-shadow(0 4px 12px rgba(123, 47, 190, 0.25))',
      }}
    >
      {fallbackIcon || '📘'}
    </span>
  );
}

export default function UnitWelcomeModal5to({
  isOpen,
  unitIndex,
  unit,
  onClose,
}: UnitWelcomeModal5toProps) {
  if (!isOpen) return null;

  const tut = UNIT_TUTS_5TO[unitIndex] || null;
  const modalTitle = tut?.title || (unit?.name ? (unit.name.startsWith('¡') ? unit.name : `¡${unit.name}!`) : `¡Unidad ${unitIndex + 1}!`);
  const modalText = tut?.text || unit?.intro || 'Aprende y pon a prueba tus habilidades matemáticas con el Método Fedor.';
  const modalSteps = tut?.steps || (unit?.topics || []).map((t: any) => `${t.title}: ${t.desc || 'Práctica guiada'}`);
  const fallbackIcon = tut?.icon || unit?.icon || '📘';

  const handleSpeak = () => {
    try {
      fedorTTS.speak(`${modalTitle}. ${modalText}`);
    } catch {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${modalTitle}. ${modalText}`);
        utterance.lang = 'es-CO';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleStart = () => {
    try {
      fedorTTS.speak(modalTitle);
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div
      id="tutOverlay"
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99995,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="unit-welcome-card"
        style={{
          background: '#ffffff',
          borderRadius: 28,
          maxWidth: 415,
          width: '92%',
          padding: '2rem 1.75rem 1.75rem',
          textAlign: 'center',
          boxShadow: '0 24px 65px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          fontFamily: "'Nunito', sans-serif",
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'tutPopIn5 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.1rem',
            animation: 'tutIconFloat5 2.6s ease-in-out infinite',
            flexShrink: 0,
          }}
        >
          <UnitOperationIcon3D5to unitIndex={unitIndex} fallbackIcon={fallbackIcon} />
        </div>

        <div
          id="tutTitle"
          style={{
            fontFamily: "'Baloo 2', 'Nunito', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: '#7B2FBE',
            lineHeight: 1.3,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {modalTitle}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
          <button
            type="button"
            onClick={handleSpeak}
            title="Escuchar explicación"
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

        <div
          id="tutText"
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: '#555555',
            lineHeight: 1.55,
            maxWidth: 320,
            margin: '0 auto 1.35rem auto',
            textAlign: 'center',
          }}
        >
          {modalText}
        </div>

        {modalSteps.length > 0 && (
          <div
            id="tutSteps"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: '1.5rem',
              textAlign: 'left',
              width: '100%',
            }}
          >
            {modalSteps.map((stepText: string, i: number) => {
              const colonIdx = stepText.indexOf(':');
              const stepTitle = colonIdx !== -1 ? stepText.slice(0, colonIdx) : '';
              const stepDesc = colonIdx !== -1 ? stepText.slice(colonIdx + 1).trim() : stepText;

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    background: '#F7F4FF',
                    borderRadius: 14,
                    border: '1px solid #ECE6FA',
                    boxShadow: '0 1px 3px rgba(123, 47, 190, 0.04)',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#ffffff',
                      flexShrink: 0,
                      boxShadow: '0 2px 5px rgba(123, 47, 190, 0.3)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {stepTitle ? (
                      <>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 900,
                            color: '#3D1468',
                            display: 'inline',
                          }}
                        >
                          {stepTitle}:{' '}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: '#5A5372',
                            display: 'inline',
                            lineHeight: 1.45,
                          }}
                        >
                          {stepDesc}
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: '#333333',
                          lineHeight: 1.45,
                        }}
                      >
                        {stepDesc}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: 15,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            marginBottom: '0.85rem',
            boxShadow: '0 6px 20px rgba(123, 47, 190, 0.35)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(123, 47, 190, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(123, 47, 190, 0.35)';
          }}
        >
          <span>¡Empezar Aventura!</span>
          <span style={{ fontSize: 16 }}>🚀</span>
        </button>

        {/* Skip Link */}
        <div style={{ width: '100%', textAlign: 'center', paddingBottom: 2 }}>
          <div
            onClick={onClose}
            style={{
              fontSize: 12.5,
              color: '#aaaaaa',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              userSelect: 'none',
              fontFamily: "'Nunito', sans-serif",
              padding: '4px 8px',
              display: 'inline-block',
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

        <style>{`
          @keyframes tutPopIn5 {
            0% {
              transform: scale(0.92);
              opacity: 0;
            }
            70% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes tutIconFloat5 {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
