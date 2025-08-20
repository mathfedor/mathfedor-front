'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { institutionService, CreateInstitutionData } from '@/services/institution.service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from '@/types/auth.types';
import { Institution, Location } from '@/types/institution.types';

export default function InstitutionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  // Estado del formulario de creación
  const [formData, setFormData] = useState({
    name: '',
    type: 'Universidad' as Institution['type'],
    city: '',
    region: '',
    address: '',
    email: ''
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

        // Verificar que el usuario sea administrador
        if (userData.role !== 'Admin') {
          setError('No tienes permisos para acceder a esta página');
          setLoading(false);
          return;
        }

        setUser(userData);
        // Cargar instituciones desde el backend
        loadInstitutions();
      } catch (error) {
        console.error('Error detallado:', error);
        setError(error instanceof Error ? error.message : 'Error al obtener datos del usuario');
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadInstitutions = async () => {
    setLoadingInstitutions(true);
    try {
      const response = await institutionService.getInstitutions('active');
      
      if (response.success) {
        // Mapear los datos del backend al formato de la UI
        const institutionsData = response.data.map((institution: {
          id: string;
          name: string;
          type: Institution['type'];
          location: {
            city: string;
            region: string;
            address: string;
          };
          email: string;
          createdAt: string;
          status: string;
        }) => ({
          id: institution.id,
          name: institution.name,
          type: institution.type,
          location: {
            city: institution.location.city,
            region: institution.location.region,
            address: institution.location.address
          },
          email: institution.email,
          createdAt: institution.createdAt,
          status: institution.status
        }));
        
        setInstitutions(institutionsData);
      } else {
        console.error('Error al cargar instituciones:', response.message);
      }
    } catch (error) {
      console.error('Error al cargar instituciones:', error);
      
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      // Preparar los datos para el servicio
      const institutionData: CreateInstitutionData = {
        name: formData.name,
        type: formData.type,
        location: {
          city: formData.city,
          region: formData.region,
          address: formData.address
        },
        email: formData.email,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      // Llamar al servicio
      const response = await institutionService.createInstitution(institutionData);

      if (response.success) {
        setSubmitMessage({
          type: 'success',
          message: response.message
        });

        // Crear el objeto location para la UI local
        const location: Location = {
          city: formData.city,
          region: formData.region,
          address: formData.address
        };

        // Crear la nueva institución para la UI (usando los datos del backend si están disponibles)
        const newInstitution: Institution = {
          id: response.data?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: formData.name,
          type: formData.type,
          location: location,
          email: formData.email,
          createdAt: response.data?.createdAt || new Date().toISOString().split('T')[0],
          status: response.data?.status || 'active'
        };

        setInstitutions([...institutions, newInstitution]);
        setShowCreateForm(false);

        // Limpiar formulario
        setFormData({
          name: '',
          type: 'Universidad',
          city: '',
          region: '',
          address: '',
          email: ''
        });
      } else {
        setSubmitMessage({
          type: 'error',
          message: response.message
        });
      }
    } catch {
      setSubmitMessage({
        type: 'error',
        message: 'Error inesperado al crear la institución'
      });
    } finally {
      setSubmitting(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Instituciones</h1>
              <p className="mt-1 text-sm text-gray-500">
                Administra las instituciones del sistema
              </p>
            </div>

            {/* Botón de acción */}
            <div className="mb-6">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Crear Institución
              </Button>
            </div>

            {/* Tabla de instituciones */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loadingInstitutions ? (
                <div className="p-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Cargando instituciones...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Institución
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha de Creación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {institutions.map((institution, index) => (
                        <tr key={`${institution.id}-${index}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-700">
                                    {institution.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {institution.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${institution.type === 'Universidad'
                                ? 'bg-purple-100 text-purple-800'
                                : institution.type === 'Colegio'
                                  ? 'bg-blue-100 text-blue-800'
                                  : institution.type === 'Escuela'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-orange-100 text-orange-800'
                              }`}>
                              {institution.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">{institution.location.city}</div>
                              <div className="text-gray-500">{institution.location.region}</div>
                              <div className="text-xs text-gray-400">{institution.location.address}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {institution.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${institution.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {institution.status === 'active' ? 'Activa' : 'Inactiva'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {institution.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear institución */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Institución</h2>

            {/* Mensaje de estado */}
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                {submitMessage.message}
              </div>
            )}

            <form onSubmit={handleCreateInstitution}>
              <div className="mb-4">
                <Label htmlFor="name">Nombre de la Institución</Label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="type">Tipo de Institución</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Institution['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                >
                  <option value="Universidad">Universidad</option>
                  <option value="Colegio">Colegio</option>
                  <option value="Escuela">Escuela</option>
                  <option value="Tecnico">Técnico</option>
                </select>
              </div>
              <div className="mb-4">
                <Label htmlFor="city">Ciudad</Label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="region">Departamento/Región</Label>
                <input
                  type="text"
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="address">Dirección</Label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-6">
                <Label htmlFor="email">Email</Label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={submitting}
                >
                  {submitting ? 'Creando...' : 'Crear Institución'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 