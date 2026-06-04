'use client';

import { useMemo, useState } from 'react';
import { useBook } from '../context/BookContext';
import { bookAudio } from '@/services/book-audio.service';
import ConfettiLayer from '../shared/ConfettiLayer';
import type { McqExercise } from '@/types/book.types';

const TOTAL = 20;
const PASS = 14;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Examen Final (réplica de `openExamenFinal`): 20 preguntas tomadas de los
 * primeros 3 ejercicios de cada nivel. Aprobado con ≥14; otorga 300 monedas.
 */
export default function FinalExamScreen() {
  const { book, goScreen, grantReward } = useBook();
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const questions = useMemo<McqExercise[]>(() => {
    if (!book) return [];
    const pool: McqExercise[] = [];
    book.units.forEach((u) =>
      u.topics.forEach((t) =>
        t.levels.forEach((lv) =>
          lv.exercises.slice(0, 3).forEach((e) => {
            if (e.type === 'mcq' && e.opts.length > 0) pool.push(e);
          })
        )
      )
    );
    return shuffle(pool).slice(0, TOTAL);
  }, [book]);

  const options = useMemo(() => (questions[idx] ? shuffle(questions[idx].opts) : []), [questions, idx]);

  if (!book) return null;
  if (questions.length === 0) {
    return (
      <div className="screen active" id="screen-examen">
        <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>
        <p style={{ textAlign: 'center', padding: '2rem' }}>No hay preguntas disponibles.</p>
      </div>
    );
  }

  const q = questions[idx];

  const pick = (opt: string) => {
    if (answered) return;
    const isOk = opt === q.ans;
    setAnswered(opt);
    if (isOk) {
      setCorrect((c) => c + 1);
      bookAudio.correct();
    } else {
      bookAudio.wrong();
    }
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx((i) => i + 1);
        setAnswered(null);
      } else {
        finish(isOk ? correct + 1 : correct);
      }
    }, 1100);
  };

  const finish = (finalCorrect: number) => {
    setCorrect(finalCorrect);
    setDone(true);
    const passed = finalCorrect >= PASS;
    if (passed && !rewarded) {
      grantReward(0, 300);
      setRewarded(true);
      bookAudio.levelUp();
    }
  };

  if (done) {
    const passed = correct >= PASS;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="screen active" id="screen-examen">
        {passed && <ConfettiLayer pieces={120} />}
        <div className="exam-result">
          <div style={{ fontSize: 72 }}>{passed ? '🎓' : '📊'}</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: passed ? '#16876A' : '#A30041', fontFamily: "'Baloo 2',sans-serif", margin: '.6rem 0' }}>
            {correct}/{questions.length}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--muted)', marginBottom: '1rem' }}>{pct}% de aciertos</div>
          <div className="exam-verdict" style={{ background: passed ? '#DCF5EE' : '#FBE4E9', color: passed ? '#074F3A' : '#7A1B00', border: `2px solid ${passed ? '#16876A' : '#A30041'}` }}>
            {passed ? '🏆 ¡Aprobado! Has demostrado dominio. +300 🪙' : '💪 Sigue practicando y vuelve a intentarlo.'}
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => goScreen('home')}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen active" id="screen-examen">
      <div className="back-row" onClick={() => goScreen('home')}>← Salir del examen</div>

      <div className="exam-head">📝 Examen Final · Pregunta {idx + 1}/{questions.length}</div>
      <div className="exam-progress"><div className="exam-progress-fill" style={{ width: `${(idx / questions.length) * 100}%` }} /></div>

      <div className="exam-q">{q.q}</div>

      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {options.map((o) => {
          const isAns = o === q.ans;
          const isPick = answered === o;
          const cls = answered ? (isAns ? 'exam-opt ok' : isPick ? 'exam-opt bad' : 'exam-opt') : 'exam-opt';
          return (
            <button key={o} className={cls} disabled={!!answered} onClick={() => pick(o)}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
