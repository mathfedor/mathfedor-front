import api from './api.config';
import { RegisterUserPayload, RegisterUserWithRolePayload, User, Student } from '@/types/auth.types';
import { authService } from './auth.service';

const getAuthHeaders = () => {
  const token = authService.getToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  return {
    Authorization: `Bearer ${token}`
  };
};

class UsersService {
  async createUser(user: RegisterUserPayload): Promise<User> {
    const response = await api.post<User>('/users/register', user);
    return response.data;
  }

  async createUserRole(user: RegisterUserWithRolePayload): Promise<User> {
    const response = await api.post<User>('/users/register-with-role', user);
    return response.data;
  }

  async getUsers(params?: Record<string, string>): Promise<User[]> {
    const response = await api.get<User[]>('/users', {
      params,
      headers: getAuthHeaders()
    });

    return response.data;
  }

  async getMyStudents(): Promise<User[]> {
    const response = await api.get<User[]>('/users/my-students', {
      headers: getAuthHeaders()
    });

    return response.data;
  }

  async updateUser(user: User): Promise<User> {
    const response = await api.put<User>('/users', user, {
      headers: getAuthHeaders()
    });

    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete<void>(`/users/${id}`, {
      headers: getAuthHeaders()
    });
  }

  async updateStudent(id: string, studentData: Partial<Student>): Promise<User> {
    const response = await api.patch<User>(`/users/${id}/student`, studentData, {
      headers: getAuthHeaders()
    });

    return response.data;
  }

  async bulkUploadExcel(file: File): Promise<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/users/bulk-upload-excel', formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
}

export const usersService = new UsersService();
