"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from '@/components/Sidebar';
import { authService } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import { User, Student } from "@/types/auth.types";
import { DEPARTMENTS } from "@/constants/departments";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [studentData, setStudentData] = useState<Partial<Student>>({
    country: 'Colombia',
    department: '',
    city: '',
    institution: '',
    name: '',
    email: ''
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    if (!currentUser) {
      router.replace("/login");
    } else if (currentUser.student) {
      // Si ya tiene datos de estudiante, cargarlos en el formulario
      setStudentData({
        country: currentUser.student.country || 'Colombia',
        department: currentUser.student.department || '',
        city: currentUser.student.city || '',
        institution: currentUser.student.institution || '',
        name: currentUser.student.name || '',
        email: currentUser.student.email || ''
      });
      // Cargar ciudades si hay departamento
      if (currentUser.student.department && DEPARTMENTS[currentUser.student.department]) {
        setAvailableCities(DEPARTMENTS[currentUser.student.department]);
      }
    }
  }, [router]);

  // Sincronizar studentData solo cuando se abre el formulario (no cuando user cambia durante la edición)
  useEffect(() => {
    if (showStudentForm) {
      if (user?.student) {
        // Actualizar los datos del formulario con los datos actuales del usuario
        const newStudentData = {
          country: user.student.country || 'Colombia',
          department: user.student.department || '',
          city: user.student.city || '',
          institution: user.student.institution || '',
          name: user.student.name || '',
          email: user.student.email || ''
        };
        setStudentData(newStudentData);
        // Cargar ciudades si hay departamento
        if (user.student.department && DEPARTMENTS[user.student.department]) {
          setAvailableCities(DEPARTMENTS[user.student.department]);
        }
      } else {
        // Si no hay datos de estudiante, resetear al estado inicial
        setStudentData({
          country: 'Colombia',
          department: '',
          city: '',
          institution: '',
          name: '',
          email: ''
        });
        setAvailableCities([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStudentForm]); // Solo cuando se abre/cierra el formulario, no cuando user cambia

  const handleDepartmentChange = (department: string) => {
    setStudentData({ ...studentData, department, city: '' });
    setAvailableCities(DEPARTMENTS[department] || []);
  };

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Obtener el usuario del estado o del localStorage como respaldo
    let currentUser: User | null = user;
    if (!currentUser?.id) {
      currentUser = authService.getCurrentUser();
      console.log('Usuario obtenido del localStorage:', currentUser);

      if (!currentUser) {
        console.error('No hay usuario disponible en localStorage');
        setSubmitMessage({
          type: 'error',
          message: 'Error: No se pudo obtener la información del usuario. Por favor, recarga la página.'
        });
        return;
      }

      // Intentar obtener el ID de diferentes formas (id, _id)
      const userWithId = currentUser as User & { _id?: string };
      const userId = currentUser.id || userWithId._id;

      if (!userId) {
        console.error('No hay ID de usuario disponible');
        console.error('Usuario completo:', currentUser);
        console.error('Claves del objeto usuario:', Object.keys(currentUser));
        setSubmitMessage({
          type: 'error',
          message: 'Error: No se pudo obtener la información del usuario. Por favor, recarga la página.'
        });
        return;
      }

      // Si el usuario tiene _id pero no id, normalizarlo
      if (!currentUser.id && userWithId._id) {
        currentUser = { ...currentUser, id: userWithId._id };
      }

      // Actualizar el estado con el usuario del localStorage
      setUser(currentUser);
    }

    // Asegurarse de que tenemos el ID
    if (!currentUser || !currentUser.id) {
      console.error('No se pudo obtener el ID del usuario después de todos los intentos');
      setSubmitMessage({
        type: 'error',
        message: 'Error: No se pudo obtener el ID del usuario. Por favor, recarga la página.'
      });
      return;
    }

    const userId = currentUser.id;

    if (submitting) {
      console.warn('Ya se está enviando el formulario');
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      // Preparar los datos asegurándonos de que todos los campos se envíen explícitamente
      const dataToSend: Partial<Student> = {
        country: studentData.country || 'Colombia',
        department: studentData.department && studentData.department.trim() !== '' ? studentData.department.trim() : null,
        city: studentData.city && studentData.city.trim() !== '' ? studentData.city.trim() : null,
        institution: studentData.institution && studentData.institution.trim() !== '' ? studentData.institution.trim() : null,
        name: studentData.name && studentData.name.trim() !== '' ? studentData.name.trim() : null,
        email: studentData.email && studentData.email.trim() !== '' ? studentData.email.trim() : null
      };

      const result = await usersService.updateStudent(userId, dataToSend);

      // Obtener el usuario actual para no perder campos como el rol o el id original
      const currentUserData = authService.getCurrentUser() || user;

      // Asegurarnos de mantener el ID y el rol si el backend no los devuelve o usa _id
      // Combinamos el usuario actual con la respuesta del servidor
      const finalUser = {
        ...currentUserData,
        ...result,
        id: result.id || (result as User & { _id?: string })._id || currentUserData?.id
      } as User;

      // Actualizar el usuario en localStorage con la información completa
      localStorage.setItem('user', JSON.stringify(finalUser));

      // Actualizar el estado del usuario con la información completa
      setUser(finalUser);

      // Disparar un evento personalizado para notificar a otros componentes del cambio
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: finalUser }));

      // Cerrar el formulario después de un pequeño delay para que el usuario vea el mensaje
      setTimeout(() => {
        setShowStudentForm(false);
      }, 2000);

      setSubmitMessage({
        type: 'success',
        message: 'Datos del estudiante guardados exitosamente'
      });
    } catch (error) {
      console.error('=== ERROR AL GUARDAR ===');
      console.error('Error completo:', error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        console.error('Stack:', error.stack);
      }

      setSubmitMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al guardar los datos del estudiante'
      });
    } finally {
      setSubmitting(false);
      console.log('=== FINALIZADO (submitting = false) ===');
    }
  };

  const hasStudentData = user?.student && (
    user.student.country ||
    user.student.department ||
    user.student.city ||
    user.student.institution ||
    user.student.name ||
    user.student.email
  );

  if (loading || !user) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="max-w-xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Perfil de usuario</h1>
            <div className="bg-white dark:bg-[#232323] rounded-lg shadow p-6 mb-4">
              <p className="mb-2"><strong>Nombre:</strong> {user.name}</p>
              <p className="mb-2"><strong>Email:</strong> {user.email}</p>
              <p className="mb-4"><strong>Rol:</strong> {user.role}</p>

              <button
                onClick={() => setShowStudentForm(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {hasStudentData ? 'Editar datos del estudiante' : 'Agregar datos del estudiante'}
              </button>
            </div>

            {/* Mensaje de estado */}
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${submitMessage.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200'
                }`}>
                <div className="flex flex-col gap-2">
                  <p>{submitMessage.message}</p>
                  {submitMessage.type === 'success' && (
                    <button
                      onClick={() => router.push('/dashboard/downloads')}
                      className="text-sm font-bold underline hover:no-underline flex items-center gap-1 w-fit"
                    >
                      Ir a mis descargas →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal del formulario de estudiante */}
      {showStudentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#282828] rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {hasStudentData ? 'Editar datos del estudiante' : 'Agregar datos del estudiante'}
            </h2>

            {/* Mensaje de estado */}
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${submitMessage.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200'
                }`}>
                <div className="flex flex-col gap-2">
                  <p>{submitMessage.message}</p>
                  {submitMessage.type === 'success' && (
                    <button
                      onClick={() => router.push('/dashboard/downloads')}
                      className="text-sm font-bold underline hover:no-underline flex items-center gap-1 w-fit"
                    >
                      Ir a mis descargas →
                    </button>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitStudent}>
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <select
                  id="country"
                  value={studentData.country || 'Colombia'}
                  onChange={(e) => setStudentData({ ...studentData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  disabled={submitting}
                >
                  <option value="Colombia">Colombia</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Departamento
                </label>
                <select
                  id="department"
                  value={studentData.department || ''}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  disabled={submitting}
                >
                  <option value="">Seleccione un departamento</option>
                  {Object.keys(DEPARTMENTS).map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ciudad
                </label>
                <select
                  id="city"
                  value={studentData.city || ''}
                  onChange={(e) => setStudentData({ ...studentData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  disabled={submitting || !studentData.department}
                >
                  <option value="">Seleccione una ciudad</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institución
                </label>
                <input
                  type="text"
                  id="institution"
                  value={studentData.institution || ''}
                  onChange={(e) => setStudentData({ ...studentData, institution: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  disabled={submitting}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={studentData.name || ''}
                  onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={studentData.email || ''}
                  onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStudentForm(false);
                    setSubmitMessage(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  disabled={submitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 