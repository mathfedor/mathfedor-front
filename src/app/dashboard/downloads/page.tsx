'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { FiDownload, FiFile } from 'react-icons/fi';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { moduleService } from '@/services/module.service';

interface Module {
    module_id: string;
    title: string;
    description: string;
    purchaseDate: string;
    status: 'active' | 'expired';
    gradeConfig?: {
        downloadFiles: Array<{
            name: string;
            description?: string;
        }>;
    };
}

export default function DownloadsPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingModuleId, setDownloadingModuleId] = useState<string | null>(null);

    const router = useRouter();

    const loadModules = async () => {
        try {
            if (!authService.isAuthenticated()) {
                router.replace('/login');
                return;
            }

            const userData = authService.getCurrentUser();
            if (!userData) {
                throw new Error('No se encontró información del usuario');
            }

            // Aquí iría la llamada para obtener los módulos comprados
            const purchasedModules = await moduleService.getPurchasedModules(userData.id);
            setModules(purchasedModules);
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Error al cargar los módulos'
            });
            setIsAlertOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        loadModules();

        // Escuchar cambios en el usuario
        const handleUserUpdate = () => {
            setIsLoading(true);
            loadModules();
        };

        window.addEventListener('userUpdated', handleUserUpdate);

        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const handleDownload = async (moduleId: string, fileIndex: number, fileName?: string) => {
        try {
            setIsDownloading(true);
            setDownloadingModuleId(`${moduleId}-${fileIndex}`);

            const userData = authService.getCurrentUser();
            if (!userData) {
                throw new Error('No se encontró información del usuario');
            }

            // Aquí iría la lógica para descargar el archivo Excel
            const response = await moduleService.downloadModuleExcel(moduleId, userData.id, fileIndex);

            // Crear un blob con los datos y descargar
            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName ? `${fileName}.xlsx` : `modulo-${moduleId}-${fileIndex}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Mostrar mensaje de éxito
            setAlertMessage({
                title: 'Éxito',
                message: 'Archivo descargado correctamente'
            });
            setIsAlertOpen(true);

        } catch (error) {
            console.error('Error al descargar:', error);
            const errorMessage = error instanceof Error ? error.message : 'No se pudo descargar el archivo';

            setAlertMessage({
                title: 'Error',
                message: errorMessage
            });
            setIsAlertOpen(true);
        } finally {
            setIsDownloading(false);
            setDownloadingModuleId(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
            <Sidebar />
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={alertMessage.title}
                message={alertMessage.message}
            />

            {/* Modal de loading para descarga */}
            {isDownloading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1E1F25] rounded-lg p-8 max-w-md mx-4 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                            Estamos personalizando tu módulo
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Por favor espera mientras preparamos tu archivo...
                        </p>
                        
                        {/* Warning sobre la contraseña */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                        ⚠️ Importante: Contraseña del archivo
                                    </h3>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                        <p className="mb-2">
                                            Se te enviará a tu correo electrónico la contraseña del archivo.
                                        </p>
                                        <p className="font-semibold">
                                            Guarda esta contraseña en un lugar seguro. La aplicación NO guarda esta contraseña, 
                                            por lo que si la pierdes, no podrás abrir el archivo nuevamente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Descargas</h1>

                    {/* Mensajes informativos */}
                    <div className="mb-6 space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        Recuerda que para descargar el archivo debes llenar los datos del estudiante en la sección de perfil.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Después de descargar el archivo se te enviará a tu correo electrónico la contraseña del archivo. Guarda esta contraseña en un lugar seguro. La aplicación NO guarda esta contraseña, por lo que si la pierdes, no podrás abrir el archivo nuevamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1E1F25] rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-[#232323] text-left">
                                            <th className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Módulo</th>
                                            <th className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Fecha de compra</th>
                                            <th className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {modules.map((module, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 dark:hover:bg-[#282828] transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <FiFile className="text-blue-500 w-5 h-5" />
                                                        <span className="text-black dark:text-white">{module.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                    {Date.parse(module.purchaseDate)
                                                        ? new Date(module.purchaseDate).toLocaleDateString()
                                                        : 'Sin fecha'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        {module.gradeConfig?.downloadFiles && module.gradeConfig.downloadFiles.length > 0 ? (
                                                            module.gradeConfig.downloadFiles.map((file, fileIndex) => (
                                                                <button
                                                                    key={fileIndex}
                                                                    type="button"
                                                                    disabled={isDownloading}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleDownload(module.module_id, fileIndex, file.name);
                                                                    }}
                                                                    className={`flex items-center gap-2 transition-colors text-sm ${isDownloading && downloadingModuleId === `${module.module_id}-${fileIndex}`
                                                                            ? 'text-gray-400 cursor-not-allowed'
                                                                            : 'text-blue-500 hover:text-blue-400'
                                                                        }`}
                                                                >
                                                                    {isDownloading && downloadingModuleId === `${module.module_id}-${fileIndex}` ? (
                                                                        <>
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></div>
                                                                            <span>Personalizando...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FiDownload className="w-4 h-4" />
                                                                            <span className="cursor-pointer">
                                                                                {file.name || `Archivo ${fileIndex + 1}`}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            // Fallback para módulos sin gradeConfig (compatibilidad hacia atrás)
                                                            <button
                                                                type="button"
                                                                disabled={isDownloading}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleDownload(module.module_id, 0);
                                                                }}
                                                                className={`flex items-center gap-2 transition-colors ${isDownloading && downloadingModuleId === `${module.module_id}-0`
                                                                        ? 'text-gray-400 cursor-not-allowed'
                                                                        : 'text-blue-500 hover:text-blue-400'
                                                                    }`}
                                                            >
                                                                {isDownloading && downloadingModuleId === `${module.module_id}-0` ? (
                                                                    <>
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></div>
                                                                        <span>Personalizando...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FiDownload className="w-4 h-4" />
                                                                        <span className="cursor-pointer">
                                                                            Descargar Excel
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 