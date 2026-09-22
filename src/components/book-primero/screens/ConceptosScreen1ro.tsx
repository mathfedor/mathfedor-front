'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

const CONCEPTOS_1RO = [
  {
    title: '¿Qué es la Adición o Suma?',
    icon: '➕',
    desc: 'Sumar es juntar, reunir o añadir dos o más grupos de cosas para saber cuántas hay en total. Usamos el signo más (+).',
    example: '3 globos + 2 globos = 5 globos.',
  },
  {
    title: '¿Qué es la Sustracción o Resta?',
    icon: '➖',
    desc: 'Restar es quitar una cantidad de otra, o encontrar la diferencia entre dos números. Usamos el signo menos (-).',
    example: '5 galletas - 2 galletas = 3 galletas.',
  },
  {
    title: 'La Decena',
    icon: '🔟',
    desc: 'Una decena es un grupo formado exactamente por 10 unidades. 1 Decena = 10 Unidades.',
    example: '10 lápices sueltos forman 1 estuche de una decena.',
  },
  {
    title: 'Mayor que y Menor que',
    icon: '⚖️',
    desc: 'Comparamos dos números para saber cuál tiene más elementos (mayor) y cuál tiene menos elementos (menor).',
    example: '8 es mayor que 3 (8 > 3).',
  },
  {
    title: 'La Docena',
    icon: '🥚',
    desc: 'Una docena es un conjunto formado exactamente por 12 elementos.',
    example: 'Una caja con 12 huevos es 1 docena de huevos.',
  },
];

export default function ConceptosScreen1ro() {
  const { goScreen } = useBook1();

  return (
    <div
      style={{
        maxWidth: '760px',
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
          background: 'linear-gradient(135deg, #2A0F60, #7B2FBE)',
          borderRadius: '20px',
          padding: '1.5rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '28px' }}>💡</div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '24px',
            fontWeight: 900,
            margin: '4px 0',
          }}
        >
          Conceptos Matemáticos de 1°
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Las ideas fundamentales explicadas de manera sencilla y visual.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {CONCEPTOS_1RO.map((c) => (
          <div
            key={c.title}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1.5px solid #E5E7EB',
              boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '6px' }}>
              <span style={{ fontSize: '22px' }}>{c.icon}</span>
              <h3
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '17px',
                  fontWeight: 900,
                  color: '#1A0A3C',
                  margin: 0,
                }}
              >
                {c.title}
              </h3>
            </div>
            <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: 1.5, margin: '0 0 8px' }}>
              {c.desc}
            </p>
            <div
              style={{
                background: '#FEF3E8',
                borderLeft: '3px solid #FF8C2A',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 800,
                color: '#7A3200',
              }}
            >
              Ejemplo: {c.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
