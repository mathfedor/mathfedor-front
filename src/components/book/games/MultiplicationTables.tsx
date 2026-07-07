'use client';

import { useState, useEffect } from 'react';
import { bookAudio } from '@/services/book-audio.service';

interface RetoQ {
  a: number;
  b: number;
}

function randReto(table: number): RetoQ {
  return { a: table, b: 1 + Math.floor(Math.random() * 10) };
}

const EMOJIS = ['🍎', '🍊', '🍋', '🍓', '🍇', '🍒', '🍑', '🍐', '🥝', '🍌'];

const STYLE_SHEET = `
.tb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 4, 30, 0.85);
  backdrop-filter: blur(8px);
  z-index: 99990;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
}
.tb-card {
  background: #fff;
  border-radius: 22px;
  max-width: 600px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,0.55);
  display: flex;
  flex-direction: column;
}
.tb-head {
  background: linear-gradient(135deg, #FF1D4E, #F5C518);
  color: #fff;
  padding: 1.2rem 1.4rem;
  border-radius: 22px 22px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Baloo 2', sans-serif;
  font-weight: 900;
  font-size: 18px;
}
.tb-close-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.tb-close-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}
.tb-body {
  padding: 1.2rem 1.4rem;
  overflow-y: auto;
}
.tb-record-bar {
  background: #F0EDFF;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 800;
  color: #3D1054;
  font-size: 14px;
}
.tb-select-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 800;
  text-align: center;
}
.tb-selector {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 1rem;
}
.tb-num-btn {
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6C28B4, #9B5CFF);
  color: #fff;
  font-weight: 900;
  font-size: 22px;
  cursor: pointer;
  font-family: 'Baloo 2', sans-serif;
  min-height: 50px;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 12px rgba(108,40,180,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tb-num-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(108,40,180,0.5);
}
.tb-num-btn.active {
  background: linear-gradient(135deg, #16876A, #24C496);
  box-shadow: 0 6px 18px rgba(22,135,106,0.55);
}
.tb-mode-toggle {
  display: flex;
  gap: 6px;
  margin-bottom: 1rem;
  justify-content: center;
}
.tb-mode-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 14px;
  font-weight: 900;
  cursor: pointer;
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  color: #fff;
  min-height: 44px;
  background: #999;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.tb-mode-btn.active {
  background: linear-gradient(135deg, #16876A, #24C496);
  box-shadow: 0 6px 16px rgba(22,135,106,0.5);
}
.tb-table-display {
  background: linear-gradient(135deg, #FFF8DC, #FFE7C9);
  border: 3px solid #FF8C2A;
  border-radius: 14px;
  padding: 1rem;
  font-family: 'Baloo 2', sans-serif;
}
.tb-table-title {
  font-size: 24px;
  font-weight: 900;
  color: #7A3200;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Baloo 2', sans-serif;
}
.tb-table-tip {
  font-size: 12px;
  color: #7A3200;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.8rem;
  background: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1.5px solid #FFC58A;
}
.tb-row-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-left: 5px solid #FF8C2A;
  transition: transform 0.15s;
}
.tb-row-line:hover {
  transform: translateX(4px);
}
.tb-row-math {
  flex-shrink: 0;
  min-width: 90px;
  font-size: 18px;
  font-weight: 900;
  color: #7A3200;
  font-family: 'Baloo 2', sans-serif;
}
.tb-row-grid {
  flex: 1;
  background: #FFF8DC;
  border: 2px dashed #FF8C2A;
  border-radius: 8px;
  padding: 6px;
  max-width: 340px;
}
.tb-row-res {
  flex-shrink: 0;
  font-size: 30px;
  font-weight: 900;
  color: #FF1D4E;
  font-family: 'Baloo 2', sans-serif;
  min-width: 50px;
  text-align: right;
}
.tb-reto-score {
  display: flex;
  justify-content: space-around;
  background: #F0EDFF;
  padding: 10px;
  border-radius: 10px;
  font-weight: 900;
  color: #3D1054;
  margin-bottom: 0.8rem;
  font-size: 14px;
}
.tb-reto-card {
  background: linear-gradient(135deg, #FFF, #FFF8DC);
  border: 4px solid #F5C518;
  border-radius: 14px;
  padding: 1.4rem;
  text-align: center;
  margin: 1rem 0;
}
.tb-reto-q {
  font-size: 48px;
  font-weight: 900;
  color: #3D1054;
  font-family: 'Baloo 2', sans-serif;
  margin-bottom: 0.8rem;
}
.tb-reto-input {
  width: 100%;
  max-width: 180px;
  padding: 14px;
  font-size: 30px;
  font-weight: 900;
  text-align: center;
  border: 3px solid #6C28B4;
  border-radius: 14px;
  font-family: 'Baloo 2', sans-serif;
  color: #3D1054;
}
.tb-reto-input:focus {
  outline: none;
  border-color: #F5C518;
  box-shadow: 0 0 0 4px rgba(245, 197, 24, 0.3);
}
.tb-fb {
  padding: 12px;
  border-radius: 12px;
  margin-top: 0.6rem;
  font-weight: 900;
  text-align: center;
  font-size: 16px;
}
.tb-fb.ok {
  background: #DCF5EE;
  color: #074F3A;
  border: 2px solid #16876A;
}
.tb-fb.bad {
  background: #FBE4E9;
  color: #7A1B00;
  border: 2px solid #A30041;
}
`;

