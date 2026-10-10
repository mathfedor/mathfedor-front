'use client';

import React from 'react';

interface GuiaDocenteModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuiaDocenteModal4to({ isOpen, onClose }: GuiaDocenteModal4toProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="guia-modal-overlay animate-fadeIn"
    >
      <style>{`
        .guia-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background-color: rgba(10, 5, 30, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          box-sizing: border-box;
        }

        .guia-modal-container {
          width: 100%;
          max-width: 600px;
          background-color: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.40);
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-sizing: border-box;
        }

        .guia-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px 16px;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .guia-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .guia-title-wrap h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #2A0F60;
          font-family: 'Baloo 2', sans-serif;
          letter-spacing: 0.01em;
        }

        .guia-close-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #F3EEFF;
          color: #5C21A6;
          font-size: 20px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.12s ease;
          flex-shrink: 0;
        }

        .guia-close-circle:hover {
          background-color: #E9DEFF;
          transform: scale(1.06);
        }

        .guia-scroll-content {
          overflow-y: auto;
          padding: 4px 28px 28px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-sizing: border-box;
        }

        .guia-scroll-content::-webkit-scrollbar {
          width: 6px;
        }
        .guia-scroll-content::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .guia-scroll-content::-webkit-scrollbar-thumb {
          background: #D9CCFF;
          border-radius: 8px;
        }
        .guia-scroll-content::-webkit-scrollbar-thumb:hover {
          background: #A78BFA;
        }

        .guia-section {
          box-sizing: border-box;
        }

        .guia-section h3, .guia-section h4 {
          margin: 0 0 8px 0;
          font-size: 19px;
          font-weight: 900;
          color: #5C21A6;
          font-family: 'Baloo 2', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.25;
        }

        .guia-section p {
          margin: 0;
          font-size: 14.5px;
          font-weight: 600;
          color: #334155;
          line-height: 1.65;
          font-family: 'Nunito', sans-serif;
        }

        .guia-section ul {
          margin: 0;
          padding-left: 20px;
          list-style-type: disc !important;
          box-sizing: border-box;
        }

        .guia-section li {
          margin-bottom: 9px !important;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          line-height: 1.55;
          font-family: 'Nunito', sans-serif;
        }

        .guia-section li:last-child {
          margin-bottom: 0 !important;
        }

        .guia-section b {
          font-weight: 900;
          color: #1E293B;
        }
      `}</style>

      <div className="guia-modal-container">
        {/* Encabezado Modal (Idéntico a la imagen de referencia) */}
        <div className="guia-header-row">
          <div className="guia-title-wrap">
            <span style={{ fontSize: '24px', lineHeight: 1 }}>👩‍🏫</span>
            <h2>Guía del Docente</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="guia-close-circle"
          >
            ✕
          </button>
        </div>

        {/* Contenido con scroll y secciones idénticas a la imagen */}
        <div className="guia-scroll-content">
          {/* Sección 1: Método Fedor · Grado 4° */}
          <div className="guia-section">
            <h3>
              <span>📖</span> Método Fedor · Grado 4°
            </h3>
            <p>
              El <b>Método Fedor</b> combina visualización, gamificación y práctica guiada para
              desarrollar el pensamiento numérico, métrico, aleatorio y espacial en niños de 9-11
              años.
            </p>
          </div>

          {/* Sección 2: Estándares MEN (Grado 4°) */}
          <div className="guia-section">
            <h4>
              <span>🎯</span> Estándares MEN (Grado 4°)
            </h4>
            <ul>
              <li>
                <b>Pensamiento Numérico:</b> Números hasta millones, fracciones, decimales, potencias
              </li>
              <li>
                <b>Pensamiento Métrico:</b> Sistema Métrico Decimal (longitud, área, volumen)
              </li>
              <li>
                <b>Pensamiento Espacial:</b> Perímetro, área, volumen de figuras geométricas
              </li>
              <li>
                <b>Pensamiento Aleatorio:</b> Tablas de frecuencia, moda, media, probabilidad
              </li>
            </ul>
          </div>

          {/* Sección 3: Niveles de Desempeño */}
          <div className="guia-section">
            <h4>
              <span>📊</span> Niveles de Desempeño
            </h4>
            <ul>
              <li>
                <b>N1 Cadete:</b> Reconoce y aplica conceptos básicos
              </li>
              <li>
                <b>N2 Piloto:</b> Resuelve ejercicios con procedimiento guiado
              </li>
              <li>
                <b>N3 Capitán:</b> Aplica en contextos variados
              </li>
              <li>
                <b>N4 Comandante:</b> Analiza y compara estrategias
              </li>
              <li>
                <b>N5 SABER:</b> Aplica en problemas tipo pruebas nacionales
              </li>
            </ul>
          </div>

          {/* Sección 4: Evaluación */}
          <div className="guia-section">
            <h4>
              <span>🎓</span> Evaluación
            </h4>
            <p>
              Cada tema aporta puntos (N1=65, N2=110, N3=145, N4=170, N5=200). El sistema calcula
              automáticamente el porcentaje de logro por unidad y genera reportes exportables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
