'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';
import { fedorTTS } from '@/services/tts.service';

const TABLA_1_10 = [
  { num: 1, em: '⭐', word: 'Uno' },
  { num: 2, em: '🍎🍎', word: 'Dos' },
  { num: 3, em: '🐱🐱🐱', word: 'Tres' },
  { num: 4, em: '⚽⚽⚽⚽', word: 'Cuatro' },
  { num: 5, em: '🐶🐶🐶🐶🐶', word: 'Cinco' },
  { num: 6, em: '🌸🌸🌸🌸🌸🌸', word: 'Seis' },
  { num: 7, em: '🎈🎈🎈🎈🎈🎈🎈', word: 'Siete' },
  { num: 8, em: '🌟🌟🌟🌟🌟🌟🌟🌟', word: 'Ocho' },
  { num: 9, em: '🚀🚀🚀🚀🚀🚀🚀🚀🚀', word: 'Nueve' },
  { num: 10, em: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪', word: 'Diez' },
];

export default function TablasConteoScreen1ro() {
  const { goScreen } = useBook1();

  const handleSpeak = (text: string) => {
    fedorTTS.speak(text);
  };

  return (
    <div
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: '1.25rem 1rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'left',
      }}
    >
      <div
        onClick={() => goScreen('home')}
        style={{
          cursor: 'pointer',
          fontWeight: 800,
          color: '#16876A',
          fontSize: '13px',
          marginBottom: '0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← Volver al inicio
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0A3A6A, #1A6CB4, #4DA6FF)',
          borderRadius: '20px',
          padding: '1.5rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '28px' }}>🔢</div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '24px',
            fontWeight: 900,
            margin: '4px 0',
          }}
        >
          Tablas de Conteo (1 al 10)
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Observa, cuenta y toca cada fila para escuchar su pronunciación.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {TABLA_1_10.map((row) => (
          <div
            key={row.num}
            onClick={() => handleSpeak(`Número ${row.num}: ${row.word}`)}
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              border: '1.5px solid #E5E7EB',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'transform 0.15s, border-color 0.15s',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.99)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#FF8C2A',
                color: '#fff',
                fontWeight: 900,
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Baloo 2', sans-serif",
                flexShrink: 0,
              }}
            >
              {row.num}
            </div>

            <div style={{ flex: 1, fontSize: '20px', letterSpacing: '2px' }}>
              {row.em}
            </div>

            <div style={{ fontWeight: 900, fontSize: '15px', color: '#16876A' }}>
              {row.word}
            </div>

            <div style={{ fontSize: '16px', color: '#6B7280' }}>🔊</div>
          </div>
        ))}
      </div>
    </div>
  );
}
