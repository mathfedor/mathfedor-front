'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import Sidebar from '@/components/Sidebar';
import { FiUpload, FiPlus, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { diagnosticService } from '@/services/diagnostic.service';

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
          className={`w-full py-2 px-4 rounded-md text-white ${
            type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default function DiagnosisPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topics: [''],
    group: '',
    file: null as File | null
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

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen bg-[#F9F9F9]">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12') {
      setFormData(prev => ({
        ...prev,
        file
      }));
    } else {
      alert('Por favor, selecciona un archivo .xlsm válido');
    }
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData(prev => ({
      ...prev,
      topics: newTopics
    }));
  };

  const addTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, '']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await diagnosticService.createDiagnostic({
        title: formData.title,
        description: formData.description,
        topics: formData.topics,
        group: formData.group,
        file: formData.file
      });

      setModal({
        isOpen: true,
        type: 'success',
        message: 'Diagnóstico creado exitosamente'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error al crear el diagnóstico:', error);
      setModal({
        isOpen: true,
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al crear el diagnóstico'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="flex min-h-screen bg-[#F9F9F9]">
        <Sidebar />
        
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Crear Nuevo Diagnóstico</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Diagnóstico
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Diagnóstico de SEO para E-commerce"
                />
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe el propósito y alcance del diagnóstico"
                />
              </div>

              {/* Temas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temas
                </label>
                <div className="space-y-3">
                  {formData.topics.map((topic, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => handleTopicChange(index, e.target.value)}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Tema ${index + 1}`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTopic}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiPlus className="w-4 h-4" />
                    Agregar otro tema
                  </button>
                </div>
              </div>

              {/* Grupo */}
              <div>
                <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
                  Grupo
                </label>
                <select
                  id="group"
                  name="group"
                  value={formData.group}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un grupo</option>
                  <option value="grupo1">Grupo 1</option>
                  <option value="grupo2">Grupo 2</option>
                  <option value="grupo3">Grupo 3</option>
                </select>
              </div>

              {/* Archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo de Diagnóstico (.xlsm)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <FiUpload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {formData.file ? formData.file.name : 'Seleccionar archivo'}
                    </span>
                    <input
                      type="file"
                      accept=".xlsm"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.file && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Solo se aceptan archivos .xlsm
                </p>
              </div>

              {/* Botón de envío */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creando...' : 'Crear Diagnóstico'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          type={modal.type}
          message={modal.message}
        />
      </div>
    </div>
  );
} 