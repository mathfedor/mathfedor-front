'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

import { authService } from '@/services/auth.service';
import GoogleAuthHelpModal from '@/components/GoogleAuthHelpModal';

// Tipos para Google Identity
interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
    }) => void;
    prompt: () => void;
    renderButton: (element: HTMLElement | null, options: {
      theme?: string;
      size?: string;
      type?: string;
      text?: string;
      shape?: string;
      logo_alignment?: string;
    }) => void;
  };
}

const MySwal = withReactContent(Swal)

// Declaración global para Google Identity
declare global {
  interface Window {
    google: {
      accounts: GoogleAccounts;
    };
  }
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams?.get('registered');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  const [googleWindow, setGoogleWindow] = useState<Window | null>(null);
  const [googleAuthStatus, setGoogleAuthStatus] = useState<'idle' | 'opening' | 'authenticating' | 'success' | 'error'>('idle');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          // Obtener el parámetro de redirección de la URL
          const redirectPath = searchParams?.get('redirect');

          // Si hay una ruta de redirección, usarla; de lo contrario, ir al dashboard
          router.replace(redirectPath || '/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Si hay error verificando la autenticación, limpiar cualquier token corrupto
        authService.logout();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [router, searchParams]);

  useEffect(() => {
    if (registered === 'true') {
      setShowRegisteredMessage(true);
      // Limpiar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setShowRegisteredMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [registered]);

  // Verificar si la ventana de Google se cerró y escuchar mensajes
  useEffect(() => {
    if (googleWindow) {
      const checkWindow = setInterval(() => {
        if (googleWindow.closed) {
          setGoogleWindow(null);
          setGoogleAuthStatus('idle');
          clearInterval(checkWindow);
        }
      }, 1000);

      return () => clearInterval(checkWindow);
    }
  }, [googleWindow]);

  // Escuchar mensajes de la ventana de callback
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        setGoogleAuthStatus('success');

        // Obtener el parámetro de redirección de la URL
        const redirectPath = searchParams?.get('redirect');

        // Si hay una ruta de redirección, usarla; de lo contrario, ir al dashboard
        router.replace(redirectPath || '/dashboard');
      }
    };

    const isRedirectPath = searchParams?.get('redirect');
    if (isRedirectPath) {
      MySwal.fire({
        icon: "info",
        title: "Estás a un paso de comprar",
        html: "<b>Si no tienes una cuenta</b> puedes crearla en: <br/> <i>Crea una cuenta nueva</i>.",
        showConfirmButton: false,
        timer: 4000
      });
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [searchParams, router]);

  const handleGoogleSignInPopup = useCallback(() => {
    setGoogleAuthStatus('opening');
    setError('');

    // Construir la URL de autenticación de Google
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/callback/google`;
    const scope = 'email profile';
    const responseType = 'code';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;

    const popup = window.open(
      googleAuthUrl,
      'googleAuth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    if (popup) {
      setGoogleWindow(popup);
    } else {
      setError('No se pudo abrir la ventana de autenticación. Verifica que los bloqueadores de popups estén deshabilitados.');
      setGoogleAuthStatus('error');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let recaptchaToken = '';
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('login');
      }

      const result = await authService.login({
        email: formData.email,
        password: formData.password,
        recaptchaToken
      });

      if (!result.ok) {
        setError(result.message || 'Error al iniciar sesión');
        return;
      }

      // Obtener el parámetro de redirección de la URL
      const redirectPath = searchParams?.get('redirect');

      // Si hay una ruta de redirección, usarla; de lo contrario, ir al dashboard
      router.replace(redirectPath || '/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isCheckingAuth) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a href="/registro" className="text-lg font-medium text-orange-600 hover:text-orange-500">
              crea una cuenta nueva
            </a>
          </p>
        </div>

        {showRegisteredMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  ¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                checked={formData.remember}
                onChange={handleInputChange}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="/recuperar-password" className="font-medium text-orange-600 hover:text-orange-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignInPopup}
                disabled={googleAuthStatus === 'opening' || googleAuthStatus === 'authenticating'}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleAuthStatus === 'opening' || googleAuthStatus === 'authenticating' ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                  </div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#00A1F1" d="M23.5 12.5c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.112 23.454 23.5 18.49 23.5 12.5z" />
                </svg>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M0 0h11.5v11.5H0z" />
                  <path fill="#7FBA00" d="M12.5 0H24v11.5H12.5z" />
                  <path fill="#00A4EF" d="M0 12.5h11.5V24H0z" />
                  <path fill="#FFB900" d="M12.5 12.5H24V24H12.5z" />
                </svg>
              </button>
            </div>


          </div>
        </form>
      </div>

      <GoogleAuthHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        onRetry={handleGoogleSignInPopup}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cargando...
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginFormContent />
    </Suspense>
  );
} 