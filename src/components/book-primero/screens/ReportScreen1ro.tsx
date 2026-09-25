'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook1 } from '../context/Book1Context';
import bookCurriculum1 from '@/mocks/data/book-curriculum-1.data.json';

interface AIAnalysisState {
  teacher: string;
  family: string;
  positive: string[];
  improve: string[];
}

const RANKS = [
  { min: 0, label: '🌱 Explorador', color: '#16876A' },
  { min: 100, label: '⭐ Aprendiz', color: '#BA7517' },
  { min: 300, label: '🔥 Aventurero', color: '#E8650A' },
  { min: 600, label: '💎 Experto', color: '#1A6CB4' },
  { min: 1000, label: '🌌 Maestro', color: '#7B2FBE' },
  { min: 2000, label: '☄️ Leyenda', color: '#C94B22' },
];

function getRank(xp: number) {
  return [...RANKS].reverse().find((r) => xp >= r.min) || RANKS[0];
}

const ALL_BADGES = [
  { id: 'first_correct', emoji: '🌟', name: 'Primera estrella', tip: '¡Primera respuesta correcta!', bg: '#EEEDFE', bc: '#C5BFEE' },
  { id: 'streak3', emoji: '🔥', name: 'Racha × 3', tip: '3 correctas seguidas', bg: '#FEF3E8', bc: '#FBBF7A' },
  { id: 'streak5', emoji: '💥', name: 'Racha × 5', tip: '5 correctas seguidas', bg: '#FAECE7', bc: '#F5B09A' },
  { id: 'streak10', emoji: '☄️', name: 'Meteoro', tip: '10 correctas seguidas', bg: '#1A0A3C', bc: '#7B2FBE' },
  { id: 'speed_demon', emoji: '⚡', name: 'Velocidad', tip: 'Respondiste en menos de 5 seg', bg: '#FEF8E0', bc: '#F5C518' },
  { id: 'perfect_level', emoji: '💎', name: 'Perfección', tip: '100% en un nivel completo', bg: '#E0F0FF', bc: '#8EBBF0' },
  { id: 'topic_master', emoji: '🏆', name: 'Maestro del tema', tip: 'Completaste un tema al 100%', bg: '#E0FFF5', bc: '#95DAC4' },
  { id: 'unit_complete', emoji: '🌌', name: 'Conquistador', tip: '¡Unidad 1 completada!', bg: '#1A0A3C', bc: '#A864E8' },
  { id: 'daily_login', emoji: '📅', name: 'Constante', tip: 'Entraste 3 días seguidos', bg: '#FEF3E8', bc: '#FBBF7A' },
  { id: 'xp_500', emoji: '🎯', name: 'Puntero', tip: '¡Alcanzaste 500 XP!', bg: '#EEEDFE', bc: '#C5BFEE' },
  { id: 'xp_1000', emoji: '🚀', name: 'Astronauta', tip: '¡Alcanzaste 1000 XP!', bg: '#1A0A3C', bc: '#A864E8' },
];

function grade(pts: number, max: number) {
  const p = max > 0 ? (pts / max) * 100 : 0;
  const stars = p >= 95 ? '⭐⭐⭐⭐⭐' : p >= 80 ? '⭐⭐⭐⭐' : p >= 65 ? '⭐⭐⭐' : p >= 50 ? '⭐⭐' : '⭐';
  const adaptive =
    p >= 95 ? '¡Dominio total! Eres un maestro 🚀' :
    p >= 80 ? '¡Excelente! Sigue avanzando 🌟' :
    p >= 65 ? '¡Muy bien! Un poco más de práctica 💪' :
    p >= 50 ? 'Buen intento. Repasa los ejemplos 📚' :
    'Necesitas repasar. ¡Tú puedes! 🔄';

  if (p >= 90) return { letter: 'S', num: '5.0', lbl: '🏆 Superior', stars, adaptive, cls: 'rg-s',
    desc: 'Dominio completo · MEN: Desempeño Superior', barColor: '#06A570', pct: Math.round(p) };
  if (p >= 70) return { letter: 'A', num: '4.0', lbl: '✅ Alto', stars, adaptive, cls: 'rg-a',
    desc: 'Muy buen desempeño · MEN: Desempeño Alto', barColor: '#1A6CB4', pct: Math.round(p) };
  if (p >= 50) return { letter: 'B', num: '3.0', lbl: '📘 Básico', stars, adaptive, cls: 'rg-b',
    desc: 'Desempeño mínimo logrado · MEN: Básico', barColor: '#BA7517', pct: Math.round(p) };
  return { letter: 'L', num: '2.0', lbl: '⚠️ Bajo', stars, adaptive, cls: 'rg-l',
    desc: 'Necesita refuerzo · MEN: Bajo', barColor: '#C94B22', pct: Math.round(p) };
}

