'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import { FZ } from './fedor-visual-lab-engine-5to';

interface DesafioModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DesafioItem {
  id: string;
  t: string;
  q: string;
  a: string | number;
  hint: string;
}

// ── 13 Desafíos del Día del HTML original de 5° ──
export const DESAFIOS_5TO: DesafioItem[] = [
  { id: 'suma', t: 'Suma rápida', q: '234 + 567 = ?', a: 801, hint: 'Suma columna por columna' },
  { id: 'resta', t: 'Resta rápida', q: '800 - 235 = ?', a: 565, hint: 'Presta 1 de la centena' },
  { id: 'mult', t: 'Multiplicación', q: '45 × 6 = ?', a: 270, hint: '6×5=30 y 6×4=24, luego suma con llevada' },
  { id: 'div', t: 'División', q: '96 ÷ 8 = ?', a: 12, hint: '8 × 12 = 96' },
  { id: 'mcd', t: 'MCD', q: 'MCD(18, 24) = ?', a: 6, hint: 'Divisores comunes: 1, 2, 3, 6' },
  { id: 'mcm', t: 'MCM', q: 'MCM(4, 6) = ?', a: 12, hint: 'Múltiplos comunes: 12, 24...' },
  { id: 'frac', t: 'Fracción', q: '1/2 + 1/3 (simplificado) = ?', a: '5/6', hint: 'MCM(2,3)=6' },
  { id: 'simpl', t: 'Simplificar', q: '12/16 simplificada = ?', a: '3/4', hint: 'MCD(12,16)=4' },
  { id: 'perimetro', t: 'Perímetro', q: 'Cuadrado L=8 → P = ?', a: 32, hint: '4 × 8' },
  { id: 'area', t: 'Área', q: 'Rectángulo 5×7 → A = ?', a: 35, hint: 'base × altura' },
  { id: 'volumen', t: 'Volumen', q: 'Cubo L=4 → V = ?', a: 64, hint: '4×4×4' },
  { id: 'potencia', t: 'Potencia', q: '3^4 = ?', a: 81, hint: '3×3×3×3' },
  { id: 'raiz', t: 'Raíz', q: '√49 = ?', a: 7, hint: '7 × 7 = 49' },
];

const DEMO_DES: Record<string, string> = {
  'Perímetro': '¿Cuál es el perímetro de un cuadrado cuyo lado mide 8 m?',
  'Área': 'Calcula el área (en m²) de un rectángulo de 5 m × 7 m.',
  'Volumen': '¿Cuál es el volumen de un cubo cuyo lado mide 4 m?',
  'Fracción': '1/2 + 1/3 = ?',
  'Simplificar': 'Simplifica la fracción 12/16 a su mínima expresión.',
  'MCD': '¿Cuál es el MCD de 18 y 24?',
  'MCM': '¿Cuál es el MCM de 4 y 6?',
  'Potencia': 'Calcula: 3^4 = ?',
  'Raíz': 'Calcula: √49 = ?',
};

