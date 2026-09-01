import { authService } from './auth.service';
import { ModuleFormData, Module } from '@/types/module.types';

export type { Module };

export const moduleService = {
  async createModule(formData: ModuleFormData) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No se encontró el usuario actual');
    }

    const formDataToSend = new FormData();

    // Agregar los campos requeridos
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('group', formData.group);
    formDataToSend.append('price', String(Math.max(0, Number(formData.price) || 0)));
    formDataToSend.append('image', formData.imageName);
    formDataToSend.append('status', formData.status || 'active');
    formDataToSend.append('createdBy', user.id);
    // Enviar topics como un array JSON en la clave 'topics' (no 'topics[]')
    formDataToSend.append('topics', JSON.stringify([]));

    // Agregar los tags como array
    formData.tags.forEach((tag, index) => {
      formDataToSend.append(`tags[${index}]`, tag);
    });

    // Agregar el archivo
    if (formData.file) {
      if (formData.file.size > 30 * 1024 * 1024) {
        throw new Error('El archivo excede el límite de 30MB');
      }
      formDataToSend.append('file', formData.file);
    }

    const endpoint = formData.file?.type === 'application/pdf' ? 'upload-eleven' : 'upload';

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el módulo');
    }

    return response.json();
  },

  async updateModule(moduleId: string, updateData: Partial<Module>): Promise<Module> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/${moduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el módulo');
    }

    const resJson = await response.json();
    return resJson.data || resJson;
  },

  async reuploadPdf(
    moduleId: string,
    file: File,
    extraData?: { group?: string; duration?: string; title?: string }
  ) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    if (file.size > 35 * 1024 * 1024) {
      throw new Error('El archivo PDF excede el límite de 35MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    if (extraData?.group) formData.append('group', extraData.group);
    if (extraData?.duration) formData.append('duration', extraData.duration);
    if (extraData?.title) formData.append('title', extraData.title);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/${moduleId}/upload-pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al procesar y vectorizar el PDF');
    }

    return response.json();
  },

  async deleteModule(moduleId: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/${moduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el módulo');
    }

    return response.json();
  },

  async findByGroup(group: string): Promise<Module[]> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/group/${group}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los módulos');
    }

    return response.json();
  },
  async getAllLearnings(): Promise<Module[]> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los módulos');
    }

    return response.json();
  },

  async getAllModules(): Promise<Module[]> { //Active modules only
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/getlearnings`, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los módulos');
    }

    return response.json();
  },

  async getModuleById(moduleId: string): Promise<Module> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/${moduleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el módulo');
    }

    return response.json();
  },

  async getPurchasedModules(userId: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/books/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los módulos comprados');
    }

    const data = await response.json();
    return data.data;
  },

  async downloadModuleExcel(moduleId: string, userId: string, fileIndex: number) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/download/${moduleId}/${userId}/${fileIndex}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al descargar el archivo');
    }

    return response.blob();
  }
}; 