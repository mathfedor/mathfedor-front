import { authService } from "./auth.service";

export interface AdminSimulationData {
  title: string;
  description: string;
  createdBy: string;
  price: number;
  status: string;
  plantillaSimulacion: File | null;
}

export interface AdminSimulationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

class AdminSimulationService {
  async createSimulation(simulationData: AdminSimulationData): Promise<AdminSimulationResponse> {
    try {
      const formData = new FormData();
      formData.append('title', simulationData.title);
      formData.append('description', simulationData.description);
      formData.append('createdBy', simulationData.createdBy);
      formData.append('price', simulationData.price.toString());
      formData.append('status', simulationData.status);
      
      if (simulationData.plantillaSimulacion) {
        formData.append('file', simulationData.plantillaSimulacion);
      }

      const token = authService.getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/upload-simulation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la simulación');
      }

      return {
        success: true,
        message: 'Simulación creada exitosamente',
        data: data
      };
    } catch (error) {
      console.error('Error en createSimulation:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al crear la simulación'
      };
    }
  }

  async getSimulations(): Promise<AdminSimulationResponse> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/simulations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las simulaciones');
      }

      return {
        success: true,
        message: 'Simulaciones obtenidas exitosamente',
        data: data
      };
    } catch (error) {
      console.error('Error en getSimulations:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al obtener las simulaciones'
      };
    }
  }

  async deleteSimulation(simulationId: string): Promise<AdminSimulationResponse> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/simulation/${simulationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar la simulación');
      }

      return {
        success: true,
        message: 'Simulación eliminada exitosamente',
        data: data
      };
    } catch (error) {
      console.error('Error en deleteSimulation:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al eliminar la simulación'
      };
    }
  }
}

export const adminSimulationService = new AdminSimulationService(); 