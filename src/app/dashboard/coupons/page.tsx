'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { couponService, Coupon, CreateCouponData } from '@/services/coupon.service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from '@/types/auth.types';

export default function CouponsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Estado del formulario de creación
  const [formData, setFormData] = useState<CreateCouponData>({
    value: 0,
    discountType: 'percentage',
    validFrom: '',
    validTo: '',
    maxUses: undefined,
    active: true,
    moduleId: undefined,
    referrerUserId: undefined,
    assignedToUserId: undefined
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        setError(null);

        if (!authService.isAuthenticated()) {
          console.log('No hay token de autenticación');
          router.replace('/login');
          return;
        }

        const userData = authService.getCurrentUser();
        if (!userData) {
          throw new Error('No se encontró información del usuario');
        }

        // Verificar que el usuario sea administrador
        if (userData.role !== 'Admin') {
          setError('No tienes permisos para acceder a esta página');
          setLoading(false);
          return;
        }

        setUser(userData);
        // Cargar cupones desde el backend
        loadCoupons();
      } catch (error) {
        console.error('Error detallado:', error);
        setError(error instanceof Error ? error.message : 'Error al obtener datos del usuario');
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const couponsData = await couponService.getCoupons();
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error al cargar cupones:', error);
      setSubmitMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al cargar los cupones'
      });
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      await couponService.createCoupon(formData);
      
      // Recargar los cupones desde el servidor para asegurar que se muestre correctamente
      await loadCoupons();
      
      setShowCreateForm(false);
      setSubmitMessage({
        type: 'success',
        message: 'Cupón creado exitosamente'
      });

      // Limpiar formulario
      setFormData({
        value: 0,
        discountType: 'percentage',
        validFrom: '',
        validTo: '',
        maxUses: undefined,
        active: true,
        moduleId: undefined,
        referrerUserId: undefined,
        assignedToUserId: undefined
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al crear el cupón'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      value: coupon.value,
      discountType: coupon.discountType,
      validFrom: coupon.validFrom,
      validTo: coupon.validTo,
      maxUses: coupon.maxUses,
      active: coupon.active ?? true,
      moduleId: coupon.moduleId,
      referrerUserId: coupon.referrerUserId,
      assignedToUserId: coupon.assignedToUserId
    });
    setShowCreateForm(true);
  };

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCoupon?.id) return;

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      await couponService.updateCoupon(editingCoupon.id, formData);
      
      // Recargar los cupones desde el servidor para asegurar que se muestre correctamente
      await loadCoupons();
      
      setShowCreateForm(false);
      setEditingCoupon(null);
      setSubmitMessage({
        type: 'success',
        message: 'Cupón actualizado exitosamente'
      });

      // Limpiar formulario
      setFormData({
        value: 0,
        discountType: 'percentage',
        validFrom: '',
        validTo: '',
        maxUses: undefined,
        active: true,
        moduleId: undefined,
        referrerUserId: undefined,
        assignedToUserId: undefined
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al actualizar el cupón'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setCouponToDelete(coupon);
  };

  const confirmDeleteCoupon = async () => {
    if (!couponToDelete?.id) return;

    try {
      await couponService.deleteCoupon(couponToDelete.id);
      setCoupons(coupons.filter(c => c.id !== couponToDelete.id));
      setSubmitMessage({
        type: 'success',
        message: 'Cupón eliminado exitosamente'
      });
      setCouponToDelete(null);
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al eliminar el cupón'
      });
      setCouponToDelete(null);
    }
  };

  const cancelDeleteCoupon = () => {
    setCouponToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            {error || 'No se pudo cargar la información del usuario.'}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Cupones</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Administra los cupones de descuento del sistema
              </p>
            </div>

            {/* Mensaje de estado */}
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200'
                }`}>
                {submitMessage.message}
              </div>
            )}

            {/* Botón de acción */}
            <div className="mb-6">
              <Button
                onClick={() => {
                  setEditingCoupon(null);
                  setFormData({
                    value: 0,
                    discountType: 'percentage',
                    validFrom: '',
                    validTo: '',
                    maxUses: undefined,
                    active: true,
                    moduleId: undefined,
                    referrerUserId: undefined,
                    assignedToUserId: undefined
                  });
                  setShowCreateForm(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Crear Cupón
              </Button>
            </div>

            {/* Tabla de cupones */}
            <div className="bg-white dark:bg-[#282828] rounded-lg shadow overflow-hidden">
              {loadingCoupons ? (
                <div className="p-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando cupones...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-[#1C1D1F]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Descuento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Válido Desde
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Válido Hasta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Usos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#282828] divide-y divide-gray-200 dark:divide-gray-700">
                      {coupons.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No hay cupones disponibles
                          </td>
                        </tr>
                      ) : (
                        coupons.map((coupon) => (
                          <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-[#1C1D1F]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {coupon.code}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {coupon.discountType === 'percentage' 
                                  ? `${coupon.value}%` 
                                  : `$${coupon.value}`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatDate(coupon.validFrom)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatDate(coupon.validTo)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {coupon.currentUses || 0} / {coupon.maxUses || '∞'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${coupon.active
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                {coupon.active ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleEditCoupon(coupon)}
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => handleDeleteCoupon(coupon)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar cupón */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#282828] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {editingCoupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
            </h2>

            {/* Mensaje de estado */}
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200'
                }`}>
                {submitMessage.message}
              </div>
            )}

            <form onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon}>
              {editingCoupon && (
                <div className="mb-4">
                  <Label htmlFor="code" className="dark:text-white">Código del Cupón</Label>
                  <input
                    type="text"
                    id="code"
                    value={editingCoupon.code}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-[#1C1D1F] text-black dark:text-white"
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">El código se genera automáticamente</p>
                </div>
              )}
              <div className="mb-4">
                <Label htmlFor="discountType" className="dark:text-white">Tipo de Descuento</Label>
                <select
                  id="discountType"
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  disabled={submitting}
                  required
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Fijo ($)</option>
                </select>
              </div>
              <div className="mb-4">
                <Label htmlFor="value" className="dark:text-white">Valor del Descuento</Label>
                <input
                  type="number"
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  min="0"
                  step="0.01"
                  disabled={submitting}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="validFrom" className="dark:text-white">Válido Desde</Label>
                <input
                  type="date"
                  id="validFrom"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="validTo" className="dark:text-white">Válido Hasta</Label>
                <input
                  type="date"
                  id="validTo"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="maxUses" className="dark:text-white">Usos Máximos (opcional)</Label>
                <input
                  type="number"
                  id="maxUses"
                  value={formData.maxUses || ''}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#1C1D1F] text-black dark:text-white"
                  min="1"
                  disabled={submitting}
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="mr-2"
                    disabled={submitting}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Cupón activo</span>
                </label>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={submitting}
                >
                  {submitting ? (editingCoupon ? 'Actualizando...' : 'Creando...') : (editingCoupon ? 'Actualizar Cupón' : 'Crear Cupón')}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCoupon(null);
                    setSubmitMessage(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar cupón */}
      {couponToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#282828] rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ¿Eliminar cupón?
                </h3>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar el cupón <strong className="text-gray-900 dark:text-white">{couponToDelete.code}</strong>? Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteCoupon}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteCoupon}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

