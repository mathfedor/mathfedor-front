import { authService } from './auth.service';
import { ModuleFormData } from '@/types/module.types';

export interface Module {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  group: string;
  createdBy: string;
  createdAt: string;
  price: number;
  status: string;
  image: string;
  topics: Array<{
    title: string;
    description: string;
    image: string;
    completed: boolean;
    duration: string;
    exercises: Array<{
      statement: string;
      options?: string[];
      correctAnswer?: string;
      explanation?: string;
      type?: string;
      image?: string;
      template?: string;
      variables?: string[];
      defaultValues?: number[];
      range?: number[];
    }>;
  }>;
}

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

    // Agregar el archivo Excel
    if (formData.file) {
      if (formData.file.size > 10 * 1024 * 1024) {
        throw new Error('El archivo excede el límite de 10MB');
      }
      formDataToSend.append('file', formData.file);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/upload`, {
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

  async getAllModules(): Promise<Module[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/getlearnings`, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los módulos');
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

  async downloadModuleExcel(moduleId: string, userId: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/download/${moduleId}/${userId}`, {
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