'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { institutionService } from '@/services/institution.service';
import { Institution } from '@/types/institution.types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from '@/types/auth.types';

interface UserData extends User {
  createdAt?: string;
  status?: 'active' | 'inactive';
}

const getEntityId = (value?: { id?: string; _id?: string | undefined } | null) => value?._id || value?.id || '';

const emptyForm = {
  name: '',
  email: '',
  role: 'Student',
  institutionId: '',
  password: ''
};

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const institutionNameById = useMemo(
    () =>
      institutions.reduce<Record<string, string>>((acc, institution) => {
        acc[getEntityId(institution)] = institution.name;
        return acc;
      }, {}),
    [institutions]
  );

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!authService.isAuthenticated() || !currentUser) {
      router.replace('/login');
      return;
    }

    setUser(currentUser);
    void Promise.all([loadUsers(), loadInstitutions()]).finally(() => setLoading(false));
  }, [router]);

  const loadInstitutions = async () => {
    try {
      const response = await institutionService.getInstitutions('active');
      if (response.success && response.data) {
        setInstitutions(response.data.map((institution) => ({ ...institution, id: getEntityId(institution) })));
      }
    } catch (loadError) {
      console.error('Error al cargar instituciones:', loadError);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersService.getUsers();
      setUsers(data.map((entry) => ({ ...entry, id: getEntityId(entry) } as UserData)));
    } catch (loadError) {
      console.error('Error al cargar usuarios:', loadError);
      setError('No se pudieron cargar los usuarios');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingUser(null);
    setShowCreateForm(false);
  };

  const handleEditClick = (userToEdit: UserData) => {
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      institutionId: userToEdit.institutionId || '',
      password: ''
    });
    setShowCreateForm(true);
  };

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingUser) {
        const updatedUser = await usersService.updateUser({
          ...editingUser,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          institutionId: formData.institutionId || undefined
        });

        setUsers((prev) =>
          prev.map((entry) => (getEntityId(entry) === getEntityId(editingUser) ? { ...updatedUser, id: getEntityId(updatedUser) } : entry))
        );

        Swal.fire({
          title: 'Actualizado',
          text: 'Usuario actualizado exitosamente',
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
      } else {
        const newUser = await usersService.createUserRole({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
          institutionId: formData.institutionId || undefined,
          recaptchaToken: ''
        });

        setUsers((prev) => [...prev, { ...newUser, id: getEntityId(newUser), status: 'active' } as UserData]);

        Swal.fire({
          title: 'Éxito',
          text: 'Usuario creado exitosamente',
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
      }

      resetForm();
    } catch (submitError) {
      console.error('Error al procesar usuario:', submitError);
      Swal.fire({
        title: 'Error',
        text: submitError instanceof Error ? submitError.message : 'Error al procesar el usuario',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      Swal.fire('Error', 'Por favor selecciona un archivo', 'error');
      return;
    }

    try {
      setLoading(true);
      await usersService.bulkUploadExcel(selectedFile);
      await loadUsers();
      setShowUploadForm(false);
      setSelectedFile(null);

      Swal.fire({
        title: 'Éxito',
        text: 'Usuarios cargados exitosamente',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    } catch (uploadError) {
      console.error('Error al cargar usuarios:', uploadError);
      Swal.fire({
        title: 'Error',
        text: uploadError instanceof Error ? uploadError.message : 'Error al cargar el archivo',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <p className="text-lg text-gray-600">{error || 'No se pudo cargar la información del usuario.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />

        <div className="flex-1 bg-[#F9F9F9]">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="mt-1 text-sm text-gray-500">
                Crea usuarios con rol, institución y carga masiva.
              </p>
            </div>

            <div className="mb-6 flex gap-4">
              <Button onClick={() => setShowCreateForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                Crear Usuario
              </Button>
              <Button onClick={() => setShowUploadForm(true)} className="bg-green-500 hover:bg-green-600 text-white">
                Cargar Usuarios (Excel)
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((entry) => (
                      <tr key={getEntityId(entry)} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">{entry.name.charAt(0)}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.institutionId ? institutionNameById[entry.institutionId] || entry.institutionId : 'Sin institución'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleEditClick(entry)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
            <form onSubmit={handleCreateOrUpdateUser}>
              <div className="mb-4">
                <Label htmlFor="name">Nombre</Label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="role">Rol</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Student">Estudiante</option>
                  <option value="Teacher">Profesor</option>
                  <option value="Academy">Academia</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <Label htmlFor="institutionId">Institución</Label>
                <select
                  id="institutionId"
                  value={formData.institutionId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, institutionId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Sin institución</option>
                  {institutions.map((institution) => (
                    <option key={getEntityId(institution)} value={getEntityId(institution)}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <Label htmlFor="password">{editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}</Label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required={!editingUser}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                  {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                </Button>
                <Button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cargar Usuarios desde Excel</h2>
            <div className="mb-4">
              <Label htmlFor="file">Seleccionar archivo Excel</Label>
              <input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleBulkUpload} disabled={!selectedFile} className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300">
                Cargar Usuarios
              </Button>
              <Button onClick={() => setShowUploadForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
