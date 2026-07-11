'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useBook } from '../context/BookContext';
import ExerciseView from '../shared/ExerciseView';
import ExamplesPanel from '../shared/ExamplesPanel';
import ProcedureModal from '../shared/ProcedureModal';
import { computeGrade } from '@/services/gamification.service';
import { dailyChallengeKey } from '@/services/daily-challenge.service';
import { bookService } from '@/services/book.service';
import { bookDiaryService } from '@/services/book-diary.service';
import { levelKey } from '../shared/progress.utils';
import type { Exercise, LevelExample } from '@/types/book.types';
import type { ExerciseAttempt, LessonResult } from '@/types/book-progress.types';

const CONCEPT_TIPS: Record<string, string[]> = {
  addition: [
    'Digite en cada cuadro el número de dragones siguiendo la correspondiente cantidad y luego el resultado de la adición.',
    'Digite en el cuadro respectivo el número de bolas y luego el resultado de la adición.',
    'Adición o Suma sin llevar',
  ],
  subtraction: [
    'La sustracción o resta disminuye una cantidad de otra.',
    'Restar una cantidad de otra es hallar la diferencia.',
    'Ejemplos de Sustracción o Resta',
    'Acciones de presente y pasado en la sustracción',
  ],
  multiplication: [
    'La Propiedad Conmutaiva de la Multiplicación',
    'La multiplicación se representa con los signos: · o ×.',
    'Acciones de presente y pasado en la Multiplicación',
    'Tablas de Multiplicar',
  ],
  division: [
    'En el salón de clase hay una reunión entre los estudiantes y van a repartir una bebida.',
    'La profesora reparte en grupos de 5 estudiantes.',
    'La profesora reparte 3 cuentos diarios para leer.',
    'Dividir es repartir en partes iguales.',
    'Dividir es repartir la unidad en una o más partes',
    'Son reparticiones en partes iguales donde el residuo es 0.',
    'Repartir chocolatines',
    '¿Cuánto le toca a cada niño en cada repartición ?',
  ],
  decena: [
    'La decena representa un conjunto de 10 elementos.',
    'Dibuja 5 ejemplos de decenas en tu cuaderno.',
    'El sistema decimal es posicional, primero las unidades, luego las decenas y luego las centenas.',
    'Unidades decenas y centenas',
    'Descomponer cada número en unidades, decenas y centenas.',
    'Descomponer cada número en centenas, decenas y unidades.',
  ],
  centena: [
    'Dibujar una centena en tu cuaderno.',
  ],
  conteo: [
    'Son los números naturales usados para contar elementos.',
    'Son los números Naturales que usamos para contar elementos de un conjunto.',
    'Contar, Sumar y Completar.',
  ],
};

function getConceptTip(topicId: string, levelIndex: number): { text: string; icon: string } | null {
  const tid = topicId.toLowerCase();
  let key = '';
  let icon = '';

  if (tid.startsWith('add_decena')) {
    key = 'decena';
    icon = '🔟';
  } else if (tid.startsWith('add_docena')) {
    return { text: 'La docena es un grupo de 12 elementos.', icon: '📦' };
  } else if (tid.startsWith('add_centena')) {
    key = 'centena';
    icon = '💯';
  } else if (tid.startsWith('add_conteo')) {
    key = 'conteo';
    icon = '🔢';
  } else if (tid.startsWith('add_')) {
    key = 'addition';
    icon = '➕';
  } else if (tid.startsWith('sub_')) {
    key = 'subtraction';
    icon = '➖';
  } else if (tid.startsWith('mul_')) {
    key = 'multiplication';
    icon = '✖️';
  } else if (tid.startsWith('div_')) {
    key = 'division';
    icon = '➗';
  }

  const pool = CONCEPT_TIPS[key];
  if (!pool || pool.length === 0) return null;
  return {
    text: pool[levelIndex % pool.length],
    icon,
  };
}

