'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { moduleService, Module } from '@/services/module.service';
import { FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi';

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
    active: {
        label: 'Activo',
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    processing: {
        label: 'Procesando',
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    inactive: {
        label: 'Inactivo',
        className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    },
};

function getStatusStyle(status: string) {
    return (
        STATUS_STYLES[status] ?? {
            label: status,
            className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        }
    );
}

export default function ModulesPage() {
    const router = useRouter();
    const [modules, setModules] = useState<Module[]>([]);
    const [filtered, setFiltered] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    /* ── Auth ── */
    useEffect(() => {
        try {
            const user = authService.getCurrentUser();
            if (!user) router.push('/login');
        } catch {
            router.push('/login');
        } finally {
            setIsCheckingAuth(false);
        }
    }, [router]);

    /* ── Fetch ── */
    const fetchModules = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await moduleService.getAllLearnings();
            // El backend podría devolver el array directamente o dentro de .data
            const list: Module[] = Array.isArray(data) ? data : ((data as { data?: Module[] })?.data ?? []);
            setModules(list);
            setFiltered(list);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los módulos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isCheckingAuth) fetchModules();
    }, [isCheckingAuth]);

    /* ── Search ── */
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            q
                ? modules.filter(
                    (m) =>
                        m.title.toLowerCase().includes(q) ||
                        m.group.toLowerCase().includes(q) ||
                        m.status?.toLowerCase().includes(q),
                )
                : modules,
        );
    }, [search, modules]);

    /* ── Guards ── */
    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen bg-[#F9F9F9]">
                <Sidebar />
            </div>
        );
    }

    /* ── UI ── */
    return (
        <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
            <div className="flex min-h-screen bg-[#F9F9F9] dark:bg-[#1C1D1F]">
                <Sidebar />

                <div className="flex-1 p-8 overflow-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Módulos</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Gestiona todos los módulos de aprendizaje
                            </p>
                        </div>
                        <Link
                            href="/dashboard/modules/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <FiPlus className="w-4 h-4" />
                            Nuevo módulo
                        </Link>
                    </div>

                    {/* Search + Refresh */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por título, grupo o estado…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#282828] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={fetchModules}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-[#282828] hover:bg-gray-50 dark:hover:bg-[#363636] transition-colors disabled:opacity-50"
                        >
                            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Table card */}
                    <div className="bg-white dark:bg-[#242424] border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-400">Cargando módulos…</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                                <p className="text-sm">
                                    {search ? 'Sin resultados para tu búsqueda.' : 'Aún no hay módulos creados.'}
                                </p>
                                {!search && (
                                    <Link
                                        href="/dashboard/modules/create"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Crear el primero
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-[#1e1e1e] border-b border-gray-100 dark:border-gray-700 text-left">
                                            <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                                                Título
                                            </th>
                                            <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                                                Grupo
                                            </th>
                                            <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                                                Precio
                                            </th>
                                            <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {filtered.map((mod) => {
                                            const { label, className } = getStatusStyle(mod.status);
                                            return (
                                                <tr
                                                    key={mod._id}
                                                    className="hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                                    onClick={() => router.push(`/dashboard/modules/${mod._id}`)}
                                                >
                                                    {/* Título */}
                                                    <td className="px-5 py-4">
                                                        <span className="font-medium text-gray-800 dark:text-white">
                                                            {mod.title}
                                                        </span>
                                                    </td>

                                                    {/* Grupo */}
                                                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                        {mod.group || '—'}
                                                    </td>

                                                    {/* Precio */}
                                                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                        {mod.price != null
                                                            ? new Intl.NumberFormat('es-CO', {
                                                                style: 'currency',
                                                                currency: 'COP',
                                                                maximumFractionDigits: 0,
                                                            }).format(mod.price)
                                                            : '—'}
                                                    </td>

                                                    {/* Estado */}
                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
                                                        >
                                                            {label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Footer count */}
                                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                                    {filtered.length} módulo{filtered.length !== 1 ? 's' : ''}
                                    {search && ` encontrado${filtered.length !== 1 ? 's' : ''}`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
