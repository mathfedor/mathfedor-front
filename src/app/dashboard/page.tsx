'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
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
        <div className="flex-1 bg-gradient-to-br from-orange-50 via-white to-blue-50">
          <div className="p-8">
            {/* Modern Welcome Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 rounded-3xl shadow-2xl mb-8">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute top-20 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white rounded-full translate-y-12"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 px-8 py-12 md:px-12 md:py-16">
                <div className="max-w-4xl">
                  {/* Greeting based on time */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">
                      {(() => {
                        const hour = new Date().getHours();
                        if (hour < 12) return '🌅';
                        if (hour < 18) return '☀️';
                        return '🌙';
                      })()}
                    </div>
                    <p className="text-white/90 text-lg font-medium">
                      {(() => {
                        const hour = new Date().getHours();
                        if (hour < 12) return 'Buenos días';
                        if (hour < 18) return 'Buenas tardes';
                        return 'Buenas noches';
                      })()}
                    </p>
                  </div>

                  {/* Main Welcome Message */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    ¡Bienvenido de vuelta,
                    <br />
                    <span className="text-yellow-200">{user.name}!</span>
                  </h1>

                  {/* Role-specific message */}
                  <div className="mb-8">
                    {user.role === 'Student' && (
                      <p className="text-white/90 text-xl md:text-2xl leading-relaxed">
                        Estás a un paso más cerca de dominar las matemáticas. 
                        <br className="hidden md:block" />
                        ¡Continúa tu viaje de aprendizaje con el Método Fedor! 🚀
                      </p>
                    )}
                    {user.role === 'Teacher' && (
                      <p className="text-white/90 text-xl md:text-2xl leading-relaxed">
                        Inspira y guía a tus estudiantes hacia el éxito matemático.
                        <br className="hidden md:block" />
                        ¡Tu dedicación hace la diferencia! 👨‍🏫
                      </p>
                    )}
                    {user.role === 'Admin' && (
                      <p className="text-white/90 text-xl md:text-2xl leading-relaxed">
                        Gestiona y supervisa la plataforma educativa.
                        <br className="hidden md:block" />
                        ¡Tu trabajo mantiene todo funcionando perfectamente! ⚙️
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user.role === 'Student' && (
                      <button 
                        onClick={() => router.push('/dashboard/downloads')}
                        className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Mis Descargas
                      </button>
                    )}
                    {user.role === 'Teacher' && (
                      <>
                        <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          Ver Estudiantes
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Reportes
                        </button>
                      </>
                    )}
                    {user.role === 'Admin' && (
                      <>
                        <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          Gestionar Usuarios
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Configuración
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats or Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Progreso</h3>
                    <p className="text-gray-600 text-sm">Tu avance académico</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Recursos</h3>
                    <p className="text-gray-600 text-sm">Material de estudio</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Logros</h3>
                    <p className="text-gray-600 text-sm">Metas alcanzadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 