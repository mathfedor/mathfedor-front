'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useBook } from '../context/BookContext';
import ExerciseView from '../shared/ExerciseView';
import ExamplesPanel from '../shared/ExamplesPanel';
import { computeGrade } from '@/services/gamification.service';
import { dailyChallengeKey } from '@/services/daily-challenge.service';
import { bookService } from '@/services/book.service';
import { bookDiaryService } from '@/services/book-diary.service';
import { levelKey } from '../shared/progress.utils';
import type { Exercise, LevelExample } from '@/types/book.types';
import type { ExerciseAttempt, LessonResult } from '@/types/book-progress.types';

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
    };
  }, [isDaily, dailyExercises, book, currentLevel]);

  const examples: LevelExample[] = useMemo(
    () => (isDaily || !meta ? [] : bookService.getExamples(meta.key)),
    [isDaily, meta]
  );

  if (!meta || meta.exercises.length === 0) return null;
  const exercises: Exercise[] = meta.exercises;
  const exercise = exercises[idx];

  // Fase de ejemplos: se muestra antes de la práctica (salvo reto diario).
  if (phase === 'examples') {
    return (
      <div className="screen active" id="screen-lesson">
        <div className="back-row" onClick={() => goScreen(meta.backTarget)}>← Volver a temas</div>
        <ExamplesPanel
          examples={examples}
          levelIndex={currentLevel.levelIndex}
          topicTitle={meta.topicTitle}
          conceptText={book.units[currentLevel.unitIndex]?.std ?? ''}
          onStart={() => setPhase('exercises')}
        />
      </div>
    );
  }

  const handleAnswer = (userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
    const elapsed = Date.now() - shownAtRef.current;
    if (isCorrect) fastestRef.current = Math.min(fastestRef.current, elapsed);
    setCombo((c) => (isCorrect ? c + 1 : 0));
    setAttempts((a) => [...a, { exerciseId: exercise.id, userAnswer, correctAnswer, isCorrect }]);
    if (isCorrect) setPts((p) => p + exercise.pts);

    setTimeout(() => {
      if (idx + 1 < exercises.length) {
        setIdx((i) => i + 1);
      } else {
        complete([...attempts, { exerciseId: exercise.id, userAnswer, correctAnswer, isCorrect }], pts + (isCorrect ? exercise.pts : 0));
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
      <div className="back-row" onClick={() => goScreen(meta.backTarget)}>
        {isDaily ? '← Salir del reto' : '← Volver a temas'}
      </div>

      <div className="les-top" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{meta.headerIcon} {meta.headerTitle}</div>
            <div style={{ fontSize: 12, color: isDaily ? 'var(--orange-d)' : 'var(--muted)' }}>{meta.levelLabel}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {combo >= 2 && <div className="combo-display show">🔥 Combo x{combo}</div>}
            <div style={{ fontWeight: 900, color: 'var(--orange)' }}>{idx + 1}/{exercises.length}</div>
          </div>
        </div>
        <div className="pg-bar" style={{ marginTop: 8 }}>
          <div className="pg-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <ExerciseView key={exercise.id} exercise={exercise} index={idx} total={exercises.length} onAnswer={handleAnswer} />
    </div>
  );
}
