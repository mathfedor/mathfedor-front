'use client';

import React from 'react';
import unitTutsData from '@/mocks/data/book-unit-tuts-3.data.json';
import { fedorSpeak } from '../shared/Grade3Speech';

interface UnitWelcomeModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  unitIndex: number;
}

export function UnitOperationIcon3D({ unitIndex }: { unitIndex: number }) {
  // Unit 0: Adición (+) - Plus 3D
  if (unitIndex === 0) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u0_grad" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        {/* Horizontal bar */}
        <rect x="10" y="27" width="44" height="10" rx="5" fill="url(#u0_grad)" />
        {/* Vertical bar */}
        <rect x="27" y="10" width="10" height="44" rx="5" fill="url(#u0_grad)" />
      </svg>
    );
  }

  // Unit 1: Sustracción (-) - Minus 3D
  if (unitIndex === 1) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u1_grad" x1="32" y1="27" x2="32" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        <rect x="9" y="27" width="46" height="10" rx="5" fill="url(#u1_grad)" />
      </svg>
    );
  }

  // Unit 2: Multiplicación (×) - Times 3D
  if (unitIndex === 2) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u2_grad" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        <g transform="rotate(45 32 32)">
          <rect x="10" y="27" width="44" height="10" rx="5" fill="url(#u2_grad)" />
          <rect x="27" y="10" width="10" height="44" rx="5" fill="url(#u2_grad)" />
        </g>
      </svg>
    );
  }

  // Unit 3: División (÷) - Exact match to user Image 2!
  if (unitIndex === 3) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u3_grad" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        {/* Top dot */}
        <circle cx="32" cy="15" r="5.5" fill="url(#u3_grad)" />
        {/* Middle horizontal bar */}
        <rect x="9" y="27" width="46" height="10" rx="5" fill="url(#u3_grad)" />
        {/* Bottom dot */}
        <circle cx="32" cy="49" r="5.5" fill="url(#u3_grad)" />
      </svg>
    );
  }

  // Unit 4: Problemas SABER
  if (unitIndex === 4) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#A864E8] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
        🏆
      </div>
    );
  }

  // Unit 5: Factores y Múltiplos
  if (unitIndex === 5) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#A864E8] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
        🔢
      </div>
    );
  }

  // Unit 6: Fracciones
  if (unitIndex === 6) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#16876A] to-[#24C496] flex items-center justify-center text-2xl font-black text-white shadow-[0_4px_14px_rgba(22,135,106,0.4)]">
        ½
      </div>
    );
  }

  // Unit 7: Aplicaciones
  if (unitIndex === 7) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E40AF] to-[#3B82F6] flex items-center justify-center text-2xl text-white shadow-[0_4px_14px_rgba(30,64,175,0.4)]">
        📝
      </div>
    );
  }

  // Unit 8: Potenciación
  if (unitIndex === 8) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(217,119,6,0.4)]">
        ⚡
      </div>
    );
  }

  // Unit 9: Sistema Métrico
  if (unitIndex === 9) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(5,150,105,0.4)]">
        📏
      </div>
    );
  }

  // Unit 10: Geometría
  if (unitIndex === 10) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#DB2777] to-[#EC4899] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(219,39,119,0.4)]">
        📐
      </div>
    );
  }

  // Unit 11: Estadística
  if (unitIndex === 11) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4338CA] to-[#6366F1] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(67,56,202,0.4)]">
        📊
      </div>
    );
  }

  // Unit 12: Magnitudes
  if (unitIndex === 12) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#9333EA] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
        ⚖️
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#A864E8] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
      📘
    </div>
  );
}

export default function UnitWelcomeModal3ro({
  isOpen,
  onClose,
  unitIndex,
}: UnitWelcomeModal3roProps) {
  if (!isOpen) return null;

  const tuts = unitTutsData?.UNIT_TUTS || [];
  const tut = tuts[unitIndex] || {
    icon: '📘',
    title: `¡Unidad ${unitIndex + 1}!`,
    text: 'Aprende y domina los conceptos matemáticos de esta aventura.',
    steps: [
      'Explora las bases conceptuales con ejemplos didácticos',
      'Desarrolla el pensamiento matemático paso a paso',
      'Domina la operación con ejercicios interactivos',
      'Evalúa tus conocimientos con retos estilo SABER',
    ],
  };

  const handleStart = () => {
    fedorSpeak(`¡Empezamos la aventura en ${tut.title}!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9995] flex items-center justify-center select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9995,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        overflowY: 'auto',
      }}
    >
      <div
        className="unit-welcome-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '92%',
          maxWidth: 415,
          background: '#ffffff',
          borderRadius: 28,
          padding: '2rem 1.75rem 1.75rem',
          textAlign: 'center',
          boxShadow: '0 24px 65px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Floating 3D mathematical symbol with smooth continuous float animation */}
        <div
          className="floating-unit-icon"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            animation: 'floatIcon 2.6s ease-in-out infinite',
            flexShrink: 0,
          }}
        >
          <UnitOperationIcon3D unitIndex={unitIndex} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#7B2FBE',
            fontFamily: "'Baloo 2', 'Nunito', sans-serif",
            lineHeight: 1.3,
            marginBottom: '0.65rem',
            letterSpacing: '-0.02em',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {tut.title}
        </h2>

        {/* Subtitle / Description */}
        <p
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
          {tut.text}
        </p>

        {/* 4 Numbered Steps / Highlights with generous spacing */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: '1.5rem',
            textAlign: 'left',
            width: '100%',
          }}
        >
          {tut.steps.map((step, idx) => (
            <div
              key={idx}
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
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 5px rgba(123, 47, 190, 0.3)',
                }}
              >
                {idx + 1}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#333333',
                  lineHeight: 1.45,
                  flex: 1,
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Primary Action Button with prominent spacing */}
        <button
          type="button"
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #7B2FBE 0%, #8E3AD5 50%, #A864E8 100%)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: 15,
            border: 'none',
            boxShadow: '0 6px 20px rgba(123, 47, 190, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: '0.85rem',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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

        {/* Secondary Link: Omitir tutorial strictly centered with bottom breathing space */}
        <div style={{ width: '100%', textAlign: 'center', paddingBottom: 2 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12.5,
              color: '#aaaaaa',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              cursor: 'pointer',
              padding: '4px 8px',
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: '0.01em',
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
          </button>
        </div>

        <style>{`
          @keyframes popIn {
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
          @keyframes floatIcon {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          .floating-unit-icon {
            animation: floatIcon 2.6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
