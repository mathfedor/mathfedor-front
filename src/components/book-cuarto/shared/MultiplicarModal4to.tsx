'use client';

import React, { useState, useEffect } from 'react';

interface MultiplicarModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiplicarModal4to({ isOpen, onClose }: MultiplicarModal4toProps) {
  const [tableNum, setTableNum] = useState<number>(2); // Tabla seleccionada (1 a 12)
  const [multiplier, setMultiplier] = useState<number>(3); // Deslizador/fila (1 a 12)
  const [isPitagoras, setIsPitagoras] = useState<boolean>(false);
  const [pitHover, setPitHover] = useState<{ r: number; c: number } | null>(null);

  // Modo práctica (quiz)
  const [practicing, setPracticing] = useState<boolean>(false);
  const [quizK, setQuizK] = useState<number>(3);
  const [quizOpts, setQuizOpts] = useState<number[]>([]);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

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

  const handleSelectTable = (n: number) => {
    setTableNum(n);
    setMultiplier(3);
    setIsPitagoras(false);
    setPracticing(false);
    playTono(480);
  };

  const handleSliderChange = (k: number) => {
    setMultiplier(k);
    playTono(380 + k * 25);
  };

  // Escuchar toda la tabla con voz
  const handleEscucharTabla = () => {
    const frases: string[] = [];
    for (let i = 1; i <= 10; i++) {
      frases.push(`${tableNum} por ${i}, ${tableNum * i}`);
    }
    hablar(frases.join('. '));
  };

  // Iniciar práctica
  const handleStartPractica = () => {
    const k = 1 + Math.floor(Math.random() * 12);
    const ok = tableNum * k;
    const rawOpts = [
      ok,
      ok + tableNum,
      Math.max(1, ok - tableNum),
      ok + 1,
      ok + 2 * tableNum,
    ];
    const uniqueOpts = Array.from(new Set(rawOpts))
      .slice(0, 4)
      .sort(() => Math.random() - 0.5);

    setQuizK(k);
    setQuizOpts(uniqueOpts);
    setQuizSelected(null);
    setPracticing(true);
    playTono(580);
  };

  const handleSelectQuizOption = (val: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(val);
    const isCorrect = val === tableNum * quizK;
    if (isCorrect) {
      playAcierto();
      hablar('¡Muy bien!');
      setMultiplier(quizK);
      setTimeout(() => {
        handleStartPractica();
      }, 1100);
    } else {
      playError();
      setTimeout(() => {
        setQuizSelected(null);
      }, 900);
    }
  };

  if (!isOpen) return null;

