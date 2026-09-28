'use client';

import React, { useEffect } from 'react';
import unitTutsData from '@/mocks/data/book-unit-tuts.data.json';
import { fedorTTS } from '@/services/tts.service';

interface UnitWelcomeModal1roProps {
  isOpen: boolean;
  onClose: () => void;
  unitIndex: number;
}

/**
 * Icono matemático 3D con degradado y profundidad violeta idéntico a la captura
 */
export function UnitOperationIcon3D1ro({
  unitIndex,
  size = 78,
}: {
  unitIndex: number;
  size?: number;
}) {
  // Unidad 1 (index 0): Adición (+) — Plus 3D extruido idéntico a la captura del usuario
  if (unitIndex === 0) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_20px_rgba(109,40,217,0.38)]"
      >
        <defs>
          {/* Sombra 3D base / Extrusión inferior */}
          <linearGradient id="u0_extrude" x1="39" y1="20" x2="39" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#431487" />
          </linearGradient>

          {/* Cara frontal 3D con brillo superior */}
          <linearGradient id="u0_front" x1="39" y1="8" x2="39" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C499FF" />
            <stop offset="25%" stopColor="#9D5CFA" />
            <stop offset="70%" stopColor="#7E32E0" />
            <stop offset="100%" stopColor="#6922C4" />
          </linearGradient>

          {/* Bisel especular superior */}
          <linearGradient id="u0_highlight" x1="14" y1="30" x2="64" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 1. Capa de sombra / extrusión 3D (offset vertical +5px) */}
        <g transform="translate(0, 5)" opacity="0.95">
          <rect x="13" y="32" width="52" height="15" rx="7.5" fill="url(#u0_extrude)" />
          <rect x="31.5" y="13" width="15" height="52" rx="7.5" fill="url(#u0_extrude)" />
        </g>

        {/* 2. Cara principal 3D */}
        <rect x="13" y="31" width="52" height="15" rx="7.5" fill="url(#u0_front)" />
        <rect x="31.5" y="12" width="15" height="52" rx="7.5" fill="url(#u0_front)" />

        {/* 3. Brillos especulares (High-light 3D) en los bordes superiores */}
        <path
          d="M 20.5 32.5 L 57.5 32.5"
          stroke="url(#u0_highlight)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 33 19.5 L 45 19.5"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
      </svg>
    );
  }

  // Unidad 2 (index 1): Sustracción (-) — Barra 3D
  if (unitIndex === 1) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_20px_rgba(109,40,217,0.38)]"
      >
        <defs>
          <linearGradient id="u1_extrude" x1="39" y1="32" x2="39" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#431487" />
          </linearGradient>
          <linearGradient id="u1_front" x1="39" y1="28" x2="39" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C499FF" />
            <stop offset="35%" stopColor="#9D5CFA" />
            <stop offset="100%" stopColor="#6922C4" />
          </linearGradient>
        </defs>
        {/* Sombra 3D */}
        <rect x="12" y="36" width="54" height="15" rx="7.5" fill="url(#u1_extrude)" opacity="0.95" />
        {/* Frontal */}
        <rect x="12" y="31" width="54" height="15" rx="7.5" fill="url(#u1_front)" />
        {/* Brillo */}
        <path d="M 19 32.5 L 59 32.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
      </svg>
    );
  }

  // Unidad 3 (index 2): Multiplicación (×) — Cruz inclinada 3D
  if (unitIndex === 2) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_20px_rgba(109,40,217,0.38)]"
      >
        <defs>
          <linearGradient id="u2_extrude" x1="39" y1="18" x2="39" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#431487" />
          </linearGradient>
          <linearGradient id="u2_front" x1="39" y1="12" x2="39" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C499FF" />
            <stop offset="30%" stopColor="#9D5CFA" />
            <stop offset="100%" stopColor="#6922C4" />
          </linearGradient>
        </defs>
        {/* Capa sombra 3D */}
        <g transform="translate(0, 5) rotate(45 39 39)" opacity="0.95">
          <rect x="13" y="31.5" width="52" height="15" rx="7.5" fill="url(#u2_extrude)" />
          <rect x="31.5" y="13" width="15" height="52" rx="7.5" fill="url(#u2_extrude)" />
        </g>
        {/* Cara frontal rotada */}
        <g transform="rotate(45 39 39)">
          <rect x="13" y="31.5" width="52" height="15" rx="7.5" fill="url(#u2_front)" />
          <rect x="31.5" y="13" width="15" height="52" rx="7.5" fill="url(#u2_front)" />
          <path d="M 20 33 L 58 33" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        </g>
      </svg>
    );
  }

  // Unidad 4 (index 3): División (÷) — Símbolo de división 3D
  if (unitIndex === 3) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_20px_rgba(109,40,217,0.38)]"
      >
        <defs>
          <linearGradient id="u3_extrude" x1="39" y1="14" x2="39" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#431487" />
          </linearGradient>
          <linearGradient id="u3_front" x1="39" y1="12" x2="39" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C499FF" />
            <stop offset="35%" stopColor="#9D5CFA" />
            <stop offset="100%" stopColor="#6922C4" />
          </linearGradient>
        </defs>
        {/* Sombra 3D */}
        <circle cx="39" cy="22" r="7.5" fill="url(#u3_extrude)" opacity="0.95" />
        <rect x="12" y="36.5" width="54" height="14" rx="7" fill="url(#u3_extrude)" opacity="0.95" />
        <circle cx="39" cy="61" r="7.5" fill="url(#u3_extrude)" opacity="0.95" />
        {/* Frontal */}
        <circle cx="39" cy="18" r="7.5" fill="url(#u3_front)" />
        <rect x="12" y="32" width="54" height="14" rx="7" fill="url(#u3_front)" />
        <circle cx="39" cy="57" r="7.5" fill="url(#u3_front)" />
        {/* Brillos */}
        <circle cx="37" cy="16" r="2.5" fill="#FFFFFF" fillOpacity="0.75" />
        <path d="M 19 33.5 L 59 33.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
      </svg>
    );
  }

  // Unidad 5 (index 4): Geometría (📐) — Escuadra / Triángulo Geométrico 3D
  if (unitIndex === 4) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_20px_rgba(109,40,217,0.38)]"
      >
        <defs>
          <linearGradient id="u4_extrude" x1="15" y1="15" x2="65" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#431487" />
          </linearGradient>
          <linearGradient id="u4_front" x1="15" y1="12" x2="65" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C499FF" />
            <stop offset="35%" stopColor="#9D5CFA" />
            <stop offset="100%" stopColor="#6922C4" />
          </linearGradient>
        </defs>
        {/* Sombra 3D */}
        <path
          d="M 17 67 L 65 67 C 68 67 69 65 67 63 L 21 17 C 19 15 17 16 17 19 Z"
          fill="url(#u4_extrude)"
          opacity="0.95"
        />
        {/* Frontal */}
        <path
          d="M 17 63 L 65 63 C 68 63 69 61 67 59 L 21 13 C 19 11 17 12 17 15 Z"
          fill="url(#u4_front)"
        />
        {/* Hueco triangular interno */}
        <path
          d="M 26 55 L 50 55 L 26 31 Z"
          fill="#FFFFFF"
          fillOpacity="0.92"
        />
        {/* Marcas de regla milimétrica */}
        <line x1="32" y1="63" x2="32" y2="59" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="40" y1="63" x2="40" y2="58" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="48" y1="63" x2="48" y2="59" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
      </svg>
    );
  }

  // Unidad 6 (index 5): Estadística (📊) — Gráfico de barras 3D
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_10px_20px_rgba(109,40,217,0.38)]"
    >
      <defs>
        <linearGradient id="u5_extrude" x1="39" y1="20" x2="39" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#431487" />
        </linearGradient>
        <linearGradient id="u5_front" x1="39" y1="15" x2="39" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C499FF" />
          <stop offset="35%" stopColor="#9D5CFA" />
          <stop offset="100%" stopColor="#6922C4" />
        </linearGradient>
      </defs>
      {/* Sombra 3D de las 3 barras */}
      <rect x="14" y="44" width="13" height="25" rx="6.5" fill="url(#u5_extrude)" opacity="0.95" />
      <rect x="32" y="27" width="13" height="42" rx="6.5" fill="url(#u5_extrude)" opacity="0.95" />
      <rect x="50" y="16" width="13" height="53" rx="6.5" fill="url(#u5_extrude)" opacity="0.95" />
      {/* Frontal de las barras */}
      <rect x="14" y="40" width="13" height="25" rx="6.5" fill="url(#u5_front)" />
      <rect x="32" y="23" width="13" height="42" rx="6.5" fill="url(#u5_front)" />
      <rect x="50" y="12" width="13" height="53" rx="6.5" fill="url(#u5_front)" />
      {/* Brillos superiores */}
      <ellipse cx="20.5" cy="43" rx="3.5" ry="1.5" fill="#FFFFFF" fillOpacity="0.75" />
      <ellipse cx="38.5" cy="26" rx="3.5" ry="1.5" fill="#FFFFFF" fillOpacity="0.75" />
      <ellipse cx="56.5" cy="15" rx="3.5" ry="1.5" fill="#FFFFFF" fillOpacity="0.75" />
    </svg>
  );
}

