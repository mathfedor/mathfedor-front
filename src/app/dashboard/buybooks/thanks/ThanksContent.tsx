'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';

interface TransactionResponse {
  data: {
    id: string;
    status: string;
    amount_in_cents: number;
    currency: string;
    reference: string;
    created_at: string;
    finalized_at: string;
    payment_method: {
      type: string;
      extra: {
        card_brand?: string;
        last_four?: string;
      };
    };
  };
}

function ThanksContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTransaction = async () => {
      try {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const transactionId = searchParams.get('id');
        if (!transactionId) {
          throw new Error('ID de transacción no encontrado');
        }

        // Si el ID contiene "MOD", es una compra con cupón (gratuita), no hacer fetch a Wompi
        if (transactionId.includes('MOD')) {
          // Crear objeto de transacción para compra con cupón
          const couponTransaction: TransactionResponse['data'] = {
            id: transactionId,
            status: 'APPROVED',
            amount_in_cents: 0, // Las compras con cupón que resultan en amount <= 0 son gratuitas
            currency: 'COP',
            reference: transactionId,
            created_at: new Date().toISOString(),
            finalized_at: new Date().toISOString(),
            payment_method: {
              type: 'COUPON',
              extra: {}
            }
          };
          
          console.log("Coupon transaction data:", couponTransaction);
          setTransaction(couponTransaction);
          setIsLoading(false);
          return;
        }

        // Si no contiene "MOD", es una transacción de Wompi, hacer fetch
        const wompiBaseUrl = process.env.WOMPI_ENVIRONMENT === 'PROD' 
          ? 'https://production.wompi.co/v1'
          : 'https://sandbox.wompi.co/v1';

        const response = await fetch(`${wompiBaseUrl}/transactions/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al verificar la transacción');
        }

        const data: TransactionResponse = await response.json();
        console.log("Transaction data:", data);
        setTransaction(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al verificar la transacción');
      } finally {
        setIsLoading(false);
      }
    };

    checkTransaction();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 bg-[#F9F9F9]">
            <div className="pt-12 px-8 pb-8">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Verificando tu transacción...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 bg-[#F9F9F9]">
            <div className="pt-12 px-8 pb-8">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-red-500 text-5xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = transaction?.status === 'APPROVED';

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="pt-12 px-8 pb-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {isSuccess ? (
                <>
                  <div className="text-green-500 text-5xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
                  <p className="text-gray-600 mb-4">
                    Tu transacción ha sido procesada correctamente. Ya tienes acceso a todos los módulos.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-green-800 mb-2">Detalles de la transacción:</h3>
                    <p className="text-sm text-green-700">
                      <strong>ID:</strong> {transaction?.id}<br />
                      <strong>Estado:</strong> {transaction?.status}<br />
                      <strong>Monto:</strong> ${transaction?.amount_in_cents ? (transaction.amount_in_cents / 100).toFixed(2) : 'N/A'}<br />
                      <strong>Método de pago:</strong> {transaction?.payment_method?.type || 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Transacción Pendiente</h2>
                  <p className="text-gray-600 mb-4">
                    Tu transacción está siendo procesada. Te notificaremos cuando esté completa.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">Estado actual:</h3>
                    <p className="text-sm text-yellow-700">
                      <strong>ID:</strong> {transaction?.id}<br />
                      <strong>Estado:</strong> {transaction?.status}<br />
                      <strong>Monto:</strong> ${transaction?.amount_in_cents ? (transaction.amount_in_cents / 100).toFixed(2) : 'N/A'}
                    </p>
                  </div>
                </>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Ir al Dashboard
                </button>
                <button
                  onClick={() => router.push('/dashboard/modules')}
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Ver Módulos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="pt-12 px-8 pb-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThanksContent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThanksContentInner />
    </Suspense>
  );
} 