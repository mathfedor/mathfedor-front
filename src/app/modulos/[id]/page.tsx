'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { moduleService, Module } from '@/services/module.service';
import { authService } from '@/services/auth.service';
import Image from 'next/image';
import Footer from "@/components/Footer";

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const modules = await moduleService.getAllModules();
        const foundModule = modules.find(m => m._id === id);
        if (foundModule) {
          setModule(foundModule);
        } else {
          setError('Módulo no encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el módulo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  const handleBuyClick = () => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      // Redirigir al login con el parámetro de redirección
      router.push(`/login?redirect=/dashboard/buybooks/${id}`);
    } else {
      // Si está autenticado, redirigir directamente a la página de compra
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
          <p>{error || 'Módulo no encontrado'}</p>
        </div>
      </div>
    );
  }

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
                      <span className="text-8xl text-orange-500">📚</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
                
                {/* Precio y botón de comprar movidos arriba */}
                <div className="border-b pb-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-orange-500">${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
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
                    <span className="font-semibold">Objetivos:</span>
                    <ul className="list-disc list-inside space-y-2">
                      {module.tags && module.tags.length > 0 ? (
                        module.tags.map((tag, index) => (
                          <li key={index} className="text-gray-600">{tag}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No hay objetivos definidos</li>
                      )}
                    </ul>
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