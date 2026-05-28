'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FiDownload, FiEye, FiSearch } from 'react-icons/fi';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { User } from '@/types/auth.types';
import { learningResultsService, LearningResult } from '@/services/learning-results.service';

interface StudentRow extends User {
  id: string;
  status: 'active' | 'inactive';
  institutionName: string;
  classroomName: string;
  result?: LearningResult;
}

const getEntityId = (value?: { id?: string; _id?: string | undefined } | null) => value?._id || value?.id || '';

const normalizeText = (value?: string | null, fallback = 'No disponible') => {
  if (!value?.trim()) {
    return fallback;
  }

  return value;
};

const getResultId = (result?: LearningResult) => result?._id || result?.id || '';

const getResultTotals = (result?: LearningResult) => {
  if (!result) {
    return { points: 0, maxPoints: 0, percentage: 0 };
  }

  const maxPoints = result.subjects.reduce((sum, subject) => sum + Number(subject.maxPoints || 0), 0);
  const points = result.subjects.reduce((sum, subject) => sum + Number(subject.points || 0), 0);
  const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

  return { points, maxPoints, percentage };
};

const getRatingMessage = (result?: LearningResult) => {
  if (!result) return 'Sin resultados';

  const totalAnswers = result.goodAnswers + result.wrongAnswers;
  const hitRate = totalAnswers > 0 ? (result.goodAnswers / totalAnswers) * 100 : 0;

  return result.rating || (hitRate >= 70 ? 'Todo está muy bien' : 'Necesita mejorar');
};

const getStudentNote = (result?: LearningResult) => {
  if (!result || result.subjects.length === 0) {
    return 'Sin resultados';
  }

  const averagePoints = result.subjects.reduce((sum, subject) => sum + Number(subject.points || 0), 0) / result.subjects.length;

  return `${averagePoints.toFixed(2)} / 10`;
};

const sortResultsByDate = (results: LearningResult[]) =>
  [...results].sort((first, second) => new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime());