export default function DesafioModal5to({ isOpen, onClose }: DesafioModal5toProps) {
  const { updateStats } = useBook5();

  const [desafioIdx, setDesafioIdx] = useState<number>(() => {
    try {
      const d = new Date();
      return (d.getDate() * 7 + d.getMonth()) % DESAFIOS_5TO.length;
    } catch {
      return 3; // División por defecto
    }
  });

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [demoHtml, setDemoHtml] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>({
    type: null,
    msg: '',
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentDesafio = DESAFIOS_5TO[desafioIdx] || DESAFIOS_5TO[3];

  // Escuchar tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Audio helpers
  const playTono = (freq = 520, duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch {}
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

  // Comprobar si ya se completó hoy
  useEffect(() => {
    if (!isOpen) return;
    try {
      const day = new Date().toISOString().slice(0, 10);
      const done =
        localStorage.getItem(`fedor5_desafio_${day}`) === '1' ||
        localStorage.getItem(`fedor5_desafio_${currentDesafio.id}_${day}`) === '1';
      setIsCompleted(done);
      if (done) {
        setFeedback({
          type: 'success',
          msg: `✓ ¡Completado hoy! Respuesta: ${currentDesafio.a}`,
        });
      } else {
        setFeedback({ type: null, msg: '' });
      }
    } catch {
      setIsCompleted(false);
    }
    setUserAnswer('');
  }, [isOpen, currentDesafio]);

  // Sincronizar FZ y generar HTML visual
  useEffect(() => {
    if (!isOpen || !currentDesafio) return;
    try {
      if (typeof window !== 'undefined') {
        (window as any).FZ = FZ;
        (window as any).fedor5Hablar = hablar;
        (window as any).fedor5Tono = playTono;
        (window as any).hablar = hablar;
        (window as any).tono = playTono;
      }

      const query = DEMO_DES[currentDesafio.t] || currentDesafio.q;
      if (FZ && FZ.crear) {
        const html = FZ.crear({ q: query, ctx: '' }, 'ex');
        setDemoHtml(html || '');
      }
    } catch {
      setDemoHtml('');
    }
  }, [isOpen, currentDesafio]);

  const handleCheck = () => {
    let val = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
    if (!val) {
      // Buscar si el usuario escribió en las casillas interactivas del motor FZ
      const rInputs = Array.from(document.querySelectorAll('.fz-col tr.rs input')) as HTMLInputElement[];
      if (rInputs.length > 0) {
        const combined = rInputs.map((inp) => inp.value).join('').trim();
        if (combined) val = combined.toLowerCase().replace(/\s+/g, '');
      }
    }

    if (!val) return;

    const normalizedAns = String(currentDesafio.a).trim().toLowerCase().replace(/\s+/g, '');

    if (val === normalizedAns) {
      playTono(650);
      setTimeout(() => playTono(880), 120);
      hablar('¡Correcto! Has completado el desafío del día. Ganaste 150 puntos de experiencia.');
      setIsCompleted(true);
      setFeedback({
        type: 'success',
        msg: `🎉 ¡Correcto! +150 XP. Respuesta: ${currentDesafio.a}`,
      });
      try {
        const day = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`fedor5_desafio_${day}`, '1');
        localStorage.setItem(`fedor5_desafio_${currentDesafio.id}_${day}`, '1');
        updateStats(100, 1, 50);
      } catch {}
    } else {
      playTono(280);
      hablar('Intenta de nuevo.');
      setFeedback({
        type: 'error',
        msg: `❌ Casi lo logras. Pista: ${currentDesafio.hint}`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="desafio-modal-bg animate-fadeIn"
    >
      <style>{`
        .desafio-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(18, 8, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .desafio-modal-card {
          background: #ffffff;
          border-radius: 24px;
          max-width: 720px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 20px 24px 22px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.45);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
          animation: popIn 0.18s ease-out;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .desafio-modal-card::-webkit-scrollbar {
          width: 6px;
        }
        .desafio-modal-card::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .desafio-modal-card::-webkit-scrollbar-thumb {
          background: #C5BFEE;
          border-radius: 8px;
        }
        .desafio-modal-card::-webkit-scrollbar-thumb:hover {
          background: #8B3EDB;
        }

        .desafio-close-btn {
          position: absolute;
          right: 14px;
          top: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          z-index: 2;
        }
        .desafio-close-btn:hover {
          background: #6C28B4;
          color: #ffffff;
          transform: scale(1.05);
        }

        .desafio-header-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #2A0F60;
          margin: 0 44px 6px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.2;
        }

        .desafio-sub-label {
          font-size: 12px;
          font-weight: 800;
          color: #2A0F60;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 4px;
          margin-bottom: 2px;
        }

        .desafio-category {
          font-family: 'Baloo 2', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #B45309;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .desafio-equation {
          font-family: 'Baloo 2', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #1A1033;
          text-align: center;
          margin: 12px 0 16px;
          line-height: 1.2;
        }

        /* ══════════════════════════════════════════════════════════════
           REGLAS CSS PARA EL MOTOR FZ: CERO SUPERPOSICIONES
           ══════════════════════════════════════════════════════════════ */
        .fz {
          margin: 12px 0 16px !important;
          border-radius: 20px !important;
          background: #FFFFFF !important;
          border: 2px solid #C5BFEE !important;
          box-shadow: 0 4px 18px rgba(60, 20, 120, 0.06) !important;
          overflow: hidden !important;
          font-family: 'Nunito', sans-serif !important;
          color: #1A1033 !important;
          text-align: left !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .fz-h {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 8px !important;
          padding: 10px 14px !important;
          background: linear-gradient(90deg, var(--fz1, #16876A), var(--fz2, #24C496)) !important;
          color: #ffffff !important;
          box-sizing: border-box !important;
        }

        .fz-h .t {
          font-family: 'Baloo 2', 'Nunito', sans-serif !important;
          font-weight: 900 !important;
          font-size: 15px !important;
          color: #ffffff !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          letter-spacing: 0.01em !important;
        }

        .fz-h .t small {
          font-family: 'Nunito', sans-serif !important;
          font-weight: 800 !important;
          font-size: 12px !important;
          opacity: 0.9 !important;
          margin-left: 6px !important;
          color: #ffffff !important;
        }

        .fz-h button {
          background: rgba(255, 255, 255, 0.22) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.45) !important;
          color: #ffffff !important;
          border-radius: 8px !important;
          padding: 2px 10px !important;
          font-size: 13px !important;
          font-weight: 900 !important;
          cursor: pointer !important;
          transition: background 0.15s ease !important;
        }

        .fz-h button:hover {
          background: rgba(255, 255, 255, 0.35) !important;
        }

        .fz-b {
          padding: 14px 16px !important;
          overflow-x: auto !important;
          box-sizing: border-box !important;
        }

        .fz.min .fz-b, .fz.min .fz-f {
          display: none !important;
        }

        .fz-f {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          padding: 0 16px 14px !important;
          align-items: center !important;
          box-sizing: border-box !important;
        }

        .fz-tip {
          font-size: 12.5px !important;
          font-weight: 800 !important;
          color: #16876A !important;
          margin-top: 10px !important;
          text-align: left !important;
          line-height: 1.4 !important;
        }

        .fz-msg {
          font-weight: 900 !important;
          font-size: 13.5px !important;
          color: #3D1468 !important;
          padding: 10px 14px !important;
          background: #FFFFFF !important;
          border-radius: 14px !important;
          border: 2px dashed #C5BFEE !important;
          width: 100% !important;
          box-sizing: border-box !important;
          text-align: left !important;
        }

        /* Chips de la tabla del divisor */
        .fz-chips {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 6px !important;
          align-items: center !important;
          max-width: 100% !important;
          margin: 4px 0 !important;
        }

        .fz-chip {
          min-width: 38px !important;
          padding: 6px 11px !important;
          border-radius: 12px !important;
          background: #FFFFFF !important;
          border: 2px solid #D9CCFF !important;
          font-weight: 900 !important;
          font-size: 13px !important;
          color: #1A1033 !important;
          text-align: center !important;
          cursor: pointer !important;
          transition: all 0.15s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          white-space: nowrap !important;
          box-sizing: border-box !important;
          line-height: 1.2 !important;
        }

        .fz-chip:hover {
          border-color: #A78BFA !important;
          transform: translateY(-1px) !important;
        }

        .fz-chip.on {
          background: #FFE066 !important;
          border-color: #F5A524 !important;
          transform: scale(1.05) !important;
        }

        /* Botones del motor FZ */
        .fz-btn {
          border: none !important;
          border-radius: 12px !important;
          padding: 8px 14px !important;
          font-weight: 900 !important;
          font-size: 13px !important;
          cursor: pointer !important;
          font-family: 'Nunito', sans-serif !important;
          color: #fff !important;
          background: linear-gradient(135deg, #5C21A6, #8B3EDB) !important;
          box-shadow: 0 3px 10px rgba(92, 33, 166, 0.25) !important;
          transition: transform 0.12s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
        .fz-btn:hover {
          transform: translateY(-2px) !important;
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A) !important;
          box-shadow: 0 3px 10px rgba(232, 101, 10, 0.25) !important;
        }
        .fz-btn.g {
          background: linear-gradient(135deg, #16876A, #24C496) !important;
          box-shadow: 0 3px 10px rgba(22, 135, 106, 0.25) !important;
        }
        .fz-btn.b {
          background: linear-gradient(135deg, #0E6BA8, #38BDF8) !important;
          box-shadow: 0 3px 10px rgba(14, 107, 168, 0.25) !important;
        }
        .fz-btn.w {
          background: #FFFFFF !important;
          color: #5C21A6 !important;
          border: 2px solid #C5BFEE !important;
          box-shadow: none !important;
        }

        /* Pizarra en columnas / Operaciones verticales sin colisión de Tailwind */
        .fz-col {
          border-collapse: separate !important;
          border-spacing: 5px !important;
          margin: 0 auto !important;
        }
        .fz-col th {
          font-size: 12px !important;
          font-weight: 900 !important;
          color: #fff !important;
          border-radius: 8px !important;
          padding: 4px 6px !important;
          width: 44px !important;
          min-width: 40px !important;
          text-align: center !important;
          box-sizing: border-box !important;
        }
        .fz-col td {
          width: 44px !important;
          height: 44px !important;
          text-align: center !important;
          font-family: 'Baloo 2', sans-serif !important;
          font-size: 26px !important;
          font-weight: 900 !important;
          color: #1A1033 !important;
          border-radius: 10px !important;
          background: #FFFFFF !important;
          border: 2px solid #EEE8FB !important;
          box-sizing: border-box !important;
          padding: 0 !important;
        }
        .fz-col td.op {
          background: transparent !important;
          border: none !important;
          color: #E8650A !important;
          font-size: 26px !important;
        }
        .fz-col td.nb {
          background: transparent !important;
          border: none !important;
        }
        .fz-col td.cm {
          width: 14px !important;
          background: transparent !important;
          border: none !important;
          font-size: 30px !important;
          color: #C94B22 !important;
        }
        .fz-col tr.cr td {
          height: 28px !important;
          font-size: 15px !important;
          background: transparent !important;
          border: none !important;
        }
        .fz-col input {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          background: transparent !important;
          text-align: center !important;
          font-family: 'Baloo 2', sans-serif !important;
          font-size: 26px !important;
          font-weight: 900 !important;
          color: #16876A !important;
          outline: none !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
        }
        .fz-col tr.cr input {
          font-size: 15px !important;
          color: #C94B22 !important;
        }
        .fz-col tr.rs td {
          background: #FFFBEA !important;
          border: 2.5px dashed #F5C518 !important;
        }
        .fz-col tr.rs td.op, .fz-col tr.rs td.cm {
          background: transparent !important;
          border: none !important;
        }
        .fz-col tr.ln td {
          height: 4px !important;
          background: #1A1033 !important;
          border: none !important;
          border-radius: 2px !important;
          padding: 0 !important;
        }
        .fz-col td.hl {
          background: #FFE066 !important;
          transform: scale(1.08) !important;
          transition: all .2s !important;
        }

        /* Input y botón principales */
        .desafio-input-box {
          width: 100%;
          padding: 13px 18px;
          border: 2.5px solid #EA580C;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 800;
          text-align: center;
          color: #1A1033;
          background: #FFFFFF;
          margin-top: 10px;
          margin-bottom: 10px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .desafio-input-box:focus {
          border-color: #F97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
        }
        .desafio-input-box::placeholder {
          color: #9CA3AF;
          font-weight: 800;
        }

        .desafio-check-btn {
          width: 100%;
          padding: 14px 18px;
          background: linear-gradient(135deg, #F97316, #EA580C);
          color: #FFFFFF;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 900;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.12s ease, filter 0.12s ease;
          margin-bottom: 8px;
        }
        .desafio-check-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .desafio-check-btn:active {
          transform: translateY(1px);
        }

        .desafio-hint-line {
          font-size: 13px;
          font-weight: 800;
          color: #7A6500;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
        }
      `}</style>

      <div className="desafio-modal-card">
        {/* Botón de cerrar idéntico */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="desafio-close-btn"
        >
          ✕
        </button>

        {/* Encabezado */}
        <div className="desafio-header-title">
          <span>🎯</span>
          <span>Desafío del Día</span>
        </div>

        {/* Sub-rótulo y Categoría */}
        <div className="desafio-sub-label">
          <span>🎯</span>
          <span>DESAFÍO DEL DÍA</span>
        </div>

        <div className="desafio-category">
          {currentDesafio.t}
        </div>

        {/* Ecuación / Pregunta principal centrada */}
        <div className="desafio-equation">
          {currentDesafio.q}
        </div>

        {/* Manipulativo Pedagógico Interactivo (FZ Visual Engine) */}
        {demoHtml && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: demoHtml }}
          />
        )}

        {/* Mensaje de feedback / estado */}
        {feedback.msg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              fontWeight: 900,
              fontSize: '13.5px',
              textAlign: 'center',
              marginBottom: '10px',
              background: feedback.type === 'success' ? '#DCF5EE' : '#FEE2E2',
              border: `2px solid ${feedback.type === 'success' ? '#14B8A6' : '#EF4444'}`,
              color: feedback.type === 'success' ? '#0D9488' : '#B91C1C',
            }}
          >
            {feedback.msg}
          </div>
        )}

        {/* Input de respuesta del estudiante */}
        <input
          id="desafioInput"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCheck();
          }}
          placeholder="Tu respuesta"
          className="desafio-input-box"
          disabled={isCompleted}
        />

        {/* Botón Comprobar */}
        <button
          type="button"
          onClick={handleCheck}
          className="desafio-check-btn"
          disabled={isCompleted}
        >
          <span>✅</span>
          <span>Comprobar</span>
        </button>

        {/* Pista pedagógica inferior */}
        <div className="desafio-hint-line">
          <span>💡</span>
          <span>Pista: {currentDesafio.hint}</span>
        </div>
      </div>
    </div>
  );
}
