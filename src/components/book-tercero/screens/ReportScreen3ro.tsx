'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook3 } from '../context/Book3Context';
import bookCurriculum3 from '@/mocks/data/book-curriculum-3.data.json';

interface AIAnalysisState {
  teacher: string;
  family: string;
  positive: string[];
  improve: string[];
}

const RANKS_3RO = [
  { min: 0, label: '🌱 Explorador', color: '#16876A' },
  { min: 100, label: '⭐ Aprendiz', color: '#BA7517' },
  { min: 300, label: '🔥 Aventurero', color: '#E8650A' },
  { min: 600, label: '💎 Experto', color: '#1A6CB4' },
  { min: 1000, label: '🌌 Maestro', color: '#7B2FBE' },
  { min: 2000, label: '☄️ Leyenda', color: '#C94B22' },
];

function getRank3ro(xp: number) {
  return [...RANKS_3RO].reverse().find((r) => xp >= r.min) || RANKS_3RO[0];
}

const ALL_BADGES_3RO = (bookCurriculum3 as any).ALL_BADGES || [
  { id: 'first_correct', emoji: '🌟', name: 'Primera estrella', tip: '¡Primera respuesta correcta!', bg: '#EEEDFE', bc: '#C5BFEE' },
  { id: 'streak3', emoji: '🔥', name: 'Racha × 3', tip: '3 correctas seguidas', bg: '#FEF3E8', bc: '#FBBF7A' },
  { id: 'streak5', emoji: '💥', name: 'Racha × 5', tip: '5 correctas seguidas', bg: '#FAECE7', bc: '#F5B09A' },
  { id: 'streak10', emoji: '☄️', name: 'Meteoro', tip: '10 correctas seguidas', bg: '#1A0A3C', bc: '#7B2FBE' },
  { id: 'speed_demon', emoji: '⚡', name: 'Velocidad', tip: 'Respondiste en menos de 5 seg', bg: '#FEF8E0', bc: '#F5C518' },
  { id: 'perfect_level', emoji: '💎', name: 'Perfección', tip: '100% en un nivel completo', bg: '#E0F0FF', bc: '#8EBBF0' },
  { id: 'topic_master', emoji: '🏆', name: 'Maestro del tema', tip: 'Completaste un tema al 100%', bg: '#E0FFF5', bc: '#95DAC4' },
  { id: 'unit_complete', emoji: '🌌', name: 'Conquistador', tip: '¡Unidad completada!', bg: '#1A0A3C', bc: '#A864E8' },
  { id: 'daily_login', emoji: '📅', name: 'Constante', tip: 'Entraste 3 días seguidos', bg: '#FEF3E8', bc: '#FBBF7A' },
  { id: 'xp_500', emoji: '🎯', name: 'Puntero', tip: '¡Alcanzaste 500 XP!', bg: '#EEEDFE', bc: '#C5BFEE' },
  { id: 'xp_1000', emoji: '🚀', name: 'Astronauta', tip: '¡Alcanzaste 1000 XP!', bg: '#1A0A3C', bc: '#A864E8' },
];

