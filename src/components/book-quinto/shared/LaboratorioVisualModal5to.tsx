'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FZ } from './fedor-visual-lab-engine-5to';

interface LaboratorioVisualModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LabTool {
  id: string;
  name: string;
  color: string;
  labels: string[];
  defaults: (string | number)[];
  genText: (v: (string | number)[]) => string;
  iconRender: React.ReactNode;
}

const LAB_TOOLS: LabTool[] = [
  // Fila 1
  {
    id: 'sumar',
    name: 'Sumar',
    color: '#581C87',
    labels: ['a', 'b'],
    defaults: [47, 35],
    genText: (v) => `${v[0]} + ${v[1]} = ?`,
    iconRender: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="plus3d" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <path d="M12 4v16m-8-8h16" stroke="url(#plus3d)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'restar',
    name: 'Restar',
    color: '#7C3AED',
    labels: ['a', 'b'],
    defaults: [82, 47],
    genText: (v) => `${v[0]} - ${v[1]} = ?`,
    iconRender: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="minus3d" x1="12" y1="9" x2="12" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <path d="M5 12h14" stroke="url(#minus3d)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'multiplicar',
    name: 'Multiplicar',
    color: '#EA580C',
    labels: ['a', 'b'],
    defaults: [6, 7],
    genText: (v) => `${v[0]} × ${v[1]} = ?`,
    iconRender: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="mult3d" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <path d="M6 6l12 12M18 6L6 18" stroke="url(#mult3d)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'repartir',
    name: 'Repartir',
    color: '#16876A',
    labels: ['total', 'entre'],
    defaults: [23, 4],
    genText: (v) => `Se reparten ${v[0]} dulces entre ${v[1]} niños`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">🍬</span>,
  },
  {
    id: 'fraccion',
    name: 'Fracción',
    color: '#F59E0B',
    labels: ['arriba', 'abajo'],
    defaults: [6, 8],
    genText: (v) => `Simplifica la fracción ${v[0]}/${v[1]} a su mínima expresión.`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">🍕</span>,
  },
  {
    id: 'sumar-fracciones',
    name: 'Sumar fracciones',
    color: '#D97706',
    labels: ['a/b', 'c/d'],
    defaults: ['1/2', '1/3'],
    genText: (v) => `${v[0]} + ${v[1]} = ?`,
    iconRender: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="plusFrac" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <path d="M12 4v16m-8-8h16" stroke="url(#plusFrac)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
  },
  // Fila 2
  {
    id: 'divisores',
    name: 'Divisores',
    color: '#0F766E',
    labels: ['número'],
    defaults: [24],
    genText: (v) => `¿Cuáles son los divisores de ${v[0]}? divisor`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">🔍</span>,
  },
  {
    id: 'mcd',
    name: 'MCD',
    color: '#0E7490',
    labels: ['a', 'b'],
    defaults: [12, 18],
    genText: (v) => `¿Cuál es el MCD de ${v[0]} y ${v[1]}?`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">🔗</span>,
  },
  {
    id: 'mcm',
    name: 'MCM',
    color: '#0284C7',
    labels: ['a', 'b'],
    defaults: [4, 6],
    genText: (v) => `¿Cuál es el MCM de ${v[0]} y ${v[1]}?`,
    iconRender: (
      <div className="w-7 h-7 rounded-lg bg-sky-300/35 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M21 21v-5h-5" />
        </svg>
      </div>
    ),
  },
  {
    id: 'potencia',
    name: 'Potencia',
    color: '#7C3AED',
    labels: ['base', 'exp.'],
    defaults: [3, 2],
    genText: (v) => `Calcula: ${v[0]}^${v[1]} = ?`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">⚡</span>,
  },
  {
    id: 'raiz',
    name: 'Raíz',
    color: '#9333EA',
    labels: ['número'],
    defaults: [36],
    genText: (v) => `Calcula: √${v[0]} = ?`,
    iconRender: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 14l3.5 5L13 5h7" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'unidades',
    name: 'Unidades',
    color: '#0891B2',
    labels: ['valor', 'de', 'a'],
    defaults: [3, 'm', 'cm'],
    genText: (v) => `¿A cuántos ${v[2]} equivalen ${v[0]} ${v[1]}?`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">📏</span>,
  },
  // Fila 3
  {
    id: 'area',
    name: 'Área',
    color: '#059669',
    labels: ['largo', 'ancho'],
    defaults: [6, 4],
    genText: (v) => `Calcula el área (en m²) de un rectángulo de ${v[0]} m × ${v[1]} m.`,
    iconRender: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="#34D399" />
        <rect x="5" y="5" width="14" height="14" rx="3" fill="#A7F3D0" fillOpacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'volumen',
    name: 'Volumen',
    color: '#0D9488',
    labels: ['l', 'a', 'h'],
    defaults: [3, 2, 4],
    genText: (v) => `Calcula el volumen (en m³) de un prisma de ${v[0]} m × ${v[1]} m × ${v[2]} m.`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">🧊</span>,
  },
  {
    id: 'porcentaje',
    name: 'Porcentaje',
    color: '#BE185D',
    labels: ['%', 'de'],
    defaults: [25, 200],
    genText: (v) => `Halla el ${v[0]} % de ${v[1]}.`,
    iconRender: <span className="text-2xl font-black text-white leading-none select-none">%</span>,
  },
  {
    id: 'balanza',
    name: 'Balanza',
    color: '#3730A3',
    labels: ['x +', '='],
    defaults: [7, 15],
    genText: (v) => `Resuelve la ecuación: x + ${v[0]} = ${v[1]}`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">⚖️</span>,
  },
  {
    id: 'dado',
    name: 'Dado',
    color: '#B45309',
    labels: [],
    defaults: [],
    genText: () => '¿Cuál es la probabilidad al lanzar un dado de 6 caras?',
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">🎲</span>,
  },
  {
    id: 'bolsa',
    name: 'Bolsa',
    color: '#92400E',
    labels: ['rojas', 'total'],
    defaults: [3, 10],
    genText: (v) => `En una bolsa hay ${v[1]} bolas y ${v[0]} son rojas.`,
    iconRender: <span className="text-2xl sm:text-3xl leading-none select-none">👜</span>,
  },
];

