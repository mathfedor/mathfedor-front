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

  const handlePurchase = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado o datos incompletos');
      }

      const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
      const secretKey = process.env.NEXT_PUBLIC_WOMPI_INTEGRITY;
      
      if (!publicKey) {
        throw new Error('Clave pública de Wompi no configurada');
      }
      
      if (!secretKey) {
        throw new Error('Clave secreta de Wompi no configurada');
      }

      const reference = `MOD${user.id}${Date.now()}`;
      const amount = module?.price ? module.price * 100 : 0;
      const currency = 'COP';

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
          router.push(`/dashboard/buybooks/thanks?id=${transaction.id}`);
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
                    <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
                    <div
                      className="text-gray-600 mb-6 whitespace-pre-line prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: module.description.replace(/\n/g, '<br/>') }}
                    />

                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-3xl font-bold text-orange-500">${module.price}</span>
                        <button
                          onClick={handlePurchase}
                          className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold"
                        >
                          Pagar
                        </button>
                      </div>
                    </div>
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