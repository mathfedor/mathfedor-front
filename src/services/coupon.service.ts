import api from "./api.config";
import { AxiosError } from "axios";

export interface Coupon {
  id: string;
  code: string;
  value: number;
  discountType: 'percentage' | 'fixed';
  validFrom: string;
  validTo: string;
  maxUses?: number;
  currentUses?: number;
  active?: boolean;
  moduleId?: string;
  referrerUserId?: string;
  assignedToUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCouponData {
  discountType: 'percentage' | 'fixed';
  value: number;
  validFrom: string;
  validTo: string;
  maxUses?: number;
  active?: boolean;
  moduleId?: string;
  referrerUserId?: string;
  assignedToUserId?: string;
}

export interface UpdateCouponData {
  discountType?: 'percentage' | 'fixed';
  value?: number;
  validFrom?: string;
  validTo?: string;
  maxUses?: number;
  active?: boolean;
  moduleId?: string;
  referrerUserId?: string;
  assignedToUserId?: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  message: string;
  value?: number;
  discountType?: 'percentage' | 'fixed';
  coupon?: {
    _id: string;
    code: string;
    value: number;
    discountType: 'percentage' | 'fixed';
    validFrom: string;
    validTo: string;
    maxUses?: number;
    usedCount?: number;
    active?: boolean;
    moduleId?: string | null;
    referrerUserId?: string | null;
    assignedToUserId?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

// Interfaz para los datos que devuelve el backend (formato MongoDB)
interface BackendCoupon {
  _id: string;
  code: string;
  value: number;
  discountType: 'percentage' | 'fixed';
  validFrom: string;
  validTo: string;
  maxUses?: number;
  usedCount?: number;
  active?: boolean;
  moduleId?: string | null;
  referrerUserId?: string | null;
  assignedToUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    email: string;
    name: string;
  };
}

class CouponService {
  private getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof AxiosError) {
      const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
      return apiMessage || error.message || defaultMessage;
    }
    if (error instanceof Error) {
      return error.message || defaultMessage;
    }
    return defaultMessage;
  }

  // Transforma los datos del backend al formato esperado por el frontend
  private transformCoupon(backendCoupon: BackendCoupon): Coupon {
    // Validar que el cupón tenga los campos mínimos requeridos
    if (!backendCoupon || !backendCoupon._id || !backendCoupon.code) {
      throw new Error('Cupón inválido: faltan campos requeridos');
    }

    return {
      id: backendCoupon._id,
      code: backendCoupon.code,
      value: backendCoupon.value ?? 0,
      discountType: backendCoupon.discountType,
      validFrom: backendCoupon.validFrom,
      validTo: backendCoupon.validTo,
      maxUses: backendCoupon.maxUses,
      currentUses: backendCoupon.usedCount ?? 0,
      active: backendCoupon.active ?? true,
      moduleId: backendCoupon.moduleId || undefined,
      referrerUserId: backendCoupon.referrerUserId || undefined,
      assignedToUserId: backendCoupon.assignedToUserId || undefined,
      createdAt: backendCoupon.createdAt,
      updatedAt: backendCoupon.updatedAt
    };
  }

  async createCoupon(couponData: CreateCouponData): Promise<Coupon> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.post<unknown>('/coupons', couponData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Debug: Log la estructura de la respuesta
      console.log('Respuesta al crear cupón:', response.data);
      console.log('Tipo de respuesta:', typeof response.data);

      // Verificar si la respuesta está envuelta en ApiResponse o es directa
      let backendCoupon: BackendCoupon;
      
      // Si response.data tiene la estructura de BackendCoupon directamente
      if (response.data && typeof response.data === 'object' && '_id' in response.data) {
        backendCoupon = response.data as BackendCoupon;
      } 
      // Si response.data tiene una propiedad 'data' (ApiResponse)
      else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const apiResponse = response.data as { data: unknown };
        if (apiResponse.data && typeof apiResponse.data === 'object' && '_id' in apiResponse.data) {
          backendCoupon = apiResponse.data as BackendCoupon;
        } else {
          throw new Error('Respuesta de creación de cupón inválida');
        }
      } else {
        throw new Error('Formato de respuesta de creación de cupón no reconocido');
      }

