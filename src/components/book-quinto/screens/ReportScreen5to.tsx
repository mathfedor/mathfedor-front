'use client';

import React, { useMemo, useState } from 'react';
import { useBook5 } from '../context/Book5Context';
import bookCurriculum5 from '@/mocks/data/book-curriculum-5.data.json';

// ── RANGOS OFICIALES MÉTODO FEDOR 5° ──
const RANKS_5TO = [
  { min: 0, label: '🌱 Explorador', name: 'Explorador', color: '#16876A' },
  { min: 100, label: '⭐ Aprendiz', name: 'Aprendiz', color: '#BA7517' },
  { min: 300, label: '🔥 Aventurero', name: 'Aventurero', color: '#E8650A' },
  { min: 600, label: '💎 Experto', name: 'Experto', color: '#1A6CB4' },
  { min: 1000, label: '🌌 Maestro', name: 'Maestro', color: '#7B2FBE' },
  { min: 2000, label: '☄️ Leyenda', name: 'Leyenda', color: '#C94B22' },
];

function getRank5to(xp: number) {
  return [...RANKS_5TO].reverse().find((r) => xp >= r.min) || RANKS_5TO[0];
}

// ── MEDALLAS OFICIALES FEDOR 5° ──
const ALL_BADGES_5TO = [
  { id: 'first_correct', emoji: '🌟', name: 'Primera estrella', tip: '¡Primera respuesta correcta!', bg: '#EEEDFE', bc: '#C5BFEE' },
  { id: 'streak3', emoji: '🔥', name: 'Racha × 3', tip: '3 correctas seguidas', bg: '#FEF3E8', bc: '#FBBF7A' },
  { id: 'streak5', emoji: '💥', name: 'Racha × 5', tip: '5 correctas seguidas', bg: '#FAECE7', bc: '#F5B09A' },
  { id: 'streak10', emoji: '☄️', name: 'Meteoro', tip: '10 correctas seguidas', bg: '#1A0A3C', bc: '#7B2FBE' },
  { id: 'speed_demon', emoji: '⚡', name: 'Velocidad', tip: 'Respondiste en menos de 5 seg', bg: '#FEF8E0', bc: '#F5C518' },
  { id: 'perfect_level', emoji: '💎', name: 'Perfección', tip: '100% en un nivel completo', bg: '#E0F0FF', bc: '#8EBBF0' },
  { id: 'topic_master', emoji: '🏆', name: 'Maestro del tema', tip: 'Completaste un tema al 100%', bg: '#E0FFF5', bc: '#95DAC4' },
  { id: 'unit_complete', emoji: '🌌', name: 'Conquistador', tip: '¡Unidad completada!', bg: '#1A0A3C', bc: '#A864E8' },
  { id: 'daily_login', emoji: '📅', name: 'Constante', tip: 'Entraste varios días seguidos', bg: '#FEF3E8', bc: '#FBBF7A' },
  { id: 'xp_500', emoji: '🎯', name: 'Puntero', tip: '¡Alcanzaste 500 XP!', bg: '#EEEDFE', bc: '#C5BFEE' },
  { id: 'xp_1000', emoji: '🚀', name: 'Astronauta', tip: '¡Alcanzaste 1000 XP!', bg: '#1A0A3C', bc: '#A864E8' },
];

function calculateGrade(pts: number, max: number) {
  const p = max > 0 ? (pts / max) * 100 : 0;
  if (p >= 90) {
    return { letter: 'S', num: '5.0', lbl: '🏆 Superior', barColor: '#06A570', pct: Math.round(p) };
  }
  if (p >= 70) {
    return { letter: 'A', num: '4.0', lbl: '✅ Alto', barColor: '#1A6CB4', pct: Math.round(p) };
  }
  if (p >= 50) {
    return { letter: 'B', num: '3.0', lbl: '📘 Básico', barColor: '#BA7517', pct: Math.round(p) };
  }
  return { letter: 'L', num: '2.0', lbl: '⚠️ Bajo', barColor: '#C94B22', pct: Math.round(p) };
}

