import api from './api.config';
import {
  Institution,
  CreateInstitutionData,
  Branch,
  Classroom,
  CreateBranchData,
  UpdateBranchData,
  CreateClassroomData,
  UpdateClassroomData
} from '@/types/institution.types';
import { User } from '@/types/auth.types';

export interface InstitutionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return String(error.response.data.message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

class InstitutionService {
  async createInstitution(institutionData: CreateInstitutionData): Promise<InstitutionResponse<Institution>> {
    try {
      const response = await api.post<Institution>('/institutions', institutionData);
      return {
        success: true,
        message: 'Institución creada exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en createInstitution:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error desconocido al crear la institución')
      };
    }
  }

  async getInstitutions(status?: string): Promise<InstitutionResponse<Institution[]>> {
    try {
      const response = await api.get<Institution[]>('/institutions', {
        params: status ? { status } : undefined
      });

      return {
        success: true,
        message: 'Instituciones obtenidas exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en getInstitutions:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error desconocido al obtener las instituciones')
      };
    }
  }

  async updateInstitution(institutionId: string, institutionData: Partial<CreateInstitutionData>): Promise<InstitutionResponse<Institution>> {
    try {
      const response = await api.put<Institution>(`/institutions/${institutionId}`, institutionData);
      return {
        success: true,
        message: 'Institución actualizada exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en updateInstitution:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error desconocido al actualizar la institución')
      };
    }
  }

  async deleteInstitution(institutionId: string): Promise<InstitutionResponse> {
    try {
      await api.delete(`/institutions/${institutionId}`);
      return {
        success: true,
        message: 'Institución eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error en deleteInstitution:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error desconocido al eliminar la institución')
      };
    }
  }

  async getBranches(institutionId: string): Promise<InstitutionResponse<Branch[]>> {
    try {
      const response = await api.get<Branch[]>(`/institutions/${institutionId}/branches`);
      return {
        success: true,
        message: 'Sedes obtenidas exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en getBranches:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al obtener las sedes')
      };
    }
  }

  async createBranch(institutionId: string, branchData: CreateBranchData): Promise<InstitutionResponse<Branch>> {
    try {
      const response = await api.post<Branch>(`/institutions/${institutionId}/branches`, branchData);
      return {
        success: true,
        message: 'Sede creada exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en createBranch:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al crear la sede')
      };
    }
  }

  async updateBranch(branchId: string, branchData: UpdateBranchData): Promise<InstitutionResponse<Branch>> {
    try {
      const response = await api.patch<Branch>(`/institutions/branches/${branchId}`, branchData);
      return {
        success: true,
        message: 'Sede actualizada exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en updateBranch:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al actualizar la sede')
      };
    }
  }

  async deleteBranch(branchId: string): Promise<InstitutionResponse> {
    try {
      await api.delete(`/institutions/branches/${branchId}`);
      return {
        success: true,
        message: 'Sede eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error en deleteBranch:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al eliminar la sede')
      };
    }
  }

  async getClassrooms(branchId: string): Promise<InstitutionResponse<Classroom[]>> {
    try {
      const response = await api.get<Classroom[]>(`/institutions/branches/${branchId}/classrooms`);
      return {
        success: true,
        message: 'Salones obtenidos exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en getClassrooms:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al obtener los salones')
      };
    }
  }

  async createClassroom(branchId: string, classroomData: CreateClassroomData): Promise<InstitutionResponse<Classroom>> {
    try {
      const response = await api.post<Classroom>(`/institutions/branches/${branchId}/classrooms`, classroomData);
      return {
        success: true,
        message: 'Salón creado exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en createClassroom:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al crear el salón')
      };
    }
  }

  async updateClassroom(classroomId: string, classroomData: UpdateClassroomData): Promise<InstitutionResponse<Classroom>> {
    try {
      const response = await api.patch<Classroom>(`/institutions/classrooms/${classroomId}`, classroomData);
      return {
        success: true,
        message: 'Salón actualizado exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en updateClassroom:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al actualizar el salón')
      };
    }
  }

  async assignTeachersToClassroom(classroomId: string, teacherIds: string[]): Promise<InstitutionResponse<Classroom>> {
    try {
      const response = await api.patch<Classroom>(`/institutions/classrooms/${classroomId}/teachers`, { teacherIds });
      return {
        success: true,
        message: 'Profesores asignados exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en assignTeachersToClassroom:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al asignar profesores al salón')
      };
    }
  }

  async getTeachersByInstitution(institutionId: string): Promise<InstitutionResponse<User[]>> {
    try {
      const response = await api.get<User[]>('/users', {
        params: { institutionId, role: 'Teacher' }
      });
      return {
        success: true,
        message: 'Profesores obtenidos exitosamente',
        data: response.data
      };
    } catch (error) {
      console.error('Error en getTeachersByInstitution:', error);
      return {
        success: false,
        message: getErrorMessage(error, 'Error al obtener los profesores')
      };
    }
  }
}

export const institutionService = new InstitutionService();
