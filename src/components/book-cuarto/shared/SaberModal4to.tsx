'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useBook4 } from '../context/Book4Context';
import saberDataRaw from './saber4to-data.json';

interface SaberModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SaberExercise {
  id: string;
  tema: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  formula?: string;
}

interface SaberLevelPool {
  level: number;
  count: number;
  pool: SaberExercise[];
}

const SABER_POOLS = saberDataRaw as SaberLevelPool[];

const LEVEL_CONFIGS = [
  { nivel: 1, time: 90, color: '#14B8A6', label: 'Nivel 1 · ⏱ 90s' },
  { nivel: 2, time: 90, color: '#3B82F6', label: 'Nivel 2 · ⏱ 90s' },
  { nivel: 3, time: 120, color: '#F97316', label: 'Nivel 3 · ⏱ 120s' },
  { nivel: 4, time: 150, color: '#7C3AED', label: 'Nivel 4 · ⏱ 150s' },
  { nivel: 5, time: 180, color: '#EC4899', label: 'Nivel 5 · ⏱ 180s' },
];

const PEN_COLORS = ['#5C21A6', '#E8650A', '#16876A', '#1E40AF', '#C94B22'];

// Helper para extraer datos numéricos del enunciado
function extractDatos(text: string): string[] {
  const matches =
    text.match(/\$?\s?\d{1,3}(?:\.\d{3})+(?:,\d+)?\s*%?|\$?\s?\d+(?:,\d+)?(?:\s*\/\s*\d+)?\s*%?|«[^»]+»/g) || [];
  return matches
    .map((m) => m.trim().replace(/[°º]/g, ''))
    .filter((m, i, arr) => m && arr.indexOf(m) === i)
    .slice(0, 8);
}

