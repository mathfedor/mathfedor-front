'use client';

import { useState, type CSSProperties } from 'react';
import type { Exercise } from '@/types/book.types';
import ExerciseFigure from './ExerciseFigure';
import { bookAudio } from '@/services/book-audio.service';
import { fedorTTS } from '@/services/tts.service';
import ProcedureModal from './ProcedureModal';

interface Props {
  exercise: Exercise;
  index: number;
  total: number;
  onAnswer: (userAnswer: string, correctAnswer: string, isCorrect: boolean) => void;
  isGrade1?: boolean;
}

export default function ExerciseView({ exercise, index, total, onAnswer, isGrade1 }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [seqVals, setSeqVals] = useState<Record<number, string>>({});
  const [answered, setAnswered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

      <div className="ex-q-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {exercise.badge && (
          <div style={{ marginBottom: 6 }}>
            <span
              className="ex-badge"
              style={{
                display: 'inline-block',
                padding: '3px 12px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 800,
                ...parseBst(exercise.bst),
              }}
            >
              {exercise.badge}
            </span>
          </div>
        )}

        {/* 1. Mascota / Emoji Superior */}
        {exercise.mascot && (
          <div
            className="ex-mascot"
            style={{
              fontSize: '44px',
              lineHeight: 1,
              marginBottom: '0.6rem',
              userSelect: 'none',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))',
            }}
          >
            {exercise.mascot}
          </div>
        )}

        {/* 2. Visualización Gráfica SVG */}
        {exercise.svgFig && (
          <div
            className="ex-figure"
            style={{
              width: '100%',
              maxWidth: '380px',
              margin: '0.2rem auto 0.8rem',
              display: 'flex',
              justifyContent: 'center',
            }}
            dangerouslySetInnerHTML={{ __html: exercise.svgFig }}
          />
        )}

        {/* 2b. Visualización de Objetos de Conteo */}
        {exercise.visObjs && exercise.visObjs.length > 0 && !exercise.svgFig && (
          <div
            style={{
              background: '#FFF8E0',
              border: '2.5px solid #FF8C2A',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(232,101,10,0.15)',
              width: '100%',
              maxWidth: '380px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {exercise.visObjs.map((obj, oi) => (
                <div key={oi} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {Array.from({ length: obj.n }).map((_, ni) => (
                    <span key={ni} style={{ fontSize: '38px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}>
                      {obj.e}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {exercise.visObjs[0]?.label && (
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#7A3200' }}>
                {exercise.visObjs[0].label}
              </div>
            )}
          </div>
        )}

        {exercise.countEmoji && exercise.countN !== undefined && !exercise.svgFig && (
          <div 
            style={{ 
              background: '#F1EFFE', 
              border: '1.5px solid #DCD8FC', 
              borderRadius: '16px', 
              padding: '1.25rem', 
              marginBottom: '1rem', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              maxWidth: '380px',
            }}
          >
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {Array.from({ length: exercise.countN }).map((_, i) => (
                <span key={i} style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                  {exercise.countEmoji}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#5A3D8A' }}>
              Cuenta cada {exercise.countEmoji} ➔ escribe el total abajo
            </div>
          </div>
        )}

        {exercise.figure && <ExerciseFigure figure={exercise.figure} data={exercise.fig_data} />}

        {/* 3. Enunciado / Pregunta Organizada debajo del gráfico con botón de audio TTS */}
        <div style={{ width: '100%', marginTop: '0.4rem', textAlign: 'center' }}>
          {exercise.ctx && (
            <div className="ex-ctx" style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
              {exercise.ctx}
            </div>
          )}
          <div
            className="ex-q"
            style={{
              fontSize: 21,
              fontWeight: 900,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Nunito', sans-serif",
              color: '#1A0A3C',
            }}
          >
            <span>{exercise.q}</span>
            <button
              type="button"
              onClick={() => {
                try {
                  fedorTTS.speak(exercise.q.replace(/[\?¿=]/g, '').trim() || exercise.q);
                } catch {
                  // ignore
                }
              }}
              title="Escuchar enunciado"
              aria-label="Escuchar enunciado"
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '2px 6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              🔊
            </button>
          </div>
        </div>
      </div>

      {exercise.type === 'mcq' && (
        <div
          className="ex-mcq-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginTop: 18,
            width: '100%',
            maxWidth: '560px',
            margin: '18px auto 0',
          }}
        >
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
                  padding: '14px 18px',
                  borderRadius: 16,
                  fontWeight: 900,
                  fontSize: 18,
                  cursor: answered ? 'default' : 'pointer',
                  border: '2px solid #E0E7FF',
                  background: answered && isAns ? '#DCF5EE' : answered && isPick ? '#FAECE7' : '#FFFFFF',
                  color: answered && isAns ? '#065F46' : answered && isPick ? '#9F1239' : '#1E1B4B',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Nunito', sans-serif",
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
          {isGrade1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              {exercise.hint && !answered && (
                <div style={{ width: '100%', background: '#FFFDF0', border: '1.5px solid #FFEFA8', borderRadius: '12px', padding: '.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '.5rem' }}>
                  <span style={{ fontSize: '16px' }}>💡</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A5C00', textAlign: 'center' }}>
                    {exercise.hint}
                  </div>
                </div>
              )}
              
              <input
                type="number"
                className="finput"
                value={inputVal}
                disabled={answered}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitInput()}
                placeholder=""
                style={{ 
                  width: '140px', 
                  textAlign: 'center', 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  borderRadius: '12px',
                  border: '2px solid #6C28B4',
                  padding: '10px'
                }}
              />

              {/* Ver procedimiento button inside the centered layout */}
              {exercise.q && (
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                    color: '#fff',
                    border: '2px solid #fff',
                    borderRadius: '22px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 10px rgba(108,40,180,0.3)',
                    fontFamily: "'Nunito', sans-serif",
                    marginTop: '4px',
                    marginBottom: '4px'
                  }}
                >
                  💡 Ver procedimiento
                </button>
              )}

              <button 
                className="btn-primary" 
                disabled={answered} 
                onClick={submitInput}
                style={{
                  background: 'linear-gradient(135deg, #7B2FBE, #9B5CFF)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 36px',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: answered ? 'default' : 'pointer',
                  boxShadow: '0 4px 12px rgba(108,40,180,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: answered ? 0.6 : 1
                }}
              >
                ✅ Confirmar
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}

      {exercise.type === 'seq' && (
        <div style={{ marginTop: 14 }}>
          {isGrade1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {exercise.items.map((it, i) => {
                  const isLast = i === exercise.items.length - 1;
                  return (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {it.t === 'f' ? (
                        <span style={{ fontSize: '18px', fontWeight: 900, color: '#333' }}>{it.v}</span>
                      ) : (
                        <input
                          type="number"
                          className="finput"
                          disabled={answered}
                          value={seqVals[i] ?? ''}
                          onChange={(e) => setSeqVals((s) => ({ ...s, [i]: e.target.value }))}
                          placeholder="?"
                          style={{ 
                            width: '56px', 
                            textAlign: 'center', 
                            fontSize: '16px', 
                            fontWeight: 'bold', 
                            borderRadius: '10px',
                            border: '1.5px solid #6C28B4',
                            padding: '6px'
                          }}
                        />
                      )}
                      {!isLast && <span style={{ fontSize: '16px', color: '#6A20A8', fontWeight: 'bold' }}>→</span>}
                    </span>
                  );
                })}
              </div>

              {/* Ver procedimiento button inside the centered layout */}
              {exercise.q && (
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                    color: '#fff',
                    border: '2px solid #fff',
                    borderRadius: '22px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 10px rgba(108,40,180,0.3)',
                    fontFamily: "'Nunito', sans-serif",
                    marginTop: '4px',
                    marginBottom: '4px'
                  }}
                >
                  💡 Ver procedimiento
                </button>
              )}

              <button 
                className="btn-primary" 
                disabled={answered} 
                onClick={submitSeq}
                style={{
                  background: 'linear-gradient(135deg, #7B2FBE, #9B5CFF)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 36px',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: answered ? 'default' : 'pointer',
                  boxShadow: '0 4px 12px rgba(108,40,180,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: answered ? 0.6 : 1
                }}
              >
                ✅ Confirmar
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}

      {/* PROCEDURE BUTTON */}
      {exercise.q && (!isGrade1 || (exercise.type !== 'input' && exercise.type !== 'seq')) && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '22px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(108,40,180,0.3)',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            💡 Ver procedimiento
          </button>
        </div>
      )}

      {/* PROCEDURE MODAL */}
      {exercise.q && (
        <ProcedureModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          question={exercise.q}
          answer={exercise.type === 'seq' ? exercise.items.filter(it => it.t === 'b').map(it => it.a ?? '').join(', ') : (exercise as any).ans || ''}
          explainHtml={exercise.explain}
        />
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
  if (ex.type === 'mcq') return selected === ex.ans ? `✅ ¡Correcto! +${ex.pts} pts` : `❌ La respuesta es: ${ex.ans}`;
  if (ex.type === 'input')
    return inputVal.trim().toLowerCase() === ex.ans.trim().toLowerCase() ? `✅ ¡Correcto! +${ex.pts} pts` : `❌ La respuesta es: ${ex.ans}`;
  const blanks = ex.items.map((it, i) => ({ it, i })).filter(({ it }) => it.t === 'b');
  const ok = blanks.every(({ it, i }) => (seqVals[i] ?? '').trim() === (it.a ?? ''));
  return ok ? `✅ ¡Secuencia correcta! +${ex.pts} pts` : '❌ Revisa la secuencia';
}
