'use client';

import { useEffect, useState, use, Suspense } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { moduleService, Module } from '@/services/module.service';
import { authService } from '@/services/auth.service';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import crypto from 'crypto';
import { purchaseService, PurchaseTransaction } from '@/services/purchase.service';
import { couponService } from '@/services/coupon.service';
import { planService } from '@/services/plan.service';
import { Plan } from '@/types/plan.types';
import { isPurchaseExpired } from '@/constants/module-access.constants';
import PlanSelectModal from '@/components/pricing/PlanSelectModal';
import { trackMetaInitiateCheckout, trackMetaCouponApplied } from '@/lib/analytics/meta';
import { trackTikTokInitiateCheckout, trackTikTokApplyCoupon } from '@/lib/analytics/tiktok';
import { trackGTMBeginCheckout, trackGTMSelectPromotion } from '@/lib/analytics/google';
import { FiCheckCircle, FiUsers, FiLayers, FiShield } from 'react-icons/fi';

const getGradeNumber = (group?: string) => {
  const match = group?.match(/Grado(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const getStandardsPdfByGroup = (group?: string) => {
  const gradeNumber = getGradeNumber(group);

  if (gradeNumber && gradeNumber >= 1 && gradeNumber <= 11) {
    return `/Estandares-${gradeNumber}.pdf`;
  }

  return null;
};

// Interfaces para los tipos de Wompi
interface WompiPaymentMethod {
  type?: string;
  phoneNumber?: string;
  legal_id?: string;
  legal_id_type?: string;
}

interface WompiTransaction {
  id: string;
  status: string;
  paymentMethodType?: string;
  paymentMethod?: WompiPaymentMethod;
  customerNumberPrefix?: string;
  extra?: {
    externalIdentifier?: string;
    transactionId?: string;
  };
}

interface WompiCheckoutResult {
  transaction: WompiTransaction;
}

interface WompiCheckout {
  open: (callback: (result: WompiCheckoutResult) => void) => void;
}

declare global {
  interface Window {
    WidgetCheckout: new (config: {
      currency: string;
      amountInCents: number;
      reference: string;
      publicKey: string;
      signature: { integrity: string };
      redirectUrl: string;
      customerData: { email: string; fullName: string };
    }) => WompiCheckout;
  }
}

function BuyBookContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planSlugParam = searchParams.get('plan');
  const qtyParam = searchParams.get('qty');
  const initialQuantity = qtyParam ? parseInt(qtyParam, 10) : 1;

  // Estado del plan seleccionado directamente en la pantalla de pago
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>(planSlugParam || 'anual');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(initialQuantity);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const [module, setModule] = useState<Module | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePriorPurchases, setActivePriorPurchases] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<{ discount: number; discountType: 'percentage' | 'fixed' } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    if (planSlugParam) {
      setSelectedPlanSlug(planSlugParam);
    }
    if (qtyParam) {
      setSelectedQuantity(parseInt(qtyParam, 10) || 1);
    }
  }, [planSlugParam, qtyParam]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
          const redirectQuery = planSlugParam ? `?plan=${planSlugParam}&qty=${initialQuantity}` : '';
          router.push(`/login?redirect=/dashboard/buybooks/${id}${redirectQuery}`);
          return;
        }

        const user = authService.getCurrentUser();

        // Cargar módulos, planes y compras del usuario en paralelo
        const [modulesData, plansData] = await Promise.all([
          moduleService.getAllModules(),
          planService.getActivePlans().catch(() => []),
        ]);

        setPlans(plansData);

        if (user?.id) {
          try {
            const userPurchases = await purchaseService.getUserPurchases(user.id);
            const activePurchases = userPurchases.filter((p) => !isPurchaseExpired(p.purchase_date));
            setActivePriorPurchases(activePurchases.length);
          } catch (e) {
            console.error('Error al consultar compras activas del usuario:', e);
          }
        }

        const foundModule = modulesData.find((m) => m._id === id);

        if (foundModule) {
          setModule(foundModule);

          // Calcular precio inicial para eventos analíticos
          let initialPrice = foundModule.price || 203000;
          if (selectedPlanSlug === 'mensual') {
            initialPrice = 24999;
          } else if (selectedPlanSlug === 'semestral') {
            initialPrice = 109999;
          } else if (selectedPlanSlug === 'anual') {
            initialPrice = 179999;
          }

          trackMetaInitiateCheckout({
            content_ids: [foundModule._id],
            num_items: selectedQuantity,
            value: initialPrice,
            currency: 'COP',
          });
          trackTikTokInitiateCheckout({
            contents: [
              {
                content_id: foundModule._id,
                content_name: `${foundModule.title} (${selectedPlanSlug})`,
                content_type: 'product',
                price: initialPrice,
                quantity: selectedQuantity,
              },
            ],
            value: initialPrice,
            currency: 'COP',
          });
          trackGTMBeginCheckout({
            currency: 'COP',
            value: initialPrice,
            items: [
              {
                item_id: foundModule._id,
                item_name: `${foundModule.title} (${selectedPlanSlug})`,
                item_category: foundModule.group || 'Modulo',
                price: initialPrice,
                quantity: selectedQuantity,
              },
            ],
          });
        } else {
          setError('Módulo no encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el módulo');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [id, router]);

  const handleCouponValidation = async () => {
    if (!couponCode.trim()) {
      setCouponError('Por favor ingresa un código de cupón');
      return;
    }

    setValidatingCoupon(true);
    setCouponError(null);
    setCouponDiscount(null);

    try {
      const validation = await couponService.validateCoupon(couponCode.trim());

      if (validation.valid) {
        const discountValue = validation.value ?? validation.coupon?.value;
        const discountType = validation.discountType ?? validation.coupon?.discountType;

        if (discountValue !== undefined && discountValue !== null && discountType) {
          setCouponDiscount({
            discount: discountValue,
            discountType: discountType,
          });
          setCouponError(null);
          trackMetaCouponApplied({
            coupon: couponCode.trim(),
            discount: discountValue,
            currency: 'COP',
          });
          trackTikTokApplyCoupon({
            description: couponCode.trim(),
            value: discountValue,
            currency: 'COP',
          });
          trackGTMSelectPromotion({
            promotion_name: couponCode.trim(),
            creative_name: 'Cupon de Descuento',
          });
        } else {
          setCouponError(validation.message || 'El cupón no tiene los datos necesarios');
          setCouponDiscount(null);
        }
      } else {
        setCouponError(validation.message || 'El cupón no es válido');
        setCouponDiscount(null);
      }
    } catch (err) {
      console.error('Error al validar cupón:', err);
      setCouponError(err instanceof Error ? err.message : 'Error al validar el cupón');
      setCouponDiscount(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const calculateFinalPrice = () => {
    let basePrice = module?.price || 203000;

    if (selectedPlanSlug === 'mensual') {
      const plan = plans.find((p) => p.slug === 'mensual');
      basePrice = plan?.price || 24999;
    } else if (selectedPlanSlug === 'semestral') {
      const plan = plans.find((p) => p.slug === 'semestral');
      basePrice = plan?.price || 109999;
    } else if (selectedPlanSlug === 'anual') {
      const plan = plans.find((p) => p.slug === 'anual');
      const baseAnnual = plan?.price || 179999;
      const secondAnnual = plan?.familyPricing?.secondModulePrice || 120000;
      const additionalAnnual = plan?.familyPricing?.additionalModulePrice || 80000;

      const qty = Math.max(1, selectedQuantity);

      if (activePriorPurchases === 1) {
        if (qty === 1) {
          basePrice = secondAnnual;
        } else {
          basePrice = secondAnnual + (qty - 1) * additionalAnnual;
        }
      } else if (activePriorPurchases >= 2) {
        basePrice = qty * additionalAnnual;
      } else {
        if (qty <= 1) {
          basePrice = baseAnnual;
        } else if (qty === 2) {
          basePrice = baseAnnual + secondAnnual;
        } else {
          basePrice = baseAnnual + secondAnnual + (qty - 2) * additionalAnnual;
        }
      }
    }

    let finalPrice = basePrice;

    if (couponDiscount) {
      if (couponDiscount.discountType === 'percentage') {
        finalPrice = basePrice * (1 - couponDiscount.discount / 100);
      } else {
        finalPrice = Math.max(0, basePrice - couponDiscount.discount);
      }
    }

    return Math.round(finalPrice);
  };

  const handlePurchase = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado o datos incompletos');
      }

      // Validar cupón si se ingresó un código
      if (hasCoupon && couponCode.trim()) {
        setValidatingCoupon(true);
        try {
          const validation = await couponService.validateCoupon(couponCode.trim());

          if (!validation.valid) {
            setCouponError(validation.message || 'El cupón no es válido');
            setCouponDiscount(null);
            setValidatingCoupon(false);
            return;
          }

          const discountValue = validation.value ?? validation.coupon?.value;
          const discountType = validation.discountType ?? validation.coupon?.discountType;

          if (discountValue === undefined || discountValue === null || !discountType) {
            setCouponError(validation.message || 'El cupón no tiene los datos necesarios');
            setCouponDiscount(null);
            setValidatingCoupon(false);
            return;
          }

          setCouponDiscount({
            discount: discountValue,
            discountType: discountType,
          });
          setCouponError(null);
        } catch (err) {
          console.error('Error al validar cupón en compra:', err);
          setCouponError(err instanceof Error ? err.message : 'Error al validar el cupón');
          setCouponDiscount(null);
          setValidatingCoupon(false);
          return;
        } finally {
          setValidatingCoupon(false);
        }
      }

      const reference = `MOD${user.id}${Date.now()}`;
      const finalPrice = calculateFinalPrice();
      const amount = finalPrice * 100;
      const currency = 'COP';

      // Si el monto es 0 o menor (compra gratuita con cupón), registrar directamente sin Wompi
      if (amount <= 0) {
        try {
          const purchaseTransaction: PurchaseTransaction = {
            id: reference,
            payment_method_type: 'COUPON',
            payment_method: {
              type: 'COUPON',
              phone_number: '',
              phone_number_prefix: '',
              legal_id: '',
              legal_id_type: '',
              extra: {
                external_identifier: `PLAN_${selectedPlanSlug.toUpperCase()}_QTY_${selectedQuantity}`,
                transaction_id: couponCode.trim() || '',
              },
            },
            reference: reference,
            status: 'APPROVED',
          };

          if (!user.id) {
            throw new Error('ID de usuario no disponible');
          }

          await purchaseService.createPurchase(user.id, id, purchaseTransaction, undefined, finalPrice);
          window.location.href = `/dashboard/buybooks/thanks?id=${reference}`;
        } catch (err) {
          console.error('Error al guardar la compra gratuita:', err);
          setError(err instanceof Error ? err.message : 'Error al procesar la compra gratuita');
        }
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
      const secretKey = process.env.NEXT_PUBLIC_WOMPI_INTEGRITY;

      if (!publicKey) {
        throw new Error('Clave pública de Wompi no configurada');
      }

      if (!secretKey) {
        throw new Error('Clave secreta de Wompi no configurada');
      }

      const dataToHash = `${reference}${amount}${currency}${secretKey}`;
      const integrity = crypto
        .createHash('sha256')
        .update(dataToHash)
        .digest('hex');

      const checkout = new window.WidgetCheckout({
        currency: currency,
        amountInCents: amount,
        reference: reference,
        publicKey: publicKey,
        signature: {
          integrity: integrity,
        },
        redirectUrl: `${window.location.origin}/dashboard/buybooks/thanks`,
        customerData: {
          email: user.email,
          fullName: user.name,
        },
      });

      checkout.open(async (result: WompiCheckoutResult) => {
        const transaction = result.transaction;
        try {
          if (!transaction || !transaction.id) {
            throw new Error('Datos de transacción inválidos');
          }

          const purchaseTransaction: PurchaseTransaction = {
            id: transaction.id,
            payment_method_type: transaction.paymentMethodType || 'UNKNOWN',
            payment_method: {
              type: transaction.paymentMethod?.type || 'UNKNOWN',
              phone_number: transaction.paymentMethod?.phoneNumber || '',
              phone_number_prefix: transaction?.customerNumberPrefix || '',
              legal_id: transaction.paymentMethod?.legal_id || '',
              legal_id_type: transaction.paymentMethod?.legal_id_type || '',
              extra: {
                external_identifier: `PLAN_${selectedPlanSlug.toUpperCase()}_QTY_${selectedQuantity}`,
                transaction_id: transaction?.extra?.transactionId || '',
              },
            },
            reference: reference,
            status: transaction.status || 'PENDING',
          };

          if (!user.id) {
            throw new Error('ID de usuario no disponible');
          }

          await purchaseService.createPurchase(user.id, id, purchaseTransaction, undefined, finalPrice);
          window.location.href = `/dashboard/buybooks/thanks?id=${transaction.id}`;
        } catch (err) {
          console.error('Error al guardar la compra:', err);
        }
      });
    } catch (err) {
      console.error('Error al procesar la compra:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error || 'Módulo no encontrado'}</p>
        </div>
      </div>
    );
  }

  const standardsPdf = getStandardsPdfByGroup(module.group);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <Script
        src="https://checkout.wompi.co/widget.js"
        strategy="afterInteractive"
      />
      <div className="min-h-screen flex">
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="pt-12 px-4 sm:px-8 pb-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto border border-gray-100">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Confirmar Compra y Acceso</h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Personaliza tu plan y finaliza tu pago de forma 100% segura mediante Wompi.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
                    <FiShield className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">Pago Seguro Wompi (Bancolombia)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Columna Izquierda: Imagen del Módulo y Ficha */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full h-80 relative rounded-2xl bg-gradient-to-b from-orange-50 to-white p-4 border border-orange-100/60 flex items-center justify-center shadow-inner">
                      {module.image ? (
                        <Image
                          src={module.image.startsWith('/') ? module.image : `/${module.image}`}
                          alt={module.title}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <span className="text-7xl text-orange-500">📚</span>
                      )}
                    </div>
                    <div className="w-full mt-4 text-center">
                      <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Grado seleccionado · Plataforma Digital Interactiva
                      </p>
                    </div>

                    {standardsPdf && (
                      <div className="mt-5 w-full">
                        <button
                          type="button"
                          onClick={() => setShowPdf((current) => !current)}
                          className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          <FiLayers />
                          <span>{showPdf ? 'Ocultar Estándares y Competencias' : 'Ver Estándares y Competencias (PDF)'}</span>
                        </button>

                        {showPdf && (
                          <div className="mt-3 w-full h-72 overflow-hidden rounded-xl border shadow-sm">
                            <iframe
                              src={standardsPdf}
                              className="h-full w-full"
                              title="Estándares y competencias"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Columna Derecha: Selección de Plan y Checkout */}
                  <div className="lg:col-span-7">
                    {/* Selector de Plan en la Página */}
                    <div className="mb-6 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-black uppercase tracking-wider text-orange-600">
                          1. Selecciona tu Plan de Acceso
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsPlanModalOpen(true)}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                        >
                          Ver detalles de planes ↗
                        </button>
                      </div>

                      {/* 3 Opciones de Planes */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Mensual */}
                        <div
                          onClick={() => setSelectedPlanSlug('mensual')}
                          className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPlanSlug === 'mensual'
                              ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-400/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-gray-800">Mensual</span>
                            {selectedPlanSlug === 'mensual' && (
                              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-black text-gray-900">$24.999</div>
                          <span className="text-[10px] text-gray-500">COP / 30 días</span>
                        </div>

                        {/* Semestral */}
                        <div
                          onClick={() => setSelectedPlanSlug('semestral')}
                          className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPlanSlug === 'semestral'
                              ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-400/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-gray-800">Semestral</span>
                            {selectedPlanSlug === 'semestral' && (
                              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-black text-gray-900">$109.999</div>
                          <span className="text-[10px] text-gray-500">6 meses · $18.333/mes</span>
                        </div>

                        {/* Anual */}
                        <div
                          onClick={() => setSelectedPlanSlug('anual')}
                          className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPlanSlug === 'anual'
                              ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-400/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="absolute -top-2.5 right-2 bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                            Familiar
                          </span>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-gray-800">Anual</span>
                            {selectedPlanSlug === 'anual' && (
                              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-black text-orange-600">
                            {activePriorPurchases === 1
                              ? '$120.000'
                              : activePriorPurchases >= 2
                              ? '$80.000'
                              : '$179.999'}
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold">⚡ $15.000/mes</span>
                        </div>
                      </div>

                      {/* Contador Dinámico Familiar si es Anual */}
                      {selectedPlanSlug === 'anual' && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                                <FiUsers className="text-orange-500" />
                                <span>Cantidad de Grados o Hijos (Plan Familiar):</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                2do grado a $120.000 · 3ero en adelante a $80.000 c/u.
                              </p>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                              <button
                                type="button"
                                onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                                disabled={selectedQuantity <= 1}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition"
                              >
                                -
                              </button>
                              <span className="w-7 text-center font-black text-sm text-gray-900">
                                {selectedQuantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedQuantity((q) => q + 1)}
                                className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black flex items-center justify-center transition"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {(selectedQuantity > 1 || activePriorPurchases > 0) && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <FiCheckCircle className="text-emerald-600 flex-shrink-0" />
                              <span>
                                {activePriorPurchases > 0
                                  ? `¡Beneficio Familiar Reconocido! Al tener ${activePriorPurchases} compra(s) activa(s), accedes a tarifa preferencial.`
                                  : `¡Descuento Familiar Aplicado para ${selectedQuantity} grados!`}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Paso 2: Cupón de Descuento */}
                    <div className="mb-6">
                      <label className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasCoupon}
                          onChange={(e) => {
                            setHasCoupon(e.target.checked);
                            if (!e.target.checked) {
                              setCouponCode('');
                              setCouponError(null);
                              setCouponDiscount(null);
                            }
                          }}
                          className="mr-2 w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">¿Tienes un código de cupón?</span>
                      </label>

                      {hasCoupon && (
                        <div className="mt-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="Ingresa código del cupón"
                              className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg text-sm uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-black"
                              disabled={validatingCoupon}
                            />
                            <button
                              type="button"
                              onClick={handleCouponValidation}
                              disabled={validatingCoupon || !couponCode.trim()}
                              className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold text-xs transition disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {validatingCoupon ? 'Validando...' : 'Aplicar Cupón'}
                            </button>
                          </div>

                          {couponError && (
                            <p className="mt-2 text-xs text-red-600 font-medium">{couponError}</p>
                          )}

                          {couponDiscount && !couponError && (
                            <div className="mt-2 p-2.5 bg-emerald-100 rounded-lg">
                              <p className="text-xs text-emerald-800 font-bold">
                                ✓ Cupón aplicado: {couponDiscount.discountType === 'percentage'
                                  ? `${couponDiscount.discount}% de descuento`
                                  : `${couponDiscount.discount} COP de descuento`}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Paso 3: Total y Botón Wompi */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-xs text-gray-400 font-medium line-through">
                            Precio de referencia: ${(module.price || 203000).toLocaleString('es-CO')} COP
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-3xl sm:text-4xl font-black text-gray-900">
                              ${calculateFinalPrice().toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-xs font-extrabold text-orange-600 uppercase ml-1">
                              COP · {selectedPlanSlug === 'anual' ? `Anual (${selectedQuantity} ${selectedQuantity > 1 ? 'grados' : 'grado'})` : selectedPlanSlug}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handlePurchase}
                          disabled={
                            validatingCoupon ||
                            (hasCoupon && couponCode.trim().length > 0 && !couponDiscount)
                          }
                          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-black text-base shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap text-center"
                        >
                          {validatingCoupon ? 'Validando...' : 'Pagar con Wompi →'}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-3 text-center sm:text-left">
                        🔒 Al hacer clic serás conectado a la pasarela cifrada de Wompi. Acepta tarjetas débito/crédito, PSE, Nequi y Bancolombia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Selección Detallada de Plan */}
      {module && (
        <PlanSelectModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          module={module}
          onConfirmPlan={(plan, qty) => {
            setSelectedPlanSlug(plan.slug);
            setSelectedQuantity(qty);
            setIsPlanModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default function BuyBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <BuyBookContent id={id} />
    </Suspense>
  );
}
