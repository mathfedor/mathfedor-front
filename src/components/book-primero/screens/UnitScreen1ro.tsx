'use client';

import React, { useState, useEffect } from 'react';
import { useBook1 } from '../context/Book1Context';
import UnitWelcomeModal1ro, { UnitOperationIcon3D1ro } from '../shared/UnitWelcomeModal1ro';
import { fedorTTS } from '@/services/tts.service';

const HERO_STARS = [
  { top: '15%', left: '12%', size: 2, opacity: 0.6 },
  { top: '24%', left: '26%', size: 3, opacity: 0.8 },
  { top: '65%', left: '16%', size: 2, opacity: 0.5 },
  { top: '38%', left: '46%', size: 2.5, opacity: 0.7 },
  { top: '18%', left: '72%', size: 3, opacity: 0.85 },
  { top: '75%', left: '60%', size: 2, opacity: 0.6 },
  { top: '30%', left: '85%', size: 2, opacity: 0.5 },
  { top: '80%', left: '82%', size: 2.5, opacity: 0.7 },
  { top: '52%', left: '92%', size: 1.5, opacity: 0.6 },
  { top: '8%', left: '55%', size: 2, opacity: 0.75 },
  { top: '62%', left: '38%', size: 2, opacity: 0.5 },
  { top: '85%', left: '30%', size: 1.5, opacity: 0.6 },
];

const BLOCK_COLORS = ['#16876A', '#B45309', '#DC2626', '#7B2FBE', '#F59E0B'];

const LEVEL_ORB_CONFIG = [
  { bg: '#E6F7F0', border: '1.5px solid rgba(16, 185, 129, 0.2)' },
  { bg: '#FEF6E8', border: '1.5px solid rgba(245, 158, 11, 0.2)' },
  { bg: '#FEE8E8', border: '1.5px solid rgba(239, 68, 68, 0.2)' },
  { bg: '#F3E8FA', border: '1.5px solid rgba(147, 51, 234, 0.2)' },
  { bg: '#FEF8E0', border: '1.5px solid rgba(234, 179, 8, 0.2)' },
];

/**
 * Esferas 3D con luz especular que replican con fidelidad la captura del usuario
 */
function LevelOrb3D({ index }: { index: number }) {
  // Nivel 1: Esfera verde 3D
  if (index === 0) {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.35)]">
        <defs>
          <radialGradient id="orb_green" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="30%" stopColor="#34D399" />
            <stop offset="70%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#065F46" />
          </radialGradient>
        </defs>
        <circle cx="17" cy="17" r="14" fill="url(#orb_green)" />
        <ellipse cx="13" cy="11" rx="4" ry="2.2" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-25 13 11)" />
      </svg>
    );
  }

  // Nivel 2: Esfera ámbar / dorada 3D
  if (index === 1) {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" className="drop-shadow-[0_4px_8px_rgba(245,158,11,0.35)]">
        <defs>
          <radialGradient id="orb_amber" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
        </defs>
        <circle cx="17" cy="17" r="14" fill="url(#orb_amber)" />
        <ellipse cx="13" cy="11" rx="4" ry="2.2" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-25 13 11)" />
      </svg>
    );
  }

  // Nivel 3: Esfera roja / coral 3D
  if (index === 2) {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" className="drop-shadow-[0_4px_8px_rgba(239,68,68,0.35)]">
        <defs>
          <radialGradient id="orb_red" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FECACA" />
            <stop offset="30%" stopColor="#F87171" />
            <stop offset="70%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>
        </defs>
        <circle cx="17" cy="17" r="14" fill="url(#orb_red)" />
        <ellipse cx="13" cy="11" rx="4" ry="2.2" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-25 13 11)" />
      </svg>
    );
  }

  // Nivel 4: Esfera púrpura 3D
  if (index === 3) {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" className="drop-shadow-[0_4px_8px_rgba(147,51,234,0.35)]">
        <defs>
          <radialGradient id="orb_purple" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="30%" stopColor="#C084FC" />
            <stop offset="70%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#581C87" />
          </radialGradient>
        </defs>
        <circle cx="17" cy="17" r="14" fill="url(#orb_purple)" />
        <ellipse cx="13" cy="11" rx="4" ry="2.2" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-25 13 11)" />
      </svg>
    );
  }

  // Nivel 5: Esfera dorada / trofeo
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="drop-shadow-[0_4px_8px_rgba(234,179,8,0.35)]">
      <defs>
        <radialGradient id="orb_gold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="30%" stopColor="#FACC15" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#854D0E" />
        </radialGradient>
      </defs>
      <circle cx="17" cy="17" r="14" fill="url(#orb_gold)" />
      <ellipse cx="13" cy="11" rx="4" ry="2.2" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-25 13 11)" />
    </svg>
  );
}

