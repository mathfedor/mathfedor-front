'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBook } from '../context/BookContext';
import { bookReportService } from '@/services/book-report.service';
import { bookExportService } from '@/services/book-export.service';
import { bookProgressService } from '@/services/book-progress.service';
import ReportCharts, { countGrades } from '../shared/ReportCharts';
import TeacherGuide from '../shared/TeacherGuide';
import type { AIAnalysis } from '@/types/book-progress.types';

const GRADE_COLORS: Record<string, string> = {
  S: '#16876A', A: '#1A6CB4', B: '#BA7517', L: '#C94B22',
};
const GRADE_LABELS: Record<string, string> = {
  S: 'Superior', A: 'Alto', B: 'Básico', L: 'Bajo',
};

/** Centro de informes: resumen agregado + desglose detallado + análisis IA. */
export default function ReportScreen() {
  const { book, progress, goScreen } = useBook();
  const [ai, setAi] = useState<AIAnalysis | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [backendReport, setBackendReport] = useState<any | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const bookSlug = book?.slug;

  // Cargar reporte detallado del backend si está disponible
  useEffect(() => {
    if (!bookSlug) return;
    bookProgressService.getReport(bookSlug).then((report) => {
      if (report) setBackendReport(report);
    }).catch(() => { /* silencioso, usamos fallback local */ });
  }, [bookSlug]);

  const summary = useMemo(() => {
    if (!book || !progress) return null;
    return bookReportService.buildSummary(book, progress);
  }, [book, progress]);

  if (!book || !progress || !summary) return null;

  const runAI = async () => {
    setLoadingAi(true);
    const result = await bookReportService.generateAIAnalysis(book, progress);
    setAi(result);
    setLoadingAi(false);
  };

  const toggleUnit = (unitId: string) =>
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  const toggleTopic = (topicId: string) =>
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));

  return (
    <div className="screen active" id="screen-report">
      {showGuide && <TeacherGuide onClose={() => setShowGuide(false)} />}
      <div className="back-row no-print" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <button className="btn-primary no-print" style={{ width: '100%', marginBottom: '1rem' }} onClick={() => setShowGuide(true)}>
        👩‍🏫 Abrir Guía del Profesor
      </button>

      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        <button className="btn-secondary" style={{ flex: 1, fontSize: 13 }} onClick={() => bookExportService.printReport()}>
          🖨️ Imprimir / PDF
        </button>
        <button className="btn-secondary" style={{ flex: 1, fontSize: 13 }} onClick={() => bookExportService.exportProgressJson(progress)}>
          📤 Exportar JSON
        </button>
      </div>

      {/* Encabezado hero (sin título duplicado) */}
      <div style={{ background: 'linear-gradient(135deg,#140830,#1E0848)', borderRadius: 18, padding: '1.25rem', color: '#fff', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>
          🏫 {progress.student.school || 'Colegio'} · 🧑‍🏫 Docente: {progress.student.teacher || '—'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: '1rem' }}>
          <ReportStat value={`${summary.completedLevels}/${summary.totalLevels}`} label="Niveles" />
          <ReportStat value={`${summary.avgPct}%`} label="Promedio" />
          <ReportStat value={summary.bestUnit ?? '—'} label="Mejor unidad" />
        </div>
      </div>

      {/* ── SECCIÓN 1: AVANCE POR UNIDAD ── */}
      <div style={{ background: '#F5F3FF', borderRadius: 18, padding: '1.25rem', marginBottom: '1.5rem', border: '1.5px solid #E5DEFF' }}>
        <div style={{ fontSize: '13px', fontWeight: 900, color: '#4C1D95', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          📈 AVANCE POR UNIDAD
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {(backendReport?.perUnit || summary.perUnit).map((u: any, idx: number) => {
            const isBackend = Boolean(backendReport?.perUnit);
            const unitName = isBackend ? u.unitName : u.unit;
            const unitIcon = isBackend ? u.unitIcon : '📘';
            const pct = isBackend ? (u.totalLevels > 0 ? Math.round((u.completedLevels / u.totalLevels) * 100) : 0) : u.avgPct;

            return (
              <div key={isBackend ? u.unitId : idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#2D1D60', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '16px' }}>{unitIcon}</span> {unitName}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#7C3AED' }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#7C3AED,#A78BFA)', borderRadius: 4, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECCIÓN 2: SEGUIMIENTO - TODOS LOS NIVELES ── */}
      <div style={{ background: '#FFF', borderRadius: 18, border: '1.5px solid #E5DEFF', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ background: '#F5F3FF', padding: '1rem 1.25rem', borderBottom: '1.5px solid #E5DEFF', fontSize: '13px', fontWeight: 900, color: '#4C1D95', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          📋 SEGUIMIENTO UNIDADES - TODOS LOS NIVELES
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 650 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', width: '50%' }}>Tema / Nivel</th>
                <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', textAlign: 'center', width: '12%' }}>Estado</th>
                <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', width: '20%' }}>Progreso</th>
                <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', textAlign: 'center', width: '8%' }}>⭐</th>
                <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', textAlign: 'center', width: '10%' }}>Nota</th>
              </tr>
            </thead>
            <tbody>
              {backendReport?.perUnit ? (
                backendReport.perUnit.flatMap((unit: any) => {
                  // Fila Cabecera de la Unidad
                  const unitRow = (
                    <tr key={`unit-${unit.unitId}`} style={{ borderBottom: '1.5px solid #E2E8F0' }}>
                      <td colSpan={5} style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: '#FFF', fontWeight: 900, padding: '10px 14px', fontSize: '13px' }}>
                        <span style={{ marginRight: 8 }}>{unit.unitIcon}</span> {unit.unitName}
                      </td>
                    </tr>
                  );

                  // Filas de Niveles de la Unidad
                  const levelRows = (unit.perTopic || []).flatMap((topic: any) =>
                    (topic.levels || []).map((lv: any, lvIdx: number) => {
                      const done = lv.pct !== null;
                      const starsEmoji = done && lv.pct >= 50 ? (lv.pct >= 95 ? '⭐⭐⭐' : lv.pct >= 80 ? '⭐⭐' : '⭐') : '';
                      return (
                        <tr key={`level-${lv.levelKey}`} style={{ borderBottom: '1px solid #F1F5F9', background: lvIdx % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
                          {/* Columna 1: Tema y Nivel */}
                          <td style={{ padding: '10px 14px', width: '50%', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: '16px' }}>{topic.topicIcon}</span>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>{topic.topicTitle}</div>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: done ? '#059669' : '#64748B', textTransform: 'capitalize' }}>
                                  {lv.levelLabel.toLowerCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Columna 2: Estado Checkbox */}
                          <td style={{ padding: '10px 14px', width: '12%', textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: 5,
                              background: done ? '#D1FAE5' : '#EEF2F6',
                              border: `1.5px solid ${done ? '#10B981' : '#CBD5E1'}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              color: '#10B981',
                              fontWeight: 900
                            }}>
                              {done ? '✓' : ''}
                            </div>
                          </td>
                          
                          {/* Columna 3: Barra de Progreso y Porcentaje */}
                          <td style={{ padding: '10px 14px', width: '20%', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${done ? 100 : 0}%`, background: done ? '#10B981' : '#94A3B8', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 900, color: done ? '#10B981' : '#64748B', minWidth: 28, textAlign: 'right' }}>
                                {done ? 100 : 0}%
                              </span>
                            </div>
                          </td>
                          
                          {/* Columna 4: Estrella */}
                          <td style={{ padding: '10px 14px', width: '8%', textAlign: 'center', verticalAlign: 'middle', fontSize: '12px' }}>
                            {starsEmoji || '—'}
                          </td>
                          
                          {/* Columna 5: Nota */}
                          <td style={{ padding: '10px 14px', width: '10%', textAlign: 'center', verticalAlign: 'middle' }}>
                            {done ? (
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 900,
                                background: GRADE_COLORS[lv.grade ?? 'B'] || '#BA7517',
                                color: '#FFF',
                                borderRadius: 6,
                                padding: '2px 6px',
                                textTransform: 'uppercase',
                                display: 'inline-block'
                              }}>
                                {GRADE_LABELS[lv.grade ?? 'B'] || lv.grade}
                              </span>
                            ) : (
                              <span style={{ color: '#94A3B8' }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  );

                  return [unitRow, ...levelRows];
                })
              ) : (
                /* Fallback local */
                summary.perUnit.flatMap((u, uIdx) => {
                  const unitRow = (
                    <tr key={`unit-fallback-${uIdx}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td colSpan={5} style={{ background: '#7C3AED', color: '#FFF', fontWeight: 900, padding: '10px 14px', fontSize: '13px' }}>
                        📘 {u.unit}
                      </td>
                    </tr>
                  );
                  const infoRow = (
                    <tr key={`info-fallback-${uIdx}`} style={{ background: '#FFF', borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: '#64748B' }} colSpan={5}>
                        Completa ejercicios para ver el desglose detallado de niveles de esta unidad.
                      </td>
                    </tr>
                  );
                  return [unitRow, infoRow];
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReportCharts summary={summary} gradeCounts={countGrades(Object.values(progress.scores).map((s) => s.grade))} />

      <div className="no-print" style={{ marginTop: '1.25rem' }}>
        <button id="ai-report-btn" className="btn-primary" style={{ width: '100%' }} onClick={runAI} disabled={loadingAi}>
          {loadingAi ? 'Analizando…' : '🤖 Generar Análisis IA Fedor'}
        </button>
      </div>

      {ai && (
        <div style={{ marginTop: '1rem', display: 'grid', gap: 10 }}>
          <AIBlock title="👩‍🏫 Para el Docente" text={ai.teacher} color="#24C496" />
          <AIBlock title="👨‍👩‍👧 Para la Familia" text={ai.family} color="#FF8C2A" />
          <AIBlock title="✅ Fortalezas" text={ai.positive} color="#16876A" />
          <AIBlock title="🎯 Áreas a fortalecer" text={ai.improve} color="#C94B22" />
        </div>
      )}
    </div>
  );
}

function ReportStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '.6rem', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#F5C518', fontFamily: "'Baloo 2',sans-serif" }}>{value}</div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,.5)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function AIBlock({ title, text, color }: { title: string; text: string; color: string }) {
  return (
    <div style={{ background: 'var(--white)', borderRadius: 14, padding: '.85rem 1rem', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 10, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}
