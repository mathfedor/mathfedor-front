'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";
import { Module, moduleService } from '@/services/module.service';
import Image from 'next/image';

export default function BooksPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await moduleService.getAllModules();
        // Ordenar módulos por la propiedad group (Grado1, Grado2, Grado3, etc.)
        const sortedModules = data.sort((a, b) => {
          // Extraer el número del grado para ordenar correctamente
          const getGradeNumber = (group: string) => {
            const match = group?.match(/Grado(\d+)/);
            return match ? parseInt(match[1]) : 999; // Si no tiene formato Grado#, va al final
          };

          const gradeA = getGradeNumber(a.group || '');
          const gradeB = getGradeNumber(b.group || '');

          return gradeA - gradeB;
        });
        setModules(sortedModules);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los módulos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const handleModuleClick = (moduleId: string) => {
    router.push(`/modulos/${moduleId}`);
  };

  const scrollToModules = () => {
    const modulesSection = document.getElementById('modulos-section');
    modulesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section con imagen de fondo */}
        <section className="relative h-[600px] w-full overflow-hidden">
          <Image
            src="/home-image.png"
            alt="Aprende matemáticas a tu ritmo con la tecnología del futuro"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>

          {/* Contenido superpuesto */}
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Texto principal */}
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Aprende matemáticas
                    <br />
                    <span className="text-orange-300">a tu ritmo con</span>
                    <br />
                    la tecnología
                    <br />
                    del futuro
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={scrollToModules}
                      className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Ver Módulos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de descripción */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-bold text-justify">
              Prepárate para la primaria, el bachillerato y la universidad, fortaleciendo tu pensamiento lógico con nuestros módulos especializados.
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
                <h3 className="text-xl font-bold mb-3 text-gray-900">Tecnología interactiva</h3>
                <p className="text-gray-600">
                  Aprende con recursos
                  <br />
                  digitales modernos
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
                <h3 className="text-xl font-bold mb-3 text-gray-900">Currículo inclusivo</h3>
                <p className="text-gray-600">
                  Adaptado a todos los
                  <br />
                  niveles y estilos de
                  <br />
                  aprendizaje
                </p>
              </div>

              {/* Autonomía y confianza */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Autonomía y confianza</h3>
                <p className="text-gray-600">
                  Eleva tu autoestima
                  <br />
                  aprendiendo a tu ritmo
                </p>
              </div>

              {/* Preparación Pre-ICFES */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Preparación Pre-ICFES</h3>
                <p className="text-gray-600">
                  Obtén puntajes
                  <br />
                  sobresalientes en las
                  <br />
                  pruebas ICFES
                </p>
              </div>

              {/* Éxito Pre-Universitario */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Éxito Pre-Universitario</h3>
                <p className="text-gray-600">
                  Ingresa con confianza
                  <br />
                  a la universidad y
                  <br />
                  destaca desde el inicio
                </p>
              </div>
            </div>

            {/* Segunda fila de beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center mt-16">
              {/* Refuerzo académico */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Refuerzo académico</h3>
                <p className="text-gray-600">
                  Refuerza temas que no
                  <br />
                  quedaron claros en clase
                </p>
              </div>

              {/* Preparación para exámenes */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Preparación efectiva</h3>
                <p className="text-gray-600">
                  Prepárate para exámenes
                  <br />
                  y evaluaciones
                </p>
              </div>

              {/* Recuperación de confianza */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Recupera confianza</h3>
                <p className="text-gray-600">
                  Recupera la confianza
                  <br />
                  en matemáticas
                </p>
              </div>

              {/* Aprendizaje acelerado */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Aprendizaje acelerado</h3>
                <p className="text-gray-600">
                  Avanza más rápido
                  <br />
                  que el colegio
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de oferta especial */}
        <section className="py-16 bg-orange-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¡Oferta exclusiva! <br />
              Obtén Matemáticas de Fedor con un 50% de descuento por lanzamiento.
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Disponible solo hasta agotar existencias.
            </p>
            <button
              onClick={scrollToModules}
              className="bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Aprovechar Ahora
            </button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Historias reales de éxito con el Método Fedor
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial Video 1 - Reemplaza con tus URLs de YouTube */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/Iiw2-N9Fz8Q"
                    title="Testimonio 1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 italic mb-3">
                    &ldquo;Se creó el Método Fedor para aprender matemáticas de una manera más fácil y divertida.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">- María de los Ángeles Restrepo</p>
                  <p className="text-sm text-gray-500">Entrevista NOTI5</p>
                </div>
              </div>

              {/* Testimonial Video 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/eXVH_9SXozk"
                    title="Testimonio 2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 italic mb-3">
                    &ldquo;El método no sólo me ayudó con el grado que cursaba, sino también a mejorar el rendimiento académico y a entender materias como física y trigonometría.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">- Sofia Caballero</p>
                  <p className="text-sm text-gray-500">Estudiante de Bachillerato</p>
                </div>
              </div>

              {/* Testimonial Video 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/V93aEMyZF9E"
                    title="Testimonio 3"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 italic mb-3">
                    &ldquo;El método me llevó a ser uno de los mejores ICFES de Cali, dado que me permitió tener más razonamiento y perfeccionar procedimientos.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">- Ana Martínez</p>
                  <p className="text-sm text-gray-500">Estudiante Pre-Universitaria</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">10.000+</div>
                <div className="text-xl">Estudiantes Satisfechos</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">95%</div>
                <div className="text-xl">Tasa de Aprobación</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">4.9/5</div>
                <div className="text-xl">Calificación Promedio</div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modulos-section" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Nuestros Módulos de Aprendizaje
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Elige el módulo perfecto para tus necesidades y compra de forma segura.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module) => (
                <div
                  key={module._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border border-gray-100"
                  onClick={() => handleModuleClick(module._id)}
                >
                  <div className="h-64 relative bg-gradient-to-br from-orange-50 to-white">
                    {module.image ? (
                      <Image
                        src={module.image.startsWith('/') ? module.image : `/${module.image}`}
                        alt={`${module.title} - Método Fedor`}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-6xl text-orange-500">📚</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{module.title}</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        {new Date() < new Date('2026-05-31') ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500 line-through">
                              ${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-3xl font-bold text-orange-500">
                              ${((module.price || 0) * 0.5).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-3xl font-bold text-orange-500">
                            ${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        )}
                        <span className="text-gray-500 text-sm ml-2">COP</span>
                      </div>
                      <button className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                        Comprar Ahora
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Educación Internacional Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Educación Internacional para Hispanohablantes
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nuestro método trasciende fronteras, ofreciendo una educación matemática de calidad mundial
                adaptada específicamente para la comunidad hispanohablante
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Alcance Global */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Alcance Global</h3>
                <p className="text-gray-600 text-center">
                  Disponible para estudiantes hispanohablantes en todo el mundo,
                  desde España hasta Latinoamérica y Estados Unidos
                </p>
              </div>

              {/* Estándares Internacionales */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Estándares Internacionales</h3>
                <p className="text-gray-600 text-center">
                  Cumple con los más altos estándares educativos internacionales,
                  preparando estudiantes para universidades de prestigio mundial
                </p>
              </div>

              {/* Cultura y Contexto */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Cultura y Contexto</h3>
                <p className="text-gray-600 text-center">
                  Respeta y valora la diversidad cultural hispanohablante,
                  integrando ejemplos y contextos familiares para cada región
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-gray-700 mb-6">
                <strong>Únete a la revolución educativa que está transformando el aprendizaje de matemáticas
                  en la comunidad hispanohablante mundial</strong>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span className="bg-white px-4 py-2 rounded-full shadow">co Latam</span>
                <span className="bg-white px-4 py-2 rounded-full shadow">🇪🇸 España</span>
                <span className="bg-white px-4 py-2 rounded-full shadow">🌎 Y más países</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para transformar tu aprendizaje?
            </h2>
            <p className="text-xl mb-8">
              Únete a miles de estudiantes que ya están alcanzando sus metas académicas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToModules}
                className="bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Explorar Módulos
              </button>
              <a
                href="https://wa.me/message/DY5UNLUUUA36J1?text=Hola%20amigos%20de%20Fedor"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition-all"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/message/DY5UNLUUUA36J1?text=Hola%20amigos%20de%20Fedor%2C%20quisiera%20información%20sobre%20los%20módulos."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:scale-110 z-50"
          aria-label="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z" />
          </svg>
        </a>
      </div>

      <Footer />
    </>
  );
}
