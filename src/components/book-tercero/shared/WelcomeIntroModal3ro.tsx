'use client';

import React from 'react';

interface WelcomeIntroModal3roProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  '🌌 Explora la Galaxia Fedor — 5 planetas te esperan',
  '⭐ Gana XP, medallas y avatares espaciales',
  '📊 El docente ve el reporte en tiempo real',
  '🤖 IA Fedor analiza tu desempeño pedagógico',
];

export default function WelcomeIntroModal3ro({ isOpen, onClose }: WelcomeIntroModal3roProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9995,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          maxWidth: 380,
          width: '92%',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          animation: 'popIn 0.35s ease',
          fontFamily: "'Nunito', sans-serif",
          userSelect: 'none',
        }}
      >
        {/* Astronaut Icon without outer purple circle - identical to Image 1 */}
        <div
          style={{
            fontSize: 52,
            marginBottom: '.5rem',
            animation: 'float 3s ease-in-out infinite',
            lineHeight: 1,
          }}
        >
          🧑‍🚀
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 20,
            fontWeight: 900,
            color: '#7B2FBE',
            marginBottom: '.5rem',
            lineHeight: 1.2,
          }}
        >
          ¡Bienvenido a Matemáticas de Fedor!
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#666666',
            lineHeight: 1.6,
            marginBottom: '.85rem',
          }}
        >
          El libro interactivo de 3° grado. ¡4 planetas, 5 niveles, gamificación y análisis IA!
        </div>

        {/* 4 Steps */}
        <div
          style={{
            textAlign: 'left',
            marginBottom: '.85rem',
            display: 'grid',
            gap: 7,
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '7px 10px',
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
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '13px',
            fontSize: 14,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            marginBottom: '.5rem',
            boxShadow: '0 4px 14px rgba(123, 47, 190, 0.35)',
            transition: 'transform 0.15s ease, opacity 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ¡Empezar Aventura! 🚀
        </button>

        {/* Skip Link */}
        <div
          onClick={onClose}
          style={{
            fontSize: 12,
            color: '#aaaaaa',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginTop: 4,
          }}
        >
          Omitir tutorial
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