function gradeScore(pct: number) {
  const stars = pct >= 95 ? '⭐⭐⭐⭐⭐' : pct >= 80 ? '⭐⭐⭐⭐' : pct >= 65 ? '⭐⭐⭐' : pct >= 50 ? '⭐⭐' : '⭐';
  const adaptive =
    pct >= 95 ? '¡Dominio total! Eres un maestro 🚀' :
    pct >= 80 ? '¡Excelente! Sigue avanzando 🌟' :
    pct >= 65 ? '¡Muy bien! Un poco más de práctica 💪' :
    pct >= 50 ? 'Buen intento. Repasa los ejemplos 📚' :
    'Necesitas repasar. ¡Tú puedes! 🔄';

  if (pct >= 90) {
    return { letter: 'S', num: '5.0', lbl: '🏆 Superior', stars, adaptive, cls: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Dominio completo · MEN: Desempeño Superior', barColor: '#06A570', pct: Math.round(pct) };
  }
  if (pct >= 70) {
    return { letter: 'A', num: '4.0', lbl: '✅ Alto', stars, adaptive, cls: 'bg-blue-100 text-blue-800 border-blue-300',
      desc: 'Muy buen desempeño · MEN: Desempeño Alto', barColor: '#1A6CB4', pct: Math.round(pct) };
  }
  if (pct >= 50) {
    return { letter: 'B', num: '3.0', lbl: '📘 Básico', stars, adaptive, cls: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'Desempeño mínimo logrado · MEN: Básico', barColor: '#BA7517', pct: Math.round(pct) };
  }
  return { letter: 'L', num: '2.0', lbl: '⚠️ Bajo', stars, adaptive, cls: 'bg-red-100 text-red-800 border-red-300',
    desc: 'Necesita refuerzo · MEN: Bajo', barColor: '#C94B22', pct: Math.round(pct) };
}

const LEVEL_LABELS = ['🟢 Básico', '🟡 Medio', '🔴 Avanzado', '🟣 Nivel 4', '🏆 Nivel 5 · Evaluación'];

function getStatusBadge(pct: number) {
  if (pct >= 90) return { icon: '🏆', text: 'Dominado', color: '#06A570', bg: '#DCF5EE' };
  if (pct >= 70) return { icon: '✅', text: 'Aprobado', color: '#1A6CB4', bg: '#E8F0FF' };
  if (pct >= 50) return { icon: '📘', text: 'Básico', color: '#BA7517', bg: '#FEF3E8' };
  if (pct > 0) return { icon: '🔄', text: 'En progreso', color: '#E8650A', bg: '#FFF8E0' };
  return { icon: '⬜', text: 'Pendiente', color: '#6B7280', bg: '#F3F4F6' };
}

export default function ReportScreen3ro() {
  const {
    book,
    student,
    streak,
    totalXP,
    scores,
    goScreen,
    startLevel,
    reportAutoRunAI,
    setReportAutoRunAI,
  } = useBook3();

  const [collapsedUnits, setCollapsedUnits] = useState<Record<number, boolean>>({});
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisState | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const aiSectionRef = useRef<HTMLDivElement>(null);

  // Garantizar acceso completo a las 13 unidades con sus 195 niveles
  const units = useMemo(() => {
    if (book?.units && Array.isArray(book.units) && book.units.length > 0) {
      return book.units;
    }
    return ((bookCurriculum3 as any).UNITS || []) as any[];
  }, [book]);

  // Cálculo detallado de avances y métricas para las 13 unidades y 195 bloques
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
      unitIndex: number;
      topicIndex: number;
      levelIndex: number;
      topicTitle: string;
      topicIcon: string;
      levelLabel: string;
      pct: number;
      pts: number;
      max: number;
      isDone: boolean;
      status: ReturnType<typeof getStatusBadge>;
      g: ReturnType<typeof gradeScore>;
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
          const k3 = `${ti}-${li}`;
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

          const g = gradeScore(pct);
          const status = getStatusBadge(pct);
          const levelLabel = LEVEL_LABELS[li] || `Nivel ${li + 1}`;

          lvlList.push({
            unitIndex: ui,
            topicIndex: ti,
            levelIndex: li,
            topicTitle: t.title || t.name || t.id || `Tema ${ti + 1}`,
            topicIcon: t.icon || '•',
            levelLabel,
            pct,
            pts,
            max,
            isDone,
            status,
            g,
          });

          allLvl.push({ pct, pts, isDone });
        });
      });

      const uPct = uTotal > 0 ? Math.round((uDone / uTotal) * 100) : 0;
      const col = uPct >= 70 ? '#06A570' : uPct >= 50 ? '#F5C518' : '#7B2FBE';

      uSummaries.push({
        name: u.name,
        icon: u.icon || '📘',
        done: uDone,
        total: uTotal,
        pct: uPct,
        color: col,
      });

      uProgMap[ui] = lvlList;
    });

    const gPct = tt > 0 ? Math.round((td / tt) * 100) : 0;
    const gGrade = gradeScore(gPct);

    return {
      totalLevelsCount: tt || 195,
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

  const rank = useMemo(() => getRank3ro(totalXP), [totalXP]);

  // Generador de Análisis IA (Método Fedor Grado 3°)
  const handleRunAI = () => {
    setLoadingAi(true);

    setTimeout(() => {
      const studentName = student?.name?.trim() || 'El estudiante';
      const avgPct = doneLevelsCount > 0
        ? Math.round(allLevelScores.filter((s) => s.isDone).reduce((a, s) => a + s.pct, 0) / doneLevelsCount)
        : 0;

      // Unidades con mayor y menor avance
      const sortedUnits = [...unitSummaries].sort((a, b) => b.pct - a.pct);
      const topUnits = sortedUnits.filter((u) => u.pct > 0).slice(0, 2);
      const weakUnits = sortedUnits.filter((u) => u.pct < 100).slice(-2);

      const positive = [
        `${studentName} ha superado ${doneLevelsCount} de ${totalLevelsCount} bloques matemáticos del grado 3°.`,
        topUnits.length > 0
          ? `Destacado desempeño en ${topUnits.map((u) => u.name.split('—')[0].trim()).join(' y ')}.`
          : 'Demuestra curiosidad y motivación para explorar los desafíos espaciales de Fedor.',
        streak > 0 ? `Mantiene una racha activa de ${streak} día(s) de práctica continua.` : 'Cuenta con hábitos de aprendizaje positivo.',
      ];

      const improve = [
        weakUnits.length > 0
          ? `Priorizar las actividades de ${weakUnits.map((u) => u.name.split('—')[0].trim()).join(' y ')} para consolidar el pensamiento numérico y variacional.`
          : 'Continuar resolviendo problemas de aplicación tipo prueba SABER.',
        'Repasar los ejemplos didácticos paso a paso antes de iniciar cada sesión de ejercicios interactivos.',
        'Fomentar la justificación verbal de los procedimientos de cálculo mental y operaciones fundamentales.',
      ];

      setAiAnalysis({
        teacher: `${studentName} registra un avance global del ${globalPct}% en el currículo de 3° grado (${doneLevelsCount} de ${totalLevelsCount} bloques dominados). ${
          globalPct >= 70
            ? 'Presenta una sólida apropiación conceptual en operaciones aritméticas, resolución de problemas y razonamiento lógico-matemático acorde a los Estándares Básicos de Competencias del MEN.'
            : globalPct >= 40
            ? 'Muestra un ritmo de progreso constante con competencias en desarrollo. Se aconseja acompañamiento en operaciones de división, fracciones y problemas multiplicativos.'
            : 'Se encuentra en la fase inicial de la travesía cósmica. Es recomendable incentivar sesiones cortas y regulares de práctica asistida.'
        }`,
        family: `¡Felicitaciones a ${studentName} por su esfuerzo en Matemáticas de Fedor 3°! Ha acumulado ${totalXP} puntos de experiencia y alcanzado el rango "${rank.label}". En casa pueden motivarle relacionando las matemáticas con situaciones cotidianas como compras, medidas de cocina y repartos familiares en partes iguales.`,
        positive,
        improve,
      });

      setLoadingAi(false);
      if (aiSectionRef.current) {
        aiSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  // Autorun si se invocó desde el botón "🤖 Análisis IA Fedor" de la Home
  useEffect(() => {
    if (reportAutoRunAI) {
      setReportAutoRunAI(false);
      handleRunAI();
    }
  }, [reportAutoRunAI]);

  const toggleUnit = (uIdx: number) => {
    setCollapsedUnits((prev) => ({ ...prev, [uIdx]: !prev[uIdx] }));
  };

  return (
    <div
      className="report-screen-3ro"
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '1.25rem 1rem 3rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'left',
      }}
    >
      {/* ══ BARRA SUPERIOR DE NAVEGACIÓN ══ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
        <button
          type="button"
          onClick={() => goScreen('home')}
          style={{
            cursor: 'pointer',
            fontWeight: 900,
            color: '#16876A',
            fontSize: '14px',
            background: 'rgba(22, 135, 106, 0.1)',
            border: '1.5px solid rgba(22, 135, 106, 0.3)',
            borderRadius: '12px',
            padding: '7px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
        >
          ← Volver a Inicio
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '7px 16px',
              borderRadius: '12px',
              background: '#FFFFFF',
              border: '1.5px solid #D5C9FF',
              color: '#3D1468',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            🖨️ Imprimir / PDF
          </button>

          <button
            type="button"
            onClick={handleRunAI}
            style={{
              padding: '7px 18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
              border: 'none',
              color: '#2A0F60',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(245, 197, 24, 0.35)',
            }}
          >
            🤖 Análisis IA Fedor
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. CABECERA DEL ESTUDIANTE (TARJETA CÓSMICA)
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: 'linear-gradient(155deg, #0D0630 0%, #1E0848 55%, #051A14 100%)',
          borderRadius: '22px',
          padding: '1.4rem 1.5rem',
          marginBottom: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 38px rgba(30, 8, 72, 0.45)',
          border: '1.5px solid rgba(255, 214, 107, 0.25)',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '1.2rem', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: '44px',
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(245, 197, 24, 0.15)',
              border: '3px solid rgba(245, 197, 24, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(245, 197, 24, 0.3)',
            }}
          >
            {student?.avatar || '🧑‍🚀'}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <h1
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '24px',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '0 0 4px',
                lineHeight: 1.2,
              }}
            >
              {student?.name || 'Astronauta de 3°'}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700 }}>
              <span>🏫 {student?.school || 'Colegio'}</span>
              <span>•</span>
              <span>🌆 {student?.city || 'Colombia'}</span>
              <span>•</span>
              <span>👩‍🏫 {student?.teacher || 'Docente'}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
              📧 {student?.email || 'estudiante@metodofedor.com'} · Grado 3° Primaria
            </div>
          </div>
        </div>

        {/* 4 Métricas de la cabecera */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '8px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>
              {totalXP} XP
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 800, textTransform: 'uppercase', marginTop: 2 }}>
              Experiencia Total
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '15px', fontWeight: 900, color: rank.color, lineHeight: 1.3, fontFamily: "'Baloo 2', sans-serif" }}>
              {rank.label}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 800, textTransform: 'uppercase', marginTop: 2 }}>
              Rango Espacial
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>
              {streak} 🔥
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 800, textTransform: 'uppercase', marginTop: 2 }}>
              Racha Activa
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#F5C518', fontFamily: "'Baloo 2', sans-serif" }}>
              {earnedBadgeIds.length} 🏅
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 800, textTransform: 'uppercase', marginTop: 2 }}>
              Medallas
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. DESEMPEÑO GLOBAL
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 900, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
          📊 Desempeño Global · Currículo de 3° Grado
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #F7F4FF, #EDE8FF)', borderRadius: '16px', padding: '1.1rem', textAlign: 'center', border: '1.5px solid #DDD5FA' }}>
            <div style={{ fontSize: '38px', fontWeight: 900, color: '#7B2FBE', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.1 }}>
              {globalPct}%
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#4B5563', marginTop: 4 }}>
              Logro Global del Libro
            </div>
            <div style={{ fontSize: '10.5px', color: '#6B7280', fontWeight: 700, marginTop: 2 }}>
              {doneLevelsCount} de {totalLevelsCount} bloques superados
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #EDFFF8, #D6F8EC)', borderRadius: '16px', padding: '1.1rem', textAlign: 'center', border: '1.5px solid #95DAC4' }}>
            <div style={{ fontSize: '20px', fontWeight: 900, color: globalGrade.barColor, lineHeight: 1.3, fontFamily: "'Baloo 2', sans-serif" }}>
              {globalGrade.lbl} ({globalGrade.num})
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#074F3A', marginTop: 4 }}>
              Nota Promedio · Escala MEN
            </div>
            <div style={{ fontSize: '10.5px', color: '#0A5A2C', fontWeight: 700, marginTop: 2 }}>
              {globalGrade.desc}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '12px', fontWeight: 800, color: '#6B7280', paddingTop: '0.6rem', borderTop: '1px solid #F3F4F6' }}>
          <span>📚 <strong>13 Unidades</strong> de Matemáticas</span>
          <span>🎯 <strong>{totalLevelsCount} Bloques</strong> de Aprendizaje</span>
          <span>⭐ <strong>{totalEarnedPts} Puntos</strong> acumulados</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. AVANCE POR UNIDAD (13 BARRAS DE PROGRESO)
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 900, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          📈 Avance por Unidad · 13 Unidades
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {unitSummaries.map((u, ui) => (
            <div key={ui} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>
                  <span>{u.icon} {u.name}</span>
                  <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700 }}>
                    {u.done} / {u.total} niveles
                  </span>
                </div>
                <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: u.color,
                      width: `${u.pct}%`,
                      borderRadius: '4px',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: u.color, minWidth: '42px', textAlign: 'right', fontFamily: "'Baloo 2', sans-serif" }}>
                {u.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. TABLA DETALLADA: SEGUIMIENTO 13 UNIDADES Y TODOS LOS NIVELES
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1.5px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📋 Seguimiento Detallado: 13 Unidades · 195 Niveles
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700 }}>
              Haz clic en cualquier unidad para desplegar o en un nivel para practicarlo directamente
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setCollapsedUnits({})}
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#7B2FBE',
                background: '#F3E8FF',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              Expandir todo
            </button>
            <button
              type="button"
              onClick={() => {
                const all: Record<number, boolean> = {};
                units.forEach((_, i) => { all[i] = true; });
                setCollapsedUnits(all);
              }}
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#4B5563',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              Colapsar todo
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 900, color: '#334155' }}>
                  Tema / Nivel
                </th>
                <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: 900, color: '#334155', textAlign: 'center' }}>
                  Estado
                </th>
                <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: 900, color: '#334155', minWidth: '120px' }}>
                  Progreso
                </th>
                <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: 900, color: '#334155', textAlign: 'center' }}>
                  Estrellas
                </th>
                <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 900, color: '#334155', textAlign: 'center' }}>
                  Nota MEN
                </th>
              </tr>
            </thead>
            <tbody>
              {units.map((u, ui) => {
                const isCollapsed = !!collapsedUnits[ui];
                const levels = unitProgressMap[ui] || [];
                const uDone = levels.filter((l) => l.isDone).length;
                const uTotal = levels.length;
                const uPct = uTotal > 0 ? Math.round((uDone / uTotal) * 100) : 0;

                return (
                  <React.Fragment key={ui}>
                    {/* Fila Encabezado de la Unidad */}
                    <tr
                      onClick={() => toggleUnit(ui)}
                      style={{
                        background: 'linear-gradient(135deg, #7B2FBE, #16876A)',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <td colSpan={5} style={{ padding: '10px 14px', fontWeight: 900, fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{isCollapsed ? '▶' : '▼'}</span>
                            <span>{u.icon}</span>
                            <span>{u.name}</span>
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '12px' }}>
                            {uDone} / {uTotal} niveles ({uPct}%)
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Filas de cada nivel dentro de la unidad */}
                    {!isCollapsed &&
                      levels.map((lvl, li) => (
                        <tr
                          key={li}
                          onClick={() => startLevel(lvl.unitIndex, lvl.topicIndex, lvl.levelIndex)}
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
                        >
                          {/* Columna Tema y Nivel */}
                          <td style={{ padding: '8px 14px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>
                              {lvl.topicIcon} {lvl.topicTitle}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
                              {lvl.levelLabel}
                            </div>
                          </td>

                          {/* Columna Estado */}
                          <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '8px',
                                background: lvl.status.bg,
                                color: lvl.status.color,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span>{lvl.status.icon}</span>
                              <span>{lvl.status.text}</span>
                            </span>
                          </td>

                          {/* Columna Progreso */}
                          <td style={{ padding: '8px 8px' }}>
                            <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  background: lvl.pct >= 70 ? '#10B981' : lvl.pct >= 50 ? '#F59E0B' : '#8B5CF6',
                                  width: `${lvl.pct}%`,
                                  borderRadius: '3px',
                                }}
                              />
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', marginTop: '2px', textAlign: 'center' }}>
                              {lvl.pct}% {lvl.pts > 0 ? `(${lvl.pts} pts)` : ''}
                            </div>
                          </td>

                          {/* Columna Estrellas */}
                          <td style={{ padding: '8px 8px', textAlign: 'center', fontSize: '12px' }}>
                            {lvl.pct > 0 ? (lvl.g ? lvl.g.stars.slice(0, 3) : '⭐') : '—'}
                          </td>

                          {/* Columna Nota MEN */}
                          <td style={{ padding: '8px 14px', textAlign: 'center' }}>
                            {lvl.pct > 0 ? (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 900,
                                  color: lvl.g.barColor,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {lvl.g.lbl}
                              </span>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#94A3B8' }}>—</span>
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

      {/* ══════════════════════════════════════════════════════════
          5. SECCIÓN DE ANÁLISIS INTELIGENTE CON IA
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={aiSectionRef}
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #F5C518',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 8px 24px rgba(245, 197, 24, 0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontSize: '17px', fontWeight: 900, color: '#1E1B4B' }}>
                Análisis Pedagógico con Inteligencia Artificial Fedor
              </h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#6B7280', fontWeight: 700 }}>
                Diagnóstico formativo adaptativo para docentes y acudientes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunAI}
            disabled={loadingAi}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
              border: 'none',
              color: '#2A0F60',
              fontWeight: 900,
              fontSize: '12.5px',
              cursor: loadingAi ? 'wait' : 'pointer',
              opacity: loadingAi ? 0.7 : 1,
            }}
          >
            {loadingAi ? 'Generando diagnóstico...' : aiAnalysis ? 'Actualizar análisis' : 'Generar diagnóstico IA'}
          </button>
        </div>

        {aiAnalysis ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {/* Informe para el docente */}
            <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '1rem 1.2rem', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#1E293B', marginBottom: '4px' }}>
                👩‍🏫 Informe Técnico para el Docente:
              </div>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                {aiAnalysis.teacher}
              </p>
            </div>

            {/* Mensaje para la familia */}
            <div style={{ background: '#FFFBEB', borderRadius: '14px', padding: '1rem 1.2rem', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#92400E', marginBottom: '4px' }}>
                👨‍👩‍👧 Orientación para la Familia:
              </div>
              <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5, margin: 0 }}>
                {aiAnalysis.family}
              </p>
            </div>

            {/* Fortalezas y Oportunidades de mejora */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#ECFDF5', borderRadius: '14px', padding: '1rem', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#065F46', marginBottom: '6px' }}>
                  ⭐ Fortalezas Identificadas:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '12px', color: '#047857', lineHeight: 1.5 }}>
                  {aiAnalysis.positive.map((p, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{p}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '1rem', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#1E40AF', marginBottom: '6px' }}>
                  🎯 Rutas de Refuerzo Recomendadas:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '12px', color: '#1D4ED8', lineHeight: 1.5 }}>
                  {aiAnalysis.improve.map((p, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#6B7280', fontSize: '13px' }}>
            <p style={{ margin: '0 0 10px' }}>
              El motor de IA evaluará el desempeño del estudiante en los 195 bloques para emitir recomendaciones pedagógicas personalizadas.
            </p>
            <button
              type="button"
              onClick={handleRunAI}
              style={{
                padding: '8px 20px',
                borderRadius: '12px',
                background: '#1E1B4B',
                color: '#FFD66B',
                border: 'none',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Iniciar Análisis Pedagógico
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          6. MEDALLAS CONQUISTADAS
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 900, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          🏅 Medallas del Libro 3° ({earnedBadgeIds.length} de {ALL_BADGES_3RO.length} desbloqueadas)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
          {ALL_BADGES_3RO.map((b: any) => {
            const isUnlocked = earnedBadgeIds.includes(b.id);
            return (
              <div
                key={b.id}
                style={{
                  background: isUnlocked ? (b.bg || '#F9FAFB') : '#F3F4F6',
                  border: `1.5px solid ${isUnlocked ? (b.bc || '#E5E7EB') : '#E5E7EB'}`,
                  borderRadius: '14px',
                  padding: '0.85rem 0.6rem',
                  textAlign: 'center',
                  opacity: isUnlocked ? 1 : 0.45,
                  filter: isUnlocked ? 'none' : 'grayscale(0.8)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: 4 }}>{b.emoji}</div>
                <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#111827', lineHeight: 1.2 }}>
                  {b.name}
                </div>
                <div style={{ fontSize: '9.5px', color: '#6B7280', fontWeight: 700, marginTop: 2 }}>
                  {b.tip}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
