'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';

const PROBLEMAS_1RO = [
  {
    q: 'Math tiene 3 manzanas rojas y Sumy le regala 2 manzanas verdes. ¿Cuántas manzanas tiene en total?',
    opts: ['4 manzanas', '5 manzanas', '6 manzanas'],
    ans: '5 manzanas',
    explain: 'Juntamos las manzanas: 3 + 2 = 5.',
    icon: '🍎',
  },
  {
    q: 'En un árbol hay 6 pajaritos. Si 2 salen volando, ¿cuántos pajaritos quedan en el árbol?',
    opts: ['3 pajaritos', '4 pajaritos', '5 pajaritos'],
    ans: '4 pajaritos',
    explain: 'Quitamos los que volaron: 6 - 2 = 4.',
    icon: '🐦',
  },
  {
    q: 'Jack compró un lápiz por 4 monedas y un borrador por 3 monedas. ¿Cuánto gastó en total?',
    opts: ['6 monedas', '7 monedas', '8 monedas'],
    ans: '7 monedas',
    explain: 'Sumamos los costos: 4 + 3 = 7 monedas.',
    icon: '✏️',
  },
  {
    q: 'En una canasta hay 8 flores. Se usan 5 para armar un ramo. ¿Cuántas flores quedan?',
    opts: ['2 flores', '3 flores', '4 flores'],
    ans: '3 flores',
    explain: 'Restamos las que se usaron: 8 - 5 = 3 flores.',
    icon: '🌸',
  },
];

export default function ProblemasScreen1ro() {
  const { goScreen } = useBook1();
  const [cur, setCur] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const p = PROBLEMAS_1RO[cur];

  return (
    <div
      style={{
        maxWidth: '1140px',
        width: '100%',
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
          background: 'linear-gradient(135deg, #0E5240, #34D399)',
          borderRadius: '20px',
          padding: '1.5rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '28px' }}>🛒</div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '24px',
            fontWeight: 900,
            margin: '4px 0',
          }}
        >
          Problemas Cotidianos (1° Primaria)
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Aprende a resolver situaciones del día a día con suma y resta.
        </p>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '2px solid #E5E7EB',
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#6B7280', marginBottom: '8px' }}>
          Problema {cur + 1} de {PROBLEMAS_1RO.length}
        </div>

        <div
          style={{
            fontSize: '18px',
            fontWeight: 900,
            color: '#1A0A3C',
            lineHeight: 1.4,
            marginBottom: '1.25rem',
            fontFamily: "'Baloo 2', sans-serif",
          }}
        >
          {p.icon} {p.q}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
          {p.opts.map((opt) => {
            const isPicked = selected === opt;
            const isCorrect = opt === p.ans;
            let bg = '#F9FAFB';
            let border = '2px solid #E5E7EB';

            if (selected) {
              if (isCorrect) {
                bg = '#DCF5EE';
                border = '2px solid #10B981';
              } else if (isPicked) {
                bg = '#FEE8E4';
                border = '2px solid #EF4444';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => !selected && setSelected(opt)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border,
                  background: bg,
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: selected ? 'default' : 'pointer',
                  textAlign: 'left',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#FFF8E0',
              border: '1.5px solid #F5C518',
              fontSize: '13px',
              fontWeight: 800,
              color: '#7A4400',
              marginBottom: '1rem',
            }}
          >
            💡 Explicación: {p.explain}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            disabled={!selected}
            onClick={() => {
              setSelected(null);
              setCur((c) => (c + 1) % PROBLEMAS_1RO.length);
            }}
            style={{
              padding: '10px 20px',
              background: selected ? '#10B981' : '#D1D5DB',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 900,
              fontSize: '14px',
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            {cur + 1 < PROBLEMAS_1RO.length ? 'Siguiente problema →' : 'Reiniciar problemas 🔄'}
          </button>
        </div>
      </div>
    </div>
  );
}
