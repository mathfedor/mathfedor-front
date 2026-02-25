'use client';

import { useState, useEffect } from 'react';
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

// Tipos para la página de usuarios
interface UserData extends User {
  createdAt?: string;
  status?: 'active' | 'inactive';
}

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

  // Estado del formulario de creación
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    institutionId: '',
    password: ''
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        setError(null);

        if (!authService.isAuthenticated()) {
          console.log('No hay token de autenticación');
          router.replace('/login');
          return;
        }

        const userData = authService.getCurrentUser();
        if (!userData) {
          throw new Error('No se encontró información del usuario');
        }

        setUser(userData);
        // Cargar usuarios (simulado por ahora)
        loadUsers();
      } catch (error) {
        console.error('Error detallado:', error);
        setError(error instanceof Error ? error.message : 'Error al obtener datos del usuario');
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    loadInstitutions();
  }, [router]);

  const loadInstitutions = async () => {
    try {
      const response = await institutionService.getInstitutions('active');
      if (response.success && response.data) {
        setInstitutions(response.data);
      }
    } catch (error) {
      console.error('Error al cargar instituciones:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersService.getUsers();
      // El backend devuelve createdAt y status? Si no, los mapeamos o ajustamos el tipo
      setUsers(data as UserData[]);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('No se pudieron cargar los usuarios');
    }
  };

  const handleEditClick = (userToEdit: UserData) => {
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      institutionId: userToEdit.student?.institution || '',
      password: '' // Opcional en edición
    });
    setShowCreateForm(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userId = editingUser?._id || editingUser?.id;
      if (editingUser && userId) {
        await usersService.updateStudent(userId, {
          name: formData.name,
          email: formData.email,
          institution: formData.institutionId
        });

        setUsers(users.map(u => (u._id === userId || u.id === userId) ? {
          ...u,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          student: { ...u.student, institution: formData.institutionId }
        } : u));

        Swal.fire({
          title: '¡Actualizado!',
          text: 'Usuario actualizado exitosamente',
          icon: 'success',
          confirmButtonColor: '#3B82F6',
        });
      } else {
        const newUser = await usersService.createUserRole({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
          institutionId: formData.institutionId,
          recaptchaToken: ''
        });

        setUsers([...users, { ...newUser, status: 'active' } as UserData]);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario creado exitosamente',
          icon: 'success',
          confirmButtonColor: '#3B82F6',
        });
      }

      setShowCreateForm(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Student',
        institutionId: '',
        password: ''
      });
    } catch (error) {
      console.error('Error al procesar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al procesar el usuario',
        icon: 'error',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuarios cargados exitosamente',
        icon: 'success',
        confirmButtonColor: '#3B82F6',
      });

      // Recargar la lista de usuarios para mostrar los nuevos
      loadUsers();
      setShowUploadForm(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al cargar el archivo',
        icon: 'error',
        confirmButtonColor: '#EF4444',
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
          <p className="text-lg text-gray-600">
            {error || 'No se pudo cargar la información del usuario.'}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="mt-1 text-sm text-gray-500">
                Administra los usuarios del sistema
              </p>
            </div>

            {/* Botones de acción */}
            <div className="mb-6 flex gap-4">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Crear Usuario
              </Button>
              <Button
                onClick={() => setShowUploadForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Cargar Usuarios (Excel)
              </Button>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role.toLowerCase() === 'teacher'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role.toLowerCase() === 'academy'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}>
                            {user.role.toLowerCase() === 'teacher' ? 'Profesor' :
                              user.role.toLowerCase() === 'academy' ? 'Institución' : 'Estudiante'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Eliminar
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

      {/* Modal para crear/editar usuario */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <Label htmlFor="name">Nombre</Label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="role">Rol</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Student">Estudiante</option>
                  <option value="Teacher">Profesor</option>
                  <option value="Academy">Academia</option>
                </select>
              </div>
              <div className="mb-4">
                <Label htmlFor="institutionId">Institución</Label>
                <select
                  id="institutionId"
                  value={formData.institutionId}
                  onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione una institución</option>
                  {institutions.map((inst) => (
                    <option key={inst._id || inst.id} value={inst._id || inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <Label htmlFor="password">
                  {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                </Label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingUser}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                    setFormData({
                      name: '',
                      email: '',
                      role: 'Student',
                      institutionId: '',
                      password: ''
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para cargar usuarios masivamente */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cargar Usuarios desde Excel</h2>
            <div className="mb-4">
              <Label htmlFor="file">Seleccionar archivo Excel</Label>
              <input
                type="file"
                id="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                El archivo debe contener columnas: Nombre completo, Email, Rol
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleBulkUpload}
                disabled={!selectedFile}
                className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
              >
                Cargar Usuarios
              </Button>
              <Button
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 