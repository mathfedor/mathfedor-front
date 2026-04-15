'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { institutionService } from '@/services/institution.service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from '@/types/auth.types';
import {
  Branch,
  Classroom,
  CreateInstitutionData,
  Institution
} from '@/types/institution.types';

type MessageState = { type: 'success' | 'error'; message: string } | null;

const emptyInstitutionForm = {
  name: '',
  type: 'Universidad' as Institution['type'],
  city: '',
  region: '',
  address: '',
  email: ''
};

const emptyBranchForm = {
  name: '',
  address: ''
};

const emptyClassroomForm = {
  name: '',
  code: '',
  capacity: '',
  teacherIds: [] as string[]
};

const getEntityId = (value?: { id?: string; _id?: string | undefined } | null) => value?._id || value?.id || '';

export default function InstitutionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [showCreateInstitutionForm, setShowCreateInstitutionForm] = useState(false);
  const [institutionForm, setInstitutionForm] = useState(emptyInstitutionForm);
  const [branchForm, setBranchForm] = useState(emptyBranchForm);
  const [editingBranchId, setEditingBranchId] = useState('');
  const [classroomFormByBranch, setClassroomFormByBranch] = useState<Record<string, typeof emptyClassroomForm>>({});
  const [editingClassroomId, setEditingClassroomId] = useState('');
  const [branchesByInstitution, setBranchesByInstitution] = useState<Record<string, Branch[]>>({});
  const [classroomsByBranch, setClassroomsByBranch] = useState<Record<string, Classroom[]>>({});
  const [teachersByInstitution, setTeachersByInstitution] = useState<Record<string, User[]>>({});
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);

  const selectedInstitution = useMemo(
    () => institutions.find((institution) => getEntityId(institution) === selectedInstitutionId) || null,
    [institutions, selectedInstitutionId]
  );

  const currentBranches = branchesByInstitution[selectedInstitutionId] || [];
  const currentTeachers = teachersByInstitution[selectedInstitutionId] || [];
  const currentClassrooms = classroomsByBranch[selectedBranchId] || [];

  const loadBranches = useCallback(async (institutionId: string) => {
    if (!institutionId) return;

    setLoadingBranches(true);
    const response = await institutionService.getBranches(institutionId);

    if (response.success && response.data) {
      const branches = response.data;
      setBranchesByInstitution((prev) => ({
        ...prev,
        [institutionId]: branches.map((branch) => ({
          ...branch,
          id: getEntityId(branch)
        }))
      }));
    } else {
      setMessage({ type: 'error', message: response.message });
    }

    setLoadingBranches(false);
  }, []);

  const loadTeachers = useCallback(async (institutionId: string) => {
    if (!institutionId) return;

    const response = await institutionService.getTeachersByInstitution(institutionId);
    if (response.success && response.data) {
      const teachers = response.data;
      setTeachersByInstitution((prev) => ({
        ...prev,
        [institutionId]: teachers.map((teacher) => ({
          ...teacher,
          id: getEntityId(teacher)
        }))
      }));
    }
  }, []);

  const loadInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await institutionService.getInstitutions('active');

    if (!response.success || !response.data) {
      setError(response.message);
      setLoading(false);
      return;
    }

    const normalizedInstitutions = response.data.map((institution) => ({
      ...institution,
      id: getEntityId(institution)
    }));

    setInstitutions(normalizedInstitutions);

    if (normalizedInstitutions.length > 0) {
      const nextInstitutionId = selectedInstitutionId || getEntityId(normalizedInstitutions[0]);
      setSelectedInstitutionId(nextInstitutionId);
      await Promise.all([loadBranches(nextInstitutionId), loadTeachers(nextInstitutionId)]);
    }

    setLoading(false);
  }, [loadBranches, loadTeachers, selectedInstitutionId]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!authService.isAuthenticated() || !currentUser) {
      router.replace('/login');
      return;
    }

    if (currentUser.role !== 'Admin') {
      setError('No tienes permisos para acceder a esta pÃ¡gina');
      setLoading(false);
      return;
    }

    setUser(currentUser);
    void loadInstitutions();
  }, [loadInstitutions, router]);

  const loadClassrooms = async (branchId: string) => {
    if (!branchId) return;

    setLoadingClassrooms(true);
    const response = await institutionService.getClassrooms(branchId);

    if (response.success && response.data) {
      const classrooms = response.data;
      setClassroomsByBranch((prev) => ({
        ...prev,
        [branchId]: classrooms.map((classroom) => ({
          ...classroom,
          id: getEntityId(classroom),
          branchId
        }))
      }));
    } else {
      setMessage({ type: 'error', message: response.message });
    }

    setLoadingClassrooms(false);
  };

  const handleSelectInstitution = async (institutionId: string) => {
    setSelectedInstitutionId(institutionId);
    setSelectedBranchId('');
    setBranchForm(emptyBranchForm);
    setEditingBranchId('');
    await Promise.all([loadBranches(institutionId), loadTeachers(institutionId)]);
  };

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload: CreateInstitutionData = { ...institutionForm };
    const response = await institutionService.createInstitution(payload);

    if (response.success && response.data) {
      const created = { ...response.data, id: getEntityId(response.data) };
      setInstitutions((prev) => [...prev, created]);
      setInstitutionForm(emptyInstitutionForm);
      setShowCreateInstitutionForm(false);
      setMessage({ type: 'success', message: response.message });
    } else {
      setMessage({ type: 'error', message: response.message });
    }

    setSaving(false);
  };

  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstitutionId) return;

    setSaving(true);
    setMessage(null);

    const response = editingBranchId
      ? await institutionService.updateBranch(editingBranchId, branchForm)
      : await institutionService.createBranch(selectedInstitutionId, branchForm);

    if (response.success) {
      await loadBranches(selectedInstitutionId);
      setBranchForm(emptyBranchForm);
      setEditingBranchId('');
      setMessage({ type: 'success', message: response.message });
    } else {
      setMessage({ type: 'error', message: response.message });
    }

    setSaving(false);
  };

  const handleDeleteBranch = async (branchId: string) => {
    setSaving(true);
    const response = await institutionService.deleteBranch(branchId);

    if (response.success) {
      await loadBranches(selectedInstitutionId);
      if (selectedBranchId === branchId) {
        setSelectedBranchId('');
      }
      setMessage({ type: 'success', message: response.message });
    } else {
      setMessage({ type: 'error', message: response.message });
    }

    setSaving(false);
  };

  const handleClassroomFormChange = (branchId: string, field: keyof typeof emptyClassroomForm, value: string | string[]) => {
    setClassroomFormByBranch((prev) => ({
      ...prev,
      [branchId]: {
        ...(prev[branchId] || emptyClassroomForm),
        [field]: value
      }
    }));
  };

  const handleClassroomSubmit = async (e: React.FormEvent, branchId: string) => {
    e.preventDefault();
    const form = classroomFormByBranch[branchId] || emptyClassroomForm;

    setSaving(true);
    setMessage(null);

    const payload = {
      name: form.name,
      code: form.code,
      capacity: form.capacity ? Number(form.capacity) : undefined,
      teacherIds: form.teacherIds
    };

    const response = editingClassroomId
      ? await institutionService.updateClassroom(editingClassroomId, payload)
      : await institutionService.createClassroom(branchId, payload);

    if (response.success) {
      await loadClassrooms(branchId);
      setClassroomFormByBranch((prev) => ({
        ...prev,
        [branchId]: emptyClassroomForm
      }));
      setEditingClassroomId('');
      setMessage({ type: 'success', message: response.message });
    } else {
      setMessage({ type: 'error', message: response.message });
    }

    setSaving(false);
  };

  const handleAssignTeachers = async (classroomId: string, teacherIds: string[]) => {
    setSaving(true);
    const response = await institutionService.assignTeachersToClassroom(classroomId, teacherIds);

    if (response.success && selectedBranchId) {
      await loadClassrooms(selectedBranchId);
      setMessage({ type: 'success', message: response.message });
    } else if (!response.success) {
      setMessage({ type: 'error', message: response.message });
    }

    setSaving(false);
  };

  const startEditBranch = (branch: Branch) => {
    setEditingBranchId(getEntityId(branch));
    setBranchForm({
      name: branch.name,
      address: branch.address
    });
  };

  const startEditClassroom = (branchId: string, classroom: Classroom) => {
    setSelectedBranchId(branchId);
    setEditingClassroomId(getEntityId(classroom));
    setClassroomFormByBranch((prev) => ({
      ...prev,
      [branchId]: {
        name: classroom.name,
        code: classroom.code,
        capacity: classroom.capacity?.toString() || '',
        teacherIds: classroom.teacherIds || classroom.teachers?.map((teacher) => getEntityId(teacher)) || []
      }
    }));
  };

  if (loading) {
    return <div className="p-8">Cargando...</div>;
  }

  if (error || !user) {
    return <div className="p-8 text-red-600">{error || 'No se pudo cargar la pÃ¡gina.'}</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />

        <div className="flex-1 bg-[#F9F9F9]">
          <div className="p-8 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GestiÃ³n de Instituciones</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Administra instituciones, sedes, salones y la asignaciÃ³n de profesores.
                </p>
              </div>
              <Button
                onClick={() => setShowCreateInstitutionForm((prev) => !prev)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {showCreateInstitutionForm ? 'Cerrar formulario' : 'Crear instituciÃ³n'}
              </Button>
            </div>

            {message && (
              <div className={`rounded-lg border px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}>
                {message.message}
              </div>
            )}

            {showCreateInstitutionForm && (
              <form onSubmit={handleCreateInstitution} className="rounded-xl bg-white p-6 shadow-sm space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="institution-name">Nombre</Label>
                    <input
                      id="institution-name"
                      value={institutionForm.name}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution-type">Tipo</Label>
                    <select
                      id="institution-type"
                      value={institutionForm.type}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, type: e.target.value as Institution['type'] }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="Universidad">Universidad</option>
                      <option value="Colegio">Colegio</option>
                      <option value="Escuela">Escuela</option>
                      <option value="Tecnico">TÃ©cnico</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="institution-city">Ciudad</Label>
                    <input
                      id="institution-city"
                      value={institutionForm.city}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, city: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution-region">RegiÃ³n</Label>
                    <input
                      id="institution-region"
                      value={institutionForm.region}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, region: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution-address">DirecciÃ³n</Label>
                    <input
                      id="institution-address"
                      value={institutionForm.address}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, address: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution-email">Email</Label>
                    <input
                      id="institution-email"
                      type="email"
                      value={institutionForm.email}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white">
                  {saving ? 'Guardando...' : 'Guardar instituciÃ³n'}
                </Button>
              </form>
            )}

            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">InstituciÃ³n</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">UbicaciÃ³n</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {institutions.map((institution) => {
                    const institutionId = getEntityId(institution);
                    const isSelected = selectedInstitutionId === institutionId;

                    return (
                      <tr key={institutionId} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{institution.name}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{institution.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div>{institution.location.city}</div>
                          <div>{institution.location.region}</div>
                          <div className="text-xs text-gray-500">{institution.location.address}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{institution.email}</td>
                        <td className="px-6 py-4">
                          <Button
                            type="button"
                            onClick={() => void handleSelectInstitution(institutionId)}
                            className="bg-slate-700 hover:bg-slate-800 text-white"
                          >
                            Gestionar sedes
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedInstitution && (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
                <section className="rounded-xl bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Sedes de {selectedInstitution.name}</h2>
                    <p className="text-sm text-gray-500">Crea y organiza las sedes asociadas a la instituciÃ³n seleccionada.</p>
                  </div>

                  <form onSubmit={handleBranchSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <div>
                      <Label htmlFor="branch-name">Nombre de la sede</Label>
                      <input
                        id="branch-name"
                        value={branchForm.name}
                        onChange={(e) => setBranchForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch-address">DirecciÃ³n</Label>
                      <input
                        id="branch-address"
                        value={branchForm.address}
                        onChange={(e) => setBranchForm((prev) => ({ ...prev, address: e.target.value }))}
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white">
                        {editingBranchId ? 'Actualizar' : 'Crear'}
                      </Button>
                      {editingBranchId && (
                        <Button
                          type="button"
                          onClick={() => {
                            setEditingBranchId('');
                            setBranchForm(emptyBranchForm);
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="space-y-3">
                    {loadingBranches && <p className="text-sm text-gray-500">Cargando sedes...</p>}
                    {!loadingBranches && currentBranches.length === 0 && (
                      <p className="text-sm text-gray-500">Esta instituciÃ³n aÃºn no tiene sedes registradas.</p>
                    )}

                    {currentBranches.map((branch) => {
                      const branchId = getEntityId(branch);
                      const isSelected = selectedBranchId === branchId;

                      return (
                        <div key={branchId} className={`rounded-lg border p-4 ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                              <p className="text-sm text-gray-600">{branch.address}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                onClick={() => {
                                  setSelectedBranchId(branchId);
                                  void loadClassrooms(branchId);
                                }}
                                className="bg-slate-700 hover:bg-slate-800 text-white"
                              >
                                Ver salones
                              </Button>
                              <Button
                                type="button"
                                onClick={() => startEditBranch(branch)}
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                              >
                                Editar
                              </Button>
                              <Button
                                type="button"
                                onClick={() => void handleDeleteBranch(branchId)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-xl bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Salones y profesores</h2>
                    <p className="text-sm text-gray-500">
                      {selectedBranchId
                        ? 'Administra los salones de la sede seleccionada y asigna profesores.'
                        : 'Selecciona una sede para crear salones y asignar profesores.'}
                    </p>
                  </div>

                  {selectedBranchId && (
                    <>
                      <form onSubmit={(e) => void handleClassroomSubmit(e, selectedBranchId)} className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <Label htmlFor="classroom-name">Nombre del salÃ³n</Label>
                            <input
                              id="classroom-name"
                              value={(classroomFormByBranch[selectedBranchId] || emptyClassroomForm).name}
                              onChange={(e) => handleClassroomFormChange(selectedBranchId, 'name', e.target.value)}
                              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="classroom-code">CÃ³digo</Label>
                            <input
                              id="classroom-code"
                              value={(classroomFormByBranch[selectedBranchId] || emptyClassroomForm).code}
                              onChange={(e) => handleClassroomFormChange(selectedBranchId, 'code', e.target.value)}
                              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="classroom-capacity">Capacidad</Label>
                            <input
                              id="classroom-capacity"
                              type="number"
                              min="0"
                              value={(classroomFormByBranch[selectedBranchId] || emptyClassroomForm).capacity}
                              onChange={(e) => handleClassroomFormChange(selectedBranchId, 'capacity', e.target.value)}
                              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="classroom-teachers">Profesores del salÃ³n</Label>
                          <select
                            id="classroom-teachers"
                            multiple
                            value={(classroomFormByBranch[selectedBranchId] || emptyClassroomForm).teacherIds}
                            onChange={(e) =>
                              handleClassroomFormChange(
                                selectedBranchId,
                                'teacherIds',
                                Array.from(e.target.selectedOptions, (option) => option.value)
                              )
                            }
                            className="mt-2 min-h-32 w-full rounded-md border border-gray-300 px-3 py-2"
                          >
                            {currentTeachers.map((teacher) => (
                              <option key={getEntityId(teacher)} value={getEntityId(teacher)}>
                                {teacher.name} - {teacher.email}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white">
                            {editingClassroomId ? 'Actualizar salÃ³n' : 'Crear salÃ³n'}
                          </Button>
                          {editingClassroomId && (
                            <Button
                              type="button"
                              onClick={() => {
                                setEditingClassroomId('');
                                setClassroomFormByBranch((prev) => ({
                                  ...prev,
                                  [selectedBranchId]: emptyClassroomForm
                                }));
                              }}
                              className="bg-gray-500 hover:bg-gray-600 text-white"
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </form>

                      <div className="space-y-3">
                        {loadingClassrooms && <p className="text-sm text-gray-500">Cargando salones...</p>}
                        {!loadingClassrooms && currentClassrooms.length === 0 && (
                          <p className="text-sm text-gray-500">Esta sede aÃºn no tiene salones registrados.</p>
                        )}

                        {currentClassrooms.map((classroom) => {
                          const classroomId = getEntityId(classroom);
                          const assignedTeacherIds = classroom.teacherIds || classroom.teachers?.map((teacher) => getEntityId(teacher)) || [];

                          return (
                            <div key={classroomId} className="rounded-lg border border-gray-200 p-4 space-y-3">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{classroom.name}</h3>
                                  <p className="text-sm text-gray-600">CÃ³digo: {classroom.code}</p>
                                  <p className="text-sm text-gray-600">
                                    Capacidad: {classroom.capacity ?? 'No definida'}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    onClick={() => startEditClassroom(selectedBranchId, classroom)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white"
                                  >
                                    Editar
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor={`assigned-teachers-${classroomId}`}>Profesores asignados</Label>
                                <select
                                  id={`assigned-teachers-${classroomId}`}
                                  multiple
                                  value={assignedTeacherIds}
                                  onChange={(e) =>
                                    void handleAssignTeachers(
                                      classroomId,
                                      Array.from(e.target.selectedOptions, (option) => option.value)
                                    )
                                  }
                                  className="mt-2 min-h-28 w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                  {currentTeachers.map((teacher) => (
                                    <option key={getEntityId(teacher)} value={getEntityId(teacher)}>
                                      {teacher.name} - {teacher.email}
                                    </option>
                                  ))}
                                </select>
                                <p className="mt-2 text-xs text-gray-500">
                                  MantÃ©n presionada la tecla Ctrl o Cmd para seleccionar varios profesores.
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

