import api from "./api.config";


export interface PaymentMethod {
  type: string;
  phone_number?: string;
  phone_number_prefix?: string;
  legal_id?: string;
  legal_id_type?: string;
  extra?: {
    external_identifier?: string;
    transaction_id?: string;
  };
}

export interface PurchaseTransaction {
  id: string;
  payment_method_type: string;
  payment_method: PaymentMethod;
  reference: string;
  status: string;
}

export interface Purchase {
  module_id: string;
  user_id: string;
  transaction: PurchaseTransaction;
  purchase_date: string;
}

export interface UserPurchases {
  user_id: string;
  purchases: Purchase[];
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

class PurchaseService {
  async createPurchase(userId: string, moduleId: string, transaction: PurchaseTransaction): Promise<void> {
    try {
      const purchase: Purchase = {
        user_id: userId,
        module_id: moduleId,
        transaction,
        purchase_date: new Date().toISOString()
      };

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      await api.post(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, purchase, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error al crear la compra:', error);
      throw error;
    }
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.get<ApiResponse<Purchase[]>>(`${process.env.NEXT_PUBLIC_API_URL}/purchases/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Accedemos a response.data.data para obtener el array de compras
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener las compras del usuario:', error);
      return []; // Devolvemos un array vacío en caso de error
    }
  }

  async hasAccessToModule(userId: string, moduleId: string): Promise<boolean> {
    try {
      const purchases = await this.getUserPurchases(userId);

      return purchases.some(
        purchase =>
          purchase?.module_id === moduleId &&
          purchase?.transaction?.status === 'APPROVED'
      );
    } catch (error) {
      console.error('Error al verificar acceso al módulo:', error);
      return false;
    }
  }
}

export const purchaseService = new PurchaseService(); 