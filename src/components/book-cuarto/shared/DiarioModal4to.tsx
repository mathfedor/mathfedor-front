'use client';

import React, { useState, useEffect } from 'react';
import { useBook4 } from '../context/Book4Context';

interface DiarioModal4toProps {
  isOpen?: boolean;
  onClose: () => void;
}

interface DayRecord {
  dateStr: string;
  ex: number;
  ok: number;
  min: number;
}

export default function DiarioModal4to({
  isOpen = true,
  onClose,
}: DiarioModal4toProps) {
  const { streak } = useBook4();
  const [records, setRecords] = useState<DayRecord[]>([]);

  useEffect(() => {
    // Cargar datos persistidos de diario
    let savedData: Record<string, { ex: number; ok: number; min: number }> = {};
    try {
      const raw = localStorage.getItem('fedor4_diario');
      if (raw) savedData = JSON.parse(raw);
    } catch {}

    // Generar los últimos 7 días terminando en la fecha actual
    const days: DayRecord[] = [];
    const f = new Date();
    f.setDate(f.getDate() - 6);

    for (let i = 0; i < 7; i++) {
      const yyyy = f.getFullYear();
      const mm = String(f.getMonth() + 1).padStart(2, '0');
      const dd = String(f.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;

      const rec = savedData[key] || { ex: 0, ok: 0, min: 0 };
      const formattedDate = f.toLocaleDateString('es-CO', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });

      days.push({
        dateStr: formattedDate,
        ex: rec.ex || 0,
        ok: rec.ok || 0,
        min: Math.round(rec.min || 0),
      });

      f.setDate(f.getDate() + 1);
    }

    setRecords(days);
  }, []);

  if (!isOpen) return null;

  const totalEx = records.reduce((acc, r) => acc + r.ex, 0);
  const totalOk = records.reduce((acc, r) => acc + r.ok, 0);
  const totalMin = records.reduce((acc, r) => acc + r.min, 0);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(8, 4, 30, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          padding: '24px 28px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Nunito', sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* Cabecera: Título a la izquierda y Botón de Cierre a la derecha */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', lineHeight: 1 }}>📓</span>
            <h2
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 900,
                color: '#1E1B4B',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                letterSpacing: '0.01em',
              }}
            >
              Mi Diario
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F3EEFF',
              color: '#5C21A6',
              fontSize: '16px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Subtítulo de Racha */}
        <div
          style={{
            color: '#5C21A6',
            fontWeight: 900,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px',
          }}
        >
          <span>🔥</span>
          <span>Racha: {streak || 0} día(s) seguidos</span>
        </div>

        {/* Tabla de los 7 Días */}
        <div style={{ width: '100%', overflowX: 'auto', marginBottom: '14px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: '13px',
              color: '#1E1B4B',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#5C21A6', color: '#FFFFFF' }}>
                <th
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontWeight: 800,
                    fontSize: '13px',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                  }}
                >
                  Día
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  Ejercicios
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  Correctos
                </th>
                <th
                  style={{
                    padding: '10px 14px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                    borderTopRightRadius: '8px',
                    borderBottomRightRadius: '8px',
                  }}
                >
                  Minutos
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const isDone = r.ex > 0;
                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: isDone ? '#DCF5EE' : '#FFFFFF',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td
                      style={{
                        padding: '9px 14px',
                        fontWeight: 800,
                        color: isDone ? '#074F3A' : '#1E1B4B',
                        textAlign: 'left',
                      }}
                    >
                      {r.dateStr}
                    </td>
                    <td
                      style={{
                        padding: '9px 12px',
                        textAlign: 'center',
                        color: isDone ? '#074F3A' : '#1E1B4B',
                        fontWeight: isDone ? 800 : 600,
                      }}
                    >
                      {r.ex}
                    </td>
                    <td
                      style={{
                        padding: '9px 12px',
                        textAlign: 'center',
                        color: isDone ? '#074F3A' : '#1E1B4B',
                        fontWeight: isDone ? 800 : 600,
                      }}
                    >
                      {r.ok}
                    </td>
                    <td
                      style={{
                        padding: '9px 14px',
                        textAlign: 'center',
                        color: isDone ? '#074F3A' : '#1E1B4B',
                        fontWeight: isDone ? 800 : 600,
                      }}
                    >
                      {r.min}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen Semanal */}
        <p
          style={{
            margin: '0 0 16px 0',
            fontSize: '13px',
            fontWeight: 800,
            color: '#1E1B4B',
            lineHeight: 1.4,
          }}
        >
          Semana: {totalEx} ejercicios · {totalOk} correctos · {totalMin} min de práctica
        </p>

        {/* Botón Volver a Logros */}
        <div>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#5C21A6',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              borderRadius: '10px',
              padding: '10px 18px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(92, 33, 166, 0.25)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6D28D9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5C21A6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>◀</span>
            <span>Volver a Logros</span>
          </button>
        </div>
      </div>
    </div>
  );
}
