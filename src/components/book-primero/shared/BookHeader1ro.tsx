'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';
import Swal from 'sweetalert2';

interface BookHeader1roProps {
  onOpenIntro?: () => void;
  onOpenStatsLab?: () => void;
}

export default function BookHeader1ro({ onOpenIntro, onOpenStatsLab }: BookHeader1roProps) {
  const { book, student, coins, streak, scores, screen, goScreen, resetStudent } = useBook1();

  const handleExportCSV = () => {
    const rows: string[][] = [
      ['Unidad', 'Tema', 'Nivel', 'Puntos', 'Completado'],
    ];

    (book?.units || []).forEach((u) => {
      u.topics.forEach((t, ti) => {
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
    link.setAttribute('download', `progreso_fedor_1ro_${student?.name || 'estudiante'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveProgress = () => {
    try {
      const backup = {
        student,
        coins,
        streak,
        scores,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('fedor1_student', JSON.stringify(student));
      localStorage.setItem('fedor1_scores', JSON.stringify(scores));

      // Also trigger a downloadable json backup
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `respaldo_fedor_1ro_${student?.name || 'estudiante'}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: 'success',
        title: '¡Progreso guardado!',
        text: 'Tus avances han sido respaldados exitosamente.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudo generar el archivo de respaldo.',
      });
    }
  };

  const handleConfirmReset = async () => {
    const res = await Swal.fire({
      icon: 'warning',
      title: '¿Reiniciar progreso?',
      text: 'Se borrarán tus avances de 1° grado en este dispositivo.',
      showCancelButton: true,
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#BA340A',
      cancelButtonColor: '#aaa',
    });
    if (res.isConfirmed) {
      resetStudent();
    }
  };

  return (
    <header
      className="hdr"
      style={{
        position: 'relative',
        top: 0,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto 24px auto',
        background: '#FFFFFF',
        border: '1.5px solid #DDD8F5',
        borderRadius: '26px',
        padding: '14px 20px',
        boxShadow: '0 4px 18px rgba(108,40,180,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Top row: Brand & Grade pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          onClick={() => goScreen('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {/* Logo helmet orb SVG from MatematicasDeFedor_1.html */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 0 0 2.5px rgba(245,197,24,.5),0 4px 16px rgba(123,47,190,.5)',
            }}
          >
            <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
              <defs>
                <radialGradient id="sp44" cx="38%" cy="32%">
                  <stop offset="0%" stopColor="#6A20A8" />
                  <stop offset="55%" stopColor="#1A0848" />
                  <stop offset="100%" stopColor="#080E30" />
                </radialGradient>
                <radialGradient id="hb44" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="#F8F8F8" />
                  <stop offset="70%" stopColor="#D0D0D8" />
                  <stop offset="100%" stopColor="#A8A8B8" />
                </radialGradient>
                <radialGradient id="vs44" cx="30%" cy="25%">
                  <stop offset="0%" stopColor="#1A3060" />
                  <stop offset="100%" stopColor="#050A18" />
                </radialGradient>
              </defs>
              <circle cx="22" cy="22" r="22" fill="url(#sp44)" />
              <circle cx="7" cy="7" r="0.9" fill="white" opacity=".9" />
              <circle cx="37" cy="9" r="0.7" fill="white" opacity=".8" />
              <circle cx="39" cy="30" r="0.5" fill="white" opacity=".7" />
              <circle cx="5" cy="30" r="0.6" fill="white" opacity=".7" />
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="url(#hb44)" />
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="none" stroke="#E86010" strokeWidth="2.5" opacity=".9" />
              <ellipse cx="22" cy="22" rx="7.5" ry="6.5" fill="url(#vs44)" />
              <ellipse cx="19" cy="19" rx="2.8" ry="1.8" fill="rgba(255,255,255,0.28)" transform="rotate(-15,19,19)" />
              <path d="M12,15 Q22,9 32,15" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="17" y="35" width="10" height="4" rx="2" fill="#D0D0D8" />
            </svg>
          </div>

          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: '#7B2FBE', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              MATEMÁTICAS DE
            </div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px', fontWeight: 900, color: '#E8650A' }}>
              feDOR
            </div>
          </div>
        </div>

        <div>
          <span
            style={{
              background: 'linear-gradient(135deg, #FEF0E6, #FFE2C8)',
              border: '1.5px solid #FBBF7A',
              color: '#B84D00',
              fontSize: '13px',
              fontWeight: 900,
              borderRadius: '20px',
              padding: '5px 16px',
              letterSpacing: '.02em',
            }}
          >
            1° Grado
          </span>
        </div>
      </div>

      {/* Buttons row 1 matching Imagen 1 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {/* 1. 🎬 Repetir */}
        <button
          type="button"
          onClick={() => {
            if (onOpenIntro) onOpenIntro();
            else goScreen('setup');
          }}
          style={{
            background: '#FFFFFF',
            border: '2px solid #7B2FBE',
            color: '#7B2FBE',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(123,47,190,0.12)',
            transition: 'all 0.15s',
          }}
        >
          <span>🎬</span>
          <span>Repetir</span>
        </button>

        {/* 2. 🗂️ Espacial */}
        <button
          type="button"
          onClick={() => goScreen('galaxy')}
          style={{
            background: '#1A6CB4',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(26,108,180,0.25)',
            transition: 'all 0.15s',
          }}
        >
          <span>🗂️</span>
          <span>Espacial</span>
        </button>

        {/* 3. 📖 Diario */}
        <button
          type="button"
          onClick={() => goScreen('diary')}
          style={{
            background: '#7B2FBE',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(123,47,190,0.25)',
            transition: 'all 0.15s',
          }}
        >
          <span>📖</span>
          <span>Diario</span>
        </button>

        {/* 4. 🪙 Monedas */}
        <div
          style={{
            background: '#FEF3E8',
            border: '1.5px solid #FFD66B',
            color: '#7A3200',
            borderRadius: '24px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 900,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>🪙</span>
          <span>{coins}</span>
        </div>

        {/* 5. 🔥 Racha */}
        <div
          style={{
            background: '#FEE8E4',
            border: '1.5px solid #FF8C2A',
            color: '#C94B22',
            borderRadius: '24px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 900,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>🔥</span>
          <span>{streak}</span>
        </div>

        {/* 6. 📊 Reporte */}
        <button
          type="button"
          onClick={() => goScreen('report')}
          style={{
            background: 'linear-gradient(135deg, #FEF0E6, #FFE2C8)',
            border: '1.5px solid #FBBF7A',
            color: '#B84D00',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s',
          }}
        >
          <span>📊</span>
          <span>Reporte</span>
        </button>

        {/* 7. 🎴 Exportar */}
        <button
          type="button"
          onClick={handleExportCSV}
          style={{
            background: '#EEEDFE',
            border: '1.5px solid #C5BFEE',
            color: '#7B2FBE',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s',
          }}
        >
          <span>🎴</span>
          <span>Exportar</span>
        </button>

        {/* 8. 🧑‍🚀 Perfil */}
        <button
          type="button"
          onClick={() => goScreen('profile')}
          style={{
            background: '#EEEDFE',
            border: '1.5px solid #C5BFEE',
            color: '#7B2FBE',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s',
          }}
        >
          <span>{student?.avatar || '🧑‍🚀'}</span>
          <span>Perfil</span>
        </button>
      </div>

      {/* Buttons row 2 matching Imagen 1 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {/* 9. 🛒 Tienda */}
        <button
          type="button"
          onClick={() => goScreen('shop')}
          style={{
            background: 'linear-gradient(135deg, #16876A, #24C496)',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(22,135,106,0.25)',
            transition: 'all 0.15s',
          }}
        >
          <span>🛒</span>
          <span>Tienda</span>
        </button>

        {/* 10. ⬇ Guardar */}
        <button
          type="button"
          onClick={handleSaveProgress}
          style={{
            background: 'linear-gradient(135deg, #E8650A, #FF8C2A)',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(232,101,10,0.25)',
            transition: 'all 0.15s',
          }}
        >
          <span>⬇</span>
          <span>Guardar</span>
        </button>

        {/* 11. 🔄 Reiniciar */}
        <button
          type="button"
          onClick={handleConfirmReset}
          style={{
            background: '#FFF5F2',
            border: '1.5px solid #FBC0B0',
            color: '#BA340A',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s',
          }}
        >
          <span>🔄</span>
          <span>Reiniciar</span>
        </button>
      </div>
    </header>
  );
}
