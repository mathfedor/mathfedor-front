'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { diagnosticService } from '@/services/diagnostic.service';
import { DiagnosticConfig } from '@/types/diagnostic.types';
import { authService } from '@/services/auth.service';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiX, FiSend } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/components/ui/tooltip';
import { User } from '@/types/auth.types';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { chatService } from '@/services/chat.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const DiagnosticoPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticConfigs, setDiagnosticConfigs] = useState<DiagnosticConfig[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  // Pasos de contenido: 1 (descripción general) + 2 por tema (descripción + ejercicios)
  const totalContentSteps = (diagnosticConfigs[0]?.topics?.length || 0) * 2 + 1;
  // Índices adicionales para resumen y chat
  const summaryStepIndex = totalContentSteps + 1;
  const chatStepIndex = summaryStepIndex + 1;
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
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
  const [diagnosticId, setDiagnosticId] = useState<string>('');
  const [studyPlan, setStudyPlan] = useState<string>('');
  const [isLoadingStudyPlan, setIsLoadingStudyPlan] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const computeProgressPercent = (topics: Array<{ completed?: boolean }>): number => {
    if (!topics || topics.length === 0) return 0;
    const completedCount = topics.filter(t => !!t.completed).length;
    return Math.round((completedCount / topics.length) * 100);
  };

  // Función para calcular el paso correspondiente a un tema
  const getStepForTopic = (topicIndex: number, isExerciseStep: boolean = false): number => {
    // Paso 1 es la descripción general
    // Paso 2 es descripción del primer tema
    // Paso 3 es ejercicios del primer tema
    // Paso 4 es descripción del segundo tema
    // Paso 5 es ejercicios del segundo tema
    // etc.
    return 2 + (topicIndex * 2) + (isExerciseStep ? 1 : 0);
  };

  // Función para navegar a un tema específico
  const navigateToTopic = (topicIndex: number, isExerciseStep: boolean = false) => {
    const targetStep = getStepForTopic(topicIndex, isExerciseStep);
    setCurrentStep(targetStep);
    setIsMaterialOpen(false); // Cerrar el modal
  };

  // Helper para renderizar texto con imágenes embebidas mediante tokens {img_img...}
  const renderTextWithImages = (input: string, imageSize?: { width: number; height: number }) => {
    const width = imageSize?.width ?? 800;
    const height = imageSize?.height ?? 400;
    return (
      <>
        {String(input)
          .split(/(\{img_img[^}]+\})/g)
          .filter(Boolean)
          .map((fragment, index) => {
            if (/^\{img_img[^}]+\}$/.test(fragment)) {
              const src = fragment.replace('{img_', '').replace('}', '.png');
              return (
                <span key={index} className="inline-block align-middle mx-2">
                  <Image
                    src={`/${src}`}
                    alt={src}
                    width={width}
                    height={height}
                    className="object-contain inline rounded"
                  />
                </span>
              );
            }
            return (
              <span
                key={index}
                className="text-gray-700 dark:text-gray-300 whitespace-pre-line align-middle"
                dangerouslySetInnerHTML={{ __html: fragment }}
              />
            );
          })}
      </>
    );
  };

  // Helper para prefijar opciones con A./B./C./D. y normalizar minúsculas
  const formatOptionLabel = (optionText: unknown, optionIndex: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const expected = letters[optionIndex] || letters[0];

    // Detectar prefijo existente: "a. ", "A.", etc.
    const prefixRegex = /^\s*([A-Za-z])\.?\s+/;
    const text = String(optionText ?? '');
    const match = text.match(prefixRegex);

    if (match) {
      const letter = match[1].toUpperCase();
      const rest = text.replace(prefixRegex, '');
      // Mantener la letra detectada pero en mayúscula con formato "X. "
      return `${letter}. ${rest}`.trim();
    }

    // No tenía prefijo; agregamos el esperado por posición
    return `${expected}. ${text}`.trim();
  };

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  // Array de preguntas y respuestas por paso
  const questionsByStep = [
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
    const fetchDiagnosticConfig = async () => {
      try {
        setIsLoading(true);
        const configs = await diagnosticService.getDiagnosticConfig();
        if (configs && configs.length > 0) {
          setDiagnosticConfigs(configs);
          setDiagnosticId(configs[0]._id); // Guardamos el diagnosticId
          setProgressPercent(computeProgressPercent(configs[0].topics || []));

          // Consulta si el usuario ya tiene diagnóstico
          const userId = authService.getCurrentUser()?.id;
          if (userId) {
            const result = await diagnosticService.checkUserDiagnostic(configs[0]._id, userId);
            if (result.exists) {
              setAlertMessage({
                title: 'Diagnóstico existente',
                message: 'Ya tienes un diagnóstico, si continúas se sobrescribirá el anterior.'
              });
              setIsAlertOpen(true);

              // Marcar temas como completados si están en diagnosticResult.subjects
              if (result.diagnosticResult?.subjects) {
                const completedTopicTitles = result.diagnosticResult.subjects.map((s: { title: string }) => s.title);
                configs[0].topics.forEach((topic) => {
                  if (completedTopicTitles.includes(topic.title)) {
                    topic.completed = true;
                  }
                });
                // Recalcular progreso basado en temas completados
                setProgressPercent(computeProgressPercent(configs[0].topics || []));
              }

              // Marcar respuestas guardadas en todos los temas y ejercicios
              if (result.diagnosticResult?.answers) {
                const newSelectedAnswers: { [key: string]: number } = {};

                // Recorremos todos los topics y ejercicios
                configs[0].topics.forEach((topic) => {
                  topic.exercises?.forEach((exercise, exIdx) => {
                    const exerciseId = `${topic.title}_ex${exIdx + 1}`;
                    const answerObj = result.diagnosticResult.answers.find((a: { exerciseId: string; answer: string }) => a.exerciseId === exerciseId);
                    if (answerObj) {
                      // Buscar el índice de la opción que coincide con selectedAnswer
                      const optionIndex = exercise.options.findIndex(opt => {
                        return String(opt).trim().toLowerCase() === String(answerObj.selectedAnswer).trim().toLowerCase();
                      });
                      if (optionIndex !== -1) {
                        // La clave es el id del ejercicio
                        newSelectedAnswers[exerciseId] = optionIndex;
                      }
                    }
                  });
                });

                // Guardar respuestas seleccionadas
                setSelectedAnswers(newSelectedAnswers);
              }
            }
          }
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
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const handleAnswerSelect = (exerciseKey: string, answer: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [exerciseKey]: optionIndex
    }));
  };

  const validateAndSubmitAnswers = async () => {
    if (!diagnosticConfigs.length || !diagnosticConfigs[0].topics) {
      console.error('No hay configuración de diagnóstico disponible');
      return false;
    }
    if (currentStep === 1) {
      return true;
    }

    const currentTopicIndex = Math.floor((currentStep - 3) / 2);

    if (currentTopicIndex < 0 || currentTopicIndex >= diagnosticConfigs[0].topics.length) {
      console.error('Índice de tema inválido:', {
        currentStep,
        currentTopicIndex,
        totalTopics: diagnosticConfigs[0].topics.length
      });
      return false;
    }

    const currentTopic = diagnosticConfigs[0].topics[currentTopicIndex];

    if (!currentTopic || !currentTopic.exercises || currentTopic.exercises.length === 0) {
      console.error('No se encontró el tema actual o sus ejercicios', {
        currentStep,
        currentTopicIndex,
        topic: currentTopic
      });
      return false;
    }

    const exercises = currentTopic.exercises;

    const allAnswered = exercises.every((_, index) => selectedAnswers[`${currentTopic.title}_ex${index + 1}`] !== undefined);
    if (!allAnswered) {
      console.log('Faltan respuestas por completar');
      return false;
    }

    const pointsPerExercise = 10 / exercises.length;
    let correctAnswers = 0;
    const answers = exercises.map((exercise, index) => {
      const exerKey = `${currentTopic.title}_ex${index + 1}`;
      if (!exercise.correctAnswer) {
        console.error('No hay respuesta correcta definida para el ejercicio:', exercise);
        return {
          exerciseId: `${currentTopic.title}_ex${index + 1}`,
          selectedAnswer: exercise.options[selectedAnswers[exerKey]],
          isCorrect: false
        };
      }
      const correctAnswerPosition = exercise.correctAnswer.charCodeAt(0) - 65; // Convierte A=0, B=1, C=2, etc.
      const userAnswerPosition = selectedAnswers[exerKey];
      const isCorrect = userAnswerPosition === correctAnswerPosition;
      if (isCorrect) correctAnswers++;
      return {
        exerciseId: `${currentTopic.title}_ex${index + 1}`,
        selectedAnswer: exercise.options[userAnswerPosition] + '',
        isCorrect
      };
    });

    const points = correctAnswers * pointsPerExercise;
    const percentage = (points / 10) * 100;

    // Actualizar resultados
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
      wrongAnswers: prev.wrongAnswers + (exercises.length - correctAnswers),
      subjects: [...prev.subjects, newSubject],
      answers: [...prev.answers, ...answers]
    }));

    // Marcar el tópico como completado y recalcular progreso
    try {
      const updatedConfigs = [...diagnosticConfigs];
      const topicRef = updatedConfigs[0]?.topics?.[currentTopicIndex];
      if (topicRef) {
        topicRef.completed = true;
        setDiagnosticConfigs(updatedConfigs);
        setProgressPercent(computeProgressPercent(updatedConfigs[0]?.topics || []));
      }
    } catch {}

    // Validar datos requeridos
    if (!diagnosticId) {
      setAlertMessage({
        title: 'Error',
        message: 'Faltan datos requeridos para guardar los resultados. Por favor asegúrate de que tu perfil esté completo.'
      });
      setIsAlertOpen(true);
      return false;
    }

    // Enviar resultados al backend
    try {
      const diagnosticResult = {
        diagnosticId: diagnosticId,
        student: {
          name: user?.name || '',
          userId: user?.id || '',
          lastName: user?.name || ''
        },
        teacher: {
          name: diagnosticConfigs[0].createdBy,
          userId: diagnosticConfigs[0].createdBy
        },
        group: diagnosticConfigs[0].group,
        goodAnswers: results.goodAnswers + correctAnswers,
        wrongAnswers: results.wrongAnswers + (exercises.length - correctAnswers),
        rating: calculateRating(percentage),
        subjects: [...results.subjects, newSubject],
        answers: [...results.answers, ...answers]
      };

      await diagnosticService.submitResults(diagnosticResult);
      //setSelectedAnswers({}); // Limpiar respuestas para el siguiente tema
      return true;
    } catch (error) {
      console.error('Error al enviar resultados:', error);
      setAlertMessage({
        title: 'Error',
        message: 'Hubo un problema al guardar los resultados. Asegúrate de que todos los datos requeridos estén completos.'
      });
      setIsAlertOpen(true);
      return false;
    }
  };

  const calculateRating = (percentage: number): string => {
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 70) return 'Bueno';
    if (percentage >= 50) return 'Regular';
    return 'Necesita Mejorar';
  };

  // Función para obtener el contenido actual basado en el paso
  const getCurrentContent = () => {
    if (!diagnosticConfigs.length) return { title: 'Cargando...', content: null };
    // Si el paso es mayor al número de pasos de temas, retorna contenido vacío
    if (currentStep > totalContentSteps) {
      return { title: '', content: null };
    }

    // Si es el paso 1, mostrar la descripción del diagnóstico
    if (currentStep === 1) {
      return {
        title: "FERNANDO BASTIDAS PARRA",
        content: (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="mb-6 flex justify-center">
              <Image
                src="/Img-fernando-metodofedor.png"
                alt="Método Fedor"
                width={800}
                height={400}
                className="w-[40%] h-auto rounded-lg"
              />
            </div>
            {renderTextWithImages(diagnosticConfigs[0].description)}
          </div>
        )
      };
    }

    // Determinar el índice del tema actual
    const currentTopicIndex = Math.floor((currentStep - 2) / 2);
    const currentTopic = diagnosticConfigs[0].topics[currentTopicIndex];

    // Si es paso de ejercicios
    if ((currentStep - 2) % 2 === 1) {
      return {
        title: `Ejercicios - ${currentTopic.title}`,
        content: (
          <div>
            {currentTopic.exercises.map((exercise, index) => {
              const exerciseKey = `${currentTopic.title}_ex${index + 1}`;
              return (
                <div key={exerciseKey} className="bg-gray-100 dark:bg-[#282828] rounded-lg p-6 mb-6">
                  <h3 className="text-black dark:text-white font-medium mb-4">Ejercicio {index + 1}</h3>
                  <div className="text-gray-700 dark:text-gray-300 mb-4">
                    {renderTextWithImages(exercise.statement, { width: 160, height: 80 })}
                  </div>
                  <div className="space-y-3">
                    {exercise.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={exerciseKey}
                          id={`${exerciseKey}_option${optIndex}`}
                          value={optIndex}
                          checked={selectedAnswers[exerciseKey] === optIndex}
                          onChange={(e) => handleAnswerSelect(exerciseKey, '', parseInt(e.target.value))}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`${exerciseKey}_option${optIndex}`}
                          className="text-gray-700 dark:text-gray-300 break-words max-w-[85%] whitespace-pre-line"
                          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                        >
                          {formatOptionLabel(option, optIndex)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      };
    } else {
      // Paso de descripción de tema
      return {
        title: currentTopic.title,
        content: (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {renderTextWithImages(currentTopic.description)}
          </div>
        )
      };
    }
  };

  const { title, content } = getCurrentContent();

  // Calcular el promedio de efectividad
  const getAverage = () => {
    if (results.subjects.length === 0) return 0;
    const sum = results.subjects.reduce((acc, s) => acc + s.points, 0);
    const sumMax = results.subjects.reduce((acc, s) => acc + s.maxPoints, 0);
    return ((sum / sumMax) * 5).toFixed(1);
  };

  // Paso de resumen de resultados
  const getSummaryContent = () => (
    <div className="p-6 mt-16 relative">
      <h2 className="text-2xl font-bold text-black mb-6">Resumen de Resultados</h2>
      <div className="flex gap-8 mb-6">
        <div className="bg-gray-100 dark:bg-[#282828] rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Buenas</div>
          <div className="text-2xl text-green-400 font-bold">{results.goodAnswers}</div>
        </div>
        <div className="bg-gray-100 dark:bg-[#282828] rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Malas</div>
          <div className="text-2xl text-red-400 font-bold">{results.wrongAnswers}</div>
        </div>
        <div className="bg-gray-100 dark:bg-[#282828] rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Nota</div>
          <div className="text-2xl text-blue-400 font-bold">{getAverage()}</div>
        </div>
      </div>
      {(() => {
        const totalAnswered = results.goodAnswers + results.wrongAnswers;
        const hitRate = totalAnswered > 0 ? (results.goodAnswers / totalAnswered) * 100 : 0;
        const showCelebration = results.wrongAnswers === 0 || hitRate >= 99;
        if (!showCelebration) return null;
        return (
          <div className="relative mb-8">
            <div className="text-green-500 text-xl font-semibold mb-4">¡Excelente! Rendimiento sobresaliente 🎉</div>
            <div className="pointer-events-none select-none">
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 80 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute inline-block"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-${Math.random() * 30 + 10}px`,
                      width: `${Math.random() * 6 + 4}px`,
                      height: `${Math.random() * 10 + 6}px`,
                      backgroundColor: [`#EF4444`, `#F59E0B`, `#10B981`, `#3B82F6`, `#8B5CF6`][i % 5],
                      transform: `rotate(${Math.random() * 360}deg)`,
                      animation: `fall ${Math.random() * 2 + 2.5}s linear ${Math.random()}s forwards`
                    }}
                  />
                ))}
              </div>
              <style>{`@keyframes fall { to { transform: translateY(120vh) rotate(720deg); opacity: 0.9; } }`}</style>
            </div>
          </div>
        );
      })()}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-200 dark:bg-[#222]"><th className="px-4 py-2">TEMAS</th><th className="px-4 py-2">Puntos</th><th className="px-4 py-2">Max PUNT</th><th className="px-4 py-2">EFECT</th></tr>
          </thead>
          <tbody>
            {results.subjects.map((s, i) => (
              <tr key={i} className="border-b border-gray-300 dark:border-gray-700">
                <td className="px-4 py-2">{s.title}</td>
                <td className="px-4 py-2">{s.points}</td>
                <td className="px-4 py-2">{s.maxPoints}</td>
                <td className="px-4 py-2">{s.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Gráfico de barras */}
      <div className="bg-gray-100 dark:bg-[#282828] rounded-lg p-6">
        <div className="mb-2 text-gray-500 font-medium">Efectividad por tema</div>
        <div className="relative h-48 flex items-end border-l-2 border-b-2 border-gray-600 pl-8 pb-6">
          {/* Eje Y */}
          <div className="absolute left-0 bottom-0 flex flex-col justify-between h-full -ml-8 text-xs text-gray-400 dark:text-gray-400" style={{ height: '100%' }}>
            {[100, 80, 60, 40, 20, 0].map((v) => (
              <div key={v} style={{ height: '40px' }}>{v}%</div>
            ))}
          </div>
          {/* Barras */}
          <div className="flex-1 flex items-end h-full w-full">
            {results.subjects.map((s, i) => (
              <div key={i} className="flex flex-col items-center mx-1" style={{ width: '24px' }}>
                <div className="bg-blue-500 rounded-t w-full" style={{ height: `${Math.max(0, Math.min(100, s.percentage)) * 1.6}px` }}></div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Eje X */}
        <div className="flex justify-between mt-2 pl-8 pr-2 text-xs text-gray-400 dark:text-gray-400">
          {results.subjects.map((_, i) => (
            <div key={i} style={{ width: '24px', textAlign: 'center' }}>{i + 1}</div>
          ))}
        </div>
      </div>
      {results.wrongAnswers > 0 && (
        <div className="mt-8 bg-gray-100 dark:bg-[#282828] rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-700 dark:text-gray-300 font-medium">Plan de estudio recomendado</div>
            <button
              onClick={async () => {
                try {
                  setIsLoadingStudyPlan(true);
                  const allTopics = (diagnosticConfigs[0]?.topics || []).map(t => t.title).join(', ');
                  const weakTopics = results.subjects
                    .filter(s => s.points < s.maxPoints || s.percentage < 100)
                    .map(s => s.title)
                    .join(', ');
                  const studyPlanMessage = {
                    role: 'user' as const,
                    content: `Basado en los temas: ${allTopics} y que Matemáticas de Fedor no tiene videos. Créame un plan de estudio para reforzar los temas ${weakTopics}.`,
                    timestamp: new Date()
                  };
                  const data = await chatService.studyPlan([studyPlanMessage], authService.getToken() || '');
                  setStudyPlan(data.response);
                } catch (error) {
                  console.error('Error al generar el plan de estudio:', error);
                  setStudyPlan('No se pudo generar el plan de estudio en este momento.');
                } finally {
                  setIsLoadingStudyPlan(false);
                }
              }}
              disabled={isLoadingStudyPlan}
              className={`px-4 py-2 rounded-md text-sm font-medium ${isLoadingStudyPlan ? 'bg-gray-300 dark:bg-[#1E1E1E] text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isLoadingStudyPlan ? 'Generando…' : 'Generar plan de estudio'}
            </button>
          </div>
          {studyPlan && (
            <div className="study-plan-container overflow-x-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: studyPlan }} />
              </div>
              <style jsx>{`
                .study-plan-container table {
                  width: 50%;
                  margin-left: auto;
                  margin-right: auto;
                  border-collapse: separate;
                  border-spacing: 12px 8px; /* espacio entre columnas y filas */
                }
                .study-plan-container th,
                .study-plan-container td {
                  padding: 12px 16px; /* acolchado interno por celda */
                }
                .study-plan-container thead th {
                  text-align: left;
                }
                @media (max-width: 768px) {
                  .study-plan-container table {
                    width: 100%;
                    border-spacing: 8px 6px;
                  }
                  .study-plan-container th,
                  .study-plan-container td {
                    padding: 10px 12px;
                  }
                }
              `}</style>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Modificar la lógica de navegación para insertar el paso de resumen antes del chat
  const isSummaryStep = currentStep === summaryStepIndex;
  const isChatStep = currentStep === chatStepIndex;

  // Actualizar la lógica de navegación
  const handleNext = async () => {
    const isExerciseStep = ((currentStep - 1) % 2) === 0;
    // No validar en el paso de Resumen; pasar al Chat
    if (isSummaryStep) {
      setCurrentStep(currentStep + 1); // Avanzar al chat sin validar
      return;
    }
    // Si estamos en el penúltimo paso de contenido, el siguiente es Resumen (pero aún podría ser descripción de tema)
    if (isExerciseStep) {
      const success = await validateAndSubmitAnswers();
      if (!success) {
        setAlertMessage({
          title: 'Preguntas incompletas',
          message: 'Por favor responde todas las preguntas antes de continuar.'
        });
        setIsAlertOpen(true);
        return;
      }
    }
    // Avanzar dentro de contenido
    if (currentStep < totalContentSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalContentSteps) {
      // Último paso de contenido (últimos ejercicios) → ir a Resumen
      setCurrentStep(currentStep + 1);
    } else if (currentStep === summaryStepIndex) {
      // Resumen → Chat
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (showChat) {
      setShowChat(false);
      setCurrentStep(summaryStepIndex);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await chatService.sendChatMessages(updatedMessages, authService.getToken() || '');

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
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

  // Botón de prueba solo en desarrollo
  const fillRandomAnswers = () => {
    if (!diagnosticConfigs.length || !diagnosticConfigs[0].topics) return;
    // Determinar el índice del tema actual
    const currentTopicIndex = Math.floor((currentStep - 3) / 2);
    const currentTopic = diagnosticConfigs[0].topics[currentTopicIndex];
    if (!currentTopic || !currentTopic.exercises) return;
    const randomAnswers: { [key: string]: number } = {};
    currentTopic.exercises.forEach((ex, idx) => {
      const exerciseKey = `${currentTopic.title}_ex${idx + 1}`;
      randomAnswers[exerciseKey] = Math.floor(Math.random() * ex.options.length);
    });
    console.log('Respuestas aleatorias generadas:', randomAnswers);
    setSelectedAnswers(randomAnswers);
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
        {/* Barra de navegación superior */}
        <div className="sticky top-0 z-50 h-16 bg-white dark:bg-[#1C1D1F] flex items-center justify-between px-6 text-black dark:text-white shadow-md">
          <div className="flex items-center">
            <h1 className="text-lg font-medium">{diagnosticConfigs.length > 0 ? diagnosticConfigs[0].title : 'Diagnóstico'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 && !showChat}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${currentStep === 1 && !showChat
                ? 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-[#282828] hover:bg-gray-300 dark:hover:bg-[#363636]'
                } rounded-md transition-colors`}
            >
              <FiChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <Tooltip content="Ver la lista de temas" position="bottom">
              <button
                onClick={() => setIsMaterialOpen(!isMaterialOpen)}
                className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-[#282828] hover:bg-gray-300 dark:hover:bg-[#363636] rounded-md transition-colors"
              >
                Temas
              </button>
            </Tooltip>
            {!showChat && (
              <button
                onClick={handleNext}
                disabled={isChatStep}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${isChatStep
                  ? 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-[#282828] hover:bg-gray-300 dark:hover:bg-[#363636]'
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
                className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-[#282828] p-1.5 rounded-full transition-colors"
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
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#282828] rounded-md shadow-lg py-1 text-gray-800 dark:text-gray-100">
                  <button
                    onClick={() => router.push('/perfil')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#363636]"
                  >
                    Mi perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#363636] text-red-600 dark:text-red-400"
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
          {/* Botón de prueba solo en desarrollo */}
          {process.env.NODE_ENV === 'development' && ((currentStep - 1) % 2 === 0) && !isSummaryStep && (
            <div className="p-4">
              <button
                onClick={fillRandomAnswers}
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors shadow"
              >
                Autollenar respuestas aleatorias (PRUEBA)
              </button>
            </div>
          )}
          {isSummaryStep ? (
            <div className="h-full flex bg-gray-100 dark:bg-[#1E1F25]">
              <div className="w-full flex flex-col items-center justify-center">
                {getSummaryContent()}
              </div>
            </div>
          ) : isChatStep ? (
            <div className="h-full flex bg-gray-100 dark:bg-[#1E1F25]">
              {/* Columna izquierda - Texto explicativo */}
              <div className="w-[40%] border-r border-gray-300 p-6 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-medium text-black mb-4">Asistente de Matemáticas</h2>
                  <div className="space-y-4 text-gray-700">
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
                      <h3 className="text-lg font-medium text-black mb-2">Ejemplo de pregunta:</h3>
                      <p className="text-gray-700 italic">
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
                            : 'bg-gray-100 dark:bg-[#282828] text-gray-700'
                            }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-[#282828] text-gray-700 rounded-lg p-4">
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
                <div className="border-t border-gray-300 p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu mensaje..."
                        className="w-full bg-gray-100 dark:bg-[#282828] text-black rounded-lg pl-4 pr-12 py-3 min-h-[50px] max-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Presiona Enter para enviar, Shift + Enter para nueva línea
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex">
              {/* Sección de Resumen */}
              <div className="w-[75%] bg-gray-100 dark:bg-[#1E1F25] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-medium text-black mb-4">{title}</h2>
                  <div className="text-gray-700">
                    {content}
                  </div>
                </div>
              </div>

              {/* Sección de Comentarios */}
              <div className="w-[25%] bg-gray-100 dark:bg-[#1E1F25] border-l border-gray-300 overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                      <button className="text-black font-medium hover:text-gray-300 transition-colors">Todo</button>
                      <button className="text-gray-500 hover:text-white transition-colors">Preguntas</button>
                      <button className="text-gray-500 hover:text-white transition-colors">Aportes</button>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">Más votados</span>
                      <FiChevronDown className="text-gray-500 w-4 h-4" />
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <textarea
                      placeholder="Escribe tu comentario o pregunta"
                      className="w-full bg-gray-100 dark:bg-[#282828] text-black rounded-lg p-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              <span className="text-black font-medium">{comment.author.name}</span>
                              <span className="text-gray-500 text-sm">•</span>
                              <span className="text-gray-500 text-sm">{comment.author.role}</span>
                              <span className="text-gray-500 text-sm">•</span>
                              <span className="text-gray-500 text-sm">{comment.author.timeAgo}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button className="flex items-center gap-1 text-gray-500 hover:text-white">
                                <span>❤️</span>
                                <span>{comment.likes}</span>
                              </button>
                              <button className="text-gray-500 hover:text-white">
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
                                      <span className="text-black font-medium">{reply.author.name}</span>
                                      <span className="text-gray-500 text-sm">•</span>
                                      <span className="text-gray-500 text-sm">{reply.author.role}</span>
                                      <span className="text-gray-500 text-sm">•</span>
                                      <span className="text-gray-500 text-sm">{reply.author.timeAgo}</span>
                                    </div>
                                    <p className="text-gray-700">{reply.content}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <button className="flex items-center gap-1 text-gray-500 hover:text-white">
                                        <span>❤️</span>
                                        <span>{reply.likes}</span>
                                      </button>
                                      <button className="text-gray-500 hover:text-white">
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
              </div>
            </div>
          )}
        </div>

        {/* Modal de Material */}
        {isMaterialOpen && (
          <>
            {/* Overlay para cerrar el modal al hacer clic fuera */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMaterialOpen(false)}
            ></div>

            {/* Modal */}
            <div className="absolute right-0 top-16 w-[25%] bg-white dark:bg-[#1E1F25] h-[calc(100vh-64px)] shadow-xl z-50">
              <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-black dark:text-white font-medium mb-1">Progreso del curso</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{progressPercent}%</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Diagnóstico</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMaterialOpen(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-88px)]">
                <div className="relative pt-4 pb-4">
                  {/* Punto inicial */}
                  <div className="absolute left-[23px] top-0 w-[6px] h-[6px] rounded-full bg-orange-400"></div>

                  {/* Línea vertical principal */}
                  <div className="absolute left-[25px] top-[6px] w-[2px] h-[calc(100%-12px)] bg-gray-300 dark:bg-gray-700"></div>

                  {/* Punto final */}
                  <div className="absolute left-[23px] bottom-0 w-[6px] h-[6px] rounded-full bg-gray-300 dark:bg-gray-700"></div>

                  {/* Título del módulo */}
                  <div className="pl-12 mb-4">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Diagnóstico</span>
                  </div>

                  {diagnosticConfigs.length > 0 ? (
                    diagnosticConfigs[0].topics.map((topic, index) => (
                      <div key={index} className="group relative flex items-center py-4 px-3 hover:bg-gray-200 dark:hover:bg-[#282828] transition-colors cursor-pointer">
                        {/* Línea del timeline */}
                        {index < diagnosticConfigs[0].topics.length - 1 && (
                          <div
                            className={`absolute left-[25px] top-[50%] w-[2px] h-[calc(100%)] ${topic.completed ? 'bg-orange-400' : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                          ></div>
                        )}

                        {/* Círculo numerado */}
                        <div className="relative z-10">
                          <div
                            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-sm font-medium ${topic.completed
                              ? 'bg-orange-400'
                              : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                          >
                            {index + 1}
                          </div>
                        </div>

                        {/* Contenido de la clase */}
                        <div 
                          className="flex items-center flex-1 pl-5"
                          onClick={() => navigateToTopic(index, false)} // Navegar a descripción del tema
                        >
                          <div className="w-20 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
                            <Image
                              src={topic.image || '/logo_casco.png'}
                              alt={topic.title}
                              width={80}
                              height={48}
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
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400 text-center py-4">Cargando temas...</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DiagnosticoPage;