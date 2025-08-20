'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { adminSimulatorService, AdminSimulatorData } from '@/services/adminsimulator.service';
import { User } from '@/types/auth.types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AdminSimulatorPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<AdminSimulatorData>({
    title: '',
    description: '',
    createdBy: '',
    price: 0,
    status: 'Active',
    file: null,
  });

  useEffect(() => {
    const checkAuthAndRole = () => {
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

        // Verificar que el usuario tenga rol de Admin
        if (userData.role !== 'Admin') {
          setError('No tienes permisos para acceder a esta página');
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error('Error detallado:', error);
        setError(error instanceof Error ? error.message : 'Error al obtener datos del usuario');
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndRole();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar que sea un archivo Excel
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xls',
        '.xlsx'
      ];
      
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const isValidType = allowedTypes.includes(file.type) || 
                         (fileExtension && allowedTypes.includes(`.${fileExtension}`));

      if (!isValidType) {
        setSubmitMessage({
          type: 'error',
          message: 'Por favor, selecciona un archivo Excel válido (.xls o .xlsx)'
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }));
      
      // Limpiar mensaje de error si había uno
      if (submitMessage?.type === 'error') {
        setSubmitMessage(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.title.trim()) {
      setSubmitMessage({
        type: 'error',
        message: 'El título es obligatorio'
      });
      return;
    }

    if (!formData.description.trim()) {
      setSubmitMessage({
        type: 'error',
        message: 'La descripción es obligatoria'
      });
      return;
    }

    if (!formData.file) {
      setSubmitMessage({
        type: 'error',
        message: 'Debes seleccionar un archivo Excel'
      });
      return;
    }

    if (!user) {
      setSubmitMessage({
        type: 'error',
        message: 'No se encontró información del usuario'
      });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await adminSimulatorService.createSimulator({
        ...formData,
        createdBy: user.id
      });
      
      if (response.success) {
        setSubmitMessage({
          type: 'success',
          message: response.message
        });
        
        // Limpiar formulario
        setFormData({
          title: '',
          description: '',
          createdBy: '',
          price: 0,
          status: 'Active',
          file: null,
        });
        
        // Limpiar el input de archivo
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        setSubmitMessage({
          type: 'error',
          message: response.message
        });
      }
    } catch {
      setSubmitMessage({
        type: 'error',
        message: 'Error inesperado al guardar el simulador'
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
              <h1 className="text-2xl font-bold text-gray-900">Simulador de Administrador</h1>
              <p className="mt-1 text-sm text-gray-500">
                Crear nuevo simulador - Bienvenido, {user.name} {user.lastName}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Crear Nuevo Simulador</h2>
              
              {/* Mensaje de estado */}
              {submitMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {submitMessage.message}
                </div>
              )}

              <div className="max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campo Título */}
                  <div>
                    <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </Label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingresa el título del simulador"
                      required
                    />
                  </div>

                  {/* Campo Descripción */}
                  <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe el simulador..."
                      required
                    />
                  </div>

                  {/* Campo Plantilla de Simulación */}
                  <div>
                    <Label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                      Plantilla de Simulación (Excel) *
                    </Label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Formatos aceptados: .xls, .xlsx
                    </p>
                  </div>

                  {/* Botón Guardar */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 