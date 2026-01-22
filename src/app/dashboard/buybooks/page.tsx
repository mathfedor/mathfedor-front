'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Module, moduleService } from '@/services/module.service';
import Image from 'next/image';
import { authService } from '@/services/auth.service';

export default function BuyBooksPage() {
    const router = useRouter();
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }

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
    }, [router]);

    const handleModuleClick = (moduleId: string) => {
        router.push(`/dashboard/buybooks/${moduleId}`);
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
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
                                        <span className="text-3xl font-bold text-orange-500">
                                            ${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
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
        </div>
    );
}