export default function ReportScreen5to() {
  const { student, coins, streak, totalXP, scores, goScreen } = useBook5();
  const [showTable, setShowTable] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);

  const units = (bookCurriculum5.UNITS || []) as any[];

  // ── CÁLCULO DE PROGRESO GLOBAL Y POR UNIDAD ──
  const {
    unitStats,
    totalLevels,
    totalDone,
    globalPct,
    totalPts,
    maxPossiblePts,
  } = useMemo(() => {
    let tt = 0;
    let td = 0;
    let sumPts = 0;
    let sumMax = 0;

    const list = units.map((u: any, ui: number) => {
      let uTotal = 0;
      let uDone = 0;
      let uScoreSum = 0;

      (u.topics || []).forEach((t: any, ti: number) => {
        (t.levels || []).forEach((lv: any, li: number) => {
          tt++;
          uTotal++;
          const k = `${t.id || `u${ui}t${ti}`}-n${li + 1}`;
          const sc = scores[k] || 0;
          if (sc >= 50) {
            td++;
            uDone++;
          }
          uScoreSum += sc;
          sumPts += sc;
          const exPts = (lv.exercises || []).reduce((a: number, e: any) => a + (e.pts || 10), 0) || 100;
          sumMax += exPts;
        });
      });

      const uPct = uTotal > 0 ? Math.round(uScoreSum / uTotal) : 0;
      return {
        unitIndex: ui,
        name: u.name,
        icon: u.icon || '📘',
        total: uTotal,
        done: uDone,
        pct: uPct,
        topics: u.topics || [],
      };
    });

    const gPct = tt > 0 ? Math.round((td / tt) * 100) : 0;
    return {
      unitStats: list,
      totalLevels: tt || 370,
      totalDone: td,
      globalPct: gPct,
      totalPts: sumPts,
      maxPossiblePts: sumMax || 1,
    };
  }, [units, scores]);

  const currentRank = getRank5to(totalXP);
  const currentGrade = calculateGrade(totalPts, maxPossiblePts);

  // Número de medallas conquistadas
  const earnedBadgesCount = useMemo(() => {
    let count = 0;
    if (totalXP >= 50) count++;
    if (streak >= 3) count++;
    if (streak >= 5) count++;
    if (streak >= 10) count++;
    if (totalDone >= 1) count++;
    if (totalDone >= 5) count++;
    if (totalXP >= 500) count++;
    if (totalXP >= 1000) count++;
    return count;
  }, [totalXP, streak, totalDone]);

  const handleSimulateAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiDone(true);
    }, 1200);
  };

  const handleDownloadProgress = () => {
    try {
      const data = {
        libro: 'Matemáticas de Fedor 5°',
        version: '2026.09',
        fecha: new Date().toISOString(),
        student: student || null,
        scores: scores || {},
        totalXP: totalXP || 0,
        coins: coins || 0,
        streak: streak || 0,
        totalLevels: totalLevels,
        completedLevels: totalDone,
        globalPct: globalPct,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const nom = (student?.name || 'estudiante').replace(/[^\wÁÉÍÓÚáéíóúÑñ]+/g, '_');
      a.href = url;
      a.download = `progreso_fedor5_${nom}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 500);
    } catch (err) {
      console.error('Error al descargar progreso:', err);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportTeacherJson = () => {
    try {
      const payload = {
        platform: 'Matemáticas de Fedor',
        book: 'Libro Interactivo Grado 5°',
        exportDate: new Date().toISOString(),
        student: student,
        scores: scores,
        summary: {
          totalUnits: units.length,
          totalLevels: totalLevels,
          completedLevels: totalDone,
          globalPct: globalPct,
          totalPts: totalPts,
          grade: currentGrade,
          rank: currentRank,
        },
        unitBreakdown: unitStats.map((u) => ({
          unit: u.name,
          totalLevels: u.total,
          completedLevels: u.done,
          percentage: u.pct,
        })),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const nom = (student?.name || 'docente').replace(/[^\wÁÉÍÓÚáéíóúÑñ]+/g, '_');
      a.href = url;
      a.download = `fedor5_reporte_docente_${nom}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 500);
    } catch (err) {
      console.error('Error al exportar datos JSON:', err);
    }
  };

  return (
    <div className="report-page-container">
      <style>{`
        .report-page-container {
          min-height: 100vh;
          background: #F4F0FD;
          padding: 24px 20px 60px;
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
        }

        .report-inner {
          max-width: 860px;
          margin: 0 auto;
        }

        /* ── BOTÓN VOLVER INICIO ── */
        .report-back-btn {
          font-size: 15px;
          font-weight: 800;
          color: #5C21A6;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
          background: none;
          border: none;
          padding: 4px 8px 4px 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          outline: none;
        }

        .report-back-btn:hover {
          opacity: 0.85;
          text-decoration: underline;
          transform: translateX(-2px);
        }

        /* ── 1. CABECERA CÓSMICA ESTUDIANTE ── */
        .report-hero-card {
          background: linear-gradient(155deg, #0D0630 0%, #1E0848 55%, #051A14 100%);
          border-radius: 24px;
          padding: 22px 24px 20px;
          margin-bottom: 16px;
          box-shadow: 0 12px 40px rgba(76, 29, 149, 0.35);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .report-hero-stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: 
            radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 140px 70px, #ffd700, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 220px 40px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 380px 80px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 520px 25px, #c4b5fd, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 680px 65px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 800px 35px, #fbcfe8, rgba(0,0,0,0));
          opacity: 0.8;
        }

        .report-student-row {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 1;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .report-avatar-circle {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: rgba(245, 197, 24, 0.12);
          border: 2.5px solid rgba(245, 197, 24, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .report-student-meta {
          flex: 1;
          min-width: 140px;
        }

        .report-student-name {
          font-family: 'Baloo 2', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 4px;
          line-height: 1.15;
          letter-spacing: 0.02em;
        }

        .report-student-sub1 {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 2px;
        }

        .report-student-sub2 {
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 600;
        }

        .report-hero-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 580px) {
          .report-hero-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .report-hero-cell {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px 8px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-sizing: border-box;
        }

        .report-cell-num {
          font-size: 17px;
          font-weight: 900;
          font-family: 'Baloo 2', sans-serif;
          line-height: 1.2;
        }

        .report-cell-lbl {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 800;
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── 2. CARD: DESEMPEÑO GLOBAL ── */
        .report-card {
          background: #FFFFFF;
          border: 1.5px solid #EDE8F5;
          border-radius: 20px;
          padding: 18px 24px;
          margin-bottom: 16px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
        }

        .report-card-title {
          font-size: 11.5px;
          font-weight: 900;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .report-kpi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }

        @media (max-width: 540px) {
          .report-kpi-grid {
            grid-template-columns: 1fr;
          }
        }

        .report-kpi-box {
          border-radius: 16px;
          padding: 18px 12px;
          text-align: center;
          box-sizing: border-box;
        }

        .report-kpi-left {
          background: linear-gradient(135deg, #F7F4FF 0%, #EDE8FF 100%);
          border: 1.5px solid #DDD6FE;
        }

        .report-kpi-right {
          background: linear-gradient(135deg, #EDFFF8 0%, #D6F8EC 100%);
          border: 1.5px solid #A7F3D0;
        }

        .report-kpi-big {
          font-size: 38px;
          font-weight: 900;
          font-family: 'Baloo 2', sans-serif;
          line-height: 1;
        }

        .report-kpi-grade {
          font-size: 17px;
          font-weight: 900;
          color: #0D9488;
          line-height: 1.3;
        }

        .report-kpi-sub {
          font-size: 11.5px;
          font-weight: 800;
          color: #6B7280;
          margin-top: 5px;
        }

        .report-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 800;
          color: #4B5563;
          padding-top: 4px;
        }

        /* ── 3. CARD: AVANCE POR UNIDAD ── */
        .report-unit-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .report-unit-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 14px;
        }

        .report-unit-name {
          font-size: 12.5px;
          font-weight: 800;
          color: #1E1538;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.3;
        }

        .report-bar-track {
          height: 7px;
          background: #EDE8F5;
          border-radius: 4px;
          overflow: hidden;
          width: 100%;
        }

        .report-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .report-unit-pct {
          font-size: 13.5px;
          font-weight: 900;
          min-width: 40px;
          text-align: right;
        }

        /* ── TABLA DE SEGUIMIENTO Y BADGES ── */
        .report-table-wrap {
          overflow-x: auto;
          margin-top: 12px;
          border: 1px solid #EDE8F5;
          border-radius: 14px;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11.5px;
        }

        .report-table th {
          background: #F7F4FF;
          padding: 8px 10px;
          font-weight: 900;
          color: #5C21A6;
          text-align: left;
        }

        .report-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #F1EDF8;
          color: #1E293B;
        }

        .report-toggle-btn {
          margin-top: 10px;
          padding: 8px 16px;
          background: #F7F4FF;
          border: 1.5px solid #DDD6FE;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 900;
          color: #5C21A6;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .report-toggle-btn:hover {
          background: #EDE8FF;
        }

        /* ── BOTONES DE ACCIÓN (DESCARGAR, IMPRIMIR, EXPORTAR) ── */
        .report-action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 520px) {
          .report-action-grid {
            grid-template-columns: 1fr;
          }
        }

        .report-btn-action {
          padding: 13px 16px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-sizing: border-box;
          transition: filter 0.15s ease, transform 0.12s ease;
          outline: none;
        }

        .report-btn-action:hover {
          filter: brightness(0.96);
          transform: translateY(-1px);
        }

        .report-btn-action:active {
          transform: scale(0.99);
        }

        .report-btn-gray {
          background: #ECECEC;
          border: 1px solid #767676;
          color: #000000;
        }

        .report-btn-teal {
          background: linear-gradient(135deg, #16876A, #24C496);
          border: 1px solid #0F5A46;
          color: #000000;
        }

        .report-btn-full {
          width: 100%;
          margin-bottom: 1.5rem;
        }
      `}</style>

      <div className="report-inner animate-fadeIn">
        {/* ── BOTÓN INICIO (Top-Left) ── */}
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="report-back-btn"
          title="Regresar a la pantalla principal"
        >
          <span>←</span>
          <span>Inicio</span>
        </button>

        {/* ═════════════════════════════════════════════════════════════
            1. CABECERA CÓSMICA DEL ESTUDIANTE (REPRODUCCIÓN EXACTA)
        ═════════════════════════════════════════════════════════════ */}
        <div className="report-hero-card">
          <div className="report-hero-stars" />

          {/* Fila del Estudiante */}
          <div className="report-student-row">
            <div className="report-avatar-circle">
              {student?.avatar || '🧑‍🚀'}
            </div>
            <div className="report-student-meta">
              <div className="report-student-name">
                {student?.name || 'va'}
              </div>
              <div className="report-student-sub1">
                <span>🏫 {student?.school || 'co'}</span>
                <span>🏢 {student?.city || 'ciu'}</span>
              </div>
              <div className="report-student-sub2">
                <span>🛡️ {student?.teacher || 'do'} · 📅 {student?.email || '—'}</span>
              </div>
            </div>
          </div>

          {/* Grid de 4 Métricas Clave */}
          <div className="report-hero-grid">
            {/* Box 1: XP */}
            <div className="report-hero-cell">
              <div className="report-cell-num" style={{ color: '#FF8C2A' }}>
                {totalXP} XP
              </div>
              <div className="report-cell-lbl">XP</div>
            </div>

            {/* Box 2: RANGO */}
            <div className="report-hero-cell">
              <div className="report-cell-num" style={{ color: '#F5C518', fontSize: '13px' }}>
                ★ {currentRank.name}
              </div>
              <div className="report-cell-lbl">RANGO</div>
            </div>

            {/* Box 3: RACHA */}
            <div className="report-hero-cell">
              <div className="report-cell-num" style={{ color: '#FF8C2A' }}>
                {streak} 🔥
              </div>
              <div className="report-cell-lbl">RACHA</div>
            </div>

            {/* Box 4: MEDALLAS */}
            <div className="report-hero-cell">
              <div className="report-cell-num" style={{ color: '#FF8C2A' }}>
                {earnedBadgesCount} 🏅
              </div>
              <div className="report-cell-lbl">MEDALLAS</div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            2. CARD: DESEMPEÑO GLOBAL
        ═════════════════════════════════════════════════════════════ */}
        <div className="report-card">
          <div className="report-card-title">
            <span style={{ fontSize: '14px', lineHeight: 1 }}>🗂️</span>
            <span>DESEMPEÑO GLOBAL</span>
          </div>

          <div className="report-kpi-grid">
            {/* Logro Global */}
            <div className="report-kpi-box report-kpi-left">
              <div className="report-kpi-big" style={{ color: '#5C21A6' }}>
                {globalPct}%
              </div>
              <div className="report-kpi-sub">Logro global</div>
            </div>

            {/* Nota · Nivel MEN */}
            <div className="report-kpi-box report-kpi-right">
              <div className="report-kpi-grade">
                {currentGrade.num} · {currentGrade.lbl}
              </div>
              <div className="report-kpi-sub">Nota · Nivel MEN</div>
            </div>
          </div>

          <div className="report-footer-row">
            <span>🗂️ {totalDone} / {totalLevels} niveles</span>
            <span style={{ color: '#D97706' }}>⭐ {totalPts} pts</span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            3. CARD: AVANCE POR UNIDAD (LISTA DE LAS 20 UNIDADES)
        ═════════════════════════════════════════════════════════════ */}
        <div className="report-card">
          <div className="report-card-title">
            <span style={{ fontSize: '14px', lineHeight: 1 }}>📝</span>
            <span>AVANCE POR UNIDAD</span>
          </div>

          <div className="report-unit-stack">
            {unitStats.map((u) => {
              const col =
                u.pct >= 90
                  ? '#06A570'
                  : u.pct >= 70
                  ? '#1A6CB4'
                  : u.pct >= 50
                  ? '#BA7517'
                  : '#C94B22';

              return (
                <div key={u.unitIndex} className="report-unit-row">
                  <div>
                    <div className="report-unit-name">
                      <span>{u.icon}</span>
                      <span>{u.name}</span>
                    </div>
                    <div className="report-bar-track">
                      <div
                        className="report-bar-fill"
                        style={{
                          background: col,
                          width: `${u.pct}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="report-unit-pct" style={{ color: col }}>
                    {u.pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            4. CARD: SEGUIMIENTO POR UNIDAD · TODOS LOS NIVELES
        ═════════════════════════════════════════════════════════════ */}
        <div className="report-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="report-card-title" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>📋</span>
              <span>SEGUIMIENTO POR UNIDAD · TODOS LOS NIVELES</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTable((prev) => !prev)}
              className="report-toggle-btn"
            >
              {showTable ? '▲ Ocultar detalle' : '▼ Ver los 370 niveles'}
            </button>
          </div>

          {showTable && (
            <div className="report-table-wrap">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Tema / Nivel</th>
                    <th style={{ textAlign: 'center' }}>Estado</th>
                    <th style={{ textAlign: 'center' }}>Progreso</th>
                    <th style={{ textAlign: 'center' }}>⭐</th>
                    <th style={{ textAlign: 'center' }}>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {unitStats.map((u) => (
                    <React.Fragment key={u.unitIndex}>
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            background: 'linear-gradient(135deg,#7B2FBE,#16876A)',
                            color: '#FFFFFF',
                            fontWeight: 900,
                            padding: '8px 12px',
                          }}
                        >
                          {u.icon} {u.name}
                        </td>
                      </tr>
                      {u.topics.map((t: any, ti: number) =>
                        (t.levels || []).map((lv: any, li: number) => {
                          const k = `${t.id || `u${u.unitIndex}t${ti}`}-n${li + 1}`;
                          const sc = scores[k] || 0;
                          const stIcon = sc >= 90 ? '🏆' : sc >= 70 ? '✅' : sc >= 50 ? '📘' : sc > 0 ? '🔄' : '⬜';
                          const g = calculateGrade(sc, 100);

                          return (
                            <tr key={`${ti}-${li}`}>
                              <td style={{ fontWeight: 700 }}>
                                {t.title || t.id || `Tema ${ti + 1}`}{' '}
                                <span style={{ color: '#6B7280', fontSize: '10px' }}>
                                  ({lv.label || `Nivel ${li + 1}`})
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>{stIcon}</td>
                              <td style={{ textAlign: 'center', minWidth: '80px' }}>
                                <div className="report-bar-track" style={{ height: 6 }}>
                                  <div
                                    className="report-bar-fill"
                                    style={{
                                      background: g.barColor,
                                      width: `${sc}%`,
                                    }}
                                  />
                                </div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: g.barColor, marginTop: 2 }}>
                                  {sc}%
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {sc >= 90 ? '⭐⭐⭐' : sc >= 70 ? '⭐⭐' : sc >= 50 ? '⭐' : '—'}
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 900, color: g.barColor }}>
                                {sc > 0 ? g.lbl : '—'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════
            5. CARD: MEDALLAS CONQUISTADAS
        ═════════════════════════════════════════════════════════════ */}
        <div className="report-card">
          <div className="report-card-title">
            <span style={{ fontSize: '14px', lineHeight: 1 }}>🏅</span>
            <span>MEDALLAS CONQUISTADAS</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', padding: '8px 0' }}>
            {ALL_BADGES_5TO.map((b, i) => {
              const earned = i < earnedBadgesCount;
              return (
                <div
                  key={b.id}
                  title={b.tip}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: earned ? 1 : 0.35,
                    filter: earned ? 'none' : 'grayscale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: b.bg,
                      border: `2.5px solid ${b.bc}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      boxShadow: earned ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    {b.emoji}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#6B7280', textAlign: 'center', maxWidth: '58px', lineHeight: 1.2 }}>
                    {b.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            6. CARD: ANÁLISIS IA — MÉTODO FEDOR
        ═════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: 'linear-gradient(155deg, #0D0630 0%, #1E0848 50%, #051A14 100%)',
            borderRadius: '22px',
            padding: '22px 24px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(123, 47, 190, 0.3)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 4px 14px rgba(245, 197, 24, 0.4)',
                flexShrink: 0,
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '17px', fontWeight: 900, color: '#FFFFFF' }}>
                Análisis IA — Método Fedor
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Reporte pedagógico inteligente para docente y familia
              </div>
            </div>
          </div>

          {!aiDone && !aiLoading && (
            <button
              type="button"
              onClick={handleSimulateAI}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #24C496, #0D9488)',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: '0 4px 14px rgba(36, 196, 150, 0.3)',
              }}
            >
              ⚡ Generar Análisis Pedagógico Inteligente
            </button>
          )}

          {aiLoading && (
            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '13px', fontWeight: 700 }}>
              🤖 Procesando métricas pedagógicas con el Método Fedor...
            </div>
          )}

          {aiDone && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div style={{ background: 'rgba(36, 196, 150, 0.12)', borderRadius: '14px', padding: '12px 14px', borderLeft: '4px solid #24C496' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#24C496', textTransform: 'uppercase', marginBottom: '4px' }}>
                  👩‍🏫 Para el Docente
                </div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                  {student?.name || 'El estudiante'} se encuentra en proceso de avance en el ciclo 5° de primaria ({totalDone} de 370 niveles completados). Se recomienda afianzar los conceptos de valor posicional, operaciones básicas combinadas y fracciones utilizando los recursos visuales y problemas contextualizados del Método Fedor.
                </div>
              </div>

              <div style={{ background: 'rgba(232, 101, 10, 0.12)', borderRadius: '14px', padding: '12px 14px', borderLeft: '4px solid #FF8C2A' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#FF8C2A', textTransform: 'uppercase', marginBottom: '4px' }}>
                  👨‍👩‍👧 Para la Familia
                </div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                  ¡{student?.name || 'Tu hijo/a'} ha acumulado {totalXP} XP de experiencia en su viaje matemático! Felicitaciones por su dedicación; recomendamos continuar con sesiones cortas de 15 a 20 minutos diarios.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════
            7. BOTONES DE ACCIÓN (DESCARGAR, IMPRIMIR, EXPORTAR JSON)
        ═════════════════════════════════════════════════════════════ */}
        <div className="report-action-grid">
          <button
            type="button"
            onClick={handleDownloadProgress}
            className="report-btn-action report-btn-gray"
            title="Descargar archivo con tu progreso completo"
          >
            <span>⬇️</span>
            <span>Descargar progreso</span>
          </button>
          <button
            type="button"
            onClick={handlePrintReport}
            className="report-btn-action report-btn-teal"
            title="Imprimir informe oficial del estudiante"
          >
            <span>🖨️</span>
            <span>Imprimir reporte</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleExportTeacherJson}
          className="report-btn-action report-btn-gray report-btn-full"
          title="Exportar métricas académicas en formato JSON para el docente"
        >
          <span>📤</span>
          <span>Exportar datos JSON (docente)</span>
        </button>
      </div>
    </div>
  );
}
