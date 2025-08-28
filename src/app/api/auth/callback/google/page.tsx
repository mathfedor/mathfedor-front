'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener el código de autorización de la URL
        const code = searchParams?.get('code');
        const error = searchParams?.get('error');
        
        if (error) {
          setStatus('error');
          setMessage(`Error de autenticación: ${error}`);
          return;
        }
        
        if (!code) {
          setStatus('error');
          setMessage('No se recibió el código de autorización');
          return;
        }

        // Procesar el código con el servicio de autenticación
        const result = await authService.socialLogin('google', code);
        
        if (!result.ok) {
          setStatus('error');
          setMessage(result.message || 'Error en la autenticación');
          return;
        }

        setStatus('success');
        setMessage('¡Autenticación exitosa! Redirigiendo...');

        // Enviar mensaje a la ventana principal y cerrar esta ventana
        if (window.opener) {
          // Enviar mensaje a la ventana principal
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token: result.token }, window.location.origin);
          
          // Cerrar esta ventana después de un breve delay
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // Si no hay ventana principal, redirigir directamente
          router.replace('/dashboard');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error inesperado durante la autenticación');
        console.error('Error en callback de Google:', error);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-900">Procesando autenticación</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">¡Autenticación exitosa!</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Error de autenticación</h2>
              <p className="text-gray-600">{message}</p>
              <button
                onClick={() => window.close()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cerrar ventana
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-900">Cargando...</h2>
            <p className="text-gray-600">Preparando autenticación</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
