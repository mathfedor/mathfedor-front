'use client';

import { useMemo, useState } from 'react';
import { useBook } from '../context/BookContext';
import { bookReportService } from '@/services/book-report.service';
import { bookExportService } from '@/services/book-export.service';
import ReportCharts, { countGrades } from '../shared/ReportCharts';
import TeacherGuide from '../shared/TeacherGuide';
import type { AIAnalysis } from '@/types/book-progress.types';

/** Centro de informes: resumen agregado + análisis IA (mock). */
export default function ReportScreen() {
  const { book, progress, goScreen } = useBook();
  const [ai, setAi] = useState<AIAnalysis | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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

      <div style={{ background: 'linear-gradient(135deg,#140830,#1E0848)', borderRadius: 18, padding: '1.25rem', color: '#fff', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 20, fontWeight: 900 }}>📊 Informe de {progress.student.name || 'Estudiante'}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
          {progress.student.school || 'Colegio'} · Docente: {progress.student.teacher || '—'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: '1rem' }}>
          <ReportStat value={`${summary.completedLevels}/${summary.totalLevels}`} label="Niveles" />
          <ReportStat value={`${summary.avgPct}%`} label="Promedio" />
          <ReportStat value={summary.bestUnit ?? '—'} label="Mejor unidad" />
        </div>
      </div>

      <div className="sec-title">Desempeño por unidad</div>
      {summary.perUnit.map((u) => (
        <div key={u.unit} style={{ background: 'var(--white)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 8, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13 }}>
            <span>{u.unit}</span>
            <span>{u.completed}/{u.total} · {u.avgPct}%</span>
          </div>
          <div className="pg-bar" style={{ marginTop: 6 }}>
            <div className="pg-fill" style={{ width: `${u.total ? Math.round((u.completed / u.total) * 100) : 0}%` }} />
          </div>
        </div>
      ))}

      <ReportCharts summary={summary} gradeCounts={countGrades(Object.values(progress.scores).map((s) => s.grade))} />

      <div className="no-print" style={{ marginTop: '1.25rem' }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={runAI} disabled={loadingAi}>
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