  // Tamaño de los círculos visuales según n y k
  const dz = Math.max(12, Math.min(22, Math.floor(210 / Math.max(tableNum, multiplier))));

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Estilos originales del HTML MatematicasDeFedor_4°.html */}
      <style>{`
        .t5-hero {
          border-radius: 18px;
          padding: 14px 18px;
          color: #fff;
          margin-bottom: 10px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #E8650A, #F5A524);
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
          flex-wrap: nowrap;
          gap: 6px;
          margin: 6px 0;
          align-items: center;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }
        .t5-pills::-webkit-scrollbar {
          display: none;
        }
        .t5-pill {
          border: none;
          border-radius: 14px;
          padding: 8px 13px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          transition: transform .12s, box-shadow .12s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .t5-pill:hover {
          transform: translateY(-2px);
        }
        .t5-pill.on {
          outline: 3px solid #FFE066;
          transform: scale(1.06);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        .t5-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: center;
          margin: 8px 0;
        }
        .t5-card {
          background: #FFFFFF;
          border: 2px solid #E4DCFA;
          border-radius: 18px;
          padding: 16px 20px;
        }
        .t5-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          min-width: 280px;
        }
        .t5-list button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          border-radius: 12px;
          background: #FFF7E6;
          border: 1.5px solid #FBD38D;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          color: #1A1033;
          transition: all .15s;
          min-width: 135px;
        }
        .t5-list button span {
          color: #1A1033;
        }
        .t5-list button:hover {
          border-color: #E8650A;
          transform: scale(1.02);
        }
        .t5-list button.on {
          background: #FF8C2A !important;
          color: #FFFFFF !important;
          border-color: #E8650A !important;
          transform: scale(1.03);
          box-shadow: 0 3px 10px rgba(255, 140, 42, 0.35);
        }
        .t5-list button.on span {
          color: #FFFFFF !important;
        }
        .t5-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 220px;
          height: 6px;
          border-radius: 3px;
          outline: none;
          margin-top: 10px;
          transition: background 0.1s;
        }
        .t5-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0084FF;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 132, 255, 0.45);
          cursor: pointer;
          transition: transform .1s;
        }
        .t5-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .fz-btn {
          border: none;
          border-radius: 14px;
          padding: 10px 22px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          transition: transform .12s;
        }
        .fz-btn:hover {
          transform: translateY(-2px);
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A);
        }
        .fz-btn.w {
          background: #FFFFFF;
          color: #5C21A6 !important;
          border: 2px solid #C5BFEE;
          box-shadow: none;
        }
        .t5-pit {
          display: grid;
          grid-template-columns: repeat(13, 1fr);
          gap: 2px;
          max-width: 560px;
          margin: 0 auto;
        }
        .t5-pit span {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          border-radius: 5px;
          background: #FFFFFF;
          border: 1px solid #EEE8FB;
          cursor: pointer;
          color: #3D1468;
          transition: all .15s;
        }
        .t5-pit span.h {
          background: #5C21A6 !important;
          color: #fff !important;
        }
        .t5-pit span.r {
          background: #FFE8CC !important;
        }
        .t5-pit span.x {
          background: #FF8C2A !important;
          color: #fff !important;
          transform: scale(1.18);
          z-index: 2;
        }
      `}</style>

      {/* Tarjeta Modal Principal */}
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Encabezado Modal (Idéntico a Imagen 2) */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h2
            className="text-2xl font-black text-[#3D1468] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span className="text-2xl">✖️</span>
            <span>Tablas de Multiplicar</span>
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

        {/* Cuerpo del Modal (Todo visible armónicamente como en la Imagen 2) */}
        <div className="overflow-y-auto pr-1 flex-1">
          {/* Banner Hero */}
          <div className="t5-hero">
            <h3>✖️ Tablas de multiplicar</h3>
            <p>Mueve la barra y mira cómo crece el arreglo. Multiplicar es sumar filas iguales.</p>
          </div>

          {/* Fila de píldoras ×1 a ×12 (En una sola fila como en la Imagen 2) */}
          <div className="t5-pills">
            {Array.from({ length: 12 }).map((_, i) => {
              const n = i + 1;
              const active = !isPitagoras && tableNum === n;
              const bg = `hsl(${20 + n * 25}, 75%, 45%)`;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleSelectTable(n)}
                  className={`t5-pill ${active ? 'on' : ''}`}
                  style={{ background: bg }}
                >
                  ×{n}
                </button>
              );
            })}
          </div>

          {/* Botón Tabla Pitagórica */}
          <div style={{ margin: '6px 0 10px 0' }}>
            <button
              type="button"
              onClick={() => {
                setIsPitagoras(true);
                setPracticing(false);
                playTono(420);
              }}
              className={`t5-pill ${isPitagoras ? 'on' : ''}`}
              style={{ background: '#3D1468' }}
            >
              🔲 Tabla pitagórica
            </button>
          </div>

          {/* VISTA 1: Arreglo Visual + Lista de la Tabla (Imagen 2) */}
          {!isPitagoras ? (
            <div>
              <div className="t5-row">
                {/* Tarjeta Izquierda: Visualización Gráfica + Deslizador */}
                <div
                  className="t5-card"
                  style={{
                    textAlign: 'center',
                    minWidth: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '270px',
                  }}
                >
                  {/* Contenedor de puntos arreglados (caja crema amplia como Imagen 2) */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '260px',
                      minHeight: '125px',
                      background: '#FFF7E6',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px 18px',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${tableNum}, ${dz}px)`,
                        gap: '6px',
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Array.from({ length: multiplier }).map((_, r) =>
                        Array.from({ length: tableNum }).map((_, c) => (
                          <span
                            key={`${r}-${c}`}
                            style={{
                              width: `${dz}px`,
                              height: `${dz}px`,
                              borderRadius: '50%',
                              background: `hsl(${20 + r * 25}, 80%, 55%)`,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Slider de control (1 al 12) con barra rellena azul como Imagen 2 */}
                  {(() => {
                    const sliderPct = ((multiplier - 1) / 11) * 100;
                    return (
                      <input
                        type="range"
                        min={1}
                        max={12}
                        value={multiplier}
                        onChange={(e) => handleSliderChange(Number(e.target.value))}
                        className="t5-slider"
                        style={{
                          background: `linear-gradient(to right, #0084FF 0%, #0084FF ${sliderPct}%, #E2E8F0 ${sliderPct}%, #E2E8F0 100%)`,
                        }}
                      />
                    );
                  })()}

                  {/* Fórmula destacada */}
                  <div
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontSize: '26px',
                      fontWeight: 900,
                      color: '#1A1033',
                      marginTop: '8px',
                    }}
                  >
                    <span>{multiplier} {multiplier === 1 ? 'fila' : 'filas'} de {tableNum} = </span>
                    <span style={{ color: '#E8650A' }}>{tableNum * multiplier}</span>
                  </div>
                </div>

                {/* Tarjeta Derecha: Lista en 2 Columnas (1 a 12 en orden natural como la Imagen 2) */}
                <div className="t5-list">
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const i = idx + 1;
                    const active = multiplier === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSliderChange(i)}
                        className={active ? 'on' : ''}
                      >
                        <span>{tableNum} × {i}</span>
                        <span>{tableNum * i}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botones de acción inferiores (Imagen 2) */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleStartPractica}
                  className="fz-btn o"
                >
                  🎯 Practicar la tabla del {tableNum}
                </button>
                <button
                  type="button"
                  onClick={handleEscucharTabla}
                  className="fz-btn w"
                >
                  🔊 Escuchar la tabla
                </button>
              </div>

              {/* Cuestionario Interactivo al practicar */}
              {practicing && (
                <div
                  className="t5-card animate-fadeIn"
                  style={{
                    marginTop: '12px',
                    textAlign: 'center',
                    background: '#FFF9EB',
                    borderColor: '#FBD38D',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontSize: '26px',
                      fontWeight: 900,
                      color: '#3D1468',
                      marginBottom: '8px',
                    }}
                  >
                    <span>{tableNum} × {quizK} = </span>
                    <span style={{ color: '#E8650A' }}>?</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
                    {quizOpts.map((opt) => {
                      let btnBg = '#FFFFFF';
                      let btnBorder = '#D9CCFF';
                      let btnColor = '#3D1468';
                      if (quizSelected !== null) {
                        if (opt === tableNum * quizK) {
                          btnBg = '#6EE7B7';
                          btnBorder = '#16876A';
                          btnColor = '#064E3B';
                        } else if (opt === quizSelected) {
                          btnBg = '#FCA5A5';
                          btnBorder = '#C94B22';
                          btnColor = '#7F1D1D';
                        }
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectQuizOption(opt)}
                          style={{
                            padding: '10px',
                            borderRadius: '12px',
                            border: `2px solid ${btnBorder}`,
                            background: btnBg,
                            color: btnColor,
                            fontSize: '18px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            fontFamily: 'Nunito',
                            transition: 'all .15s',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* VISTA 2: Tabla Pitagórica (13×13) */
            <div style={{ marginTop: '10px' }}>
              <div className="t5-pit">
                {Array.from({ length: 13 }).map((_, r) =>
                  Array.from({ length: 13 }).map((_, c) => {
                    const isHeader = r === 0 || c === 0;
                    const isSelected = pitHover && pitHover.r === r && pitHover.c === c;
                    const isInArea = pitHover && r > 0 && c > 0 && r <= pitHover.r && c <= pitHover.c;

                    let cls = '';
                    if (isHeader) cls = 'h';
                    else if (isSelected) cls = 'x';
                    else if (isInArea) cls = 'r';

                    const text = r === 0 && c === 0 ? '×' : r === 0 ? c : c === 0 ? r : r * c;

                    return (
                      <span
                        key={`${r}-${c}`}
                        className={cls}
                        onMouseEnter={() => {
                          if (r > 0 && c > 0) setPitHover({ r, c });
                        }}
                        onClick={() => {
                          if (r > 0 && c > 0) {
                            setPitHover({ r, c });
                            hablar(`${r} por ${c} es ${r * c}`);
                            playTono(500);
                          }
                        }}
                      >
                        {text}
                      </span>
                    );
                  })
                )}
              </div>
              <div
                style={{
                  marginTop: '10px',
                  textAlign: 'center',
                  fontWeight: 900,
                  fontSize: '13.5px',
                  color: '#3D1468',
                  padding: '8px 14px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '2px dashed #C5BFEE',
                }}
              >
                {pitHover
                  ? `${pitHover.r} × ${pitHover.c} = ${pitHover.r * pitHover.c}  (un rectángulo de ${pitHover.r} filas y ${pitHover.c} columnas)`
                  : 'Pasa el dedo o el ratón por la tabla'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
