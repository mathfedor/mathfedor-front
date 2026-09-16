'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import Footer from '@/components/Footer';
import { authService } from '@/services/auth.service';

export default function HomePage() {
  const t = useTranslations('home');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        if (authService.isAuthenticated()) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    }
  }, [router, isClient]);

  return (
    <div className="min-h-screen">
      {/* Hero Section con video de fondo y texto superpuesto */}
      <section className="relative h-[600px] bg-blue-600 w-full overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/fedor-descargas.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-blue-600 bg-opacity-60"></div>

        {/* Contenido superpuesto */}
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Texto principal */}
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {t('hero.title_line1')}
                  <br />
                  <span className="text-orange-300">{t('hero.title_highlight')}</span>
                  <br />
                  {t('hero.title_line2')}
                </h1>
                <Link
                  href="/books"
                  className="inline-block bg-orange-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-lg text-lg"
                >
                  {t('hero.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de descripción */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-bold text-justify">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 text-center">
            {/* Tecnología interactiva */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('features.interactive_tech_title')}</h3>
              <p className="text-gray-600">
                {t('features.interactive_tech_desc')}
              </p>
            </div>

            {/* Currículo inclusivo */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('features.inclusive_curriculum_title')}</h3>
              <p className="text-gray-600">
                {t('features.inclusive_curriculum_desc')}
              </p>
            </div>

            {/* Autonomía y confianza */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('features.confidence_title')}</h3>
              <p className="text-gray-600">
                {t('features.confidence_desc')}
              </p>
            </div>

            {/* Preparación Pre-ICFES */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('features.preicfes_title')}</h3>
              <p className="text-gray-600">
                {t('features.preicfes_desc')}
              </p>
            </div>

            {/* Éxito Pre-Universitario */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('features.preuni_title')}</h3>
              <p className="text-gray-600">
                {t('features.preuni_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de oferta especial */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('special_offer.title')}
          </h2>
          <Link
            href="/books"
            className="inline-block bg-white text-orange-500 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg text-lg"
          >
            {t('special_offer.cta')}
          </Link>
        </div>
      </section>

      {/* Sección de opciones de compra */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Compra por código */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{t('options.code_title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('options.code_desc')}
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  {t('options.code_btn')}
                </Link>
              </div>
            </div>

            {/* Compra directa */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{t('options.direct_title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('options.direct_desc')}
                </p>
                <Link
                  href="/books"
                  className="inline-block bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  {t('options.direct_btn')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de testimonio */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
              <Image
                src="/testimonio-estudiante.jpg"
                alt="Ana - Estudiante satisfecha"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {t('testimonial.quote')}
              </p>
              <p className="text-gray-600">{t('testimonial.author')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}