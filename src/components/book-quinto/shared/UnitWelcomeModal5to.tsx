'use client';

import React, { useEffect } from 'react';
import tutsRaw from '@/mocks/data/book-unit-tuts-5.data.json';

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
}: {
  unitIndex: number;
  fallbackIcon?: string;
}) {
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

  if (unitIndex === 1) {
    return (
      <svg
        width="58"
        height="58"
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

  return (
    <span
      style={{
        fontSize: 48,
        lineHeight: 1,
        display: 'inline-block',
        filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2))',
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
  const rawTitle = tut?.title || (unit?.name ? `¡${unit.name}!` : `¡Unidad ${unitIndex + 1}!`);
  const modalTitle = rawTitle.replace(/^¡?Unidad\s+\d+\s*[-—–]?\s*/i, '¡').trim();
  const modalText = tut?.text || unit?.intro || 'Aprende y pon a prueba tus habilidades matemáticas.';
  const modalSteps = tut?.steps || (unit?.topics || []).map((t: any) => `${t.title}: ${t.desc || 'Práctica guiada'}`);
  const fallbackIcon = tut?.icon || unit?.icon || '📘';

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakText = `${modalTitle}. ${modalText}`;
      const utterance = new SpeechSynthesisUtterance(speakText);
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
        background: 'rgba(0, 0, 0, 0.78)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 22,
          maxWidth: 420,
          width: '94%',
          padding: '1.6rem 1.5rem',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
          fontFamily: "'Nunito', sans-serif",
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <UnitOperationIcon3D5to unitIndex={unitIndex} fallbackIcon={fallbackIcon} />
        </div>

        <div
          id="tutTitle"
          style={{
            fontFamily: "'Baloo 2', 'Nunito', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: '#7B2FBE',
            lineHeight: 1.25,
            marginBottom: '0.45rem',
          }}
        >
          {modalTitle}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.65rem' }}>
          <button
            type="button"
            onClick={handleSpeak}
            title="Escuchar explicación"
            style={{
              width: 34,
              height: 34,
              border: '1.5px solid #E2DDF5',
              borderRadius: 10,
              background: '#F9F8FE',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              cursor: 'pointer',
              color: '#7B2FBE',
              transition: 'all 0.15s ease',
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
            lineHeight: 1.5,
            marginBottom: '1rem',
          }}
        >
          {modalText}
        </div>

        {modalSteps.length > 0 && (
          <div
            id="tutSteps"
            style={{
              textAlign: 'left',
              marginBottom: '1.25rem',
              display: 'grid',
              gap: 8,
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
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 12px',
                    background: '#F7F4FF',
                    borderRadius: 12,
                    border: '1px solid #ECE6FA',
                  }}
                >
                  <div
                    style={{
                      minWidth: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#ffffff',
                      flexShrink: 0,
                      marginTop: 2,
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
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#5A5372',
                            display: 'inline',
                            lineHeight: 1.4,
                          }}
                        >
                          {stepDesc}
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#333333',
                          lineHeight: 1.4,
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
          onClick={onClose}
          style={{
            width: '100%',
            padding: 14,
            fontSize: 15,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            boxShadow: '0 6px 18px rgba(123, 47, 190, 0.35)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 8px 22px rgba(123, 47, 190, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(123, 47, 190, 0.35)';
          }}
        >
          ¡Entendido, vamos a aprender! 🚀
        </button>
      </div>
    </div>
  );
}