const findLatestResultForStudent = (student: User, results: LearningResult[]) => {
  const studentId = getEntityId(student);
  const normalizedEmail = student.email?.toLowerCase();

  return sortResultsByDate(results).find((result) =>
    result.student.userId === studentId ||
    result.student.email?.toLowerCase() === normalizedEmail ||
    result.student.name.toLowerCase() === student.name.toLowerCase()
  );
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

const buildStudentReportRows = (student: StudentRow) => {
  const result = student.result;
  const totals = getResultTotals(result);

  return [
    ['Estudiante', student.name],
    ['Email', student.email],
    ['Institución', student.institutionName],
    ['Salón', student.classroomName],
    ['Módulo', result?.module?.title || result?.moduleId || 'Sin resultados'],
    ['Grado', result?.module?.group || result?.group || 'Sin resultados'],
    ['Puntos', totals.points.toFixed(2)],
    ['Máximo', totals.maxPoints.toFixed(2)],
    ['Porcentaje', `${totals.percentage.toFixed(2)}%`],
    ['Nota', getStudentNote(result)],
    ['Preguntas buenas', String(result?.goodAnswers || 0)],
    ['Preguntas malas', String(result?.wrongAnswers || 0)],
    ['Rating', getRatingMessage(result)],
    [],
    ['Tema', 'Puntos', 'Máximo', 'Porcentaje', 'Nota por tópico'],
    ...(result?.subjects.map((subject) => [
      subject.title,
      Number(subject.points || 0).toFixed(2),
      Number(subject.maxPoints || 0).toFixed(2),
      `${Number(subject.percentage || 0).toFixed(2)}%`,
      Number(subject.percentage || 0) >= 70 ? 'Fortaleza' : 'Reforzar'
    ]) || [])
  ];
};

const buildStudentsFromResults = (results: LearningResult[]) => {
  const seenStudents = new Set<string>();

  return sortResultsByDate(results).reduce<User[]>((students, result) => {
    const studentKey = result.student.userId || result.student.email || result.student.name;
    if (seenStudents.has(studentKey)) {
      return students;
    }

    seenStudents.add(studentKey);
    students.push({
      id: result.student.userId,
      _id: result.student.userId,
      name: result.student.name,
      email: result.student.email || '',
      role: 'Student',
      institutionId: result.student.institutionId,
      student: {
        institution: result.institutionId || result.student.institutionId || '',
        institutionId: result.student.institutionId,
        branchId: result.student.branchId,
        classroomId: result.student.classroomId,
        name: result.student.name,
        email: result.student.email
      }
    });

    return students;
  }, []);
};

export default function EstudiantesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!authService.isAuthenticated() || !currentUser) {
      router.replace('/login');
      return;
    }

    setUser(currentUser);
    void loadStudents(currentUser);
  }, [router]);

  const loadStudents = async (currentUser: User) => {
    setLoading(true);
    setError(null);

    try {
      const resultsData = await learningResultsService.getTeacherResults();
      let data: User[] = [];

      if (currentUser.role === 'Teacher') {
        try {
          data = await usersService.getMyStudents();
        } catch (studentsError) {
          console.warn('Usando estudiantes desde resultados mock:', studentsError);
          data = buildStudentsFromResults(resultsData);
        }
      } else if (currentUser.role === 'Academy' || currentUser.role === 'Admin') {
        try {
          const users = await usersService.getUsers();
          data = users.filter((entry) => entry.role === 'Student');
        } catch (studentsError) {
          console.warn('Usando estudiantes desde resultados mock:', studentsError);
          data = buildStudentsFromResults(resultsData);
        }
      } else {
        setStudents([]);
        setError('Esta vista solo está disponible para usuarios con rol Teacher, Academy o Admin.');
        setLoading(false);
        return;
      }

      if (data.length === 0) {
        data = buildStudentsFromResults(resultsData);
      }

      setStudents(
        data.map((student) => ({
          ...student,
          id: getEntityId(student),
          status: 'active',
          institutionName: normalizeText(student.student?.institution || student.institutionId),
          classroomName: normalizeText(student.student?.classroomId),
          result: findLatestResultForStudent(student, resultsData)
        }))
      );
    } catch (loadError) {
      console.error('Error al cargar estudiantes:', loadError);
      setError('No se pudieron cargar los estudiantes.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) =>
      [student.name, student.email, student.institutionName, student.classroomName, getRatingMessage(student.result)]
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [searchTerm, students]);

  const handleDownloadStudentExcel = (student: StudentRow) => {
    downloadRowsAsExcel(`informe-${student.name.replace(/\s+/g, '-').toLowerCase()}.xls`, buildStudentReportRows(student));
  };

  const handleDownloadAllExcel = () => {
    const rows: Array<Array<string | number>> = [
      ['Estudiante', 'Email', 'Institución', 'Salón', 'Módulo', 'Grado', 'Puntos', 'Máximo', 'Porcentaje', 'Nota', 'Preguntas buenas', 'Preguntas malas', 'Rating']
    ];

    filteredStudents.forEach((student) => {
      const result = student.result;
      const totals = getResultTotals(result);
      rows.push([
        student.name,
        student.email,
        student.institutionName,
        student.classroomName,
        result?.module?.title || result?.moduleId || 'Sin resultados',
        result?.module?.group || result?.group || 'Sin resultados',
        totals.points.toFixed(2),
        totals.maxPoints.toFixed(2),
        `${totals.percentage.toFixed(2)}%`,
        getStudentNote(result),
        result?.goodAnswers || 0,
        result?.wrongAnswers || 0,
        getRatingMessage(result)
      ]);
    });

    downloadRowsAsExcel('estudiantes-resultados.xls', rows);
  };

  const handleViewStudent = (student: StudentRow) => {
    const resultId = getResultId(student.result);
    const studentId = student.result?.student.userId || student.id;
    const params = resultId ? `resultId=${encodeURIComponent(resultId)}` : `studentId=${encodeURIComponent(studentId)}`;

    router.push(`/dashboard/results?${params}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 bg-[#F9F9F9] p-8">
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-600">Cargando estudiantes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 bg-[#F9F9F9] p-8">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error || 'No se pudo cargar la información.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />

        <div className="flex-1 bg-[#F9F9F9]">
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
              <p className="mt-1 text-sm text-gray-500">
                {user.role === 'Teacher'
                  ? 'Consulta estudiantes, rating y resultados de tus salones.'
                  : 'Consulta estudiantes, rating y resultados registrados en la academia.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar estudiantes..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleDownloadAllExcel}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
              >
                <FiDownload /> Descargar estudiantes
              </button>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Estudiante', 'Institución', 'Salón', 'Módulo', 'Nota', 'Rating', 'Acciones'].map((heading) => (
                      <th key={heading} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.institutionName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.classroomName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="font-medium text-gray-900">{student.result?.module?.title || student.result?.moduleId || 'Sin resultados'}</div>
                        <div className="text-gray-500">{student.result?.module?.group || student.result?.group || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{getStudentNote(student.result)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRatingMessage(student.result) === 'Necesita mejorar' ? 'bg-red-100 text-red-700' : student.result ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {getRatingMessage(student.result)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-white hover:bg-orange-600"
                          >
                            <FiEye /> Ver
                          </button>
                          <button
                            onClick={() => handleDownloadStudentExcel(student)}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <FiDownload /> Excel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                        No se encontraron estudiantes para los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
