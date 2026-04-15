"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from '@/components/Sidebar';
import { authService } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import { institutionService } from "@/services/institution.service";
import { User, Student } from "@/types/auth.types";
import { Branch, Classroom, Institution } from "@/types/institution.types";
import { DEPARTMENTS } from "@/constants/departments";

const getEntityId = (value?: { id?: string; _id?: string | undefined } | null) => value?._id || value?.id || '';

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
    institutionId: '',
    branchId: '',
    classroomId: '',
    name: '',
    email: ''
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const router = useRouter();

  const belongsToInstitution = Boolean(user?.institutionId);
  const institutionName = useMemo(() => {
    const institutionId = user?.institutionId;
    if (!institutionId) return '';
    const institution = institutions.find((entry) => getEntityId(entry) === institutionId);
    return institution?.name || user?.student?.institution || '';
  }, [institutions, user]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    syncStudentData(currentUser);
    void loadInstitutions();
  }, [router]);

  useEffect(() => {
    if (!showStudentForm || !user) return;
    syncStudentData(user);

    if (user.institutionId) {
      void loadBranches(user.institutionId);

      if (user.student?.branchId) {
        void loadClassrooms(user.student.branchId);
      } else {
        setClassrooms([]);
      }
    } else {
      setBranches([]);
      setClassrooms([]);
    }
  }, [showStudentForm, user]);

  const syncStudentData = (currentUser: User) => {
    const nextStudentData: Partial<Student> = {
      country: currentUser.student?.country || 'Colombia',
      department: currentUser.student?.department || '',
      city: currentUser.student?.city || '',
      institution: currentUser.student?.institution || '',
      institutionId: currentUser.institutionId || currentUser.student?.institutionId || '',
      branchId: currentUser.student?.branchId || '',
      classroomId: currentUser.student?.classroomId || '',
      name: currentUser.student?.name || '',
      email: currentUser.student?.email || ''
    };

    setStudentData(nextStudentData);

    if (nextStudentData.department && DEPARTMENTS[nextStudentData.department]) {
      setAvailableCities(DEPARTMENTS[nextStudentData.department]);
    } else {
      setAvailableCities([]);
    }
  };

  const loadInstitutions = async () => {
    const response = await institutionService.getInstitutions('active');
    if (response.success && response.data) {
      setInstitutions(response.data.map((institution) => ({ ...institution, id: getEntityId(institution) })));
    }
  };

  const loadBranches = async (institutionId: string) => {
    const response = await institutionService.getBranches(institutionId);
    if (response.success && response.data) {
      setBranches(response.data.map((branch) => ({ ...branch, id: getEntityId(branch) })));
    }
  };

  const loadClassrooms = async (branchId: string) => {
    const response = await institutionService.getClassrooms(branchId);
    if (response.success && response.data) {
      setClassrooms(response.data.map((classroom) => ({ ...classroom, id: getEntityId(classroom) })));
    }
  };

  const handleDepartmentChange = (department: string) => {
    setStudentData((prev) => ({ ...prev, department, city: '' }));
    setAvailableCities(DEPARTMENTS[department] || []);
  };

  const handleBranchChange = async (branchId: string) => {
    setStudentData((prev) => ({ ...prev, branchId, classroomId: '' }));
    setClassrooms([]);
    if (branchId) {
      await loadClassrooms(branchId);
    }
  };

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    let currentUser = user || authService.getCurrentUser();
    if (!currentUser) {
      setSubmitMessage({
        type: 'error',
        message: 'No se pudo obtener la información del usuario.'
      });
      return;
    }

    if (!currentUser.id && currentUser._id) {
      currentUser = { ...currentUser, id: currentUser._id };
    }

    if (!currentUser.id) {
      setSubmitMessage({
        type: 'error',
        message: 'No se pudo obtener el ID del usuario.'
      });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const basePayload: Partial<Student> = {
        country: studentData.country || 'Colombia',
        department: studentData.department?.trim() || null,
        city: studentData.city?.trim() || null,
        name: studentData.name?.trim() || null,
        email: studentData.email?.trim() || null
      };

      const payload: Partial<Student> = currentUser.institutionId
        ? {
            ...basePayload,
            branchId: studentData.branchId || null,
            classroomId: studentData.classroomId || null
          }
        : {
            ...basePayload,
            institution: studentData.institution?.trim() || null
          };

      const result = await usersService.updateStudent(currentUser.id, payload);
      const updatedUser: User = {
        ...currentUser,
        ...result,
        id: result.id || result._id || currentUser.id,
        institutionId: result.institutionId || currentUser.institutionId,
        student: {
          ...currentUser.student,
          ...result.student
        }
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSubmitMessage({
        type: 'success',
        message: 'Datos del estudiante guardados exitosamente'
      });

      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));

      setTimeout(() => {
        setShowStudentForm(false);
      }, 1500);
    } catch (submitError) {
      console.error('Error al guardar datos del estudiante:', submitError);
      setSubmitMessage({
        type: 'error',
        message: submitError instanceof Error ? submitError.message : 'Error al guardar los datos del estudiante'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hasStudentData = Boolean(
    user?.student &&
    (
      user.student.country ||
      user.student.department ||
      user.student.city ||
      user.student.institution ||
      user.student.branchId ||
      user.student.classroomId ||
      user.student.name ||
      user.student.email
    )
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
              <p className="mb-2"><strong>Rol:</strong> {user.role}</p>
              <p className="mb-4"><strong>Institución:</strong> {institutionName || 'Sin institución asignada'}</p>

              <button
                onClick={() => setShowStudentForm(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {hasStudentData ? 'Editar datos del estudiante' : 'Agregar datos del estudiante'}
              </button>
            </div>

            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${
                submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200'
              }`}>
                {submitMessage.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {showStudentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#282828] rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {hasStudentData ? 'Editar datos del estudiante' : 'Agregar datos del estudiante'}
            </h2>

            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${
                submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200'
              }`}>
                {submitMessage.message}
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
                  onChange={(e) => setStudentData((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
                  required
                  disabled={submitting}
                >
                  <option value="">Seleccione un departamento</option>
                  {Object.keys(DEPARTMENTS).map((department) => (
                    <option key={department} value={department}>{department}</option>
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
                  onChange={(e) => setStudentData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
                  required
                  disabled={submitting || !studentData.department}
                >
                  <option value="">Seleccione una ciudad</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {belongsToInstitution ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Institución
                    </label>
                    <input
                      value={institutionName}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-[#1C1D1F]"
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sede
                    </label>
                    <select
                      id="branchId"
                      value={studentData.branchId || ''}
                      onChange={(e) => void handleBranchChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
                      disabled={submitting}
                    >
                      <option value="">Seleccione una sede</option>
                      {branches.map((branch) => (
                        <option key={getEntityId(branch)} value={getEntityId(branch)}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="classroomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Salón
                    </label>
                    <select
                      id="classroomId"
                      value={studentData.classroomId || ''}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, classroomId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
                      disabled={submitting || !studentData.branchId}
                    >
                      <option value="">Seleccione un salón</option>
                      {classrooms.map((classroom) => (
                        <option key={getEntityId(classroom)} value={getEntityId(classroom)}>
                          {classroom.name} - {classroom.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institución
                  </label>
                  <input
                    id="institution"
                    value={studentData.institution || ''}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, institution: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
                    disabled={submitting}
                  />
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo
                </label>
                <input
                  id="name"
                  value={studentData.name || ''}
                  onChange={(e) => setStudentData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={studentData.email || ''}
                  onChange={(e) => setStudentData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1C1D1F]"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400"
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
