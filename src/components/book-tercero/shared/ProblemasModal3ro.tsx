'use client';

import React, { useState } from 'react';
import rawData from '@/mocks/data/problemas-cotidianos-3.json';
import { fedorSpeak, stopFedorSpeak } from './Grade3Speech';

interface ProblemasModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNivel: (nivelIdx: number, tab: 'ejemplos' | 'practica') => void;
}

export default function ProblemasModal3ro({
  isOpen,
  onClose,
  onStartNivel,
}: ProblemasModal3roProps) {
  const niveles = rawData.PC_NIVELES || [];
  const [selectedNivelIdx, setSelectedNivelIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'inicio' | 'detalle' | 'ejemplos' | 'ejercicios' | 'resultados'>('inicio');

  // Estado para Ejemplos
  const [exIdx, setExIdx] = useState(0);

  // Estado para Ejercicios
  const [ejIdx, setEjIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [mostrarProceso, setMostrarProceso] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(45);
  const [answers, setAnswers] = useState<{ num: number; correcto: boolean; elegido?: number; corrIdx?: number }[]>([]);

  // Web Audio Sonidos
  const playTone = (freq: number, dur: number, type: OscillatorType = 'sine') => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.35, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  };

  const soundOk = () => {
    playTone(880, 0.12, 'sine');
    setTimeout(() => playTone(1100, 0.2, 'sine'), 130);
  };
  const soundErr = () => {
    playTone(220, 0.35, 'sawtooth');
  };
  const soundClick = () => {
    playTone(660, 0.08, 'sine');
  };

  const activeNivel = selectedNivelIdx !== null ? niveles[selectedNivelIdx] : null;

  // Cleanup de Timer y Speech al cerrar
  React.useEffect(() => {
    return () => {
      stopFedorSpeak();
    };
  }, []);

  // Timer para Ejercicios
  React.useEffect(() => {
    if (viewMode !== 'ejercicios' || respondido) return;

    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTiempoAgotado();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, respondido, ejIdx]);

  const handleTiempoAgotado = () => {
    if (respondido || !activeNivel) return;
    setRespondido(true);
    soundErr();
    const e = activeNivel.ejercicios?.[ejIdx];
    if (e) {
      setAnswers((prev) => [...prev, { num: e.num, correcto: false, corrIdx: e.ans }]);
    }
  };

  const handleClose = () => {
    stopFedorSpeak();
    setViewMode('inicio');
    setSelectedNivelIdx(null);
    onClose();
  };

  const handleSelectNivel = (idx: number) => {
    soundClick();
    setSelectedNivelIdx(idx);
    setViewMode('detalle');
    const n = niveles[idx];
    if (n) {
      fedorSpeak(`${n.nombre}. ${n.desc}`);
    }
  };

  const handleBackToList = () => {
    soundClick();
    stopFedorSpeak();
    setSelectedNivelIdx(null);
    setViewMode('inicio');
  };

  const handleStartEjemplos = () => {
    soundClick();
    setViewMode('ejemplos');
    setExIdx(0);
    const n = niveles[selectedNivelIdx || 0];
    const primerEjemplo = n?.ejemplos?.[0];
    if (primerEjemplo) {
      fedorSpeak(primerEjemplo.enunciado);
    }
  };

  const handleNavEjemplo = (dir: number) => {
    soundClick();
    if (!activeNivel?.ejemplos) return;
    const nextIdx = exIdx + dir;
    if (nextIdx >= 0 && nextIdx < activeNivel.ejemplos.length) {
      setExIdx(nextIdx);
      const e = activeNivel.ejemplos[nextIdx];
      if (e) {
        fedorSpeak(e.enunciado);
      }
    }
  };

  const handleStartEjercicios = () => {
    soundClick();
    setViewMode('ejercicios');
    setEjIdx(0);
    setScore(0);
    setRespondido(false);
    setSelectedOpt(null);
    setMostrarProceso(false);
    setAnswers([]);
    const n = niveles[selectedNivelIdx || 0];
    const primerEj = n?.ejercicios?.[0];
    if (primerEj) {
      setTiempoRestante(primerEj.tiempo || 45);
      fedorSpeak(primerEj.enunciado);
    }
  };

  const handleSelectRespuesta = (optIdx: number) => {
    if (respondido || !activeNivel) return;
    setRespondido(true);
    setSelectedOpt(optIdx);
    soundClick();

    const e = activeNivel.ejercicios?.[ejIdx];
    if (!e) return;

    const correcto = optIdx === e.ans;
    if (correcto) {
      setScore((prev) => prev + (e.pts || 10));
      soundOk();
    } else {
      soundErr();
    }

    setAnswers((prev) => [
      ...prev,
      { num: e.num, correcto, elegido: optIdx, corrIdx: e.ans },
    ]);
  };

  const handleSeguirEjercicio = () => {
    soundClick();
    if (!activeNivel?.ejercicios) return;
    if (ejIdx < activeNivel.ejercicios.length - 1) {
      const nextIdx = ejIdx + 1;
      setEjIdx(nextIdx);
      setRespondido(false);
      setSelectedOpt(null);
      setMostrarProceso(false);
      const nextEj = activeNivel.ejercicios[nextIdx];
      if (nextEj) {
        setTiempoRestante(nextEj.tiempo || 45);
        fedorSpeak(nextEj.enunciado);
      }
    } else {
      // Fin del cuestionario -> Resultados
      setViewMode('resultados');
      playTone(880, 0.15, 'sine');
      setTimeout(() => playTone(1100, 0.15, 'sine'), 180);
      setTimeout(() => playTone(1320, 0.3, 'sine'), 360);
    }
  };

  const renderNivelIcon = (idx: number, size: number = 28) => {
    if (idx === 0) {
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ filter: 'drop-shadow(0 1.5px 1px rgba(0,0,0,0.18))' }}>
          <defs>
            <linearGradient id={`pcPlusGrad_${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9677E3" />
              <stop offset="100%" stopColor="#6743B8" />
            </linearGradient>
          </defs>
          <path d="M14 4.5V23.5M4.5 14H23.5" stroke={`url(#pcPlusGrad_${size})`} strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (idx === 1) {
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ filter: 'drop-shadow(0 1.5px 1px rgba(0,0,0,0.18))' }}>
          <defs>
            <linearGradient id={`pcMinusGrad_${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9677E3" />
              <stop offset="100%" stopColor="#6743B8" />
            </linearGradient>
          </defs>
          <path d="M4.5 14H23.5" stroke={`url(#pcMinusGrad_${size})`} strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (idx === 2) {
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ filter: 'drop-shadow(0 1.5px 1px rgba(0,0,0,0.18))' }}>
          <defs>
            <linearGradient id={`pcMulGrad_${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9677E3" />
              <stop offset="100%" stopColor="#6743B8" />
            </linearGradient>
          </defs>
          <path d="M6 6L22 22M22 6L6 22" stroke={`url(#pcMulGrad_${size})`} strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (idx === 3) {
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ filter: 'drop-shadow(0 1.5px 1px rgba(0,0,0,0.18))' }}>
          <defs>
            <linearGradient id={`pcDivGrad_${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9677E3" />
              <stop offset="100%" stopColor="#6743B8" />
            </linearGradient>
          </defs>
          <path d="M4.5 14H23.5" stroke={`url(#pcDivGrad_${size})`} strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="14" cy="6" r="3.2" fill={`url(#pcDivGrad_${size})`} />
          <circle cx="14" cy="22" r="3.2" fill={`url(#pcDivGrad_${size})`} />
        </svg>
      );
    }
    if (idx === 4) {
      const boxSize = size;
      const fs = Math.max(9, Math.round(size * 0.34));
      return (
        <div
          style={{
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            borderRadius: `${Math.round(boxSize * 0.25)}px`,
            background: 'linear-gradient(135deg, #3AA0FF, #2380E6)',
            color: '#FFFFFF',
            fontWeight: 900,
            fontSize: `${fs}px`,
            lineHeight: '1.05',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '1.5px',
            paddingLeft: '1.5px',
            boxShadow: '0 2px 5px rgba(35,128,230,0.3)',
          }}
        >
          <div>1 2</div>
          <div>3 4</div>
        </div>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 5, 30, 0.88)',
        zIndex: 10050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
        backdropFilter: 'blur(10px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '22px',
          padding: '1.5rem 1.25rem',
          maxWidth: '660px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 28px 72px rgba(44, 16, 112, 0.55)',
          position: 'relative',
          fontFamily: "'Nunito', sans-serif",
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar ✕ */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar ventana"
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            background: '#F0F0F0',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'background 0.2s',
            zIndex: 10,
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#E5E5E5')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#F0F0F0')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 2L10 10M10 2L2 10" />
          </svg>
        </button>

        {/* ══════════════════════════════════════════════════════════
           VISTA 1: LISTADO DE 5 NIVELES (Idéntico a Imagen 1)
        ══════════════════════════════════════════════════════════ */}
        {viewMode === 'inicio' && (
          <div>
            {/* Header Centrado */}
            <div style={{ textAlign: 'center', marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
                <img
                  src="/img/pc_abacus.png"
                  alt="Ábaco"
                  width="32"
                  height="32"
                  style={{ display: 'block', objectFit: 'contain' }}
                />
              </div>
              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 900,
                  color: '#2A1070',
                  letterSpacing: '0.01em',
                }}
              >
                Problemas Cotidianos
              </div>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#6B48A0',
                  marginBottom: '0.5rem',
                  marginTop: '3px',
                }}
              >
                📋 Tipo Prueba SABER · Grado 3°
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#555555',
                  lineHeight: 1.55,
                  maxWidth: '500px',
                  margin: '0 auto',
                }}
              >
                Situaciones reales de compras, tienda, alimentos, almacén y repartición con dinero.
                <br />
                Selecciona un nivel para comenzar.
              </div>
            </div>

            {/* Listado de 5 Tarjetas */}
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {niveles.map((n, i) => (
                <div
                  key={n.id || i}
                  onClick={() => handleSelectNivel(i)}
                  style={{
                    background: n.bgColor,
                    border: `2px solid ${n.color}`,
                    borderRadius: '16px',
                    padding: '0.9rem 1.15rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    transition: 'all 0.18s ease',
                    boxSizing: 'border-box',
                    minHeight: '73px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = '')}
                >
                  {/* Icono del Nivel */}
                  <div
                    style={{
                      minWidth: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {renderNivelIcon(i, 28)}
                  </div>

                  {/* Nombre y Descripción */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 900,
                        color: n.textColor,
                        lineHeight: 1.25,
                      }}
                    >
                      {n.nombre}
                    </div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: n.textColor,
                        opacity: 0.78,
                        marginTop: '3px',
                        lineHeight: 1.35,
                      }}
                    >
                      {n.desc}
                    </div>
                  </div>

                  {/* Badge "10 ej · 20 prob" */}
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: n.textColor,
                      background: 'rgba(255, 255, 255, 0.65)',
                      borderRadius: '8px',
                      padding: '4px 9px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    10 ej · 20 prob
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
           VISTA 2: DETALLE DEL NIVEL SELECCIONADO
        ══════════════════════════════════════════════════════════ */}
        {viewMode === 'detalle' && activeNivel && (
          <div style={{ marginBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={handleBackToList}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B48A0',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: "'Nunito', sans-serif",
                padding: '4px 0',
              }}
            >
              ← Volver
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                {renderNivelIcon(selectedNivelIdx || 0, 42)}
              </div>
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 900,
                  color: activeNivel.textColor,
                }}
              >
                {activeNivel.nombre}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#555555',
                  margin: '0.3rem 0 1rem',
                }}
              >
                {activeNivel.desc}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    background: activeNivel.bgColor,
                    border: `1.5px solid ${activeNivel.color}`,
                    borderRadius: '10px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: activeNivel.textColor,
                  }}
                >
                  📚 {activeNivel.ejemplos?.length || 10} Ejemplos
                </div>
                <div
                  style={{
                    background: activeNivel.bgColor,
                    border: `1.5px solid ${activeNivel.color}`,
                    borderRadius: '10px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: activeNivel.textColor,
                  }}
                >
                  📝 {activeNivel.ejercicios?.length || 20} Problemas
                </div>
                <div
                  style={{
                    background: activeNivel.bgColor,
                    border: `1.5px solid ${activeNivel.color}`,
                    borderRadius: '10px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: activeNivel.textColor,
                  }}
                >
                  🏆{' '}
                  {(activeNivel.ejercicios || []).reduce(
                    (acc: number, e: { pts?: number }) => acc + (e.pts || 10),
                    0
                  )}{' '}
                  pts
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartEjemplos}
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '15px',
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${activeNivel.color}, ${activeNivel.color}cc)`,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  marginBottom: '0.6rem',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = '')}
              >
                📚 Ver Ejemplos Primero
              </button>

              <button
                type="button"
                onClick={handleStartEjercicios}
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '15px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #2A1070, #4A2090)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'all 0.18s ease',
                  boxShadow: '0 4px 14px rgba(42,16,112,0.25)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = '')}
              >
                📝 Ir Directo a Problemas
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
           VISTA 3: EJEMPLOS (Idéntico a Imagen del usuario)
        ══════════════════════════════════════════════════════════ */}
        {viewMode === 'ejemplos' && activeNivel && (
          <div>
            {/* Barra superior: ← Nivel  |  Ejemplo X / Total */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                paddingRight: '36px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  soundClick();
                  stopFedorSpeak();
                  setViewMode('detalle');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B48A0',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: "'Nunito', sans-serif",
                  padding: '4px 0',
                }}
              >
                ← Nivel
              </button>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#888888',
                }}
              >
                Ejemplo {exIdx + 1} / {activeNivel.ejemplos?.length || 10}
              </div>
            </div>

            {(() => {
              const e = activeNivel.ejemplos?.[exIdx];
              if (!e) return null;
              const total = activeNivel.ejemplos?.length || 10;

              return (
                <div>
                  {/* Tarjeta principal del ejemplo */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${activeNivel.bgColor}, #FFFFFF)`,
                      border: `2px solid ${activeNivel.color}`,
                      borderRadius: '16px',
                      padding: '1.1rem 1rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {/* Título en mayúsculas con icono */}
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: activeNivel.textColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{renderNivelIcon(selectedNivelIdx || 0, 16)}</span>
                      <span>{e.titulo}</span>
                    </div>

                    {/* Enunciado */}
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#222222',
                        lineHeight: 1.6,
                        marginBottom: '0.75rem',
                      }}
                    >
                      {e.enunciado}
                    </div>

                    {/* Caja de Operación punteada */}
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: `2px dashed ${activeNivel.color}`,
                        borderRadius: '12px',
                        padding: '0.7rem 1rem',
                        marginBottom: '0.6rem',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#888888',
                          marginBottom: '4px',
                        }}
                      >
                        Operación
                      </div>
                      <div
                        style={{
                          fontSize: '22px',
                          fontWeight: 900,
                          color: activeNivel.textColor,
                        }}
                      >
                        {e.operacion}
                      </div>
                    </div>

                    {/* Caja Paso a paso */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '10px',
                        padding: '0.65rem 0.9rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: '#555555',
                          marginBottom: '4px',
                        }}
                      >
                        📋 Paso a paso:
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#333333',
                          whiteSpace: 'pre-line',
                          lineHeight: 1.7,
                        }}
                      >
                        {e.proceso}
                      </div>
                    </div>
                  </div>

                  {/* Botones de navegación inferiores */}
                  {exIdx === 0 ? (
                    <button
                      type="button"
                      onClick={() => handleNavEjemplo(1)}
                      style={{
                        width: '100%',
                        padding: '13px',
                        fontSize: '15px',
                        fontWeight: 900,
                        background: `linear-gradient(135deg, ${activeNivel.color}, ${activeNivel.color}cc)`,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                        transition: 'all 0.18s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = '')}
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleNavEjemplo(-1)}
                        style={{
                          flex: 1,
                          padding: '11px',
                          fontSize: '14px',
                          fontWeight: 900,
                          background: '#F0EDF8',
                          color: '#6B48A0',
                          border: '1.5px solid #C5BFEE',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontFamily: "'Nunito', sans-serif",
                        }}
                      >
                        ← Anterior
                      </button>

                      {exIdx < total - 1 ? (
                        <button
                          type="button"
                          onClick={() => handleNavEjemplo(1)}
                          style={{
                            flex: 1,
                            padding: '11px',
                            fontSize: '14px',
                            fontWeight: 900,
                            background: `linear-gradient(135deg, ${activeNivel.color}, ${activeNivel.color}cc)`,
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontFamily: "'Nunito', sans-serif",
                            transition: 'all 0.18s ease',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                          onMouseOut={(e) => (e.currentTarget.style.transform = '')}
                        >
                          Siguiente →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleStartEjercicios}
                          style={{
                            flex: 1,
                            padding: '11px',
                            fontSize: '14px',
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #2A1070, #4A2090)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontFamily: "'Nunito', sans-serif",
                            transition: 'all 0.18s ease',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                          onMouseOut={(e) => (e.currentTarget.style.transform = '')}
                        >
                          ¡Empezar Problemas! 🚀
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
           VISTA 4: EJERCICIOS (Práctica interactiva Saber)
        ══════════════════════════════════════════════════════════ */}
        {viewMode === 'ejercicios' && activeNivel && (
          <div>
            {(() => {
              const e = activeNivel.ejercicios?.[ejIdx];
              if (!e) return null;
              const total = activeNivel.ejercicios?.length || 20;

              const dif =
                ejIdx < 5 ? 'Muy Fácil' : ejIdx < 10 ? 'Fácil' : ejIdx < 15 ? 'Medio' : 'Difícil';
              const difColor =
                ejIdx < 5 ? '#16876A' : ejIdx < 10 ? '#2A9D8F' : ejIdx < 15 ? '#FF8C2A' : '#A30041';

              const timerColor =
                tiempoRestante > 20 ? '#16876A' : tiempoRestante > 10 ? '#FF8C2A' : '#A30041';

              return (
                <div>
                  {/* Barra de progreso y temporizador */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.6rem',
                      paddingRight: '36px',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#888888' }}>
                      Problema {ejIdx + 1} / {total}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 900,
                        color: timerColor,
                        background: '#DCF5EE',
                        borderRadius: '8px',
                        padding: '4px 10px',
                      }}
                    >
                      ⏱ {tiempoRestante}s
                    </div>
                  </div>

                  {/* Medidores de dificultad y puntaje */}
                  <div
                    style={{
                      background: '#F8F5FF',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      marginBottom: '0.6rem',
                      display: 'flex',
                      gap: '0.4rem',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: difColor,
                        background: activeNivel.bgColor,
                        borderRadius: '6px',
                        padding: '3px 8px',
                      }}
                    >
                      {dif}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#2A1070' }}>
                      🏆 Puntaje: <span>{score}</span> pts
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#FF8C2A' }}>
                      +{e.pts || 10} pts posibles
                    </div>
                  </div>

                  {/* Enunciado */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #F8F5FF, #EEEDFE)',
                      border: '2px solid #C5BFEE',
                      borderRadius: '16px',
                      padding: '1rem',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#222222',
                        lineHeight: 1.65,
                      }}
                    >
                      {e.enunciado}
                    </div>
                  </div>

                  {/* Opciones A, B, C, D */}
                  <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {['A', 'B', 'C', 'D'].map((letra, idx) => {
                      const isCorrect = idx === e.ans;
                      const isChosen = idx === selectedOpt;

                      let btnBg = '#FFFFFF';
                      let btnBorder = '#C5BFEE';
                      let btnColor = '#222222';

                      if (respondido) {
                        if (isCorrect) {
                          btnBg = '#DCF5EE';
                          btnBorder = '#16876A';
                          btnColor = '#074F3A';
                        } else if (isChosen && !isCorrect) {
                          btnBg = '#FFE8E8';
                          btnBorder = '#A30041';
                          btnColor = '#A30041';
                        }
                      }

                      return (
                        <button
                          key={letra}
                          type="button"
                          disabled={respondido}
                          onClick={() => handleSelectRespuesta(idx)}
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            fontSize: '14px',
                            fontWeight: 800,
                            background: btnBg,
                            border: `2px solid ${btnBorder}`,
                            borderRadius: '12px',
                            cursor: respondido ? 'default' : 'pointer',
                            textAlign: 'left',
                            fontFamily: "'Nunito', sans-serif",
                            transition: 'all 0.18s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            color: btnColor,
                          }}
                        >
                          <span
                            style={{
                              background: '#EEEDFE',
                              color: '#2A1070',
                              borderRadius: '8px',
                              width: '26px',
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            {letra}
                          </span>
                          <span>{e.opts?.[idx]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Retroalimentación inmediata */}
                  {respondido && (
                    <div style={{ marginTop: '0.75rem' }}>
                      {(() => {
                        const isCorrect = selectedOpt === e.ans;
                        const icon = isCorrect ? '🎉' : '❌';
                        const msg = isCorrect
                          ? '¡Correcto! ¡Excelente trabajo!'
                          : 'Respuesta incorrecta. ¡Inténtalo de nuevo!';
                        const color = isCorrect ? '#DCF5EE' : '#FFE8E8';
                        const border = isCorrect ? '#16876A' : '#A30041';
                        const textColor = isCorrect ? '#074F3A' : '#A30041';

                        return (
                          <div>
                            <div
                              style={{
                                background: color,
                                border: `2px solid ${border}`,
                                borderRadius: '14px',
                                padding: '0.85rem 1rem',
                                marginBottom: '0.6rem',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '15px',
                                  fontWeight: 900,
                                  color: textColor,
                                  marginBottom: '0.3rem',
                                }}
                              >
                                {icon} {msg}
                              </div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#333333' }}>
                                ✏️ {e.explicacion}
                              </div>
                            </div>

                            {mostrarProceso && (
                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #EEEDFE, #F8F5FF)',
                                  border: '2px solid #C5BFEE',
                                  borderRadius: '14px',
                                  padding: '0.85rem 1rem',
                                  marginBottom: '0.6rem',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 900,
                                    color: '#2A1070',
                                    marginBottom: '0.5rem',
                                  }}
                                >
                                  📋 Paso a Paso:
                                </div>
                                <div
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: '#333333',
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.7,
                                  }}
                                >
                                  {e.proceso}
                                </div>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {!mostrarProceso && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMostrarProceso(true);
                                    fedorSpeak(e.proceso.replace(/\n/g, ' '));
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '11px',
                                    fontSize: '13px',
                                    fontWeight: 900,
                                    background: '#F0EDF8',
                                    color: '#6B48A0',
                                    border: '1.5px solid #C5BFEE',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontFamily: "'Nunito', sans-serif",
                                  }}
                                >
                                  📋 Proceso
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={handleSeguirEjercicio}
                                style={{
                                  flex: 1,
                                  padding: '11px',
                                  fontSize: '13px',
                                  fontWeight: 900,
                                  background: 'linear-gradient(135deg, #2A1070, #4A2090)',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  fontFamily: "'Nunito', sans-serif",
                                }}
                              >
                                Seguir ▶
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
           VISTA 5: RESULTADOS
        ══════════════════════════════════════════════════════════ */}
        {viewMode === 'resultados' && activeNivel && (
          <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
            {(() => {
              const total = activeNivel.ejercicios?.length || 20;
              const correctos = answers.filter((a) => a.correcto).length;
              const pct = Math.round((correctos / total) * 100);

              const estrella = pct >= 90 ? '⭐⭐⭐' : pct >= 70 ? '⭐⭐' : pct >= 50 ? '⭐' : '';
              const msg =
                pct >= 90
                  ? '¡Felicitaciones! ¡Eres un campeón! 🏆'
                  : pct >= 70
                  ? '¡Muy bien! ¡Casi perfecto! 💪'
                  : pct >= 50
                  ? '¡Bien hecho! Sigue practicando 📚'
                  : '¡Sigue intentando! Tú puedes 💡';

              return (
                <div>
                  <div style={{ fontSize: '44px', marginBottom: '0.4rem' }}>{estrella}</div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 900,
                      color: '#2A1070',
                      marginBottom: '0.3rem',
                    }}
                  >
                    Resultados
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#555555',
                      marginBottom: '1rem',
                    }}
                  >
                    {activeNivel.nombre}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ background: '#DCF5EE', borderRadius: '12px', padding: '0.7rem 0.5rem' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#074F3A' }}>
                        {correctos}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#074F3A' }}>
                        CORRECTAS
                      </div>
                    </div>
                    <div style={{ background: '#FFF0F5', borderRadius: '12px', padding: '0.7rem 0.5rem' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#A30041' }}>
                        {total - correctos}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#A30041' }}>
                        INCORRECTAS
                      </div>
                    </div>
                    <div style={{ background: '#EEEDFE', borderRadius: '12px', padding: '0.7rem 0.5rem' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#2A1070' }}>
                        {score}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#2A1070' }}>
                        PUNTOS
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: `linear-gradient(135deg, ${activeNivel.bgColor}, #FFFFFF)`,
                      border: `2px solid ${activeNivel.color}`,
                      borderRadius: '14px',
                      padding: '0.85rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ fontSize: '28px', fontWeight: 900, color: activeNivel.textColor }}>
                      {pct}%
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#555555', marginTop: '0.2rem' }}>
                      {msg}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <button
                      type="button"
                      onClick={handleStartEjercicios}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #16876A, #24C496)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      🔄 Intentar de Nuevo
                    </button>
                    <button
                      type="button"
                      onClick={handleStartEjemplos}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      📚 Repasar Ejemplos
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToList}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 900,
                        background: '#F0EDF8',
                        color: '#6B48A0',
                        border: '1.5px solid #C5BFEE',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      🏠 Elegir Otro Nivel
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
