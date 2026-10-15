'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import probData from '@/mocks/data/problemas-cotidianos-5.json';

interface ProblemaItem {
  q: string;
  ans: string;
  opts: string[];
  proc: string[];
  datos: number[];
  pts: number;
  t: number;
}

interface ProblemaLevel {
  nombre: string;
  ejemplos: ProblemaItem[];
  ejercicios: ProblemaItem[];
}

interface ProblemasCotidianosModal5toProps {
  isOpen?: boolean;
  onClose: () => void;
  onOpenFullScreen?: () => void;
}

const NIVELES: ProblemaLevel[] = (probData as any).PC_NIVELES || [];

const SBCOL: [string, string][] = [
  ['#16876A', '#24C496'], // Nivel 1: Adición
  ['#C94B22', '#F97316'], // Nivel 2: Sustracción
  ['#E8650A', '#F5A524'], // Nivel 3: Multiplicación
  ['#1E40AF', '#3B82F6'], // Nivel 4: División
  ['#5C21A6', '#8B3EDB'], // Nivel 5: Operaciones combinadas
];

const LEVEL_GRADIENTS = [
  'linear-gradient(135deg, #16876A, #24C496)', // Nivel 1
  'linear-gradient(135deg, #C94B22, #F97316)', // Nivel 2
  'linear-gradient(135deg, #E8650A, #F5A524)', // Nivel 3
  'linear-gradient(135deg, #1E40AF, #3B82F6)', // Nivel 4
  'linear-gradient(135deg, #5C21A6, #8B3EDB)', // Nivel 5
];

const LUG: [number, string, string][] = [
  [1000000, 'Unidades de millón', '#7C3AED'],
  [100000, 'Centenas de mil', '#BE185D'],
  [10000, 'Decenas de mil', '#0F766E'],
  [1000, 'Unidades de mil', '#1E40AF'],
  [100, 'Centenas', '#F97316'],
  [10, 'Decenas', '#10B981'],
  [1, 'Unidades', '#EAB308'],
];

function fmt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function numDe(s: string): number {
  return parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;
}

function playSound(type: 'ok' | 'bad' | 'win') {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'ok') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'bad') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(146.83, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.5, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch {}
}

/* Grilla de puntos para cantidades <= 100 */
function FedorGrilla({ n }: { n: number }) {
  const cols = Math.min(10, n);
  return (
    <div
      className="fzr-g"
      style={{
        display: 'inline-grid',
        gap: '3px',
        gridTemplateColumns: `repeat(${cols}, 13px)`,
        background: '#FFFFFF',
      }}
    >
      {Array.from({ length: n }).map((_, i) => (
        <i
          key={i}
          style={{
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #FFD27A, #E8650A)',
            display: 'block',
          }}
        />
      ))}
    </div>
  );
}

/* Ábaco FEDOR para cantidades > 100 con tarjetas posicionales exactas */
function FedorAbaco({ n }: { n: number }) {
  let r = n;
  const rows: React.ReactNode[] = [];

  LUG.forEach((L, idx) => {
    const pot = L[0];
    const name = L[1];
    const color = L[2];
    const d = Math.floor(r / pot);
    r = r % pot;

    if (pot > n) return;

    let items: React.ReactNode = null;
    if (pot === 1) {
      if (d > 0) {
        items = (
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
            {Array.from({ length: d }).map((_, i) => (
              <span
                key={i}
                className="fzr-ball"
                style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, #FDE68A, #EAB308)',
                  border: '1px solid #92400E',
                }}
              />
            ))}
          </div>
        );
      }
    } else {
      if (d > 0) {
        items = (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Array.from({ length: d }).map((_, i) => (
              <span
                key={i}
                className="fzr-card"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '44px',
                  height: '26px',
                  padding: '0 6px',
                  borderRadius: '7px',
                  background: '#FFFFFF',
                  border: `2px solid ${color}`,
                  color: color,
                  fontSize: '11px',
                  fontWeight: 900,
                }}
              >
                {fmt(pot)}
              </span>
            ))}
          </div>
        );
      }
    }

    rows.push(
      <div
        key={idx}
        className="fzr-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          margin: '4px 0',
          background: '#FFFFFF',
        }}
      >
        <span
          className="fzr-lab"
          style={{
            minWidth: '118px',
            fontSize: '12px',
            fontWeight: 900,
            color: color,
          }}
        >
          {name}: {d}
        </span>
        {items || (
          <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800 }}>
            —
          </span>
        )}
      </div>
    );
  });

  return <div>{rows}</div>;
}