export default function MultiplicationTables({ onReward, onClose }: { onReward: (coins: number) => void; onClose: () => void }) {
  const [table, setTable] = useState(5);
  const [mode, setMode] = useState<'practica' | 'reto'>('practica');
  const [q, setQ] = useState<RetoQ>(() => randReto(5));
  const [val, setVal] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);

  // Persistent record tracker
  const [record, setRecord] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const v = localStorage.getItem('fedor1_tablas_score');
        if (v) return JSON.parse(v);
      } catch (e) {}
    }
    return { bestScore: 0, totalCorrect: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem('fedor1_tablas_score', JSON.stringify(record));
    } catch (e) {}
  }, [record]);

  const startReto = (t: number) => {
    setMode('reto');
    setScore(0);
    setStreak(0);
    setQ(randReto(t));
    setVal('');
    setFb(null);
  };

  const checkReto = () => {
    const v = parseInt(val, 10);
    if (Number.isNaN(v)) return;

    if (v === q.a * q.b) {
      const newScore = score + 10;
      setScore(newScore);
      setStreak((s) => s + 1);

      setRecord((prev: any) => {
        const next = {
          bestScore: Math.max(prev.bestScore, newScore),
          totalCorrect: (prev.totalCorrect || 0) + 1,
        };
        return next;
      });

      onReward(5);
      bookAudio.correct();
      setFb({ msg: `🎉 ¡Correcto! +10 puntos`, ok: true });

      // Trigger confetti if they got it right
      if (typeof window !== 'undefined') {
        const anyWin = window as any;
        if (typeof anyWin.kjConfetti === 'function') {
          anyWin.kjConfetti(25);
        } else if (typeof anyWin.confetti === 'function') {
          anyWin.confetti();
        }
      }

      setTimeout(() => {
        setQ(randReto(table));
        setVal('');
        setFb(null);
      }, 1300);
    } else {
      setStreak(0);
      bookAudio.wrong();
      setFb({ msg: `❌ No. La respuesta es ${q.a * q.b} (${q.a} × ${q.b})`, ok: false });
    }
  };

  const emoji = EMOJIS[(table - 1) % EMOJIS.length];

  return (
    <div className="tb-overlay" onClick={onClose}>
      <style>{STYLE_SHEET}</style>
      <div className="tb-card" onClick={(e) => e.stopPropagation()}>
        <div className="tb-head">
          <span>🎯 Tablas de Multiplicar — Aprende Jugando</span>
          <button className="tb-close-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="tb-body">
          {/* Record Bar */}
          <div className="tb-record-bar">
            <b>🏆 Tu récord:</b> {record.bestScore} puntos · <b>✅ Aciertos totales:</b> {record.totalCorrect || 0}
          </div>

          <div className="tb-select-title">Elige una tabla:</div>

          {/* Selector 1-10 */}
          <div className="tb-selector">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
              <button
                key={i}
                type="button"
                className={`tb-num-btn${table === i ? ' active' : ''}`}
                onClick={() => {
                  setTable(i);
                  if (mode === 'reto') startReto(i);
                }}
              >
                {i}
              </button>
            ))}
          </div>

          {/* Mode Toggle */}
          <div className="tb-mode-toggle">
            <button
              type="button"
              className={`tb-mode-btn${mode === 'practica' ? ' active' : ''}`}
              onClick={() => setMode('practica')}
            >
              📖 Práctica
            </button>
            <button
              type="button"
              className={`tb-mode-btn${mode === 'reto' ? ' active' : ''}`}
              onClick={() => startReto(table)}
            >
              ⚡ Reto rápido
            </button>
          </div>

          {mode === 'practica' ? (
            // --- PRACTICE VIEW ---
            <div className="tb-table-display">
              <div className="tb-table-title">📚 TABLA DEL {table}</div>
              <div className="tb-table-tip">
                💡 Cada fila tiene <b>{table}</b> {emoji}, el total es la suma de todas las filas.
              </div>

              {Array.from({ length: 10 }, (_, index) => {
                const n = index + 1;
                const result = table * n;
                return (
                  <div className="tb-row-line" key={n}>
                    <div className="tb-row-math">{table} × {n}</div>
                    <div className="tb-row-grid">
                      {Array.from({ length: n }).map((_, rIdx) => (
                        <div key={rIdx} style={{ display: 'flex', gap: 3, justifyContent: 'flex-start', flexWrap: 'wrap', margin: '2px 0' }}>
                          {Array.from({ length: table }).map((_, cIdx) => (
                            <span key={cIdx} style={{ fontSize: 18, lineHeight: 1 }}>
                              {emoji}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="tb-row-res">= {result}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            // --- RETO RAPIDO VIEW ---
            <div>
              <div className="tb-reto-score">
                <div>🏆 Puntos: <span>{score}</span></div>
                <div>🔥 Racha: <span>{streak}</span></div>
                <div>📚 Tabla: {table}</div>
              </div>

              <div className="tb-reto-card">
                <div style={{ fontSize: 13, color: '#666', marginBottom: '0.4rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                  ¿CUÁNTO ES?
                </div>
                <div className="tb-reto-q">{q.a} × {q.b}</div>
                <input
                  type="number"
                  inputMode="numeric"
                  className="tb-reto-input"
                  value={val}
                  onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && checkReto()}
                  placeholder="?"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="tb-num-btn"
                  onClick={checkReto}
                  style={{ margin: '0.8rem auto 0 auto', background: 'linear-gradient(135deg,#16876A,#24C496)', maxWidth: 200, width: '100%' }}
                >
                  ✓ COMPROBAR
                </button>

                {fb && (
                  <div className={`tb-fb ${fb.ok ? 'ok' : 'bad'}`}>
                    {fb.msg}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="tb-num-btn"
                onClick={() => setMode('practica')}
                style={{ background: '#999', width: '100%' }}
              >
                ← Volver a Práctica
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
