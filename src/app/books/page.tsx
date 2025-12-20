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
        setModules(data);
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
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Domina las Matemáticas con el
                <span className="text-orange-500"> Método Fedor</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Prepárate para la universidad y desarrolla tu pensamiento lógico con nuestros módulos especializados
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={scrollToModules}
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Ver Módulos
                </button>
                <a
                  href="/login"
                  rel="noopener noreferrer"
                  className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all"
                >
                  Iniciar Ahora
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">1000+</div>
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
                    &ldquo;Gracias al Método Fedor mejoré mi puntaje en el ICFES y logré ingresar a la universidad de mis sueños.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">- María González</p>
                  <p className="text-sm text-gray-500">Estudiante de Ingeniería</p>
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
                    &ldquo;Las matemáticas siempre fueron mi punto débil, pero con Fedor todo cambió. Ahora las disfruto.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">- Carlos Ramírez</p>
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
                    &ldquo;El método es claro y efectivo. Pasé de tener miedo a las matemáticas a ser el mejor de mi clase.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">- Ana Martínez</p>
                  <p className="text-sm text-gray-500">Estudiante Pre-Universitaria</p>
                </div>
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
              Elige el módulo perfecto para tus necesidades
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
                        <span className="text-3xl font-bold text-orange-500">
                          ${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">COP</span>
                      </div>
                      <button className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                href="/login"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition-all"
              >
                Iniciar Ahora
              </a>
            </div>
          </div>
        </section>

        {/* WhatsApp Floating Button 
        <a
          href="https://wa.me/573227496445?text=Hola%20amigos%20de%20Fedor%2C%20quisiera%20información%20sobre%20los%20módulos."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:scale-110 z-50"
          aria-label="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z" />
          </svg>
        </a>*/}
      </div>
      
      <Footer />
    </>
  );
}