      return this.transformCoupon(backendCoupon);
    } catch (error: unknown) {
      console.error('Error al crear el cupón:', error);
      throw new Error(this.getErrorMessage(error, 'Error al crear el cupón'));
    }
  }

  async getCoupons(): Promise<Coupon[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // El backend puede devolver un array directamente o envuelto en ApiResponse
      const response = await api.get<unknown>('/coupons', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Debug: Log la estructura de la respuesta
      console.log('Respuesta del backend:', response.data);
      console.log('Tipo de respuesta:', typeof response.data);
      console.log('Es array?', Array.isArray(response.data));

      // Verificar si la respuesta está envuelta en ApiResponse o es un array directo
      let backendCoupons: BackendCoupon[] = [];
      
      // Si response.data es directamente un array
      if (Array.isArray(response.data)) {
        backendCoupons = response.data as BackendCoupon[];
      } 
      // Si response.data tiene una propiedad 'data' que es un array (ApiResponse)
      else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const apiResponse = response.data as { data: unknown };
        if (Array.isArray(apiResponse.data)) {
          backendCoupons = apiResponse.data as BackendCoupon[];
        }
      }

      // Filtrar y transformar solo los cupones válidos
      return backendCoupons
        .filter((coupon): coupon is BackendCoupon => {
          return coupon != null && typeof coupon === 'object' && '_id' in coupon && 'code' in coupon;
        })
        .map(coupon => this.transformCoupon(coupon));
    } catch (error: unknown) {
      console.error('Error al obtener los cupones:', error);
      throw new Error(this.getErrorMessage(error, 'Error al obtener los cupones'));
    }
  }

  async getCouponById(id: string): Promise<Coupon> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.get<ApiResponse<BackendCoupon>>(`/coupons/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return this.transformCoupon(response.data.data);
    } catch (error: unknown) {
      console.error('Error al obtener el cupón:', error);
      throw new Error(this.getErrorMessage(error, 'Error al obtener el cupón'));
    }
  }

  async updateCoupon(id: string, couponData: UpdateCouponData): Promise<Coupon> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.put<ApiResponse<BackendCoupon>>(`/coupons/${id}`, couponData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return this.transformCoupon(response.data.data);
    } catch (error: unknown) {
      console.error('Error al actualizar el cupón:', error);
      throw new Error(this.getErrorMessage(error, 'Error al actualizar el cupón'));
    }
  }

  async deleteCoupon(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      await api.delete(`/coupons/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error: unknown) {
      console.error('Error al eliminar el cupón:', error);
      throw new Error(this.getErrorMessage(error, 'Error al eliminar el cupón'));
    }
  }

  async validateCoupon(code: string): Promise<ValidateCouponResponse> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.post<unknown>('/coupons/validate', 
        { code },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Debug: Log la estructura de la respuesta
      console.log('Respuesta de validación del backend:', response.data);
      console.log('Tipo de respuesta:', typeof response.data);

      // Verificar si la respuesta está envuelta en ApiResponse o es directa
      let validationResponse: ValidateCouponResponse;
      
      // Si response.data tiene la estructura de ValidateCouponResponse directamente
      if (response.data && typeof response.data === 'object' && 'valid' in response.data) {
        validationResponse = response.data as ValidateCouponResponse;
      } 
      // Si response.data tiene una propiedad 'data' (ApiResponse)
      else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const apiResponse = response.data as { data: unknown };
        if (apiResponse.data && typeof apiResponse.data === 'object' && 'valid' in apiResponse.data) {
          validationResponse = apiResponse.data as ValidateCouponResponse;
        } else {
          throw new Error('Respuesta de validación inválida');
        }
      } else {
        throw new Error('Formato de respuesta de validación no reconocido');
      }

      return validationResponse;
    } catch (error: unknown) {
      console.error('Error al validar el cupón:', error);
      throw new Error(this.getErrorMessage(error, 'Error al validar el cupón'));
    }
  }
}

export const couponService = new CouponService();

