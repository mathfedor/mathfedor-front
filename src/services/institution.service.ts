import { Institution, CreateInstitutionData } from '@/types/institution.types';

export interface InstitutionResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

class InstitutionService {
    async createInstitution(institutionData: CreateInstitutionData): Promise<InstitutionResponse<Institution>> {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(institutionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear la institución');
            }

            return {
                success: true,
                message: 'Institución creada exitosamente',
                data: data
            };
        } catch (error) {
            console.error('Error en createInstitution:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido al crear la institución'
            };
        }
    }

    async getInstitutions(status?: string): Promise<InstitutionResponse<Institution[]>> {
        try {
            const token = localStorage.getItem('token');
            
            // Construir la URL con query parameters
            const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/institutions`);
            if (status) {
                url.searchParams.append('status', status);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener las instituciones');
            }

            return {
                success: true,
                message: 'Instituciones obtenidas exitosamente',
                data: data
            };
        } catch (error) {
            console.error('Error en getInstitutions:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido al obtener las instituciones'
            };
        }
    }

    async updateInstitution(institutionId: string, institutionData: Partial<CreateInstitutionData>): Promise<InstitutionResponse<Institution>> {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions/${institutionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(institutionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar la institución');
            }

            return {
                success: true,
                message: 'Institución actualizada exitosamente',
                data: data
            };
        } catch (error) {
            console.error('Error en updateInstitution:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido al actualizar la institución'
            };
        }
    }

    async deleteInstitution(institutionId: string): Promise<InstitutionResponse> {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions/${institutionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar la institución');
            }

            return {
                success: true,
                message: 'Institución eliminada exitosamente',
                data: data
            };
        } catch (error) {
            console.error('Error en deleteInstitution:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido al eliminar la institución'
            };
        }
    }
}

export const institutionService = new InstitutionService(); 