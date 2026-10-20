'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { planService } from '@/services/plan.service';
import { Plan, CreatePlanData, PlanBillingPeriod } from '@/types/plan.types';
import { User } from '@/types/auth.types';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiCreditCard,
  FiStar,
  FiUsers,
  FiRefreshCw,
  FiLayers,
  FiGift,
  FiShield,
  FiEye,
} from 'react-icons/fi';
import { toast } from 'sonner';

export default function AdminPlansPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario
  const [formData, setFormData] = useState<CreatePlanData>({
    name: '',
    slug: '',
    billingPeriod: 'annual',
    price: 179999,
    trialDays: 0,
    pricePerDay: 493,
    pricePerMonth: 15000,
    digitalBookIncluded: true,
    fedorZoneIncluded: true,
    excelModulesDescription: 'El grado en curso. Todos los libros',
    familyPricing: {
      secondModulePrice: 120000,
      additionalModulePrice: 80000,
    },
    isActive: true,
    order: 0,
    badge: '',
    features: ['Libro digital completo', 'Zona Fedor completa', 'Todos los libros en Excel del grado en curso'],
    isCustomQuote: false,
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/login');
          return;
        }

        const userData = authService.getCurrentUser();
        if (!userData || userData.role !== 'Admin') {
          toast.error('No tienes permisos de Administrador para acceder a esta página');
          router.replace('/dashboard');
          return;
        }

        setUser(userData);
        loadPlans();
      } catch (err) {
        console.error(err);
        toast.error('Error de autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadPlans = async () => {
    setLoadingPlans(true);
    try {
      const data = await planService.getAllPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar planes de pago');
    } finally {
      setLoadingPlans(false);
    }
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      slug: '',
      billingPeriod: 'annual',
      price: 179999,
      trialDays: 0,
      pricePerDay: 493,
      pricePerMonth: 15000,
      digitalBookIncluded: true,
      fedorZoneIncluded: true,
      excelModulesDescription: 'El grado en curso. Todos los libros',
      familyPricing: {
        secondModulePrice: 120000,
        additionalModulePrice: 80000,
      },
      isActive: true,
      order: plans.length,
      badge: '',
      features: ['Libro digital completo', 'Zona Fedor completa', 'Módulos en Excel de cortesía'],
      isCustomQuote: false,
    });
    setFeatureInput('');
    setShowModal(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      billingPeriod: plan.billingPeriod,
      price: plan.price,
      trialDays: plan.trialDays || 0,
      pricePerDay: plan.pricePerDay || 0,
      pricePerMonth: plan.pricePerMonth || 0,
      digitalBookIncluded: plan.digitalBookIncluded ?? true,
      fedorZoneIncluded: plan.fedorZoneIncluded ?? true,
      excelModulesDescription: plan.excelModulesDescription || '',
      familyPricing: plan.familyPricing || {
        secondModulePrice: 120000,
        additionalModulePrice: 80000,
      },
      isActive: plan.isActive ?? true,
      order: plan.order || 0,
      badge: plan.badge || '',
      features: plan.features || [],
      isCustomQuote: plan.isCustomQuote || false,
    });
    setFeatureInput('');
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]/g, '');

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingPlan ? prev.slug : slug,
    }));
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()],
    }));
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('El nombre y el slug son obligatorios');
      return;
    }

    setSubmitting(true);
    try {
      if (editingPlan) {
        await planService.updatePlan(editingPlan._id, formData);
        toast.success(`Plan "${formData.name}" actualizado correctamente`);
      } else {
        await planService.createPlan(formData);
        toast.success(`Plan "${formData.name}" creado correctamente en MongoDB`);
      }
      setShowModal(false);
      loadPlans();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error al guardar el plan';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (plan: Plan) => {
    if (!confirm(`¿Estás seguro de eliminar el plan "${plan.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await planService.deletePlan(plan._id);
      toast.success(`Plan "${plan.name}" eliminado correctamente`);
      loadPlans();
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar el plan');
    }
  };

  const togglePlanActive = async (plan: Plan) => {
    try {
      await planService.updatePlan(plan._id, { isActive: !plan.isActive });
      toast.success(`Plan ${!plan.isActive ? 'activado' : 'desactivado'}`);
      loadPlans();
    } catch (err) {
      console.error(err);
      toast.error('Error al cambiar estado del plan');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <FiCreditCard className="w-6 h-6" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Administración de Planes de Pago</h1>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Gestiona y configura en MongoDB los precios, beneficios y descuentos familiares que verán los usuarios.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadPlans}
                disabled={loadingPlans}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Recargar planes"
              >
                <FiRefreshCw className={`w-4 h-4 ${loadingPlans ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Nuevo Plan</span>
              </button>
            </div>
          </div>

          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Planes</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{plans.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Planes Activos</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {plans.filter((p) => p.isActive).length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan Recomendado</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {plans.find((p) => p.slug === 'anual')?.name || 'Anual'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prueba Gratuita</span>
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                {plans.find((p) => p.billingPeriod === 'trial')?.trialDays || 17} Días
              </p>
            </div>
          </div>

          {/* Lista de Planes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiLayers className="w-4 h-4 text-emerald-500" />
                Catálogo de Planes en Base de Datos
              </h2>
              <span className="text-xs text-slate-500">{plans.length} planes registrados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Orden</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Tipo / Periodo</th>
                    <th className="py-3 px-4">Precio Total</th>
                    <th className="py-3 px-4">Anclaje (Día / Mes)</th>
                    <th className="py-3 px-4">Cortesía Excel</th>
                    <th className="py-3 px-4">Tarifa Familiar</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {plans.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono text-xs text-slate-400">{p.order}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                          {p.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">/{p.slug}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {p.billingPeriod}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                        {p.isCustomQuote
                          ? 'A Cotizar'
                          : p.price === 0
                          ? 'Gratis ($0)'
                          : `$${p.price.toLocaleString('es-CO')} COP`}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {p.isCustomQuote || p.price === 0 ? (
                          '—'
                        ) : (
                          <>
                            <div>${p.pricePerDay} / día</div>
                            <div className="text-[11px] text-slate-400">${p.pricePerMonth?.toLocaleString('es-CO')} / mes</div>
                          </>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={p.excelModulesDescription}>
                        {p.excelModulesDescription || '—'}
                      </td>
                      <td className="py-4 px-4 text-xs">
                        {p.familyPricing ? (
                          <div className="space-y-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                              2°: ${p.familyPricing.secondModulePrice.toLocaleString('es-CO')}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                              3°+: ${p.familyPricing.additionalModulePrice.toLocaleString('es-CO')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => togglePlanActive(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                            p.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {p.isActive ? <FiCheck className="w-3 h-3" /> : <FiX className="w-3 h-3" />}
                          {p.isActive ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Editar plan"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Eliminar plan"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Crear / Editar Plan */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {editingPlan ? `Editar Plan: ${editingPlan.name}` : 'Crear Nuevo Plan de Pago'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configuración persistida en la colección de MongoDB
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre y Slug */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                      Nombre del Plan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ej: Plan Anual Familiar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                      Slug identificador *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="ej: plan-anual"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Periodo de Facturación */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                      Periodo de Facturación
                    </label>
                    <select
                      value={formData.billingPeriod}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          billingPeriod: e.target.value as PlanBillingPeriod,
                          isCustomQuote: e.target.value === 'custom',
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="trial">Prueba (Gratis)</option>
                      <option value="monthly">Mensual</option>
                      <option value="semiannual">Semestral (6 meses)</option>
                      <option value="annual">Anual (12 meses)</option>
                      <option value="custom">Personalizado (Institución / A cotizar)</option>
                    </select>
                  </div>

                  {/* Precio Total COP */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                      Precio Total (COP)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                      disabled={formData.isCustomQuote}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </div>

                  {/* Días de Prueba y Precios Derivados */}
                  {formData.billingPeriod === 'trial' ? (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                        Días de prueba gratuita
                      </label>
                      <input
                        type="number"
                        value={formData.trialDays}
                        onChange={(e) => setFormData((prev) => ({ ...prev, trialDays: Number(e.target.value) }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                          Precio estimado por día ($/día)
                        </label>
                        <input
                          type="number"
                          value={formData.pricePerDay}
                          onChange={(e) => setFormData((prev) => ({ ...prev, pricePerDay: Number(e.target.value) }))}
                          placeholder="ej: 493"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                          Precio equivalente por mes ($/mes)
                        </label>
                        <input
                          type="number"
                          value={formData.pricePerMonth}
                          onChange={(e) => setFormData((prev) => ({ ...prev, pricePerMonth: Number(e.target.value) }))}
                          placeholder="ej: 15000"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Badge & Orden */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                      Insignia / Badge
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                      placeholder="ej: Más Popular · Ahorra 40%"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                      Orden de visualización
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                {/* Módulos en Excel Cortesía */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                    Descripción de cortesía en Excel
                  </label>
                  <input
                    type="text"
                    value={formData.excelModulesDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excelModulesDescription: e.target.value }))}
                    placeholder="ej: El grado en curso. Todos los libros"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                {/* CONFIGURACIÓN DE TARIFA FAMILIAR ESCALONADA (PARA PLAN ANUAL) */}
                {formData.billingPeriod === 'annual' && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                      <FiUsers className="w-4 h-4" />
                      <span>Configuración de Descuento Familiar Escalonado</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Costo del 2do Módulo adicional (COP)
                        </label>
                        <input
                          type="number"
                          value={formData.familyPricing?.secondModulePrice ?? 120000}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              familyPricing: {
                                secondModulePrice: Number(e.target.value),
                                additionalModulePrice: prev.familyPricing?.additionalModulePrice ?? 80000,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm"
                        />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                          Total 2 módulos: ${(formData.price + (formData.familyPricing?.secondModulePrice ?? 120000)).toLocaleString('es-CO')}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Costo a partir del 3er Módulo en adelante (COP c/u)
                        </label>
                        <input
                          type="number"
                          value={formData.familyPricing?.additionalModulePrice ?? 80000}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              familyPricing: {
                                secondModulePrice: prev.familyPricing?.secondModulePrice ?? 120000,
                                additionalModulePrice: Number(e.target.value),
                              },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm"
                        />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                          Total 3 módulos: ${(formData.price + (formData.familyPricing?.secondModulePrice ?? 120000) + (formData.familyPricing?.additionalModulePrice ?? 80000)).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features / Beneficios */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                    Beneficios del Plan
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                      placeholder="Escribe un beneficio y presiona Agregar"
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-slate-800 text-white dark:bg-slate-700 text-sm font-bold rounded-xl cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.features?.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-full border border-slate-200 dark:border-slate-700"
                      >
                        <span>{f}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estado Activo */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                    Plan Activo (Visible para los usuarios)
                  </label>
                </div>

                {/* Botones de acción del Modal */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Guardando...' : editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
