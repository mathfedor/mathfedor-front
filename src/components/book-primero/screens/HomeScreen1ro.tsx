'use client';

import React from 'react';
import { useBook1, type Book1Screen } from '../context/Book1Context';
import Starfield from '@/components/book/shared/Starfield';
import UnitCard from '@/components/book/shared/UnitCard';
import type { Unit } from '@/types/book.types';

function calculateUnitProgress(unit: Unit, scores: Record<string, number>): number {
  if (!unit || !unit.topics) return 0;
  let done = 0;
  let total = 0;
  unit.topics.forEach((topic, ti) => {
    (topic.levels || []).forEach((_, li) => {
      total += 1;
      const key1 = `u${unit.index}t${ti}-n${li + 1}`;
      const key2 = topic.id ? `${topic.id}-n${li + 1}` : key1;
      if (typeof scores[key1] === 'number' || typeof scores[key2] === 'number') {
        done += 1;
      }
    });
  });
  return total ? Math.round((done / total) * 100) : 0;
}

export default function HomeScreen1ro() {
  const { book, student, coins, stars, streak, scores, selectUnit, goScreen } = useBook1();

  const units = book?.units || [];

  return (
    <div className="screen active" id="screen-home" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Hero Banner del Estudiante */}
      <div className="hero-banner">
        <Starfield count={40} />
        <div className="hero-planet" />
        <div className="hero-ring" />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.65rem', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
              boxShadow: '0 0 0 4px rgba(245,197,24,.6),0 8px 28px rgba(123,47,190,.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              animation: 'float 3.2s ease-in-out infinite',
            }}
          >
            {student?.avatar || '🧑‍🚀'}
          </div>
        </div>
        <div className="hero-title" style={{ position: 'relative', zIndex: 1 }}>
          ¡Hola, <em>{student?.name || 'Astronauta'}</em>!
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            color: '#FFE066',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '.04em',
            textShadow: '0 1px 4px rgba(0,0,0,.5)',
          }}
        >
          Explorador de 1° Grado · {student?.school || 'Matemáticas de Fedor'}
        </div>
        <div className="hero-stats" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 14, justifyContent: 'center', margin: '.6rem 0 .2rem' }}>
          <span className="hs-item">{coins}🪙</span>
          <span className="hs-item">{stars}⭐</span>
          <span className="hs-item">{streak}🔥 Racha</span>
        </div>
      </div>

      {/* Botones de acción rápida / Recursos extra */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { label: 'Tablas de Conteo', icon: '🔢', screen: 'tablas-conteo' as Book1Screen },
          { label: 'Problemas Cotidianos', icon: '🛒', screen: 'problemas' as Book1Screen },
          { label: 'Estándares MEN', icon: '📐', screen: 'estandares' as Book1Screen },
          { label: 'Conceptos', icon: '💡', screen: 'conceptos' as Book1Screen },
          { label: 'Diccionario', icon: '📖', screen: 'definiciones' as Book1Screen },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => goScreen(btn.screen)}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--border)',
              borderRadius: '16px',
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: '26px' }}>{btn.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text)', textAlign: 'center' }}>
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Título de Unidades de Aprendizaje */}
      <div className="sec-title" style={{ textAlign: 'left', marginBottom: '0.8rem' }}>
        📦 UNIDADES DE APRENDIZAJE
      </div>

      {/* Lista de Unidades hacia abajo (idéntico a 2° grado) */}
      <div style={{ display: 'grid', gap: '8px', marginBottom: '1.5rem' }}>
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            pct={calculateUnitProgress(unit, scores)}
            onClick={() => selectUnit(unit.index)}
            isGrade1={true}
          />
        ))}
      </div>
    </div>
  );
}
