'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Module } from '@/services/module.service';
import { Plan, PlanBillingPeriod } from '@/types/plan.types';
import { planService } from '@/services/plan.service';
import { authService } from '@/services/auth.service';
import { purchaseService } from '@/services/purchase.service';
import { isPurchaseExpired } from '@/constants/module-access.constants';
import {
  FiX,
  FiCheck,
  FiStar,
  FiUsers,
  FiGift,
  FiShield,
  FiPlus,
  FiMinus,
  FiLock,
  FiArrowRight,
} from 'react-icons/fi';

interface PlanSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module;
  onConfirmPlan: (plan: Plan, quantity: number, calculatedPrice: number) => void;
}

export default function PlanSelectModal({
  isOpen,
  onClose,
  module,
  onConfirmPlan,
}: PlanSelectModalProps) {
  const t = useTranslations('plans');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>('anual');
  const [modulesCount, setModulesCount] = useState<number>(1);
  const [activePriorPurchases, setActivePriorPurchases] = useState<number>(0);
  const [loadingUserPurchases, setLoadingUserPurchases] = useState<boolean>(true);

  // Precios base
  const baseAnnual = 179999;
  const secondAnnual = 120000;
  const additionalAnnual = 80000;

  useEffect(() => {
    if (!isOpen) return;

    // Cargar planes
    planService.getActivePlans().then((data) => {
      setPlans(data);
    });

    // Detectar compras previas del usuario si está autenticado
    const user = authService.getCurrentUser();
    if (user && user.id) {
      setLoadingUserPurchases(true);
      purchaseService
        .getUserPurchases(user.id)
        .then((purchases) => {
          const activePurchases = purchases.filter((p) => !isPurchaseExpired(p.purchase_date));
          setActivePriorPurchases(activePurchases.length);
        })
        .catch(() => setActivePriorPurchases(0))
        .finally(() => setLoadingUserPurchases(false));
    } else {
      setActivePriorPurchases(0);
      setLoadingUserPurchases(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Cálculo del precio anual dinámico (contemplando compras previas si las hay)
  const calculateAnnualPrice = (qty: number) => {
    // Si el usuario ya tiene 1 o más compras activas en el año
    if (activePriorPurchases === 1) {
      // Este nuevo grado es el 2° para la familia
      if (qty === 1) return secondAnnual; // 120.000
      return secondAnnual + (qty - 1) * additionalAnnual; // 120k + 80k c/u
    } else if (activePriorPurchases >= 2) {
      // Este nuevo grado es el 3° o superior
      return qty * additionalAnnual; // 80k c/u
    }

    // Usuario sin compras previas (compra de paquete familiar nuevo)
    if (qty <= 1) return baseAnnual;
    if (qty === 2) return baseAnnual + secondAnnual; // 299.999
    return baseAnnual + secondAnnual + (qty - 2) * additionalAnnual; // 379.999 para 3, +80k
  };

  const currentPlan =
    plans.find((p) => p.slug === selectedPlanSlug) ||
    ({
      _id: 'default',
      name: selectedPlanSlug === 'mensual' ? 'Mensual' : selectedPlanSlug === 'semestral' ? 'Semestral' : 'Anual',
      slug: selectedPlanSlug,
      billingPeriod: selectedPlanSlug as PlanBillingPeriod,
      price: selectedPlanSlug === 'mensual' ? 24999 : selectedPlanSlug === 'semestral' ? 109999 : baseAnnual,
    } as Plan);

  let finalPrice = currentPlan.price || 0;
  if (selectedPlanSlug === 'anual') {
    finalPrice = calculateAnnualPrice(modulesCount);
  }

  const handleConfirm = () => {
    const qty = selectedPlanSlug === 'anual' ? modulesCount : 1;
    onConfirmPlan(currentPlan, qty, finalPrice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 relative">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={t('modal.close_aria')}
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="inline-block text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full mb-2 border border-orange-200/50">
            {t('modal.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('modal.title', { title: module.title })}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('modal.subtitle')}
          </p>
        </div>

        {/* ALERTA DE BENEFICIO FAMILIAR POR RE-COMPRA (Si ya compró este año) */}
        {activePriorPurchases > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 flex items-start gap-3">
            <span className="p-2 bg-emerald-500 text-white rounded-xl shrink-0 mt-0.5">
              <FiUsers className="w-4 h-4" />
            </span>
            <div className="text-xs sm:text-sm">
              <p className="font-extrabold text-emerald-800 dark:text-emerald-300">
                {t('modal.family_benefit_title')}
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
                {t.rich('modal.family_benefit_desc', {
                  count: activePriorPurchases,
                  price: (activePriorPurchases === 1 ? secondAnnual : additionalAnnual).toLocaleString('es-CO'),
                  strong1: (chunks) => (
                    <strong className="font-black text-emerald-900 dark:text-emerald-200">
                      {chunks}
                    </strong>
                  ),
                })}
              </p>
            </div>
          </div>
        )}

        {/* 3 Opciones de Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Opción 1: Mensual */}
          <div
            onClick={() => setSelectedPlanSlug('mensual')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanSlug === 'mensual'
                ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('monthly.title')}</span>
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlanSlug === 'mensual'}
                  onChange={() => setSelectedPlanSlug('mensual')}
                  className="accent-orange-500"
                />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">$24.999</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('monthly.period')} ({t('monthly.daily_estimate')})</p>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              {t('modal.monthly_excel_perk')}
            </p>
          </div>

          {/* Opción 2: Semestral */}
          <div
            onClick={() => setSelectedPlanSlug('semestral')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanSlug === 'semestral'
                ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('semestral.title')}</span>
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlanSlug === 'semestral'}
                  onChange={() => setSelectedPlanSlug('semestral')}
                  className="accent-blue-500"
                />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">$109.999</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('semestral.period')} ({t('semestral.monthly_estimate')})</p>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              {t('modal.semestral_excel_perk')}
            </p>
          </div>

          {/* Opción 3: Anual (DESTACADA CON CONTADOR) */}
          <div
            onClick={() => setSelectedPlanSlug('anual')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedPlanSlug === 'anual'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 shadow-lg shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
            }`}
          >
            <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              {t('modal.most_popular_badge')}
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-slate-900 dark:text-white">{t('annual.title')}</span>
              <input
                type="radio"
                name="plan"
                checked={selectedPlanSlug === 'anual'}
                onChange={() => setSelectedPlanSlug('anual')}
                className="accent-emerald-600"
              />
            </div>

            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ${(selectedPlanSlug === 'anual' ? finalPrice : baseAnnual).toLocaleString('es-CO')}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('modal.annual_school_year')}</p>

            {/* CONTADOR DE MÓDULOS / HIJOS INTEGRADO */}
            {selectedPlanSlug === 'anual' && (
              <div
                className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800/60"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1">
                    <FiUsers className="w-3.5 h-3.5 text-emerald-600" />
                    {t('modal.how_many_grades')}
                  </span>
                  <span className="text-emerald-600 font-extrabold">{t('modal.grades_count', { count: modulesCount })}</span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-1 rounded-xl border border-emerald-200 dark:border-emerald-700">
                  <button
                    type="button"
                    onClick={() => setModulesCount((p) => Math.max(1, p - 1))}
                    disabled={modulesCount <= 1}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center font-bold disabled:opacity-30 cursor-pointer"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {modulesCount} {modulesCount === 1 ? t('modal.student_grade_single') : t('modal.student_grade_multi')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModulesCount((p) => p + 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {modulesCount === 1 && activePriorPurchases === 0 && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                    {t.rich('modal.annual_tip_2nd', {
                      strong1: (chunks) => <strong className="text-emerald-600">{chunks}</strong>,
                    })}
                  </p>
                )}
                {modulesCount >= 2 && activePriorPurchases === 0 && (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold mt-1.5">
                    {t('modal.annual_total_saved', {
                      amount: (modulesCount * baseAnnual - finalPrice).toLocaleString('es-CO'),
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resumen del Valor */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('modal.total_to_pay')}</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ${finalPrice.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">COP</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              {t('modal.no_hidden_fees')}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FiShield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t('modal.secure_payment_wompi')}</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t('modal.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('modal.continue_payment')}</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
