'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

export default function ReportScreen1ro() {
  const { book, student, coins, stars, streak, scores, goScreen } = useBook1();

  const units = book?.units || [];

  const handleExportCSV = () => {
    const rows: string[][] = [
      ['Estudiante', student?.name || ''],
      ['Colegio', student?.school || ''],
      ['Ciudad', student?.city || ''],
      ['Docente', student?.teacher || ''],
      ['Email', student?.email || ''],
      ['Fecha', new Date().toLocaleDateString('es-CO')],
      [''],
      ['Unidad', 'Tema', 'Nivel', 'Puntos', 'Completado'],
    ];

    units.forEach((u) => {
      (u.topics || []).forEach((t, ti) => {
        (t.levels || []).forEach((lv, li) => {
          const key1 = `u${u.index}t${ti}-n${li + 1}`;
          const key2 = t.id ? `${t.id}-n${li + 1}` : key1;
          const sc = scores[key1] ?? scores[key2];
          if (typeof sc === 'number' && sc > 0) {
            rows.push([u.name, t.title, lv.label || `Nivel ${li + 1}`, String(sc), 'Sí']);
          } else {
            rows.push([u.name, t.title, lv.label || `Nivel ${li + 1}`, '0', 'No']);
          }
        });
      });
    });

    const csvContent = rows
      .map((r) =>
        r
          .map((c) => {
            const s = String(c == null ? '' : c);
            if (s.includes(',') || s.includes('"') || s.includes('\n')) {
              return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_fedor_1ro_${student?.name || 'estudiante'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', fontFamily: "'Nunito', sans-serif" }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => goScreen('home')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #DDD8F5',
            color: '#7B2FBE',
            borderRadius: '20px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(123,47,190,0.1)',
          }}
        >
          ← Volver al Inicio
        </button>
        <button
          type="button"
          onClick={handleExportCSV}
          style={{
            background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(123,47,190,0.3)',
          }}
        >
          🎴 Descargar Reporte CSV
        </button>
      </div>

      {/* Student Profile Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '22px',
          padding: '1.5rem',
          border: '1.5px solid #DDD8F5',
          boxShadow: '0 4px 18px rgba(108,40,180,0.06)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            boxShadow: '0 4px 16px rgba(123,47,190,0.3)',
          }}
        >
          {student?.avatar || '🧑‍🚀'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#7B2FBE', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            INFORME DE APRENDIZAJE · 1° GRADO
          </div>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '24px', fontWeight: 900, color: '#2A0F60', lineHeight: 1.2 }}>
            {student?.name || 'Astronauta de Fedor'}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            Colegio: <strong>{student?.school || 'Sin registrar'}</strong> · Ciudad: <strong>{student?.city || 'Colombia'}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ textAlign: 'center', background: '#FEF3E8', padding: '10px 14px', borderRadius: '14px', border: '1.5px solid #FFD66B' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#7A3200' }}>{coins} 🪙</div>
            <div style={{ fontSize: '10px', color: '#7A3200', fontWeight: 800 }}>Monedas</div>
          </div>
          <div style={{ textAlign: 'center', background: '#FEE8E4', padding: '10px 14px', borderRadius: '14px', border: '1.5px solid #FF8C2A' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#C94B22' }}>{streak} 🔥</div>
            <div style={{ fontSize: '10px', color: '#C94B22', fontWeight: 800 }}>Racha</div>
          </div>
        </div>
      </div>

      {/* Breakdown per unit */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {units.map((u) => {
          let done = 0;
          let total = 0;
          (u.topics || []).forEach((t, ti) => {
            (t.levels || []).forEach((_, li) => {
              total += 1;
              const k1 = `u${u.index}t${ti}-n${li + 1}`;
              const k2 = t.id ? `${t.id}-n${li + 1}` : k1;
              if (typeof scores[k1] === 'number' || typeof scores[k2] === 'number') {
                done += 1;
              }
            });
          });
          const pct = total ? Math.round((done / total) * 100) : 0;

          return (
            <div
              key={u.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '16px 20px',
                border: '1.5px solid #DDD8F5',
                boxShadow: '0 2px 10px rgba(108,40,180,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '17px', fontWeight: 900, color: '#2A0F60' }}>
                  {u.name}
                </div>
                <div style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>
                  {done} de {total} niveles completados
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 140, height: 10, background: '#E6E1FA', borderRadius: 6, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: pct >= 100 ? '#24C496' : 'linear-gradient(90deg,#7B2FBE,#FF8C2A)',
                      borderRadius: 6,
                    }}
                  />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 900, color: pct >= 100 ? '#24C496' : '#7B2FBE', minWidth: '40px' }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
