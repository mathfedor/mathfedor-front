'use client';

import React, { useEffect } from 'react';

interface GuiaDocenteModal3roProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuiaDocenteModal3ro({ isOpen, onClose }: GuiaDocenteModal3roProps) {
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

  return (
    <div
      className="guia-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="guia-modal-box">
        {/* Header */}
        <div className="guia-modal-header">
          <div className="guia-modal-title">
            <span className="text-2xl">👩‍🏫</span>
            <span>Guía Docente</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="guia-close-btn"
            aria-label="Cerrar guía docente"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="guia-modal-body">
          {/* 1. Propósito del libro */}
          <div className="guia-section">
            <h4 className="guia-sec-title">
              📌 Propósito del libro:
            </h4>
            <p className="guia-sec-p">
              Matemáticas de Fedor es un libro interactivo para 3° grado diseñado con el Método Fedor: aprendizaje gamificado, progresivo y con retroalimentación inmediata.
            </p>
          </div>

          {/* 2. Estructura pedagógica */}
          <div className="guia-section">
            <h4 className="guia-sec-title">
              🎯 Estructura pedagógica:
            </h4>
            <ul className="guia-list">
              <li>
                <strong>5 niveles por tema:</strong> N1 (básico) → N5 (SABER/competencia)
              </li>
              <li>
                <strong>21 ejercicios por nivel:</strong> mezcla de MCQ, input y problemas
              </li>
              <li>
                <strong>10 ejemplos por tema:</strong> con gráfica, instrucción y procedimiento
              </li>
              <li>
                <strong>Gamificación:</strong> monedas, XP, stickers, recompensa diaria
              </li>
            </ul>
          </div>

          {/* 3. Recomendaciones de uso */}
          <div className="guia-section">
            <h4 className="guia-sec-title">
              📋 Recomendaciones de uso:
            </h4>
            <ul className="guia-list">
              <li>Usar en proyector o tableta para toda la clase</li>
              <li>Iniciar con los ejemplos antes de los ejercicios</li>
              <li>Revisar el informe al finalizar cada sesión</li>
              <li>Los niveles N4 y N5 son para refuerzo y concursos</li>
            </ul>
          </div>

          {/* 4. Alineación curricular */}
          <div className="guia-section guia-section-last">
            <h4 className="guia-sec-title">
              📊 Alineación curricular:
            </h4>
            <p className="guia-sec-p leading-relaxed">
              Estándares Básicos de Competencias — MEN Colombia<br />
              Pensamiento Numérico · Grado 3° · DBA 2022
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .guia-modal-overlay {
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

        .guia-modal-box {
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 560px;
          padding: 1.8rem 2.2rem 2.2rem;
          position: relative;
          box-sizing: border-box;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalPop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .guia-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.2rem;
        }

        .guia-modal-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 21px;
          font-weight: 900;
          color: #1A0A3C;
          letter-spacing: -0.01em;
        }

        .guia-close-btn {
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

        .guia-close-btn:hover {
          color: #1F2937;
          background: #F3F4F6;
          transform: scale(1.08);
        }

        .guia-modal-body {
          font-size: 13.5px;
          color: #374151;
          line-height: 1.65;
        }

        .guia-section {
          margin-bottom: 1.15rem;
        }

        .guia-section-last {
          margin-bottom: 0;
        }

        .guia-sec-title {
          font-size: 14.5px;
          font-weight: 900;
          color: #2A1070;
          margin: 0 0 0.4rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .guia-sec-p {
          font-size: 13.5px;
          color: #4B5563;
          margin: 0;
          line-height: 1.6;
        }

        .guia-list {
          margin: 0.35rem 0 0.5rem 1.25rem;
          padding: 0;
          list-style-type: disc;
        }

        .guia-list li {
          margin-bottom: 0.35rem;
          color: #4B5563;
          line-height: 1.5;
        }

        .guia-list li strong {
          color: #1F2937;
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
            transform: scale(0.93) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
