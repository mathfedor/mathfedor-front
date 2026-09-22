'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

const LEVEL_NAMES = [
  { short: 'N1', label: 'Básico', color: '#16876A', bg: '#DCF5EE' },
  { short: 'N2', label: 'Medio', color: '#E8650A', bg: '#FEF3E8' },
  { short: 'N3', label: 'Avanzado', color: '#C94B22', bg: '#FAECE7' },
  { short: 'N4', label: 'Experto', color: '#7B2FBE', bg: '#EEEDFE' },
  { short: 'N5', label: 'Evaluación', color: '#E8650A', bg: '#FEF8E0' },
];

export default function UnitScreen1ro() {
  const { book, currentUnit, scores, goScreen, startLevel } = useBook1();

  const unit = book?.units[currentUnit];

  if (!unit) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>
        <p>Unidad no encontrada.</p>
        <button
          type="button"
          onClick={() => goScreen('home')}
          style={{
            padding: '8px 16px',
            background: '#FF8C2A',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '1.25rem 1rem',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Botón superior Volver al inicio */}
      <div
        onClick={() => goScreen('home')}
        style={{
          cursor: 'pointer',
          fontWeight: 800,
          color: '#16876A',
          fontSize: '13px',
          marginBottom: '0.85rem',
          textAlign: 'left',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← Volver a las unidades
      </div>

      {/* Cabecera de la Unidad */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A3D28, #16876A, #0E5240)',
          borderRadius: '22px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          marginBottom: '1.5rem',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            background: 'rgba(245,197,24,0.2)',
            border: '1px solid rgba(245,197,24,0.4)',
            color: '#FFE066',
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '6px',
          }}
        >
          Unidad {currentUnit + 1}
        </div>

        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '26px',
            fontWeight: 900,
            lineHeight: 1.2,
            margin: '2px 0 6px',
          }}
        >
          {unit.name}
        </h1>

        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1.4 }}>
          {unit.std || 'Aprende y practica con los ejemplos didácticos y ejercicios interactivos.'}
        </p>
      </div>

      {/* Lista de Temas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {unit.topics.map((topic, ti) => {
          return (
            <div
              key={topic.id || ti}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.25rem',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                textAlign: 'left',
              }}
            >
              {/* Info del tema */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '24px' }}>{topic.icon || '📌'}</span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontSize: '18px',
                      fontWeight: 900,
                      color: '#1A0A3C',
                    }}
                  >
                    {topic.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700 }}>
                    {topic.desc || 'Desarrolla el pensamiento matemático'}
                  </div>
                </div>
              </div>

              {/* Botones de Niveles (N1 a N5) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: '8px',
                }}
              >
                {LEVEL_NAMES.map((lvl, li) => {
                  const levelKey = topic.id ? `${topic.id}-n${li + 1}` : `u${currentUnit}t${ti}-n${li + 1}`;
                  const score = scores[levelKey];
                  const hasPassed = typeof score === 'number' && score >= 70;

                  return (
                    <button
                      key={lvl.short}
                      type="button"
                      onClick={() => startLevel(currentUnit, ti, li)}
                      style={{
                        background: lvl.bg,
                        border: `1.5px solid ${lvl.color}`,
                        borderRadius: '12px',
                        padding: '8px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 900,
                          color: lvl.color,
                        }}
                      >
                        {lvl.short} · {lvl.label}
                      </div>

                      {hasPassed ? (
                        <div style={{ fontSize: '11px', fontWeight: 900, color: '#16876A' }}>
                          ⭐ {score}%
                        </div>
                      ) : (
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280' }}>
                          20 ejerc.
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