// Helper para barajar aleatoriamente preguntas
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SaberModal4to({ isOpen, onClose }: SaberModal4toProps) {
  const { updateStats } = useBook4();

  const [activeNivelIdx, setActiveNivelIdx] = useState<number | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<SaberExercise[]>([]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [totalTime, setTotalTime] = useState<number>(90);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});

  // Estado de la Pizarra de Apoyo
  const [pizarraOpen, setPizarraOpen] = useState<boolean>(true);
  const [selectedChips, setSelectedChips] = useState<Record<string, boolean>>({});
  const [penColor, setPenColor] = useState<string>('#5C21A6');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar mejores puntajes guardados
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor4_saber_scores');
      if (saved) {
        setBestScores(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Control del cronómetro
  useEffect(() => {
    if (activeNivelIdx === null || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeNivelIdx, isFinished]);

  // Manejo de la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeNivelIdx !== null) {
          handleExitLevel();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeNivelIdx, onClose]);

  // Iniciar nivel con 10 preguntas seleccionadas del pool real de 4°
  const handleStartLevel = (idx: number) => {
    const cfg = LEVEL_CONFIGS[idx];
    const poolData = SABER_POOLS.find((p) => p.level === idx + 1)?.pool || [];
    const chosen = shuffleArray(poolData).slice(0, 10);

    setActiveNivelIdx(idx);
    setSessionQuestions(chosen);
    setQIndex(0);
    setTimeLeft(cfg.time);
    setTotalTime(cfg.time);
    setCorrectCount(0);
    setSelectedOpt(null);
    setIsFinished(false);
    setSelectedChips({});
    setPizarraOpen(true);

    // Limpiar canvas si existe
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleExitLevel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveNivelIdx(null);
    setIsFinished(false);
    setSelectedOpt(null);
  };

  // Pregunta actual
  const currentQ = sessionQuestions[qIndex];

  // Datos extraídos para los chips de la pizarra
  const currentDatos = useMemo(() => {
    if (!currentQ) return [];
    return extractDatos(currentQ.q);
  }, [currentQ]);

  // Manejo de dibujo en canvas (mouse y touch)
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current;
    if (!cv) return [0, 0];
    const rect = cv.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * (cv.width / rect.width);
    const y = (clientY - rect.top) * (cv.height / rect.height);
    return [x, y];
  };

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const [x, y] = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const [x, y] = getCanvasPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const handleStopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleClearCanvas = () => {
    const cv = canvasRef.current;
    if (cv) {
      const ctx = cv.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, cv.width, cv.height);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (selectedOpt !== null || isFinished || !currentQ) return;
    setSelectedOpt(opt);

    if (opt.trim() === currentQ.ans.trim()) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (qIndex + 1 < sessionQuestions.length) {
      setQIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setSelectedChips({});
      handleClearCanvas();
    } else {
      // Fin del cuestionario
      if (timerRef.current) clearInterval(timerRef.current);
      setIsFinished(true);

      const finalCorrect = selectedOpt?.trim() === currentQ.ans.trim() ? correctCount : correctCount;
      const currentBest = (activeNivelIdx !== null && bestScores[activeNivelIdx]) || 0;
      if (activeNivelIdx !== null && finalCorrect > currentBest) {
        const nextBests = { ...bestScores, [activeNivelIdx]: finalCorrect };
        setBestScores(nextBests);
        try {
          localStorage.setItem('fedor4_saber_scores', JSON.stringify(nextBests));
        } catch {}
      }

      // Recompensa si aprueba con >= 7/10 aciertos
      if (finalCorrect >= 7) {
        updateStats(100, 1, 150);
      }
    }
  };

  if (!isOpen) return null;

  const currentLevelConfig = activeNivelIdx !== null ? LEVEL_CONFIGS[activeNivelIdx] : null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (activeNivelIdx !== null) {
            handleExitLevel();
          } else {
            onClose();
          }
        }
      }}
      className="saber-modal-overlay animate-fadeIn"
    >
      <style>{`
        .saber-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background-color: rgba(10, 5, 30, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          box-sizing: border-box;
        }

        .saber-modal-container {
          width: 100%;
          max-width: ${activeNivelIdx !== null ? '620px' : '560px'};
          max-height: 94vh;
          background-color: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.40);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-sizing: border-box;
          padding: 24px 28px 28px;
          transition: max-width 0.2s ease;
        }

        .saber-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          box-sizing: border-box;
        }

        .saber-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .saber-header-icon {
          font-size: 26px;
          line-height: 1;
        }

        .saber-title-wrap h2 {
          margin: 0;
          font-size: 23px;
          font-weight: 900;
          color: #2A0F60;
          font-family: 'Baloo 2', sans-serif;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .saber-close-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #F3EEFF;
          color: #5C21A6;
          font-size: 20px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.12s ease;
          flex-shrink: 0;
          padding: 0;
          line-height: 1;
        }

        .saber-close-circle:hover {
          background-color: #E9DEFF;
          transform: scale(1.06);
        }

        .saber-subtitle {
          margin: 0 0 16px 0;
          font-size: 14.5px;
          font-weight: 700;
          color: #1A1033;
          font-family: 'Nunito', sans-serif;
          line-height: 1.45;
        }

        .saber-grid-menu {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .saber-lvl-btn {
          width: 100%;
          padding: 15px 20px;
          border-radius: 16px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 900;
          color: #FFFFFF;
          border: none;
          text-align: left;
          cursor: pointer;
          box-sizing: border-box;
          transition: transform 0.12s ease, filter 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          outline: none;
        }

        .saber-lvl-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
        }

        .saber-lvl-btn:active {
          transform: scale(0.98);
        }

        /* ── SESIÓN DE QUIZ CON PIZARRA DE APOYO Y CUADRÍCULA ── */
        .saber-scroll-area {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 4px;
        }

        .saber-scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .saber-scroll-area::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .saber-scroll-area::-webkit-scrollbar-thumb {
          background: #C4B5FD;
          border-radius: 8px;
        }

        .saber-status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 900;
          font-size: 13.5px;
          color: #5C21A6;
        }

        .saber-progress-track {
          height: 6px;
          background: #EEE;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 4px;
        }

        .saber-progress-fill {
          height: 6px;
          background: #5C21A6;
          transition: width 0.3s ease;
        }

        .saber-timer-track {
          height: 5px;
          background: #FDE68A;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 4px;
          margin-bottom: 6px;
        }

        .saber-timer-fill {
          height: 5px;
          background: #E8650A;
          transition: width 1s linear;
        }

        .saber-topic-badge {
          font-size: 11px;
          font-weight: 800;
          color: #7A7299;
          margin-bottom: 2px;
        }

        .saber-ctx-text {
          font-size: 13.5px;
          color: #374151;
          font-weight: 700;
          line-height: 1.45;
          margin-bottom: 4px;
        }

        .saber-question-title {
          font-size: 17px;
          color: #111111;
          font-weight: 900;
          line-height: 1.45;
          margin-bottom: 10px;
        }

        /* ── PIZARRA DE APOYO ── */
        .pizarra-container {
          background: #FFFFFF;
          border: 2px solid #D9CCFF;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(92, 33, 166, 0.06);
          margin-bottom: 12px;
        }

        .pizarra-header {
          background: #6B21A8;
          color: #FFFFFF;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pizarra-header-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 900;
          font-size: 14px;
        }

        .pizarra-toggle-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #FFFFFF;
          width: 26px;
          height: 26px;
          border-radius: 8px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .pizarra-body {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pizarra-chips-label {
          font-weight: 900;
          color: #3D1468;
          font-size: 13px;
        }

        .pizarra-chips-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pizarra-chip-btn {
          background: #FFFFFF;
          border: 2px solid #C4B5FD;
          border-radius: 12px;
          padding: 5px 14px;
          font-weight: 900;
          font-size: 14.5px;
          color: #1A1033;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pizarra-chip-btn.active {
          background: #7C3AED;
          color: #FFFFFF;
          border-color: #5C21A6;
        }

        .pizarra-formula-box {
          background: #FFF7E6;
          border: 2px dashed #F59E0B;
          border-radius: 12px;
          padding: 8px 14px;
          font-weight: 900;
          color: #7A3200;
          font-size: 13.5px;
        }

        /* ── CUADRÍCULA CANVAS ── */
        .pizarra-canvas {
          width: 100%;
          height: 200px;
          background-color: #FFFFFF;
          border-radius: 14px;
          border: 2.5px solid #D9CCFF;
          touch-action: none;
          cursor: crosshair;
          background-image: linear-gradient(#EEE8FB 1px, transparent 1px),
            linear-gradient(90deg, #EEE8FB 1px, transparent 1px);
          background-size: 22px 22px;
        }

        .pizarra-instructions {
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          margin-top: 2px;
        }

        .pizarra-tools-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 2px;
        }

        .pizarra-color-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2.5px solid #FFFFFF;
          cursor: pointer;
          transition: transform 0.12s ease;
        }

        .pizarra-color-circle:hover {
          transform: scale(1.15);
        }

        .pizarra-clear-btn {
          padding: 6px 14px;
          border-radius: 10px;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          color: #334155;
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .pizarra-draw-hint {
          border: 1.5px dashed #C4B5FD;
          border-radius: 10px;
          padding: 6px 12px;
          color: #4338CA;
          font-weight: 800;
          font-size: 12px;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
          margin-top: 2px;
        }

        /* ── OPCIONES DE RESPUESTA ── */
        .saber-opts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 4px;
        }

        .saber-opt-btn {
          padding: 13px 16px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 900;
          background: #F8F5FF;
          color: #2A0F60;
          border: 2px solid #C5BFEE;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: transform 0.12s ease, border-color 0.15s ease;
          text-align: center;
        }

        .saber-opt-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: #7C3AED;
          background: #F3EEFF;
        }

        .saber-opt-btn.correct {
          background: #DCF5EE !important;
          border-color: #14B8A6 !important;
          color: #0F5B44 !important;
        }

        .saber-opt-btn.wrong {
          background: #FEE2E2 !important;
          border-color: #B91C1C !important;
          color: #7F1D1D !important;
        }

        .saber-next-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 14.5px;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          align-self: center;
          margin-top: 10px;
          transition: transform 0.12s ease;
        }

        .saber-next-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="saber-modal-container animate-popIn">
        {/* Header */}
        <div className="saber-header-row">
          <div className="saber-title-wrap">
            <span className="saber-header-icon">🏆</span>
            <h2>
              {activeNivelIdx !== null
                ? `SABER 4° · Nivel ${activeNivelIdx + 1}`
                : 'Pruebas SABER 4°'}
            </h2>
          </div>
          <button
            type="button"
            onClick={activeNivelIdx !== null ? handleExitLevel : onClose}
            className="saber-close-circle"
            title="Cerrar"
            aria-label="Cerrar pruebas Saber"
          >
            ✕
          </button>
        </div>

        {/* ── 1. MENÚ PRINCIPAL (REPRODUCCIÓN FIEL DE LA IMAGEN 1) ── */}
        {activeNivelIdx === null && (
          <>
            <p className="saber-subtitle">
              Problemas tipo prueba SABER con cronómetro. Usa los temas:{' '}
              <b>Problemas Numéricos SABER</b> y <b>Problemas Contextuales SABER</b>.
            </p>

            <div className="saber-grid-menu">
              {LEVEL_CONFIGS.map((lvl, idx) => (
                <button
                  key={lvl.nivel}
                  type="button"
                  onClick={() => handleStartLevel(idx)}
                  className="saber-lvl-btn"
                  style={{ background: lvl.color }}
                >
                  <div>{lvl.label}</div>
                  {bestScores[idx] !== undefined && (
                    <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
                      Mejor: {bestScores[idx]}/10 ⭐
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── 2. SESIÓN DE CUESTIONARIO CON PIZARRA Y CUADRÍCULA (IMAGEN 2) ── */}
        {activeNivelIdx !== null && !isFinished && currentQ && (
          <div className="saber-scroll-area">
            {/* Status bar */}
            <div className="saber-status-row">
              <span>
                Pregunta {qIndex + 1} de {sessionQuestions.length}
              </span>
              <span>✅ {correctCount}</span>
              <span>⏱ {timeLeft}s</span>
            </div>

            {/* Barra morada de progreso de preguntas */}
            <div className="saber-progress-track">
              <div
                className="saber-progress-fill"
                style={{
                  width: `${((qIndex + 1) / sessionQuestions.length) * 100}%`,
                }}
              />
            </div>

            {/* Barra naranja de cronómetro */}
            <div className="saber-timer-track">
              <div
                className="saber-timer-fill"
                style={{
                  width: `${Math.max(0, (timeLeft / totalTime) * 100)}%`,
                }}
              />
            </div>

            {/* Tema y Contexto narrativo */}
            <div className="saber-topic-badge">{currentQ.tema}</div>
            <div className="saber-ctx-text">{currentQ.ctx}</div>
            <div className="saber-question-title">{currentQ.q}</div>

            {/* ══ LA PIZARRA DE APOYO CON LA CUADRÍCULA ══ */}
            <div className="pizarra-container">
              {/* Header de la pizarra */}
              <div className="pizarra-header">
                <div className="pizarra-header-title">
                  <span>🧠</span>
                  <span>Pizarra de apoyo</span>
                  <span style={{ fontSize: '11px', opacity: 0.85, fontWeight: 700 }}>
                    haz tus cuentas aquí
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPizarraOpen((prev) => !prev)}
                  className="pizarra-toggle-btn"
                  title="Plegar / Desplegar pizarra"
                >
                  {pizarraOpen ? '▾' : '▲'}
                </button>
              </div>

              {/* Cuerpo de la pizarra */}
              {pizarraOpen && (
                <div className="pizarra-body">
                  {/* Datos del problema (Chips) */}
                  {currentDatos.length > 0 && (
                    <>
                      <div className="pizarra-chips-label">🔎 Datos del problema:</div>
                      <div className="pizarra-chips-row">
                        {currentDatos.map((dat, dIdx) => (
                          <button
                            key={dIdx}
                            type="button"
                            onClick={() =>
                              setSelectedChips((prev) => ({
                                ...prev,
                                [dat]: !prev[dat],
                              }))
                            }
                            className={`pizarra-chip-btn ${
                              selectedChips[dat] ? 'active' : ''
                            }`}
                          >
                            {dat}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Fórmula / encabezado posicional */}
                  <div className="pizarra-formula-box">
                    🧠 CM · DM · UM · C · D · U
                  </div>

                  {/* Canvas con cuadrícula interactiva */}
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    onMouseDown={handleStartDrawing}
                    onMouseMove={handleDrawMove}
                    onMouseUp={handleStopDrawing}
                    onMouseLeave={handleStopDrawing}
                    onTouchStart={handleStartDrawing}
                    onTouchMove={handleDrawMove}
                    onTouchEnd={handleStopDrawing}
                    className="pizarra-canvas"
                  />

                  {/* Indicaciones y herramientas */}
                  <div className="pizarra-instructions">
                    👆 Subraya los datos tocándolos y haz la operación en la pizarra.
                  </div>

                  <div className="pizarra-tools-row">
                    {PEN_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPenColor(c)}
                        className="pizarra-color-circle"
                        style={{
                          backgroundColor: c,
                          boxShadow:
                            penColor === c
                              ? `0 0 0 2px ${c}, 0 0 0 4px #FFFFFF`
                              : `0 0 0 1.5px ${c}`,
                        }}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={handleClearCanvas}
                      className="pizarra-clear-btn"
                    >
                      <span>🧽</span>
                      <span>Borrar</span>
                    </button>
                  </div>

                  <div className="pizarra-draw-hint">
                    Escribe o dibuja aquí tu proceso con el dedo o el ratón
                  </div>
                </div>
              )}
            </div>

            {/* ══ OPCIONES DE RESPUESTA (MCQ) ══ */}
            <div className="saber-opts-grid">
              {currentQ.opts.map((opt, oIdx) => {
                const isSelected = selectedOpt === opt;
                const isCorrect = opt.trim() === currentQ.ans.trim();
                let optClass = 'saber-opt-btn';

                if (selectedOpt !== null) {
                  if (isCorrect) optClass += ' correct';
                  else if (isSelected) optClass += ' wrong';
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    disabled={selectedOpt !== null}
                    className={optClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Botón para pasar a la siguiente pregunta */}
            {selectedOpt !== null && (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="saber-next-btn"
                style={{
                  background: currentLevelConfig?.color || '#5C21A6',
                }}
              >
                {qIndex + 1 < sessionQuestions.length
                  ? 'Siguiente pregunta ➔'
                  : 'Ver resultados finales 🏆'}
              </button>
            )}
          </div>
        )}

        {/* ── 3. RESUMEN DE RESULTADOS ── */}
        {activeNivelIdx !== null && isFinished && (() => {
          const cfg = LEVEL_CONFIGS[activeNivelIdx];
          const passed = correctCount >= 7;

          return (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '54px', marginBottom: '8px' }}>
                {passed ? '🏆' : '💪'}
              </div>
              <h3
                style={{
                  margin: '0 0 6px',
                  fontSize: '24px',
                  fontWeight: 900,
                  color: passed ? '#15803D' : '#92400E',
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                {passed
                  ? '¡Excelente desempeño SABER!'
                  : '¡Buen intento! Sigue practicando'}
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#1E0E4E',
                  marginBottom: '18px',
                }}
              >
                Obtuviste <b>{correctCount} de 10</b> aciertos (
                {Math.round((correctCount / 10) * 100)}%).
                {passed && ' ¡Has ganado +100 🪙 y +150 XP!'}
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleStartLevel(activeNivelIdx)}
                  className="saber-next-btn"
                  style={{ background: cfg.color, margin: 0 }}
                >
                  🔄 Reintentar nivel
                </button>
                <button
                  type="button"
                  onClick={handleExitLevel}
                  className="saber-next-btn"
                  style={{ background: '#5C21A6', margin: 0 }}
                >
                  ◀ Volver a niveles
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
