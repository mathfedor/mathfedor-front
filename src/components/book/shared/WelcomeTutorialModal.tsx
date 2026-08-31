'use client';

import React, { useState, useEffect } from 'react';

interface WelcomeTutorialModalProps {
  onClose: () => void;
}

export const FEDOR_2DO_TUTORIAL_SLIDES = [
  {
    emoji: '👋',
    title: '¡Bienvenid@ a Matemáticas de Fedor!',
    body: 'Vamos a aprender matemáticas viajando por el espacio. ¡Tú eres el capitán de tu nave! Tus datos quedan solo en este dispositivo, no se envían a internet.',
  },
  {
    emoji: '🚀',
    title: 'Tu misión: de Mercurio a Plutón',
    body: 'Cada planeta es una unidad: Adición, Sustracción, Multiplicación, División, Geometría, Estadística y Fracciones. ¡Conquístalos uno a uno!',
  },
  {
    emoji: '⭐',
    title: '5 niveles por tema',
    body: 'Empieza en Básico (verde), sube a Medio (amarillo), Avanzado (rojo), Experto (naranja) y Pruebas SABER (morado).',
  },
  {
    emoji: '🎁',
    title: 'Gana premios mientras aprendes',
    body: 'Cada ejercicio correcto te da XP y monedas. Compra avatares, escudos y mascotas en la Tienda. ¡Mantén tu racha para más recompensas!',
  },
  {
    emoji: '📓',
    title: 'Tu Diario Espacial',
    body: 'Mira tu progreso semana a semana, tu racha de días seguidos y tu mejor día. ¡Practica un poquito cada día!',
  },
  {
    emoji: '🎮',
    title: '¡Empezamos!',
    body: 'Toca cualquier unidad para empezar tu aventura. ¡Que la fuerza matemática te acompañe!',
  },
];

/**
 * Modal interactivo de bienvenida y tutorial para Grado 2°,
 * réplica fiel de /segundo/MatematicasDeFedor_2°.html
 */
export default function WelcomeTutorialModal({ onClose }: WelcomeTutorialModalProps) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const current = FEDOR_2DO_TUTORIAL_SLIDES[slide];
  const isLast = slide === FEDOR_2DO_TUTORIAL_SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setSlide((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (slide > 0) {
      setSlide((s) => s - 1);
    }
  };

  const handleClose = () => {
    try {
      localStorage.setItem('fedor_tutorial_done', '1');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 5, 40, 0.92)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        userSelect: 'none',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes fedorTutFadeIn {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .fedor-tut-card {
          animation: fedorTutFadeIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .fedor-tut-btn {
          transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease;
        }
        .fedor-tut-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 6px 20px rgba(123, 47, 190, 0.35);
        }
        .fedor-tut-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div
        className="fedor-tut-card"
        style={{
          background: '#ffffff',
          maxWidth: '480px',
          width: '100%',
          borderRadius: '26px',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con degradado azul-violeta y emoji grande */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7B2FBE, #3AA0FF)',
            padding: '2.2rem 1.5rem 1.6rem',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              fontSize: '76px',
              lineHeight: 1,
              filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))',
              transition: 'transform 0.25s ease',
            }}
          >
            {current.emoji}
          </div>
        </div>

        {/* Contenido: Título y Cuerpo */}
        <div style={{ padding: '1.6rem 1.8rem 1.2rem', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Baloo 2', 'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: '23px',
              color: '#3D1054',
              marginBottom: '0.65rem',
              lineHeight: 1.2,
            }}
          >
            {current.title}
          </div>
          <div
            style={{
              fontSize: '14.5px',
              color: '#3D1054',
              lineHeight: 1.6,
              fontWeight: 600,
            }}
          >
            {current.body}
          </div>
        </div>

        {/* Indicadores de diapositiva (Dots) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.4rem 1rem 0.8rem' }}>
          {FEDOR_2DO_TUTORIAL_SLIDES.map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: i === slide ? '22px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === slide ? '#FFB800' : 'rgba(61, 16, 84, 0.2)',
                margin: '0 3.5px',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Botones de Navegación */}
        <div style={{ display: 'flex', gap: '10px', padding: '0 1.5rem 1.3rem' }}>
          {slide > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="fedor-tut-btn"
              style={{
                flex: 1,
                padding: '12px 14px',
                background: '#ffffff',
                color: '#6C28B4',
                border: '2px solid #7B2FBE',
                borderRadius: '14px',
                fontWeight: 900,
                fontFamily: "'Nunito', sans-serif",
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ← Atrás
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="fedor-tut-btn"
            style={{
              flex: slide > 0 ? 2 : 1,
              padding: '12px 14px',
              background: 'linear-gradient(135deg, #7B2FBE, #3AA0FF)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 900,
              fontFamily: "'Nunito', sans-serif",
              cursor: 'pointer',
              fontSize: '15px',
              boxShadow: '0 4px 16px rgba(123, 47, 190, 0.35)',
            }}
          >
            {isLast ? '¡Empezar! 🚀' : 'Siguiente →'}
          </button>
        </div>

        {/* Enlace Saltar tutorial (en la primera diapositiva) */}
        {slide === 0 && (
          <div style={{ textAlign: 'center', padding: '0 1rem 1.1rem' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#6C28B4',
                textDecoration: 'underline',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                padding: '4px 8px',
              }}
            >
              Saltar tutorial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
