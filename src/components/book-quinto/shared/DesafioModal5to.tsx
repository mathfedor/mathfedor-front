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

export default function DesafioModal5to({ isOpen, onClose }: DesafioModal5toProps) {
  const { updateStats } = useBook5();

  const [desafioIdx, setDesafioIdx] = useState<number>(() => {
    try {
      const d = new Date();
      return (d.getDate() * 7 + d.getMonth()) % DESAFIOS_5TO.length;
    } catch {
      return 0;
    }
  });

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [demoHtml, setDemoHtml] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>({
    type: null,
    msg: '',
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentDesafio = DESAFIOS_5TO[desafioIdx] || DESAFIOS_5TO[0];

  // Comprobar si ya se completó hoy
  useEffect(() => {
    if (!isOpen) return;
    try {
      const day = new Date().toISOString().slice(0, 10);
      const done = localStorage.getItem(`fedor5_desafio_${day}`) === '1';
      setIsCompleted(done);
      if (done) {
        setFeedback({
          type: 'success',
          msg: '¡Ya completaste el desafío de hoy! Ganaste tus recompensas.',
        });
      } else {
        setFeedback({ type: null, msg: '' });
      }
    } catch {}
  }, [isOpen, desafioIdx]);

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
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
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

  // Render FZ Demo
  useEffect(() => {
    if (!isOpen || !currentDesafio) return;
    try {
      if (FZ && FZ.crear) {
        const html = FZ.crear({ q: currentDesafio.q, ctx: '' }, 'ej');
        setDemoHtml(html || '');
      }
    } catch {
      setDemoHtml('');
    }
  }, [isOpen, desafioIdx, currentDesafio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const normalizedUser = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const normalizedAns = String(currentDesafio.a).trim().toLowerCase().replace(/\s+/g, '');

    if (normalizedUser === normalizedAns) {
      playTono(650);
      setTimeout(() => playTono(880), 120);
      hablar('¡Correcto! Desafío diario completado.');
      setFeedback({
        type: 'success',
        msg: '¡Excelente! Has resuelto el desafío correctamente. +100 Monedas 🪙 y +50 XP ⭐',
      });
      setIsCompleted(true);
      try {
        const day = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`fedor5_desafio_${day}`, '1');
        updateStats(100, 1, 50);
      } catch {}
    } else {
      playTono(280);
      hablar('Intenta de nuevo.');
      setFeedback({
        type: 'error',
        msg: `Casi lo logras. Pista: ${currentDesafio.hint}`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 flex-shrink-0">
          <h2
            className="text-2xl font-black text-[#B45309] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span>🎯</span>
            <span>Desafío Matemático del Día (5°)</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 rounded-full bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* Card del Desafío Principal */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full">
                🎯 RETO DIARIO
              </span>
              <span className="text-xs font-black text-amber-100">Recompensa: +100 🪙 +50 XP</span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-black mb-2"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {currentDesafio.t}
            </h3>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 text-center my-3">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                {currentDesafio.q}
              </span>
            </div>
          </div>

          {/* Formulario de Respuesta */}
          <form onSubmit={handleSubmit} className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-xs space-y-3">
            <label className="block text-xs sm:text-sm font-black text-gray-800">
              Escribe tu respuesta aquí:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Ejemplo: 801 ó 5/6"
                disabled={isCompleted}
                className="flex-1 h-12 px-4 rounded-2xl border-2 border-purple-200 focus:border-amber-500 font-black text-lg text-gray-900 outline-none transition-all disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isCompleted || !userAnswer.trim()}
                className="px-6 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                Comprobar
              </button>
            </div>

            {/* Mensajes de Feedback */}
            {feedback.msg && (
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border border-rose-300'
                }`}
              >
                <span>{feedback.type === 'success' ? '🎉' : '💡'}</span>
                <span>{feedback.msg}</span>
              </div>
            )}
          </form>

          {/* Pizarra FZ con ayuda visual */}
          {demoHtml && (
            <div className="bg-[#FAF8FF] border-2 border-[#D9CCFF] rounded-3xl p-4 shadow-sm">
              <div className="text-xs font-black text-[#5C21A6] mb-2 flex items-center gap-1.5">
                <span>🧠</span>
                <span>Pista visual del Método Fedor:</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: demoHtml }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
