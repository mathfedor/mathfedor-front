'use client';

import React from 'react';

interface WelcomeIntroModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_STEPS = [
  '🌌 Explora la Galaxia Fedor — 15 planetas te esperan',
  '⭐ Gana XP, medallas y avatares espaciales',
  '📊 El docente ve el reporte en tiempo real',
  '🤖 IA Fedor analiza tu desempeño pedagógico',
];

export default function WelcomeIntroModal4to({ isOpen, onClose }: WelcomeIntroModal4toProps) {
  if (!isOpen) return null;

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text =
        '¡Bienvenido a Matemáticas de Fedor! El libro interactivo de 4° grado. 15 planetas, 5 niveles, gamificación y análisis pedagógico con inteligencia artificial.';
      const utterance = new SpeechSynthesisUtterance(text);
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
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
          fontFamily: "'Nunito', sans-serif",
          position: 'relative',
        }}
      >
        {/* Floating Astronaut Icon */}
        <div
          id="tutIcon"
          style={{
            fontSize: 52,
            marginBottom: '0.4rem',
            lineHeight: 1,
            display: 'inline-block',
          }}
        >
          🧑‍🚀
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
          }}
        >
          ¡Bienvenido a Matemáticas de<br />Fedor!
        </div>

        {/* Sound / Read Aloud Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <button
            type="button"
            onClick={handleSpeak}
            title="Escuchar bienvenida"
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
          }}
        >
          El libro interactivo de 4° grado. ¡15 planetas, 5 niveles, gamificación y análisis IA!
        </div>

        {/* 4 Steps with Lila Number Badges */}
        <div
          id="tutSteps"
          style={{
            textAlign: 'left',
            marginBottom: '1rem',
            display: 'grid',
            gap: 7,
          }}
        >
          {WELCOME_STEPS.map((s, i) => (
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
          onClick={onClose}
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
          onClick={onClose}
          style={{
            fontSize: 12,
            color: '#aaaaaa',
            cursor: 'pointer',
            textDecoration: 'underline',
            userSelect: 'none',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Omitir tutorial
        </div>
      </div>
    </div>
  );
}
