'use client';

import React, { useState, useEffect } from 'react';
import { useBook4 } from '../context/Book4Context';

export interface EspacialQuestion {
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
}

const ESPACIAL_POOL: EspacialQuestion[] = [
  {
    ctx: 'Sora organiza una campaña de reciclaje. En el tema "Multiplicación y División" resuelve:',
    q: '1/8 ÷ 2/12 = ?',
    opts: ['3/4', '1/48', '4/4', '3/5'],
    ans: '3/4',
  },
  {
    ctx: 'Fedor supervisa el nivel de combustible de los propulsores iónicos:',
    q: '3/4 + 1/2 = ?',
    opts: ['5/4', '4/6', '2/4', '3/8'],
    ans: '5/4',
  },
  {
    ctx: 'En el laboratorio orbital se calcula el área de un panel solar rectangular:',
    q: 'Un rectángulo de base 12 m y altura 8 m tiene un área de:',
    opts: ['96 m²', '20 m²', '48 m²', '80 m²'],
    ans: '96 m²',
  },
  {
    ctx: 'La nave explora el trayecto orbital entre Marte y Júpiter:',
    q: 'Si viaja a 450 km cada hora, ¿cuántos km recorre en 4 horas?',
    opts: ['1.800 km', '1.600 km', '1.200 km', '2.000 km'],
    ans: '1.800 km',
  },
  {
    ctx: 'En la estación espacial reparten 1.200 raciones en 6 módulos por igual:',
    q: '¿Cuántas raciones recibe cada módulo?',
    opts: ['200', '150', '300', '250'],
    ans: '200',
  },
  {
    ctx: 'El radar detecta un satélite a las 14:15 y otro a las 15:45:',
    q: '¿Cuánto tiempo transcurrió entre ambos avistamientos?',
    opts: ['1 hora y 30 minutos', '1 hora y 15 minutos', '2 horas', '45 minutos'],
    ans: '1 hora y 30 minutos',
  },
];

