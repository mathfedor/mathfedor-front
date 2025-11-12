import api from './api.config';
import { RegisterUserPayload, User } from '@/types/auth.types';

class UsersService {
    async createUser(user: RegisterUserPayload): Promise<User> {
        const response = await api.post<User>('/users/register', user);
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
}

export const usersService = new UsersService(); 