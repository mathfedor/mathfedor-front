'use client';

import { useMemo } from 'react';
import { useBook } from '../context/BookContext';
import { fedorTTS } from '../../../services/tts.service';

const CHAPTERS = [
  {
    id: 1,
    emoji: '🌙',
    title: 'El despegue de la Luna',
    threshold: 0,
    text: 'Fedor, el pequeño astronauta, deja la Luna y comienza su gran viaje. Lleva su bandera y mucha valentía. ¡Mercurio lo espera!',
  },
  {
    id: 2,
    emoji: '🌟',
    title: 'La primera victoria',
    threshold: 0.20,
    text: 'Has resuelto bloques de matemáticas y la nave avanza. Los planetas brillan más fuerte cada vez que aciertas. ¡Sigue así!',
  },
  {
    id: 3,
    emoji: '🚀',
    title: 'En medio del cosmos',
    threshold: 0.50,
    text: 'Vas por la mitad del viaje. Los cometas te acompañan y las estrellas cantan tu nombre. Negoran el dragón está orgulloso.',
  },
  {
    id: 4,
    emoji: '🏆',
    title: '¡Llegando a Plutón!',
    threshold: 0.75,
    text: 'Plutón ya se ve a lo lejos. Sólo unos bloques más y serás un Maestro Galáctico. ¡Tú puedes lograrlo!',
  },
];

export default function LoreModal({ onClose }: { onClose: () => void }) {
  const { book, progress } = useBook();

  const progressRatio = useMemo(() => {
    if (!book || !progress || !progress.scores) return 0;
    let total = 0;
    let done = 0;
    book.units.forEach((u) => {
      u.topics.forEach((t, ti) => {
        t.levels.forEach((_, li) => {
          total++;
          const key = `u${u.index}t${ti}-n${li + 1}`;
          if (progress.scores[key] && progress.scores[key].pts > 0) done++;
        });
      });
    });
    return total > 0 ? done / total : 0;
  }, [book, progress]);

  const unlockedCount = useMemo(() => {
    return CHAPTERS.filter((c) => progressRatio >= c.threshold).length;
  }, [progressRatio]);

  const handleSpeak = (text: string) => {
    fedorTTS.speak(text);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 4, 30, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.4rem',
            background: 'linear-gradient(135deg, #3D1468, #6C28B4)',
            color: '#FFD66B',
            borderRadius: '24px 24px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontFamily: "'Baloo 2', sans-serif",
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '38px' }}>📖</span>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1.2 }}>
              Historia de Fedor
            </div>
            <div style={{ fontSize: '13px', color: '#E0DBFF', fontWeight: 700 }}>
              {unlockedCount} / {CHAPTERS.length} capítulos desbloqueados
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Chapters List */}
        <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CHAPTERS.map((c) => {
            const isUnlocked = progressRatio >= c.threshold;

            return (
              <div
                key={c.id}
                style={{
                  background: isUnlocked ? 'linear-gradient(135deg, #FFFFFF, #F8F0FF)' : '#F3F2F8',
                  border: isUnlocked ? '3px solid #6C28B4' : '2px dashed #C5BFEE',
                  borderRadius: '16px',
                  padding: '1.1rem',
                  opacity: isUnlocked ? 1 : 0.6,
                  transition: 'transform 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '32px' }}>{isUnlocked ? c.emoji : '🔒'}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 900,
                        color: isUnlocked ? '#3D1054' : '#666',
                        fontFamily: "'Baloo 2', sans-serif",
                      }}
                    >
                      Capítulo {c.id}: {c.title}
                    </div>
                  </div>
                  {isUnlocked && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(c.text)}
                      style={{
                        background: 'linear-gradient(135deg,#3AA0FF,#7B2FBE)',
                        color: '#FFF',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontWeight: 900,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      🔊 Narrar
                    </button>
                  )}
                </div>

                {isUnlocked ? (
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', lineHeight: 1.55 }}>
                    {c.text}
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                    Desbloquea este capítulo completando el {Math.round(c.threshold * 100)}% de los ejercicios.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
