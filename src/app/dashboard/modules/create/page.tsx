'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import Sidebar from '@/components/Sidebar';
import { FiUpload, FiPlus, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { moduleService } from '@/services/module.service';
import { ModuleFormData } from '@/types/module.types';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  message: string;
}

const Modal = ({ isOpen, onClose, type, message }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {type === 'success' ? (
              <FiCheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <FiAlertCircle className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold">
              {type === 'success' ? 'Éxito' : 'Error'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 rounded-md text-white ${type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default function CreateModulePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    tags: [''],
    duration: '',
    file: null,
    group: '',
    price: 0,
    imageName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    message: ''
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.push('/login');
    }
  }, [user, isCheckingAuth, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validación específica para el campo price
    if (name === 'price') {
      const numericValue = Number(value) || 0;
      setFormData((prev: ModuleFormData) => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }

    setFormData((prev: ModuleFormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.tags];
    newObjectives[index] = value;
    setFormData((prev: ModuleFormData) => ({
      ...prev,
      tags: newObjectives
    }));
  };

  const addObjective = () => {
    setFormData((prev: ModuleFormData) => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel')) {
      setFormData((prev: ModuleFormData) => ({
        ...prev,
        file
      }));
    } else {
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Por favor, selecciona un archivo Excel válido (.xlsx o .xls)'
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Solo guardamos el nombre del archivo
      setFormData((prev: ModuleFormData) => ({
        ...prev,
        imageName: file.name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Asegurarnos de que el precio sea un número válido
      const formDataToSend = {
        ...formData,
        price: Number(formData.price)
      };

      await moduleService.createModule(formDataToSend);

      setModal({
        isOpen: true,
        type: 'success',
        message: 'Módulo creado exitosamente'
      });

      setTimeout(() => {
        router.push('/dashboard/modules');
      }, 2000);
    } catch (error) {
      console.error('Error al crear el módulo:', error);
      setModal({
        isOpen: true,
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al crear el módulo'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen bg-[#F9F9F9]">
        <Sidebar />

      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="flex min-h-screen bg-[#F9F9F9]">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Crear Nuevo Módulo</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Módulo
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#282828] dark:text-white"
                  placeholder="Ej: Fundamentos de SEO"
                />
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#282828] dark:text-white"
                  placeholder="Describe el contenido y objetivos del módulo"
                />
              </div>

              {/* Objetivos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Objetivos
                </label>
                <div className="space-y-3">
                  {formData.tags.map((tag: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#282828] dark:text-white"
                        placeholder={`Objetivo ${index + 1}`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addObjective}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <FiPlus className="w-4 h-4" />
                    Agregar otro objetivo
                  </button>
                </div>
              </div>

              {/* Duración y Grupo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duración
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#282828] dark:text-white"
                    placeholder="Ej: 4 semanas"
                  />
                </div>

                <div>
                  <label htmlFor="group" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grupo
                  </label>
                  <select
                    id="group"
                    name="group"
                    value={formData.group}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#282828] dark:text-white"
                  >
                    <option value="">Selecciona un grupo o módulo</option>
                    <option value="Modulo1">Modulo 1</option>
                    <option value="Modulo2">Modulo 2</option>
                    <option value="Modulo3">Modulo 3</option>
                    <option value="Modulo4">Modulo 4</option>
                    <option value="Modulo5">Modulo 5</option>
                    <option value="Grado11">Grado 11</option>
                  </select>
                </div>
              </div>

              {/* Precio e Imagen */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#282828] dark:text-white"
                    placeholder="Ej: 29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen del Módulo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#282828] border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#363636] w-full">
                      <FiUpload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {formData.imageName || 'Seleccionar imagen'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {formData.imageName && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev: ModuleFormData) => ({ ...prev, imageName: '' }))}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm whitespace-nowrap"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plantilla del Módulo (.xlsx o .xls)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#282828] border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#363636]">
                    <FiUpload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formData.file ? formData.file.name : 'Seleccionar archivo'}
                    </span>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.file && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev: ModuleFormData) => ({ ...prev, file: null }))}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Solo se aceptan archivos Excel (.xlsx o .xls)
                </p>
              </div>

              {/* Botón de envío */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creando...' : 'Crear Módulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        message={modal.message}
      />
    </div>
  );
} 