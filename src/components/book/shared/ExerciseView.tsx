'use client';

import { useState, type CSSProperties } from 'react';
import type { Exercise } from '@/types/book.types';
import ExerciseFigure from './ExerciseFigure';
import { bookAudio } from '@/services/book-audio.service';

interface Props {
  exercise: Exercise;
  index: number;
  total: number;
  onAnswer: (userAnswer: string, correctAnswer: string, isCorrect: boolean) => void;
}

/** Renderiza un ejercicio (mcq | input | seq) y evalúa la respuesta. */
export default function ExerciseView({ exercise, index, total, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [seqVals, setSeqVals] = useState<Record<number, string>>({});
  const [answered, setAnswered] = useState(false);

  const submitMcq = (opt: string) => {
    if (answered) return;
    const ans = exercise.type === 'mcq' ? exercise.ans : '';
    const correct = opt === ans;
    setSelected(opt);
    setAnswered(true);
    if (correct) bookAudio.correct();
    else bookAudio.wrong();
    onAnswer(opt, ans, correct);
  };

  const submitInput = () => {
    if (answered || exercise.type !== 'input') return;
    const correct = inputVal.trim().toLowerCase() === exercise.ans.trim().toLowerCase();
    setAnswered(true);
    if (correct) bookAudio.correct();
    else bookAudio.wrong();
    onAnswer(inputVal.trim(), exercise.ans, correct);
  };

  const submitSeq = () => {
    if (answered || exercise.type !== 'seq') return;
    const blanks = exercise.items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => it.t === 'b');
    const allCorrect = blanks.every(({ it, i }) => (seqVals[i] ?? '').trim() === (it.a ?? ''));
    const userStr = blanks.map(({ i }) => seqVals[i] ?? '').join(',');
    const correctStr = blanks.map(({ it }) => it.a ?? '').join(',');
    setAnswered(true);
    if (allCorrect) bookAudio.correct();
    else bookAudio.wrong();
    onAnswer(userStr, correctStr, allCorrect);
  };

  return (
    <div className="ex-card">
      <div className="ex-progress" style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 6 }}>
        Ejercicio {index + 1} de {total}
      </div>

      <div className="ex-q-card">
        {exercise.badge && (
          <span className="ex-badge" style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 8, ...parseBst(exercise.bst) }}>
            {exercise.badge}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {exercise.mascot && <span style={{ fontSize: 30 }}>{exercise.mascot}</span>}
          <div style={{ flex: 1 }}>
            {exercise.ctx && <div className="ex-ctx" style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{exercise.ctx}</div>}
            <div className="ex-q" style={{ fontSize: 18, fontWeight: 900 }}>{exercise.q}</div>
          </div>
        </div>
        {exercise.figure && <ExerciseFigure figure={exercise.figure} data={exercise.fig_data} />}
      </div>

      {exercise.type === 'mcq' && (
        <div className="ex-mcq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, marginTop: 14 }}>
          {exercise.opts.map((opt) => {
            const isPick = selected === opt;
            const isAns = opt === exercise.ans;
            const cls = answered ? (isAns ? 'ok' : isPick ? 'bad' : '') : '';
            return (
              <button
                key={opt}
                className={`ex-opt ${cls}`}
                disabled={answered}
                onClick={() => submitMcq(opt)}
                style={{
                  padding: '14px',
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: answered ? 'default' : 'pointer',
                  border: '2px solid var(--border)',
                  background: answered && isAns ? '#DCF5EE' : answered && isPick ? '#FAECE7' : 'var(--white)',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {exercise.type === 'input' && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="finput"
              value={inputVal}
              disabled={answered}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitInput()}
              placeholder="Tu respuesta"
              style={{ flex: 1 }}
            />
            <button className="btn-primary" disabled={answered} onClick={submitInput}>Comprobar</button>
          </div>
          {exercise.hint && !answered && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>💡 {exercise.hint}</div>
          )}
        </div>
      )}

      {exercise.type === 'seq' && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {exercise.items.map((it, i) =>
              it.t === 'f' ? (
                <span key={i} style={{ padding: '10px 14px', background: 'var(--green-bg)', borderRadius: 10, fontWeight: 900 }}>{it.v}</span>
              ) : (
                <input
                  key={i}
                  className="finput"
                  disabled={answered}
                  value={seqVals[i] ?? ''}
                  onChange={(e) => setSeqVals((s) => ({ ...s, [i]: e.target.value }))}
                  style={{ width: 64, textAlign: 'center' }}
                />
              )
            )}
          </div>
          <button className="btn-primary" disabled={answered} onClick={submitSeq} style={{ marginTop: 10 }}>Comprobar</button>
        </div>
      )}

      {answered && (
        <div className="ex-fb" style={{ marginTop: 12, fontWeight: 800, color: 'var(--teal-d)' }}>
          {feedback(exercise, selected, inputVal, seqVals)}
        </div>
      )}
    </div>
  );
}

function parseBst(bst?: string): CSSProperties {
  if (!bst) return {};
  const style: Record<string, string> = {};
  bst.split(';').forEach((decl) => {
    const [k, v] = decl.split(':');
    if (k && v) style[k.trim()] = v.trim();
  });
  return style as CSSProperties;
}

function feedback(
  ex: Exercise,
  selected: string | null,
  inputVal: string,
  seqVals: Record<number, string>
): string {
  if (ex.type === 'mcq') return selected === ex.ans ? '✅ ¡Correcto!' : `❌ La respuesta es ${ex.ans}`;
  if (ex.type === 'input')
    return inputVal.trim().toLowerCase() === ex.ans.trim().toLowerCase() ? '✅ ¡Correcto!' : `❌ La respuesta es ${ex.ans}`;
  const blanks = ex.items.map((it, i) => ({ it, i })).filter(({ it }) => it.t === 'b');
  const ok = blanks.every(({ it, i }) => (seqVals[i] ?? '').trim() === (it.a ?? ''));
  return ok ? '✅ ¡Secuencia correcta!' : '❌ Revisa la secuencia';
}
