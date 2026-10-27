'use client';

import React, { useState } from 'react';
import { Plan } from '@/types/plan.types';
import { FiCheck, FiStar, FiPlus, FiMinus, FiArrowRight, FiShield, FiGift, FiAward, FiUsers } from 'react-icons/fi';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface PricingSectionProps {
  plans?: Plan[];
  onSelectPlan?: (plan: Plan, quantity?: number) => void;
  className?: string;
  showTrialBanner?: boolean;
}

export default function PricingSection({
  plans,
  onSelectPlan,
  className = '',
  showTrialBanner = true,
}: PricingSectionProps) {
  const router = useRouter();
  const t = useTranslations('plans');
  const [annualModulesCount, setAnnualModulesCount] = useState<number>(1);

  // Precios configurables para cálculo familiar
  const baseAnnualPrice = 179999;
  const secondModulePrice = 120000;
  const additionalModulePrice = 80000;

  // Cálculo dinámico para la Opción 2
  const calculateAnnualTotal = (count: number) => {
    if (count <= 1) return baseAnnualPrice;
    if (count === 2) return baseAnnualPrice + secondModulePrice; // 299.999
    return baseAnnualPrice + secondModulePrice + (count - 2) * additionalModulePrice; // 379.999 para 3, +80k c/u
  };

  const annualTotal = calculateAnnualTotal(annualModulesCount);
  const annualSavings = annualModulesCount > 1 ? annualModulesCount * baseAnnualPrice - annualTotal : 0;

  const handleSelect = (planSlug: string, quantity = 1) => {
    if (onSelectPlan && plans) {
      const selected = plans.find((p) => p.slug === planSlug);
      if (selected) {
        onSelectPlan(selected, quantity);
        return;
      }
    }
    // Redirigir por defecto al flujo de compra o registro
    if (planSlug === 'prueba-17-dias') {
      router.push('/registro');
    } else if (planSlug === 'institucion') {
      window.open(
        'https://wa.me/573107199897?text=Hola,%20quisiera%20solicitar%20una%20cotizaci%C3%B3n%20institucional%20para%20mi%20colegio',
        '_blank'
      );
    } else {
      router.push(`/dashboard/buybooks?plan=${planSlug}&qty=${quantity}`);
    }
  };

  return (
    <section className={`w-full py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 mb-3">
            <FiAward className="w-3.5 h-3.5" />
            {t('header.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('header.title')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Banner de Prueba Gratis (17 días) */}
        {showTrialBanner && (
          <div className="mb-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-400/20">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <FiStar className="w-3.5 h-3.5 fill-current" /> {t('trial_banner.badge')}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">{t('trial_banner.title')}</h3>
              <p className="text-emerald-50 text-sm sm:text-base max-w-xl">
                {t('trial_banner.description')}
              </p>
            </div>
            <button
              onClick={() => handleSelect('prueba-17-dias')}
              className="px-6 py-3.5 bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap text-sm sm:text-base cursor-pointer"
            >
              {t('trial_banner.button')}
            </button>
          </div>
        )}

        {/* Cuadrícula de Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {/* 1. Plan Mensual */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('monthly.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('monthly.subtitle')}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">$24.999</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('monthly.period')}</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                <span>⚡</span> {t('monthly.daily_estimate')}
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8 flex-1">
              <li className="flex items-start gap-2.5">
                <FiCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{t('monthly.feature_book')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{t('monthly.feature_zone')}</span>
              </li>
              <li className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                <FiGift className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                  {t('monthly.feature_excel')}
                </span>
              </li>
            </ul>

            <button
              onClick={() => handleSelect('mensual', 1)}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
            >
              {t('monthly.button')}
            </button>
          </div>

          {/* 2. Plan Semestral */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('semestral.title')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('semestral.subtitle')}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {t('semestral.save_badge')}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">$109.999</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('semestral.period')}</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                <span>⚡</span> {t('semestral.monthly_estimate')}
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8 flex-1">
              <li className="flex items-start gap-2.5">
                <FiCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{t('semestral.feature_book')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{t('semestral.feature_zone')}</span>
              </li>
              <li className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                <FiGift className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  {t('semestral.feature_excel')}
                </span>
              </li>
            </ul>

            <button
              onClick={() => handleSelect('semestral', 1)}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
            >
              {t('semestral.button')}
            </button>
          </div>

          {/* 3. Plan Anual (HERO - CONTADOR DINÁMICO INTEGRADO) */}
          <div className="relative flex flex-col bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-800/80 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10">
            {/* Badge superior destacado */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
              {t('annual.badge_top')}
            </div>

            <div className="mb-4 mt-2 flex justify-between items-start">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {t('annual.title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('annual.subtitle')}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                {t('annual.save_badge')}
              </span>
            </div>

            {/* CONTADOR DINÁMICO DE MÓDULOS / GRADOS */}
            <div className="my-3 bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <FiUsers className="w-3.5 h-3.5 text-emerald-600" />
                  {t('annual.stepper_title')}
                </span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {annualModulesCount} {annualModulesCount === 1 ? t('annual.grade_singular') : t('annual.grade_plural')}
                </span>
              </div>

              {/* Controles de Stepper */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setAnnualModulesCount((prev) => Math.max(1, prev - 1))}
                  disabled={annualModulesCount <= 1}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Restar módulo"
                  aria-label="Restar módulo"
                >
                  <FiMinus className="w-4 h-4" />
                </button>

                <div className="flex-1 text-center font-extrabold text-slate-900 dark:text-white text-base">
                  {annualModulesCount === 1 && t('annual.student_1')}
                  {annualModulesCount === 2 && t('annual.student_2')}
                  {annualModulesCount >= 3 && t('annual.students_multi', { count: annualModulesCount })}
                </div>

                <button
                  type="button"
                  onClick={() => setAnnualModulesCount((prev) => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  title="Sumar módulo"
                  aria-label="Sumar módulo"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Micro-incentivo persuasivo debajo del selector */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                {annualModulesCount === 1 && (
                  <p className="text-slate-600 dark:text-slate-300">
                    {t('annual.tip_1')}
                  </p>
                )}
                {annualModulesCount === 2 && (
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                    {t('annual.tip_2')}
                  </p>
                )}
                {annualModulesCount >= 3 && (
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                    {t('annual.tip_3')}
                  </p>
                )}
              </div>
            </div>

            {/* Precio Total Dinámico */}
            <div className="my-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  ${annualTotal.toLocaleString('es-CO')}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('annual.period')}</span>
              </div>

              {/* Desglose / Ahorro según cantidad */}
              {annualModulesCount === 1 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {t('annual.daily_estimate')}
                </p>
              ) : (
                <div className="mt-1 flex flex-wrap gap-1.5 items-center">
                  <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                    {t('annual.you_save', { amount: annualSavings.toLocaleString('es-CO') })}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    (1° $179.999 + 2° $120.000
                    {annualModulesCount > 2 ? ` + ${annualModulesCount - 2}x $80.000` : ''})
                  </span>
                </div>
              )}
            </div>

            {/* Lista de Beneficios */}
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
              <li className="flex items-start gap-2.5 font-medium">
                <FiCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{t('annual.feature_book', { count: annualModulesCount })}</span>
              </li>
              <li className="flex items-start gap-2.5 font-medium">
                <FiCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{t('annual.feature_zone')}</span>
              </li>
              <li className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-300/60 dark:border-emerald-700/40 font-medium">
                <FiGift className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-xs text-emerald-950 dark:text-emerald-200">
                  {t('annual.feature_excel')}
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <FiShield className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>{t('annual.feature_warranty')}</span>
              </li>
            </ul>

            {/* Botón CTA Anual */}
            <button
              onClick={() => handleSelect('anual', annualModulesCount)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>{t('annual.button', { count: annualModulesCount, modules: annualModulesCount === 1 ? t('annual.module_singular') : t('annual.module_plural') })}</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tarjeta B2B: Colegios e Instituciones */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {t('institutions.badge')}
            </span>
            <h3 className="text-2xl font-bold">{t('institutions.title')}</h3>
            <p className="text-slate-300 text-sm max-w-2xl">
              {t('institutions.description')}
            </p>
          </div>
          <button
            onClick={() => handleSelect('institucion')}
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold rounded-xl shadow-lg transition-all whitespace-nowrap text-sm cursor-pointer"
          >
            {t('institutions.button')}
          </button>
        </div>

        {/* Sellos de Confianza y Medios de Pago */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <FiShield className="w-4 h-4 text-emerald-500" />
              {t('trust.encrypted')}
            </span>
            <span>•</span>
            <span>{t('trust.methods')}</span>
            <span>•</span>
            <span>{t('trust.instant')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

