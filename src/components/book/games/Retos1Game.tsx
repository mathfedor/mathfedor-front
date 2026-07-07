'use client';

import { useState, useEffect } from 'react';

export const RETOS_EXERCISES = [
  { q: "¿Cuántos números pares hay entre 1 y 10?", opts: ["3", "4", "5", "6"], ans: "5", cat: "Pares", hint: "Pares: 2, 4, 6, 8, 10.", pts: 80 },
  { q: "¿Cuántos números impares hay entre 1 y 10?", opts: ["3", "4", "5", "6"], ans: "5", cat: "Impares", hint: "Impares: 1, 3, 5, 7, 9.", pts: 80 },
  { q: "¿Cuánto es 5 + 6?", opts: ["10", "11", "12", "9"], ans: "11", cat: "Suma", hint: "5 más 5 = 10, luego +1.", pts: 80 },
  { q: "¿Cuál es el número antes del 20?", opts: ["18", "19", "21", "22"], ans: "19", cat: "Antes", hint: "Resta 1 a 20.", pts: 80 },
  { q: "¿Cuál es el número después del 19?", opts: ["20", "18", "21", "22"], ans: "20", cat: "Después", hint: "Suma 1 a 19.", pts: 80 },
  { q: "Si tengo 7 manzanas y como 3, ¿cuántas me quedan?", opts: ["3", "4", "5", "10"], ans: "4", cat: "Resta", hint: "7 - 3 = 4.", pts: 90 },
  { q: "Si tengo 3 cajas con 4 dulces cada una, ¿cuántos dulces tengo?", opts: ["7", "10", "12", "16"], ans: "12", cat: "Multiplicación", hint: "3 x 4 = 12.", pts: 90 },
  { q: "Reparto 12 galletas entre 4 niños por igual. ¿Cuántas recibe cada uno?", opts: ["2", "3", "4", "6"], ans: "3", cat: "División", hint: "12 ÷ 4 = 3.", pts: 90 },
  { q: "¿Cuánto es 8 + 7?", opts: ["13", "14", "15", "16"], ans: "15", cat: "Suma", hint: "8 + 2 = 10, luego +5.", pts: 90 },
  { q: "¿Cuánto es 10 - 4?", opts: ["5", "6", "7", "4"], ans: "6", cat: "Resta", hint: "10 - 4 = 6.", pts: 90 },
  { q: "¿Cuántas decenas hay en el número 40?", opts: ["2", "3", "4", "5"], ans: "4", cat: "Decenas", hint: "40 = 4 decenas.", pts: 100 },
  { q: "¿Cuántas decenas hay en 70?", opts: ["5", "6", "7", "8"], ans: "7", cat: "Decenas", hint: "70 = 7 decenas.", pts: 100 },
  { q: "¿Cuántas unidades tiene una centena?", opts: ["10", "100", "1000", "50"], ans: "100", cat: "Centena", hint: "1 centena = 100 unidades.", pts: 100 },
  { q: "¿Cuál es el número MAYOR? 23 o 32", opts: ["23", "32", "Iguales", "No sé"], ans: "32", cat: "Mayor", hint: "Compara las decenas.", pts: 100 },
  { q: "¿Cuál es el número MENOR? 45 o 54", opts: ["45", "54", "Iguales", "No sé"], ans: "45", cat: "Menor", hint: "Compara las decenas.", pts: 100 },
  { q: "¿Cuántos lados tiene un triángulo?", opts: ["2", "3", "4", "5"], ans: "3", cat: "Geometría", hint: "Tri = 3.", pts: 110 },
  { q: "¿Cuántos lados tiene un cuadrado?", opts: ["3", "4", "5", "6"], ans: "4", cat: "Geometría", hint: "Cuatro lados iguales.", pts: 110 },
  { q: "Hay 6 patos en el lago. Llegan 4 más. ¿Cuántos hay ahora?", opts: ["8", "9", "10", "11"], ans: "10", cat: "Problema", hint: "Suma: 6 + 4.", pts: 110 },
  { q: "Hay 15 globos. Se pinchan 7. ¿Cuántos quedan?", opts: ["7", "8", "9", "10"], ans: "8", cat: "Problema", hint: "Resta: 15 - 7.", pts: 110 },
  { q: "Compré 4 paquetes con 5 chicles cada uno. ¿Cuántos chicles tengo?", opts: ["15", "20", "25", "9"], ans: "20", cat: "Problema", hint: "Multiplica: 4 x 5.", pts: 110 }
];

