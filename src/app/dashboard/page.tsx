'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from '@/types/auth.types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenido, {user.name} {user.lastName}
              </p>
            </div>

            {/* Course grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sección de Progreso de estudiantes - Solo para Teacher */}
              {user.role === 'Teacher' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">Progreso de estudiantes</h3>
                    <p className="mt-1 text-sm text-gray-500">Profesor: {user.name} {user.lastName}</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">60% completado</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="topics">Temas</Label>
                      <Tooltip content="Ver la lista de temas">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Temas
                        </Button>
                      </Tooltip>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                      Ver
                    </button>
                  </div>
                </div>
              )}

              {/* Sección de Mis módulos - Solo para Student */}
              {user.role === 'Student' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">Mis módulos</h3>
                    <p className="mt-1 text-sm text-gray-500">Estudiante: {user.name} {user.lastName}</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">60% completado</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="topics">Temas</Label>
                      <Tooltip content="Ver la lista de temas">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Temas
                        </Button>
                      </Tooltip>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                      Ver
                    </button>
                  </div>
                </div>
              )}

              {/* Sección de Usuarios - Solo para Admin */}
              {user.role === 'Admin' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">Usuarios</h3>
                    <p className="mt-1 text-sm text-gray-500">Administrador: {user.name} {user.lastName}</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">60% completado</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="topics">Temas</Label>
                      <Tooltip content="Ver la lista de temas">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Temas
                        </Button>
                      </Tooltip>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                      Ver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 