'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
    FiDownload,
    FiFile,
    FiAlertCircle,
    FiLock,
    FiCheckCircle,
    FiClock,
    FiExternalLink,
    FiShoppingBag,
} from 'react-icons/fi';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { moduleService } from '@/services/module.service';
import { purchaseService, Purchase } from '@/services/purchase.service';
import {
    isPurchaseExpired,
    getPurchaseExpirationDate,
    isFreeTrialGrade,
    isAnnualPlanPurchase,
    canUserDownloadModule,
    FREE_TRIAL_MODULE_METADATA,
    FREE_TRIAL_END_DATE,
} from '@/constants/module-access.constants';

interface ModuleItem {
    module_id: string;
    title: string;
    description?: string;
    purchaseDate?: string | null;
    isFreeTrial: boolean;
    hasActiveAnnualPurchase: boolean;
    isExpired: boolean;
    expirationDate?: Date | null;
    group?: string;
    slug?: string;
    gradeConfig?: {
        downloadFiles: Array<{
            name: string;
            description?: string;
        }>;
    };
}

export default function DownloadsPage() {
    const router = useRouter();
    const t = useTranslations('dashboard.downloads');
    const [modules, setModules] = useState<ModuleItem[]>([]);
    const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingModuleId, setDownloadingModuleId] = useState<string | null>(null);

    // Modal para informar que la descarga de Excel requiere Plan Anual
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [upgradeModalModuleName, setUpgradeModalModuleName] = useState('');

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

            // 1. Obtener compras reales del usuario
            const purchases = await purchaseService.getUserPurchases(userData.id);
            setUserPurchases(purchases);

            // 2. Obtener módulos comprados según backend
            let backendPurchased: any[] = [];
            try {
                backendPurchased = await moduleService.getPurchasedModules(userData.id);
                if (!Array.isArray(backendPurchased)) backendPurchased = [];
            } catch (err) {
                console.warn('No se pudieron obtener módulos del backend:', err);
            }

            // 3. Obtener catálogo completo de módulos para vincular metadatos
            let allModules: any[] = [];
            try {
                allModules = await moduleService.getAllModules();
                if (!Array.isArray(allModules)) allModules = [];
            } catch (err) {
                console.warn('No se pudo obtener el catálogo completo de módulos:', err);
            }

            // 4. Armar el listado completo de módulos relevantes para el usuario
            const moduleMap = new Map<string, ModuleItem>();

            // A) Primero añadir los módulos devueltos por el backend
            backendPurchased.forEach((mod: any) => {
                const id = mod.module_id || mod._id;
                if (!id) return;

                const matchingPurchase = purchases.find(
                    p => (p?.module_id === id || (mod.slug && p?.module_id === mod.slug)) &&
                        p?.transaction?.status === 'APPROVED'
                );

                const isExpired = matchingPurchase ? isPurchaseExpired(matchingPurchase.purchase_date) : false;
                const hasActiveAnnual = Boolean(matchingPurchase && !isExpired && isAnnualPlanPurchase(matchingPurchase));
                const isTrial = isFreeTrialGrade(id) || isFreeTrialGrade(mod.slug) || isFreeTrialGrade(mod.group) || isFreeTrialGrade(mod.title);

                moduleMap.set(id, {
                    module_id: id,
                    title: mod.title || 'Módulo',
                    description: mod.description,
                    purchaseDate: matchingPurchase ? matchingPurchase.purchase_date : (hasActiveAnnual ? mod.purchaseDate : null),
                    isFreeTrial: isTrial && !hasActiveAnnual,
                    hasActiveAnnualPurchase: hasActiveAnnual,
                    isExpired: isExpired,
                    expirationDate: matchingPurchase ? getPurchaseExpirationDate(matchingPurchase.purchase_date) : null,
                    group: mod.group,
                    slug: mod.slug,
                    gradeConfig: mod.gradeConfig,
                });
            });

            // B) Asegurar que los 5 módulos del trial gratuito estén presentes para que el usuario conozca su estado
            const isTrialActive = new Date() <= FREE_TRIAL_END_DATE;
            if (isTrialActive) {
                FREE_TRIAL_MODULE_METADATA.forEach((trialMeta) => {
                    // Verificar si ya fue agregado por el backend
                    const existing = Array.from(moduleMap.values()).find(
                        m => m.module_id === trialMeta.module_id || m.slug === trialMeta.slug
                    );

                    // Buscar si existe compra anual para este módulo
                    const matchingPurchase = purchases.find(
                        p => (p?.module_id === trialMeta.module_id || p?.module_id === trialMeta.slug) &&
                            p?.transaction?.status === 'APPROVED'
                    );

                    const isExpired = matchingPurchase ? isPurchaseExpired(matchingPurchase.purchase_date) : false;
                    const hasActiveAnnual = Boolean(matchingPurchase && !isExpired && isAnnualPlanPurchase(matchingPurchase));

                    // Buscar datos adicionales del catálogo si existen
                    const catMod = allModules.find(
                        m => m._id === trialMeta.module_id || m.slug === trialMeta.slug
                    );

                    if (!existing) {
                        moduleMap.set(trialMeta.module_id, {
                            module_id: trialMeta.module_id,
                            title: catMod?.title || trialMeta.title,
                            description: catMod?.description || trialMeta.description,
                            purchaseDate: matchingPurchase ? matchingPurchase.purchase_date : null,
                            isFreeTrial: !hasActiveAnnual,
                            hasActiveAnnualPurchase: hasActiveAnnual,
                            isExpired: isExpired,
                            expirationDate: matchingPurchase ? getPurchaseExpirationDate(matchingPurchase.purchase_date) : null,
                            group: trialMeta.group,
                            slug: trialMeta.slug,
                            gradeConfig: catMod?.gradeConfig,
                        });
                    } else {
                        // Actualizar bandera de trial y compra anual de forma estricta
                        existing.isFreeTrial = !hasActiveAnnual;
                        existing.hasActiveAnnualPurchase = hasActiveAnnual;
                        if (matchingPurchase) {
                            existing.purchaseDate = matchingPurchase.purchase_date;
                            existing.isExpired = isExpired;
                            existing.expirationDate = getPurchaseExpirationDate(matchingPurchase.purchase_date);
                        }
                    }
                });
            }

            setModules(Array.from(moduleMap.values()));
        } catch (error) {
            console.error('Error al cargar módulos:', error);
            setAlertMessage({
                title: 'Error',
                message: error instanceof Error ? error.message : t('error_load_modules')
            });
            setIsAlertOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        loadModules();

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
            // VERIFICACIÓN ESTRICTA: El usuario NO puede descargar si no ha comprado un Plan Anual
            const canDownload = canUserDownloadModule(moduleId, userPurchases);
            if (!canDownload) {
                setUpgradeModalModuleName(fileName || 'Módulo');
                setIsUpgradeModalOpen(true);
                return;
            }

            setIsDownloading(true);
            setDownloadingModuleId(`${moduleId}-${fileIndex}`);

            const userData = authService.getCurrentUser();
            if (!userData) {
                throw new Error('No se encontró información del usuario');
            }

            const response = await moduleService.downloadModuleExcel(moduleId, userData.id, fileIndex);

            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName ? `${fileName}.xlsx` : `modulo-${moduleId}-${fileIndex}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setAlertMessage({
                title: 'Descarga completada',
                message: t('success_download')
            });
            setIsAlertOpen(true);

        } catch (error) {
            console.error('Error al descargar:', error);
            const errorMessage = error instanceof Error ? error.message : t('error_download');

            setAlertMessage({
                title: 'Descarga no permitida',
                message: errorMessage
            });
            setIsAlertOpen(true);
        } finally {
            setIsDownloading(false);
            setDownloadingModuleId(null);
        }
    };

    const hasAnyFreeTrial = modules.some(m => m.isFreeTrial);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
            <Sidebar />
            
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={alertMessage.title}
                message={alertMessage.message}
            />

            {/* Modal explicativo: Descargas de Excel requieren Plan Anual */}
            {isUpgradeModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
                    onClick={() => setIsUpgradeModalOpen(false)}
                >
                    <div 
                        className="bg-white dark:bg-[#1E1F25] border border-amber-300 dark:border-amber-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 mx-auto mb-4">
                            <FiLock className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                            {t('upgrade_modal_title')}
                        </h3>

                        {upgradeModalModuleName && (
                            <p className="text-center text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-950/40 py-1 px-3 rounded-full w-fit mx-auto border border-amber-200 dark:border-amber-800/40">
                                {upgradeModalModuleName}
                            </p>
                        )}

                        <p className="text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed mb-6">
                            {t('upgrade_modal_desc')}
                        </p>

                        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-2.5">
                                <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                                    <p className="font-semibold mb-1">Tu beneficio gratuito actual:</p>
                                    <p>Puedes ingresar y practicar con todos los ejercicios y simulaciones en línea dentro de la plataforma sin costo hasta el 31 de octubre.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsUpgradeModalOpen(false)}
                                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                            >
                                {t('upgrade_modal_btn_cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsUpgradeModalOpen(false);
                                    router.push('/dashboard/buybooks');
                                }}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                <FiShoppingBag className="w-4 h-4" />
                                <span>{t('upgrade_modal_btn_plan')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de loading para descarga */}
            {isDownloading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1E1F25] rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                            {t('modal_customizing_title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                            {t('modal_customizing_desc')}
                        </p>
                        
                        {/* Warning sobre la contraseña */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-left">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                                        {t('modal_warning_title')}
                                    </h4>
                                    <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                                        <p>{t('modal_warning_sent')}</p>
                                        <p className="font-semibold">{t('modal_warning_keep_safe')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 p-6 sm:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">{t('title')}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Gestiona tus archivos y plantillas en Excel (.xlsx) de Matemáticas de Fedor
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/buybooks')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all self-start sm:self-auto"
                        >
                            <FiShoppingBag className="w-4 h-4" />
                            <span>{t('btn_get_annual_plan')}</span>
                        </button>
                    </div>

                    {/* Banner informativo principal sobre la prueba gratuita */}
                    {hasAnyFreeTrial && (
                        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-400/40 dark:border-amber-500/30 rounded-2xl p-5 mb-6 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start gap-3.5">
                                    <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                                        <FiLock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
                                            {t('banner_free_trial_title')}
                                        </h2>
                                        <p className="text-sm text-amber-800/90 dark:text-amber-300/80 mt-1 leading-relaxed">
                                            {t('banner_free_trial_desc')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard/buybooks')}
                                    className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
                                >
                                    <span>{t('btn_get_annual_plan')}</span>
                                    <FiExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mensajes informativos de configuración */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                                        {t('notice_fill_profile')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                                        {t('notice_password_email')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : modules.length === 0 ? (
                        <div className="bg-white dark:bg-[#1E1F25] rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
                                <FiLock className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t('empty_no_downloads_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6">
                                {t('empty_no_downloads_desc')}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard/buybooks')}
                                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl text-sm shadow-md"
                                >
                                    {t('btn_get_annual_plan')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard/cursos')}
                                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl text-sm"
                                >
                                    {t('btn_study_online')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1E1F25] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-[#232323] text-left border-b border-gray-200 dark:border-gray-800">
                                            <th className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider">{t('th_module')}</th>
                                            <th className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider">{t('th_purchase_date')}</th>
                                            <th className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider">{t('th_validity')}</th>
                                            <th className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider">{t('th_actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {modules.map((module, index) => {
                                            const isExpired = module.isExpired;
                                            const hasAnnual = module.hasActiveAnnualPurchase;
                                            const isTrial = module.isFreeTrial && !hasAnnual;

                                            return (
                                                <tr
                                                    key={module.module_id || index}
                                                    className={`hover:bg-gray-50/80 dark:hover:bg-[#282828] transition-colors ${
                                                        isExpired ? 'opacity-60' : ''
                                                    } ${isTrial ? 'bg-amber-500/[0.02]' : ''}`}
                                                >
                                                    {/* Nombre del módulo y badges */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                <FiFile className={`w-5 h-5 ${
                                                                    hasAnnual 
                                                                        ? 'text-emerald-500' 
                                                                        : isTrial 
                                                                        ? 'text-amber-500' 
                                                                        : 'text-gray-400'
                                                                }`} />
                                                            </div>
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-semibold text-sm text-black dark:text-white">
                                                                        {module.title}
                                                                    </span>
                                                                    {hasAnnual && (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300/40">
                                                                            <FiCheckCircle className="w-3 h-3" />
                                                                            {t('badge_annual')}
                                                                        </span>
                                                                    )}
                                                                    {isTrial && (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300/50">
                                                                            <FiClock className="w-3 h-3 text-amber-500" />
                                                                            {t('badge_free_trial')}
                                                                        </span>
                                                                    )}
                                                                    {isExpired && !isTrial && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                                            <FiAlertCircle className="w-3 h-3" />
                                                                            {t('badge_expired')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {module.description && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                                                        {module.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Fecha de compra */}
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                        {module.purchaseDate && Date.parse(module.purchaseDate)
                                                            ? new Date(module.purchaseDate).toLocaleDateString()
                                                            : isTrial
                                                            ? <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Acceso promocional</span>
                                                            : t('no_date')}
                                                    </td>

                                                    {/* Vigencia */}
                                                    <td className="px-6 py-4">
                                                        {isExpired ? (
                                                            <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                                                {t('expired_on')} {module.expirationDate?.toLocaleDateString() ?? '—'}
                                                            </span>
                                                        ) : hasAnnual && module.expirationDate ? (
                                                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                                <FiCheckCircle className="w-3.5 h-3.5" />
                                                                {t('valid_until')} {module.expirationDate.toLocaleDateString()}
                                                            </span>
                                                        ) : isTrial ? (
                                                            <div className="text-xs text-amber-700 dark:text-amber-300">
                                                                <p className="font-semibold">{t('valid_free_trial')}</p>
                                                                <p className="text-[11px] text-gray-500 dark:text-gray-400">Sin descargas Excel</p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">—</span>
                                                        )}
                                                    </td>

                                                    {/* Acciones */}
                                                    <td className="px-6 py-4">
                                                        {isExpired ? (
                                                            <div className="text-xs text-gray-500 space-y-1">
                                                                <p>{t('access_expired_msg')}</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => router.push('/dashboard/buybooks')}
                                                                    className="text-orange-500 hover:text-orange-600 underline font-semibold"
                                                                >
                                                                    {t('renew_purchase_msg')}
                                                                </button>
                                                            </div>
                                                        ) : isTrial ? (
                                                            /* CASO MÓDULO GRATIS: NO PERMITE DESCARGAR EXCEL */
                                                            <div className="flex flex-col gap-1.5 items-start">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setUpgradeModalModuleName(module.title);
                                                                        setIsUpgradeModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all text-xs font-semibold shadow-sm cursor-pointer"
                                                                    title="Descarga bloqueada en módulo gratuito"
                                                                >
                                                                    <FiLock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                                                    <span>{t('locked_requires_annual')}</span>
                                                                </button>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => router.push('/dashboard/buybooks')}
                                                                        className="text-orange-600 dark:text-orange-400 hover:underline font-semibold flex items-center gap-1"
                                                                    >
                                                                        <span>{t('btn_get_annual_plan')}</span>
                                                                        <FiExternalLink className="w-3 h-3" />
                                                                    </button>
                                                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => router.push(`/dashboard/modules/${module.module_id}/exercises`)}
                                                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                                    >
                                                                        {t('btn_study_online')} →
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            /* CASO PLAN ANUAL ACTIVO: PERMITE DESCARGAR */
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
                                                                            className={`flex items-center gap-2 transition-colors text-sm font-medium ${
                                                                                isDownloading && downloadingModuleId === `${module.module_id}-${fileIndex}`
                                                                                    ? 'text-gray-400 cursor-not-allowed'
                                                                                    : 'text-blue-600 hover:text-blue-500 dark:text-blue-400'
                                                                            }`}
                                                                        >
                                                                            {isDownloading && downloadingModuleId === `${module.module_id}-${fileIndex}` ? (
                                                                                <>
                                                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></div>
                                                                                    <span>{t('customizing')}</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FiDownload className="w-4 h-4" />
                                                                                    <span>
                                                                                        {file.name || `Archivo ${fileIndex + 1}`}
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        disabled={isDownloading}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            handleDownload(module.module_id, 0);
                                                                        }}
                                                                        className={`flex items-center gap-2 transition-colors text-sm font-medium ${
                                                                            isDownloading && downloadingModuleId === `${module.module_id}-0`
                                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                                : 'text-blue-600 hover:text-blue-500 dark:text-blue-400'
                                                                        }`}
                                                                    >
                                                                        {isDownloading && downloadingModuleId === `${module.module_id}-0` ? (
                                                                            <>
                                                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></div>
                                                                                <span>{t('customizing')}</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FiDownload className="w-4 h-4" />
                                                                                <span>
                                                                                    {t('download_excel')}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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