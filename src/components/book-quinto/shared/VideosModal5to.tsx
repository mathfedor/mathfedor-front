'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VideosModal5toProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIntro?: () => void;
}

interface RawVideoTopic {
  k: string;
  t: string;
  frames: [string, string][];
}

interface VideoFrame {
  text: string;
  subt: string;
  isDraw?: boolean;
}

interface VideoOperation {
  a: number;
  b: number;
  op: string;
  r: number;
}

// ── 25 Videos temáticos originales del 5° grado ──
const RAW_VIDEO_TOPICS: RawVideoTopic[] = [
  {
    k: 'adicion_basica',
    t: 'Adición Básica · 5°',
    frames: [
      ['Ejemplo: 234 + 512', 'Observa la suma'],
      ['  234\n+ 512\n─────', 'Escribe en columna'],
      ['  234\n+ 512\n─────\n    6', 'Unidades: 4+2=6'],
      ['  234\n+ 512\n─────\n   46', 'Decenas: 3+1=4'],
      ['  234\n+ 512\n─────\n  746', 'Centenas: 2+5=7'],
      ['✅ 234 + 512 = 746', '¡Correcto!'],
    ],
  },
  {
    k: 'adicion_llevadas',
    t: 'Adición con Llevadas · 5°',
    frames: [
      ['Ejemplo: 456 + 278', 'Con llevadas'],
      ['  456\n+ 278\n─────', 'En columna'],
      ['  4 5 6\n+ 2 7 8\n─────\n      4', 'Unidades: 6+8=14, llevo 1'],
      ['  4 5 6\n+ 2 7 8\n─────\n    3 4', 'Decenas: 5+7+1=13, llevo 1'],
      ['  4 5 6\n+ 2 7 8\n─────\n  7 3 4', 'Centenas: 4+2+1=7'],
      ['✅ 456 + 278 = 734', 'Suma completa'],
    ],
  },
  {
    k: 'sustraccion_basica',
    t: 'Sustracción Básica · 5°',
    frames: [
      ['Ejemplo: 785 - 342', 'Resta simple'],
      ['  785\n- 342\n─────', 'Columnas'],
      ['  785\n- 342\n─────\n    3', '5-2=3'],
      ['  785\n- 342\n─────\n   43', '8-4=4'],
      ['  785\n- 342\n─────\n  443', '7-3=4'],
      ['✅ 785 - 342 = 443', 'Correcto'],
    ],
  },
  {
    k: 'sustraccion_prestamo',
    t: 'Sustracción con Préstamo · 5°',
    frames: [
      ['Ejemplo: 632 - 158', 'Con préstamo'],
      ['  632\n- 158\n─────', 'Vertical'],
      ['  6 3 2\n- 1 5 8\n─────\n      4', '2 no le quita a 8, pide prestado: 12-8=4'],
      ['  6 3 2\n- 1 5 8\n─────\n    7 4', 'Ahora quedan 2 decenas, pide prestado: 12-5=7'],
      ['  6 3 2\n- 1 5 8\n─────\n  4 7 4', '5-1=4 en centenas'],
      ['✅ 632 - 158 = 474', '¡Excelente!'],
    ],
  },
  {
    k: 'multi_1cifra',
    t: 'Multiplicación por 1 cifra · 5°',
    frames: [
      ['Ejemplo: 234 × 5', 'Multiplicación'],
      ['  234\n×   5\n─────', 'En columna'],
      ['  2 3 4\n×     5\n─────\n      0', '4×5=20, escribo 0 llevo 2'],
      ['  2 3 4\n×     5\n─────\n    7 0', '3×5=15+2=17, escribo 7 llevo 1'],
      ['  2 3 4\n×     5\n─────\n  1 1 7 0', '2×5=10+1=11'],
      ['✅ 234 × 5 = 1.170', 'Correcto'],
    ],
  },
  {
    k: 'multi_2cifras',
    t: 'Multiplicación por 2 cifras · 5°',
    frames: [
      ['Ejemplo: 45 × 23', 'Con 2 cifras'],
      ['  4 5\n× 2 3\n─────', 'Vertical'],
      ['   4 5\n×  2 3\n─────\n  1 3 5', 'Primero por 3: 45×3=135'],
      ['   4 5\n×  2 3\n─────\n  1 3 5\n+ 9 0', 'Luego por 20: 45×2=90 (decenas)'],
      ['   4 5\n×  2 3\n─────\n  1 3 5\n+ 9 0 _\n─────\n1 0 3 5', 'Suma final'],
      ['✅ 45 × 23 = 1.035', 'Producto'],
    ],
  },
  {
    k: 'division_exacta',
    t: 'División Exacta · 5°',
    frames: [
      ['Ejemplo: 84 ÷ 4', 'División'],
      ['84 | 4', 'Empezamos'],
      ['8÷4=2', 'Primer paso'],
      ['84 | 4\n8   | 2\n─\n 4', 'Bajamos el 4'],
      ['84 | 4\n8   | 21\n─\n 4\n 4\n─\n 0', '4÷4=1, resto 0'],
      ['✅ 84 ÷ 4 = 21', 'Exacta'],
    ],
  },
  {
    k: 'division_residuo',
    t: 'División con Residuo · 5°',
    frames: [
      ['Ejemplo: 97 ÷ 4', 'Con residuo'],
      ['97 | 4', 'Empezamos'],
      ['9÷4=2 (2×4=8, resta 1)', 'Primer paso'],
      ['97 | 4\n8   | 24\n─\n 17\n 16\n─\n  1', 'Bajamos 7, 17÷4=4 residuo 1'],
      ['✅ 97 ÷ 4 = 24 residuo 1', '24×4+1=97'],
    ],
  },
  {
    k: 'divisores',
    t: 'Divisores · 5°',
    frames: [
      ['Ejemplo: divisores de 12', 'Números que dividen a 12'],
      ['12 ÷ 1 = 12', '1 es divisor'],
      ['12 ÷ 2 = 6', '2 es divisor'],
      ['12 ÷ 3 = 4', '3 es divisor'],
      ['12 ÷ 4 = 3', '4 es divisor'],
      ['12 ÷ 6 = 2', '6 es divisor'],
      ['✅ 12 = {1, 2, 3, 4, 6, 12}', '6 divisores'],
    ],
  },
  {
    k: 'primos',
    t: 'Números Primos · 5°',
    frames: [
      ['Un número PRIMO tiene solo 2 divisores', '1 y él mismo'],
      ['2 = {1, 2}', 'Es primo'],
      ['3 = {1, 3}', 'Es primo'],
      ['5 = {1, 5}', 'Es primo'],
      ['7 = {1, 7}', 'Es primo'],
      ['11 = {1, 11}', 'Es primo'],
      ['✅ Primeros primos: 2, 3, 5, 7, 11, 13...', 'Recordar'],
    ],
  },
  {
    k: 'mcd',
    t: 'MCD · 5°',
    frames: [
      ['Ejemplo: MCD(12, 18)', 'Máximo Común Divisor'],
      ['Divisores de 12: 1, 2, 3, 4, 6, 12', 'Escribe'],
      ['Divisores de 18: 1, 2, 3, 6, 9, 18', 'Compara'],
      ['Comunes: 1, 2, 3, 6', 'Intersección'],
      ['El mayor común es 6', 'MCD'],
      ['✅ MCD(12, 18) = 6', 'Solución'],
    ],
  },
  {
    k: 'mcm',
    t: 'MCM · 5°',
    frames: [
      ['Ejemplo: MCM(4, 6)', 'Mínimo Común Múltiplo'],
      ['Múltiplos de 4: 4, 8, 12, 16, 20, 24', 'Lista'],
      ['Múltiplos de 6: 6, 12, 18, 24', 'Lista'],
      ['Comunes: 12, 24, ...', 'Coincidencias'],
      ['El menor común es 12', 'MCM'],
      ['✅ MCM(4, 6) = 12', 'Solución'],
    ],
  },
  {
    k: 'frac_simpl',
    t: 'Simplificar Fracciones · 5°',
    frames: [
      ['Ejemplo: 8/12', 'Simplificar'],
      ['MCD(8, 12) = 4', 'Buscar MCD'],
      ['8 ÷ 4 = 2', 'Numerador'],
      ['12 ÷ 4 = 3', 'Denominador'],
      ['✅ 8/12 = 2/3', 'Fracción reducida'],
    ],
  },
  {
    k: 'frac_homog',
    t: 'Fracciones Homogéneas · 5°',
    frames: [
      ['Ejemplo: 3/7 + 2/7', 'Mismo denominador'],
      ['Sumar solo numeradores', '3 + 2 = 5'],
      ['Denominador queda igual', '7'],
      ['✅ 3/7 + 2/7 = 5/7', 'Homogénea'],
    ],
  },
  {
    k: 'frac_heter',
    t: 'Fracciones Heterogéneas · 5°',
    frames: [
      ['Ejemplo: 1/2 + 1/3', 'Distinto denominador'],
      ['MCM(2, 3) = 6', 'Buscar MCM'],
      ['1/2 = 3/6', 'Convertir'],
      ['1/3 = 2/6', 'Convertir'],
      ['3/6 + 2/6 = 5/6', 'Sumar'],
      ['✅ 1/2 + 1/3 = 5/6', 'Resultado'],
    ],
  },
  {
    k: 'frac_multi',
    t: 'Multiplicación de Fracciones · 5°',
    frames: [
      ['Ejemplo: 2/3 × 4/5', 'Multiplicación'],
      ['Numerador × numerador: 2×4=8', 'Nueva parte'],
      ['Denominador × denominador: 3×5=15', 'Nuevo total'],
      ['✅ 2/3 × 4/5 = 8/15', 'Producto'],
    ],
  },
  {
    k: 'frac_div',
    t: 'División de Fracciones · 5°',
    frames: [
      ['Ejemplo: 2/3 ÷ 4/5', 'División'],
      ['Invertir la segunda: 4/5 → 5/4', 'Inverso'],
      ['Multiplicar: 2/3 × 5/4', 'Producto'],
      ['2×5=10, 3×4=12', 'Calcular'],
      ['✅ 2/3 ÷ 4/5 = 10/12 = 5/6', 'Simplificar'],
    ],
  },
  {
    k: 'sistema_metrico',
    t: 'Sistema Métrico · 5°',
    frames: [
      ['km, hm, dam, m, dm, cm, mm', 'Escala'],
      ['1 km = 1.000 m', 'Kilómetro'],
      ['1 m = 100 cm', 'Metro'],
      ['1 m = 1.000 mm', 'Milímetros'],
      ['Bajar (mayor → menor): ×10', 'Regla'],
      ['Subir (menor → mayor): ÷10', 'Regla'],
      ['✅ 5 m = 500 cm = 5.000 mm', 'Ejemplos'],
    ],
  },
  {
    k: 'perimetro',
    t: 'Perímetro · 5°',
    frames: [
      ['Perímetro = suma de lados', 'Definición'],
      ['Cuadrado L = 5 m', 'Ejemplo'],
      ['P = 4 × L = 4 × 5', 'Fórmula'],
      ['✅ P = 20 m', 'Cuadrado'],
      ['Rectángulo 6 × 4 m', 'Otro'],
      ['P = 2 × (6 + 4) = 20 m', 'Rectángulo'],
    ],
  },
  {
    k: 'area',
    t: 'Área de Figuras · 5°',
    frames: [
      ['Área = base × altura', 'Rectángulo'],
      ['Ejemplo: 8 m × 5 m', 'Datos'],
      ['A = 8 × 5', 'Multiplicar'],
      ['✅ A = 40 m²', 'Área rectángulo'],
      ['Cuadrado L = 6 m', 'Otro'],
      ['A = L² = 6 × 6', 'Fórmula'],
      ['✅ A = 36 m²', 'Cuadrado'],
    ],
  },
  {
    k: 'volumen',
    t: 'Volumen · 5°',
    frames: [
      ['Volumen = L × A × H', 'Prisma'],
      ['Ejemplo: 4 × 3 × 2 m', 'Datos'],
      ['V = 4 × 3 × 2', 'Multiplicar'],
      ['V = 24 m³', 'Resultado'],
      ['Cubo L = 3 m', 'Otro'],
      ['V = L³ = 27 m³', 'Cubo'],
    ],
  },
  {
    k: 'potencias',
    t: 'Potencias · 5°',
    frames: [
      ['Potencia: base ^ exponente', 'Definición'],
      ['Ejemplo: 2³', 'Base 2, exponente 3'],
      ['2³ = 2 × 2 × 2', 'Multiplicar 3 veces'],
      ['2 × 2 = 4', 'Primer paso'],
      ['4 × 2 = 8', 'Segundo'],
      ['✅ 2³ = 8', 'Potencia'],
    ],
  },
  {
    k: 'raiz_cuadrada',
    t: 'Raíz Cuadrada · 5°',
    frames: [
      ['√25 = ?', 'Raíz cuadrada'],
      ['Busca número que × sí mismo = 25', 'Definición'],
      ['5 × 5 = 25', 'Prueba'],
      ['✅ √25 = 5', 'Correcto'],
      ['√81 = ?', 'Otro'],
      ['9 × 9 = 81', 'Prueba'],
      ['✅ √81 = 9', 'Solución'],
    ],
  },
  {
    k: 'estadistica',
    t: 'Estadística · 5°',
    frames: [
      ['Datos: 3, 5, 3, 7, 5, 3', 'Ejemplo'],
      ['MODA = valor más repetido', 'Definición'],
      ['3 aparece 3 veces', 'Contar'],
      ['✅ Moda = 3', 'Resultado'],
      ['MEDIA = suma / cantidad', 'Otra medida'],
      ['(3+5+3+7+5+3) ÷ 6 = 26 ÷ 6', 'Calcular'],
      ['✅ Media ≈ 4.3', 'Aproximado'],
    ],
  },
  {
    k: 'probabilidad',
    t: 'Probabilidad · 5°',
    frames: [
      ['P = favorables / posibles', 'Fórmula'],
      ['Dado tiene 6 caras', 'Total posibles'],
      ['Sacar un 3: 1 favorable', 'Buscar 3'],
      ['P(3) = 1/6', 'Resultado'],
      ['Sacar par: 2, 4, 6 = 3 casos', '3 favorables'],
      ['P(par) = 3/6 = 1/2', 'Simplificado'],
    ],
  },
];

