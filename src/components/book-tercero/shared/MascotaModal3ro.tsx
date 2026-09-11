'use client';

import React, { useState, useEffect } from 'react';
import { fedorSpeak } from './Grade3Speech';

interface MascotaModal3roProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MascotaModal3ro({ isOpen, onClose }: MascotaModal3roProps) {
  const [petCount, setPetCount] = useState(0);
  const [showHearts, setShowHearts] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAcariciar = () => {
    setPetCount((prev) => prev + 1);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 1400);

    setToastMsg('¡Astro te envía un abrazo espacial! 🐾');
    setTimeout(() => setToastMsg(null), 2500);

    try {
      fedorSpeak('¡Guau guau! Astro mueve la colita feliz. ¡Te envía un fuerte abrazo espacial!');
    } catch {}
  };

  return (
    <div
      className="mascota-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mascota-modal-box">
        {/* Header */}
        <div className="mascota-modal-header">
          <div className="mascota-modal-title">
            <span className="text-xl">🐾</span>
            <span>Mascota Espacial</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mascota-close-btn"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mascota-modal-body">
          {/* Avatar Illustration */}
          <div className="mascota-avatar-wrap">
            <span className="mascota-emoji">🐶</span>
            <span className="mascota-rocket">🚀</span>

            {/* Floating Hearts when petted */}
            {showHearts && (
              <div className="mascota-hearts-pop">
                <span>💖</span>
                <span>✨</span>
                <span>🐾</span>
              </div>
            )}
          </div>

          {/* Subtitle */}
          <h3 className="mascota-name">
            ¡Astro, el perro espacial!
          </h3>

          {/* Description */}
          <p className="mascota-desc">
            Astro te acompaña en cada misión matemática. ¡Resuelve ejercicios y viaja con él por la galaxia!
          </p>

          {/* Stats Badges */}
          <div className="mascota-stats-row">
            <div className="mascota-stat-pill pill-vida">
              ❤️ Vida: <span>100%</span>
            </div>
            <div className="mascota-stat-pill pill-nivel">
              ⭐ Nivel: <span>{1 + Math.floor(petCount / 5)}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleAcariciar}
            className="mascota-pet-btn"
          >
            🐾 ¡Acariciar a Astro!
          </button>

          {/* Toast feedback */}
          {toastMsg && (
            <div className="mascota-toast">
              {toastMsg}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .mascota-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9995;
          background: rgba(14, 8, 48, 0.68);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: 'Nunito', sans-serif;
          animation: modalFadeIn 0.22s ease-out forwards;
        }

        .mascota-modal-box {
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 530px;
          padding: 1.6rem 2rem 2.2rem;
          position: relative;
          box-sizing: border-box;
          animation: modalPop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .mascota-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .mascota-modal-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 900;
          color: #1A0A3C;
          letter-spacing: -0.01em;
        }

        .mascota-close-btn {
          background: transparent;
          border: none;
          color: #9CA3AF;
          font-size: 22px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
          line-height: 1;
        }

        .mascota-close-btn:hover {
          color: #1F2937;
          background: #F3F4F6;
          transform: scale(1.08);
        }

        .mascota-modal-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .mascota-avatar-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 0.5rem 0 0.8rem;
          user-select: none;
        }

        .mascota-emoji {
          font-size: 74px;
          line-height: 1;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
          animation: astroBob 2.8s ease-in-out infinite;
        }

        .mascota-rocket {
          font-size: 68px;
          line-height: 1;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
          animation: rocketBob 2.8s ease-in-out infinite 0.4s;
        }

        .mascota-hearts-pop {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          font-size: 24px;
          animation: heartsFloat 1.2s ease-out forwards;
          pointer-events: none;
        }

        .mascota-name {
          font-size: 18px;
          font-weight: 900;
          color: #2A1070;
          margin: 0.4rem 0 0.35rem;
          letter-spacing: -0.01em;
        }

        .mascota-desc {
          font-size: 13.5px;
          font-weight: 600;
          color: #555555;
          max-width: 440px;
          line-height: 1.5;
          margin: 0 auto 1.4rem;
        }

        .mascota-stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .mascota-stat-pill {
          border-radius: 14px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pill-vida {
          background: #EEEDFE;
          color: #2A1070;
        }

        .pill-nivel {
          background: #DCF5EE;
          color: #074F3A;
        }

        .mascota-pet-btn {
          background: #A30041;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 13px 34px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(163, 0, 65, 0.35);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
          font-family: 'Nunito', sans-serif;
          letter-spacing: 0.01em;
          outline: none;
        }

        .mascota-pet-btn:hover {
          background: #B8004A;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(163, 0, 65, 0.45);
        }

        .mascota-pet-btn:active {
          transform: scale(0.96);
        }

        .mascota-toast {
          margin-top: 1rem;
          font-size: 12.5px;
          font-weight: 800;
          color: #A30041;
          background: #FFE8F0;
          border: 1px solid #FFC2D6;
          padding: 6px 16px;
          border-radius: 20px;
          animation: toastPop 0.25s ease-out forwards;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes astroBob {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(-3deg);
          }
        }

        @keyframes rocketBob {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(4deg);
          }
        }

        @keyframes heartsFloat {
          0% {
            opacity: 0;
            transform: translate(-50%, 10px) scale(0.6);
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -10px) scale(1.15);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -35px) scale(1);
          }
        }

        @keyframes toastPop {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
