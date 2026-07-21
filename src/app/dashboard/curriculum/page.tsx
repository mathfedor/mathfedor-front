'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FiBook, FiSave, FiLayers, FiSettings, FiCheckCircle, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { authService } from '@/services/auth.service';
import { bookService } from '@/services/book.service';
import type { Book } from '@/types/book.types';

function CurriculumAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookSlugParam = searchParams.get('bookSlug');

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Navegación jerárquica
  const [books] = useState([
    { slug: 'libro-1ro', title: 'Matemáticas de Fedor 1°' },
    { slug: 'matematicas-fedor-2', title: 'Matemáticas de Fedor 2°' }
  ]);
  const [selectedBookSlug, setSelectedBookSlug] = useState('libro-1ro');
  const [bookData, setBookData] = useState<Book | null>(null);
  
  const [selectedUnitIdx, setSelectedUnitIdx] = useState<number>(0);
  const [selectedTopicIdx, setSelectedTopicIdx] = useState<number>(0);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(0); // 0 a 4

  // Datos locales para la edición
  const [levelLabel, setLevelLabel] = useState('');
  const [levelBg, setLevelBg] = useState('');
  const [levelColor, setLevelColor] = useState('');
  const [unitName, setUnitName] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [examples, setExamples] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);

  // Pestaña activa en la edición del nivel
  const [activeTab, setActiveTab] = useState<'config' | 'examples' | 'exercises'>('config');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!authService.isAuthenticated() || !user) {
      router.replace('/login');
      return;
    }
    const role = user.role.toLowerCase();
    if (role !== 'admin' && role !== 'superadmin') {
      router.replace('/dashboard');
      return;
    }
    setIsAdmin(true);
    void loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, selectedBookSlug]);

  useEffect(() => {
    if (bookSlugParam && (bookSlugParam === 'libro-1ro' || bookSlugParam === 'matematicas-fedor-2')) {
      setSelectedBookSlug(bookSlugParam);
    }
  }, [bookSlugParam]);

  // Carga del libro y nivel seleccionado
  const loadBook = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const book = await bookService.getBook(selectedBookSlug);
      setBookData(book);
      
      // Cargar los datos del nivel por defecto
      await loadLevelDetails(book, selectedUnitIdx, selectedTopicIdx, selectedLevelIdx);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al cargar el currículo del libro.' });
      setLoading(false);
    }
  };

  const loadLevelDetails = async (book: Book, uIdx: number, tIdx: number, lIdx: number) => {
    const unit = book.units[uIdx];
    const topic = unit?.topics[tIdx];
    const level = topic?.levels[lIdx];
    
    if (!level) {
      setLoading(false);
      return;
    }

    setUnitName(unit.name || '');
    setTopicTitle(topic.title || '');
    setLevelLabel(level.label || `Nivel ${lIdx + 1}`);
    setLevelBg(level.bg || '#DCF5EE');
    setLevelColor(level.color || '#074F3A');
    setExercises(level.exercises || []);

    // Traer ejemplos
    try {
      const key = canonicalKey(uIdx, tIdx, lIdx);
      const exData = await bookService.getExamples(key, selectedBookSlug);
      setExamples(exData || []);
    } catch (err) {
      console.warn('Error al cargar ejemplos:', err);
      setExamples([]);
    }
    setLoading(false);
  };

  const canonicalKey = (uIdx: number, tIdx: number, lIdx: number): string => {
    return `u${uIdx}t${tIdx}-n${lIdx + 1}`;
  };

  // Cambio de navegación jerárquica
  const handleBookChange = (slug: string) => {
    setSelectedBookSlug(slug);
    setSelectedUnitIdx(0);
    setSelectedTopicIdx(0);
    setSelectedLevelIdx(0);
  };

  const handleUnitChange = (uIdx: number) => {
    setSelectedUnitIdx(uIdx);
    setSelectedTopicIdx(0);
    setSelectedLevelIdx(0);
    if (bookData) void loadLevelDetails(bookData, uIdx, 0, 0);
  };

  const handleTopicChange = (tIdx: number) => {
    setSelectedTopicIdx(tIdx);
    setSelectedLevelIdx(0);
    if (bookData) void loadLevelDetails(bookData, selectedUnitIdx, tIdx, 0);
  };

  const handleLevelChange = (lIdx: number) => {
    setSelectedLevelIdx(lIdx);
    if (bookData) void loadLevelDetails(bookData, selectedUnitIdx, selectedTopicIdx, lIdx);
  };

  // Acciones en Ejemplos
  const handleAddExample = () => {
    const newEx = {
      q: 'Enunciado del ejemplo nuevo',
      a: 'Respuesta',
      explain: 'Explicación del ejemplo',
      icon: '💡',
      vis: { type: 'icon', name: 'calc' }
    };
    setExamples([...examples, newEx]);
  };

  const handleRemoveExample = (idx: number) => {
    setExamples(examples.filter((_, i) => i !== idx));
  };

  const handleExampleChange = (idx: number, field: string, value: any) => {
    const updated = [...examples];
    updated[idx] = { ...updated[idx], [field]: value };
    setExamples(updated);
  };

  // Acciones en Ejercicios
  const handleAddExercise = () => {
    const newExe = {
      id: `custom-exe-${Date.now()}`,
      q: 'Enunciado del ejercicio nuevo',
      opts: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
      ans: 'Opción A',
      proc: 'Procedimiento o explicación paso a paso'
    };
    setExercises([...exercises, newExe]);
  };

  const handleRemoveExercise = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleExerciseChange = (idx: number, field: string, value: any) => {
    const updated = [...exercises];
    updated[idx] = { ...updated[idx], [field]: value };
    setExercises(updated);
  };

  const handleExerciseOptChange = (exeIdx: number, optIdx: number, value: string) => {
    const updated = [...exercises];
    const opts = [...updated[exeIdx].opts];
    opts[optIdx] = value;
    updated[exeIdx] = { ...updated[exeIdx], opts };
    setExercises(updated);
  };

  const handleAddExerciseOpt = (exeIdx: number) => {
    const updated = [...exercises];
    const opts = [...(updated[exeIdx].opts || []), 'Opción Nueva'];
    updated[exeIdx] = { ...updated[exeIdx], opts };
    setExercises(updated);
  };

  const handleRemoveExerciseOpt = (exeIdx: number, optIdx: number) => {
    const updated = [...exercises];
    const opts = updated[exeIdx].opts.filter((_: any, i: number) => i !== optIdx);
    updated[exeIdx] = { ...updated[exeIdx], opts };
    setExercises(updated);
  };

  // Guardar nivel completo
  const handleSaveLevel = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const levelKey = canonicalKey(selectedUnitIdx, selectedTopicIdx, selectedLevelIdx);
      const levelData = {
        levelKey,
        levelLabel,
        levelBg,
        levelColor,
        unitName,
        topicTitle,
        examples,
        exercises
      };
      await bookService.updateBookLevel(selectedBookSlug, levelData);
      setMessage({ type: 'success', text: `¡Nivel ${levelKey} guardado con éxito!` });
      
      // Recargar el libro en local para que la estructura quede actualizada
      const book = await bookService.getBook(selectedBookSlug);
      setBookData(book);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Error al guardar el nivel en el servidor.' });
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;

  const currentUnit = bookData?.units[selectedUnitIdx];
  const currentTopic = currentUnit?.topics[selectedTopicIdx];

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#1C1D1F] text-black dark:text-white">
      <Sidebar />
      <main className="flex-1 bg-[#F9F9F9] p-8 overflow-y-auto" style={{ paddingTop: '5.5rem' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiSettings className="text-purple-600" /> Editor del Libro Interactivo
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Modifica la estructura de las unidades, ejemplos de nivel y preguntas didácticas.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedBookSlug}
              onChange={(e) => handleBookChange(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold shadow-sm focus:border-purple-500 focus:outline-none text-black"
            >
              {books.map((b) => (
                <option key={b.slug} value={b.slug}>{b.title}</option>
              ))}
            </select>

            <button
              onClick={handleSaveLevel}
              disabled={saving || !bookData}
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <span>Guardando…</span>
              ) : (
                <>
                  <FiSave /> Guardar Nivel
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? <FiCheckCircle className="text-green-500 flex-shrink-0" /> : <FiAlertCircle className="text-red-500 flex-shrink-0" />}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center text-gray-500 font-medium">
            Cargando editor del libro...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* ── PANEL DE SELECCIÓN JERÁRQUICA ── */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiBook className="text-purple-500" /> Unidades
                </h3>
                <div className="space-y-1">
                  {bookData?.units.map((u, i) => (
                    <button
                      key={u.id}
                      onClick={() => handleUnitChange(i)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition ${
                        selectedUnitIdx === i 
                          ? 'bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      {u.short} · {u.name}
                    </button>
                  ))}
                </div>
              </div>

              {currentUnit && (
                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiLayers className="text-purple-500" /> Temas
                  </h3>
                  <div className="space-y-1">
                    {currentUnit.topics.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => handleTopicChange(i)}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition ${
                          selectedTopicIdx === i 
                            ? 'bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentTopic && (
                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                    ⭐ Niveles del Tema
                  </h3>
                  <div className="space-y-1">
                    {currentTopic.levels.map((l, i) => (
                      <button
                        key={i}
                        onClick={() => handleLevelChange(i)}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition ${
                          selectedLevelIdx === i 
                            ? 'bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        {l.label || `Nivel ${i + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── PANEL DE EDICIÓN DEL NIVEL ── */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* TABS */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('config')}
                    className={`pb-4 px-1 border-b-2 font-bold text-sm ${
                      activeTab === 'config'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ⚙️ Configuración de Nivel
                  </button>
                  <button
                    onClick={() => setActiveTab('examples')}
                    className={`pb-4 px-1 border-b-2 font-bold text-sm ${
                      activeTab === 'examples'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    💡 Ejemplos Guiados ({examples.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('exercises')}
                    className={`pb-4 px-1 border-b-2 font-bold text-sm ${
                      activeTab === 'exercises'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📝 Ejercicios Prácticos ({exercises.length})
                  </button>
                </nav>
              </div>

              {/* ── PESTAÑA: CONFIGURACIÓN DEL NIVEL ── */}
              {activeTab === 'config' && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Metadata de la Unidad y Tema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título de la Unidad</label>
                        <input
                          type="text"
                          value={unitName}
                          onChange={(e) => setUnitName(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black font-semibold"
                          placeholder="Unidad 1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Tema</label>
                        <input
                          type="text"
                          value={topicTitle}
                          onChange={(e) => setTopicTitle(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black font-semibold"
                          placeholder="Tema"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Metadata del Nivel</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre / Etiqueta del Nivel</label>
                      <input
                        type="text"
                        value={levelLabel}
                        onChange={(e) => setLevelLabel(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                        placeholder="Nivel 1 — Básico"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Color Fondo Nivel</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={levelBg.startsWith('#') && (levelBg.length === 7 || levelBg.length === 4) ? (levelBg.length === 4 ? '#' + levelBg[1] + levelBg[1] + levelBg[2] + levelBg[2] + levelBg[3] + levelBg[3] : levelBg) : '#DCF5EE'}
                          onChange={(e) => setLevelBg(e.target.value)}
                          className="w-10 h-10 p-0 border border-gray-300 rounded-md cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={levelBg}
                          onChange={(e) => setLevelBg(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                          placeholder="#DCF5EE"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Color Texto Nivel</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={levelColor.startsWith('#') && (levelColor.length === 7 || levelColor.length === 4) ? (levelColor.length === 4 ? '#' + levelColor[1] + levelColor[1] + levelColor[2] + levelColor[2] + levelColor[3] + levelColor[3] : levelColor) : '#074F3A'}
                          onChange={(e) => setLevelColor(e.target.value)}
                          className="w-10 h-10 p-0 border border-gray-300 rounded-md cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={levelColor}
                          onChange={(e) => setLevelColor(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                          placeholder="#074F3A"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border mt-4 flex items-center justify-between" style={{ backgroundColor: levelBg, color: levelColor }}>
                    <div>
                      <span className="text-xs font-bold uppercase opacity-85">Vista Previa de Tarjeta</span>
                      <div className="text-base font-black">{levelLabel}</div>
                    </div>
                    <div className="text-xs font-bold py-1 px-3 rounded-full" style={{ backgroundColor: levelColor, color: levelBg }}>
                      Iniciar
                    </div>
                  </div>
                </div>
              )}

              {/* ── PESTAÑA: EJEMPLOS ── */}
              {activeTab === 'examples' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Ejemplos explicativos del nivel</h3>
                    <button
                      onClick={handleAddExample}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition"
                    >
                      <FiPlus /> Agregar Ejemplo
                    </button>
                  </div>

                  <div className="space-y-4">
                    {examples.map((ex, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-sm font-black text-purple-600">Ejemplo #{idx + 1}</span>
                          <button
                            onClick={() => handleRemoveExample(idx)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1"
                          >
                            <FiTrash2 /> Eliminar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Enunciado (Pregunta)</label>
                            <textarea
                              value={ex.q}
                              onChange={(e) => handleExampleChange(idx, 'q', e.target.value)}
                              rows={2}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Respuesta Correcta</label>
                            <input
                              type="text"
                              value={ex.a}
                              onChange={(e) => handleExampleChange(idx, 'a', e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Explicación o Procedimiento</label>
                          <textarea
                            value={ex.explain}
                            onChange={(e) => handleExampleChange(idx, 'explain', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                          />
                        </div>
                      </div>
                    ))}

                    {examples.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm font-medium bg-white rounded-lg border border-dashed">
                        No hay ejemplos agregados para este nivel. ¡Presiona "Agregar Ejemplo" para crear uno!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── PESTAÑA: EJERCICIOS ── */}
              {activeTab === 'exercises' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Listado de Ejercicios Didácticos</h3>
                    <button
                      onClick={handleAddExercise}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition"
                    >
                      <FiPlus /> Agregar Ejercicio
                    </button>
                  </div>

                  <div className="space-y-4">
                    {exercises.map((exe, idx) => (
                      <div key={exe.id || idx} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-sm font-black text-purple-600">Ejercicio #{idx + 1}</span>
                          <button
                            onClick={() => handleRemoveExercise(idx)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1"
                          >
                            <FiTrash2 /> Eliminar
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pregunta (Enunciado)</label>
                          <textarea
                            value={exe.q}
                            onChange={(e) => handleExerciseChange(idx, 'q', e.target.value)}
                            rows={2}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                          />
                        </div>

                        {/* Opciones */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-700 uppercase">Opciones de Respuesta Múltiple</span>
                            <button
                              onClick={() => handleAddExerciseOpt(idx)}
                              className="text-xs text-purple-600 hover:text-purple-700 font-bold inline-flex items-center gap-1"
                            >
                              <FiPlus /> Agregar Opción
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(exe.opts || []).map((opt: string, oIdx: number) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleExerciseOptChange(idx, oIdx, e.target.value)}
                                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none text-black"
                                />
                                <button
                                  onClick={() => handleRemoveExerciseOpt(idx, oIdx)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  title="Quitar opción"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Respuesta Correcta (Exactamente igual a una de las opciones)</label>
                            <input
                              type="text"
                              value={exe.ans}
                              onChange={(e) => handleExerciseChange(idx, 'ans', e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Explicación Paso a Paso (Ayuda)</label>
                            <input
                              type="text"
                              value={exe.proc || ''}
                              onChange={(e) => handleExerciseChange(idx, 'proc', e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-black"
                              placeholder="Ej: Sumando 5 unidades a 3 resulta en 8..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {exercises.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm font-medium bg-white rounded-lg border border-dashed">
                        No hay ejercicios prácticos en este nivel. ¡Presiona "Agregar Ejercicio" para crear uno!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CurriculumAdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex bg-white dark:bg-[#1C1D1F]">
        <Sidebar />
        <main className="flex-1 bg-[#F9F9F9] p-8">
          <div className="flex h-full items-center justify-center text-gray-600">Cargando editor…</div>
        </main>
      </div>
    }>
      <CurriculumAdminContent />
    </Suspense>
  );
}
