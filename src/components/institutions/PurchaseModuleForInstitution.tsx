'use client';

import { useState, useEffect } from 'react';
import { moduleService, Module } from '@/services/module.service';
import { purchaseService, Purchase } from '@/services/purchase.service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FiBook, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface PurchaseModuleProps {
  institutionId: string;
  adminUserId: string;
}

export function PurchaseModuleForInstitution({ institutionId, adminUserId }: PurchaseModuleProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (institutionId) {
      loadData();
    }
  }, [institutionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [modulesData, purchasesData] = await Promise.all([
        moduleService.getAllModules(),
        purchaseService.getInstitutionPurchases(institutionId)
      ]);
      setModules(modulesData);
      setPurchases(purchasesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !amount) return;

    setSaving(true);
    try {
      // Mocking transaction for admin manual assignment
      const transaction = {
        id: `MANUAL-${Date.now()}`,
        payment_method_type: 'MANUAL_ADMIN',
        payment_method: { type: 'MANUAL' },
        reference: `INST-${institutionId}-${Date.now()}`,
        status: 'APPROVED'
      };

      await purchaseService.createPurchase(adminUserId, selectedModuleId, transaction, institutionId, Number(amount));
      
      Swal.fire({
        title: 'Éxito',
        text: 'Módulo asignado (comprado) exitosamente a la institución',
        icon: 'success',
        confirmButtonColor: '#10B981' // emerald-500
      });
      setSelectedModuleId('');
      setAmount('');
      loadData();
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al procesar la compra',
        icon: 'error',
        confirmButtonColor: '#EF4444' // red-500
      });
    } finally {
      setSaving(false);
    }
  };

  const availableModules = modules.filter(
    m => !purchases.some(p => p.module_id === m._id)
  );

  return (
    <section className="rounded-xl bg-white dark:bg-[#1C1D1F] p-6 shadow-sm space-y-6 mt-6 border border-gray-100 dark:border-slate-800">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiBook className="w-5 h-5 text-emerald-600" />
          Registrar Compra de Módulo
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Como administrador, puedes asignar módulos a esta institución registrando el pago correspondiente.
        </p>
      </div>

      <form onSubmit={handlePurchase} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 grid gap-4 md:grid-cols-3 items-start">
        <div>
          <Label htmlFor="module-purchase-select">Seleccionar Módulo</Label>
          <select
            id="module-purchase-select"
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          >
            <option value="">-- Elige un módulo --</option>
            {availableModules.map(m => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
        </div>
        
        <div>
          <Label htmlFor="purchase-amount">Valor pagado ($)</Label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiDollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="purchase-amount"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-10 pr-3 text-slate-900 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="md:pt-8">
          <Button type="submit" disabled={saving || !selectedModuleId || !amount || availableModules.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            {saving ? 'Procesando...' : 'Registrar Compra'}
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-white">Módulos Comprados</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Cargando compras...</p>
        ) : purchases.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Esta institución no ha comprado módulos.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map(purchase => {
              const moduleInfo = modules.find(m => m._id === purchase.module_id);
              return (
                <div key={purchase.module_id} className="border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-4 bg-emerald-50/50 dark:bg-emerald-900/10 relative">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white pr-8 line-clamp-2">
                      {moduleInfo?.title || 'Módulo desconocido'}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      Pagado: ${purchase.amount || 0}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