/**
 * Tutorial popup introductorio de unidad para Primer Grado (1°)
 * Réplica idéntica a la maqueta e imagen solicitada, basada en UNIT_TUTS de MatematicasDeFedor_1.html.
 */
export default function UnitWelcomeModal1ro({
  isOpen,
  onClose,
  unitIndex,
}: UnitWelcomeModal1roProps) {
  // Cierre con la tecla ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tuts = unitTutsData?.UNIT_TUTS || [];
  const tut = tuts[unitIndex] || {
    icon: '➕',
    title: `¡Unidad ${unitIndex + 1}!`,
    text: 'Aprenderás con los métodos didácticos y actividades interactivas de Fedor.',
    steps: [
      'Conteo y reconocimiento paso a paso',
      'Ejercicios visuales guiados por Fedor',
      'Desarrollo interactivo con retroalimentación',
      '¡Retos divertidos para dominar el tema!',
    ],
  };

  const handleStart = () => {
    fedorTTS.speak(`¡Empezamos la aventura en ${tut.title}!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutTitle1ro"
    >
      {/* Contenedor central blanco estilizado según la captura */}
      <div
        className="relative w-full max-w-[390px] md:max-w-[415px] bg-white rounded-[32px] md:rounded-[36px] pt-10 pb-9 px-7 md:px-8 text-center shadow-[0_24px_65px_rgba(0,0,0,0.45)] animate-popIn my-auto border border-white/60 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Símbolo matemático 3D con animación flotante continua */}
        <div className="floating-unit-icon flex items-center justify-center mb-6">
          <UnitOperationIcon3D1ro unitIndex={unitIndex} />
        </div>

        {/* Título de la Unidad */}
        <h2
          id="tutTitle1ro"
          className="text-[21px] md:text-[23px] font-black text-[#7B2FBE] font-['Baloo_2',sans-serif] leading-snug mb-2.5 tracking-tight w-full"
        >
          {tut.title}
        </h2>

        {/* Subtítulo / Descripción pedagógica */}
        <p className="text-[13px] font-bold text-[#555555] leading-relaxed max-w-[310px] mx-auto mb-6">
          {tut.text}
        </p>

        {/* 4 Pasos / Destacados numerados */}
        <div className="space-y-3.5 mb-7 text-left w-full">
          {tut.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 py-3.5 px-4 md:px-5 bg-[#F6F3FF] rounded-[20px] border border-purple-100/60 shadow-2xs hover:border-purple-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#8338EC] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                {idx + 1}
              </div>
              <div className="text-[12px] md:text-[13px] font-bold text-[#333333] leading-snug flex-1">
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Botón Principal: ¡Empezar Aventura! 🚀 */}
        <div className="w-full pt-1 mb-4">
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-[20px] bg-gradient-to-r from-[#7B2FBE] via-[#8538E5] to-[#9D4EDD] hover:from-[#6D24B0] hover:to-[#8E3AD5] text-white font-black text-sm md:text-base shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.015] active:scale-[0.985] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>¡Empezar Aventura!</span>
            <span>🚀</span>
          </button>
        </div>

        {/* Enlace secundario: Omitir tutorial */}
        <div className="w-full text-center pb-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs md:text-[13px] text-gray-400 hover:text-gray-600 font-semibold underline cursor-pointer transition-colors inline-block tracking-wide"
          >
            Omitir tutorial
          </button>
        </div>

        <style>{`
          @keyframes popIn {
            0% {
              transform: scale(0.92);
              opacity: 0;
            }
            70% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-popIn {
            animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes floatIcon {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          .floating-unit-icon {
            animation: floatIcon 2.6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
