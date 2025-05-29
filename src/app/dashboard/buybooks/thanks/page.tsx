'use client';

import { useEffect, useState } from 'react';
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

export default function ThanksPage() {
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

        // Obtener el estado de la transacción
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h2>
                  <p className="text-gray-600 mb-4">
                    Tu módulo ha sido agregado a tu biblioteca
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">ID de Transacción:</span> {transaction.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Monto:</span> ${transaction.amount_in_cents / 100} {transaction.currency}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Fecha:</span> {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Transacción Pendiente</h2>
                  <p className="text-gray-600 mb-4">
                    Tu transacción está siendo procesada
                  </p>
                </>
              )}
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