export default function VideosModal5to({ isOpen, onClose, onOpenIntro }: VideosModal5toProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedTopic = selectedIdx !== null ? RAW_VIDEO_TOPICS[selectedIdx] : null;

  // Narration helper
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

  // Canvas drawing
  useEffect(() => {
    if (!selectedTopic || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo pizarra oscura de clase
    ctx.fillStyle = '#1A1033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Borde brillante
    ctx.strokeStyle = '#7C3AED';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    const frame = selectedTopic.frames[currentFrame];
    if (!frame) return;

    const [content, subtitle] = frame;

    // Header badge
    ctx.fillStyle = '#FFD27A';
    ctx.font = 'bold 15px Nunito, sans-serif';
    ctx.fillText(`PASO ${currentFrame + 1} DE ${selectedTopic.frames.length}`, 24, 38);

    // Texto de la operación (multilínea monoespaciada para columnas)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Courier New, monospace';
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      ctx.fillText(l, 36, 85 + idx * 30);
    });

    // Subtítulo pedagógico en la base
    ctx.fillStyle = '#6EE7B7';
    ctx.font = 'bold 16px Nunito, sans-serif';
    ctx.fillText(subtitle, 24, canvas.height - 24);
  }, [selectedTopic, currentFrame]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying || !selectedTopic) return;
    const timer = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev + 1 >= selectedTopic.frames.length) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        hablar(selectedTopic.frames[next][1]);
        return next;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying, selectedTopic]);

  const handleSelectTopic = (idx: number) => {
    setSelectedIdx(idx);
    setCurrentFrame(0);
    setIsPlaying(false);
    hablar(RAW_VIDEO_TOPICS[idx].frames[0][1]);
  };

  const handlePrev = () => {
    if (!selectedTopic) return;
    setIsPlaying(false);
    setCurrentFrame((prev) => {
      const next = Math.max(0, prev - 1);
      hablar(selectedTopic.frames[next][1]);
      return next;
    });
  };

  const handleNext = () => {
    if (!selectedTopic) return;
    setIsPlaying(false);
    setCurrentFrame((prev) => {
      const next = Math.min(selectedTopic.frames.length - 1, prev + 1);
      hablar(selectedTopic.frames[next][1]);
      return next;
    });
  };

  const handleTogglePlay = () => {
    if (!selectedTopic) return;
    if (!isPlaying && currentFrame + 1 >= selectedTopic.frames.length) {
      setCurrentFrame(0);
    }
    setIsPlaying((p) => !p);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 flex-shrink-0">
          <h2
            className="text-2xl font-black text-[#5C21A6] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span>🎬</span>
            <span>Videos Animados Fedor 5°</span>
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* Banner Hero */}
          <div
            className="rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ background: 'linear-gradient(135deg, #1E0F4A 0%, #5C21A6 50%, #E8650A 100%)' }}
          >
            <div>
              <h3
                className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span>🎬</span>
                <span>Videos Explicativos Paso a Paso</span>
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-white/95">
                25 animaciones dinámicas con voz para dominar cada operación de 5° grado.
              </p>
            </div>
            {onOpenIntro && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenIntro();
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 flex-shrink-0"
              >
                <span>🚀</span>
                <span>Ver Intro Despegue</span>
              </button>
            )}
          </div>

          {/* Si hay tema seleccionado, mostrar reproductor Canvas */}
          {selectedTopic ? (
            <div className="space-y-3 bg-[#F8F5FF] p-4 rounded-2xl border-2 border-[#D9CCFF]">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setSelectedIdx(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-xs cursor-pointer transition-colors"
                >
                  ← Volver a los 25 temas
                </button>
                <div className="font-black text-[#5C21A6] text-sm truncate px-2">{selectedTopic.t}</div>
              </div>

              {/* Canvas 2D */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={300}
                  className="w-full max-w-[560px] h-auto rounded-2xl shadow-lg border-2 border-purple-400 bg-[#1A1033]"
                />
              </div>

              {/* Controles de reproducción */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentFrame === 0}
                  className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-purple-900 font-black text-xs shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  ⏮ Anterior
                </button>
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentFrame >= selectedTopic.frames.length - 1}
                  className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-purple-900 font-black text-xs shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  Siguiente ⏭
                </button>
                <button
                  type="button"
                  onClick={() => hablar(selectedTopic.frames[currentFrame][1])}
                  className="px-3.5 py-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 font-black text-xs cursor-pointer"
                >
                  🔊 Repetir audio
                </button>
              </div>
            </div>
          ) : (
            /* Lista de los 25 temas de video */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
              {RAW_VIDEO_TOPICS.map((vt, idx) => (
                <button
                  key={vt.k}
                  type="button"
                  onClick={() => handleSelectTopic(idx)}
                  className="p-3 rounded-2xl bg-white hover:bg-purple-50/80 border-2 border-[#E4DCFA] hover:border-[#7C3AED] text-left transition-all hover:scale-[1.02] shadow-xs cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-7 h-7 rounded-lg bg-purple-100 text-[#5C21A6] font-black text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-gray-800 truncate">{vt.t}</span>
                  </div>
                  <span className="text-purple-600 font-black text-sm flex-shrink-0">▶</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
