
export interface AdminSimulatorData {
  title: string;
  description: string;
  createdBy: string;
  price: number;
  status: string;
  file: File | null;
}

export interface AdminSimulatorResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

class AdminSimulatorService {
  async createSimulator(simulatorData: AdminSimulatorData): Promise<AdminSimulatorResponse> {
    try {
      const formData = new FormData();
      formData.append('title', simulatorData.title);
      formData.append('description', simulatorData.description);
      formData.append('createdBy', simulatorData.createdBy);
      formData.append('price', simulatorData.price.toString());
      formData.append('status', simulatorData.status);
      
      if (simulatorData.file) {
        formData.append('file', simulatorData.file);
      }

      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/upload-simulator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el simulador');
      }

      return {
        success: true,
        message: 'Simulador creado exitosamente',
        data: data
      };
    } catch (error) {
      console.error('Error en createSimulator:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al crear el simulador'
      };
    }
  }

  async getSimulators(): Promise<AdminSimulatorResponse> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/simulators`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los simuladores');
      }

      return {
        success: true,
        message: 'Simuladores obtenidos exitosamente',
        data: data
      };
    } catch (error) {
      console.error('Error en getSimulators:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al obtener los simuladores'
      };
    }
  }

  async deleteSimulator(simulatorId: string): Promise<AdminSimulatorResponse> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/simulator/${simulatorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el simulador');
      }

      return {
        success: true,
        message: 'Simulador eliminado exitosamente',
        data: data
      };
    } catch (error) {
      console.error('Error en deleteSimulator:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al eliminar el simulador'
      };
    }
  }
}

export const adminSimulatorService = new AdminSimulatorService(); 