const LEVEL_LABELS = ['🟢 Básico', '🟡 Medio', '🔴 Avanzado', '🟣 N4', '🏆 N5'];

function getStatusIcon(pct: number) {
  if (pct >= 90) return '🏆';
  if (pct >= 70) return '✅';
  if (pct >= 50) return '📘';
  if (pct > 0) return '🔄';
  return '⬜';
}

export default function ReportScreen1ro() {
  const {
    book,
    student,
    streak,
    totalXP,
    scores,
    goScreen,
    reportAutoRunAI,
    setReportAutoRunAI,
  } = useBook1();

  const [collapsedUnits, setCollapsedUnits] = useState<Record<number, boolean>>({});
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisState | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const aiSectionRef = useRef<HTMLDivElement>(null);

  // Garantizar acceso completo a las 6 unidades con sus 145 niveles
  const units = useMemo(() => {
    if (book?.units && Array.isArray(book.units) && book.units.length > 0) {
      return book.units;
    }
    return (bookCurriculum1.UNITS || []) as any[];
  }, [book]);

  // Cálculo detallado de avances y métricas
  const {
    totalLevelsCount,
    doneLevelsCount,
    totalEarnedPts,
    totalPossiblePts,
    globalPct,
    globalGrade,
    unitSummaries,
    unitProgressMap,
    allLevelScores,
  } = useMemo(() => {
    let tt = 0;
    let td = 0;
    let tp = 0;
    let mp = 0;
    const uSummaries: Array<{ name: string; icon: string; done: number; total: number; pct: number; color: string }> = [];
    const uProgMap: Record<number, Array<{
      topicTitle: string;
      topicIcon: string;
      levelLabel: string;
      pct: number;
      pts: number;
      max: number;
      isDone: boolean;
      statusIcon: string;
      g: ReturnType<typeof grade> | null;
    }>> = {};
    const allLvl: Array<{ pct: number; pts: number; isDone: boolean }> = [];

    units.forEach((u, ui) => {
      let uDone = 0;
      let uTotal = 0;
      const lvlList: typeof uProgMap[number] = [];

      (u.topics || []).forEach((t: any, ti: number) => {
        (t.levels || []).forEach((lv: any, li: number) => {
          tt++;
          uTotal++;
          const k1 = `u${ui}t${ti}-n${li + 1}`;
          const k2 = t.id ? `${t.id}-n${li + 1}` : k1;
          const k3 = t.id ? `${t.id}:${li}` : k1;
          const raw: any = (scores as Record<string, any>)[k1] ?? (scores as Record<string, any>)[k2] ?? (scores as Record<string, any>)[k3];

          let pct = 0;
          let pts = 0;
          let max = 300;
          if (lv.exercises && Array.isArray(lv.exercises) && lv.exercises.length > 0) {
            max = lv.exercises.reduce((sum: number, ex: any) => sum + (ex.pts || 30), 0);
          }

          if (raw != null) {
            if (typeof raw === 'number') {
              pct = raw;
              pts = Math.round((raw / 100) * max);
            } else if (typeof raw === 'object') {
              pct = raw.pct ?? (raw.max ? Math.round((raw.pts / raw.max) * 100) : 0);
              pts = raw.pts ?? Math.round((pct / 100) * (raw.max || max));
              max = raw.max ?? max;
            }
          }

          const isDone = pct >= 50 || pts > 0;
          if (isDone) {
            td++;
            uDone++;
          }
          tp += pts;
          mp += max;

          const g = (raw != null && (pts > 0 || pct > 0)) ? grade(pts, max || 1) : null;
          const statusIcon = getStatusIcon(pct);
          const levelLabel = LEVEL_LABELS[li] || `N${li + 1}`;

          lvlList.push({
            topicTitle: t.title || t.id || `Tema ${ti + 1}`,
            topicIcon: t.icon || '•',
            levelLabel,
            pct,
            pts,
            max,
            isDone,
            statusIcon,
            g,
          });

          allLvl.push({ pct, pts, isDone });
        });
      });

      const uPct = uTotal > 0 ? Math.round((uDone / uTotal) * 100) : 0;
      const col = uPct >= 90 ? '#06A570' : uPct >= 70 ? '#1A6CB4' : uPct >= 50 ? '#BA7517' : '#C94B22';

      uSummaries.push({
        name: u.name,
        icon: u.icon || '➕',
        done: uDone,
        total: uTotal,
        pct: uPct,
        color: col,
      });

      uProgMap[ui] = lvlList;
    });

    const gPct = mp > 0 ? Math.round((tp / mp) * 100) : (tt > 0 ? Math.round((td / tt) * 100) : 0);
    const gGrade = grade(tp, mp || 1);

    return {
      totalLevelsCount: tt,
      doneLevelsCount: td,
      totalEarnedPts: tp,
      totalPossiblePts: mp,
      globalPct: gPct,
      globalGrade: gGrade,
      unitSummaries: uSummaries,
      unitProgressMap: uProgMap,
      allLevelScores: allLvl,
    };
  }, [units, scores]);

  // Medallas conquistadas
  const earnedBadgeIds = useMemo(() => {
    const list: string[] = [];
    if (doneLevelsCount > 0) list.push('first_correct');
    if (streak >= 3) list.push('streak3');
    if (streak >= 5) list.push('streak5');
    if (streak >= 10) list.push('streak10');
    if (streak >= 10) list.push('speed_demon');
    if (totalXP >= 500) list.push('perfect_level');
    if (totalXP >= 300) list.push('unit_complete');
    if (totalXP >= 100) list.push('daily_login');
    if (totalXP >= 500) list.push('xp_500');
    if (totalXP >= 1000) list.push('xp_1000');
    if (totalXP >= 1000) list.push('topic_master');
    return list;
  }, [doneLevelsCount, streak, totalXP]);

  const rank = useMemo(() => getRank(totalXP), [totalXP]);

  // Generador de Análisis IA (Método Fedor)
  const handleRunAI = () => {
    setLoadingAi(true);

    setTimeout(() => {
      const studentName = student?.name?.trim() || 'El estudiante';
      const avgPct = doneLevelsCount > 0
        ? Math.round(allLevelScores.filter((s) => s.isDone).reduce((a, s) => a + s.pct, 0) / doneLevelsCount)
        : 0;

      setAiAnalysis({
        teacher: `${studentName} ha completado ${doneLevelsCount} niveles con un promedio de desempeño del ${avgPct}%. ${
          avgPct >= 70
            ? 'Demuestra un dominio satisfactorio de los conceptos pedagógicos trabajados.'
            : 'Se recomienda reforzar los temas con menor porcentaje de logro para afianzar el pensamiento numérico.'
        } El Método Fedor recomienda continuar con sesiones breves de práctica diaria de 15 a 20 minutos con material concreto.`,
        family: `¡${studentName} ha estado aprendiendo matemáticas con el Método Fedor! Ha completado ${doneLevelsCount} niveles y acumulado ${totalXP} puntos de experiencia. ${
          avgPct >= 70
            ? '¡Excelente trabajo! Sigan motivándolo/a en casa para mantener su curiosidad matemática activa.'
            : 'Anímenlo/a a practicar con calma cada día usando objetos cotidianos para contar y comparar cantidades.'
        }`,
        positive: [
          `Ha completado ${doneLevelsCount} de ${totalLevelsCount} niveles en la Galaxia Fedor`,
          `Acumuló ${totalXP} XP de experiencia matemática`,
          `Mantiene una racha activa de ${streak} aciertos seguidos`,
          `Conquistó ${earnedBadgeIds.length} medallas de aprendizaje espacial`,
        ],
        improve: [
          'Practicar los temas con logro inferior al 50%',
          'Revisar los ejemplos didácticos antes de responder cada nivel',
          'Utilizar la recta numérica y elementos manipulables para contar',
          'Realizar actividades de cálculo mental guiado durante 10 minutos al día',
          'Solicitar orientación pedagógica al docente en los temas de mayor reto',
        ],
      });
      setLoadingAi(false);
    }, 600);
  };

  // Auto-scroll y ejecución si vino de "Análisis IA Fedor"
  useEffect(() => {
    if (reportAutoRunAI) {
      setReportAutoRunAI(false);
      setTimeout(() => {
        aiSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        handleRunAI();
      }, 350);
    }
  }, [reportAutoRunAI, setReportAutoRunAI]);

  const toggleUnitCollapse = (ui: number) => {
    setCollapsedUnits((prev) => ({ ...prev, [ui]: !prev[ui] }));
  };

  const handleExportCSV = () => {
    const rows: string[][] = [
      ['INFORME DE APRENDIZAJE · MÉTODO FEDOR 1° GRADO'],
      ['Estudiante', student?.name || '—'],
      ['Colegio', student?.school || '—'],
      ['Ciudad', student?.city || '—'],
      ['Docente', student?.teacher || '—'],
      ['Email', student?.email || '—'],
      ['Total XP', String(totalXP)],
      ['Racha', String(streak)],
      ['Logro Global', `${globalPct}%`],
      ['Nota MEN', `${globalGrade.num} - ${globalGrade.lbl}`],
      ['Fecha', new Date().toLocaleDateString('es-CO')],
      [''],
      ['Unidad', 'Tema', 'Nivel', 'Estado', 'Progreso %', 'Puntos', 'Nota'],
    ];

    units.forEach((u, ui) => {
      const list = unitProgressMap[ui] || [];
      list.forEach((item) => {
        rows.push([
          u.name,
          item.topicTitle,
          item.levelLabel,
          item.isDone ? 'Completado' : 'Pendiente',
          `${item.pct}%`,
          String(item.pts),
          item.g ? item.g.lbl : '—',
        ]);
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
    link.href = url;
    link.download = `reporte_fedor_1ro_${student?.name || 'estudiante'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const payload = {
      student,
      stats: {
        totalXP,
        streak,
        globalPct,
        globalGrade,
        doneLevelsCount,
        totalLevelsCount,
        totalEarnedPts,
        totalPossiblePts,
      },
      scores,
      unitSummaries,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `datos_docente_1ro_${student?.name || 'estudiante'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '1.25rem 1.5rem',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Botón Volver al Inicio (Top bar) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <button
          type="button"
          onClick={() => goScreen('home')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #DDD8F5',
            color: '#7B2FBE',
            borderRadius: '24px',
            padding: '8px 22px',
            fontSize: '14px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(123,47,190,0.08)',
            transition: 'all 0.15s ease',
          }}
        >
          ← Inicio
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              background: '#F7F4FF',
              border: '1.5px solid #DDD8F5',
              color: '#7B2FBE',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            📊 Descargar CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: 'linear-gradient(135deg, #16876A, #24C496)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(36,196,150,0.3)',
            }}
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* Cabecera Estudiante Cósmica (Imagen 2) */}
      <div
        style={{
          background: 'linear-gradient(155deg,#0D0630,#1E0848,#051A14)',
          borderRadius: '24px',
          padding: '1.5rem 1.5rem 1.25rem',
          marginBottom: '1rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 36px rgba(123,47,190,.4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            zIndex: 1,
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: '46px',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(245,197,24,.15)',
              border: '3px solid rgba(245,197,24,.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {student?.avatar || '🧑‍🚀'}
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '26px',
                fontWeight: 900,
                color: '#fff',
                marginBottom: '4px',
                lineHeight: 1.2,
              }}
            >
              {student?.name || 'Astronauta de Fedor'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>
                🏫 {student?.school || 'Colegio Fedor'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>
                🌆 {student?.city || 'Colombia'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)' }}>
              👩‍🏫 {student?.teacher || 'Docente asignado'} · 📧 {student?.email || 'estudiante@fedor.edu'}
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,.08)',
              borderRadius: '14px',
              padding: '.75rem .6rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,.12)',
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>
              {totalXP} XP
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', fontWeight: 800, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              XP
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,.08)',
              borderRadius: '14px',
              padding: '.75rem .6rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,.12)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#F5C518', lineHeight: 1.2 }}>
              {rank.label}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', fontWeight: 800, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              RANGO
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,.08)',
              borderRadius: '14px',
              padding: '.75rem .6rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,.12)',
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>
              {streak} 🔥
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', fontWeight: 800, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              RACHA
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,.08)',
              borderRadius: '14px',
              padding: '.75rem .6rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,.12)',
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>
              {earnedBadgeIds.length} 🏅
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', fontWeight: 800, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              MEDALLAS
            </div>
          </div>
        </div>
      </div>

      {/* 📊 DESEMPEÑO GLOBAL (Imagen 2) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 900,
            color: '#4B5563',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            marginBottom: '1rem',
          }}
        >
          📊 DESEMPEÑO GLOBAL
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '1rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg,#F7F4FF,#EDE8FF)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center',
              border: '1.5px solid #DDD8F5',
            }}
          >
            <div style={{ fontSize: '42px', fontWeight: 900, color: '#7B2FBE', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.1 }}>
              {globalPct}%
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#4B5563', marginTop: '4px' }}>
              Logro global
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg,#EDFFF8,#D6F8EC)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center',
              border: '1.5px solid #A7F3D0',
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 900, color: globalGrade.barColor, lineHeight: 1.3 }}>
              {globalGrade.num} · {globalGrade.lbl}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#4B5563', marginTop: '4px' }}>
              Nota · Nivel MEN
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#4B5563',
          }}
        >
          <span>📚 {doneLevelsCount} / {totalLevelsCount} temas</span>
          <span>⭐ {totalEarnedPts} pts</span>
        </div>
      </div>

      {/* 📈 AVANCE POR UNIDAD (Imagen 2) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 900,
            color: '#4B5563',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            marginBottom: '1rem',
          }}
        >
          📈 AVANCE POR UNIDAD
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {unitSummaries.map((u, ui) => (
            <div
              key={ui}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', marginBottom: '6px' }}>
                  {u.icon} {u.name}
                </div>
                <div style={{ height: '10px', background: '#EEE', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '10px',
                      background: u.color,
                      width: `${u.pct}%`,
                      borderRadius: '5px',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 900,
                  color: u.color,
                  minWidth: '45px',
                  textAlign: 'right',
                }}
              >
                {u.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 SEGUIMIENTO 5 UNIDADES · TODOS LOS NIVELES (Imagen 2 e Imagen 3) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1.5px solid #E5E7EB' }}>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            📋 Seguimiento {units.length} Unidades · Todos los niveles
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F7F4FF' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: 900, color: '#7B2FBE' }}>
                  Tema / Nivel
                </th>
                <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: 900, color: '#7B2FBE', textAlign: 'center' }}>
                  Estado
                </th>
                <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: 900, color: '#7B2FBE', textAlign: 'center' }}>
                  Progreso
                </th>
                <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: 900, color: '#7B2FBE', textAlign: 'center' }}>
                  ⭐
                </th>
                <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: 900, color: '#7B2FBE', textAlign: 'center' }}>
                  Nota
                </th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, ui) => {
                const list = unitProgressMap[ui] || [];
                const isCollapsed = collapsedUnits[ui] === true;

                return (
                  <React.Fragment key={ui}>
                    {/* Fila Encabezado Unidad (Púrpura - Imagen 3) */}
                    <tr
                      onClick={() => toggleUnitCollapse(ui)}
                      style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <td
                        colSpan={5}
                        style={{
                          background: 'linear-gradient(135deg, #7B2FBE, #16876A)',
                          color: '#FFFFFF',
                          fontWeight: 900,
                          fontSize: '14px',
                          padding: '11px 14px',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <span>{isCollapsed ? '▶' : '▼'}</span>
                          <span>{unit.icon || '➕'} {unit.name}</span>
                        </span>
                      </td>
                    </tr>

                    {/* Filas de temas y niveles */}
                    {!isCollapsed &&
                      list.map((row, rIdx) => (
                        <tr
                          key={`${ui}-${rIdx}`}
                          style={{
                            borderBottom: '1px solid #F3F4F6',
                            background: rIdx % 2 === 0 ? '#FFFFFF' : '#FAFAFD',
                          }}
                        >
                          <td style={{ padding: '9px 14px', fontSize: '13px', fontWeight: 800, color: '#1F2937' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{row.topicIcon}</span>
                              <span>{row.topicTitle}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#4B5563', fontWeight: 700, marginTop: '2px' }}>
                              {row.levelLabel}
                            </div>
                          </td>

                          <td style={{ padding: '9px 8px', textAlign: 'center', fontSize: '16px' }}>
                            {row.statusIcon}
                          </td>

                          <td style={{ padding: '9px 8px', minWidth: '105px' }}>
                            <div style={{ height: '8px', background: '#EEE', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '8px',
                                  background: row.g ? row.g.barColor : '#DDD',
                                  width: `${row.pct}%`,
                                  borderRadius: '4px',
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: 800,
                                color: row.g ? row.g.barColor : '#4B5563',
                                textAlign: 'center',
                                marginTop: '3px',
                              }}
                            >
                              {row.pct}%
                            </div>
                          </td>

                          <td style={{ padding: '9px 8px', textAlign: 'center', fontSize: '14px' }}>
                            {row.g ? row.g.stars : ''}
                          </td>

                          <td style={{ padding: '9px 8px', textAlign: 'center' }}>
                            {row.g ? (
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: `${row.g.barColor}18`,
                                  color: row.g.barColor,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {row.g.lbl}
                              </span>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🏅 MEDALLAS CONQUISTADAS */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 900,
            color: '#4B5563',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            marginBottom: '1rem',
          }}
        >
          🏅 Medallas conquistadas
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
          {ALL_BADGES.map((b) => {
            const ok = earnedBadgeIds.includes(b.id);
            return (
              <div
                key={b.id}
                title={b.tip}
                style={{
                  textAlign: 'center',
                  opacity: ok ? 1 : 0.25,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: b.bg,
                    border: `2px solid ${b.bc}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    margin: '0 auto 4px',
                  }}
                >
                  {b.emoji}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#4B5563',
                    maxWidth: '65px',
                    lineHeight: 1.25,
                    margin: '0 auto',
                  }}
                >
                  {b.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🤖 ANÁLISIS IA FEDOR (HTML line 2496) */}
      <div
        ref={aiSectionRef}
        id="ai-section"
        style={{
          background: 'linear-gradient(155deg,#0D0630,#1E0848,#051A14)',
          borderRadius: '24px',
          padding: '1.5rem',
          marginBottom: '1rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 28px rgba(123,47,190,.3)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#F5C518,#FF8C2A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(245,197,24,.4)',
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '20px', fontWeight: 900, color: '#fff' }}>
                Análisis IA — Método Fedor
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)' }}>
                Reporte pedagógico inteligente para docente y familia
              </div>
            </div>
          </div>

          {loadingAi && (
            <div style={{ textAlign: 'center', padding: '1.75rem 0' }}>
              <div style={{ fontSize: '42px' }}>🤖</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.85)', fontWeight: 700, marginTop: '.65rem' }}>
                Analizando el desempeño del estudiante...
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginTop: '4px' }}>
                Fedor IA procesando datos pedagógicos
              </div>
            </div>
          )}

          {aiAnalysis && !loadingAi && (
            <div style={{ display: 'grid', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(36,196,150,.12)',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  borderLeft: '4px solid #24C496',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#24C496', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.5rem' }}>
                  👩‍🏫 Para el Docente
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.92)', lineHeight: 1.7 }}>
                  {aiAnalysis.teacher}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(232,101,10,.12)',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  borderLeft: '4px solid #FF8C2A',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#FF8C2A', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.5rem' }}>
                  👨‍👩‍👧 Para la Familia
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.92)', lineHeight: 1.7 }}>
                  {aiAnalysis.family}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(36,196,150,.1)',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  border: '1px solid rgba(36,196,150,.25)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#24C496', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.5rem' }}>
                  ✅ Fortalezas identificadas
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.4rem', fontSize: '14px', color: 'rgba(255,255,255,.92)', lineHeight: 1.7 }}>
                  {aiAnalysis.positive.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(232,101,10,.1)',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  border: '1px solid rgba(232,101,10,.25)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#FF8C2A', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.5rem' }}>
                  🎯 Áreas a fortalecer
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.4rem', fontSize: '14px', color: 'rgba(255,255,255,.92)', lineHeight: 1.7 }}>
                  {aiAnalysis.improve.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!aiAnalysis && !loadingAi && (
            <div style={{ textAlign: 'center', padding: '1rem 0', color: 'rgba(255,255,255,.6)', fontSize: '13px', fontWeight: 700 }}>
              {doneLevelsCount >= 3
                ? '¡Listo para generar el informe pedagógico inteligente!'
                : 'Completa al menos 3 niveles para activar el análisis IA completo.'}
            </div>
          )}

          <button
            type="button"
            onClick={handleRunAI}
            disabled={loadingAi}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 900,
              background: 'linear-gradient(135deg,#F5C518,#FF8C2A)',
              color: '#2A0F60',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              boxShadow: '0 6px 20px rgba(245,197,24,.4)',
            }}
          >
            {aiAnalysis ? '🔄 Actualizar Análisis IA' : '🤖 Generar Análisis IA Fedor'}
          </button>
        </div>
      </div>

      {/* Botones Acción Inferiores (HTML line 2540) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '.85rem' }}>
        <button
          type="button"
          onClick={handleExportCSV}
          style={{
            padding: '14px',
            fontSize: '14px',
            fontWeight: 800,
            background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(123,47,190,0.25)',
          }}
        >
          ⬇️ Descargar progreso
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            padding: '14px',
            fontSize: '14px',
            fontWeight: 800,
            background: 'linear-gradient(135deg,#16876A,#24C496)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(36,196,150,0.25)',
          }}
        >
          🖨️ Imprimir reporte
        </button>
      </div>

      <button
        type="button"
        onClick={handleExportJSON}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '13px',
          fontWeight: 800,
          background: '#FFFFFF',
          color: '#7B2FBE',
          border: '1.5px solid #DDD8F5',
          borderRadius: '14px',
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        📤 Exportar datos JSON (docente)
      </button>
    </div>
  );
}
