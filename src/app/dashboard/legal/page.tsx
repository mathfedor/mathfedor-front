'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import api from '@/services/api.config';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiAlertCircle, FiClock, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';

const DOCUMENT_OPTIONS = [
  { slug: 'terminos-y-condiciones', title: 'Términos y Condiciones' },
  { slug: 'politica-privacidad', title: 'Política de Privacidad' },
  { slug: 'autorizacion-datos-menor', title: 'Autorización para el Tratamiento de Datos de Menores' },
  { slug: 'politica-cookies', title: 'Política de Cookies' },
];

interface DocumentVersion {
  version: string;
  pdfUrl: string;
  content: string | null;
  uploadedAt: string;
}

interface LegalDocument {
  slug: string;
  title: string;
  version?: string;
  pdfUrl?: string | null;
  content?: string | null;
  versions?: DocumentVersion[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminLegalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [slug, setSlug] = useState('');
  const [version, setVersion] = useState('1.0');
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<LegalDocument[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role?.toLowerCase() !== 'admin') {
      router.replace('/dashboard');
      return;
    }
    setLoading(false);
    void fetchCurrentDocuments();
  }, [router]);

  const fetchCurrentDocuments = async () => {
    try {
      const response = await api.get<LegalDocument[]>('/legal-documents');
      setUploadedDocs(response.data || []);
    } catch (err) {
      console.error('Error al cargar documentos actuales:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setFeedback({
          type: 'error',
          message: 'El archivo seleccionado debe ser un PDF.',
        });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setFeedback(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) {
      setFeedback({ type: 'error', message: 'Por favor selecciona un tipo de documento.' });
      return;
    }
    if (!file) {
      setFeedback({ type: 'error', message: 'Por favor selecciona un archivo PDF.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('slug', slug);
    formData.append('version', version);
    formData.append('file', file);

    try {
      await api.post('/legal-documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFeedback({
        type: 'success',
        message: 'Documento legal subido y actualizado con éxito.',
      });
      setSlug('');
      setVersion('1.0');
      setFile(null);
      
      // Reset file input element
      const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      void fetchCurrentDocuments();
    } catch (err) {
      console.error('Error al subir el documento:', err);
      const errorWithResponse = err as { response?: { data?: { message?: string } } };
      setFeedback({
        type: 'error',
        message: errorWithResponse.response?.data?.message || 'Error al intentar subir el documento.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHistory = (docSlug: string) => {
    setExpandedHistory((prev) => ({ ...prev, [docSlug]: !prev[docSlug] }));
  };

  const buildPdfLink = (pdfUrl: string | null | undefined) => {
    if (!pdfUrl) return '#';
    if (pdfUrl.startsWith('http')) return pdfUrl;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${pdfUrl}`;
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="p-8 text-center dark:text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />
        
        <div className="flex-1 p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">
              Administración de Documentos Legales
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Carga y actualiza los documentos en formato PDF. Cada versión anterior queda guardada en el historial.
            </p>

            {feedback && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                  feedback.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300'
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <span className="font-medium">{feedback.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Formulario de carga */}
              <div className="lg:col-span-2 bg-white dark:bg-[#232323] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 dark:border-gray-800">
                  Subir nuevo PDF
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="document-slug" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de documento
                    </label>
                    <select
                      id="document-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1C1D1F] focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Selecciona un tipo de documento</option>
                      {DOCUMENT_OPTIONS.map((opt) => (
                        <option key={opt.slug} value={opt.slug}>
                          {opt.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="document-version" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Versión / Fecha de vigencia
                    </label>
                    <input
                      id="document-version"
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="Ej. 1.0, Junio 2026, 2026-06-23"
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1C1D1F] focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Documento PDF
                    </span>
                    
                    <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-orange-500 transition-colors">
                      <input
                        id="pdf-file-input"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                      
                      <div className="flex flex-col items-center">
                        <FiUploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                        {file ? (
                          <div>
                            <p className="text-orange-500 font-semibold">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Arrastra tu archivo PDF o haz clic para buscar
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Solo se permiten archivos .pdf</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
                      submitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? 'Cargando documento...' : 'Subir y publicar'}
                  </button>
                </form>
              </div>

              {/* Lista de documentos actuales + historial */}
              <div className="lg:col-span-3 bg-white dark:bg-[#232323] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 dark:border-gray-800">
                  Documentos vigentes e historial
                </h2>

                <div className="space-y-4">
                  {DOCUMENT_OPTIONS.map((opt) => {
                    const currentDoc = uploadedDocs.find((doc) => doc.slug === opt.slug);
                    const hasHistory = (currentDoc?.versions?.length || 0) > 0;
                    const isExpanded = expandedHistory[opt.slug] || false;

                    return (
                      <div
                        key={opt.slug}
                        className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1C1D1F] overflow-hidden"
                      >
                        {/* Documento actual */}
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <FiFileText className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {opt.title}
                              </p>
                              {currentDoc ? (
                                <div className="mt-1 space-y-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Versión vigente: <span className="font-bold text-orange-600 dark:text-orange-400">{currentDoc.version}</span>
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Actualizado: {formatDate(currentDoc.updatedAt)}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <a
                                      href={buildPdfLink(currentDoc.pdfUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:underline"
                                    >
                                      <FiExternalLink className="w-3 h-3" />
                                      Ver PDF actual
                                    </a>
                                    {hasHistory && (
                                      <button
                                        onClick={() => toggleHistory(opt.slug)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
                                      >
                                        <FiClock className="w-3 h-3" />
                                        Historial ({currentDoc.versions!.length} versión{currentDoc.versions!.length > 1 ? 'es' : ''})
                                        {isExpanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                  Sin cargar (Se muestra fallback)
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Historial de versiones (expandible) */}
                        {isExpanded && hasHistory && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#232323]">
                            <div className="px-4 py-3">
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Versiones anteriores
                              </p>
                              <div className="space-y-2">
                                {currentDoc!.versions!.map((v, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#1C1D1F] border border-gray-100 dark:border-gray-800"
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Versión {v.version}
                                      </p>
                                      <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {formatDate(v.uploadedAt)}
                                      </p>
                                    </div>
                                    <a
                                      href={buildPdfLink(v.pdfUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline whitespace-nowrap"
                                    >
                                      <FiExternalLink className="w-3 h-3" />
                                      Ver PDF
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
