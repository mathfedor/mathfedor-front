'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Sidebar from '@/components/Sidebar';
import { DiagnosticConfig } from '@/types/diagnostic.types';
import { authService } from '@/services/auth.service';
import { chatService } from '@/services/chat.service';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiX, FiSend, FiShuffle, FiPlus, FiMic } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/components/ui/tooltip';
import { User } from '@/types/auth.types';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Module, moduleService } from '@/services/module.service';
import { useModuleAccess } from '@/contexts/ModuleAccessContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Author {
  name: string;
  avatar: string;
  role: string;
  timeAgo: string;
}

interface Reply {
  id: number;
  author: Author;
  content: string;
  likes: number;
}

interface Question {
  id: number;
  author: Author;
  content: string;
  likes: number;
  replies: Reply[];
}

interface QuestionStep {
  questions: Question[];
}

interface ExerciseAnswer {
  topicId: string;
  topicTitle: string;
  exerciseId: string;
  userAnswer: string;  // Letra seleccionada (A, B, C, D)
  correctAnswer: string;  // Letra correcta (A, B, C, D)
  isCorrect: boolean;
  options: string[];  // Opciones mostradas al usuario
}

interface TopicBlock {
  type: 'paragraph' | 'math_layout';
  content?: {
    text?: string;
  };
}

interface Subtopic {
  title: string;
  blocks?: TopicBlock[];
}

