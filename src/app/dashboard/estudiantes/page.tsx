'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FiSearch } from 'react-icons/fi';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { User } from '@/types/auth.types';

interface StudentRow extends User {
  id: string;
  status: 'active' | 'inactive';
  institutionName: string;
  classroomName: string;
}

const getEntityId = (value?: { id?: string; _id?: string | undefined } | null) => value?._id || value?.id || '';

const normalizeText = (value?: string | null, fallback = 'No disponible') => {
  if (!value?.trim()) {
    return fallback;
  }

  return value;
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
      let data: User[] = [];

      if (currentUser.role === 'Teacher') {
        data = await usersService.getMyStudents();
      } else if (currentUser.role === 'Academy') {
        const users = await usersService.getUsers();
        data = users.filter((entry) => entry.role === 'Student');
      } else {
        setStudents([]);
        setError('Esta vista solo está disponible para usuarios con rol Teacher o Academy.');
        setLoading(false);
        return;
      }

      setStudents(
        data.map((student) => ({
          ...student,
          id: getEntityId(student),
          status: 'active',
          institutionName: normalizeText(student.student?.institution),
          classroomName: normalizeText(student.student?.classroomId)
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
      [student.name, student.email, student.institutionName, student.classroomName]
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [searchTerm, students]);

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
                  ? 'Consulta los estudiantes asignados a tu perfil.'
                  : 'Consulta y filtra los estudiantes registrados en la academia.'}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar estudiantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Institución
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Salón
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.institutionName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.classroomName}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
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
