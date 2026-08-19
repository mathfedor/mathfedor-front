'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { institutionModuleService, StudentModuleAccess } from '@/services/institution-module.service';
import { FiBook, FiShoppingBag, FiArrowRight, FiRefreshCw, FiSearch, FiLayers, FiAlertCircle, FiClock } from 'react-icons/fi';
import {
  isModuleInFreeTrial,
  isPurchaseExpired,
  getPurchaseExpirationDate,
  FREE_TRIAL_END_DATE,
} from '@/constants/module-access.constants';

export default function MisModulosPage() {
  const router = useRouter();
  const [modules, setModules] = useState<StudentModuleAccess[]>([]);
  const [filtered, setFiltered] = useState<StudentModuleAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'purchase' | 'institution'>('all');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) { router.push('/login'); return; }
    loadModules(user.id);
  }, [router]);

  const loadModules = async (userId: string) => {
    setIsLoading(true);
    try {
      const data = await institutionModuleService.getStudentModules(userId);
      setModules(data);
      setFiltered(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = modules;
    if (activeTab !== 'all') result = result.filter(m => m.source === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) || m.group.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, activeTab, modules]);

  const b2cCount = modules.filter(m => m.source === 'purchase').length;
  const instCount = modules.filter(m => m.source === 'institution').length;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl shadow-2xl p-8">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full translate-x-20 -translate-y-20" />
              <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white rounded-full translate-y-16" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <FiLayers className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Mis Módulos</h1>
                  <p className="text-purple-200 text-sm mt-1">Todos tus módulos disponibles para estudiar</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <FiShoppingBag className="w-4 h-4 text-purple-200" />
                  <span className="text-white text-sm font-medium">{b2cCount} comprados</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <FiBook className="w-4 h-4 text-purple-200" />
                  <span className="text-white text-sm font-medium">{instCount} de mi institución</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar módulo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>

          {/* Tabs de filtro */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            {[
              { key: 'all', label: 'Todos', count: modules.length },
              { key: 'purchase', label: 'Comprados', count: b2cCount },
              { key: 'institution', label: 'Institución', count: instCount },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const user = authService.getCurrentUser();
              if (user) loadModules(user.id);
            }}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Recargar"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Grid de módulos */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Cargando tus módulos...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
              <FiLayers className="w-7 h-7 text-slate-500" />
            </div>
            <h3 className="text-slate-300 font-semibold text-lg mb-2">No hay módulos disponibles</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              {modules.length === 0
                ? 'Aún no tienes módulos. Compra uno o pide a tu institución que te asigne acceso.'
                : 'No se encontraron módulos con ese criterio de búsqueda.'}
            </p>
            {modules.length === 0 && (
              <Link
                href="/dashboard"
                className="mt-4 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all"
              >
                Explorar módulos
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((mod) => (
              <ModuleCard key={mod.module_id} module={mod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleCard({ module }: { module: StudentModuleAccess }) {
  const isInstitution = module.source === 'institution';
  const isFreeTrialModule = isModuleInFreeTrial(module.group);
  const expired = module.purchaseDate ? isPurchaseExpired(module.purchaseDate) : false;
  const expirationDate = module.purchaseDate
    ? getPurchaseExpirationDate(module.purchaseDate)
    : null;

  // Un módulo es accesible si:
  // - Tiene compra activa (no expirada)
  // - Es de trial gratuito (Grado1/Grado2 antes del 17/Sep/2026)
  // - Es institucional
  const canAccessExercises = (module.source === 'purchase' && !expired)
    || isFreeTrialModule
    || module.source === 'institution';

  return (
    <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:bg-white/8 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 ${expired && !isFreeTrialModule ? 'opacity-60' : ''}`}>
      {/* Badge de fuente */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
        {isFreeTrialModule && module.source !== 'purchase' && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <FiClock className="w-3 h-3" />
            Gratis hasta {FREE_TRIAL_END_DATE.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
        {expired && !isFreeTrialModule && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
            <FiAlertCircle className="w-3 h-3" />
            Expirado
          </span>
        )}
        {!expired && module.source === 'purchase' && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <FiShoppingBag className="w-3 h-3" />
            Comprado
          </span>
        )}
        {isInstitution && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <FiBook className="w-3 h-3" />
            Institución
          </span>
        )}
      </div>

      {/* Imagen / Placeholder */}
      <div className="h-32 bg-gradient-to-br from-purple-800/30 to-indigo-800/30 flex items-center justify-center relative overflow-hidden">
        {module.image ? (
          <img src={module.image} alt={module.title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <FiBook className="w-10 h-10 text-purple-400/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs text-purple-400 font-medium uppercase tracking-wide">{module.group}</span>
        </div>
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-3 group-hover:text-purple-200 transition-colors">
          {module.title}
        </h3>

        {module.purchaseDate && (
          <p className="text-slate-500 text-xs mb-1">
            Comprado: {new Date(module.purchaseDate).toLocaleDateString('es-CO')}
          </p>
        )}

        {/* Vigencia */}
        {expirationDate && !expired && (
          <p className="text-emerald-400 text-xs mb-3">
            Vigente hasta: {expirationDate.toLocaleDateString('es-CO')}
          </p>
        )}
        {expirationDate && expired && !isFreeTrialModule && (
          <p className="text-red-400 text-xs mb-3">
            Venció el: {expirationDate.toLocaleDateString('es-CO')}
          </p>
        )}

        {/* Archivos descargables (solo B2C) */}
        {module.gradeConfig?.downloadFiles?.length && !expired ? (
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
            <FiLayers className="w-3 h-3" />
            <span>{module.gradeConfig.downloadFiles.length} archivos disponibles</span>
          </div>
        ) : null}

        {/* CTA */}
        {canAccessExercises ? (
          <Link
            href={`/dashboard/modules/${module.module_id}/exercises`}
            className="flex items-center justify-center gap-2 w-full py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-xl text-sm font-medium transition-all group/btn"
          >
            <span>Ir a actividades</span>
            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full py-2 bg-gray-600/40 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed">
            <FiAlertCircle className="w-4 h-4" />
            <span>Acceso expirado</span>
          </div>
        )}
      </div>
    </div>
  );
}
