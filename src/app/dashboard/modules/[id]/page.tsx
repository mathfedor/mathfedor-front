'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { moduleService, Module } from '@/services/module.service';
import { ModuleTopic, ModuleExercise, Subtopic } from '@/types/module.types';
import Swal from 'sweetalert2';
import {
  FiArrowLeft,
  FiSave,
  FiUploadCloud,
  FiFileText,
  FiLayers,
  FiCode,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiX,
  FiCpu,
  FiInfo,
  FiRefreshCw
} from 'react-icons/fi';

const PRESET_GROUPS = [
  'Grado1',
  'Grado2',
  'Grado3',
  'Grado4',
  'Grado5',
  'Grado6',
  'Grado7',
  'Grado8',
  'Grado9',
  'Grado10',
  'Grado11',
];

type TabType = 'general' | 'rag' | 'topics' | 'json';

export default function EditModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = (params?.id as string) || '';

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('');
  const [customGroup, setCustomGroup] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('active');
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [topics, setTopics] = useState<ModuleTopic[]>([]);

  // RAG / PDF Upload State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [ragStatusMessage, setRagStatusMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Topic Accordion State
  const [openTopicIndex, setOpenTopicIndex] = useState<number | null>(0);

  // Auth & Initial Fetch
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role?.toLowerCase() !== 'admin') {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsAdmin(true);
    if (moduleId) {
      loadModule();
    }
  }, [moduleId, router]);

  const loadModule = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await moduleService.getModuleById(moduleId);
      setModuleData(data);
      setTitle(data.title || '');
      setDescription(data.description || '');
      const isPreset = PRESET_GROUPS.includes(data.group);
      setGroup(isPreset ? data.group : 'custom');
      setCustomGroup(isPreset ? '' : data.group || '');
      setPrice(data.price || 0);
      setDuration(data.duration || '');
      setStatus(data.status || 'active');
      setPublished(Boolean(data.published));
      setImage(data.image || '');
      setTags(data.tags && data.tags.length > 0 ? data.tags : ['']);
      setTopics(data.topics || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar el módulo';
      setErrorMessage(msg);
      Swal.fire({
        icon: 'error',
        title: 'Error al Cargar Módulo',
        text: msg,
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEffectiveGroup = () => {
    if (group === 'custom') return customGroup.trim();
    return group.trim() || 'Grado1';
  };

  // Tags Handler
  const handleTagChange = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const addTag = () => setTags([...tags, '']);
  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated.length > 0 ? updated : ['']);
  };

  // Save General Changes
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    const effectiveGroup = getEffectiveGroup();
    if (!effectiveGroup) {
      Swal.fire({
        icon: 'warning',
        title: 'Grupo requerido',
        text: 'Debes especificar o seleccionar un Grupo / Grado válido para el módulo.',
        confirmButtonColor: '#2563EB',
      });
      setIsSaving(false);
      return;
    }

    try {
      const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
      const payload: Partial<Module> = {
        title: title.trim(),
        description: description.trim(),
        group: effectiveGroup,
        price: Number(price) || 0,
        duration: duration.trim(),
        status,
        published,
        image: image.trim(),
        tags: cleanTags,
        topics: topics,
      };

      const updated = await moduleService.updateModule(moduleId, payload);
      setModuleData(updated);
      setSaveSuccess('¡Módulo actualizado correctamente!');
      setTimeout(() => setSaveSuccess(null), 3500);

      Swal.fire({
        icon: 'success',
        title: '¡Módulo Actualizado!',
        text: 'Los cambios fueron guardados exitosamente en la base de datos.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los cambios';
      setErrorMessage(msg);
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: msg,
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        Swal.fire({
          icon: 'error',
          title: 'Formato no soportado',
          text: 'Por favor, arrastra únicamente archivos en formato PDF.',
          confirmButtonColor: '#2563EB',
        });
        return;
      }
      setPdfFile(file);
    }
  };

  // Upload PDF & Re-index RAG
  const handleReuploadPdf = async () => {
    if (!pdfFile) {
      Swal.fire({
        icon: 'info',
        title: 'Archivo Requerido',
        text: 'Por favor, selecciona o arrastra un archivo PDF antes de iniciar la vectorización.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    const effectiveGroup = getEffectiveGroup();
    if (!effectiveGroup) {
      Swal.fire({
        icon: 'warning',
        title: 'Grupo Requerido',
        text: 'El módulo necesita un Grupo/Grado asignado para indexar su contenido en RAG.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Confirmas la re-vectorización RAG?',
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.5;">
          <p><strong>Archivo:</strong> ${pdfFile.name} (${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
          <p><strong>Grupo destino:</strong> <span style="color:#2563eb;font-weight:bold;">${effectiveGroup}</span></p>
          <div style="margin-top:12px; padding:10px; border-radius:8px; background-color:#FEF2F2; border:1px solid #FECACA; color:#991B1B; font-size:12px;">
            ⚠️ <strong>Regla de Versión Única:</strong> Se purgarán los vectores anteriores de este grupo para reemplazarlos limpiamente con los nuevos embeddings.
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7C3AED',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, iniciar vectorización',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setIsUploadingPdf(true);
    setRagStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await moduleService.reuploadPdf(moduleId, pdfFile, {
        group: effectiveGroup,
        duration: duration || '120h',
        title: title || pdfFile.name.replace('.pdf', ''),
      });

      const successMsg =
        res.message || 'El PDF fue subido. Comenzó la extracción y vectorización RAG en segundo plano.';
      setRagStatusMessage(successMsg);
      setStatus('processing');
      setPdfFile(null);

      Swal.fire({
        icon: 'success',
        title: 'Procesamiento Iniciado',
        text: successMsg,
        confirmButtonColor: '#7C3AED',
      });

      setTimeout(() => loadModule(), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al subir y vectorizar el PDF';
      setErrorMessage(msg);
      Swal.fire({
        icon: 'error',
        title: 'Fallo en Vectorización',
        text: msg,
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Delete Module
  const handleDeleteModule = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar este módulo?',
      text: `Esta acción eliminará definitivamente "${moduleData?.title}" y purgará todos sus vectores en RAG.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar módulo',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await moduleService.deleteModule(moduleId);
      await Swal.fire({
        icon: 'success',
        title: 'Módulo Eliminado',
        text: 'El módulo y sus vectores RAG han sido eliminados correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
      router.push('/dashboard/modules');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Eliminar',
        text: err instanceof Error ? err.message : 'No se pudo eliminar el módulo.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  // Topics Update Handlers
  const handleTopicFieldChange = (index: number, field: keyof ModuleTopic, value: any) => {
    const updated = [...topics];
    updated[index] = { ...updated[index], [field]: value };
    setTopics(updated);
  };

  const handleExerciseChange = (
    topicIdx: number,
    exIdx: number,
    field: keyof ModuleExercise,
    value: any
  ) => {
    const updated = [...topics];
    const exList = [...(updated[topicIdx].exercises || [])];
    exList[exIdx] = { ...exList[exIdx], [field]: value };
    updated[topicIdx].exercises = exList;
    setTopics(updated);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F9F9F9] dark:bg-[#1C1D1F]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm font-medium">Cargando datos del módulo...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen bg-[#F9F9F9] dark:bg-[#1C1D1F]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-2xl mb-4">
            <FiAlertCircle />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Acceso Restringido (Solo Administradores)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
            La edición y vectorización de módulos solo está autorizada para usuarios con rol <strong>Admin</strong>.
          </p>
          <Link
            href="/dashboard/modules"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
          >
            Volver a Módulos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9F9F9] dark:bg-[#1C1D1F] text-gray-800 dark:text-white">
      <Sidebar />

      <main className="flex-1 pt-24 px-6 pb-8 md:pt-24 md:px-8 overflow-y-auto max-w-7xl mx-auto">
        {/* Header de Navegación */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/modules"
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#282828] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              title="Volver a la lista"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">{title || 'Módulo Sin Título'}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {getEffectiveGroup() || 'Sin Grupo'}
                </span>
                {status === 'processing' && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1">
                    <FiRefreshCw className="w-3 h-3 animate-spin" /> Procesando RAG
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                ID: <span className="font-mono">{moduleId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveGeneral}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer"
            >
              <FiSave className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
            <FiCheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{saveSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Pestañas de Navegación */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'general', label: '1. Información General', icon: FiFileText },
            { id: 'rag', label: '2. Base de Conocimiento RAG (PDF)', icon: FiCpu },
            { id: 'topics', label: `3. Estructura de Temas (${topics.length})`, icon: FiLayers },
            { id: 'json', label: '4. Inspector JSON', icon: FiCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DE PESTAÑAS */}

        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FiFileText className="text-blue-500" /> Datos Principales del Módulo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Título del Módulo *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Matemáticas de Fedor - Grado 11"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Descripción del Módulo
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción pedagógica del módulo de aprendizaje..."
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Grado / Grupo */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Grado / Grupo Asignado (RAG & Búsqueda) *
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecciona un grado estándar...</option>
                    {PRESET_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                    <option value="custom">Otro grupo personalizado...</option>
                  </select>

                  {group === 'custom' && (
                    <input
                      type="text"
                      required
                      value={customGroup}
                      onChange={(e) => setCustomGroup(e.target.value)}
                      placeholder="Ej: Pre-ICFES_2026 o Modulo_Especial"
                      className="w-full mt-3 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    Este identificador vincula el módulo con su base de conocimiento vectorial en RAG.
                  </p>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Precio (COP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-xs text-gray-400 mt-1 block">
                    Formato: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price)}
                  </span>
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Duración Estimada
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ej: 120h o 6 semanas"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Estado Operativo
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="processing">Procesando RAG</option>
                    <option value="error_ai">Error en IA</option>
                  </select>
                </div>

                {/* Imagen / Portada */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Nombre o URL de Imagen
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="fedor-modulo-11-libros.png"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Publicado Switch */}
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="publishedSwitch"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="publishedSwitch" className="text-sm font-semibold cursor-pointer">
                    Módulo Visible y Publicado para Estudiantes
                  </label>
                </div>
              </div>

              {/* Tags / Objetivos */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Etiquetas / Objetivos de Aprendizaje
                  </label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Agregar Etiqueta
                  </button>
                </div>
                <div className="space-y-2">
                  {tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(idx, e.target.value)}
                        placeholder={`Etiqueta #${idx + 1}`}
                        className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                        title="Eliminar etiqueta"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón de Guardado */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition cursor-pointer"
              >
                <FiSave className="w-5 h-5" />
                {isSaving ? 'Guardando Cambios...' : 'Guardar Información General'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: BASE DE CONOCIMIENTO RAG (PDF) */}
        {activeTab === 'rag' && (
          <div className="space-y-6">
            {/* Tarjeta de Información RAG */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
                  <FiCpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Indexación Vectorial & RAG (Retrieval-Augmented Generation)
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    Al cargar un nuevo libro o documento PDF, el sistema extraerá los textos por rangos temáticos, generará los embeddings con IA y los indexará en MongoDB Atlas Vector Search para el grupo{' '}
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {getEffectiveGroup() || 'Sin asignar'}
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/70 dark:bg-[#1E1E1E]/80 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
                <FiInfo className="w-4 h-4 shrink-0 text-blue-500" />
                <span>
                  <strong>Regla de Versión Única:</strong> Cualquier vectorización previa de este grupo será eliminada y reemplazada limpiamente por la nueva versión.
                </span>
              </div>
            </div>

            {/* Subir PDF con Drag & Drop Completo */}
            <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <h4 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FiUploadCloud className="text-blue-500" /> Cargar o Reemplazar Documento PDF
              </h4>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 scale-[1.01]'
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1A1A1A] hover:border-blue-500'
                }`}
              >
                <input
                  type="file"
                  id="pdfFileInput"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPdfFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="pdfFileInput"
                  className="cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm transition-transform ${
                      isDragging
                        ? 'bg-purple-600 text-white scale-110'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <FiUploadCloud />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      {isDragging ? '¡Suelta el archivo PDF aquí!' : 'Haz clic o arrastra tu archivo PDF aquí'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Límite máximo recomendado: 35 MB (formato .pdf)</p>
                  </div>
                </label>

                {pdfFile && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-xl inline-flex items-center gap-3 text-sm">
                    <FiFileText className="text-blue-600 dark:text-blue-300 text-lg" />
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{pdfFile.name}</span>
                    <span className="text-xs text-gray-400">
                      ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                      }}
                      className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Quitar archivo"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {ragStatusMessage && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm flex items-center gap-3">
                  <FiRefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>{ragStatusMessage}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleReuploadPdf}
                  disabled={!pdfFile || isUploadingPdf}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition cursor-pointer"
                >
                  <FiCpu className={`w-5 h-5 ${isUploadingPdf ? 'animate-spin' : ''}`} />
                  {isUploadingPdf ? 'Subiendo y Vectorizando...' : 'Iniciar Vectorización RAG'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ESTRUCTURA DE TEMAS */}
        {activeTab === 'topics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FiLayers className="text-blue-500" /> Jerarquía de Temas y Ejercicios
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Inspecciona y edita los contenidos generados por la IA o creados manualmente.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveGeneral}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
              >
                <FiSave className="w-4 h-4" /> Guardar Temas
              </button>
            </div>

            {topics.length === 0 ? (
              <div className="bg-white dark:bg-[#242424] p-12 rounded-2xl border border-gray-100 dark:border-gray-800 text-center text-gray-400">
                <FiLayers className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-semibold">No hay temas registrados en este módulo.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Sube un archivo PDF en la pestaña RAG para generar los temas con IA automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic, tIdx) => {
                  const isOpen = openTopicIndex === tIdx;
                  return (
                    <div
                      key={tIdx}
                      className="bg-white dark:bg-[#242424] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition"
                    >
                      {/* Cabecera del Acordeón */}
                      <button
                        type="button"
                        onClick={() => setOpenTopicIndex(isOpen ? null : tIdx)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50/60 dark:bg-[#1E1E1E] hover:bg-gray-100/60 dark:hover:bg-[#282828] transition cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                            {tIdx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-gray-800 dark:text-white">
                              {topic.title || `Tema #${tIdx + 1}`}
                            </span>
                            <span className="text-xs text-gray-400 ml-3">
                              {(topic.exercises || []).length} ejercicios · {(topic.subtopics || []).length} subtemas
                            </span>
                          </div>
                        </div>
                        {isOpen ? (
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <FiChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {/* Cuerpo del Acordeón */}
                      {isOpen && (
                        <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-800">
                          {/* Edición de Título y Duración */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-500 mb-1">
                                Título del Tema
                              </label>
                              <input
                                type="text"
                                value={topic.title}
                                onChange={(e) =>
                                  handleTopicFieldChange(tIdx, 'title', e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">
                                Duración
                              </label>
                              <input
                                type="text"
                                value={topic.duration || ''}
                                onChange={(e) =>
                                  handleTopicFieldChange(tIdx, 'duration', e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E]"
                              />
                            </div>
                          </div>

                          {/* Subtemas */}
                          {topic.subtopics && topic.subtopics.length > 0 && (
                            <div className="space-y-3">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Subtemas y Bloques Didácticos ({topic.subtopics.length})
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {topic.subtopics.map((sub, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E1E1E]/60 text-xs"
                                  >
                                    <span className="font-bold text-gray-700 dark:text-gray-200 block mb-1">
                                      {sub.title}
                                    </span>
                                    <span className="text-gray-400">
                                      {(sub.blocks || []).length} bloques de contenido (texto / fórmulas)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Ejercicios */}
                          {topic.exercises && topic.exercises.length > 0 && (
                            <div className="space-y-4">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Preguntas y Ejercicios ({topic.exercises.length})
                              </h5>
                              <div className="space-y-4">
                                {topic.exercises.map((ex, exIdx) => (
                                  <div
                                    key={exIdx}
                                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] space-y-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                        Ejercicio #{exIdx + 1}
                                      </span>
                                    </div>

                                    {/* Enunciado */}
                                    <div>
                                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                        Enunciado / Pregunta
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={ex.statement}
                                        onChange={(e) =>
                                          handleExerciseChange(
                                            tIdx,
                                            exIdx,
                                            'statement',
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161616]"
                                      />
                                    </div>

                                    {/* Opciones */}
                                    {ex.options && ex.options.length > 0 && (
                                      <div>
                                        <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                          Opciones de Respuesta
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {ex.options.map((opt, optIdx) => (
                                            <input
                                              key={optIdx}
                                              type="text"
                                              value={opt}
                                              onChange={(e) => {
                                                const newOpts = [...(ex.options || [])];
                                                newOpts[optIdx] = e.target.value;
                                                handleExerciseChange(
                                                  tIdx,
                                                  exIdx,
                                                  'options',
                                                  newOpts
                                                );
                                              }}
                                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161616]"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Respuesta Correcta */}
                                    <div>
                                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                        Respuesta Correcta
                                      </label>
                                      <input
                                        type="text"
                                        value={ex.correctAnswer || ''}
                                        onChange={(e) =>
                                          handleExerciseChange(
                                            tIdx,
                                            exIdx,
                                            'correctAnswer',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Ej: A o resultado numérico"
                                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161616]"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INSPECTOR JSON */}
        {activeTab === 'json' && (
          <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FiCode className="text-blue-500" /> Estructura Completa del Documento MongoDB
              </h3>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(moduleData, null, 2));
                  Swal.fire({
                    icon: 'success',
                    title: '¡Copiado!',
                    text: 'Estructura JSON copiada al portapapeles.',
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Copiar JSON
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0F1424] text-emerald-400 text-xs font-mono overflow-auto max-h-[500px] border border-gray-800 leading-relaxed">
              {JSON.stringify(moduleData, null, 2)}
            </pre>
          </div>
        )}

        {/* ZONA DE PELIGRO */}
        <div className="mt-12 p-6 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <FiTrash2 /> Zona de Peligro
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Eliminar este módulo purgará su registro en la colección Learning y sus vectores en Atlas Vector Search.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeleteModule}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Eliminar Módulo
          </button>
        </div>
      </main>
    </div>
  );
}