interface Topic {
  _id: string;
  title: string;
  description: string;
  subtopics?: Subtopic[];
  exercises: Array<{
    statement: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export default function ModuleExercisesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [commentsTab, setCommentsTab] = useState<'help' | 'contributions'>('contributions');
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticConfigs, setDiagnosticConfigs] = useState<(DiagnosticConfig & { topics: Topic[] })[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const router = useRouter();
  const { hasAccess } = useModuleAccess();
  const totalSteps = diagnosticConfigs[0]?.topics?.length * 2 || 0; // Cada tema tiene 2 pasos: descripción y ejercicios
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{
    goodAnswers: number;
    wrongAnswers: number;
    subjects: Array<{
      title: string;
      points: number;
      maxPoints: number;
      percentage: number;
      N1: string;
      N2: string;
      N3: string;
      N4: string;
    }>;
    answers: Array<{
      exerciseId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }>;
  }>({
    goodAnswers: 0,
    wrongAnswers: 0,
    subjects: [],
    answers: []
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const [showResults, setShowResults] = useState(false);

  // Array de preguntas y respuestas por paso
  const questionsByStep: QuestionStep[] = [
    // Paso 1: Verificación de Indexación
    {
      questions: [
        {
          id: 1,
          author: {
            name: "Carlos Ramírez",
            avatar: "C",
            role: "Estudiante",
            timeAgo: "hace 2 días"
          },
          content: "¿Es necesario verificar la indexación si mi sitio es nuevo y aún no tiene mucho contenido?",
          likes: 5,
          replies: [
            {
              id: 2,
              author: {
                name: "Ana Martínez",
                avatar: "A",
                role: "Profesor",
                timeAgo: "hace 1 día"
              },
              content: "¡Sí! Es fundamental verificar la indexación desde el principio. Esto te ayudará a identificar problemas temprano y asegurarte de que Google pueda encontrar tu contenido desde el inicio.",
              likes: 8
            }
          ]
        },
        {
          id: 3,
          author: {
            name: "Laura González",
            avatar: "L",
            role: "Estudiante",
            timeAgo: "hace 1 día"
          },
          content: "¿Cada cuánto tiempo debo verificar la indexación de mi sitio web?",
          likes: 4,
          replies: [
            {
              id: 4,
              author: {
                name: "Miguel Torres",
                avatar: "M",
                role: "Profesor",
                timeAgo: "hace 12 horas"
              },
              content: "Se recomienda verificar la indexación al menos una vez por semana si publicas contenido regularmente. Si tu sitio es más estático, una vez al mes puede ser suficiente.",
              likes: 6
            }
          ]
        }
      ]
    },
    // Paso 2: URLs no Indexables
    {
      questions: [
        {
          id: 5,
          author: {
            name: "Pedro Sánchez",
            avatar: "P",
            role: "Estudiante",
            timeAgo: "hace 3 días"
          },
          content: "¿Qué debo hacer si encuentro URLs importantes que no están siendo indexadas?",
          likes: 7,
          replies: [
            {
              id: 6,
              author: {
                name: "Diana López",
                avatar: "D",
                role: "Profesor",
                timeAgo: "hace 2 días"
              },
              content: "Primero, verifica que no estén bloqueadas en el robots.txt. Luego, asegúrate de que las URLs sean accesibles y tengan contenido único y valioso. También puedes usar Google Search Console para solicitar la indexación manualmente.",
              likes: 12
            }
          ]
        },
        {
          id: 7,
          author: {
            name: "María Jiménez",
            avatar: "M",
            role: "Estudiante",
            timeAgo: "hace 1 día"
          },
          content: "¿Es normal que algunas páginas tarden en ser indexadas aunque ya estén publicadas?",
          likes: 3,
          replies: [
            {
              id: 8,
              author: {
                name: "Roberto García",
                avatar: "R",
                role: "Profesor",
                timeAgo: "hace 10 horas"
              },
              content: "Sí, es normal. Google tiene su propio ritmo de rastreo e indexación. Las páginas nuevas pueden tardar desde unas horas hasta varias semanas en ser indexadas, dependiendo de varios factores como la autoridad del dominio y la frecuencia de actualización del sitio.",
              likes: 5
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    const checkAuthAndAccess = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/login');
          return;
        }

        const userData = authService.getCurrentUser();
        if (!userData) {
          throw new Error('No se encontró información del usuario');
        }

        // Verificar acceso al módulo usando el ID resuelto
        if (!hasAccess(resolvedParams.id)) {
          router.replace('/dashboard');
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error('Error:', error);
        setAlertMessage({
          title: 'Error',
          message: error instanceof Error ? error.message : 'Error al verificar acceso'
        });
        setIsAlertOpen(true);
      }
    };

    checkAuthAndAccess();
  }, [router, resolvedParams.id, hasAccess]);

  useEffect(() => {
    const fetchDiagnosticConfig = async () => {
      try {
        setIsLoading(true);
        // Primero obtener el módulo específico por ID
        const moduleData = await moduleService.getModuleById(resolvedParams.id);
        setCurrentModule(moduleData);

        // Si el módulo no está publicado, no cargar los ejercicios
        if (moduleData.published === false) {
          setIsLoading(false);
          return;
        }

        const configs = await moduleService.findByGroup(moduleData.group);
        if (configs && configs.length > 0) {
          setDiagnosticConfigs(configs as unknown as (DiagnosticConfig & { topics: Topic[] })[]);
        }
      } catch (error) {
        console.error('Error al obtener la configuración del diagnóstico:', error);
        setAlertMessage({
          title: 'Error',
          message: 'No se pudo cargar la configuración del diagnóstico.'
        });
        setIsAlertOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosticConfig();
  }, [resolvedParams.id]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const handleAnswerSelect = (exerciseIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answerIndex.toString()
    }));
  };

  // Función para mapear índice a letra
  const indexToLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // 65 es el código ASCII para 'A'
  };

  const getAverage = (points: number, maxPoints: number): number => {
    return (points / maxPoints) * 5;
  };

  const hasCDUHeader = (text: string): boolean => /(^|\n)\s*C\s+D\s+U\b/i.test(text);

  const splitMathSections = (text: string): string[] => {
    const normalizedText = text.replace(/\r/g, '').trim();
    if (!normalizedText) return [];

    const lines = normalizedText.split('\n');
    const sections: string[] = [];
    let currentSection: string[] = [];

    lines.forEach((line) => {
      if (/^\s*C\s+D\s+U\b/i.test(line) && currentSection.length > 0) {
        sections.push(currentSection.join('\n'));
        currentSection = [line];
        return;
      }

      currentSection.push(line);
    });

    if (currentSection.length > 0) {
      sections.push(currentSection.join('\n'));
    }

    return sections;
  };

  const parseMathRow = (line: string, columnCount: number) => {
    let columnText = '';
    let digitCount = 0;
    let index = 0;

    while (index < line.length) {
      const char = line[index];
      const nextChar = line[index + 1];

      if (/\d/.test(char)) {
        if (digitCount >= columnCount) {
          break;
        }

        if (/[+\-=*/]/.test(nextChar ?? '')) {
          if (digitCount === 0) {
            columnText += char;
            digitCount += 1;
            index += 1;
          }
          break;
        }

        columnText += char;
        digitCount += 1;
        index += 1;
        continue;
      }

      if (char === ' ') {
        columnText += char;
        index += 1;
        continue;
      }

      break;
    }

    const explanation = line.slice(index).trim();
    const columns = columnText
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return {
      columns,
      explanation
    };
  };

  const renderMathLayout = (text: string, blockKey: string) => {
    const sections = splitMathSections(text);

    if (sections.length === 0) {
      return null;
    }

    return (
      <div className="space-y-6">
        {sections.map((sectionText, sectionIndex) => {
          const lines = sectionText
            .split('\n')
            .map((line) => line.trimEnd())
            .filter((line) => line.trim().length > 0);

          const headerLine = lines[0] ?? '';
          const headerMatch = headerLine.match(/^C\s+D\s+U\b\s*(.*)$/i);

          if (!headerMatch) {
            return (
              <pre
                key={`${blockKey}-plain-${sectionIndex}`}
                className="overflow-x-auto rounded-lg bg-gray-100 dark:bg-[#282828] p-4 font-mono text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap"
              >
                {sectionText}
              </pre>
            );
          }

          const headerColumns = ['C', 'D', 'U'];
          const rows = lines.slice(1).map((line) => parseMathRow(line, headerColumns.length));
          const lastRowIndex = rows.length - 1;

          return (
            <div
              key={`${blockKey}-section-${sectionIndex}`}
              className="overflow-x-auto rounded-lg bg-gray-100 dark:bg-[#282828] p-4"
            >
              <div className="min-w-[520px] space-y-2 font-mono text-sm text-gray-700 dark:text-gray-200">
                <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-4 items-start">
                  <div className="flex justify-end gap-6 font-semibold">
                    {headerColumns.map((column) => (
                      <span key={column} className="w-4 text-center">
                        {column}
                      </span>
                    ))}
                  </div>
                  <div className="whitespace-pre-wrap">{headerMatch[1]?.trim()}</div>
                </div>

                {rows.map((row, rowIndex) => (
                  <div key={`${blockKey}-row-${sectionIndex}-${rowIndex}`} className="space-y-2">
                    {rowIndex === lastRowIndex && rows.length > 1 && (
                      <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-4 items-start">
                        <div className="flex justify-end">
                          <div className="w-[132px] border-t-2 border-gray-400 dark:border-gray-500" />
                        </div>
                        <div />
                      </div>
                    )}

                    <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-4 items-start">
                      <div className="flex justify-end gap-6">
                        {headerColumns.map((_, columnIndex) => {
                          const columnValue = row.columns[row.columns.length - headerColumns.length + columnIndex] ?? '';

                          return (
                            <span
                              key={`${blockKey}-col-${sectionIndex}-${rowIndex}-${columnIndex}`}
                              className="w-4 text-center"
                            >
                              {columnValue}
                            </span>
                          );
                        })}
                      </div>
                      <div className="whitespace-pre-wrap">{row.explanation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Función para validar respuestas del tema actual
  const validateCurrentTopicAnswers = async () => {
    const currentTopic = diagnosticConfigs[0].topics[Math.floor((currentStep - 1) / 2)];
    const exercises = currentTopic.exercises;

    // Validar que todas las preguntas tengan respuesta
    const allAnswered = exercises.every((_, index) => selectedAnswers[index] !== undefined);
    if (!allAnswered) {
      setAlertMessage({
        title: 'Preguntas incompletas',
        message: 'Por favor responde todas las preguntas antes de continuar.'
      });
      setIsAlertOpen(true);
      return false;
    }

    // Procesar cada respuesta
    const newAnswers: ExerciseAnswer[] = exercises.map((exercise, index) => {
      const userSelectedIndex = selectedAnswers[index];
      const userAnswer = indexToLetter(parseInt(userSelectedIndex));
      const isCorrect = userAnswer === exercise.correctAnswer;

      return {
        topicId: currentTopic._id,
        topicTitle: currentTopic.title,
        exerciseId: `${currentTopic._id}_ex${index + 1}`,
        userAnswer,
        correctAnswer: exercise.correctAnswer,
        isCorrect,
        options: exercise.options
      };
    });

    // Calcular estadísticas
    const correctAnswers = newAnswers.filter(answer => answer.isCorrect).length;
    const wrongAnswers = newAnswers.length - correctAnswers;

    // Calcular puntos usando getAverage
    const points = (correctAnswers / exercises.length) * 10;
    const percentage = getAverage(points, 10);

    const newSubject = {
      title: currentTopic.title,
      points: points,
      maxPoints: 10,
      percentage: percentage,
      N1: '0%',
      N2: '0%',
      N3: '0%',
      N4: '0%'
    };

    setResults(prev => ({
      ...prev,
      goodAnswers: prev.goodAnswers + correctAnswers,
      wrongAnswers: prev.wrongAnswers + wrongAnswers,
      subjects: [...prev.subjects, newSubject],
      answers: [...prev.answers, ...newAnswers.map(answer => ({
        exerciseId: answer.exerciseId,
        selectedAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect
      }))]
    }));

    return true;
  };

  const getCurrentContent = () => {
    if (!diagnosticConfigs.length) return { title: 'Cargando...', content: null };

    const topics = diagnosticConfigs[0].topics;
    const currentTopicIndex = Math.floor((currentStep - 1) / 2);
    const isExerciseStep = (currentStep % 2) === 0;
    const currentTopic = topics[currentTopicIndex];

    if (isExerciseStep) {
      return {
        title: `Ejercicios - ${currentTopic.title}`,
        content: (
          <div className="space-y-6">
            {currentTopic.exercises.map((exercise, index) => (
              <div key={index} className="bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-black dark:text-white font-medium mb-4">Ejercicio {index + 1}</h3>
                <p className="text-black dark:text-gray-200 mb-4">{exercise.statement}</p>
                <div className="space-y-3">
                  {exercise.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`exercise-${index}`}
                        id={`option-${index}-${optIndex}`}
                        value={option}
                        checked={selectedAnswers[index] === optIndex.toString()}
                        onChange={() => handleAnswerSelect(index, optIndex)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`option-${index}-${optIndex}`}
                        className="text-black dark:text-gray-200"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      };
    }

    return {
      title: currentTopic.title,
      content: (
        <div className="max-w-none space-y-8">
          {(currentTopic.subtopics ?? []).map((subtopic, subtopicIndex) => (
            <div key={`${currentTopic._id}-subtopic-${subtopicIndex}`} className="space-y-4">
              {subtopic.title && (
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  {subtopic.title}
                </h3>
              )}

              {(subtopic.blocks ?? []).map((block, blockIndex) => {
                const blockText = block.content?.text?.trim();

                if (!blockText) {
                  return null;
                }

                if (block.type === 'math_layout') {
                  return hasCDUHeader(blockText) ? (
                    <div key={`${currentTopic._id}-math-${subtopicIndex}-${blockIndex}`}>
                      {renderMathLayout(blockText, `${currentTopic._id}-${subtopicIndex}-${blockIndex}`)}
                    </div>
                  ) : (
                    <pre
                      key={`${currentTopic._id}-math-${subtopicIndex}-${blockIndex}`}
                      className="overflow-x-auto rounded-lg bg-gray-100 dark:bg-[#282828] p-4 font-mono text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap"
                    >
                      {blockText}
                    </pre>
                  );
                }

                return (
                  <p
                    key={`${currentTopic._id}-paragraph-${subtopicIndex}-${blockIndex}`}
                    className="text-base leading-7 text-gray-700 dark:text-gray-300 whitespace-pre-line"
                  >
                    {blockText}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      )
    };
  };

  const { title, content } = getCurrentContent();
  const isCurrentExerciseStep = (currentStep % 2) === 0;
  const activeCommentsTab = isCurrentExerciseStep ? 'contributions' : commentsTab;

  // Actualizar la lógica de navegación
  const handleNext = async () => {
    const isExerciseStep = (currentStep % 2) === 0;

    if (isExerciseStep) {
      const success = await validateCurrentTopicAnswers();
      if (!success) return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (showChat) {
      setShowChat(false);
      setCurrentStep(totalSteps);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const token = authService.getToken();
    if (!token) {
      setAlertMessage({
        title: 'Error',
        message: 'No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.'
      });
      setIsAlertOpen(true);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendChatMessages([userMessage], token);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage({
        title: 'Error',
        message: 'No se pudo enviar el mensaje. Por favor, intenta de nuevo.'
      });
      setIsAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const fillRandomAnswers = () => {
    const currentTopic = diagnosticConfigs[0].topics[Math.floor((currentStep - 1) / 2)];
    const exercises = currentTopic.exercises;

    const randomAnswers: { [key: string]: string } = {};
    exercises.forEach((_, index) => {
      const randomIndex = Math.floor(Math.random() * exercises[index].options.length);
      randomAnswers[index] = randomIndex.toString();
    });

    setSelectedAnswers(randomAnswers);
  };

  const handleContinueToChat = () => {
    setShowResults(false);
    setShowChat(true);
  };

  const handleTopicSelect = (topicIndex: number) => {
    setCurrentStep(topicIndex * 2 + 1);
    setSelectedAnswers({});
    setShowResults(false);
    setShowChat(false);
    setIsMaterialOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <Sidebar />
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title={alertMessage.title}
        message={alertMessage.message}
      />
      <div className="flex-1">
        {/* Mostrar mensaje si el módulo no está publicado */}
        {currentModule && currentModule.published === false ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md px-6">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Estamos construyendo este módulo
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Este módulo está en desarrollo. Pronto estará disponible con contenido educativo de alta calidad.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Barra de navegación superior */}
            <div className="sticky top-0 z-50 h-16 bg-white dark:bg-[#1C1D1F] flex items-center justify-between px-6 text-black dark:text-white shadow-md">
              <div className="flex items-center">
                <h1 className="text-lg font-medium">{diagnosticConfigs.length > 0 ? diagnosticConfigs[0].title : 'Módulo'}</h1>
              </div>
              <div className="flex items-center gap-3">
                {process.env.NODE_ENV === 'development' && !showChat && (currentStep % 2) === 0 && (
                  <button
                    onClick={fillRandomAnswers}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-[#282828] dark:hover:bg-[#363636] rounded-md transition-colors"
                  >
                    <FiShuffle className="w-4 h-4" />
                    Llenar aleatorio
                  </button>
                )}
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1 && !showChat}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${currentStep === 1 && !showChat
                    ? 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-[#282828] dark:hover:bg-[#363636]'
                    } rounded-md transition-colors`}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <Tooltip content="Ver la lista de temas" position="bottom">
                  <button
                    onClick={() => setIsMaterialOpen(!isMaterialOpen)}
                    className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-[#282828] dark:hover:bg-[#363636] rounded-md transition-colors"
                  >
                    Temas
                  </button>
                </Tooltip>
                {!showChat && (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === totalSteps && showChat}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${currentStep === totalSteps && showChat
                      ? 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-[#282828] dark:hover:bg-[#363636]'
                      } rounded-md transition-colors`}
                  >
                    Siguiente
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Menú de usuario */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 hover:bg-[#282828] p-1.5 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden relative">
                      <Image
                        src={user?.avatar || '/default-avatar.png'}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
                      <button
                        onClick={() => router.push('/perfil')}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Mi perfil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="h-[calc(100vh-64px)]">
              {showResults ? (
                <div className="h-full bg-gray-100 dark:bg-[#1E1F25] p-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Resultados del Módulo</h2>

                    {/* Tabla de resultados */}
                    <div className="bg-[#282828] rounded-lg shadow-lg overflow-hidden mb-6">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#232323] text-left">
                            <th className="px-6 py-4 text-gray-300 font-medium">Tema</th>
                            <th className="px-6 py-4 text-gray-300 font-medium">Respuestas Correctas</th>
                            <th className="px-6 py-4 text-gray-300 font-medium">Total Preguntas</th>
                            <th className="px-6 py-4 text-gray-300 font-medium">Nota</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {results.subjects.map((subject, index) => (
                            <tr key={index} className="hover:bg-[#323232] transition-colors">
                              <td className="px-6 py-4 text-white">{subject.title}</td>
                              <td className="px-6 py-4 text-white">{Math.round(subject.points)}</td>
                              <td className="px-6 py-4 text-white">{subject.maxPoints}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${subject.percentage >= 70 ? 'bg-green-500/20 text-green-400' :
                                  subject.percentage >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                  {subject.percentage.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Resumen general */}
                    <div className="bg-[#282828] rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Resumen General</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#323232] rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Total Respuestas Correctas</p>
                          <p className="text-2xl font-bold text-white">{results.goodAnswers}</p>
                        </div>
                        <div className="bg-[#323232] rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Total Respuestas Incorrectas</p>
                          <p className="text-2xl font-bold text-white">{results.wrongAnswers}</p>
                        </div>
                        <div className="bg-[#323232] rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Promedio General</p>
                          <p className="text-2xl font-bold text-white">
                            {(results.subjects.reduce((acc, sub) => acc + sub.percentage, 0) / results.subjects.length).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botón para continuar al chat */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleContinueToChat}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continuar al Asistente
                      </button>
                    </div>
                  </div>
                </div>
              ) : showChat ? (
                <div className="h-full flex bg-gray-100 dark:bg-[#1E1F25]">
                  {/* Columna izquierda - Texto explicativo */}
                  <div className="w-[40%] border-r border-gray-300 dark:border-gray-700 p-6 overflow-y-auto">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">Asistente de Matemáticas</h2>
                      <div className="space-y-4 text-black dark:text-gray-200 text-base md:text-lg">
                        <p>
                          Bienvenido al asistente de matemáticas. Aquí puedes hacer preguntas sobre:
                        </p>
                        <ul className="list-disc pl-4 space-y-2">
                          <li>Divisores y números primos</li>
                          <li>Múltiplos y factores</li>
                          <li>Máximo común divisor (MCD)</li>
                          <li>Mínimo común múltiplo (MCM)</li>
                          <li>Ejercicios y problemas matemáticos</li>
                        </ul>
                        <p>
                          El asistente te ayudará a:
                        </p>
                        <ul className="list-disc pl-4 space-y-2">
                          <li>Resolver paso a paso los ejercicios</li>
                          <li>Explicar conceptos matemáticos</li>
                          <li>Proporcionar ejemplos adicionales</li>
                          <li>Verificar tus respuestas</li>
                        </ul>
                        <div className="mt-6 p-4 bg-gray-100 dark:bg-[#282828] rounded-lg">
                          <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Ejemplo de pregunta:</h3>
                          <p className="text-black dark:text-gray-200 italic text-base md:text-lg">
                            &quot;¿Puedes ayudarme a encontrar todos los divisores del número 24 y explicarme el proceso paso a paso?&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha - Chat */}
                  <div className="w-[60%] flex flex-col">
                    {/* Área de mensajes */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-4 ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-[#282828] text-black dark:text-gray-200'
                                }`}
                            >
                              <p className="whitespace-pre-wrap text-base md:text-lg">{message.content}</p>
                              <span className="text-xs opacity-70 mt-2 block">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-[#282828] text-black dark:text-gray-200 rounded-lg p-4">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Área de entrada de texto */}
                    <div className="border-t border-gray-300 dark:border-gray-700 p-4">
                      <div className="max-w-3xl mx-auto">
                        <div className="relative">
                          <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu mensaje..."
                            className="w-full bg-gray-100 dark:bg-[#282828] text-black dark:text-white rounded-lg pl-4 pr-12 py-3 min-h-[50px] max-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg"
                            rows={1}
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputMessage.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiSend className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Presiona Enter para enviar, Shift + Enter para nueva línea
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col overflow-hidden lg:flex-row">
                  {/* Sección de Resumen */}
                  <div className="h-[55%] bg-gray-100 dark:bg-[#1E1F25] overflow-y-auto lg:h-full lg:w-[64%] 2xl:w-[70%]">
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">{title}</h2>
                      <div className="text-black dark:text-gray-200 text-base md:text-lg">
                        {content}
                      </div>
                    </div>
                  </div>

                  {/* Sección de Comentarios */}
                  <div className="h-[45%] bg-gray-100 dark:bg-[#1E1F25] border-t border-gray-300 dark:border-gray-700 overflow-hidden lg:h-full lg:w-[36%] lg:border-l lg:border-t-0 2xl:w-[30%]">
                    <div className="flex h-full flex-col p-4 sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-4">
                          {!isCurrentExerciseStep && (
                            <button
                              onClick={() => setCommentsTab('help')}
                              className={`${activeCommentsTab === 'help'
                                ? 'text-black dark:text-white font-medium'
                                : 'text-black dark:text-gray-400'
                                } hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-base`}
                            >
                              Ayuda
                            </button>
                          )}
                          <button
                            onClick={() => setCommentsTab('contributions')}
                            className={`${activeCommentsTab === 'contributions'
                              ? 'text-black dark:text-white font-medium'
                              : 'text-black dark:text-gray-400'
                              } hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-base`}
                          >
                            Aportes
                          </button>
                        </div>
                        {activeCommentsTab === 'contributions' && (
                          <div className="flex items-center">
                            <span className="text-black dark:text-gray-400 text-sm mr-2">Más votados</span>
                            <FiChevronDown className="text-black dark:text-gray-400 w-4 h-4" />
                          </div>
                        )}
                      </div>
                      {activeCommentsTab === 'help' ? (
                        <div className="flex min-h-0 flex-1 flex-col">
                          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                            <div className="space-y-4">
                              {messages.length === 0 && (
                                <div className="rounded-lg bg-white dark:bg-[#282828] p-4 text-sm text-gray-600 dark:text-gray-300">
                                  Escribe tu consulta y el asistente te ayudará con el tema actual.
                                </div>
                              )}
                              {messages.map((message, index) => (
                                <div
                                  key={index}
                                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user'
                                      ? 'bg-white dark:bg-[#282828] text-black dark:text-white'
                                      : 'bg-blue-600 text-white'
                                      }`}
                                  >
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                    <span className="mt-2 block text-[11px] opacity-60">
                                      {message.timestamp.toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {isLoading && (
                                <div className="flex justify-start">
                                  <div className="rounded-2xl bg-white dark:bg-[#282828] p-4">
                                    <div className="flex space-x-2">
                                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-100"></div>
                                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-200"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mb-16 mt-4 rounded-full border border-gray-300 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-[#282828] sm:mb-20 lg:mb-16">
                            <div className="flex min-w-0 items-center gap-2">
                              <button
                                type="button"
                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#363636]"
                              >
                                <FiPlus className="h-5 w-5" />
                              </button>
                              <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Pregunta lo que quieras"
                                className="min-w-0 max-h-24 min-h-[32px] flex-1 resize-none bg-transparent py-1 text-sm text-black placeholder-gray-500 focus:outline-none dark:text-white"
                                rows={1}
                              />
                              <button
                                type="button"
                                className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#363636] sm:flex"
                              >
                                <FiMic className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FiSend className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                          <div className="relative mb-6">
                            <textarea
                              placeholder="Escribe tu comentario o pregunta"
                              className="w-full bg-gray-100 dark:bg-[#282828] text-black dark:text-white rounded-lg p-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg"
                            ></textarea>
                          </div>

                          {/* Lista de comentarios actualizada según el paso actual */}
                          <div className="space-y-6">
                            {questionsByStep[currentStep - 1]?.questions?.map((comment) => (
                              <div key={comment.id} className="space-y-4">
                                {/* Comentario principal */}
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                    {comment.author.avatar}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-black dark:text-white font-semibold">{comment.author.name}</span>
                                      <span className="text-gray-500 dark:text-gray-400 text-sm">•</span>
                                      <span className="text-gray-500 dark:text-gray-400 text-sm">{comment.author.role}</span>
                                      <span className="text-gray-500 dark:text-gray-400 text-sm">•</span>
                                      <span className="text-gray-500 dark:text-gray-400 text-sm">{comment.author.timeAgo}</span>
                                    </div>
                                    <p className="text-black dark:text-gray-200 text-base md:text-lg">{comment.content}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <button className="flex items-center gap-1 text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                                        <span>❤️</span>
                                        <span>{comment.likes}</span>
                                      </button>
                                      <button className="text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                                        Responder
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Respuestas */}
                                {comment.replies.length > 0 && (
                                  <div className="relative ml-11 space-y-4">
                                    {comment.replies.map((reply, index) => (
                                      <div key={reply.id} className="relative">
                                        {/* Línea conectora con curva */}
                                        <div className="absolute -left-4 top-4 w-4 h-[calc(100%+16px)] border-l-2 border-b-2 border-gray-300 dark:border-gray-700 rounded-bl-xl"></div>

                                        {/* Línea horizontal */}
                                        <div className="absolute -left-4 top-4 w-4 h-[2px] bg-gray-300 dark:bg-gray-700"></div>

                                        {/* Contenido de la respuesta */}
                                        <div className="flex gap-3 pl-4">
                                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-medium">
                                            {reply.author.avatar}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-black dark:text-white font-semibold">{reply.author.name}</span>
                                              <span className="text-gray-500 dark:text-gray-400 text-sm">•</span>
                                              <span className="text-gray-500 dark:text-gray-400 text-sm">{reply.author.role}</span>
                                              <span className="text-gray-500 dark:text-gray-400 text-sm">•</span>
                                              <span className="text-gray-500 dark:text-gray-400 text-sm">{reply.author.timeAgo}</span>
                                            </div>
                                            <p className="text-black dark:text-gray-200 text-base md:text-lg">{reply.content}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                              <button className="flex items-center gap-1 text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                                                <span>❤️</span>
                                                <span>{reply.likes}</span>
                                              </button>
                                              <button className="text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                                                Responder
                                              </button>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Línea final para la última respuesta */}
                                        {index === comment.replies.length - 1 && (
                                          <div className="absolute -left-4 top-4 h-4 border-l-2 border-gray-300 dark:border-gray-700"></div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal de Material */}
            {isMaterialOpen && (
              <div className="fixed inset-0 z-50">
                {/* Overlay para cerrar el modal al hacer clic fuera */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setIsMaterialOpen(false)}
                />

                {/* Modal */}
                <div className="fixed right-0 top-16 w-[25%] h-[calc(100vh-64px)] bg-white dark:bg-[#1E1F25] shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-black dark:text-white font-medium mb-1">Progreso del curso</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">19%</span>
                          <span className="text-sm text-gray-400">
                            {diagnosticConfigs.length > 0 ? diagnosticConfigs[0].title : 'Cargando...'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsMaterialOpen(false)}
                        className="text-gray-600 dark:text-gray-400 hover:text-white"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full">
                      <div className="h-full w-[19%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="overflow-y-auto h-[calc(100%-88px)]">
                    <div className="relative pt-4 pb-4">
                      {/* Punto inicial */}
                      <div className="absolute left-[23px] top-0 w-[6px] h-[6px] rounded-full bg-orange-400"></div>

                      {/* Línea vertical principal */}
                      <div className="absolute left-[25px] top-[6px] w-[2px] h-[calc(100%-12px)] bg-gray-700"></div>

                      {/* Punto final */}
                      <div className="absolute left-[23px] bottom-0 w-[6px] h-[6px] rounded-full bg-gray-700"></div>

                      {/* Título del módulo */}
                      <div className="pl-12 mb-4">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {diagnosticConfigs.length > 0 ? diagnosticConfigs[0].title : 'Cargando...'}
                        </span>
                      </div>

                      {diagnosticConfigs.length > 0 ? (
                        diagnosticConfigs[0].topics.map((topic, index) => {
                          const isActiveTopic = Math.floor((currentStep - 1) / 2) === index;

                          return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleTopicSelect(index)}
                            className={`group relative flex w-full items-center py-4 px-3 text-left transition-colors cursor-pointer ${
                              isActiveTopic
                                ? 'bg-gray-200 dark:bg-[#282828]'
                                : 'hover:bg-gray-200 dark:hover:bg-[#282828]'
                            }`}
                          >
                            {/* Línea del timeline */}
                            {index < diagnosticConfigs[0].topics.length - 1 && (
                              <div
                                className={`absolute left-[25px] top-[50%] w-[2px] h-[calc(100%)] ${topic.completed ? 'bg-orange-400' : 'bg-gray-700'
                                  }`}
                              ></div>
                            )}

                            {/* Círculo numerado */}
                            <div className="relative z-10">
                              <div
                                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-sm font-medium ${topic.completed ? 'bg-orange-400' : 'bg-gray-700'
                                  }`}
                              >
                                {index + 1}
                              </div>
                            </div>

                            {/* Contenido de la clase */}
                            <div className="flex items-center flex-1 pl-5">
                              <div className="w-12 h-7 rounded overflow-hidden flex-shrink-0 mr-3">
                                <Image
                                  src="/logo_casco.png"
                                  alt={topic.title}
                                  width={48}
                                  height={28}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-black dark:text-white text-sm font-medium mb-1 truncate pr-2">{topic.title}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">{topic.duration}</span>
                                  {topic.completed && (
                                    <span className="text-xs text-orange-400 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                      Clase vista
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                          );
                        })
                      ) : (
                        <div className="text-gray-600 dark:text-gray-400 text-center py-4">Cargando temas...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


