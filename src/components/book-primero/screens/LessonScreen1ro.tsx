'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook1, type LessonResultsSummary1 } from '../context/Book1Context';
import ExamplesPanel1ro from '../shared/ExamplesPanel1ro';
import { bookService } from '@/services/book.service';
import { fedorTTS } from '@/services/tts.service';
import type { Exercise } from '@/types/book.types';

export default function LessonScreen1ro() {
  const {
    book,
    currentUnit,
    currentTopic,
    currentLevel,
    goScreen,
    saveLessonScore,
  } = useBook1();

  const [phase, setPhase] = useState<'examples' | 'exercises'>('examples');
  const [curEx, setCurEx] = useState(0);
  const [attempts, setAttempts] = useState<
    Array<{ q: string; user: string; correct: string; ok: boolean }>
  >([]);
  const [combo, setCombo] = useState(0);
  const [pts, setPts] = useState(0);
  const [tLeft, setTLeft] = useState(35);
  const [userVal, setUserVal] = useState('');
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [showProcModal, setShowProcModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const unit = book?.units[currentUnit];
  const topic = unit?.topics[currentTopic];
  const level = topic?.levels[currentLevel];
  const exercises: Exercise[] = level?.exercises || [];

  const levelKey = topic?.id
    ? `${topic.id}-n${currentLevel + 1}`
    : `u${currentUnit}t${currentTopic}-n${currentLevel + 1}`;

  // Obtener los 10 ejemplos del nivel
  const examples = useMemo(() => {
    return bookService.getExamplesSync(levelKey, 'libro-1ro');
  }, [levelKey]);

  const levelDesc =
    (topic as any)?.levelDescs?.[currentLevel] ||
    topic?.desc ||
    level?.label ||
    '';

  // Reiniciar estado al entrar a la lección
  useEffect(() => {
    setPhase('examples');
    setCurEx(0);
    setAttempts([]);
    setCombo(0);
    setPts(0);
    setAnswered(false);
    setUserVal('');
    setFeedback(null);
    setShowProcModal(false);
  }, [currentUnit, currentTopic, currentLevel]);

  useEffect(() => {
    setShowProcModal(false);
  }, [curEx]);

  // Temporizador para la fase de ejercicios
  useEffect(() => {
    if (phase !== 'exercises' || answered) return;

    setTLeft(35);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAnswer('timeout', false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, curEx, answered]);

  // Narrar la pregunta al cambiar de ejercicio
  useEffect(() => {
    if (phase === 'exercises' && exercises[curEx]) {
      const ex = exercises[curEx];
      fedorTTS.speak(ex.q);
    }
  }, [phase, curEx]);

  if (!unit || !topic || !level || exercises.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>
        <p>Cargando lección de 1°...</p>
        <button
          type="button"
          onClick={() => goScreen('unit')}
          style={{
            padding: '8px 16px',
            background: '#FF8C2A',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  const currentExercise = exercises[curEx];

  const handleAnswer = (val: string, isTimeout = false) => {
    if (answered) return;
    setAnswered(true);

    const correctAns = String(
      (currentExercise as any).ans ??
        (currentExercise.type === 'seq'
          ? (currentExercise as any).items
              ?.filter((it: any) => it.t === 'b')
              .map((it: any) => it.a ?? '')
              .join(', ')
          : '')
    ).trim();

    const isOk = !isTimeout && val.trim().toLowerCase() === correctAns.toLowerCase();

    if (isOk) {
      setCombo((c) => c + 1);
      setPts((p) => p + (currentExercise.pts || 30));
      setFeedback({ text: '¡Excelente! ⭐', color: '#16876A' });
      fedorTTS.speak('¡Excelente! Respuesta correcta.');
    } else {
      setCombo(0);
      setFeedback({
        text: isTimeout ? '¡Tiempo agotado!' : `La respuesta correcta es: ${correctAns}`,
        color: '#C94B22',
      });
      fedorTTS.speak(
        isTimeout ? 'Tiempo agotado.' : `No te preocupes. La respuesta correcta era ${correctAns}`
      );
    }

    const newAttempts = [
      ...attempts,
      {
        q: currentExercise.q,
        user: isTimeout ? 'Tiempo agotado' : val,
        correct: correctAns,
        ok: isOk,
      },
    ];
    setAttempts(newAttempts);

    setTimeout(() => {
      setAnswered(false);
      setUserVal('');
      setFeedback(null);

      if (curEx + 1 < exercises.length) {
        setCurEx((c) => c + 1);
      } else {
        // Finalizar lección
        finishLesson(newAttempts);
      }
    }, 1200);
  };

  const finishLesson = (allAttempts: typeof attempts) => {
    const total = exercises.length;
    const correct = allAttempts.filter((a) => a.ok).length;
    const pct = Math.round((correct / total) * 100);
    const xpEarned = correct * 10 + (pct >= 80 ? 50 : 20);
    const coinsEarned = correct * 2 + (pct >= 80 ? 10 : 5);
    const starsEarned = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;

    const summary: LessonResultsSummary1 = {
      unitIndex: currentUnit,
      topicIndex: currentTopic,
      levelIndex: currentLevel,
      total,
      correct,
      pct,
      xpEarned,
      coinsEarned,
      starsEarned,
      answers: allAttempts,
    };

    saveLessonScore(levelKey, pct, xpEarned, coinsEarned, starsEarned, summary);
  };

  return (
    <div
      className="lesson-screen-1ro"
      style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Botón superior Volver a temas */}
      <div
        onClick={() => goScreen('unit')}
        style={{
          cursor: 'pointer',
          fontWeight: 800,
          color: '#16876A',
          fontSize: '13px',
          marginBottom: '0.65rem',
          textAlign: 'left',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← Volver a temas
      </div>

      {/* Cabecera del nivel y barra de dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.6rem',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '17px', fontWeight: 900, color: '#1A0A3C' }}>
            {topic.icon} {topic.title}
          </div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '6px',
              background: level.bg || '#DCF5EE',
              color: level.color || '#074F3A',
              marginTop: '4px',
            }}
          >
            {level.short || `Nivel ${currentLevel + 1}`}
          </span>
        </div>

        {combo > 1 && (
          <div
            style={{
              background: 'linear-gradient(135deg, #FF8C2A, #E24B4A)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '99px',
              fontWeight: 900,
              fontSize: '13px',
              animation: 'popIn 0.3s ease',
            }}
          >
            🔥 Combo ×{combo}
          </div>
        )}
      </div>

      {/* Track de progreso de ejercicios: Círculos 1..20 y contador (Imagen 1) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {exercises.map((_, i) => {
            let bg = '#EDE8F8';
            let border = '1.5px solid #DDD7F0';
            let col = '#7B7294';

            if (attempts[i]) {
              if (attempts[i].ok) {
                bg = '#10B981';
                border = '1.5px solid #059669';
                col = '#ffffff';
              } else {
                bg = '#EF4444';
                border = '1.5px solid #DC2626';
                col = '#ffffff';
              }
            } else if (i === curEx && phase === 'exercises') {
              bg = '#7B2FBE';
              border = '2px solid #6C28B4';
              col = '#ffffff';
            }

            return (
              <div
                key={i}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: bg,
                  border,
                  color: col,
                  fontSize: '11px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: i === curEx ? '0 2px 6px rgba(123, 47, 190, 0.4)' : 'none',
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '13px', fontWeight: 800, color: '#6C5893' }}>
          Ejercicio {curEx + 1} de {exercises.length}
        </div>
      </div>

      {/* ════ FASE 1: PANEL DE EJEMPLOS DIDÁCTICOS (IMAGEN EXACTA) ════ */}
      {phase === 'examples' && (
        <ExamplesPanel1ro
          examples={examples}
          exercisesCount={exercises.length}
          levelIndex={currentLevel}
          unitIndex={currentUnit}
          topicTitle={topic.title}
          levelDesc={levelDesc}
          conceptText={unit.std || 'Reconoce, lee y escribe números del 1 al 20'}
          onStart={() => setPhase('exercises')}
          firstExerciseQuestion={exercises[0]?.q}
          firstExerciseAnswer={
            exercises[0]?.type === 'seq'
              ? (exercises[0] as any).items
                  ?.filter((it: any) => it.t === 'b')
                  .map((it: any) => it.a ?? '')
                  .join(', ')
              : (exercises[0] as any)?.ans || ''
          }
          firstExerciseExplain={(exercises[0] as any)?.explain}
        />
      )}

      {/* ════ FASE 2: RESOLUCIÓN DE EJERCICIOS INTERACTIVOS (IMAGEN 1 EXACTA) ════ */}
      {phase === 'exercises' && currentExercise && (
        <div
          className="ex-card"
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E5DEFA',
            boxShadow: '0 12px 36px rgba(123, 47, 190, 0.08)',
            overflow: 'hidden',
            animation: 'popIn 0.3s ease',
          }}
        >
          {/* Header del Ejercicio: Badge de categoría + Conteo + Puntos */}
          <div
            style={{
              padding: '0.8rem 1.4rem',
              borderBottom: '1px solid #F0EDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #F8F5FF, #F0EDFF)',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: '20px',
                background: '#DCF5EE',
                color: '#074F3A',
              }}
            >
              {currentExercise.badge || 'Conteo'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#6C5893' }}>
              {curEx + 1} / {exercises.length}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FDE68A, #F59E0B)',
                color: '#2A0F60',
                padding: '4px 12px',
                borderRadius: '20px',
                boxShadow: '0 2px 5px rgba(245, 158, 11, 0.25)',
              }}
            >
              ⭐ {currentExercise.pts || 30} pts
            </span>
          </div>

          {/* Barra de progreso de tiempo del ejercicio */}
          <div style={{ height: '5px', background: '#EDE8F8', width: '100%', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(tLeft / 35) * 100}%`,
                background: tLeft < 10 ? '#EF4444' : tLeft < 20 ? '#F59E0B' : '#7B2FBE',
                borderRadius: '0 3px 3px 0',
                transition: 'width 1s linear, background 0.4s',
              }}
            />
          </div>

          {/* Cuerpo principal del ejercicio */}
          <div style={{ padding: '1.75rem 1.5rem', textAlign: 'center' }}>
            {/* 1. Mascota Superior 3D flotante */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              {currentExercise.mascot === '🌟' || currentExercise.mascot === '⭐' || !currentExercise.mascot ? (
                <Mascot3DStar size={62} />
              ) : (
                <span
                  style={{
                    fontSize: '54px',
                    lineHeight: 1,
                    display: 'inline-block',
                    animation: 'mascotFloat 2.8s ease-in-out infinite',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
                  }}
                >
                  {currentExercise.mascot}
                </span>
              )}
            </div>

            {/* 2. Visual Gráfico de Conteo / Objetos Didácticos */}
            <CountVisual1ro exercise={currentExercise} />

            {/* Contexto narrativo si existe */}
            {currentExercise.ctx && (
              <div style={{ fontSize: '14px', color: '#5A5372', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.5 }}>
                {currentExercise.ctx}
              </div>
            )}

            {/* 3. Enunciado / Pregunta con botón de audio */}
            <div
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#1A0A3C',
                lineHeight: 1.3,
                fontFamily: "'Baloo 2', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '1.25rem',
              }}
            >
              <span>{currentExercise.q}</span>
              <button
                type="button"
                onClick={() => fedorTTS.speak(currentExercise.q)}
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #10B981)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(6,182,212,0.4)',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                }}
                title="Escuchar pregunta"
              >
                🔊
              </button>
            </div>

            {/* Hint didáctico */}
            {currentExercise.hint && (
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FEF3E8, #FFF8EC)',
                  border: '1px solid #FBBF7A',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  marginBottom: '1rem',
                  color: '#7A3200',
                  display: 'inline-block',
                }}
              >
                💡 {currentExercise.hint}
              </div>
            )}

            {/* 4. Opciones de respuesta para MCQ (Grid 2x2 idéntico a Imagen 1) */}
            {currentExercise.type === 'mcq' && currentExercise.opts && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: currentExercise.opts.length > 2 ? '1fr 1fr' : '1fr',
                  gap: '12px',
                  marginBottom: '1rem',
                  maxWidth: '720px',
                  margin: '0 auto 1.25rem',
                }}
              >
                {currentExercise.opts.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={answered}
                    onClick={() => handleAnswer(opt)}
                    style={{
                      padding: '16px 14px',
                      fontSize: '22px',
                      fontWeight: 900,
                      borderRadius: '16px',
                      border: '2px solid #E5E0FA',
                      background: '#F9F8FE',
                      cursor: answered ? 'default' : 'pointer',
                      color: '#1A0A3C',
                      fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                      transition: 'all 0.18s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={(e) => {
                      if (!answered) {
                        e.currentTarget.style.background = '#EEEDFE';
                        e.currentTarget.style.borderColor = '#9B5CFF';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!answered) {
                        e.currentTarget.style.background = '#F9F8FE';
                        e.currentTarget.style.borderColor = '#E5E0FA';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Formulario para tipo INPUT */}
            {currentExercise.type === 'input' && (
              <div style={{ maxWidth: '420px', margin: '0 auto 1.25rem', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={userVal}
                  disabled={answered}
                  onChange={(e) => setUserVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userVal.trim()) {
                      handleAnswer(userVal);
                    }
                  }}
                  placeholder="?"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '2px solid #C5BFEE',
                    fontSize: '24px',
                    fontWeight: 900,
                    textAlign: 'center',
                    outline: 'none',
                    background: '#F8F5FF',
                    fontFamily: "'Baloo 2', sans-serif",
                  }}
                />
                <button
                  type="button"
                  disabled={answered || !userVal.trim()}
                  onClick={() => handleAnswer(userVal)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: 900,
                    cursor: answered || !userVal.trim() ? 'not-allowed' : 'pointer',
                    opacity: answered || !userVal.trim() ? 0.6 : 1,
                  }}
                >
                  ✅ Confirmar
                </button>
              </div>
            )}

            {/* Formulario para tipo SEQ */}
            {currentExercise.type === 'seq' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', margin: '0 auto 1.25rem' }}>
                {(currentExercise as any).items?.map((it: any, i: number) => {
                  if (it.t === 'f') {
                    return (
                      <span key={i} style={{ fontSize: '24px', fontWeight: 900, color: '#1A0A3C', minWidth: '36px', textAlign: 'center' }}>
                        {it.v}
                      </span>
                    );
                  }
                  return (
                    <input
                      key={i}
                      type="text"
                      disabled={answered}
                      value={userVal}
                      onChange={(e) => setUserVal(e.target.value)}
                      placeholder="?"
                      style={{
                        width: '56px',
                        padding: '8px 4px',
                        borderRadius: '10px',
                        border: '2px solid #C5BFEE',
                        fontSize: '22px',
                        fontWeight: 900,
                        textAlign: 'center',
                        background: '#F8F5FF',
                        outline: 'none',
                      }}
                    />
                  );
                })}
                <button
                  type="button"
                  disabled={answered || !userVal.trim()}
                  onClick={() => handleAnswer(userVal)}
                  style={{
                    marginLeft: 8,
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 900,
                    cursor: answered || !userVal.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  ✅ Confirmar
                </button>
              </div>
            )}

            {/* Mensaje de feedback tras responder */}
            {feedback && (
              <div
                style={{
                  margin: '1rem auto 0',
                  maxWidth: '420px',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: feedback.color === '#16876A' ? '#DCF5EE' : '#FEE8E4',
                  color: feedback.color,
                  fontWeight: 900,
                  fontSize: '15px',
                  textAlign: 'center',
                  animation: 'popIn 0.3s ease',
                }}
              >
                {feedback.text}
              </div>
            )}

            {/* 5. Botón Ver Procedimiento Paso a Paso (idéntico a Imagen 1) */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setShowProcModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #7B2FBE, #9B5CFF)',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: 99,
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(123, 47, 190, 0.35)',
                  fontFamily: "'Nunito', sans-serif",
                  animation: 'f1pb_glow 2.4s ease-in-out infinite',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <span>💡</span>
                <span>Ver procedimiento paso a paso</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal didáctico de procedimiento paso a paso */}
      {showProcModal && currentExercise && (
        <ProcedimientoModal1ro
          exercise={currentExercise}
          onClose={() => setShowProcModal(false)}
        />
      )}

      <style>{`
        @keyframes mascotFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes f1pb_glow {
          0%, 100% {
            box-shadow: 0 4px 14px rgba(108,40,180,.35);
          }
          50% {
            box-shadow: 0 8px 22px rgba(155,92,255,.55);
          }
        }
      `}</style>
    </div>
  );
}

/* ════ COMPONENTES VISUALES 3D DIDÁCTICOS (IMAGEN 1) ════ */

/** Estrella dorada con extrusión y brillo 3D idéntica a la captura del usuario */
export function Star3D({ size = 52 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 6px 12px rgba(245, 158, 11, 0.45))',
        display: 'inline-block',
        transition: 'transform 0.18s ease',
      }}
    >
      <defs>
        <radialGradient id="star_gold_body" cx="42%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFF48F" />
          <stop offset="30%" stopColor="#FCD34D" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
        <linearGradient id="star_gold_shadow" x1="32" y1="20" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="star_gold_spec" x1="24" y1="10" x2="40" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Capa de volumen 3D inferior */}
      <path
        d="M32 4.5 C32.7 4.5 33.4 5 33.7 5.7 L41.2 21 C41.4 21.5 41.9 21.9 42.5 22 L59.3 24.5 C60.2 24.6 60.8 25.4 60.6 26.2 C60.5 26.6 60.2 27 59.9 27.3 L47.7 39.2 C47.3 39.6 47.1 40.2 47.2 40.7 L50.1 57.5 C50.2 58.3 49.7 59.1 48.9 59.3 C48.5 59.4 48 59.3 47.6 59.1 L32.6 51.2 C32.1 50.9 31.5 50.9 31 51.2 L16 59.1 C15.3 59.5 14.4 59.2 14 58.5 C13.8 58.1 13.8 57.7 13.9 57.3 L16.8 40.5 C16.9 40 16.7 39.4 16.3 39 L4.1 27.1 C3.5 26.5 3.5 25.5 4.1 24.9 C4.4 24.6 4.8 24.4 5.3 24.3 L22.1 21.8 C22.7 21.7 23.2 21.3 23.4 20.8 L30.9 5.5 C31.3 4.9 32 4.5 32 4.5 Z"
        fill="url(#star_gold_shadow)"
        transform="translate(0, 3.5)"
        opacity="0.92"
      />
      {/* Cara frontal 3D con degradado cálido */}
      <path
        d="M32 4.5 C32.7 4.5 33.4 5 33.7 5.7 L41.2 21 C41.4 21.5 41.9 21.9 42.5 22 L59.3 24.5 C60.2 24.6 60.8 25.4 60.6 26.2 C60.5 26.6 60.2 27 59.9 27.3 L47.7 39.2 C47.3 39.6 47.1 40.2 47.2 40.7 L50.1 57.5 C50.2 58.3 49.7 59.1 48.9 59.3 C48.5 59.4 48 59.3 47.6 59.1 L32.6 51.2 C32.1 50.9 31.5 50.9 31 51.2 L16 59.1 C15.3 59.5 14.4 59.2 14 58.5 C13.8 58.1 13.8 57.7 13.9 57.3 L16.8 40.5 C16.9 40 16.7 39.4 16.3 39 L4.1 27.1 C3.5 26.5 3.5 25.5 4.1 24.9 C4.4 24.6 4.8 24.4 5.3 24.3 L22.1 21.8 C22.7 21.7 23.2 21.3 23.4 20.8 L30.9 5.5 C31.3 4.9 32 4.5 32 4.5 Z"
        fill="url(#star_gold_body)"
      />
      {/* Brillo especular superior */}
      <path
        d="M32 7 L39 21 C39.5 22 40.5 22.8 41.8 23 L55 25 L44 36 C43.2 36.8 43 37.8 43.2 38.8 L44.5 46 C39.5 42.5 35 34 32 24 C29 34 24.5 42.5 19.5 46 L20.8 38.8 C21 37.8 20.8 36.8 20 36 L9 25 L22.2 23 C23.5 22.8 24.5 22 25 21 L32 7 Z"
        fill="url(#star_gold_spec)"
        opacity="0.75"
      />
    </svg>
  );
}

/** Mascota 3D Estrella superior con destellos brillantes */
export function Mascot3DStar({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        animation: 'mascotFloat 2.8s ease-in-out infinite',
      }}
    >
      <Star3D size={size} />
      <span style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', fontSize: 13, color: '#F59E0B' }}>✦</span>
      <span style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: '#F59E0B' }}>✦</span>
      <span style={{ position: 'absolute', left: -6, top: '45%', fontSize: 13, color: '#F59E0B' }}>✦</span>
      <span style={{ position: 'absolute', right: -6, top: '45%', fontSize: 13, color: '#F59E0B' }}>✦</span>
    </div>
  );
}

/** Contenedor visual del ejercicio (Conteo con estrellas 3D, figuras o conjuntos) */
export function CountVisual1ro({ exercise }: { exercise: Exercise }) {
  if (exercise.countEmoji && exercise.countN) {
    const isStar = exercise.countEmoji === '⭐' || exercise.countEmoji === '🌟';

    return (
      <div
        className="count-display"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          margin: '1.25rem auto',
          maxWidth: '420px',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, #F8F5FF, #F0EDFF)',
          borderRadius: '20px',
          border: '1.5px solid #E2DCFA',
          boxShadow: '0 4px 15px rgba(123, 47, 190, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {Array.from({ length: exercise.countN }).map((_, i) => (
            <div
              key={i}
              className="count-obj"
              style={{
                animationDelay: `${i * 0.06}s`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              {isStar ? (
                <Star3D size={56} />
              ) : (
                <span
                  style={{
                    fontSize: '46px',
                    lineHeight: 1.2,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
                    cursor: 'default',
                  }}
                >
                  {exercise.countEmoji}
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          className="count-row-label"
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 800,
            color: '#6C5893',
            marginTop: '4px',
            letterSpacing: '0.01em',
          }}
        >
          Cuenta cada {exercise.countEmoji} → escribe el total abajo
        </div>
      </div>
    );
  }

  if (exercise.visObjs && exercise.visObjs.length > 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          margin: '1.25rem auto',
        }}
      >
        {exercise.visObjs.map((g, gi) => {
          const isStar = g.e === '⭐' || g.e === '🌟';
          return (
            <React.Fragment key={gi}>
              {gi > 0 && (
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#7B2FBE' }}>+</span>
              )}
              <div
                style={{
                  background:
                    gi === 0
                      ? 'linear-gradient(135deg, #EEEDFE, #F0EDFF)'
                      : 'linear-gradient(135deg, #FEF3E8, #FFF0E0)',
                  borderRadius: '18px',
                  border: '1.5px solid #C5BFEE',
                  padding: '0.9rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {Array.from({ length: g.n }).map((_, i) => (
                    <span key={i} style={{ display: 'inline-flex' }}>
                      {isStar ? (
                        <Star3D size={42} />
                      ) : (
                        <span style={{ fontSize: '38px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}>
                          {g.e}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#5A3D8A' }}>
                  {g.label || `${g.n} ${g.e}`}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  if (exercise.svgFig) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '1rem auto',
          padding: '0.85rem',
          background: '#F7F4FF',
          borderRadius: '16px',
          border: '1.5px solid #C5BFEE',
          maxWidth: '420px',
        }}
        dangerouslySetInnerHTML={{ __html: exercise.svgFig }}
      />
    );
  }

  return null;
}

function deriveInstr(q: string, hint?: string): string {
  if (hint) return hint;
  const l = (q || '').toLowerCase();
  if (/cu.ntos elementos|cuenta|cu.ntas|cu.ntos/.test(l)) return 'Lee con atención y cuenta cada elemento visual.';
  if (/despu.s|siguiente|sigue/.test(l)) return 'Seguimos la secuencia hacia adelante (+1).';
  if (/antes|anterior/.test(l)) return 'Pensamos en el número anterior (-1).';
  if (/entre/.test(l)) return 'Buscamos el número que está en el medio.';
  if (/mayor|menor|compara/.test(l)) return 'Comparamos las cantidades para escoger la correcta.';
  if (/decena|docena/.test(l)) return 'Recordamos el valor de la decena o docena.';
  if (/\+|suma/.test(l)) return 'Sumamos con cuidado ambas cantidades.';
  if (/\-|−|resta/.test(l)) return 'Restamos con cuidado las cantidades.';
  return 'Lee la pregunta con atención y piensa paso a paso.';
}

function deriveProcedure(q: string, a: string, ex?: Exercise): string {
  if (ex?.explain) return ex.explain;
  const l = (q || '').toLowerCase();
  const m = (q || '').match(/(\d+)\s*([\+\-−×÷xX])\s*(\d+)/);
  if (m) {
    const n1 = parseInt(m[1], 10), n2 = parseInt(m[3], 10);
    const sym = m[2];
    if (sym === '+') return `Sumamos: ${n1} + ${n2} = ${a}.`;
    if (sym === '-' || sym === '−') return `Restamos: ${n1} − ${n2} = ${a}.`;
    if (sym === '×' || sym === 'x' || sym === 'X') return `Multiplicamos: ${n1} × ${n2} = ${a}.`;
    if (sym === '÷') return `Repartimos: ${n1} ÷ ${n2} = ${a}.`;
  }
  if (/cu.ntos elementos|cuenta|cu.ntas|cu.ntos/.test(l)) {
    const num = parseInt(a, 10) || 3;
    const nums = Array.from({ length: Math.min(num, 15) }, (_, i) => i + 1).join(', ');
    return `Contamos uno a uno: ${nums}. Total: ${a}.`;
  }
  if (/despu.s|siguiente/.test(l)) {
    const nMatch = (q || '').match(/despu.s.*?(\d+)/i) || (q || '').match(/(\d+)/);
    if (nMatch) {
      const n = parseInt(nMatch[1], 10);
      return `El número que va después de ${n} es ${n} + 1 = ${n + 1}.`;
    }
  }
  if (/antes|anterior/.test(l)) {
    const nMatch = (q || '').match(/antes.*?(\d+)/i) || (q || '').match(/(\d+)/);
    if (nMatch) {
      const n = parseInt(nMatch[1], 10);
      return `El número que va antes de ${n} es ${n} − 1 = ${n - 1}.`;
    }
  }
  if (/decena/.test(l)) return `Una decena equivale a 10 unidades. Por eso la respuesta es ${a}.`;
  return `Resolvamos con calma observando los elementos. La respuesta correcta es ${a}.`;
}

/** Modal interactivo del procedimiento paso a paso (Imagen 1) */
function ProcedimientoModal1ro({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const q = exercise.q || '';
  const a = (exercise as any).ans || '';
  const instr = deriveInstr(q, (exercise as any).hint);
  const proc = deriveProcedure(q, a, exercise);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 4, 30, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99989,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        animation: 'popIn 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 24,
          maxWidth: 540,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          border: '3px solid #FFB066',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #FF8A1F, #FFB066)',
            color: '#fff',
            padding: '1.1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: "'Baloo 2', sans-serif",
          }}
        >
          <span style={{ fontSize: 34, lineHeight: 1, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' }}>
            💡
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.15 }}>Procedimiento</div>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.9, marginTop: 2 }}>
              Resolvamos juntos paso a paso
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.22)',
              border: 'none',
              color: '#fff',
              fontSize: 24,
              width: 38,
              height: 38,
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 900,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.35rem', overflowY: 'auto', flex: 1, background: 'linear-gradient(180deg, #FFF8E0, #FFFCEF)' }}>
          <div
            style={{
              background: '#F0EDFF',
              border: '2px solid #C5BFEE',
              borderRadius: 14,
              padding: '0.8rem 1rem',
              marginBottom: '1rem',
              textAlign: 'center',
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: 20,
              fontWeight: 900,
              color: '#3D1468',
              lineHeight: 1.3,
            }}
          >
            {q}
          </div>

          <div
            style={{
              borderRadius: 12,
              padding: '0.75rem 1rem',
              marginBottom: '0.65rem',
              fontSize: 14,
              lineHeight: 1.45,
              fontWeight: 800,
              background: '#FFF8DC',
              color: '#7A3200',
              borderLeft: '5px solid #F5C518',
            }}
          >
            📖 Instrucción: {instr}
          </div>

          <div
            style={{
              borderRadius: 12,
              padding: '0.75rem 1rem',
              marginBottom: '0.65rem',
              fontSize: 15,
              lineHeight: 1.45,
              fontWeight: 800,
              background: '#FFFFFF',
              color: '#1a1a1a',
              border: '2px solid #FFB066',
            }}
          >
            🧮 Procedimiento: {proc}
          </div>

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              style={{
                width: '100%',
                padding: 14,
                fontSize: 15,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #16876A, #24C496)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                cursor: 'pointer',
                marginTop: '1rem',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              👁️ Mostrar respuesta
            </button>
          ) : (
            <div
              style={{
                borderRadius: 12,
                padding: '0.85rem 1rem',
                marginTop: '1rem',
                fontSize: 16,
                fontWeight: 900,
                background: '#FFE9C4',
                color: '#7A1B00',
                borderLeft: '5px solid #FF8A1F',
                animation: 'popIn 0.3s ease',
              }}
            >
              ✅ Respuesta correcta: <strong>{a}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
