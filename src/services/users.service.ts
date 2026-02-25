import api from './api.config';
import { RegisterUserPayload, RegisterUserWithRolePayload, User, Student } from '@/types/auth.types';

class UsersService {
    async createUser(user: RegisterUserPayload): Promise<User> {
        const response = await api.post<User>('/users/register', user);
        return response.data;
    }
    async createUserRole(user: RegisterUserWithRolePayload): Promise<User> {
        const response = await api.post<User>('/users/register-with-role', user);
        return response.data;
    }
    async getUsers(): Promise<User[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const response = await api.get<User[]>('/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
    async updateUser(user: User): Promise<User> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const response = await api.put<User>('/users', user, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
    async deleteUser(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        await api.delete<void>(`/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    async updateStudent(id: string, studentData: Partial<Student>): Promise<User> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const response = await api.patch<User>(`/users/${id}/student`, studentData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
    async bulkUploadExcel(file: File): Promise<unknown> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/users/bulk-upload-excel', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
}

export const usersService = new UsersService(); 