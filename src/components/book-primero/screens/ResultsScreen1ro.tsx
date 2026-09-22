'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

export default function ResultsScreen1ro() {
  const { lastResults, goScreen, startLevel, selectUnit } = useBook1();

  if (!lastResults) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>
        <p>No hay resultados recientes.</p>
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
          Ir al inicio
        </button>
      </div>
    );
  }

  const { pct, correct, total, starsEarned, coinsEarned, xpEarned, unitIndex, topicIndex, levelIndex, answers } =
    lastResults;

  const passed = pct >= 70;

  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '1.5rem 1rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'center',
      }}
    >
      {/* Tarjeta de Resumen */}
      <div
        style={{
          background: passed
            ? 'linear-gradient(135deg, #0A3D28, #16876A, #0E5240)'
            : 'linear-gradient(135deg, #6A3200, #E8650A, #BA5500)',
          borderRadius: '24px',
          padding: '2rem 1.5rem',
          color: '#ffffff',
          boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>
          {passed ? '🏆' : '💪'}
        </div>

        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '28px',
            fontWeight: 900,
            margin: '0 0 4px',
          }}
        >
          {passed ? '¡Felicitaciones, lo lograste!' : '¡Buen intento, sigue practicando!'}
        </h1>

        <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '1.25rem' }}>
          Acertaste {correct} de {total} ejercicios ({pct}%)
        </div>

        {/* Estrellas */}
        <div style={{ fontSize: '32px', letterSpacing: '6px', marginBottom: '1.25rem' }}>
          {'⭐'.repeat(starsEarned)}
          {'☆'.repeat(Math.max(0, 3 - starsEarned))}
        </div>

        {/* Recompensas */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '16px',
            padding: '12px 20px',
            maxWidth: '320px',
            margin: '0 auto',
          }}
        >
          <div style={{ fontWeight: 900 }}>
            <span style={{ fontSize: '18px' }}>🪙</span> +{coinsEarned} Monedas
          </div>
          <div style={{ fontWeight: 900 }}>
            <span style={{ fontSize: '18px' }}>⚡</span> +{xpEarned} XP
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <button
          type="button"
          onClick={() => startLevel(unitIndex, topicIndex, levelIndex)}
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            border: '2px solid #D1D5DB',
            background: '#FFFFFF',
            fontWeight: 900,
            fontSize: '14px',
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          🔄 Reintentar nivel
        </button>

        {levelIndex < 4 && passed && (
          <button
            type="button"
            onClick={() => startLevel(unitIndex, topicIndex, levelIndex + 1)}
            style={{
              padding: '12px 24px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
            }}
          >
            ➡️ Siguiente nivel
          </button>
        )}

        <button
          type="button"
          onClick={() => selectUnit(unitIndex)}
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #FF8C2A, #E8650A)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          📋 Volver a la unidad
        </button>
      </div>

      {/* Desglose de respuestas */}
      {answers && answers.length > 0 && (
        <div style={{ textAlign: 'left' }}>
          <h3
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '18px',
              fontWeight: 900,
              color: '#1A0A3C',
              marginBottom: '10px',
            }}
          >
            Revisión de ejercicios:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {answers.map((ans, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  borderLeft: `4px solid ${ans.ok ? '#10B981' : '#EF4444'}`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937' }}>
                  {i + 1}. {ans.q}
                </div>
                <div style={{ fontSize: '12px', marginTop: '3px', color: ans.ok ? '#059669' : '#DC2626' }}>
                  {ans.ok
                    ? `✅ Tu respuesta: ${ans.user}`
                    : `❌ Respondiste: ${ans.user} · Correcta: ${ans.correct}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
