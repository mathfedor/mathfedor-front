'use client';

import { type MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Module, moduleService } from '@/services/module.service';
import { authService } from '@/services/auth.service';

const moduleBooksImages: Record<string, { src: string; alt: string }> = {
    Grado1: { src: '/fedor-modulo-1-libros.png', alt: 'Libros del módulo 1' },
    Grado2: { src: '/fedor-modulo-2-libros.png', alt: 'Libros del módulo 2' },
    Grado3: { src: '/fedor-modulo-3-libros.png', alt: 'Libros del módulo 3' },
    Grado4: { src: '/fedor-modulo-4-libros.png', alt: 'Libros del módulo 4' },
    Grado5: { src: '/fedor-modulo-5-libros.png', alt: 'Libros del módulo 5' },
    Grado6: { src: '/fedor-modulo-6-libros.png', alt: 'Libros del módulo 6' },
    Grado7: { src: '/fedor-modulo-7-libros.png', alt: 'Libros del módulo 7' },
    Grado10: { src: '/fedor-modulo-10-libros.png', alt: 'Libros del módulo 10' },
    Grado11: { src: '/fedor-modulo-11-libros.png', alt: 'Libros del módulo 11' },
};

export default function BuyBooksPage() {
    const router = useRouter();
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
    const [, setSelectedModule] = useState<Module | null>(null);
    const [isFichaModalOpen, setIsFichaModalOpen] = useState(false);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }

        const fetchModules = async () => {
            try {
                const data = await moduleService.getAllModules();
                const sortedModules = data.sort((a, b) => {
                    const getGradeNumber = (group: string) => {
                        const match = group?.match(/Grado(\d+)/);
                        return match ? parseInt(match[1]) : 999;
                    };

                    return getGradeNumber(a.group || '') - getGradeNumber(b.group || '');
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

    const openBenefitsModal = (event: MouseEvent, module: Module) => {
        event.stopPropagation();
        setSelectedModule(module);
        setIsBenefitsModalOpen(true);
    };

    const openFichaModal = (event: MouseEvent, module: Module) => {
        event.stopPropagation();
        setSelectedModule(module);
        setIsFichaModalOpen(true);
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
            <section id="modulos-section" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
                        Nuestros Módulos de Aprendizaje
                    </h2>
                    <p className="text-center text-gray-600 mb-12 text-lg">
                        Elige el módulo perfecto para tus necesidades y compra de forma segura.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {modules.map((module) => (
                            <div
                                key={module._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border border-gray-100"
                                onClick={() => handleModuleClick(module._id)}
                            >
                                <div className="bg-gradient-to-br from-orange-50 to-white p-5">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,240px)_1fr] md:items-center">
                                        <div className="relative h-72">
                                            {module.image ? (
                                                <>
                                                    <Image
                                                        src={module.image.startsWith('/') ? module.image : `/${module.image}`}
                                                        alt={`${module.title} - Método Fedor`}
                                                        fill
                                                        className="object-contain px-2 pb-2 pt-16"
                                                    />
                                                    <div className="absolute -top-8 left-0 right-0 px-4">
                                                        <p className="rounded-full bg-white/85 px-4 py-2 text-center text-2xl font-extrabold uppercase tracking-wide text-gray-900 shadow-sm backdrop-blur-sm">
                                                            {module.group === 'Grado1' ? 'El módulo tiene 2 libros:' : 'El módulo tiene 3 libros:'}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <span className="text-6xl text-orange-500">📚</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleModuleClick(module._id);
                                                }}
                                                className="group flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-amber-400 shadow-md">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75C3 5.784 3.784 5 4.75 5h5.5c.69 0 1.356.237 1.89.672L12 5.75l-.14-.078A3.5 3.5 0 0010.25 5h-5.5A1.75 1.75 0 003 6.75v10.5C3 18.216 3.784 19 4.75 19h5.5c.69 0 1.356.237 1.89.672L12 19.75l-.14-.078A3.5 3.5 0 0010.25 19h-5.5A1.75 1.75 0 013 17.25V6.75z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 6.75C21 5.784 20.216 5 19.25 5h-5.5a3.5 3.5 0 00-1.61.672L12 5.75v14l.14-.078A3.5 3.5 0 0113.75 19h5.5A1.75 1.75 0 0021 17.25V6.75z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-bold text-gray-900">Contenido</p>
                                                        <p className="mt-1 text-sm text-gray-600">Libros del módulo y contenidos del plan.</p>
                                                    </div>
                                                </div>
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-orange-400 text-xl text-orange-500 transition group-hover:bg-orange-50">
                                                    →
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(event) => openBenefitsModal(event, module)}
                                                className="group flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-emerald-500 shadow-md">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 18.25h3.25c2.9 0 5.25-2.35 5.25-5.25 0-3.728-3.022-6.75-6.75-6.75S4.5 9.272 4.5 13c0 1.768.681 3.377 1.795 4.577.449.484.705 1.117.705 1.777V20h4.25" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 10.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM11.5 6.75v1.5M7.97 8.22l1.06 1.06M15.03 8.22l-1.06 1.06M6.75 12h1.5M15.75 12h1.5M10 14.75h3" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-bold text-gray-900">Beneficios</p>
                                                        <p className="mt-1 text-sm text-gray-600">Metodologías lúdicas y activas para aprender mejor.</p>
                                                    </div>
                                                </div>
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-orange-400 text-xl text-orange-500 transition group-hover:bg-orange-50">
                                                    →
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(event) => openFichaModal(event, module)}
                                                className="group flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-md">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.75H7.75A1.75 1.75 0 006 5.5v13A1.75 1.75 0 007.75 20.25h8.5A1.75 1.75 0 0018 18.5V7.75L14 3.75z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.75V8h4M9 11.25h6M9 14.25h6M9 17.25h4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-bold text-gray-900">Ficha Técnica</p>
                                                        <p className="mt-1 text-sm text-gray-600">Detalles del material, duración y estructura del módulo.</p>
                                                    </div>
                                                </div>
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-orange-400 text-xl text-orange-500 transition group-hover:bg-orange-50">
                                                    →
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{module.title}</h3>
                                    {module.group && moduleBooksImages[module.group] && (
                                        <div className="mb-4 flex justify-center">
                                            <Image
                                                src={moduleBooksImages[module.group].src}
                                                alt={moduleBooksImages[module.group].alt}
                                                width={220}
                                                height={90}
                                                className="h-auto w-auto max-w-full object-contain"
                                            />
                                        </div>
                                    )}
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
                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleModuleClick(module._id);
                                            }}
                                            className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                                        >
                                            Comprar Ahora
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {isBenefitsModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
                    onClick={() => {
                        setIsBenefitsModalOpen(false);
                        setSelectedModule(null);
                    }}
                >
                    <div
                        className="relative h-[85vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setIsBenefitsModalOpen(false);
                                setSelectedModule(null);
                            }}
                            className="absolute right-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-gray-100"
                        >
                            Cerrar
                        </button>
                        <iframe
                            src="/beneficiosdematematicasdefedorP%C3%A1gina.html"
                            title="Beneficios de Matemáticas de Fedor"
                            className="h-full w-full"
                        />
                    </div>
                </div>
            )}

            {isFichaModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
                    onClick={() => {
                        setIsFichaModalOpen(false);
                        setSelectedModule(null);
                    }}
                >
                    <div
                        className="relative w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setIsFichaModalOpen(false);
                                setSelectedModule(null);
                            }}
                            className="absolute right-5 top-5 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-100"
                        >
                            Cerrar
                        </button>
                        <iframe
                            src="/FichaTe%CC%81cnica%20-%20Me%CC%81todoFedor.pdf"
                            title="Ficha Técnica - Método Fedor"
                            className="h-[85vh] w-full rounded-3xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
