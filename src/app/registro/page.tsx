'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import Footer from "@/components/Footer";
import { usersService } from '@/services/users.service';
import { AxiosError } from 'axios';

const LEGAL_DOCUMENT_VERSIONS = {
  terms: '1.0',
  privacyPolicy: '1.0'
};

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [commercialCommunicationsAccepted, setCommercialCommunicationsAccepted] = useState(false);

  const canSubmit = termsAccepted && ageVerified && !isLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!termsAccepted || !ageVerified) {
      setSubmitError('Debes aceptar los términos y confirmar que eres mayor de 18 años.');
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      let recaptchaToken = '';
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('register');
      }

      await usersService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rol: 'Student', // Por defecto todos los usuarios nuevos son estudiantes
        recaptchaToken,
        legalConsents: {
          termsAndPrivacyAccepted: termsAccepted,
          termsVersion: LEGAL_DOCUMENT_VERSIONS.terms,
          privacyPolicyVersion: LEGAL_DOCUMENT_VERSIONS.privacyPolicy,
          commercialCommunicationsAccepted,
          commercialCommunicationsAcceptedAt: commercialCommunicationsAccepted ? new Date().toISOString() : null
        }
      });

      // Registro exitoso
      router.push('/login?registered=true');

    } catch (error) {
      let message = 'Ocurrió un error al registrar el usuario';

      if (error instanceof AxiosError) {
        message = (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setSubmitError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Crea tu cuenta</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              O{' '}
              <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
                inicia sesión si ya tienes una cuenta
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Nombre completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-4 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm`}
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-4 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm`}
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-4 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm`}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Checkboxes de aceptación */}
            <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4">
              <label className="flex items-start gap-3 cursor-pointer group" htmlFor="terms-checkbox">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 leading-snug">
                  Acepto los{' '}
                  <Link href="/legal/terminos-y-condiciones" target="_blank" className="font-medium text-orange-600 hover:text-orange-500 underline">
                    Términos y Condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link href="/legal/politica-privacidad" target="_blank" className="font-medium text-orange-600 hover:text-orange-500 underline">
                    Política de Privacidad
                  </Link>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group" htmlFor="age-checkbox">
                <input
                  id="age-checkbox"
                  type="checkbox"
                  checked={ageVerified}
                  onChange={(e) => setAgeVerified(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 leading-snug">
                  Confirmo que soy mayor de 18 años de edad.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group" htmlFor="commercial-checkbox">
                <input
                  id="commercial-checkbox"
                  type="checkbox"
                  checked={commercialCommunicationsAccepted}
                  onChange={(e) => setCommercialCommunicationsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 leading-snug">
                  (Opcional) Acepto recibir comunicaciones comerciales, promociones y novedades sobre los servicios.
                </span>
              </label>
            </div>

            {submitError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                  canSubmit
                    ? 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className={`h-5 w-5 ${canSubmit ? 'text-orange-500 group-hover:text-orange-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">O regístrate con</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled={!canSubmit}
                className={`inline-flex items-center gap-3 py-2.5 px-6 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                  canSubmit
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill={canSubmit ? "#4285F4" : "#9CA3AF"} />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={canSubmit ? "#34A853" : "#9CA3AF"} />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={canSubmit ? "#FBBC05" : "#9CA3AF"} />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={canSubmit ? "#EA4335" : "#9CA3AF"} />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
 