export default function Retos1Game({ onReward, onClose }: { onReward: (coins: number) => void; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [exIdx, setExIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [feedback, setFeedback] = useState<'ok' | 'bad' | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const currentEx = RETOS_EXERCISES[exIdx];

  useEffect(() => {
    if (!isPlaying || finished || feedback) return;
    if (timeLeft <= 0) {
      handleAnswer('');
      return;
    }
    const tm = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(tm);
  }, [isPlaying, timeLeft, finished, feedback]);

  const handleAnswer = (opt: string) => {
    setSelectedOpt(opt);
    const isOk = opt === currentEx.ans;
    if (isOk) {
      setFeedback('ok');
      setScore((s) => s + currentEx.pts);
      setCorrectCount((c) => c + 1);
    } else {
      setFeedback('bad');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOpt(null);
      setTimeLeft(15);
      if (exIdx + 1 < RETOS_EXERCISES.length) {
        setExIdx((i) => i + 1);
      } else {
        setFinished(true);
        if (correctCount + (isOk ? 1 : 0) >= 14) {
          onReward(15);
        }
      }
    }, 1200);
  };

  const restart = () => {
    setExIdx(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(15);
    setFinished(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="mg-overlay" onClick={onClose} style={{ zIndex: 9900 }}>
        <div className="mg-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
          <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
          <div className="mg-head" style={{ marginBottom: '1.2rem' }}>
            <div style={{ fontSize: 48 }}>🎯</div>
            <div className="mg-title" style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 24, fontWeight: 900, color: '#7A1B00' }}>Retos Matemáticos</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>20 preguntas a contrarreloj</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg,#FAECE7,#F5C7B8)', borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, color: '#7A1B00', marginBottom: '.75rem' }}>
              Responde las preguntas antes de que se acabe el tiempo. ¡Consigue 14 correctas para ganar monedas!
            </div>
            <button
              onClick={() => setIsPlaying(true)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg,#FF8A1F,#FFB066)',
                color: '#fff',
                fontWeight: 900,
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255,138,31,.3)'
              }}
            >
              🚀 ¡Empezar retos!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const passed = correctCount >= 14;
    return (
      <div className="mg-overlay" onClick={onClose} style={{ zIndex: 9900 }}>
        <div className="mg-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
          <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
          <div className="mg-head">
            <div style={{ fontSize: 52 }}>{passed ? '🏆' : '🔄'}</div>
            <div className="mg-title" style={{ fontSize: 22, fontWeight: 900, color: '#7A1B00' }}>{passed ? '¡Felicidades!' : 'Sigue practicando'}</div>
          </div>
          <div style={{ margin: '1rem 0', fontWeight: 800 }}>
            <div>Acertaste: <span style={{ color: '#C94B22' }}>{correctCount} / {RETOS_EXERCISES.length}</span></div>
            <div>Puntaje total: <span style={{ color: '#074F3A' }}>{score} pts</span></div>
            {passed ? (
              <div style={{ color: '#074F3A', marginTop: '.5rem' }}>🎉 ¡Has ganado +15 🪙!</div>
            ) : (
              <div style={{ color: 'var(--muted)', marginTop: '.5rem', fontSize: 13 }}>Necesitas 14 aciertos para el premio.</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={restart} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: '#F5C518', fontWeight: 900, cursor: 'pointer' }}>Repetir</button>
            <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: '2px solid var(--border)', background: '#fff', fontWeight: 900, cursor: 'pointer' }}>Salir</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mg-overlay" onClick={onClose} style={{ zIndex: 9900 }}>
      <div className="mg-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ background: '#FAEEDA', color: '#7A3200', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 900 }}>
            Pregunta {exIdx + 1}/{RETOS_EXERCISES.length}
          </div>
          <div style={{ background: timeLeft <= 5 ? '#FEE2E8' : '#E8F5FF', color: timeLeft <= 5 ? '#A30041' : '#0E6BA8', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 900 }}>
            ⏱️ {timeLeft}s
          </div>
          <div style={{ background: '#DCF5EE', color: '#074F3A', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 900 }}>
            {score} pts
          </div>
        </div>

        <div style={{ height: 6, background: '#EEE', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ height: '100%', width: `${((exIdx + 1) / RETOS_EXERCISES.length) * 100}%`, background: 'linear-gradient(90deg,#FF8A1F,#FFB066)' }} />
        </div>

        <div style={{ background: '#FFF8E0', borderLeft: '5px solid #FFB066', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 900, color: '#1A0848', textAlign: 'left', marginBottom: 14 }}>
          {currentEx.q}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {currentEx.opts.map((opt) => {
            let bg = '#fff';
            let color = '#7A3200';
            let border = '2px solid #F5C518';

            if (selectedOpt === opt) {
              if (feedback === 'ok') {
                bg = '#16876A';
                color = '#fff';
                border = '2px solid #0E5240';
              } else if (feedback === 'bad') {
                bg = '#C94B22';
                color = '#fff';
                border = '2px solid #7A1B00';
              }
            } else if (feedback && opt === currentEx.ans) {
              bg = '#16876A';
              color = '#fff';
              border = '2px solid #0E5240';
            }

            return (
              <button
                key={opt}
                onClick={() => !feedback && handleAnswer(opt)}
                disabled={!!feedback}
                style={{
                  background: bg,
                  color,
                  border,
                  padding: '12px 10px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: feedback ? 'default' : 'pointer',
                  fontFamily: 'Nunito, sans-serif'
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
