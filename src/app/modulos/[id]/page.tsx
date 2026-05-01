'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { moduleService, Module } from '@/services/module.service';
import { authService } from '@/services/auth.service';
import Image from 'next/image';
import Footer from "@/components/Footer";

const primaryStandardsPdf = '/PrimariaPENSAMINETOSEST%C3%81NDARESCOMPETENCIASDBAYNIVELESDEDESEMPE%C3%91O.pdf';
const secondaryStandardsPdf = '/BachilleratoPENSAMINETOSEST%C3%81NDARESCOMPETENCIASDBAYNIVELESDEDESEMPE%C3%91O.pdf';

const getGradeNumber = (group?: string) => {
  const match = group?.match(/Grado(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const getStandardsPdfByGroup = (group?: string) => {
  const gradeNumber = getGradeNumber(group);

  if (gradeNumber && gradeNumber >= 1 && gradeNumber <= 5) {
    return primaryStandardsPdf;
  }

  if (gradeNumber && gradeNumber >= 6 && gradeNumber <= 12) {
    return secondaryStandardsPdf;
  }

  return null;
};

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const modules = await moduleService.getAllModules();
        const foundModule = modules.find((m) => m._id === id);

        if (foundModule) {
          setModule(foundModule);
        } else {
          setError('Modulo no encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el modulo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  const handleBuyClick = () => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/dashboard/buybooks/${id}`);
    } else {
      router.push(`/dashboard/buybooks/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error || 'Modulo no encontrado'}</p>
        </div>
      </div>
    );
  }

  const standardsPdf = getStandardsPdfByGroup(module.group);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-16">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-[600px] relative">
                  {module.image ? (
                    <Image
                      src={module.image.startsWith('/') ? module.image : `/${module.image}`}
                      alt={module.title}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="h-full bg-orange-100 flex items-center justify-center">
                      <span className="text-8xl text-orange-500">Libro</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <h1 className="text-4xl font-bold mb-4">{module.title}</h1>

                <div className="border-b pb-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      {new Date() < new Date('2026-05-31') ? (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            ${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-3xl font-bold text-orange-500">
                            ${((module.price || 0) * 0.5).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-orange-500">
                          ${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleBuyClick}
                      className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold"
                    >
                      Comprar
                    </button>
                  </div>
                </div>

                <div
                  className="text-gray-600 mb-6 whitespace-pre-line prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: module.description.replace(/\n/g, '<br/>') }}
                />

                <div className="space-y-4 mb-8">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">Estandares basicos de competencia:</span>
                    <ul className="list-disc list-inside space-y-2">
                      {module.tags && module.tags.length > 0 ? (
                        module.tags.slice(0, 3).map((tag, index) => (
                          <li key={index} className="text-gray-600">{tag}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No hay estandares basicos de competencia definidos</li>
                      )}
                    </ul>

                    {standardsPdf && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowPdf((current) => !current)}
                          className="inline-flex rounded-lg transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                          aria-label={showPdf ? 'Ocultar PDF de estandares y competencias' : 'Mostrar PDF de estandares y competencias'}
                        >
                          <Image
                            src="/estandares-competencias.png"
                            alt="Estandares y competencias"
                            width={260}
                            height={72}
                            className="h-auto w-auto max-w-full object-contain"
                          />
                        </button>

                        {showPdf && (
                          <div className="mt-4 w-full h-[600px] overflow-hidden rounded-lg border shadow-sm">
                            <iframe
                              src={standardsPdf}
                              className="h-full w-full"
                              title="Estandares y competencias"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
