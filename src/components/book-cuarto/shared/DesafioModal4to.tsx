'use client';

import React, { useState, useEffect } from 'react';
import { FZ } from './fedor-visual-lab-engine';

interface DesafioModal4toProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStats?: (coinsToAdd: number, streakToAdd: number, xpToAdd: number) => void;
}

export interface DesafioItem {
  id: string;
  t: string;
  q: string;
  a: string | number;
  hint: string;
}

// ── 13 Desafíos del Día del HTML original ──
export const DESAFIOS_4TO: DesafioItem[] = [
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

export default function DesafioModal4to({ isOpen, onClose, onUpdateStats }: DesafioModal4toProps) {
  // Inicializar en 'Resta rápida' (índice 1, coincidente con la fórmula del HTML: (d.getDate()*7 + d.getMonth()) % 13)
  const [desafioIdx, setDesafioIdx] = useState<number>(() => {
    try {
      const d = new Date();
      const calculated = (d.getDate() * 7 + d.getMonth()) % DESAFIOS_4TO.length;
      return calculated >= 0 && calculated < DESAFIOS_4TO.length ? calculated : 1;
    } catch {
      return 1; // Resta rápida por defecto
    }
  });

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [demoHtml, setDemoHtml] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>({
    type: null,
    msg: '',
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentDesafio = DESAFIOS_4TO[desafioIdx] || DESAFIOS_4TO[1];

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

  // Verificar si ya fue completado hoy
  useEffect(() => {
    try {
      const day = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`fedor4_desafio_${currentDesafio.id}_${day}`) === '1';
      setIsCompleted(saved);
      if (saved) {
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
  }, [currentDesafio]);

  // Sincronizar motor FZ
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      (window as any).FZ = FZ;
      (window as any).fedor5Hablar = hablar;
      (window as any).fedor5Tono = playTono;
      (window as any).hablar = hablar;
      (window as any).tono = playTono;

      const query = DEMO_DES[currentDesafio.t] || currentDesafio.q;
      const html = FZ.crear ? FZ.crear({ q: query, ctx: '' }, 'ex') : '';
      setDemoHtml(html || '');
    }
  }, [currentDesafio, isOpen]);

  // Manejar comprobación
  const handleCheck = () => {
    // Buscar respuesta en el input principal o en las celdas amarillas si las llenó
    let val = userAnswer.trim().toLowerCase();
    if (!val) {
      const r0 = (document.getElementById('fz1r0') as HTMLInputElement)?.value || '';
      const r1 = (document.getElementById('fz1r1') as HTMLInputElement)?.value || '';
      const r2 = (document.getElementById('fz1r2') as HTMLInputElement)?.value || '';
      const combined = `${r0}${r1}${r2}`.trim();
      if (combined) val = combined;
    }

    const expected = String(currentDesafio.a).trim().toLowerCase();
    if (val === expected) {
      playTono(880, 0.3);
      hablar('¡Correcto! Has completado el desafío del día. Ganaste 150 puntos de experiencia.');
      setIsCompleted(true);
      setFeedback({
        type: 'success',
        msg: `🎉 ¡Correcto! +150 XP. Respuesta: ${currentDesafio.a}`,
      });
      try {
        const day = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`fedor4_desafio_${currentDesafio.id}_${day}`, '1');
      } catch {}
      if (onUpdateStats) {
        onUpdateStats(50, 1, 150);
      }
    } else {
      playTono(320, 0.25);
      setFeedback({
        type: 'error',
        msg: `❌ Aún no es correcto. Revisa el procedimiento y la pista.`,
      });
      hablar('Aún no es correcto. Revisa el procedimiento y la pista.');
    }
  };

  const handleCambiar = (delta: number) => {
    playTono(520);
    setDesafioIdx((prev) => (prev + delta + DESAFIOS_4TO.length) % DESAFIOS_4TO.length);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      {/* Estilos del Motor FZ idénticos al original de Fedor */}
      <style>{`
        .fz {
          margin: 12px 0 14px;
          border-radius: 20px;
          background: linear-gradient(160deg, #F8F5FF, #EEF7FF);
          border: 2.5px solid #D9CCFF;
          box-shadow: 0 8px 22px rgba(60, 20, 120, 0.10);
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          color: #1A1033;
          text-align: left;
        }
        .fz-h {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: linear-gradient(90deg, var(--fz1, #5C21A6), var(--fz2, #8B3EDB));
          color: #fff;
        }
        .fz-h .t {
          flex: 1;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 16px;
          color: #fff;
        }
        .fz-h .t small {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 12px;
          opacity: .85;
          margin-left: 8px;
          color: #fff;
        }
        .fz-h button {
          background: rgba(255, 255, 255, 0.2);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          color: #fff;
          border-radius: 10px;
          padding: 3px 12px;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: background .15s;
        }
        .fz-h button:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .fz-b {
          padding: 14px 16px;
          overflow-x: auto;
        }
        .fz.min .fz-b, .fz.min .fz-f {
          display: none;
        }
        .fz-col {
          border-collapse: separate;
          border-spacing: 5px;
          margin: 0 auto;
        }
        .fz-col th {
          font-size: 13px;
          font-weight: 900;
          color: #fff;
          border-radius: 8px;
          padding: 4px 6px;
          width: 46px;
          min-width: 44px;
          text-align: center;
        }
        .fz-col td {
          width: 46px;
          height: 46px;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #1A1033;
          border-radius: 10px;
          background: #FFFFFF;
          border: 2px solid #EEE8FB;
        }
        .fz-col td.op {
          background: transparent !important;
          border: none !important;
          color: #E8650A;
          font-size: 26px;
        }
        .fz-col tr.cr td {
          height: 28px;
          font-size: 15px;
          background: transparent !important;
          border: none !important;
        }
        .fz-col input {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #16876A;
          outline: none;
        }
        .fz-col tr.cr input {
          font-size: 15px;
          color: #C94B22;
        }
        .fz-col tr.ln td {
          height: 4px;
          background: #1A1033;
          border: none;
          border-radius: 2px;
          padding: 0;
        }
        .fz-col tr.rs td {
          background: #FFFBEA !important;
          border: 2.5px dashed #F5C518 !important;
          border-radius: 10px;
        }
        .fz-col tr.rs td.op {
          background: transparent !important;
          border: none !important;
        }
        .fz-col td.hl {
          background: #FFE066 !important;
          transform: scale(1.08);
          transition: all .2s;
        }
        .fz-tip {
          font-size: 13px;
          font-weight: 800;
          color: #6B5E8A;
          margin-top: 10px;
          text-align: left;
        }
        .fz-f {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 16px 16px;
          align-items: center;
        }
        .fz-btn {
          border: none;
          border-radius: 14px;
          padding: 10px 18px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          transition: transform .12s, box-shadow .12s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .fz-btn:hover {
          transform: translateY(-2px);
        }
        .fz-btn.w {
          background: #FFFFFF;
          color: #5C21A6;
          border: 2px solid #C5BFEE;
          box-shadow: 0 2px 8px rgba(92, 33, 166, 0.1);
        }
        .fz-btn.b {
          background: linear-gradient(135deg, #0284C7, #38BDF8);
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
          color: #fff;
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A);
          box-shadow: 0 4px 12px rgba(232, 101, 10, 0.3);
          color: #fff;
        }
        .fz-btn.g {
          background: linear-gradient(135deg, #16876A, #24C496);
          box-shadow: 0 4px 12px rgba(22, 135, 106, 0.3);
          color: #fff;
        }
        .fz-msg {
          font-weight: 900;
          font-size: 14px;
          color: #3D1468;
          padding: 10px 16px;
          background: #FFFFFF;
          border-radius: 14px;
          border: 2px dashed #C5BFEE;
          min-height: 20px;
          flex: 1;
          min-width: 200px;
        }
        .fz-c100 {
          width: 36px;
          height: 36px;
          display: inline-block;
          background: repeating-linear-gradient(0deg, #1A6CB4 0 3.6px, #4DA6FF 3.6px 4px), #4DA6FF;
          border: 1.5px solid #0A3D6E;
          border-radius: 3px;
          margin: 2px;
        }
        .fz-c10 {
          width: 8px;
          height: 36px;
          display: inline-block;
          background: repeating-linear-gradient(0deg, #16876A 0 3.6px, #6EE7B7 3.6px 4px);
          border: 1px solid #074F3A;
          border-radius: 2px;
          margin: 2px;
        }
        .fz-c1 {
          width: 8px;
          height: 8px;
          display: inline-block;
          background: #FF8C2A;
          border: 1px solid #7A3200;
          border-radius: 2px;
          margin: 2px;
        }
        #fz1x .row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 6px;
        }
      `}</style>

      {/* Tarjeta Modal Principal con bordes redondeados y espaciado generoso */}
      <div
        className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Encabezado Modal (Idéntico a la imagen de referencia) */}
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎯</span>
            <h2
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Desafío del Día
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 rounded-full bg-[#F3EEFF] hover:bg-[#E9DEFF] text-[#5C21A6] font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Modal con scroll suave */}
        <div className="overflow-y-auto pr-1 flex-1">
          {/* Fila de Título y Navegación entre desafíos */}
          <div className="flex items-start justify-between mt-1 mb-2">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#BE185D] flex items-center gap-1.5">
                <span>🎯</span>
                <span>DESAFÍO DEL DÍA</span>
              </div>
              <h3
                className="text-xl font-black text-[#92400E] mt-0.5"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                {currentDesafio.t}
              </h3>
            </div>

            {/* Navegador sutil entre los 13 desafíos */}
            <div className="flex items-center gap-1.5 bg-[#FAF5FF] border border-[#E9D5FF] px-2 py-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleCambiar(-1)}
                className="w-6 h-6 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                title="Desafío anterior"
              >
                ◀
              </button>
              <span className="text-xs font-bold text-purple-900 px-1">
                {desafioIdx + 1}/{DESAFIOS_4TO.length}
              </span>
              <button
                type="button"
                onClick={() => handleCambiar(1)}
                className="w-6 h-6 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                title="Desafío siguiente"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Enunciado Matemático Centrado en Gran Tamaño */}
          <div className="text-center py-2">
            <h2
              className="text-2xl sm:text-3xl font-black text-[#1A1033]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {currentDesafio.q}
            </h2>
          </div>

          {/* Manipulativo Pedagógico Interactivo FZ (Pizarra de Resta / Suma / etc.) */}
          {demoHtml && (
            <div
              className="w-full animate-fadeIn"
              dangerouslySetInnerHTML={{ __html: demoHtml }}
            />
          )}

          {/* Feedback interactivo si ya respondió o intentó */}
          {feedback.msg && (
            <div
              className={`p-3 rounded-2xl mb-3 text-center font-black text-sm border-2 animate-fadeIn ${
                feedback.type === 'success'
                  ? 'bg-[#DCF5EE] border-[#14B8A6] text-[#0D9488]'
                  : 'bg-[#FEE2E2] border-[#EF4444] text-[#B91C1C]'
              }`}
            >
              {feedback.msg}
            </div>
          )}

          {/* Área Inferior de Respuesta y Comprobación */}
          <div className="mt-2 space-y-3">
            <input
              id="desafioInput"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheck();
              }}
              placeholder="Tu respuesta"
              className="w-full p-3.5 border-[2.5px] border-[#EA580C] rounded-2xl text-center font-black text-xl text-[#1A1033] bg-white placeholder-gray-400 placeholder:font-bold focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all"
            />

            <button
              type="button"
              onClick={handleCheck}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-[#FF8C2A] to-[#E8650A] hover:brightness-105 active:scale-[0.99] text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/25 cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <span>✅</span>
              <span>Comprobar</span>
            </button>

            {/* Pista Pedagógica */}
            <div className="text-xs sm:text-sm font-bold text-[#92400E] text-left pt-1 flex items-center gap-1.5">
              <span>💡</span>
              <span>Pista: {currentDesafio.hint}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
