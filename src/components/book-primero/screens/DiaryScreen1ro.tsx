'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

const LORE_CHAPTERS = [
  {
    id: 'ch0',
    unit: 0,
    emoji: '🌍',
    title: 'Capítulo 1 — La partida',
    text: 'El Capitán Fedor recibe la llamada del Almirante Estelar: «La Galaxia del Saber está perdiendo sus números». Despega de la Tierra a bordo del cohete Cadete con un mapa antiguo del universo de las matemáticas. Tu misión empieza aquí.',
  },
  {
    id: 'ch1',
    unit: 1,
    emoji: '🔴',
    title: 'Capítulo 2 — Marte y la Tienda',
    text: 'En Marte, Fedor encuentra una tienda mágica que abre y cierra con números. Para entrar, hay que descubrir qué se vendió: minuendo menos sustraendo igual diferencia. Las puertas rojas se abren y un mapa del próximo planeta brilla en la pared.',
  },
  {
    id: 'ch2',
    unit: 2,
    emoji: '🪐',
    title: 'Capítulo 3 — Los anillos de Saturno',
    text: 'Saturno guarda en sus anillos la Tabla Mágica. Fedor escucha a Jack contar regalos en grupos iguales. Multiplicar es sumar el mismo número. Cuando completas la tabla del 1 al 10, los anillos se iluminan y revelan la siguiente coordenada.',
  },
  {
    id: 'ch3',
    unit: 3,
    emoji: '🔵',
    title: 'Capítulo 4 — Las aguas de Neptuno',
    text: 'Bajo el océano azul de Neptuno, Fedor reparte chocolatinas entre los astronautas. Algunas reparticiones son perfectas (residuo cero), otras dejan sobras. Cada vez que aciertas una división, una corriente te empuja más profundo, hacia el corazón del planeta.',
  },
  {
    id: 'ch4',
    unit: 4,
    emoji: '☀️',
    title: 'Capítulo 5 — La Estrella Final',
    text: 'En el Sol, el Monstruo de las Sombras intenta apagar todas las matemáticas del universo. Fedor lo enfrenta con perímetros, áreas y figuras. Si llegas hasta aquí y vences, te coronarán Almirante Estelar y la galaxia recordará tu nombre por siempre.',
  },
];

export default function DiaryScreen1ro() {
  const { book, scores, goScreen } = useBook1();

  const units = book?.units || [];

  const isChapterUnlocked = (unitIdx: number) => {
    if (unitIdx === 0) return true; // first chapter is unlocked
    const unit = units[unitIdx];
    if (!unit || !unit.topics) return false;
    let done = 0;
    let total = 0;
    unit.topics.forEach((t, ti) => {
      (t.levels || []).forEach((_, li) => {
        total += 1;
        const k1 = `u${unit.index}t${ti}-n${li + 1}`;
        const k2 = t.id ? `${t.id}-n${li + 1}` : k1;
        if (typeof scores[k1] === 'number' || typeof scores[k2] === 'number') {
          done += 1;
        }
      });
    });
    return total > 0 && (done / total) >= 0.5;
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => goScreen('home')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #DDD8F5',
            color: '#7B2FBE',
            borderRadius: '20px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(123,47,190,0.1)',
          }}
        >
          ← Volver al Inicio
        </button>
        <span style={{ fontSize: '13px', fontWeight: 900, color: '#7B2FBE' }}>
          📖 Diario del Capitán Fedor
        </span>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #1A0848, #2A0F60, #080E30)',
          borderRadius: '24px',
          padding: '1.8rem',
          color: '#fff',
          boxShadow: '0 12px 40px rgba(0,0,0,.4)',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '38px', marginBottom: '8px' }}>📖</div>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '26px', fontWeight: 900, color: '#FFD66B' }}>
          Diario del Capitán Fedor
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.8)', maxWidth: '520px', margin: '4px auto 0' }}>
          Cada vez que avanzas en un planeta de la Galaxia del Saber, se revelan los secretos del cosmos en este diario de a bordo.
        </div>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {LORE_CHAPTERS.map((ch, idx) => {
          const unlocked = isChapterUnlocked(ch.unit);
          return (
            <div
              key={ch.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.2rem 1.4rem',
                border: unlocked ? '1.5px solid #DDD8F5' : '1.5px dashed #CCC',
                boxShadow: '0 2px 12px rgba(108,40,180,0.05)',
                display: 'flex',
                gap: '16px',
                opacity: unlocked ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  fontSize: '36px',
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: unlocked ? '#F0EDFF' : '#F2F2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {unlocked ? ch.emoji : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px', fontWeight: 900, color: unlocked ? '#2A0F60' : '#888' }}>
                    {ch.title}
                  </div>
                  {!unlocked && (
                    <span style={{ fontSize: '10px', fontWeight: 900, background: '#FFEFE6', color: '#BA340A', padding: '3px 8px', borderRadius: '10px' }}>
                      🔒 Requiere 50% de la Unidad {ch.unit + 1}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: unlocked ? '#444' : '#999', marginTop: '6px', lineHeight: 1.5 }}>
                  {unlocked ? ch.text : 'Avanza en tu viaje estelar para desbloquear esta parte de la historia.'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