export default function LaboratorioVisualModal5to({ isOpen, onClose }: LaboratorioVisualModal5toProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [inputs, setInputs] = useState<(string | number)[]>(LAB_TOOLS[0].defaults);
  const [htmlContent, setHtmlContent] = useState('');
  const boardRef = useRef<HTMLDivElement>(null);

  // Global helpers on window for inline event handlers generated by FZ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).FZ = FZ;

      // Colombian audio narration
      (window as any).fedor5Hablar = (text: string) => {
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

      // Sound chime
      (window as any).fedor5Tono = (freq = 520) => {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = typeof freq === 'number' ? freq : 520;
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
          }
        } catch {}
      };
    }
  }, []);

  const renderTool = (toolIndex: number, currentInputs: (string | number)[]) => {
    const tool = LAB_TOOLS[toolIndex];
    if (!tool) return;
    try {
      const parsed = currentInputs.map((val) => {
        const s = String(val).trim();
        return /^\d+$/.test(s) ? Number(s) : s;
      });
      const queryText = tool.genText(parsed);
      const generatedHtml = FZ.crear ? FZ.crear({ q: queryText, ctx: '' }, 'ej') : '';
      setHtmlContent(
        generatedHtml ||
          '<div class="p-8 text-center text-gray-500 font-bold text-sm bg-purple-50 rounded-2xl border border-purple-200">Prueba con otros números</div>'
      );
    } catch {
      setHtmlContent(
        '<div class="p-8 text-center text-gray-500 font-bold text-sm bg-purple-50 rounded-2xl border border-purple-200">Prueba con otros números</div>'
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      renderTool(selectedIdx, inputs);
    }
  }, [isOpen]);

  const handleSelectTool = (idx: number) => {
    setSelectedIdx(idx);
    const newDefaults = [...LAB_TOOLS[idx].defaults];
    setInputs(newDefaults);
    renderTool(idx, newDefaults);
    if (typeof window !== 'undefined' && typeof (window as any).fedor5Tono === 'function') {
      (window as any).fedor5Tono();
    }
  };

  const handleGo = () => {
    renderTool(selectedIdx, inputs);
    if (typeof window !== 'undefined' && typeof (window as any).fedor5Tono === 'function') {
      (window as any).fedor5Tono();
    }
  };

  if (!isOpen) return null;

  const currentTool = LAB_TOOLS[selectedIdx];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Visual lab styles injected directly */}
      <style>{`
        /* ── Visual Lab Scrollbar & Styles ── */
        .lab-modal-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .lab-modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .lab-modal-scroll::-webkit-scrollbar-thumb {
          background: #DDD6FE;
          border-radius: 8px;
        }
        .lab-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: #A78BFA;
        }

        .fz {
          margin: 0 0 16px;
          border-radius: 24px;
          background: #FFFFFF;
          border: 2px solid #E9D5FF;
          box-shadow: 0 6px 24px rgba(92, 33, 166, 0.08);
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          color: #1A1033;
          text-align: left;
        }
        .fz-h {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 14px 22px;
          background: #7C3AED !important;
          color: #FFFFFF !important;
        }
        .fz-h .t {
          flex: 1;
          font-family: 'Baloo 2', Nunito, sans-serif;
          font-weight: 900;
          font-size: 17px;
          letter-spacing: .01em;
          color: #FFFFFF !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .fz-h .t small {
          font-family: 'Nunito', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          opacity: .9;
          color: rgba(255, 255, 255, 0.9) !important;
          margin-left: 6px;
        }
        .fz-h button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #FFFFFF;
          border-radius: 12px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.15s ease;
        }
        .fz-h button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .fz-b {
          padding: 26px 22px 18px;
          overflow-x: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }
        .fz.min .fz-b, .fz.min .fz-f {
          display: none;
        }
        .fz-tip {
          display: block !important;
          font-size: 13.5px !important;
          font-weight: 800 !important;
          color: #374151 !important;
          margin: 18px 0 10px !important;
          text-align: center !important;
          font-family: 'Nunito', sans-serif !important;
        }
        .fz-f {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          padding: 6px 22px 24px !important;
          align-items: center !important;
          justify-content: center !important;
          background: #FFFFFF !important;
          border-top: none !important;
        }
        .fz-btn {
          border: none !important;
          border-radius: 12px !important;
          padding: 10px 18px !important;
          font-weight: 900 !important;
          font-size: 14px !important;
          cursor: pointer !important;
          font-family: 'Nunito', sans-serif !important;
          color: #FFFFFF !important;
          transition: transform 0.12s ease, filter 0.15s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .fz-btn:hover {
          transform: translateY(-2px) !important;
          filter: brightness(1.06) !important;
        }
        .fz-btn.w {
          background: #FFFFFF !important;
          color: #5C21A6 !important;
          border: 2px solid #C5BFEE !important;
          box-shadow: 0 2px 8px rgba(92, 33, 166, 0.08) !important;
        }
        .fz-btn.b {
          background: linear-gradient(135deg, #0284C7, #0EA5E9) !important;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25) !important;
        }
        .fz-btn.g {
          background: linear-gradient(135deg, #10B981, #059669) !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25) !important;
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A) !important;
        }
        .fz-msg {
          display: block !important;
          width: 100% !important;
          text-align: center !important;
          font-weight: 900 !important;
          font-size: 15px !important;
          color: #3D1468 !important;
          padding: 11px 18px !important;
          background: #FFFFFF !important;
          border-radius: 12px !important;
          border: 2px dashed #C5BFEE !important;
          min-height: 24px !important;
          margin-top: 6px !important;
          font-family: 'Baloo 2', Nunito, sans-serif !important;
        }
        /* Pizarra en columnas */
        .fz-col {
          border-collapse: separate;
          border-spacing: 6px;
          margin: 0 auto;
        }
        .fz-col th {
          font-size: 13px;
          font-weight: 900;
          color: #FFFFFF;
          border-radius: 8px;
          padding: 5px 12px;
          width: 50px;
          min-width: 48px;
          text-align: center;
        }
        .fz-col td {
          width: 50px;
          height: 50px;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #1A1033;
          border-radius: 12px;
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
        }
        .fz-col td.op {
          background: transparent;
          border: none;
          color: #EA580C;
          font-size: 30px;
        }
        .fz-col td.nb { background: transparent; border: none; }
        .fz-col td.cm { width: 14px; background: transparent; border: none; font-size: 32px; color: #C94B22; }
        .fz-col tr.cr td { height: 28px; font-size: 16px; background: transparent; border: none; }
        .fz-col input {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #16876A;
          outline: none;
        }
        .fz-col tr.cr input { font-size: 16px; color: #C94B22; }
        .fz-col tr.ln td {
          height: 4px;
          background: #1E1B4B;
          border: none;
          border-radius: 2px;
          padding: 0;
        }
        .fz-col tr.rs td {
          background: #FFFDF0;
          border: 2.5px dashed #F59E0B;
          border-radius: 12px;
        }
        .fz-col tr.rs td.op, .fz-col tr.rs td.cm { background: transparent; border: none; }
        /* Bloques base 10 */
        .fz-blk { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; align-items: flex-end; padding: 10px; }
        .fz-blk .g { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .fz-blk .row { display: flex; gap: 4px; align-items: flex-end; flex-wrap: wrap; max-width: 280px; justify-content: center; }
        .fz-blk .lab { font-weight: 900; font-size: 13px; color: #3D1468; }
        .fz-c100 { width: 44px; height: 44px; background: repeating-linear-gradient(0deg, #1A6CB4 0 3.6px, #4DA6FF 3.6px 4px), #4DA6FF; border: 1.5px solid #0A3D6E; border-radius: 4px; }
        .fz-c10 { width: 7px; height: 44px; background: repeating-linear-gradient(0deg, #16876A 0 3.6px, #6EE7B7 3.6px 4px); border: 1px solid #074F3A; border-radius: 2px; }
        .fz-c1 { width: 8px; height: 8px; background: #FF8C2A; border: 1px solid #7A3200; border-radius: 2px; }
        /* Puntos / Arreglos */
        .fz-dots { display: inline-grid; gap: 6px; padding: 10px; background: #FFFFFF; border-radius: 16px; border: 2px solid #EEE8FB; }
        .fz-dot { width: 20px; height: 20px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #FFD27A, #E8650A); box-shadow: 0 1px 3px rgba(0, 0, 0, .25); transition: all .25s; }
        .fz-dot.off { background: #E8DBFF; box-shadow: none; }
        .fz-dot.rest { background: radial-gradient(circle at 35% 30%, #FF9AA2, #C94B22); }
        .fz-dot.sel { background: radial-gradient(circle at 35% 30%, #8EF0C9, #16876A); }
        /* Reparto */
        .fz-plates { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .fz-plate { min-width: 74px; min-height: 74px; border-radius: 50%; background: radial-gradient(circle, #FFFFFF 55%, #EDE3FF 56%); border: 3px solid #C5BFEE; display: flex; flex-wrap: wrap; align-content: center; justify-content: center; gap: 2px; padding: 10px; position: relative; }
        .fz-plate b { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); background: #5C21A6; color: #fff; border-radius: 8px; font-size: 11px; padding: 0 6px; }
        .fz-pile { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; padding: 8px; background: #FFF6E0; border-radius: 14px; border: 2px dashed #F5C518; margin-bottom: 10px; min-height: 30px; }
        .fz-cand { font-size: 18px; line-height: 1; animation: fzPop .3s ease; }
        @keyframes fzPop { from { transform: scale(0); } to { transform: scale(1); } }
        /* Fracciones */
        .fz-frow { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: center; }
        .fz-bar { display: flex; height: 44px; border-radius: 10px; overflow: hidden; border: 2.5px solid #3D1468; background: #FFFFFF; min-width: 160px; max-width: 100%; }
        .fz-bar i { flex: 1; border-right: 2px solid #3D1468; cursor: pointer; transition: background .2s; }
        .fz-bar i:last-child { border-right: none; }
        .fz-bar i.on { background: linear-gradient(180deg, #FFB547, #FF8C2A); }
        .fz-bar i.on2 { background: linear-gradient(180deg, #6EE7B7, #16876A); }
        .fz-bar i.gb { border-right-width: 5px; }
        .fz-fr { display: inline-flex; flex-direction: column; align-items: center; font-family: "Baloo 2", sans-serif; font-weight: 900; font-size: 24px; line-height: 1; color: #3D1468; }
        .fz-fr span:first-child { border-bottom: 3px solid #3D1468; padding: 0 6px; }
        /* Grilla 10x10 */
        .fz-g100 { display: inline-grid; grid-template-columns: repeat(10, 22px); gap: 2px; padding: 6px; background: #3D1468; border-radius: 10px; }
        .fz-g100 i { width: 22px; height: 22px; background: #FFFFFF; border-radius: 3px; cursor: pointer; transition: background .15s; }
        .fz-g100 i.on { background: linear-gradient(135deg, #FFB547, #FF8C2A); }
        /* Chips */
        .fz-chips { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
        .fz-chip { min-width: 34px; padding: 5px 9px; border-radius: 12px; background: #FFFFFF; border: 2px solid #D9CCFF; font-weight: 900; font-size: 14px; text-align: center; cursor: pointer; transition: all .15s; }
        .fz-chip.on { background: #FFE066; border-color: #F5A524; transform: scale(1.08); }
        .fz-chip.cm { background: #6EE7B7; border-color: #16876A; }
        .fz-rowlab { font-family: "Baloo 2", sans-serif; font-weight: 900; font-size: 16px; color: #5C21A6; min-width: 88px; }
        /* Tablero de valor posicional */
        .fz-pv { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; }
        .fz-pv .c { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
        .fz-pv .c .h { font-size: 11px; font-weight: 900; color: #fff; border-radius: 8px; padding: 3px 6px; min-width: 46px; text-align: center; }
        .fz-pv .c .d { width: 48px; height: 56px; border-radius: 12px; background: #FFFFFF; border: 2.5px solid #D9CCFF; display: flex; align-items: center; justify-content: center; font-family: "Baloo 2", sans-serif; font-size: 32px; font-weight: 900; }
        .fz-pv .c.on .d { background: #FFE066; border-color: #F5A524; transform: translateY(-4px); }
        .fz-pv .cm { font-size: 40px; font-weight: 900; color: #C94B22; align-self: flex-end; margin-bottom: 6px; }
        /* Balanza y Recta SVG */
        .fz-eq { font-family: "Baloo 2", sans-serif; font-size: 24px; font-weight: 900; text-align: center; color: #3D1468; margin-top: 4px; }
        .fz-svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
      `}</style>

      {/* Main Modal Card */}
      <div
        className="w-full max-w-[900px] bg-white rounded-[32px] shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{
          fontFamily: "'Nunito', sans-serif",
          border: '2px solid #EDE9FE',
          boxShadow: '0 25px 65px rgba(25, 10, 50, 0.35)',
        }}
      >
        {/* Header Modal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px 16px',
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '26px',
              fontWeight: 900,
              color: '#2E1065',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0,
            }}
          >
            <span style={{ fontSize: '28px' }}>🧠</span>
            <span>Laboratorio visual</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#F5F2FF',
              color: '#6B21A8',
              fontWeight: 900,
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Content with clean spacing and limits */}
        <div
          className="lab-modal-scroll"
          style={{
            overflowY: 'auto',
            flex: 1,
            padding: '0 32px 28px',
          }}
        >
          {/* Banner Hero */}
          <div
            style={{
              background: 'linear-gradient(90deg, #A8227E 0%, #7C3AED 50%, #2563EB 100%)',
              borderRadius: '20px',
              padding: '22px 26px',
              marginBottom: '24px',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.18)',
            }}
          >
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '24px',
                fontWeight: 900,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 0 6px',
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontSize: '26px' }}>🧠</span>
              <span>Laboratorio visual</span>
            </h3>
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Elige una herramienta, cambia los números y experimenta. ¡Aquí puedes jugar sin límite!
            </p>
          </div>

          {/* 18 Tools Grid (Exactly 3 rows x 6 columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '12px',
              marginBottom: '26px',
            }}
          >
            {LAB_TOOLS.map((tool, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleSelectTool(idx)}
                  style={{
                    height: '82px',
                    borderRadius: '18px',
                    background: `linear-gradient(145deg, ${tool.color}, ${tool.color}E6)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 4px',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: isSelected ? '0 8px 20px rgba(0,0,0,0.25)' : '0 3px 8px rgba(0,0,0,0.12)',
                    outline: isSelected ? '3px solid rgba(255,255,255,0.85)' : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tool.iconRender}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      padding: '0 4px',
                      textAlign: 'center',
                      marginTop: '4px',
                    }}
                  >
                    {tool.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Input Control Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '18px',
              marginBottom: '26px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: '52px',
                color: '#2E1065',
                fontWeight: 900,
                fontSize: '22px',
                fontFamily: "'Baloo 2', sans-serif",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="rowPlus" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path d="M12 4v16m-8-8h16" stroke="url(#rowPlus)" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
              <span>{currentTool.name}:</span>
            </div>

            {currentTool.labels.map((lbl, k) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#64748B',
                  }}
                >
                  {lbl}
                </span>
                <input
                  type="text"
                  value={inputs[k] ?? ''}
                  onChange={(e) => {
                    const next = [...inputs];
                    next[k] = e.target.value;
                    setInputs(next);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGo();
                  }}
                  style={{
                    width: '105px',
                    height: '52px',
                    textAlign: 'center',
                    fontWeight: 900,
                    fontSize: '28px',
                    color: '#180D38',
                    backgroundColor: '#FFFFFF',
                    border: '2.5px solid #A78BFA',
                    borderRadius: '16px',
                    outline: 'none',
                    fontFamily: "'Baloo 2', sans-serif",
                    boxShadow: '0 2px 6px rgba(167, 139, 250, 0.15)',
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleGo}
              style={{
                height: '52px',
                padding: '0 24px',
                borderRadius: '16px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                fontFamily: "'Baloo 2', sans-serif",
                transition: 'transform 0.12s ease',
              }}
            >
              <span style={{ fontSize: '18px' }}>✨</span>
              <span>Crear</span>
            </button>
          </div>

          {/* Whiteboard / Canvas Container */}
          <div
            ref={boardRef}
            style={{
              width: '100%',
              minHeight: '260px',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
}

