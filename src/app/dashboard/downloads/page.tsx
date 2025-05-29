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
}

export default function DownloadsPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
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

        checkAuth();
    }, [router]);

    const handleDownload = async (moduleId: string) => {
        try {
            const userData = authService.getCurrentUser();
            if (!userData) {
                throw new Error('No se encontró información del usuario');
            }
            // Aquí iría la lógica para descargar el archivo Excel
            const response = await moduleService.downloadModuleExcel(moduleId, userData.id);

            // Crear un blob con los datos y descargar
            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `modulo-${moduleId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error al descargar:', error);
            setAlertMessage({
                title: 'Error',
                message: 'No se pudo descargar el archivo'
            });
            setIsAlertOpen(true);
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
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Descargas</h1>

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
                                                    <button
                                                        onClick={() => handleDownload(module.module_id)}
                                                        className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                                                    >
                                                        <FiDownload className="w-4 h-4" />
                                                        <span>Descargar Excel</span>
                                                    </button>
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