function deriveInstr(q: string): string {
  const l = (q || '').toLowerCase();
  if (/cu.ntos elementos|cuenta/.test(l)) return 'Lee con atención y cuenta cada elemento.';
  if (/despu.s|antes|siguiente|sigue/.test(l)) return 'Seguimos la secuencia de los números.';
  if (/entre/.test(l)) return 'Busca el número que está en medio.';
  if (/mayor|menor|compara/.test(l)) return 'Compara las cantidades para escoger la correcta.';
  if (/decena|docena|centena/.test(l)) return 'Recuerda el valor posicional.';
  if (/\+|suma/.test(l)) return 'Suma con cuidado las cantidades.';
  if (/\-|−|resta/.test(l)) return 'Resta con cuidado las cantidades.';
  if (/x|veces/.test(l)) return 'Multiplica con orden, paso a paso.';
  if (/÷|repart|divid/.test(l)) return 'Reparte en partes iguales.';
  return 'Lee la pregunta y piensa paso a paso.';
}


/**
 * Motor de lección. Soporta dos modos:
 *  - `level`: recorre los ejercicios de un nivel concreto.
 *  - `daily`: recorre el reto del día (monedas dobles, sin afectar el % de unidades).
 */
export default function LessonScreen() {
  const { book, currentLevel, lessonMode, dailyExercises, goScreen, finishLesson } = useBook();
  const [idx, setIdx] = useState(0);
  const [attempts, setAttempts] = useState<ExerciseAttempt[]>([]);
  const [pts, setPts] = useState(0);
  const shownAtRef = useRef<number>(Date.now());
  const fastestRef = useRef<number>(Number.POSITIVE_INFINITY);
  const isDaily = lessonMode === 'daily';
  const [phase, setPhase] = useState<'examples' | 'exercises'>(isDaily ? 'exercises' : 'examples');
  const [combo, setCombo] = useState(0);
  const isGrade1 = book?.slug === 'libro-1ro';
  const [procedureOpen, setProcedureOpen] = useState(false);
  const [tLeft, setTLeft] = useState(35);
  const [answeredIdx, setAnsweredIdx] = useState<number | null>(null);

  useEffect(() => {
    setAnsweredIdx(null);
  }, [idx]);

  // Reinicia el cronómetro cada vez que se muestra un ejercicio.
  useEffect(() => {
    shownAtRef.current = Date.now();
  }, [idx]);

  const meta = useMemo(() => {
    if (isDaily) {
      return {
        exercises: dailyExercises,
        key: dailyChallengeKey(),
        topicTitle: 'Reto del día',
        levelLabel: '⚡ Desafío diario · monedas × 2',
        headerIcon: '⚡',
        headerTitle: 'Reto del día',
        coinMultiplier: 2,
        backTarget: 'home' as const,
        topic: null,
        level: null,
      };
    }
    if (!book || !currentLevel) return null;
    const unit = book.units[currentLevel.unitIndex];
    const topic = unit?.topics[currentLevel.topicIndex];
    const level = topic?.levels[currentLevel.levelIndex];
    if (!topic || !level) return null;
    return {
      exercises: level.exercises,
      key: levelKey(currentLevel.unitIndex, currentLevel.topicIndex, currentLevel.levelIndex),
      topicTitle: topic.title,
      levelLabel: level.label,
      headerIcon: topic.icon,
      headerTitle: topic.title,
      coinMultiplier: 1,
      backTarget: 'unit' as const,
      topic,
      level,
    };
  }, [isDaily, dailyExercises, book, currentLevel]);

  const examples: LevelExample[] = useMemo(
    () => (isDaily || !meta ? [] : bookService.getExamples(meta.key, book?.slug)),
    [isDaily, meta, book?.slug]
  );

  const conceptTip = useMemo(() => {
    if (isDaily || !meta || !meta.topic || !currentLevel) return null;
    return getConceptTip(meta.topic.id, currentLevel.levelIndex);
  }, [isDaily, meta, currentLevel]);

  useEffect(() => {
    if (meta?.key) {
      setIdx(0);
      setAttempts([]);
      setPts(0);
      setCombo(0);
      setAnsweredIdx(null);
      setPhase(isDaily ? 'exercises' : 'examples');
      fastestRef.current = Number.POSITIVE_INFINITY;
    }
  }, [meta?.key, isDaily]);

  if (!meta || meta.exercises.length === 0) return null;
  const exercises: Exercise[] = meta.exercises;
  const exercise = exercises[idx];

  useEffect(() => {
    if (phase !== 'exercises') return;
    if (answeredIdx === idx) return;

    setTLeft(35);

    const interval = setInterval(() => {
      setTLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer('timeout', (exercise as any)?.ans || '', false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [idx, phase, exercise?.id, answeredIdx]);

  const getTimerColor = (t: number) => {
    if (t < 10) return '#C94B22';
    if (t < 20) return '#BA7517';
    return '#6C28B4';
  };

  // Fase de ejemplos: se muestra antes de la práctica (salvo reto diario).
  // Fase de ejemplos: se muestra antes de la práctica (salvo reto diario).
  if (phase === 'examples') {
    if (!book || !currentLevel) return null;
    const levelDesc = (meta.topic as any)?.levelDescs?.[currentLevel.levelIndex] || meta.topic?.desc || '';

    return (
      <div className="screen active" id="screen-lesson">
        {isGrade1 && !isDaily && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 1rem' }}>
            <div 
              className="feat-btn" 
              onClick={() => goScreen('estandares')} 
              style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0 }}
            >
              <div 
                className="feat-icon" 
                style={{ 
                  background: '#fff', 
                  fontSize: '18px', 
                  fontWeight: 900, 
                  color: '#333', 
                  border: '1.5px solid rgba(0,0,0,.08)',
                  boxShadow: 'none' 
                }}
              >
                CO
              </div>
              <div className="feat-info" style={{ textAlign: 'left' }}>
                <div className="feat-name">Estándares MEN</div>
                <div className="feat-sub" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>Programa de 1° Colombia</div>
              </div>
            </div>

            <div 
              className="feat-btn" 
              onClick={() => goScreen('problemas')} 
              style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0 }}
            >
              <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#0E5240,#34D399)' }}>🛒</div>
              <div className="feat-info" style={{ textAlign: 'left' }}>
                <div className="feat-name">Problemas Cotidianos</div>
                <div className="feat-meta" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>Conteo de monedas + compras + 4 operaciones</div>
              </div>
              <div className="feat-arrow">→</div>
            </div>
          </div>
        )}
        <div className="back-row" onClick={() => goScreen(meta.backTarget)}>← Volver a temas</div>
        {isGrade1 ? (
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>
              {meta.headerIcon} {meta.headerTitle}
              {levelDesc ? ` · ${levelDesc}` : ''}
            </div>
            <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 900, padding: '2px 7px', borderRadius: '8px', background: meta.level?.bg || '#EEEDFE', color: meta.level?.color || '#3D1468', marginTop: '6px' }}>
              {meta.level?.short || 'N1'}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{meta.headerIcon} {meta.headerTitle}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{meta.levelLabel}</div>
          </div>
        )}

        {conceptTip && (
          <div id="f1LessonConceptBanner" style={{ marginBottom: '1rem' }}>
            <span className="ico">{conceptTip.icon}</span>
            <span>{conceptTip.text}</span>
          </div>
        )}

        {isGrade1 && (
          <>
            {/* Timeline of dots */}
            <div id="progTrack" style={{ margin: '0.85rem 0 1.25rem' }}>
              {exercises.map((_, dotIdx) => (
                <div key={dotIdx} className="pt-dot">
                  {dotIdx + 1}
                </div>
              ))}
            </div>

            {/* Preview of the first exercise card */}
            <div style={{ background: '#fff', border: '2px solid #FF8C2A', borderRadius: '18px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(0,0,0,.05)' }}>
              {/* Question box */}
              <div style={{ background: '#E8F5FF', border: '1.5px solid #BFE3FF', borderRadius: '12px', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '.75rem' }}>
                <span style={{ fontSize: '18px' }}>👋</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A3A6A', textAlign: 'left' }}>
                  {exercises[0].q}
                </div>
              </div>

              {/* Instruction box */}
              <div style={{ background: '#FFFDF0', border: '1.5px solid #FFEFA8', borderRadius: '12px', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '.75rem' }}>
                <span style={{ fontSize: '16px' }}>📖</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A5C00', textAlign: 'left' }}>
                  Instrucción: {deriveInstr(exercises[0].q)}
                </div>
              </div>

              {/* Procedure button */}
              <button 
                disabled
                style={{
                  padding: '10px 20px',
                  background: '#24C496',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'not-allowed',
                  opacity: 0.95,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                💡 Ver procedimiento
              </button>
            </div>
          </>
        )}

        <ExamplesPanel
          examples={examples}
          exercisesCount={exercises.length}
          levelIndex={currentLevel.levelIndex}
          topicTitle={meta.topicTitle}
          levelDesc={levelDesc}
          conceptText={book.units[currentLevel.unitIndex]?.std ?? ''}
          onStart={() => setPhase('exercises')}
          firstExerciseQuestion={exercises[0]?.q}
          firstExerciseAnswer={exercises[0]?.type === 'seq' ? (exercises[0] as any).items?.filter((it: any) => it.t === 'b').map((it: any) => it.a ?? '').join(', ') : (exercises[0] as any)?.ans || ''}
          firstExerciseExplain={(exercises[0] as any)?.explain}
        />
      </div>
    );
  }

  const handleAnswer = (userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
    setAnsweredIdx(idx);
    const elapsed = Date.now() - shownAtRef.current;
    if (isCorrect) fastestRef.current = Math.min(fastestRef.current, elapsed);
    setCombo((c) => (isCorrect ? c + 1 : 0));
    setAttempts((a) => [...a, { exerciseId: exercise.id, userAnswer, correctAnswer, isCorrect, q: exercise.q }]);
    if (isCorrect) setPts((p) => p + exercise.pts);

    setTimeout(() => {
      if (idx + 1 < exercises.length) {
        setIdx((i) => i + 1);
      } else {
        complete([...attempts, { exerciseId: exercise.id, userAnswer, correctAnswer, isCorrect, q: exercise.q }], pts + (isCorrect ? exercise.pts : 0));
      }
    }, 900);
  };

  const complete = (allAttempts: ExerciseAttempt[], finalPts: number) => {
    const maxPts = exercises.reduce((a, e) => a + e.pts, 0);
    const ok = allAttempts.filter((a) => a.isCorrect).length;
    const wrong = allAttempts.length - ok;
    const grade = computeGrade(finalPts, maxPts);
    bookDiaryService.logExercises(allAttempts.length);
    const result: LessonResult = {
      levelKey: meta.key,
      topicTitle: meta.topicTitle,
      levelLabel: meta.levelLabel,
      pts: finalPts,
      maxPts,
      ok,
      wrong,
      pct: grade.pct,
      grade,
      attempts: allAttempts,
    };
    finishLesson(result, {
      xp: finalPts,
      coins: Math.round(finalPts / 10) * meta.coinMultiplier,
      stars: grade.letter === 'S' ? 3 : grade.letter === 'A' ? 2 : 1,
      ok,
      wrong,
      fastestMs: Number.isFinite(fastestRef.current) ? fastestRef.current : undefined,
    });
  };

  const progressPct = Math.round((idx / exercises.length) * 100);

  return (
    <div className="screen active" id="screen-lesson">
      {isGrade1 && !isDaily && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 1rem' }}>
          <div 
            className="feat-btn" 
            onClick={() => goScreen('estandares')} 
            style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0 }}
          >
            <div 
              className="feat-icon" 
              style={{ 
                background: '#fff', 
                fontSize: '18px', 
                fontWeight: 900, 
                color: '#333', 
                border: '1.5px solid rgba(0,0,0,.08)',
                boxShadow: 'none' 
              }}
            >
              CO
            </div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Estándares MEN</div>
              <div className="feat-sub" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>Programa de 1° Colombia</div>
            </div>
          </div>

          <div 
            className="feat-btn" 
            onClick={() => goScreen('problemas')} 
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0 }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#0E5240,#34D399)' }}>🛒</div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Problemas Cotidianos</div>
              <div className="feat-meta" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>Conteo de monedas + compras + 4 operaciones</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>
        </div>
      )}
      <div className="back-row" onClick={() => goScreen(meta.backTarget)}>
        {isDaily ? '← Salir del reto' : '← Volver a temas'}
      </div>

      <div className="les-top" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ textAlign: 'left' }}>
            {isGrade1 && !isDaily && currentLevel ? (
              <>
                <div style={{ fontWeight: 900, fontSize: 16 }}>
                  {meta.headerIcon} {meta.headerTitle}
                  {(() => {
                    const levelDesc = (meta.topic as any)?.levelDescs?.[currentLevel.levelIndex] || meta.topic?.desc || '';
                    return levelDesc ? ` · ${levelDesc}` : '';
                  })()}
                </div>
                <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 900, padding: '2px 7px', borderRadius: '8px', background: meta.level?.bg || '#EEEDFE', color: meta.level?.color || '#3D1468', marginTop: '6px' }}>
                  {meta.level?.short || 'N1'}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{meta.headerIcon} {meta.headerTitle}</div>
                <div style={{ fontSize: 12, color: isDaily ? 'var(--orange-d)' : 'var(--muted)' }}>{meta.levelLabel}</div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {combo >= 2 && <div className="combo-display show">🔥 Combo x{combo}</div>}
            <div style={{ fontWeight: 900, color: 'var(--orange)' }}>{idx + 1}/{exercises.length}</div>
          </div>
        </div>
        {isGrade1 ? (
          <>
            <div id="progTrack" style={{ margin: '0.85rem 0 0' }}>
              {exercises.map((_, dotIdx) => {
                let cls = 'pt-dot';
                if (dotIdx === idx) cls += ' active';
                else if (dotIdx < idx) {
                  const att = attempts.find(a => a.exerciseId === exercises[dotIdx].id);
                  cls += (att && att.isCorrect) ? ' done' : ' wrong';
                }
                return (
                  <div key={dotIdx} className={cls}>
                    {dotIdx + 1}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: '#6A20A8', marginTop: '0.45rem' }}>
              Ejercicio {idx + 1} de {exercises.length}
            </div>
          </>
        ) : (
          <div className="pg-bar" style={{ marginTop: 8 }}>
            <div className="pg-fill" style={{ width: `${progressPct}%` }} />
          </div>
        )}
      </div>

      {phase === 'exercises' && (
        <div className="timer-track" style={{ marginBottom: '1.25rem', borderRadius: '4px' }}>
          <div 
            className="timer-fill" 
            style={{ 
              width: `${(tLeft / 35) * 100}%`,
              background: getTimerColor(tLeft),
              transition: 'width 1s linear, background 0.4s'
            }} 
          />
        </div>
      )}

      {isGrade1 && conceptTip && (
        <div id="f1LessonConceptBanner">
          <span className="ico">{conceptTip.icon}</span>
          <span>{conceptTip.text}</span>
        </div>
      )}

      {isGrade1 && !isDaily && (
        <div style={{ background: '#fff', border: '2px solid #FF8C2A', borderRadius: '18px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(0,0,0,.05)', textAlign: 'left' }}>
          {/* Question box */}
          <div style={{ background: '#E8F5FF', border: '1.5px solid #BFE3FF', borderRadius: '12px', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '.75rem' }}>
            <span style={{ fontSize: '18px' }}>👋</span>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A3A6A', textAlign: 'left' }}>
              {exercise.q}
            </div>
          </div>

          {/* Instruction box */}
          <div style={{ background: '#FFFDF0', border: '1.5px solid #FFEFA8', borderRadius: '12px', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '.75rem' }}>
            <span style={{ fontSize: '16px' }}>📖</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A5C00', textAlign: 'left' }}>
              Instrucción: {deriveInstr(exercise.q)}
            </div>
          </div>

          {/* Procedure button */}
          <button 
            onClick={() => setProcedureOpen(true)}
            style={{
              padding: '10px 20px',
              background: '#24C496',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            💡 Ver procedimiento
          </button>
        </div>
      )}

      <ExerciseView key={exercise.id} exercise={exercise} index={idx} total={exercises.length} onAnswer={handleAnswer} isGrade1={isGrade1} />

      <ProcedureModal
        isOpen={procedureOpen}
        onClose={() => setProcedureOpen(false)}
        question={exercise.q}
        answer={exercise.type === 'seq' ? (exercise as any).items?.filter((it: any) => it.t === 'b').map((it: any) => it.a ?? '').join(', ') : (exercise as any)?.ans || ''}
        explainHtml={exercise.explain}
      />
    </div>
  );
}

