'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Footer from "@/components/Footer";
import { Module, moduleService } from '@/services/module.service';
import Image from 'next/image';

export default function ModulosPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('books.modules_list');
  const tBooks = useTranslations('books');
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await moduleService.getAllModules(locale);
        setModules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('load_error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, [locale, t]);

  const handleModuleClick = (moduleId: string) => {
    router.push(`/modulos/${moduleId}`);
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
    <div className="min-h-screen bg-gray-50">
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center mt-16">{t('title')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {modules.map((module) => (
              <div 
                key={module._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleModuleClick(module._id)}
              >
                <div className="h-64 relative">
                  {module.image ? (
                    <Image
                      src={module.image.startsWith('/') ? module.image : `/${module.image}`}
                      alt={module.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="h-full bg-orange-100 flex items-center justify-center">
                      <span className="text-6xl text-orange-500">📚</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {module.group && tBooks.has(`modules_content.${module.group}.title`)
                      ? tBooks(`modules_content.${module.group}.title`)
                      : module.title}
                  </h2>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-semibold">${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                      {t('view_details')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
