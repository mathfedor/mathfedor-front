'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ConteoModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Configuraciones de Conteo del HTML original ──
const CONT_GRANDES: Record<number, number> = {
  1000: 10000,
  5000: 50000,
  10000: 100000,
  50000: 1000000,
  100000: 1000000,
};

const CONT_OBJ: Record<number, string> = {
  1: '🍎',
  2: '🧦',
  3: '🍭',
  5: '✋',
  10: '✏️',
  20: '⚽',
  50: '🎈',
  100: '⭐',
};

// Formato colombiano de números (con punto de miles)
function fmt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function ConteoModal4to({ isOpen, onClose }: ConteoModal4toProps) {
  const [step, setStep] = useState<number>(3);
  const [jumpCount, setJumpCount] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Toca "Saltar" o los números del tablero');
  const [isAutoCounting, setIsAutoCounting] = useState<boolean>(false);
  const [clickedNumbers, setClickedNumbers] = useState<Set<number>>(new Set());

  // Estado del juego "¿Qué número sigue?"
  const [juegoActive, setJuegoActive] = useState<boolean>(false);
  const [juegoSerie, setJuegoSerie] = useState<number[]>([]);
  const [juegoAnswer, setJuegoAnswer] = useState<number>(0);
  const [juegoOpts, setJuegoOpts] = useState<number[]>([]);
  const [juegoSelected, setJuegoSelected] = useState<number | null>(null);

  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cálculos de paso y saltos N
  const isGrande = Boolean(CONT_GRANDES[step]);
  const N = isGrande ? CONT_GRANDES[step] / step : 10;
  const dx = 600 / N;

  // Audio helpers
  const playTono = (freq = 520) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  };

  const playAcierto = () => {
    playTono(600);
    setTimeout(() => playTono(800), 120);
  };

  const playError = () => {
    playTono(280);
    setTimeout(() => playTono(220), 120);
  };

  const hablar = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-CO';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch {}
  };

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const handleSelectStep = (newStep: number) => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    setIsAutoCounting(false);
    setStep(newStep);
    setJumpCount(0);
    setClickedNumbers(new Set());
    setJuegoActive(false);
    setStatusMsg('Toca "Saltar" o los números del tablero');
    playTono(480);
  };

  // Realizar un salto de la rana
  const handleSalto = (customJumpCount?: number) => {
    setJumpCount((prev) => {
      const next = typeof customJumpCount === 'number' ? customJumpCount : (prev >= N ? 1 : prev + 1);
      const val = step * next;
      setStatusMsg(`${fmt(step)} × ${next} = ${fmt(val)}`);
      hablar(String(val));
      playTono(520 + next * 20);
      return next;
    });
  };

  // Modo auto-conteo
  const handleAutoCount = () => {
    if (isAutoCounting) {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
      setIsAutoCounting(false);
      return;
    }

    setIsAutoCounting(true);
    let cur = 0;
    setJumpCount(0);
    handleSalto(1);
    cur = 1;

    autoTimerRef.current = setInterval(() => {
      cur += 1;
      if (cur > N) {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
        setIsAutoCounting(false);
        return;
      }
      handleSalto(cur);
    }, 900);
  };

  // Clic en números del tablero
  const handleNumberClick = (n: number) => {
    setClickedNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

    const isMultiple = n % step === 0;
    if (isMultiple) {
      setStatusMsg(`✅ ${fmt(n)} está en el conteo de ${fmt(step)} en ${fmt(step)}`);
      playTono(650);
    } else {
      setStatusMsg(`❌ ${fmt(n)} no está: ${fmt(n)} ÷ ${fmt(step)} no es exacta`);
      playTono(320);
    }
  };

  // Iniciar mini-juego "¿Qué número sigue?"
  const handleStartJuego = () => {
    const a = 1 + Math.floor(Math.random() * 10);
    const serie = [a * step, (a + 1) * step, (a + 2) * step];
    const answer = (a + 3) * step;

    const rawOpts = [
      answer,
      answer + step,
      Math.max(1, answer - step),
      answer + Math.max(1, Math.round(step / 2)),
    ];
    const uniqueOpts = Array.from(new Set(rawOpts)).sort(() => Math.random() - 0.5);

    setJuegoSerie(serie);
    setJuegoAnswer(answer);
    setJuegoOpts(uniqueOpts);
    setJuegoSelected(null);
    setJuegoActive(true);
    playTono(580);
  };

  const handleSelectOption = (opt: number) => {
    if (juegoSelected !== null) return;
    setJuegoSelected(opt);
    const isCorrect = opt === juegoAnswer;
    if (isCorrect) {
      playAcierto();
      hablar('¡Muy bien!');
      setTimeout(() => {
        handleStartJuego();
      }, 1100);
    } else {
      playError();
      setTimeout(() => {
        setJuegoSelected(null);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  // Cálculos para imágenes del HTML original
  const T = Math.min(100, Math.max(20, step * 10));
  const ob = CONT_OBJ[step] || '🍎';
  const cols = step >= 10 ? 10 : Math.min(10, step * Math.max(1, Math.floor(10 / step)));

  // Pills pequeñas (1 a 100)
  const smallPills = [
    { s: 1, c: '#7C3AED' },
    { s: 2, c: '#6D28D9' },
    { s: 3, c: '#4F46E5' },
    { s: 5, c: '#0EA5E9' },
    { s: 10, c: '#0891B2' },
    { s: 20, c: '#16876A' },
    { s: 50, c: '#E8650A' },
    { s: 100, c: '#BE185D' },
  ];

  // Pills grandes
  const bigPills = [
    { s: 1000, c: '#1E40AF', hasta: 10000 },
    { s: 5000, c: '#0F766E', hasta: 50000 },
    { s: 10000, c: '#B45309', hasta: 100000 },
    { s: 50000, c: '#9D174D', hasta: 1000000 },
    { s: 100000, c: '#3D1468', hasta: 1000000 },
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Estilos originales de public/cuarto/MatematicasDeFedor_4°.html */}
      <style>{`
        .t5-hero {
          border-radius: 18px;
          padding: 14px 16px;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #5C21A6, #8B3EDB);
        }
        .t5-hero h3 {
          font-family: 'Baloo 2', sans-serif;
          font-size: 22px;
          margin: 0 0 4px;
          color: #fff;
          font-weight: 900;
        }
        .t5-hero p {
          margin: 0;
          font-weight: 700;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.95) !important;
        }
        .t5-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 8px 0;
        }
        .t5-pill {
          border: none;
          border-radius: 14px;
          padding: 9px 14px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          transition: transform .12s, box-shadow .12s;
          white-space: nowrap;
        }
        .t5-pill:hover {
          transform: translateY(-2px);
        }
        .t5-pill.on {
          outline: 3px solid #FFE066;
          transform: scale(1.06);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
        }
        .t5-card {
          background: #FFFFFF;
          border: 2px solid #E4DCFA;
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 10px;
        }
        .t5-100 {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 3px;
          max-width: 430px;
          margin: 10px auto;
        }
        .t5-100 span {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          background: #FFFFFF;
          border: 1.5px solid #E4DCFA;
          font-weight: 900;
          font-size: 13px;
          color: #6B5E8A;
          transition: all .25s;
          cursor: pointer;
        }
        .t5-100 span:hover {
          border-color: #5C21A6;
          transform: scale(1.08);
        }
        .t5-100 span.on {
          background: linear-gradient(135deg, #FFB547, #FF8C2A) !important;
          color: #fff !important;
          border-color: #E8650A !important;
          transform: scale(1.08);
        }
        .fz-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
        }
        .fz-chip {
          min-width: 44px;
          padding: 6px 12px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 2px solid #D9CCFF;
          font-weight: 900;
          font-size: 13px;
          text-align: center;
          cursor: pointer;
          color: #3D1468;
          transition: all .15s;
        }
        .fz-chip:hover {
          border-color: #7C3AED;
        }
        .fz-chip.on {
          background: #FFE066 !important;
          border-color: #F5A524 !important;
          transform: scale(1.08);
        }
        .fz-btn {
          border: none;
          border-radius: 12px;
          padding: 9px 15px;
          font-weight: 900;
          font-size: 13.5px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          transition: transform .12s;
        }
        .fz-btn:hover {
          transform: translateY(-2px);
        }
        .fz-btn.g {
          background: linear-gradient(135deg, #16876A, #24C496);
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A);
        }
        .fz-btn.b {
          background: linear-gradient(135deg, #0E6BA8, #38BDF8);
        }
        .fz-msg {
          font-weight: 900;
          font-size: 13px;
          color: #3D1468;
          padding: 7px 14px;
          background: #FFFFFF;
          border-radius: 12px;
          border: 2px dashed #C5BFEE;
          min-height: 20px;
          display: inline-flex;
          align-items: center;
        }
        .fz-tip {
          font-size: 12px;
          font-weight: 800;
          color: #6B5E8A;
          margin-top: 8px;
          text-align: center;
        }
        .t5-q {
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          text-align: center;
          color: #3D1468;
          margin: 6px 0;
        }
        .t5-opts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          max-width: 420px;
          margin: 0 auto;
        }
        .t5-opts button {
          padding: 12px;
          border-radius: 14px;
          border: 2px solid #D9CCFF;
          background: #FFFFFF;
          font-size: 20px;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #3D1468;
        }
        .t5-opts button.ok {
          background: #6EE7B7 !important;
          border-color: #16876A !important;
          color: #064E3B !important;
        }
        .t5-opts button.no {
          background: #FCA5A5 !important;
          border-color: #C94B22 !important;
          color: #7F1D1D !important;
        }
      `}</style>

      {/* Tarjeta Modal Principal */}
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Encabezado Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 flex-shrink-0">
          <h2
            className="text-2xl font-black text-[#3D1468] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span>🔢</span>
            <span>Tablas de Conteo</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 rounded-full bg-[#F3EEFF] hover:bg-[#E9DEFF] text-[#5C21A6] font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo Scrollable con orden exacto de las imágenes de referencia */}
        <div className="overflow-y-auto pr-1 flex-1">
          {/* Banner Hero */}
          <div className="t5-hero">
            <h3>🔢 Contar de salto en salto</h3>
            <p>Elige de cuánto en cuánto quieres contar y mira cómo salta la rana.</p>
          </div>

          {/* Subtítulo 1: Con imágenes (hasta 100) */}
          <div style={{ fontWeight: 900, color: '#3D1468', fontSize: '13px', marginTop: '6px' }}>
            🖼️ Con imágenes (hasta 100)
          </div>
          <div className="t5-pills">
            {smallPills.map((p) => {
              const active = step === p.s;
              return (
                <button
                  key={p.s}
                  type="button"
                  id={`t5c${p.s}`}
                  onClick={() => handleSelectStep(p.s)}
                  className={`t5-pill ${active ? 'on' : ''}`}
                  style={{ background: p.c }}
                >
                  De {p.s} en {p.s}
                </button>
              );
            })}
          </div>

          {/* Subtítulo 2: Números grandes (sin imágenes) */}
          <div style={{ fontWeight: 900, color: '#3D1468', fontSize: '13px', marginTop: '6px' }}>
            🔢 Números grandes (sin imágenes)
          </div>
          <div className="t5-pills">
            {bigPills.map((p) => {
              const active = step === p.s;
              return (
                <button
                  key={p.s}
                  type="button"
                  id={`t5c${p.s}`}
                  onClick={() => handleSelectStep(p.s)}
                  className={`t5-pill ${active ? 'on' : ''}`}
                  style={{ background: p.c }}
                >
                  De {fmt(p.s)} en {fmt(p.s)} hasta {fmt(p.hasta)}
                </button>
              );
            })}
          </div>

          {/* Tarjeta 1: Recta numérica con la rana 🐸 */}
          <div className="t5-card" style={{ marginBottom: 10, background: '#FFFFFF' }}>
            <svg viewBox="0 0 640 120" width="100%" id="t5cSvg" className="overflow-visible select-none">
              <line x1="20" y1="85" x2="620" y2="85" stroke="#3D1468" strokeWidth="3" />
              {Array.from({ length: N + 1 }).map((_, i) => {
                const x = 20 + i * dx;
                const isReached = i <= jumpCount;
                const labelText = i === 0 ? '0' : isReached ? fmt(step * i) : '';
                return (
                  <g key={i}>
                    <line x1={x} y1="77" x2={x} y2="93" stroke="#3D1468" strokeWidth="2" />
                    <text
                      x={x}
                      y={N > 10 && i % 2 !== 0 ? 104 : 114}
                      fontSize={N > 10 ? 10 : 13}
                      fontWeight="900"
                      textAnchor="middle"
                      fill="#3D1468"
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}

              {/* Arcos de los saltos */}
              <g id="t5cJ">
                {Array.from({ length: jumpCount }).map((_, j) => {
                  const x0 = 20 + j * dx;
                  const x1 = x0 + dx;
                  const midX = x0 + dx / 2;
                  return (
                    <g key={j} className="animate-fadeIn">
                      <path
                        d={`M ${x0} 77 Q ${midX} 20 ${x1} 77`}
                        stroke="#16876A"
                        strokeWidth="3"
                        fill="none"
                      />
                      {N <= 10 && (
                        <text
                          x={midX}
                          y="32"
                          fontSize="12"
                          fontWeight="900"
                          textAnchor="middle"
                          fill="#16876A"
                        >
                          +{fmt(step)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Rana */}
              <text
                id="t5cFrog"
                x={20 + jumpCount * dx}
                y="70"
                fontSize="30"
                textAnchor="middle"
                className="transition-all duration-300"
              >
                🐸
              </text>
            </svg>
          </div>

          {/* Tarjeta 2: Cuenta con imágenes (si no es número grande) */}
          {!isGrande ? (
            <div className="t5-card" style={{ marginBottom: 10, background: '#FFFFFF' }}>
              <div style={{ fontWeight: 900, color: '#3D1468', marginBottom: 6 }}>
                🖼️ Cuenta con imágenes: cada imagen tiene su número
              </div>
              <div
                id="t5cImg"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, minmax(30px, 1fr))`,
                  gap: 4,
                  background: '#FFFFFF',
                }}
              >
                {Array.from({ length: T }).map((_, idx) => {
                  const e = idx + 1;
                  const fin = e % step === 0;
                  const isReached = e <= jumpCount * step;
                  return (
                    <div
                      key={e}
                      data-e={e}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 2,
                        borderRadius: 8,
                        background: isReached ? '#FFE8CC' : '#FFFFFF',
                        border: `2px solid ${fin ? '#E8650A' : '#EEE8FB'}`,
                      }}
                    >
                      <span style={{ fontSize: T > 50 ? '16px' : '20px', lineHeight: 1.1 }}>{ob}</span>
                      <b style={{ fontSize: '10px', color: fin ? '#E8650A' : '#6B5E8A' }}>{e}</b>
                    </div>
                  );
                })}
              </div>
              <div className="fz-tip">
                En naranja, los números del conteo de {step} en {step}.
              </div>
            </div>
          ) : (
            <div className="t5-card" style={{ background: '#FFFFFF', marginBottom: 10 }}>
              <div style={{ fontWeight: 900, color: '#3D1468', marginBottom: 6 }}>
                Conteo de {fmt(step)} en {fmt(step)} hasta {fmt(CONT_GRANDES[step])}
              </div>
              <div className="fz-chips" id="t5c100">
                {Array.from({ length: N }).map((_, idx) => {
                  const q = idx + 1;
                  const val = q * step;
                  const isReached = val <= jumpCount * step;
                  const isUserClicked = clickedNumbers.has(val);
                  return (
                    <span
                      key={val}
                      onClick={() => handleNumberClick(val)}
                      className={`fz-chip ${isReached || isUserClicked ? 'on' : ''}`}
                    >
                      {fmt(val)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tarjeta 3: Tablero de 100 números (Imagen 1) */}
          {!isGrande && (
            <div>
              {step <= 5 ? (
                <div className="t5-100" id="t5c100">
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const n = idx + 1;
                    const isMultiple = n % step === 0;
                    const isReached = n <= jumpCount * step && isMultiple;
                    const isUserClicked = clickedNumbers.has(n);
                    return (
                      <span
                        key={n}
                        data-n={n}
                        onClick={() => handleNumberClick(n)}
                        className={isReached || isUserClicked ? 'on' : ''}
                      >
                        {n}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="t5-100" id="t5c100">
                  {Array.from({ length: 20 }).map((_, idx) => {
                    const m = idx + 1;
                    const val = m * step;
                    const isReached = val <= jumpCount * step;
                    const isUserClicked = clickedNumbers.has(val);
                    return (
                      <span
                        key={val}
                        data-n={val}
                        onClick={() => handleNumberClick(val)}
                        style={{ fontSize: 11 }}
                        className={isReached || isUserClicked ? 'on' : ''}
                      >
                        {fmt(val)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Botones de acción y mensaje al final del tablero (Imagen 1) */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12, alignItems: 'center' }}>
            <button className="fz-btn g" onClick={() => handleSalto()}>
              🐸 Saltar +{fmt(step)}
            </button>
            <button className="fz-btn o" onClick={handleAutoCount}>
              ▶ {isAutoCounting ? 'Detener' : 'Contar solo'}
            </button>
            <button className="fz-btn b" onClick={handleStartJuego}>
              🎯 ¿Qué número sigue?
            </button>
            <span className="fz-msg" id="t5cM">
              {statusMsg}
            </span>
          </div>

          {/* Contenedor del juego ¿Qué número sigue? */}
          {juegoActive && (
            <div id="t5cJuego" style={{ marginTop: 10 }}>
              <div className="t5-q">
                {juegoSerie.map(fmt).join(', ')}, <span style={{ color: '#E8650A' }}>?</span>
              </div>
              <div className="t5-opts">
                {juegoOpts.map((o) => {
                  let cls = '';
                  if (juegoSelected !== null) {
                    if (o === juegoAnswer) cls = 'ok';
                    else if (o === juegoSelected) cls = 'no';
                  }
                  return (
                    <button
                      key={o}
                      className={cls}
                      onClick={() => handleSelectOption(o)}
                    >
                      {fmt(o)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
