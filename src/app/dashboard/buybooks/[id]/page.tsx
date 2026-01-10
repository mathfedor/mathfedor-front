'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { moduleService, Module } from '@/services/module.service';
import { authService } from '@/services/auth.service';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import crypto from 'crypto';
import { purchaseService, PurchaseTransaction } from '@/services/purchase.service';
import { couponService } from '@/services/coupon.service';

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

export default function BuyBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<{ discount: number; discountType: 'percentage' | 'fixed' } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchModule = async () => {
      try {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
          router.push(`/login?redirect=/dashboard/buybooks/${id}`);
          return;
        }

        // Obtener datos del módulo
        const modules = await moduleService.getAllModules();
        const foundModule = modules.find(m => m._id === id);

        if (foundModule) {
          setModule(foundModule);
        } else {
          setError('Módulo no encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el módulo');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchModule();
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

      console.log('Respuesta de validación:', validation);

      if (validation.valid) {
        // Los valores pueden estar directamente en validation o dentro de validation.coupon
        const discountValue = validation.value ?? validation.coupon?.value;
        const discountType = validation.discountType ?? validation.coupon?.discountType;

        // Verificar que los valores requeridos estén presentes
        if (discountValue !== undefined && discountValue !== null && discountType) {
          setCouponDiscount({
            discount: discountValue,
            discountType: discountType
          });
          setCouponError(null);
        } else {
          setCouponError(validation.message || 'El cupón no tiene los datos necesarios');
          setCouponDiscount(null);
        }
      } else {
        setCouponError(validation.message || 'El cupón no es válido');
        setCouponDiscount(null);
      }
    } catch (error) {
      console.error('Error al validar cupón:', error);
      setCouponError(error instanceof Error ? error.message : 'Error al validar el cupón');
      setCouponDiscount(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!module?.price) return 0;

    let finalPrice = module.price;

    if (couponDiscount) {
      if (couponDiscount.discountType === 'percentage') {
        finalPrice = module.price * (1 - couponDiscount.discount / 100);
      } else {
        finalPrice = Math.max(0, module.price - couponDiscount.discount);
      }
    }

    return finalPrice;
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

          // Los valores pueden estar directamente en validation o dentro de validation.coupon
          const discountValue = validation.value ?? validation.coupon?.value;
          const discountType = validation.discountType ?? validation.coupon?.discountType;

          // Verificar que los valores requeridos estén presentes
          if (discountValue === undefined || discountValue === null || !discountType) {
            setCouponError(validation.message || 'El cupón no tiene los datos necesarios');
            setCouponDiscount(null);
            setValidatingCoupon(false);
            return;
          }

          setCouponDiscount({
            discount: discountValue,
            discountType: discountType
          });
          setCouponError(null);
        } catch (error) {
          console.error('Error al validar cupón en compra:', error);
          setCouponError(error instanceof Error ? error.message : 'Error al validar el cupón');
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
          // Crear la transacción de compra con método de pago COUPON
          const purchaseTransaction: PurchaseTransaction = {
            id: reference, // El id es igual al reference cuando es cupón
            payment_method_type: 'COUPON',
            payment_method: {
              type: 'COUPON',
              phone_number: '',
              phone_number_prefix: '',
              legal_id: '',
              legal_id_type: '',
              extra: {
                external_identifier: '',
                transaction_id: couponCode.trim() || '' // Guardar el código del cupón
              }
            },
            reference: reference,
            status: 'APPROVED' // Las compras con cupón se aprueban automáticamente
          };

          // Validar user.id nuevamente
          if (!user.id) {
            throw new Error('ID de usuario no disponible');
          }

          await purchaseService.createPurchase(user.id, id, purchaseTransaction);

          // Redirigir a la página de gracias
          window.location.href = `/dashboard/buybooks/thanks?id=${reference}`;
        } catch (error) {
          console.error('Error al guardar la compra gratuita:', error);
          setError(error instanceof Error ? error.message : 'Error al procesar la compra gratuita');
          // Aquí podrías mostrar un mensaje de error al usuario
        }
        return; // Salir de la función, no continuar con Wompi
      }

      // Si el monto es mayor a 0, proceder con Wompi
      // Verificar las claves de Wompi solo cuando es necesario
      const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
      const secretKey = process.env.NEXT_PUBLIC_WOMPI_INTEGRITY;

      if (!publicKey) {
        throw new Error('Clave pública de Wompi no configurada');
      }

      if (!secretKey) {
        throw new Error('Clave secreta de Wompi no configurada');
      }

      // Generar hash SHA256
      const dataToHash = `${reference}${amount}${currency}${secretKey}`;
      const integrity = crypto
        .createHash('sha256')
        .update(dataToHash)
        .digest('hex');

      // Crear instancia del checkout
      const checkout = new window.WidgetCheckout({
        currency: currency,
        amountInCents: amount,
        reference: reference,
        publicKey: publicKey,
        signature: {
          integrity: integrity
        },
        redirectUrl: `${window.location.origin}/dashboard/buybooks/thanks`,
        customerData: {
          email: user.email,
          fullName: user.name
        }
      });

      // Abrir el widget
      checkout.open(async (result: WompiCheckoutResult) => {
        const transaction = result.transaction;
        console.log("Transaction:", transaction);
        try {
          // Validar que la transacción tenga los datos necesarios
          if (!transaction || !transaction.id) {
            throw new Error('Datos de transacción inválidos');
          }

          // Guardar la compra en la base de datos
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
                external_identifier: transaction?.extra?.externalIdentifier || '',
                transaction_id: transaction?.extra?.transactionId || ''
              }
            },
            reference: reference,
            status: transaction.status || 'PENDING'
          };

          // Validar user.id nuevamente dentro del callback
          if (!user.id) {
            throw new Error('ID de usuario no disponible');
          }

          await purchaseService.createPurchase(user.id, id, purchaseTransaction);

          // Redirigir a la página de gracias
          window.location.href = `/dashboard/buybooks/thanks?id=${transaction.id}`;
        } catch (error) {
          console.error('Error al guardar la compra:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
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
          <div className="pt-12 px-8 pb-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Confirmar Compra</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="h-[400px] relative mb-4">
                      {module.image ? (
                        <Image
                          src={module.image.startsWith('/') ? module.image : `/${module.image}`}
                          alt={module.title}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="h-full bg-orange-100 flex items-center justify-center">
                          <span className="text-8xl text-orange-500">📚</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-6">{module.title}</h2>
                    
                    {/* Precio y elementos de pago movidos arriba */}
                    <div className="border-b pb-6 mb-6">
                      {/* Campo de cupón */}
                      <div className="mb-6">
                        <label className="flex items-center mb-3">
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
                            className="mr-2 w-4 h-4"
                          />
                          <span className="text-gray-700 dark:text-gray-300">¿Tienes un código de cupón?</span>
                        </label>

                        {hasCoupon && (
                          <div className="mt-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Ingresa el código del cupón"
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                                disabled={validatingCoupon}
                              />
                              <button
                                type="button"
                                onClick={handleCouponValidation}
                                disabled={validatingCoupon || !couponCode.trim()}
                                className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {validatingCoupon ? 'Validando...' : 'Validar'}
                              </button>
                            </div>

                            {couponError && (
                              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{couponError}</p>
                            )}

                            {couponDiscount && !couponError && (
                              <div className="mt-2 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                  ✓ Cupón aplicado: {couponDiscount.discountType === 'percentage'
                                    ? `${couponDiscount.discount}% de descuento`
                                    : `${couponDiscount.discount} de descuento`}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Precio y botón de pago */}
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex flex-col">
                            {couponDiscount && (
                              <div className="text-lg text-gray-500 line-through mb-1">
                                ${module.price?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </div>
                            )}
                            <span className="text-3xl font-bold text-orange-500">
                              ${calculateFinalPrice().toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handlePurchase}
                          disabled={
                            validatingCoupon ||
                            (hasCoupon && couponCode.trim().length > 0 && !couponDiscount)
                          }
                          className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {validatingCoupon ? 'Validando...' : 'Pagar'}
                        </button>
                      </div>
                    </div>

                    {/* Descripción movida abajo */}
                    <div
                      className="text-gray-600 mb-6 whitespace-pre-line prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: module.description.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}