function FedorRepItem({ n, etiqueta }: { n: number; etiqueta?: string }) {
  return (
    <div
      className="fzr-n"
      style={{
        background: '#FFFFFF',
        border: '1.5px dashed #D9CCFF',
        borderRadius: '12px',
        padding: '9px 12px',
      }}
    >
      <div
        className="fzr-t"
        style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 900,
          color: '#5C21A6',
          fontSize: '15px',
          marginBottom: '5px',
        }}
      >
        {etiqueta || ''}
        {n > 100 ? '🧮 Ábaco FEDOR: ' : '🔵 '}
        {fmt(n)}
      </div>
      {n > 100 ? <FedorAbaco n={n} /> : <FedorGrilla n={n} />}
    </div>
  );
}

function FedorRepQuantities({
  nums,
  resultado,
}: {
  nums: number[];
  resultado: number | null;
}) {
  const [minimized, setMinimized] = useState(false);

  if (!nums.length && resultado == null) return null;

  return (
    <div
      className="fzr"
      style={{
        margin: '10px 0',
        background: '#FFFFFF',
        border: '2px solid #E4DCFA',
        borderRadius: '16px',
        padding: '10px 14px',
        textAlign: 'left',
      }}
    >
      <div
        className="fzr-h"
        onClick={() => setMinimized(!minimized)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 900,
          color: '#3D1468',
          fontSize: '13.5px',
          marginBottom: minimized ? 0 : '8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span>🧮</span>
        <b style={{ flex: 1 }}>Representación FEDOR de las cantidades</b>
        <span style={{ fontSize: '13px', color: '#6B5E8A' }}>
          {minimized ? '▸' : '▾'}
        </span>
      </div>
      {!minimized && (
        <div
          className="fzr-c"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {nums.slice(0, 5).map((n, i) => (
            <FedorRepItem key={i} n={n} />
          ))}
          {resultado != null && (
            <FedorRepItem n={resultado} etiqueta="✅ Resultado · " />
          )}
        </div>
      )}
    </div>
  );
}

/* Paso a paso en columna matemático idéntico al motor de Fedor */
function sbColumna(li: number, e: ProblemaItem): string[] {
  try {
    if (!e.datos || e.datos.length !== 2) return [];
    const a = e.datos[0];
    const b = e.datos[1];
    let op: any = null;
    const r = numDe(e.ans);
    if (li === 0) op = { a, b, op: '+', r: a + b };
    else if (li === 1) op = { a, b, op: '-', r: a - b };
    else if (li === 2) op = { a: b, b: a, op: '×', r: a * b };
    else if (li === 3) op = { a, b, op: '÷', r: Math.floor(a / b) };
    if (!op || op.r !== r) return [];

    const NOM = [
      'unidades',
      'decenas',
      'centenas',
      'unidades de mil',
      'decenas de mil',
      'centenas de mil',
      'unidades de millón',
    ];
    const o = op.op;
    const pasos: string[] = [];

    if (o === '+' || o === '-') {
      const A = String(a).split('').reverse().map(Number);
      const B = String(b).split('').reverse().map(Number);
      const n = Math.max(A.length, B.length);
      let c = 0;
      for (let i = 0; i < n; i++) {
        const x = A[i] || 0;
        const y = B[i] || 0;
        if (o === '+') {
          const t = x + y + c;
          const frase =
            (i === 0 ? 'Se suman las ' : 'Luego las ') +
            NOM[i] +
            ': ' +
            x +
            ' + ' +
            y +
            (c ? ' + ' + c + ' que llevamos' : '') +
            ' = ' +
            t +
            (t > 9 && i < n - 1 ? '; escribimos ' + (t % 10) + ' y llevamos 1' : '');
          pasos.push(frase);
          c = t > 9 && i < n - 1 ? 1 : 0;
        } else {
          const top = x - c;
          const pres = top < y;
          const t = (pres ? top + 10 : top) - y;
          const frase =
            (i === 0 ? 'Se restan las ' : 'Luego las ') +
            NOM[i] +
            ': ' +
            (pres ? top + ' no alcanza, pedimos prestado: ' + (top + 10) : top) +
            ' − ' +
            y +
            ' = ' +
            t;
          pasos.push(frase);
          c = pres ? 1 : 0;
        }
      }
      pasos.push('El resultado es ' + fmt(op.r));
    } else if (o === '×') {
      if (b < 10) {
        const D = String(a).split('').reverse().map(Number);
        let c2 = 0;
        for (let j = 0; j < D.length; j++) {
          const t2 = D[j] * b + c2;
          const ult = j === D.length - 1;
          const frase =
            (j === 0 ? 'Se multiplican las ' : 'Luego las ') +
            NOM[j] +
            ': ' +
            D[j] +
            ' × ' +
            b +
            (c2 ? ' + ' + c2 + ' que llevamos' : '') +
            ' = ' +
            t2 +
            (t2 > 9 && !ult
              ? '; escribimos ' + (t2 % 10) + ' y llevamos ' + Math.floor(t2 / 10)
              : '');
          pasos.push(frase);
          c2 = ult ? 0 : Math.floor(t2 / 10);
        }
        pasos.push('El resultado es ' + fmt(op.r));
      } else {
        const E = String(b).split('').reverse().map(Number);
        const parts: number[] = [];
        for (let k = 0; k < E.length; k++) {
          const pp = a * E[k] * Math.pow(10, k);
          parts.push(pp);
          pasos.push(
            'Multiplicamos ' +
              fmt(a) +
              ' por ' +
              E[k] +
              ' ' +
              (E[k] === 1 ? NOM[k].replace(/es( |$)/, '$1').replace(/s( |$)/, '$1') : NOM[k]) +
              ': ' +
              fmt(pp)
          );
        }
        pasos.push(
          'Sumamos: ' +
            parts.map(fmt).join(' + ') +
            ' = ' +
            fmt(op.r) +
            '. El resultado es ' +
            fmt(op.r)
        );
      }
    } else if (o === '÷') {
      const dig = String(a).split('').map(Number);
      let resto = 0;
      let q = '';
      let empezo = false;
      for (let m = 0; m < dig.length; m++) {
        const cur = resto * 10 + dig[m];
        const qq = Math.floor(cur / b);
        if (!empezo && qq === 0 && m < dig.length - 1) {
          resto = cur;
          continue;
        }
        empezo = true;
        q += qq;
        resto = cur - qq * b;
        pasos.push(
          '¿Cuántas veces cabe ' +
            b +
            ' en ' +
            cur +
            '? ' +
            qq +
            (qq === 1 ? ' vez: ' : ' veces: ') +
            qq +
            ' × ' +
            b +
            ' = ' +
            qq * b +
            ', sobra ' +
            resto
        );
      }
      pasos.push('El resultado es ' + fmt(+q) + (resto ? ' y sobra ' + resto : ''));
    }

    return pasos;
  } catch (x) {
    return [];
  }
}

export default function ProblemasCotidianosModal5to({
  isOpen = true,
  onClose,
}: ProblemasCotidianosModal5toProps) {
  const { updateStats } = useBook5();

  const [view, setView] = useState<'menu' | 'level-menu' | 'ejemplos' | 'ejercicios' | 'finalizado'>('menu');
  const [activeLevel, setActiveLevel] = useState<number>(0);

  // Estado Ejemplos
  const [curEjemploIdx, setCurEjemploIdx] = useState<number>(0);

  // Estado Ejercicios
  const [curEjercicioIdx, setCurEjercicioIdx] = useState<number>(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showProcesoInEjercicio, setShowProcesoInEjercicio] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(90);

  // Reiniciar estado al abrir modal
  useEffect(() => {
    if (isOpen) {
      setView('menu');
      setSelectedOptIdx(null);
      setShowFeedback(false);
      setShowProcesoInEjercicio(false);
    }
  }, [isOpen]);

  // Tecla Escape para volver o cerrar
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'ejemplos' || view === 'ejercicios' || view === 'finalizado') {
          setView('level-menu');
        } else if (view === 'level-menu') {
          setView('menu');
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, view, onClose]);

  const levelData = NIVELES[activeLevel] || NIVELES[0];
  const ejemplos = levelData?.ejemplos || [];
  const ejercicios = levelData?.ejercicios || [];

  const curEjemplo = ejemplos[curEjemploIdx] || ejemplos[0];
  const curEjercicio = ejercicios[curEjercicioIdx] || ejercicios[0];

  // Timer para ejercicios
  useEffect(() => {
    if (view !== 'ejercicios' || showFeedback) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswerExercise(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [view, showFeedback, curEjercicioIdx]);

  const handleSelectLevel = (idx: number) => {
    setActiveLevel(idx);
    setCurEjemploIdx(0);
    setCurEjercicioIdx(0);
    setSelectedOptIdx(null);
    setShowFeedback(false);
    setShowProcesoInEjercicio(false);
    setScore(0);
    setCorrectCount(0);
    setTimer(ejercicios[0]?.t || 90);
  };

  const handleAnswerExercise = (optIdx: number) => {
    if (showFeedback) return;
    setSelectedOptIdx(optIdx);
    setShowFeedback(true);

    const isOk = optIdx >= 0 && curEjercicio.opts[optIdx] === curEjercicio.ans;
    if (isOk) {
      playSound('ok');
      setScore((s) => s + (curEjercicio.pts || 10));
      setCorrectCount((c) => c + 1);
      updateStats(10, 0, 15);
    } else {
      playSound('bad');
    }
  };

  const handleNextExercise = () => {
    if (curEjercicioIdx < ejercicios.length - 1) {
      const nextIdx = curEjercicioIdx + 1;
      setCurEjercicioIdx(nextIdx);
      setSelectedOptIdx(null);
      setShowFeedback(false);
      setShowProcesoInEjercicio(false);
      setTimer(ejercicios[nextIdx]?.t || 90);
    } else {
      playSound('win');
      setView('finalizado');
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-CO';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  if (!isOpen) return null;

  return (
    <div
      className="tool-modal-bg animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (view !== 'menu') {
            setView('menu');
          } else {
            onClose();
          }
        }
      }}
    >
      <style>{`
        .tool-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 9995;
          background: rgba(18, 8, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .tool-modal {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 720px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          padding: 20px 24px 24px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.5);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
        }

        .tm-close {
          position: absolute;
          right: 14px;
          top: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.15s ease;
          padding: 0;
          outline: none;
        }

        .tm-close:hover {
          background: #6C28B4;
          color: #FFFFFF;
        }

        .tm-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #3D1468;
          margin: 0 40px 10px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.2;
        }

        .sb5-lv {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 12px 20px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          margin-bottom: 9px;
          text-align: left;
          font-family: 'Nunito', sans-serif;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
          box-sizing: border-box;
        }

        .sb5-lv:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
        }

        .sb5-lv .n {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 28px;
          font-weight: 900;
          width: 36px;
          text-align: center;
          line-height: 1;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        .sb5-lv b {
          font-size: 16px;
          display: block;
          color: #FFFFFF;
          font-weight: 900;
          line-height: 1.2;
        }

        .sb5-lv small {
          font-weight: 800;
          font-size: 12px;
          color: #FFFFFF;
          opacity: 0.95;
          display: block;
          margin-top: 2px;
        }

        .sb5-lv .arrow {
          font-size: 20px;
          color: #FFFFFF;
          margin-left: auto;
          line-height: 1;
          flex-shrink: 0;
          padding-right: 2px;
        }

        /* ── Opciones múltiples en ejercicios ── */
        .sb5-op {
          display: block;
          width: 100%;
          padding: 13px 18px;
          margin-bottom: 8px;
          border-radius: 14px;
          border: 2px solid #D9CCFF;
          background: #FFFFFF;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #1A1033;
          transition: transform 0.12s ease, border-color 0.12s ease, background 0.15s ease;
          text-align: center;
          box-sizing: border-box;
        }

        .sb5-op:hover:not(:disabled) {
          transform: translateX(4px);
          border-color: #8B3EDB;
        }

        .sb5-op.ok {
          background: #DCFCE7 !important;
          border-color: #16A34A !important;
          color: #14532D !important;
        }

        .sb5-op.no {
          background: #FEE2E2 !important;
          border-color: #DC2626 !important;
          color: #7F1D1D !important;
          animation: sb5shake 0.4s ease;
        }

        @keyframes sb5shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        /* ── Cuadro Proceso ── */
        .sb5-proc {
          background: #F8F5FF;
          border-left: 4px solid #5C21A6;
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 10px;
          font-weight: 700;
          color: #1A1033;
          line-height: 1.6;
          font-size: 14px;
          text-align: left;
        }

        .sb5-proc b {
          color: #3D1468;
          font-size: 14.5px;
          display: block;
          margin-bottom: 3px;
        }

        /* ── Botones genéricos de Fedor ── */
        .fz-btn {
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          border: none;
          color: #FFFFFF;
          background: #5C21A6;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .fz-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .fz-btn.g {
          background: linear-gradient(135deg, #16876A, #24C496);
          color: #FFFFFF;
        }

        .fz-btn.o {
          background: linear-gradient(135deg, #E8650A, #F5A524);
          color: #FFFFFF;
        }

        .fz-btn.w {
          background: #FFFFFF;
          border: 2px solid #C5BFEE;
          color: #5C21A6;
        }

        .btn-back {
          padding: 9px 16px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #5C21A6;
          background: #F3EEFF;
          border: 1.5px solid #C5BFEE;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-back:hover {
          background: #E9DEFF;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="tool-modal animate-popIn">
        {/* Botón Cerrar .tm-close */}
        <button
          type="button"
          onClick={() => {
            if (view === 'ejemplos' || view === 'ejercicios' || view === 'finalizado') {
              setView('level-menu');
            } else if (view === 'level-menu') {
              setView('menu');
            } else {
              onClose();
            }
          }}
          className="tm-close"
          title={view !== 'menu' ? 'Volver' : 'Cerrar'}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* ══════════════════════════════════════════════════════════════
            VISTA 1: MENÚ PRINCIPAL DE NIVELES
           ══════════════════════════════════════════════════════════════ */}
        {view === 'menu' && (
          <div>
            {/* Título .tm-title */}
            <div className="tm-title">
              <span>🛒</span>
              <span>Problemas Cotidianos — Tipo Prueba SABER (5°)</span>
            </div>

            {/* Texto descriptivo idéntico a la imagen */}
            <p
              style={{
                fontWeight: 700,
                color: '#1A1033',
                fontSize: '14px',
                margin: '0 0 14px 0',
                lineHeight: 1.45,
              }}
            >
              Situaciones reales de compras escolares, tienda, alimentos, almacén, reparticiones y manejo de dinero.
              <br />
              Cada nivel tiene <b>10 ejemplos</b> y <b>20 ejercicios</b>, de lo más simple a lo más complejo.
            </p>

            {/* Lista vertical de los 5 niveles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {NIVELES.map((niv, i) => (
                <button
                  key={i}
                  type="button"
                  className="sb5-lv"
                  style={{ background: LEVEL_GRADIENTS[i] }}
                  onClick={() => {
                    handleSelectLevel(i);
                    setView('level-menu');
                  }}
                >
                  <span className="n">{i + 1}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <b>{niv.nombre}</b>
                    <small>10 ejemplos · 20 ejercicios</small>
                  </span>
                  <span className="arrow">▶</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 2: MENÚ DE OPCIONES DEL NIVEL SELECCIONADO
           ══════════════════════════════════════════════════════════════ */}
        {view === 'level-menu' && (
          <div>
            <div className="tm-title">
              <span>🛒</span>
              <span>{levelData.nombre}</span>
            </div>

            <p
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#1A1033',
                marginBottom: '16px',
                lineHeight: 1.45,
                textAlign: 'center',
              }}
            >
              Primero mira los ejemplos resueltos y luego resuelve los 20 ejercicios.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <button
                type="button"
                className="sb5-lv"
                style={{
                  background: LEVEL_GRADIENTS[activeLevel],
                  justifyContent: 'center',
                  padding: '16px 20px',
                  gap: '12px',
                }}
                onClick={() => setView('ejemplos')}
              >
                <span style={{ fontSize: '24px' }}>📖</span>
                <b style={{ fontSize: '17px' }}>Ver los 10 ejemplos resueltos</b>
              </button>

              <button
                type="button"
                className="sb5-lv"
                style={{
                  background: 'linear-gradient(135deg, #3D1468, #7C3AED)',
                  justifyContent: 'center',
                  padding: '16px 20px',
                  gap: '12px',
                }}
                onClick={() => {
                  setCurEjercicioIdx(0);
                  setSelectedOptIdx(null);
                  setShowFeedback(false);
                  setShowProcesoInEjercicio(false);
                  setScore(0);
                  setCorrectCount(0);
                  setTimer(ejercicios[0]?.t || 90);
                  setView('ejercicios');
                }}
              >
                <span style={{ fontSize: '24px' }}>🎯</span>
                <b style={{ fontSize: '17px' }}>Resolver los 20 ejercicios</b>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="btn-back"
              >
                ◀ Volver a niveles
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 3: LOS 10 EJEMPLOS RESUELTOS DEL NIVEL (IDÉNTICO A IMAGEN 1)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'ejemplos' && curEjemplo && (
          <div>
            {/* Título de la modal: 📖 Nivel X · [Nombre] */}
            <div className="tm-title">
              <span>📖</span>
              <span>{levelData.nombre}</span>
            </div>

            {/* Subcabecera: 📖 Ejemplo 1 de 10  ...  Nivel 1 · Adición */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 900,
                color: SBCOL[activeLevel][0],
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              <span>📖 Ejemplo {curEjemploIdx + 1} de {ejemplos.length}</span>
              <span>{levelData.nombre}</span>
            </div>

            {/* Enunciado del problema */}
            <div
              style={{
                fontSize: '17px',
                fontWeight: 900,
                color: '#1A1033',
                lineHeight: 1.45,
                marginBottom: '10px',
              }}
            >
              {curEjemplo.q}
            </div>

            {/* Representación FEDOR de las cantidades */}
            <FedorRepQuantities
              nums={(curEjemplo.datos || []).filter((x) => x >= 1)}
              resultado={numDe(curEjemplo.ans)}
            />

            {/* Cuadro Proceso con Paso a paso en columna */}
            <div className="sb5-proc">
              <b>🧠 Proceso</b>
              {(curEjemplo.proc || []).map((step, idx) => (
                <div key={idx}>{step}</div>
              ))}
              {sbColumna(activeLevel, curEjemplo).length > 0 && (
                <>
                  <b style={{ display: 'block', marginTop: '6px' }}>
                    👣 Paso a paso en columna
                  </b>
                  {sbColumna(activeLevel, curEjemplo).map((colStep, idx) => (
                    <div key={idx}>{colStep}</div>
                  ))}
                </>
              )}
            </div>

            {/* Cuadro Respuesta Destacada */}
            <div
              style={{
                marginTop: '12px',
                background: '#DCFCE7',
                border: '2px solid #16A34A',
                borderRadius: '12px',
                padding: '10px 14px',
                fontWeight: 900,
                color: '#14532D',
                textAlign: 'center',
                fontSize: '18px',
              }}
            >
              ✅ Respuesta: {curEjemplo.ans}
            </div>

            {/* Botones de navegación */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                className="fz-btn"
                style={{ flex: 1 }}
                onClick={() =>
                  setCurEjemploIdx((prev) => (prev + ejemplos.length - 1) % ejemplos.length)
                }
              >
                ◀ Anterior
              </button>
              <button
                type="button"
                className="fz-btn o"
                onClick={() => {
                  const colSteps = sbColumna(activeLevel, curEjemplo);
                  speakText(
                    curEjemplo.q +
                      '. ' +
                      (curEjemplo.proc || []).concat(colSteps).join('. ') +
                      '. Respuesta: ' +
                      curEjemplo.ans
                  );
                }}
              >
                🔊 Escuchar
              </button>
              <button
                type="button"
                className="fz-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  if (curEjemploIdx < ejemplos.length - 1) {
                    setCurEjemploIdx((prev) => prev + 1);
                  } else {
                    setView('level-menu');
                  }
                }}
              >
                {curEjemploIdx < ejemplos.length - 1 ? 'Siguiente ▶' : '✔ Terminar'}
              </button>
              <button
                type="button"
                className="btn-back"
                onClick={() => setView('level-menu')}
              >
                ◀ Menú
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 4: LOS 20 EJERCICIOS (IDÉNTICO A IMAGEN 2)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'ejercicios' && curEjercicio && (
          <div>
            {/* Título de la modal: 🎯 Nivel X · [Nombre] */}
            <div className="tm-title">
              <span>🎯</span>
              <span>{levelData.nombre}</span>
            </div>

            {/* Línea de estado superior */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 900,
                color: SBCOL[activeLevel][0],
                fontSize: '14px',
                marginBottom: '6px',
              }}
            >
              <span>Ejercicio {curEjercicioIdx + 1} de {ejercicios.length}</span>
              <span>⭐ {score} pts</span>
              <span>⏱ {timer} s</span>
            </div>

            {/* Barra de progreso de tiempo */}
            <div
              style={{
                height: '7px',
                background: '#EEE8FB',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  height: '7px',
                  width: `${Math.max(0, Math.min(100, (timer / (curEjercicio.t || 90)) * 100))}%`,
                  background: `linear-gradient(90deg, ${SBCOL[activeLevel][0]}, ${SBCOL[activeLevel][1]})`,
                  transition: 'width 1s linear',
                }}
              />
            </div>

            {/* Puntos del ejercicio */}
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#6B5E8A',
                marginBottom: '4px',
              }}
            >
              Vale {curEjercicio.pts || 10} puntos
            </div>

            {/* Enunciado del problema */}
            <div
              style={{
                fontSize: '18px',
                fontWeight: 900,
                color: '#1A1033',
                lineHeight: 1.45,
                marginBottom: '8px',
              }}
            >
              {curEjercicio.q}
            </div>

            {/* Representación FEDOR de las cantidades (sin resultado en ejercicios) */}
            <FedorRepQuantities
              nums={(curEjercicio.datos || []).filter((x) => x >= 1)}
              resultado={null}
            />

            {/* Lista de las 4 opciones A), B), C), D) */}
            <div style={{ marginTop: '8px' }}>
              {(curEjercicio.opts || []).map((opt, j) => {
                const optLetter = ['A', 'B', 'C', 'D'][j] || `${j + 1}`;
                const isSelected = selectedOptIdx === j;
                const isAns = opt === curEjercicio.ans;

                let optClass = 'sb5-op';
                if (showFeedback) {
                  if (isAns) {
                    optClass += ' ok';
                  } else if (isSelected) {
                    optClass += ' no';
                  }
                }

                return (
                  <button
                    key={j}
                    type="button"
                    className={optClass}
                    disabled={showFeedback}
                    onClick={() => handleAnswerExercise(j)}
                  >
                    <span style={{ color: SBCOL[activeLevel][0], marginRight: '6px' }}>
                      {optLetter})
                    </span>{' '}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback y botones después de responder */}
            {showFeedback && (
              <div style={{ marginTop: '10px' }}>
                <div
                  style={{
                    padding: '11px 14px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    textAlign: 'center',
                    fontSize: '16px',
                    background:
                      selectedOptIdx !== null &&
                      curEjercicio.opts[selectedOptIdx] === curEjercicio.ans
                        ? '#DCFCE7'
                        : '#FEE2E2',
                    color:
                      selectedOptIdx !== null &&
                      curEjercicio.opts[selectedOptIdx] === curEjercicio.ans
                        ? '#14532D'
                        : '#7F1D1D',
                  }}
                >
                  {selectedOptIdx !== null &&
                  curEjercicio.opts[selectedOptIdx] === curEjercicio.ans
                    ? `✅ ¡Correcto! +${curEjercicio.pts || 10} puntos`
                    : selectedOptIdx === -1
                    ? `⏰ Se acabó el tiempo. La respuesta correcta es ${curEjercicio.ans}`
                    : `❌ La respuesta correcta es ${curEjercicio.ans}`}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="fz-btn g"
                    style={{ flex: 1, fontSize: '16px' }}
                    onClick={handleNextExercise}
                  >
                    ➡ Seguir
                  </button>
                  <button
                    type="button"
                    className="fz-btn o"
                    style={{ flex: 1, fontSize: '16px' }}
                    onClick={() => setShowProcesoInEjercicio(!showProcesoInEjercicio)}
                  >
                    🧠 Proceso
                  </button>
                </div>

                {/* Despliegue de Proceso si el alumno lo solicita */}
                {showProcesoInEjercicio && (
                  <div className="sb5-proc">
                    <b>🧠 Proceso</b>
                    {(curEjercicio.proc || []).map((step, idx) => (
                      <div key={idx}>{step}</div>
                    ))}
                    {sbColumna(activeLevel, curEjercicio).length > 0 && (
                      <>
                        <b style={{ display: 'block', marginTop: '6px' }}>
                          👣 Paso a paso en columna
                        </b>
                        {sbColumna(activeLevel, curEjercicio).map((colStep, idx) => (
                          <div key={idx}>{colStep}</div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 5: RESUMEN FINAL AL TERMINAR LOS 20 EJERCICIOS
           ══════════════════════════════════════════════════════════════ */}
        {view === 'finalizado' && (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: '54px', marginBottom: '8px' }}>🏆</div>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '28px',
                fontWeight: 900,
                color: '#5C21A6',
              }}
            >
              ¡Completaste los 20 ejercicios!
            </div>
            <div style={{ fontSize: '24px', margin: '8px 0' }}>
              {'⭐'.repeat(Math.max(1, Math.min(5, Math.ceil(correctCount / 4))))}
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#1A1033',
                marginBottom: '18px',
              }}
            >
              {correctCount} de {ejercicios.length} correctas · Puntaje total: {score} puntos
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                className="fz-btn g"
                onClick={() => {
                  setCurEjercicioIdx(0);
                  setSelectedOptIdx(null);
                  setShowFeedback(false);
                  setShowProcesoInEjercicio(false);
                  setScore(0);
                  setCorrectCount(0);
                  setTimer(ejercicios[0]?.t || 90);
                  setView('ejercicios');
                }}
              >
                🔁 Repetir ejercicios
              </button>
              <button
                type="button"
                className="fz-btn"
                onClick={() => setView('menu')}
              >
                🏠 Menú de niveles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
