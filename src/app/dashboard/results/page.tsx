'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FiArrowLeft, FiBarChart2, FiDownload, FiUsers } from 'react-icons/fi';
import { authService } from '@/services/auth.service';
import { learningResultsService, LearningResult } from '@/services/learning-results.service';
import { User } from '@/types/auth.types';

const getEntityId = (value: LearningResult) => value._id || value.id || '';

const normalizeGroup = (group?: string) => group || 'Sin grado';

const getTotals = (result: LearningResult) => {
  const maxPoints = result.subjects.reduce((sum, subject) => sum + Number(subject.maxPoints || 0), 0);
  const points = result.subjects.reduce((sum, subject) => sum + Number(subject.points || 0), 0);
  const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

  return { points, maxPoints, percentage };
};

const getRatingMessage = (result: LearningResult) => {
  const totalAnswers = result.goodAnswers + result.wrongAnswers;
  const hitRate = totalAnswers > 0 ? (result.goodAnswers / totalAnswers) * 100 : 0;

  return result.rating || (hitRate >= 70 ? 'Todo está muy bien' : 'Necesita mejorar');
};

const escapeExcelCell = (value: string | number) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const downloadRowsAsExcel = (fileName: string, rows: Array<Array<string | number>>) => {
  const htmlRows = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeExcelCell(cell)}</td>`).join('')}</tr>`)
    .join('');

  const blob = new Blob(
    [`<html><head><meta charset="utf-8" /></head><body><table>${htmlRows}</table></body></html>`],
    { type: 'application/vnd.ms-excel;charset=utf-8;' }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadStudentExcel = (result: LearningResult) => {
  if (result.bookReport) {
    const rows = [
      ['Estudiante', result.student.name],
      ['Email', result.student.email || ''],
      ['Libro', result.module?.title || result.group],
      ['Niveles Completados', `${result.bookReport.completedLevels} de ${result.bookReport.totalLevels}`],
      ['Promedio Global', `${result.bookReport.avgPct || 0}%`],
      ['Mejor Unidad', result.bookReport.bestUnit || '—'],
      ['Reforzar Unidad', result.bookReport.weakestUnit || '—'],
      [],
      ['Unidad', 'Tema', 'Nivel', 'Estado', 'Progreso', 'Estrellas', 'Nota', 'Intentos']
    ];

    result.bookReport.perUnit.forEach((unit: any) => {
      unit.perTopic.forEach((topic: any) => {
        topic.levels.forEach((lv: any) => {
          const done = lv.pct !== null;
          const stars = done && lv.pct >= 50 ? (lv.pct >= 95 ? 3 : lv.pct >= 80 ? 2 : 1) : 0;
          const starsStr = '⭐'.repeat(stars) || '—';
          
          let gradeLabel = '—';
          if (done) {
            if (lv.grade === 'S') gradeLabel = 'Superior';
            else if (lv.grade === 'A') gradeLabel = 'Alto';
            else if (lv.grade === 'B') gradeLabel = 'Básico';
            else if (lv.grade === 'L') gradeLabel = 'Bajo';
          }

          rows.push([
            unit.unitName,
            topic.topicTitle,
            lv.levelLabel,
            done ? 'Completado' : 'Pendiente',
            done ? '100%' : '0%',
            starsStr,
            gradeLabel,
            String(lv.attempts || 0)
          ]);
        });
      });
    });

    downloadRowsAsExcel(`reporte-libro-${result.student.name.replace(/\s+/g, '-').toLowerCase()}.xls`, rows);
    return;
  }

  const totals = getTotals(result);
  const rows = [
    ['Estudiante', result.student.name],
    ['Email', result.student.email || ''],
    ['Grado del módulo', normalizeGroup(result.module?.group || result.group)],
    ['Módulo', result.module?.title || result.moduleId],
    ['Puntos', totals.points.toFixed(2)],
    ['Máximo', totals.maxPoints.toFixed(2)],
    ['Porcentaje', `${totals.percentage.toFixed(2)}%`],
    ['Preguntas buenas', String(result.goodAnswers)],
    ['Preguntas malas', String(result.wrongAnswers)],
    ['Rating', getRatingMessage(result)],
    [],
    ['Tema', 'Puntos', 'Máximo', 'Porcentaje', 'Nota por tópico'],
    ...result.subjects.map((subject) => [
      subject.title,
      Number(subject.points || 0).toFixed(2),
      Number(subject.maxPoints || 0).toFixed(2),
      `${Number(subject.percentage || 0).toFixed(2)}%`,
      Number(subject.percentage || 0) >= 70 ? 'Fortaleza' : 'Reforzar'
    ])
  ];

  downloadRowsAsExcel(`informe-${result.student.name.replace(/\s+/g, '-').toLowerCase()}.xls`, rows);
};

const getClassroomName = (result: LearningResult) => result.classroomId || result.student.classroomId || 'Sin salón';

const buildClassroomSummary = (results: LearningResult[]) => {
  const totalStudents = new Set(results.map((result) => result.student.userId || result.student.email || result.student.name)).size;
  const totalGoodAnswers = results.reduce((sum, result) => sum + result.goodAnswers, 0);
  const totalWrongAnswers = results.reduce((sum, result) => sum + result.wrongAnswers, 0);
  const totalAnswers = totalGoodAnswers + totalWrongAnswers;
  const averagePercentage = totalAnswers > 0 ? (totalGoodAnswers / totalAnswers) * 100 : 0;
  const classrooms = Array.from(new Set(results.map(getClassroomName)));

  const topicMap = new Map<string, { percentage: number; count: number; points: number; maxPoints: number }>();
  results.forEach((result) => {
    result.subjects.forEach((subject) => {
      const current = topicMap.get(subject.title) || { percentage: 0, count: 0, points: 0, maxPoints: 0 };
      topicMap.set(subject.title, {
        percentage: current.percentage + Number(subject.percentage || 0),
        count: current.count + 1,
        points: current.points + Number(subject.points || 0),
        maxPoints: current.maxPoints + Number(subject.maxPoints || 0)
      });
    });
  });

  const topics = Array.from(topicMap.entries()).map(([title, data]) => ({
    title,
    percentage: data.count > 0 ? data.percentage / data.count : 0,
    points: data.points,
    maxPoints: data.maxPoints
  }));

  return {
    classrooms,
    totalStudents,
    totalGoodAnswers,
    totalWrongAnswers,
    averagePercentage,
    topics
  };
};

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get('resultId');
  const studentId = searchParams.get('studentId');
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<LearningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!authService.isAuthenticated() || !currentUser) {
      router.replace('/login');
      return;
    }

    if (!['Teacher', 'Academy', 'Admin'].includes(currentUser.role)) {
      setError('Esta vista está disponible para profesores y administradores.');
      setLoading(false);
      return;
    }

    setUser(currentUser);
    void loadResults();
  }, [router]);

  const loadResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await learningResultsService.getTeacherResults();
      setResults(data);
    } catch (loadError) {
      console.error('Error al cargar resultados:', loadError);
      setError('No se pudieron cargar los resultados de los estudiantes.');
    } finally {
      setLoading(false);
    }
  };

  const selectedResult = useMemo(() => {
    if (resultId) {
      return results.find((result) => getEntityId(result) === resultId) || null;
    }

    if (studentId) {
      return [...results]
        .sort((first, second) => new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime())
        .find((result) => result.student.userId === studentId || result.student.email === studentId) || null;
    }

    return null;
  }, [resultId, results, studentId]);

  const selectedTotals = selectedResult ? getTotals(selectedResult) : null;
  const classroomSummary = useMemo(() => buildClassroomSummary(results), [results]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-white dark:bg-[#1C1D1F]">
        <Sidebar />
        <main className="flex-1 bg-[#F9F9F9] p-8">
          <div className="flex h-full items-center justify-center text-gray-600">Cargando informe...</div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex bg-white dark:bg-[#1C1D1F]">
        <Sidebar />
        <main className="flex-1 bg-[#F9F9F9] p-8">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error || 'No se pudo cargar la información.'}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#1C1D1F] text-black dark:text-white">
      <Sidebar />
      <main className="flex-1 bg-[#F9F9F9] p-8">
        {selectedResult ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <button onClick={() => router.push('/dashboard/estudiantes')} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600">
                  <FiArrowLeft /> Volver a estudiantes
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Informe del estudiante</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedResult.student.name} · {normalizeGroup(selectedResult.module?.group || selectedResult.group)}
                </p>
              </div>
              <button onClick={() => downloadStudentExcel(selectedResult)} className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                <FiDownload /> Descargar Excel
              </button>
            </div>

            {selectedResult.bookReport ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Niveles Completados</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {selectedResult.bookReport.completedLevels} / {selectedResult.bookReport.totalLevels}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Promedio General</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{selectedResult.bookReport.avgPct}%</p>
                  </div>
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Mejor Unidad</p>
                    <p className="mt-2 text-xl font-bold text-gray-900 truncate">{selectedResult.bookReport.bestUnit || '—'}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm overflow-hidden border border-gray-100">
                  <div className="mb-5 flex items-center gap-3">
                    <FiBarChart2 className="text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Seguimiento de Niveles</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
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
                        {selectedResult.bookReport.perUnit.flatMap((unit: any) => {
                          const unitRow = (
                            <tr key={`unit-${unit.unitId}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                              <td colSpan={5} style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: '#FFF', fontWeight: 900, padding: '10px 14px', fontSize: '13px' }}>
                                <span style={{ marginRight: 8 }}>{unit.unitIcon}</span> {unit.unitName}
                              </td>
                            </tr>
                          );

                          const levelRows = (unit.perTopic || []).flatMap((topic: any) =>
                            (topic.levels || []).map((lv: any, lvIdx: number) => {
                              const done = lv.pct !== null;
                              const stars = done && lv.pct >= 50 ? (lv.pct >= 95 ? 3 : lv.pct >= 80 ? 2 : 1) : 0;
                              const starsStr = '⭐'.repeat(stars);

                              const GRADE_COLORS: Record<string, string> = { S: '#06A570', A: '#1A6CB4', B: '#BA7517', L: '#C94B22' };
                              const GRADE_LABELS: Record<string, string> = { S: 'Superior', A: 'Alto', B: 'Básico', L: 'Bajo' };

                              return (
                                <tr key={`level-${lv.levelKey}`} style={{ borderBottom: '1px solid #F1F5F9', background: lvIdx % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
                                  <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
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
                                  <td style={{ padding: '10px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
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
                                  <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${done ? 100 : 0}%`, background: done ? '#10B981' : '#94A3B8', borderRadius: 3 }} />
                                      </div>
                                      <span style={{ fontSize: '11px', fontWeight: 900, color: done ? '#10B981' : '#64748B', minWidth: 28, textAlign: 'right' }}>
                                        {done ? 100 : 0}%
                                      </span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '10px 14px', textAlign: 'center', verticalAlign: 'middle', fontSize: '12px' }}>
                                    {starsStr || '—'}
                                  </td>
                                  <td style={{ padding: '10px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
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
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Puntos</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{selectedTotals?.points.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Porcentaje</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{selectedTotals?.percentage.toFixed(2)}%</p>
                  </div>
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Máximo</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{selectedTotals?.maxPoints.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Preguntas buenas</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">{selectedResult.goodAnswers}</p>
                  </div>
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Preguntas malas</p>
                    <p className="mt-2 text-3xl font-bold text-red-600">{selectedResult.wrongAnswers}</p>
                  </div>
                  <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="mt-2 text-xl font-bold text-gray-900">{getRatingMessage(selectedResult)}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <FiBarChart2 className="text-orange-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Nota por tópico</h2>
                  </div>
                  <div className="space-y-4">
                    {selectedResult.subjects.map((subject) => (
                      <div key={subject.title}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-800">{subject.title}</span>
                          <span className="text-gray-500">{Number(subject.percentage || 0).toFixed(2)}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(100, Math.max(0, Number(subject.percentage || 0)))}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {Number(subject.percentage || 0) >= 70 ? 'Fortaleza' : 'Reforzar'} · {Number(subject.points || 0).toFixed(2)} de {Number(subject.maxPoints || 0).toFixed(2)} puntos
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Informe general del salón</h1>
              <p className="mt-1 text-sm text-gray-500">
                Promedio general de los estudiantes asociados a tus salones.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Salones</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{classroomSummary.classrooms.length}</p>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Estudiantes</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{classroomSummary.totalStudents}</p>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Promedio</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{classroomSummary.averagePercentage.toFixed(2)}%</p>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Rating general</p>
                <p className="mt-2 text-xl font-bold text-gray-900">
                  {classroomSummary.averagePercentage >= 70 ? 'Todo está muy bien' : 'Necesita mejorar'}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <FiUsers className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Salones incluidos</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {classroomSummary.classrooms.map((classroom) => (
                  <span key={classroom} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                    {classroom}
                  </span>
                ))}
                {classroomSummary.classrooms.length === 0 && (
                  <span className="text-sm text-gray-500">No hay resultados disponibles.</span>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <FiBarChart2 className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Promedio por tópico</h2>
              </div>
              <div className="space-y-4">
                {classroomSummary.topics.map((topic) => (
                  <div key={topic.title}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">{topic.title}</span>
                      <span className="text-gray-500">{topic.percentage.toFixed(2)}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(100, Math.max(0, topic.percentage))}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {topic.percentage >= 70 ? 'Fortaleza del salón' : 'Tema para reforzar'} · {topic.points.toFixed(2)} de {topic.maxPoints.toFixed(2)} puntos acumulados
                    </p>
                  </div>
                ))}
                {classroomSummary.topics.length === 0 && (
                  <p className="text-sm text-gray-500">No hay tópicos para mostrar.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex bg-white dark:bg-[#1C1D1F]">
          <Sidebar />
          <main className="flex-1 bg-[#F9F9F9] p-8">
            <div className="flex h-full items-center justify-center text-gray-600">Cargando informe...</div>
          </main>
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}
