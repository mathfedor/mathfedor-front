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
      className="fixed inset-0 z-[9995] flex items-center justify-center select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutTitle1ro"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9995,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        overflowY: 'auto',
      }}
    >
      {/* Contenedor central blanco estilizado según Image 1 */}
      <div
        className="unit-welcome-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '92%',
          maxWidth: 415,
          background: '#ffffff',
          borderRadius: 28,
          padding: '2rem 1.75rem 1.75rem',
          textAlign: 'center',
          boxShadow: '0 24px 65px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Símbolo matemático 3D con animación flotante continua */}
        <div
          className="floating-unit-icon"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            animation: 'floatIcon 2.6s ease-in-out infinite',
            flexShrink: 0,
          }}
        >
          <UnitOperationIcon3D1ro unitIndex={unitIndex} size={76} />
        </div>

        {/* Título de la Unidad */}
        <h2
          id="tutTitle1ro"
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#7B2FBE',
            fontFamily: "'Baloo 2', 'Nunito', sans-serif",
            lineHeight: 1.3,
            marginBottom: '0.65rem',
            letterSpacing: '-0.02em',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {tut.title}
        </h2>

        {/* Subtítulo / Descripción pedagógica */}
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: '#555555',
            lineHeight: 1.55,
            maxWidth: 320,
            margin: '0 auto 1.35rem auto',
            textAlign: 'center',
          }}
        >
          {tut.text}
        </p>

        {/* 4 Pasos / Destacados numerados con espaciado amplio */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: '1.5rem',
            textAlign: 'left',
            width: '100%',
          }}
        >
          {tut.steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                background: '#F7F4FF',
                borderRadius: 14,
                border: '1px solid #ECE6FA',
                boxShadow: '0 1px 3px rgba(123, 47, 190, 0.04)',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  minWidth: 24,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 5px rgba(123, 47, 190, 0.3)',
                }}
              >
                {idx + 1}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#333333',
                  lineHeight: 1.45,
                  flex: 1,
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Botón Principal: ¡Empezar Aventura! 🚀 */}
        <button
          type="button"
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #7B2FBE 0%, #8E3AD5 50%, #A864E8 100%)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: 15,
            border: 'none',
            boxShadow: '0 6px 20px rgba(123, 47, 190, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: '0.85rem',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(123, 47, 190, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(123, 47, 190, 0.35)';
          }}
        >
          <span>¡Empezar Aventura!</span>
          <span style={{ fontSize: 16 }}>🚀</span>
        </button>

        {/* Enlace secundario: Omitir tutorial */}
        <div style={{ width: '100%', textAlign: 'center', paddingBottom: 2 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12.5,
              color: '#aaaaaa',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              cursor: 'pointer',
              padding: '4px 8px',
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: '0.01em',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#7B2FBE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#aaaaaa';
            }}
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
