'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth.types';

export default function TestGoogleLoginPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const testRedirect = () => {
    router.push('/login?redirect=/dashboard/buybooks/test-module-id');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Prueba de Login con Google
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Estado de Autenticación:</h2>
            <p className="text-sm">
              {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
            </p>
          </div>

          {user && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Usuario:</h2>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Ir a Login
            </button>
            
            <button
              onClick={testRedirect}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Probar Redirección con Módulo
            </button>
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Instrucciones:</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Configura tu Google Client ID en el archivo .env.local</li>
            <li>2. Haz clic en &quot;Ir a Login&quot;</li>
            <li>3. Prueba el botón de Google</li>
            <li>4. Verifica que la redirección funcione correctamente</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