interface RetoEspacialModal4toProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function RetoEspacialModal4to({
  isOpen = true,
  onClose,
}: RetoEspacialModal4toProps) {
  const { updateStats } = useBook4();

  // 'intro' (Imagen 1) -> 'mission' (Imagen 2) -> 'result'
  const [step, setStep] = useState<'intro' | 'mission' | 'result'>('intro');

  const [espacialState, setEspacialState] = useState({
    done: 0,
    streak: 0,
    total: 0,
    lastDay: '',
  });

  const [questions, setQuestions] = useState<EspacialQuestion[]>([]);
  const [curQIdx, setCurQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const hoyHecho = espacialState.lastDay === todayStr;

  // Cargar estado de Reto Espacial desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor4_espacial');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) setEspacialState(parsed);
      }
    } catch {}
  }, []);

  // Preparar 3 preguntas aleatorias (asegurando la de reciclaje para coherencia visual)
  const startMission = () => {
    const shuffled = [...ESPACIAL_POOL];
    // Asegurar que la primera sea la de reciclaje de la Imagen 2
    const firstQ = shuffled[0];
    const rest = shuffled.slice(1).sort(() => Math.random() - 0.5).slice(0, 2);
    setQuestions([firstQ, ...rest]);
    setCurQIdx(0);
    setCorrectCount(0);
    setSelectedOpt(null);
    setIsAnswering(false);
    // Cambiar de pantalla: oculta la Imagen 1 y muestra la Imagen 2
    setStep('mission');
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswering || selectedOpt !== null) return;
    setIsAnswering(true);
    setSelectedOpt(opt);

    const curQ = questions[curQIdx];
    const isCorrect = String(opt).trim() === String(curQ.ans).trim();
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) {
      setCorrectCount(newCorrect);
    }

    setTimeout(() => {
      if (curQIdx + 1 < questions.length) {
        setCurQIdx(curQIdx + 1);
        setSelectedOpt(null);
        setIsAnswering(false);
      } else {
        // Fin de la misión
        const approved = newCorrect >= 2;
        if (approved) {
          const yest = new Date();
          yest.setDate(yest.getDate() - 1);
          const ystr = yest.toISOString().slice(0, 10);
          const newStreak = espacialState.lastDay === ystr ? (espacialState.streak || 0) + 1 : 1;

          const updated = {
            done: espacialState.done + 1,
            total: (espacialState.total || 0) + 1,
            streak: newStreak,
            lastDay: todayStr,
          };
          setEspacialState(updated);
          try {
            localStorage.setItem('fedor4_espacial', JSON.stringify(updated));
          } catch {}

          // Premiar +50 monedas y +30 XP
          updateStats(50, 0, 30);
        }
        setStep('result');
      }
    }, 850);
  };

  if (!isOpen) return null;

  // Cálculo de Rango Espacial
  const ranks = [
    '🪐 Cadete Estelar',
    '🚀 Piloto Cósmico',
    '🛸 Comandante Lunar',
    '⭐ Almirante Galáctico',
    '🌌 Maestro del Universo',
  ];
  const rankIdx = Math.min(ranks.length - 1, Math.floor((espacialState.done || 0) / 10));
  const currentRank = ranks[rankIdx];

  const curQ = questions[curQIdx] || questions[0];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(8, 4, 30, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Nunito', sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            PASO 1: INTRO DEL RETO ESPACIAL (IDÉNTICO A IMAGEN 1)
           ══════════════════════════════════════════════════════════════ */}
        {step === 'intro' && (
          <>
            {/* Cabecera Morada Real */}
            <div
              style={{
                background: 'linear-gradient(135deg, #2A1070, #6C28B4)',
                borderTopLeftRadius: '26px',
                borderTopRightRadius: '26px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>🚀</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    letterSpacing: '0.02em',
                  }}
                >
                  Reto Espacial
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo con Márgenes y Elementos Amplios */}
            <div
              style={{
                padding: '20px 24px 24px 24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {/* 1. Tarjeta Galaxia Oscura (.v3-galaxy) */}
              <div
                style={{
                  background: 'radial-gradient(ellipse at center, #1A0A3C 0%, #0A0420 80%)',
                  borderRadius: '16px',
                  border: '1.5px solid #6C28B4',
                  padding: '16px 16px',
                  marginBottom: '14px',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    color: '#FFD66B',
                    fontSize: '15px',
                    fontWeight: 900,
                    marginBottom: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{currentRank}</span>
                </div>
                <div
                  style={{
                    color: '#C5BFEE',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  Misiones espaciales completadas: <b style={{ color: '#FFFFFF' }}>{espacialState.done}</b> · Racha: <b style={{ color: '#FFFFFF' }}>{espacialState.streak}</b> 🔥
                </div>
              </div>

              {/* 2. Reto diario de hoy (.v3-stat) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  marginBottom: '10px',
                  backgroundColor: '#F8F5FF',
                  border: '1.5px solid #EAE5FC',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    color: '#1E1B4B',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  Reto diario de hoy
                </span>
                <span
                  style={{
                    color: hoyHecho ? '#10B981' : '#9B5CFF',
                    fontWeight: 900,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{hoyHecho ? '✓' : '⏳'}</span>
                  <span>{hoyHecho ? 'Completado' : 'Disponible'}</span>
                </span>
              </div>

              {/* 3. Recompensa (.v3-stat) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  marginBottom: '18px',
                  backgroundColor: '#F8F5FF',
                  border: '1.5px solid #EAE5FC',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    color: '#1E1B4B',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  Recompensa
                </span>
                <span
                  style={{
                    color: '#7C28BE',
                    fontWeight: 900,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>+50</span>
                  <span style={{ fontSize: '12px' }}>🪙</span>
                  <span>+ 30 XP</span>
                </span>
              </div>

              {/* 4. Botón Iniciar misión (.v3-btn-go) */}
              <button
                type="button"
                onClick={startMission}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6C28B4, #FF1D4E)',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 29, 78, 0.35)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 29, 78, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 29, 78, 0.35)';
                }}
              >
                <span style={{ fontSize: '16px' }}>🚀</span>
                <span>{hoyHecho ? 'Repetir misión' : 'Iniciar misión'}</span>
              </button>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PASO 2: QUIZ DE LA MISIÓN (IDÉNTICO A IMAGEN 2)
           ══════════════════════════════════════════════════════════════ */}
        {step === 'mission' && curQ && (
          <>
            {/* Cabecera Morada Real con número de Misión */}
            <div
              style={{
                background: 'linear-gradient(135deg, #2A1070, #6C28B4)',
                borderTopLeftRadius: '26px',
                borderTopRightRadius: '26px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>🚀</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    letterSpacing: '0.02em',
                  }}
                >
                  Misión {curQIdx + 1}/3
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo con Cuadro Naranja y Opciones */}
            <div
              style={{
                padding: '22px 24px 24px 24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {/* Cuadro de Pregunta (.v3-saber-q) con Borde Naranja */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #FF8A1F',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                {/* Contexto descriptivo */}
                <div
                  style={{
                    fontStyle: 'italic',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#4B5563',
                    marginBottom: '10px',
                    lineHeight: 1.45,
                  }}
                >
                  {curQ.ctx}
                </div>

                {/* Pregunta matemática principal */}
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#111827',
                    lineHeight: 1.35,
                  }}
                >
                  {curQ.q}
                </div>
              </div>

              {/* Grilla 2x2 de Opciones (.v3-opts) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {curQ.opts.map((opt, i) => {
                  const isSelected = selectedOpt === opt;
                  const isCorrect = String(opt).trim() === String(curQ.ans).trim();

                  let btnBg = '#FFFFFF';
                  let btnBorder = '2px solid #C5BFEE';
                  let btnColor = '#1E1B4B';

                  if (selectedOpt !== null) {
                    if (isSelected && isCorrect) {
                      btnBg = '#DCF5EE';
                      btnBorder = '2px solid #16876A';
                      btnColor = '#074F3A';
                    } else if (isSelected && !isCorrect) {
                      btnBg = '#FBE4E9';
                      btnBorder = '2px solid #A30041';
                      btnColor = '#7A1B00';
                    } else if (isCorrect) {
                      btnBg = '#DCF5EE';
                      btnBorder = '2px solid #16876A';
                      btnColor = '#074F3A';
                    }
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isAnswering}
                      onClick={() => handleSelectOption(opt)}
                      style={{
                        height: '50px',
                        borderRadius: '14px',
                        border: btnBorder,
                        backgroundColor: btnBg,
                        color: btnColor,
                        fontSize: '16px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isAnswering ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                        boxSizing: 'border-box',
                        padding: '0 12px',
                      }}
                      onMouseEnter={(e) => {
                        if (!isAnswering && selectedOpt === null) {
                          e.currentTarget.style.backgroundColor = '#F0EDFF';
                          e.currentTarget.style.borderColor = '#9B5CFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isAnswering && selectedOpt === null) {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#C5BFEE';
                        }
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PASO 3: RESULTADO FINAL DE LA MISIÓN
           ══════════════════════════════════════════════════════════════ */}
        {step === 'result' && (
          <>
            <div
              style={{
                background:
                  correctCount >= 2
                    ? 'linear-gradient(135deg, #16876A, #24C496)'
                    : 'linear-gradient(135deg, #A30041, #FF1D4E)',
                borderTopLeftRadius: '26px',
                borderTopRightRadius: '26px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>
                  {correctCount >= 2 ? '🎉' : '❌'}
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    letterSpacing: '0.02em',
                  }}
                >
                  {correctCount >= 2 ? 'Misión cumplida' : 'Misión fallida'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '24px 24px 28px 24px',
                textAlign: 'center',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  color: correctCount >= 2 ? '#16876A' : '#A30041',
                  marginBottom: '8px',
                }}
              >
                {correctCount}/3
              </div>

              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#1E1B4B',
                  marginBottom: '12px',
                }}
              >
                Acertaste <b>{correctCount}/3</b> problemas.
              </p>

              {correctCount >= 2 ? (
                <div
                  style={{
                    backgroundColor: '#DCF5EE',
                    border: '1.5px solid #16876A',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    color: '#074F3A',
                    fontWeight: 900,
                    fontSize: '13px',
                    marginBottom: '20px',
                  }}
                >
                  ¡Has ganado <b>+50 🪙</b> y <b>+30 XP</b>! Avanzas en tu rango espacial.
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#FBE4E9',
                    border: '1.5px solid #A30041',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    color: '#7A1B00',
                    fontWeight: 800,
                    fontSize: '13px',
                    marginBottom: '20px',
                  }}
                >
                  Necesitas al menos 2 aciertos para completar la misión. ¡Inténtalo de nuevo, Cadete!
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(108, 40, 180, 0.3)',
                }}
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
