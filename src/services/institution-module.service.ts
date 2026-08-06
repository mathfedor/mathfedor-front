import api from './api.config';

export interface InstitutionModuleAssignment {
  _id?: string;
  institutionId: string;
  moduleId: string;
  classroomIds: string[];
  status: string;
  createdAt?: string;
}

export interface StudentModuleAccess {
  module_id: string;
  title: string;
  group: string;
  image: string;
  purchaseDate: string | null;
  gradeConfig: {
    grade: string;
    accessViews: string[];
    downloadFiles: Array<{ index: number; name: string }>;
  } | null;
  downloadedIndices: number[];
  source: 'purchase' | 'institution';
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    (error as any).response?.data?.message
  ) {
    return String((error as any).response.data.message);
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

class InstitutionModuleService {
  /**
   * Asigna un módulo a una institución (opcionalmente restringido a salones).
   */
  async assignModule(
    institutionId: string,
    moduleId: string,
    classroomIds: string[] = []
  ): Promise<{ success: boolean; message: string; data?: InstitutionModuleAssignment }> {
    try {
      const response = await api.post<InstitutionModuleAssignment>(
        `/institutions/${institutionId}/modules`,
        { moduleId, classroomIds }
      );
      return { success: true, message: 'Módulo asignado exitosamente', data: response.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, 'Error al asignar el módulo') };
    }
  }

  /**
   * Obtiene los módulos asignados a una institución.
   */
  async getInstitutionModules(institutionId: string): Promise<InstitutionModuleAssignment[]> {
    try {
      const response = await api.get<InstitutionModuleAssignment[]>(
        `/institutions/${institutionId}/modules`
      );
      return response.data;
    } catch {
      return [];
    }
  }

  /**
   * Elimina la asignación de un módulo a una institución.
   */
  async removeModule(
    institutionId: string,
    moduleId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await api.delete(`/institutions/${institutionId}/modules/${moduleId}`);
      return { success: true, message: 'Módulo removido exitosamente' };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, 'Error al remover el módulo') };
    }
  }

  /**
   * Obtiene todos los módulos a los que el estudiante tiene acceso
   * (compras B2C + módulos institucionales).
   */
  async getStudentModules(userId: string): Promise<StudentModuleAccess[]> {
    try {
      const response = await api.get<{ message: string; data: StudentModuleAccess[] }>(
        `/purchases/my-modules/${userId}`
      );
      return response.data.data ?? [];
    } catch {
      return [];
    }
  }

  /**
   * Devuelve los moduleIds a los que el estudiante tiene acceso institucional.
   */
  async getStudentModuleAccessIds(userId: string): Promise<string[]> {
    try {
      const response = await api.get<{ moduleIds: string[] }>(
        `/institutions/student/${userId}/module-access`
      );
      return response.data.moduleIds ?? [];
    } catch {
      return [];
    }
  }
}

export const institutionModuleService = new InstitutionModuleService();
