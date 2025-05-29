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
      <div className="min-h-screen">
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center mt-16">Módulos de Aprendizaje</h1>
            
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
                        className="object-contain"
                      />
                    ) : (
                      <div className="h-full bg-orange-100 flex items-center justify-center">
                        <span className="text-6xl text-orange-500">📚</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-500 font-semibold">${module.price}</span>
                      <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {/* Botón flotante de WhatsApp */}
        <a
          href="https://wa.me/573227496445?text=Hola%20amigos%20de%20Fedor%2C%20quisiera%20información%20sobre%20la%20Plataforma."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-white text-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200 z-50"
          aria-label="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="11" fill="green" stroke="white" strokeWidth="2" />
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z" fill="white"/>
          </svg>
        </a>
        
        <Footer />
      </div>
    );
} 