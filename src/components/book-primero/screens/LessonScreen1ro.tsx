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
  }, [currentUnit, currentTopic, currentLevel]);

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

      {/* Track de progreso de ejercicios */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        {exercises.map((_, i) => {
          let bg = '#E5E7EB';
          let border = '1px solid #D1D5DB';
          let col = '#4B5563';

          if (attempts[i]) {
            if (attempts[i].ok) {
              bg = '#10B981';
              border = '1px solid #059669';
              col = '#ffffff';
            } else {
              bg = '#EF4444';
              border = '1px solid #DC2626';
              col = '#ffffff';
            }
          } else if (i === curEx && phase === 'exercises') {
            bg = '#FF8C2A';
            border = '2px solid #E8650A';
            col = '#ffffff';
          }

          return (
            <div
              key={i}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: bg,
                border,
                color: col,
                fontSize: '11px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {i + 1}
            </div>
          );
        })}
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

      {/* ════ FASE 2: RESOLUCIÓN DE EJERCICIOS INTERACTIVOS ════ */}
      {phase === 'exercises' && currentExercise && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '2px solid #F0C674',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            textAlign: 'left',
          }}
        >
          {/* Header del ejercicio: Ejercicio X de Y + Cronómetro */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#6B7280' }}>
              Ejercicio {curEx + 1} de {exercises.length}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 900,
                fontSize: '14px',
                color: tLeft <= 10 ? '#EF4444' : '#16876A',
              }}
            >
              <span>⏱️</span>
              <span>{tLeft}s</span>
            </div>
          </div>

          {/* Pregunta con botón de voz */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: '1.2rem',
            }}
          >
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
                flexShrink: 0,
              }}
              title="Escuchar pregunta"
            >
              🔊
            </button>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 900,
                color: '#1A0A3C',
                lineHeight: 1.4,
                fontFamily: "'Baloo 2', sans-serif",
              }}
            >
              {currentExercise.q}
            </div>
          </div>

          {/* Visual del ejercicio si existe (SVG o emoji o items) */}
          {(currentExercise as any).svgFig && (
            <div
              style={{
                background: '#FFFBF2',
                border: '1.5px solid rgba(232, 101, 10, 0.35)',
                borderRadius: '12px',
                padding: '0.8rem',
                margin: '1rem 0',
                textAlign: 'center',
              }}
              dangerouslySetInnerHTML={{ __html: (currentExercise as any).svgFig }}
            />
          )}

          {/* Opciones de respuesta para MCQ */}
          {currentExercise.type === 'mcq' && currentExercise.opts && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: currentExercise.opts.length > 2 ? '1fr 1fr' : '1fr',
                gap: '10px',
                margin: '1.2rem 0',
              }}
            >
              {currentExercise.opts.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: 900,
                    borderRadius: '14px',
                    border: '2px solid #E5E7EB',
                    background: '#F9FAFB',
                    cursor: answered ? 'default' : 'pointer',
                    color: '#1F2937',
                    fontFamily: "'Baloo 2', sans-serif",
                    transition: 'all 0.15s ease',
                  }}
                  onMouseDown={(e) => {
                    if (!answered) e.currentTarget.style.transform = 'scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    if (!answered) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Formulario de respuesta para INPUT */}
          {currentExercise.type === 'input' && (
            <div style={{ margin: '1.2rem 0', display: 'flex', gap: '8px' }}>
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
                placeholder="Escribe tu respuesta..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '2px solid #D1D5DB',
                  fontSize: '17px',
                  fontWeight: 800,
                  outline: 'none',
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
                Comprobar
              </button>
            </div>
          )}

          {/* Mensaje de feedback tras responder */}
          {feedback && (
            <div
              style={{
                marginTop: '1rem',
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
        </div>
      )}
    </div>
  );
}