/**
 * Botón circular cyan con icono de altavoz para lectura TTS
 */
function SpeakerAudioButton({ text, size = 30 }: { text: string; size?: number }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        fedorTTS.speak(text);
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        cursor: 'pointer',
        boxShadow: '0 3px 8px rgba(6, 182, 212, 0.35)',
        transition: 'transform 0.15s ease, filter 0.15s ease',
        flexShrink: 0,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      title="Escuchar"
      aria-label="Escuchar en voz alta"
    >
      <svg
        width={size <= 28 ? 13 : 15}
        height={size <= 28 ? 13 : 15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}

export default function UnitScreen1ro() {
  const { book, currentUnit, scores, goScreen, startLevel } = useBook1();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  // Al ingresar o cambiar de unidad, mostrar el popup tutorial
  useEffect(() => {
    setShowWelcomeModal(true);
  }, [currentUnit]);

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
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
        padding: '1.25rem 1rem 3rem',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Barra superior con Volver al inicio y Tutorial de Unidad */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div
          onClick={() => goScreen('home')}
          style={{
            cursor: 'pointer',
            fontWeight: 800,
            color: '#16876A',
            fontSize: '13px',
            textAlign: 'left',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ← Volver a las unidades
        </div>

        <button
          type="button"
          onClick={() => setShowWelcomeModal(true)}
          style={{
            cursor: 'pointer',
            fontWeight: 800,
            color: '#7B2FBE',
            fontSize: '12px',
            background: '#F6F3FF',
            border: '1.5px solid rgba(123,47,190,0.25)',
            borderRadius: '20px',
            padding: '5px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <span>💡</span>
          <span>Tutorial de Unidad</span>
        </button>
      </div>

      {/* ═══ CABECERA CÓSMICA DE LA UNIDAD (Idéntica a la captura del usuario) ═══ */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #2D0B5A 0%, #4C1D95 50%, #3B0764 100%)',
          borderRadius: '26px',
          padding: '2rem 1.8rem',
          color: '#ffffff',
          boxShadow: '0 12px 35px rgba(45, 11, 90, 0.35)',
          marginBottom: '2rem',
          textAlign: 'left',
          overflow: 'hidden',
        }}
      >
        {/* Constelación de estrellas de fondo */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {HERO_STARS.map((s, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                opacity: s.opacity,
              }}
            />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Símbolo 3D de la Unidad en la esquina superior izquierda */}
          <div style={{ marginBottom: '4px' }}>
            <UnitOperationIcon3D1ro unitIndex={currentUnit} size={46} />
          </div>

          {/* Título de la Unidad */}
          <h1
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '25px',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: 0,
              color: '#FFFFFF',
            }}
          >
            {unit.name}
          </h1>

          {/* Subtítulo */}
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            {unit.short || unit.name.replace(/^Unidad \d+ — /, '')}
          </div>

          {/* Píldora de Estándar MEN Colombia */}
          <div style={{ marginTop: '6px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 800,
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                color: '#FFFFFF',
                padding: '4px 14px',
                borderRadius: '20px',
              }}
            >
              {unit.std || 'Pensamiento Numérico · MEN Colombia'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ LISTADO DE TEMAS Y NIVELES HACIA ABAJO ═══ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {unit.topics.map((topic, ti) => {
          return (
            <div key={topic.id || ti}>
              {/* Título del Tema en mayúsculas (ej: 🔢 CONTEO Y SECUENCIAS) */}
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: '#5B21B6',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '1rem',
                  paddingLeft: '4px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{topic.icon || '📌'}</span>
                <span>{topic.title}</span>
              </div>

              {/* Lista vertical de niveles hacia abajo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {topic.levels.map((lvl, li) => {
                  const levelKey = topic.id ? `${topic.id}-n${li + 1}` : `u${currentUnit}t${ti}-n${li + 1}`;
                  const score = scores[levelKey];
                  const done = typeof score === 'number' && score >= 50;

                  const orbCfg = LEVEL_ORB_CONFIG[li] || LEVEL_ORB_CONFIG[0];
                  const descText =
                    topic.desc ||
                    (topic.levelDescs && topic.levelDescs[li]) ||
                    'Practica y desarrolla tus habilidades matemáticas.';

                  return (
                    <div
                      key={levelKey}
                      onClick={() => startLevel(currentUnit, ti, li)}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        border: '1.5px solid #F0EDFA',
                        padding: '1.25rem 1.5rem',
                        boxShadow: '0 4px 18px rgba(123, 47, 190, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(123, 47, 190, 0.1)';
                        e.currentTarget.style.borderColor = '#DDD5FA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 18px rgba(123, 47, 190, 0.05)';
                        e.currentTarget.style.borderColor = '#F0EDFA';
                      }}
                    >
                      {/* Fila superior: Título del Nivel + Botón de Audio Altavoz */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3
                          style={{
                            fontFamily: "'Baloo 2', sans-serif",
                            fontSize: '18px',
                            fontWeight: 900,
                            color: '#1A0A3C',
                            margin: 0,
                            lineHeight: 1.2,
                          }}
                        >
                          {lvl.label || `Nivel ${li + 1}`}
                        </h3>
                        <SpeakerAudioButton text={lvl.label || `Nivel ${li + 1}`} size={30} />
                      </div>

                      {/* Fila principal: Esfera 3D (Izquierda), Descripción y 5 Bloques (Centro), Estado y Play (Derecha) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {/* Izquierda: Contenedor redondeado con Esfera 3D */}
                        <div
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '18px',
                            background: orbCfg.bg,
                            border: orbCfg.border,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          }}
                        >
                          {done ? (
                            <span style={{ fontSize: '28px' }}>✅</span>
                          ) : (
                            <LevelOrb3D index={li} />
                          )}
                        </div>

                        {/* Centro: Descripción con altavoz + 5 Bloques de progreso */}
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#4B5563', lineHeight: 1.3 }}>
                              {descText}
                            </span>
                            <SpeakerAudioButton text={descText} size={26} />
                          </div>

                          {/* 5 Bloques de Progreso con colores por nivel idénticos a la captura */}
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {[0, 1, 2, 3, 4].map((blockIdx) => {
                              const isFilled = blockIdx <= li;
                              const bg = isFilled ? BLOCK_COLORS[blockIdx] : '#EDEDED';
                              return (
                                <div
                                  key={blockIdx}
                                  style={{
                                    width: '46px',
                                    height: '36px',
                                    borderRadius: '12px',
                                    background: bg,
                                    transition: 'background 0.2s',
                                    boxShadow: isFilled ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Derecha: Píldora de estado (Sin resolver / Resuelto) y Botón Play Azul */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            gap: '8px',
                            flexShrink: 0,
                            minWidth: '120px',
                          }}
                        >
                          {done ? (
                            <div
                              style={{
                                textAlign: 'right',
                                background: 'linear-gradient(135deg,#FFF7E0,#FFE9C4)',
                                border: '1.5px solid #FFB066',
                                borderRadius: '14px',
                                padding: '5px 12px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 8px',
                                  display: 'inline-block',
                                  marginBottom: '2px',
                                  fontWeight: 900,
                                  background: score >= 70 ? '#16876A' : '#E8650A',
                                  color: '#fff',
                                  borderRadius: '6px',
                                }}
                              >
                                {score >= 90 ? '🌟 Excelente' : score >= 70 ? '✓ Aprobado' : '⚡ Por Mejorar'}
                              </span>
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 900,
                                  color: score >= 70 ? '#0B7A56' : '#C25400',
                                  fontFamily: "'Baloo 2', sans-serif",
                                }}
                              >
                                {score}% · resuelto ✓
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                textAlign: 'center',
                                background: '#FAF8FF',
                                border: '1.5px dashed #C5BFEE',
                                borderRadius: '14px',
                                padding: '6px 14px',
                                fontSize: '11px',
                                fontWeight: 900,
                                color: '#7B2FBE',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Sin resolver
                            </div>
                          )}

                          {/* Botón Play Azul */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startLevel(currentUnit, ti, li);
                            }}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: '#3B82F6',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#FFFFFF',
                              fontSize: '15px',
                              transition: 'transform 0.15s ease',
                            }}
                            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
                            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            title={done ? 'Repetir nivel' : 'Iniciar nivel'}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup Tutorial Introductorio de Unidad idéntico a MatematicasDeFedor_1.html */}
      <UnitWelcomeModal1ro
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        unitIndex={currentUnit}
      />
    </div>
  );
}
