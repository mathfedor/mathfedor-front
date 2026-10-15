'use client';

import React, { useEffect } from 'react';

interface GuiaDocenteModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuiaDocenteModal5to({ isOpen, onClose }: GuiaDocenteModal5toProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="tool-modal-bg animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        .tool-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 9995;
          background: rgba(18, 8, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .tool-modal {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 580px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          padding: 22px 24px 26px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.5);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
        }

        .tm-close {
          position: absolute;
          right: 14px;
          top: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.15s ease;
          padding: 0;
          outline: none;
        }

        .tm-close:hover {
          background: #6C28B4;
          color: #FFFFFF;
        }

        .tm-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #3D1468;
          margin: 0 40px 14px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.2;
        }

        .guia-section-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 15.5px;
          font-weight: 900;
          color: #5C21A6;
          margin: 14px 0 6px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.3;
        }

        .guia-section-title:first-of-type {
          margin-top: 0;
        }

        .guia-p {
          font-size: 13.5px;
          line-height: 1.6;
          color: #180D38;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .guia-list {
          list-style-type: disc;
          padding-left: 22px;
          margin: 0 0 12px 0;
        }

        .guia-list li {
          font-size: 13.5px;
          line-height: 1.55;
          color: #180D38;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .guia-list li b {
          color: #180D38;
          font-weight: 800;
        }
      `}</style>

      <div className="tool-modal animate-popIn">
        {/* Botón Cerrar .tm-close */}
        <button
          type="button"
          onClick={onClose}
          className="tm-close"
          title="Cerrar"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Título de la modal */}
        <div className="tm-title">
          <span>👩‍🏫</span>
          <span>Guía del Docente</span>
        </div>

        {/* 1. Método Fedor · Grado 5° */}
        <div className="guia-section-title">
          <span>📖</span>
          <span>Método Fedor · Grado 5°</span>
        </div>
        <p className="guia-p">
          El <b>Método Fedor</b> combina visualización, gamificación y práctica guiada para desarrollar el pensamiento numérico, métrico, aleatorio y espacial en niños de 9-11 años.
        </p>

        {/* 2. Estándares MEN (Grado 5°) */}
        <div className="guia-section-title">
          <span>🎯</span>
          <span>Estándares MEN (Grado 5°)</span>
        </div>
        <ul className="guia-list">
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

        {/* 3. Niveles de Desempeño */}
        <div className="guia-section-title">
          <span>📊</span>
          <span>Niveles de Desempeño</span>
        </div>
        <ul className="guia-list">
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

        {/* 4. Evaluación */}
        <div className="guia-section-title">
          <span>🎓</span>
          <span>Evaluación</span>
        </div>
        <p className="guia-p" style={{ marginBottom: 0 }}>
          Cada tema aporta puntos (N1=65, N2=110, N3=145, N4=170, N5=200). El sistema calcula automáticamente el porcentaje de logro por unidad y genera reportes exportables.
        </p>
      </div>
    </div>
  );
}
