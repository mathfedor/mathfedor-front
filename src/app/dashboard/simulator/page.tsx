'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { diagnosticService } from '@/services/diagnostic.service';
import { authService } from '@/services/auth.service';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiX, FiSend } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/components/ui/tooltip';
import { User } from '@/types/auth.types';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { chatService } from '@/services/chat.service';
import { moduleService } from '@/services/module.service';
import { Module } from '@/types/module.types';
import dynamic from 'next/dynamic';

// Importar Plotly de forma dinámica para evitar problemas de SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SimulatorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticConfigs, setDiagnosticConfigs] = useState<Module[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const totalSteps = diagnosticConfigs[0]?.topics?.length * 2 + 1 || 0;
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
  const [variableValues, setVariableValues] = useState<{ [key: string]: { [key: string]: number } }>({});

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  useEffect(() => {
    const fetchDiagnosticConfig = async () => {
      try {
        setIsLoading(true);
        const configs = await moduleService.findByGroup('SIMULADOR');
        if (configs && configs.length > 0) {
          setDiagnosticConfigs(configs);
          setDiagnosticId(configs[0]._id);
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

  const handleAnswerSelect = (exerciseIndex: number, answer: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [exerciseIndex]: optionIndex
    }));
  };

  const handleVariableChange = (exerciseId: string, variable: string, value: number) => {
    setVariableValues(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [variable]: value
      }
    }));
  };

  const getVariableValue = (exerciseId: string, variable: string, defaultValue: number) => {
    return variableValues[exerciseId]?.[variable] ?? defaultValue;
  };

  const renderTemplate = (template: string, variables: string[], defaultValues: number[], exerciseId: string) => {
    // Crear un mapeo de variables para manejar diferentes formatos
    const variableMap: { [key: string]: { variable: string, index: number } } = {};
    
    // Mapear las variables según su posición
    variables.forEach((variable, index) => {
      const lowerVar = variable.toLowerCase();
      variableMap[lowerVar] = { variable, index };
    });
    
    // Dividir el template en partes usando los placeholders
    const parts: (string | { variable: string, index: number })[] = [];
    const placeholderRegex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    
    while ((match = placeholderRegex.exec(template)) !== null) {
      // Agregar el texto antes del placeholder
      if (match.index > lastIndex) {
        parts.push(template.slice(lastIndex, match.index));
      }
      
      // Agregar el placeholder como objeto
      const varName = match[1];
      const mappedVar = variableMap[varName];
      if (mappedVar) {
        parts.push(mappedVar);
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Agregar el texto restante
    if (lastIndex < template.length) {
      parts.push(template.slice(lastIndex));
    }
    
    // Renderizar las partes
    return (
      <span>
        {parts.map((part, index) => {
          if (typeof part === 'string') {
            return <span key={index}>{part}</span>;
          } else {
            const value = getVariableValue(exerciseId, part.variable, defaultValues[part.index]);
            return (
              <input
                key={`${exerciseId}-${part.variable}-${index}`}
                type="number"
                value={value}
                onChange={(e) => handleVariableChange(exerciseId, part.variable, parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-center border border-gray-300 rounded bg-white text-orange-500 font-medium inline-block"
                style={{ display: 'inline-block' }}
              />
            );
          }
        })}
      </span>
    );
  };

  const validateAndSubmitAnswers = async () => {
    if (!diagnosticConfigs.length || !diagnosticConfigs[0].topics) {
      console.error('No hay configuración de diagnóstico disponible');
      return false;
    }
    if (currentStep === 0) {
      return true;
    }

    const currentTopicIndex = Math.floor((currentStep - 1) / 2);

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
      console.error('No se encontró el tema actual o sus ejercicios');
      return false;
    }

    const exercises = currentTopic.exercises;

    const allAnswered = exercises.every((_, index) => selectedAnswers[index] !== undefined);
    if (!allAnswered) {
      console.log('Faltan respuestas por completar');
      return false;
    }

    const pointsPerExercise = 10 / exercises.length;
    let correctAnswers = 0;
    const answers = exercises.map((exercise, index) => {
      if (!exercise.correctAnswer) {
        console.error('No hay respuesta correcta definida para el ejercicio:', exercise);
        return {
          exerciseId: `${currentTopic.title}_ex${index + 1}`,
          selectedAnswer: exercise.options[selectedAnswers[index]],
          isCorrect: false
        };
      }
      const correctAnswerPosition = exercise.correctAnswer.charCodeAt(0) - 65;
      const userAnswerPosition = selectedAnswers[index];
      const isCorrect = userAnswerPosition === correctAnswerPosition;
      if (isCorrect) correctAnswers++;
      return {
        exerciseId: `${currentTopic.title}_ex${index + 1}`,
        selectedAnswer: exercise.options[userAnswerPosition],
        isCorrect
      };
    });

    const points = correctAnswers * pointsPerExercise;
    const percentage = (points / 10) * 100;

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

    if (!diagnosticId) {
      setAlertMessage({
        title: 'Error',
        message: 'Faltan datos requeridos para guardar los resultados.'
      });
      setIsAlertOpen(true);
      return false;
    }

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
      setSelectedAnswers({});
      return true;
    } catch (error) {
      console.error('Error al enviar resultados:', error);
      setAlertMessage({
        title: 'Error',
        message: 'Hubo un problema al guardar los resultados.'
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

  const getCurrentContent = () => {
    if (!diagnosticConfigs.length) return { title: 'Cargando...', content: null };
    if (currentStep > totalSteps) {
      return { title: '', content: null };
    }

    if (currentStep === 0) {
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
            <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: diagnosticConfigs[0].description }} />
          </div>
        )
      };
    }

    const topics = diagnosticConfigs[0].topics;
    const currentTopicIndex = Math.floor((currentStep - 1) / 2);
    const isExerciseStep = (currentStep % 2) === 1;
    const currentTopic = topics[currentTopicIndex];

    if (!currentTopic) {
      return { title: 'Error: Tema no encontrado', content: null };
    }

         if (isExerciseStep) {
       const hasGraphableExercises = currentTopic.exercises.some((ex) => 
         ex.type === 'linear' || ex.type === 'quadratic'
       );
             
                if (hasGraphableExercises) {
           return {
             title: `Ejercicios - ${currentTopic.title}`,
             content: (
               <div className="space-y-6">
                 {currentTopic.exercises.map((exercise, index) => {
                   const exerciseId = `${currentTopic.title}_ex${index + 1}`;
                   const hasGraph = exercise.type === 'linear' || exercise.type === 'quadratic';
                   
                   const processStatement = (statement: string) => {
                     const imgRegex = /\{img_([^}]+)\}/g;
                     const images: string[] = [];
                     let processedStatement = statement;
                     
                     let match;
                     while ((match = imgRegex.exec(statement)) !== null) {
                       const imgName = match[1] + '.png';
                       images.push(imgName);
                       processedStatement = processedStatement.replace(match[0], '');
                     }
                     
                     return { images, processedStatement };
                   };
                   
                   const { images, processedStatement } = processStatement(exercise.statement);
                   
                   return (
                     <div key={index} className={`${hasGraph ? 'flex gap-6' : ''}`}>
                       {/* Enunciado del ejercicio */}
                       <div className={`${hasGraph ? 'w-1/2' : 'w-full'}`}>
                         <div className="bg-gray-100 dark:bg-[#282828] rounded-lg p-6">
                           <h3 className="text-black dark:text-white font-medium mb-4">Ejercicio {index + 1}</h3>
                           
                           {images.length > 0 && (
                             <div className="mb-4 flex flex-wrap gap-4">
                               {images.map((imgName, imgIndex) => (
                                 <div key={imgIndex} className="flex justify-center">
                                   <Image
                                     src={`/${imgName}`}
                                     alt={`Imagen ${imgIndex + 1} del ejercicio`}
                                     width={300}
                                     height={200}
                                     className="max-w-full h-auto rounded-lg shadow-md"
                                   />
                                 </div>
                               ))}
                             </div>
                           )}
                           
                           <p className="text-gray-700 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: processedStatement }} />
                           
                           {/* Renderizar diferentes tipos de ejercicios */}
                           {exercise.type === 'linear' && exercise.template && (
                             <div className="mb-4">
                               <div className="text-gray-700 dark:text-gray-300">
                                 <strong>f(x) = </strong>
                                 {renderTemplate(
                                   exercise.template, 
                                   exercise.variables || [], 
                                   exercise.defaultValues || [], 
                                   exerciseId
                                 )}
                               </div>
                               
                               {/* Tabla de valores */}
                               {exercise.range && (
                                 <div className="mt-4">
                                   <h4 className="text-black dark:text-white font-medium mb-2">Tabla de Valores</h4>
                                   <div className="overflow-x-auto">
                                     <table className="min-w-full border border-gray-300 dark:border-gray-600">
                                       <thead>
                                         <tr className="bg-gray-200 dark:bg-gray-700">
                                           <th className="px-3 py-2 text-left border border-gray-300 dark:border-gray-600 text-black dark:text-white">x</th>
                                           <th className="px-3 py-2 text-left border border-gray-300 dark:border-gray-600 text-black dark:text-white">f(x)</th>
                                         </tr>
                                       </thead>
                                       <tbody>
                                         {(() => {
                                           const a = getVariableValue(exerciseId, 'a', exercise.defaultValues?.[0] || 0);
                                           const b = getVariableValue(exerciseId, 'b', exercise.defaultValues?.[1] || 0);
                                           const range = exercise.range;
                                           const tableData = [];
                                           
                                           for (let x = range[0]; x <= range[1]; x++) {
                                             const fx = a * x + b;
                                             tableData.push({ x, fx });
                                           }
                                           
                                           return tableData.map((row, idx) => (
                                             <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}>
                                               <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{row.x}</td>
                                               <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{row.fx.toFixed(2)}</td>
                                             </tr>
                                           ));
                                         })()}
                                       </tbody>
                                     </table>
                                   </div>
                                 </div>
                               )}
                             </div>
                           )}

                                                       {exercise.type === 'quadratic' && exercise.template && (
                              <div className="mb-4">
                                <div className="text-gray-700 dark:text-gray-300">
                                  <strong>f(x) = </strong>
                                  {renderTemplate(
                                    exercise.template, 
                                    exercise.variables || [], 
                                    exercise.defaultValues || [], 
                                    exerciseId
                                  )}
                                </div>
                                
                                {/* Valores de las variables */}
                                <div className="mt-4">
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <strong>
                                      {exercise.variables?.map((variable, index) => {
                                        const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                        return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                      }).join('')}
                                    </strong>
                                  </p>
                                </div>
                                
                                {/* Cálculo de interceptos en el eje x */}
                                <div className="mt-4">
                                  <h4 className="text-black dark:text-white font-medium mb-2">Interceptos en el Eje X</h4>
                                  <div className="text-gray-700 dark:text-gray-300">
                                    {(() => {
                                      const a = getVariableValue(exerciseId, 'a', exercise.defaultValues?.[0] || 0);
                                      const b = getVariableValue(exerciseId, 'b', exercise.defaultValues?.[1] || 0);
                                      const c = getVariableValue(exerciseId, 'c', exercise.defaultValues?.[2] || 0);
                                      
                                      // Calcular discriminante: Δ = b² - 4ac
                                      const discriminant = Math.pow(b, 2) - 4 * a * c;
                                      
                                      // Calcular interceptos usando fórmula cuadrática: x = (-b ± √Δ) / (2a)
                                      let intercepts: number[] = [];
                                      let interceptText = '';
                                      
                                      if (discriminant > 0) {
                                        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                                        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                                        intercepts = [x1, x2];
                                        interceptText = `La función corta el eje x en dos puntos: x₁ = ${x1.toFixed(2)} y x₂ = ${x2.toFixed(2)}`;
                                      } else if (discriminant === 0) {
                                        const x = -b / (2 * a);
                                        intercepts = [x];
                                        interceptText = `La función toca el eje x en un punto: x = ${x.toFixed(2)}`;
                                      } else {
                                        interceptText = 'La función no corta el eje x (discriminante negativo)';
                                      }
                                      
                                      return (
                                        <div>
                                          <p><strong>Paso 1: Calcular el discriminante</strong></p>
                                          <p>Fórmula: Δ = b² - 4ac</p>
                                          <p>Δ = ({b})² - 4({a})({c})</p>
                                          <p>Δ = {Math.pow(b, 2)} - {4 * a * c}</p>
                                          <p><strong>Δ = {discriminant}</strong></p>
                                          
                                          <p className="mt-4"><strong>Paso 2: Aplicar fórmula cuadrática</strong></p>
                                          <p>Fórmula: x = (-b ± √Δ) / (2a)</p>
                                          <p>x = (-{b} ± √{discriminant}) / (2 × {a})</p>
                                          
                                          {discriminant >= 0 && (
                                            <div>
                                              <p>x₁ = (-{b} + √{discriminant}) / {2 * a}</p>
                                              <p>x₂ = (-{b} - √{discriminant}) / {2 * a}</p>
                                            </div>
                                          )}
                                          
                                          <p className="mt-4"><strong>Resultado:</strong></p>
                                          <p>{interceptText}</p>
                                          
                                          {intercepts.length > 0 && (
                                            <div className="mt-2">
                                              <p><strong>Puntos de corte:</strong></p>
                                              {intercepts.map((x, idx) => (
                                                <p key={idx} className="ml-4">
                                                  P{idx + 1}({x.toFixed(2)}, 0)
                                                </p>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}

                            {exercise.type === 'vertex' && exercise.template && (
                              <div className="mb-4">
                                <div className="text-gray-700 dark:text-gray-300">
                                  <strong>f(x) = </strong>
                                  {renderTemplate(
                                    exercise.template, 
                                    exercise.variables || [], 
                                    exercise.defaultValues || [], 
                                    exerciseId
                                  )}
                                </div>
                                
                                {/* Valores de las variables */}
                                <div className="mt-4">
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <strong>
                                      {exercise.variables?.map((variable, index) => {
                                        const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                        return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                      }).join('')}
                                    </strong>
                                  </p>
                                </div>
                                
                                {/* Fórmula del vértice */}
                                <div className="mt-4">
                                  <h4 className="text-black dark:text-white font-medium mb-2">Fórmula del Vértice</h4>
                                  <div className="text-gray-700 dark:text-gray-300">
                                    {(() => {
                                      const a = getVariableValue(exerciseId, 'a', exercise.defaultValues?.[0] || 0);
                                      const b = getVariableValue(exerciseId, 'b', exercise.defaultValues?.[1] || 0);
                                      const c = getVariableValue(exerciseId, 'c', exercise.defaultValues?.[2] || 0);
                                      
                                      // Calcular coordenadas del vértice
                                      const xVertex = -b / (2 * a);
                                      const yVertex = a * Math.pow(xVertex, 2) + b * xVertex + c;
                                      
                                      return (
                                        <div>
                                          <p>Para f(x) = ax² + bx + c</p>
                                          <p>Vértice: V = (-b/2a, f(-b/2a))</p>
                                          <p>V = (-{b}/2({a}), f(-{b}/2({a})))</p>
                                          <p>V = ({xVertex}, {yVertex})</p>
                                          <p className="mt-2"><strong>V = ({xVertex}, {yVertex})</strong></p>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}

                            {exercise.type === 'pointDistance' && exercise.template && (
                              <div className="mb-4">
                                <div className="text-gray-700 dark:text-gray-300">
                                  {renderTemplate(
                                    exercise.template, 
                                    exercise.variables || [], 
                                    exercise.defaultValues || [], 
                                    exerciseId
                                  )}
                                </div>
                                
                                {/* Valores de las variables */}
                                <div className="mt-4">
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <strong>
                                      {exercise.variables?.map((variable, index) => {
                                        const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                        return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                      }).join('')}
                                    </strong>
                                  </p>
                                </div>
                                
                                {/* Fórmula de distancia entre puntos */}
                                <div className="mt-4">
                                  <h4 className="text-black dark:text-white font-medium mb-2">Fórmula de Distancia</h4>
                                  <div className="text-gray-700 dark:text-gray-300">
                                    {(() => {
                                      const x1 = getVariableValue(exerciseId, 'x1', exercise.defaultValues?.[0] || 0);
                                      const y1 = getVariableValue(exerciseId, 'y1', exercise.defaultValues?.[1] || 0);
                                      const x2 = getVariableValue(exerciseId, 'x2', exercise.defaultValues?.[2] || 0);
                                      const y2 = getVariableValue(exerciseId, 'y2', exercise.defaultValues?.[3] || 0);
                                      
                                      // Calcular distancia entre puntos
                                      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                                      
                                      return (
                                        <div>
                                          <p>Fórmula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
                                          <p>d = √[({x2} - {x1})² + ({y2} - {y1})²]</p>
                                          <p>d = √[({x2 - x1})² + ({y2 - y1})²]</p>
                                          <p>d = √[{Math.pow(x2 - x1, 2)} + {Math.pow(y2 - y1, 2)}]</p>
                                          <p>d = √{Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)}</p>
                                          <p className="mt-2"><strong>d = {distance}</strong></p>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}

                            {exercise.type === 'pointSlope' && exercise.template && (
                              <div className="mb-4">
                                <div className="text-gray-700 dark:text-gray-300">
                                  {renderTemplate(
                                    exercise.template, 
                                    exercise.variables || [], 
                                    exercise.defaultValues || [], 
                                    exerciseId
                                  )}
                                </div>
                                
                                {/* Valores de las variables */}
                                <div className="mt-4">
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <strong>
                                      {exercise.variables?.map((variable, index) => {
                                        const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                        // Para ejercicios pointSlope, mostrar 'm' en lugar de 'p2'
                                        const displayVariable = exercise.type === 'pointSlope' && variable === 'p2' ? 'm' : variable;
                                        return `${displayVariable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                      }).join('')}
                                    </strong>
                                  </p>
                                </div>
                                
                                {/* Fórmula canónica de la recta */}
                                <div className="mt-4">
                                  <h4 className="text-black dark:text-white font-medium mb-2">Ecuación de la Recta</h4>
                                  <div className="text-gray-700 dark:text-gray-300">
                                    {(() => {
                                      const x1 = getVariableValue(exerciseId, 'x1', exercise.defaultValues?.[0] || 0);
                                      const y1 = getVariableValue(exerciseId, 'y1', exercise.defaultValues?.[1] || 0);
                                      const m = getVariableValue(exerciseId, 'p2', exercise.defaultValues?.[2] || 0);
                                      
                                      // Calcular ecuación canónica: y - y₁ = m(x - x₁)
                                      // Despejando y: y = m(x - x₁) + y₁
                                      // y = mx - mx₁ + y₁
                                      // y = mx + (y₁ - mx₁)
                                      const b = y1 - m * x1;
                                      
                                      return (
                                        <div>
                                          <p>Fórmula canónica: y - y₁ = m(x - x₁)</p>
                                          <p>y - {y1} = {m}(x - {x1})</p>
                                          <p>y = {m}(x - {x1}) + {y1}</p>
                                          <p>y = {m}x - {m * x1} + {y1}</p>
                                          <p>y = {m}x + {b}</p>
                                          <p className="mt-2"><strong>y = {m}x + {b}</strong></p>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}

                                                         {exercise.type === 'pointByPoint' && exercise.template && (
                               <div className="mb-4">
                                 <div className="text-gray-700 dark:text-gray-300">
                                   {renderTemplate(
                                     exercise.template, 
                                     exercise.variables || [], 
                                     exercise.defaultValues || [], 
                                     exerciseId
                                   )}
                                 </div>
                                 
                                 {/* Valores de las variables */}
                                 <div className="mt-4">
                                   <p className="text-gray-700 dark:text-gray-300">
                                     <strong>
                                       {exercise.variables?.map((variable, index) => {
                                         const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                         return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                       }).join('')}
                                     </strong>
                                   </p>
                                 </div>
                                 
                                 {/* Fórmula de pendiente y ecuación de la recta */}
                                 <div className="mt-4">
                                   <h4 className="text-black dark:text-white font-medium mb-2">Ecuación de la Recta</h4>
                                   <div className="text-gray-700 dark:text-gray-300">
                                     {(() => {
                                       const x1 = getVariableValue(exerciseId, 'x1', exercise.defaultValues?.[0] || 0);
                                       const x2 = getVariableValue(exerciseId, 'x2', exercise.defaultValues?.[1] || 0);
                                       const y1 = getVariableValue(exerciseId, 'y1', exercise.defaultValues?.[2] || 0);
                                       const y2 = getVariableValue(exerciseId, 'y2', exercise.defaultValues?.[3] || 0);
                                       
                                       // Calcular pendiente: m = (y₂ - y₁) / (x₂ - x₁)
                                       const m = (y2 - y1) / (x2 - x1);
                                       
                                       // Calcular ecuación de la recta usando punto-pendiente
                                       // y - y₁ = m(x - x₁)
                                       // y = m(x - x₁) + y₁
                                       // y = mx - mx₁ + y₁
                                       // y = mx + (y₁ - mx₁)
                                       const b = y1 - m * x1;
                                       
                                       return (
                                         <div>
                                           <p><strong>Paso 1: Calcular la pendiente</strong></p>
                                           <p>Fórmula: m = (y₂ - y₁) / (x₂ - x₁)</p>
                                           <p>m = ({y2} - {y1}) / ({x2} - {x1})</p>
                                           <p>m = {y2 - y1} / {x2 - x1}</p>
                                           <p><strong>m = {m}</strong></p>
                                           
                                           <p className="mt-4"><strong>Paso 2: Ecuación de la recta</strong></p>
                                           <p>Usando punto-pendiente: y - y₁ = m(x - x₁)</p>
                                           <p>y - {y1} = {m}(x - {x1})</p>
                                           <p>y = {m}(x - {x1}) + {y1}</p>
                                           <p>y = {m}x - {m * x1} + {y1}</p>
                                           <p>y = {m}x + {b}</p>
                                           <p className="mt-2"><strong>y = {m}x + {b}</strong></p>
                                         </div>
                                       );
                                     })()}
                                   </div>
                                 </div>
                               </div>
                             )}

                                                           {exercise.type === 'speed' && exercise.template && (
                                <div className="mb-4">
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Fórmula: </strong>
                                    {renderTemplate(
                                      exercise.template, 
                                      exercise.variables || [], 
                                      exercise.defaultValues || [], 
                                      exerciseId
                                    )}
                                  </div>
                                  
                                  {/* Valores de las variables */}
                                  <div className="mt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      <strong>
                                        {exercise.variables?.map((variable, index) => {
                                          const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                          return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                        }).join('')}
                                      </strong>
                                    </p>
                                  </div>
                                  
                                  {/* Cálculo de velocidad */}
                                  <div className="mt-4">
                                    <h4 className="text-black dark:text-white font-medium mb-2">Cálculo de Velocidad</h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                      {(() => {
                                        const d = getVariableValue(exerciseId, 'd', exercise.defaultValues?.[0] || 0);
                                        const t = getVariableValue(exerciseId, 't', exercise.defaultValues?.[1] || 0);
                                        
                                        // Calcular velocidad: V = d/t
                                        const velocity = t !== 0 ? d / t : 0;
                                        
                                        return (
                                          <div>
                                            <p>Fórmula: V = d/t</p>
                                            <p>V = {d}/{t} = {velocity.toFixed(2)}</p>
                                            <p className="mt-2"><strong>V = {velocity.toFixed(2)}</strong></p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              {velocity > 0 ? `La velocidad es de ${velocity.toFixed(2)} unidades por tiempo` : 'No se puede calcular la velocidad cuando el tiempo es cero'}
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {exercise.type === 'distance' && exercise.template && (
                                <div className="mb-4">
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Fórmula: </strong>
                                    {renderTemplate(
                                      exercise.template, 
                                      exercise.variables || [], 
                                      exercise.defaultValues || [], 
                                      exerciseId
                                    )}
                                  </div>
                                  
                                  {/* Valores de las variables */}
                                  <div className="mt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      <strong>
                                        {exercise.variables?.map((variable, index) => {
                                          const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                          return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                        }).join('')}
                                      </strong>
                                    </p>
                                  </div>
                                  
                                  {/* Cálculo de distancia */}
                                  <div className="mt-4">
                                    <h4 className="text-black dark:text-white font-medium mb-2">Cálculo de Distancia</h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                      {(() => {
                                        const v = getVariableValue(exerciseId, 'v', exercise.defaultValues?.[0] || 0);
                                        const t = getVariableValue(exerciseId, 't', exercise.defaultValues?.[1] || 0);
                                        
                                        // Calcular distancia: D = v * t
                                        const distance = v * t;
                                        
                                        return (
                                          <div>
                                            <p>Fórmula: D = v × t</p>
                                            <p>D = {v} × {t} = {distance.toFixed(2)}</p>
                                            <p className="mt-2"><strong>D = {distance.toFixed(2)}</strong></p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              La distancia recorrida es de {distance.toFixed(2)} unidades
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {exercise.type === 'time' && exercise.template && (
                                <div className="mb-4">
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Fórmula: </strong>
                                    {renderTemplate(
                                      exercise.template, 
                                      exercise.variables || [], 
                                      exercise.defaultValues || [], 
                                      exerciseId
                                    )}
                                  </div>
                                  
                                  {/* Valores de las variables */}
                                  <div className="mt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      <strong>
                                        {exercise.variables?.map((variable, index) => {
                                          const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                          return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                        }).join('')}
                                      </strong>
                                    </p>
                                  </div>
                                  
                                  {/* Cálculo de tiempo */}
                                  <div className="mt-4">
                                    <h4 className="text-black dark:text-white font-medium mb-2">Cálculo de Tiempo</h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                      {(() => {
                                        const d = getVariableValue(exerciseId, 'd', exercise.defaultValues?.[0] || 0);
                                        const v = getVariableValue(exerciseId, 'v', exercise.defaultValues?.[1] || 0);
                                        
                                        // Calcular tiempo: t = d/v
                                        const time = v !== 0 ? d / v : 0;
                                        
                                        return (
                                          <div>
                                            <p>Fórmula: t = d/v</p>
                                            <p>t = {d}/{v} = {time.toFixed(2)}</p>
                                            <p className="mt-2"><strong>t = {time.toFixed(2)}</strong></p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              {time > 0 ? `El tiempo transcurrido es de ${time.toFixed(2)} unidades` : 'No se puede calcular el tiempo cuando la velocidad es cero'}
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {exercise.type === 'mtToKm' && exercise.template && (
                                <div className="mb-4">
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Conversión: </strong>
                                    {renderTemplate(
                                      exercise.template, 
                                      exercise.variables || [], 
                                      exercise.defaultValues || [], 
                                      exerciseId
                                    )}
                                  </div>
                                  
                                  {/* Valores de las variables */}
                                  <div className="mt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      <strong>
                                        {exercise.variables?.map((variable, index) => {
                                          const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                          return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                        }).join('')}
                                      </strong>
                                    </p>
                                  </div>
                                  
                                  {/* Conversión de metros a kilómetros */}
                                  <div className="mt-4">
                                    <h4 className="text-black dark:text-white font-medium mb-2">Conversión de Metros a Kilómetros</h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                                                             {(() => {
                                         const m = getVariableValue(exerciseId, 'm', exercise.defaultValues?.[0] || 0);
                                         
                                         // Calcular conversión: 1 km = 1000 m
                                         const calculatedKm = m / 1000;
                                        
                                        return (
                                          <div>
                                            <p>Fórmula: 1 kilómetro = 1000 metros</p>
                                            <p>Por lo tanto: 1 metro = 1/1000 kilómetros</p>
                                            <p>k = {m} ÷ 1000 = {calculatedKm.toFixed(3)}</p>
                                            <p className="mt-2"><strong>{m} metros = {calculatedKm.toFixed(3)} kilómetros</strong></p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              {m} metros equivalen a {calculatedKm.toFixed(3)} kilómetros
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {exercise.type === 'kmToMt' && exercise.template && (
                                <div className="mb-4">
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Conversión: </strong>
                                    {renderTemplate(
                                      exercise.template, 
                                      exercise.variables || [], 
                                      exercise.defaultValues || [], 
                                      exerciseId
                                    )}
                                  </div>
                                  
                                  {/* Valores de las variables */}
                                  <div className="mt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      <strong>
                                        {exercise.variables?.map((variable, index) => {
                                          const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                          return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                        }).join('')}
                                      </strong>
                                    </p>
                                  </div>
                                  
                                  {/* Conversión de kilómetros a metros */}
                                  <div className="mt-4">
                                    <h4 className="text-black dark:text-white font-medium mb-2">Conversión de Kilómetros a Metros</h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                                                             {(() => {
                                         const k = getVariableValue(exerciseId, 'k', exercise.defaultValues?.[0] || 0);
                                         
                                         // Calcular conversión: 1 km = 1000 m
                                         const calculatedM = k * 1000;
                                        
                                        return (
                                          <div>
                                            <p>Fórmula: 1 kilómetro = 1000 metros</p>
                                            <p>Por lo tanto: 1 kilómetro × 1000 = metros</p>
                                            <p>m = {k} × 1000 = {calculatedM}</p>
                                            <p className="mt-2"><strong>{k} kilómetros = {calculatedM} metros</strong></p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              {k} kilómetros equivalen a {calculatedM} metros
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {exercise.type === 'hrToMin' && exercise.template && (
                                <div className="mb-4">
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Conversión: </strong>
                                    {renderTemplate(
                                      exercise.template, 
                                      exercise.variables || [], 
                                      exercise.defaultValues || [], 
                                      exerciseId
                                    )}
                                  </div>
                                  
                                  {/* Valores de las variables */}
                                  <div className="mt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      <strong>
                                        {exercise.variables?.map((variable, index) => {
                                          const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                          return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                        }).join('')}
                                      </strong>
                                    </p>
                                  </div>
                                  
                                  {/* Conversión de horas a minutos */}
                                  <div className="mt-4">
                                    <h4 className="text-black dark:text-white font-medium mb-2">Conversión de Horas a Minutos</h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                                                             {(() => {
                                         const h = getVariableValue(exerciseId, 'h', exercise.defaultValues?.[0] || 0);
                                         
                                         // Calcular conversión: 1 hora = 60 minutos
                                         const calculatedMin = h * 60;
                                        
                                        return (
                                          <div>
                                            <p>Fórmula: 1 hora = 60 minutos</p>
                                            <p>Por lo tanto: 1 hora × 60 = minutos</p>
                                            <p>m = {h} × 60 = {calculatedMin}</p>
                                            <p className="mt-2"><strong>{h} horas = {calculatedMin} minutos</strong></p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              {h} horas equivalen a {calculatedMin} minutos
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {exercise.type === 'minToHr' && exercise.template && (
                                <div className="mb-4">
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Conversión: </strong>
                                    {renderTemplate(
                                      exercise.template, 
                                      exercise.variables || [], 
                                      exercise.defaultValues || [], 
                                      exerciseId
                                    )}
                                  </div>
                                  
                                  {/* Valores de las variables */}
                                  <div className="mt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      <strong>
                                        {exercise.variables?.map((variable, index) => {
                                          const value = getVariableValue(exerciseId, variable, exercise.defaultValues?.[index] || 0);
                                          return `${variable} = ${value}${index < (exercise.variables?.length || 0) - 1 ? '; ' : ''}`;
                                        }).join('')}
                                      </strong>
                                    </p>
                                  </div>
                                  
                                  {/* Conversión de minutos a horas */}
                                  <div className="mt-4">
                                    <h4 className="text-black dark:text-white font-medium mb-2">Conversión de Minutos a Horas</h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                                                             {(() => {
                                         const m = getVariableValue(exerciseId, 'm', exercise.defaultValues?.[0] || 0);
                                         
                                         // Calcular conversión: 1 hora = 60 minutos
                                         const calculatedHr = m / 60;
                                        
                                        return (
                                          <div>
                                            <p>Fórmula: 1 hora = 60 minutos</p>
                                            <p>Por lo tanto: 1 minuto = 1/60 horas</p>
                                            <p>h = {m} ÷ 60 = {calculatedHr.toFixed(3)}</p>
                                            <p className="mt-2"><strong>{m} minutos = {calculatedHr.toFixed(3)} horas</strong></p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              {m} minutos equivalen a {calculatedHr.toFixed(3)} horas
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}
                           
                           {/* Opciones de respuesta */}
                           <div className="space-y-3">
                             {exercise.options?.map((option, optIndex) => (
                               <div key={optIndex} className="flex items-center space-x-3">
                                 <input
                                   type="radio"
                                   name={`exercise-${index}`}
                                   id={`option-${index}-${optIndex}`}
                                   value={optIndex}
                                   checked={selectedAnswers[index] === optIndex}
                                   onChange={(e) => handleAnswerSelect(index, '', parseInt(e.target.value))}
                                   className="text-blue-500 focus:ring-blue-500"
                                 />
                                 <label
                                   htmlFor={`option-${index}-${optIndex}`}
                                   className="text-gray-700 dark:text-gray-300"
                                 >
                                   {option}
                                 </label>
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                       
                       {/* Gráfica al lado del ejercicio */}
                       {hasGraph && (
                         <div className="w-1/2">
                           <div className="bg-gray-100 dark:bg-[#282828] rounded-lg p-6">
                             <h3 className="text-black dark:text-white font-medium mb-4">Gráfica - Ejercicio {index + 1}</h3>
                             {exercise.type === 'linear' && (
                               (() => {
                                 const a = getVariableValue(exerciseId, 'a', exercise.defaultValues?.[0] || 0);
                                 const b = getVariableValue(exerciseId, 'b', exercise.defaultValues?.[1] || 0);
                                 const range = exercise.range || [-10, 10];
                                 
                                 const x = [];
                                 const y = [];
                                 
                                 for (let i = range[0]; i <= range[1]; i += 0.1) {
                                   x.push(i);
                                   y.push(a * i + b);
                                 }
                                 
                                 return (
                                   <div className="h-80">
                                     <Plot
                                       data={[
                                         {
                                           x: x,
                                           y: y,
                                           type: 'scatter',
                                           mode: 'lines',
                                           line: {
                                             color: 'blue',
                                             width: 3
                                           },
                                           name: `f(x) = ${a}x + ${b}`
                                         }
                                       ]}
                                       layout={{
                                         title: `Función Lineal: f(x) = ${a}x + ${b}`,
                                         xaxis: { 
                                           title: 'X',
                                           range: [range[0] - 1, range[1] + 1]
                                         },
                                         yaxis: { 
                                           title: 'Y',
                                           range: [Math.min(...y) - 1, Math.max(...y) + 1]
                                         },
                                         width: 400,
                                         height: 300,
                                         margin: { l: 50, r: 20, t: 40, b: 50 }
                                       }}
                                       config={{ responsive: true }}
                                     />
                                   </div>
                                 );
                               })()
                             )}
                             
                             {exercise.type === 'quadratic' && (
                               (() => {
                                 const a = getVariableValue(exerciseId, 'a', exercise.defaultValues?.[0] || 0);
                                 const b = getVariableValue(exerciseId, 'b', exercise.defaultValues?.[1] || 0);
                                 const c = getVariableValue(exerciseId, 'c', exercise.defaultValues?.[2] || 0);
                                 const range = exercise.range || [-10, 10];
                                 
                                 const x = [];
                                 const y = [];
                                 
                                 for (let i = range[0]; i <= range[1]; i += 0.1) {
                                   x.push(i);
                                   y.push(a * Math.pow(i, 2) + b * i + c);
                                 }
                                 
                                 // Calcular interceptos para marcarlos en la gráfica
                                 const discriminant = Math.pow(b, 2) - 4 * a * c;
                                 const intercepts: number[] = [];
                                 
                                 if (discriminant > 0) {
                                   const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                                   const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                                   intercepts.push(x1, x2);
                                 } else if (discriminant === 0) {
                                   const x = -b / (2 * a);
                                   intercepts.push(x);
                                 }
                                 
                                 // Calcular vértice
                                 const xVertex = -b / (2 * a);
                                 const yVertex = a * Math.pow(xVertex, 2) + b * xVertex + c;
                                 
                                 return (
                                   <>
                                     <div className="h-80">
                                       <Plot
                                         data={[
                                           {
                                             x: x,
                                             y: y,
                                             type: 'scatter',
                                             mode: 'lines',
                                             line: {
                                               color: 'blue',
                                               width: 3
                                             },
                                             name: `f(x) = ${a}x² + ${b}x + ${c}`
                                           },
                                           // Marcar interceptos en el eje x
                                           ...(intercepts.length > 0 ? [{
                                             x: intercepts,
                                             y: new Array(intercepts.length).fill(0),
                                             type: 'scatter',
                                             mode: 'markers',
                                             marker: {
                                               color: 'red',
                                               size: 8,
                                               symbol: 'x'
                                             },
                                             name: 'Interceptos en X'
                                           }] : []),
                                           // Marcar vértice
                                           {
                                             x: [xVertex],
                                             y: [yVertex],
                                             type: 'scatter',
                                             mode: 'markers',
                                             marker: {
                                               color: 'green',
                                               size: 10,
                                               symbol: 'diamond'
                                             },
                                             name: 'Vértice'
                                           }
                                         ]}
                                         layout={{
                                           title: `Función Cuadrática: f(x) = ${a}x² + ${b}x + ${c}`,
                                           xaxis: { 
                                             title: 'X',
                                             range: [range[0] - 1, range[1] + 1],
                                             zeroline: true,
                                             zerolinecolor: 'gray'
                                           },
                                           yaxis: { 
                                             title: 'Y',
                                             range: [Math.min(...y) - 1, Math.max(...y) + 1],
                                             zeroline: true,
                                             zerolinecolor: 'gray'
                                           },
                                           width: 400,
                                           height: 300,
                                           margin: { l: 50, r: 20, t: 40, b: 50 },
                                           showlegend: true
                                         }}
                                         config={{ responsive: true }}
                                       />
                                     </div>
                                     
                                     {/* Información adicional */}
                                     <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                       <p><strong>Vértice:</strong> ({xVertex.toFixed(2)}, {yVertex.toFixed(2)})</p>
                                       {intercepts.length > 0 && (
                                         <p><strong>Interceptos en X:</strong> {intercepts.map(x => x.toFixed(2)).join(', ')}</p>
                                       )}
                                     </div>
                                   </>
                                 );
                               })()
                             )}
                           </div>
                         </div>
                       )}
                     </div>
                   );
                 })}
               </div>
             )
           };
      } else {
        return {
          title: `Ejercicios - ${currentTopic.title}`,
          content: (
            <div className="space-y-6">
              {currentTopic.exercises.map((exercise, index) => {
                const processStatement = (statement: string) => {
                  const imgRegex = /\{img_([^}]+)\}/g;
                  const images: string[] = [];
                  let processedStatement = statement;
                  
                  let match;
                  while ((match = imgRegex.exec(statement)) !== null) {
                    const imgName = match[1] + '.png';
                    images.push(imgName);
                    processedStatement = processedStatement.replace(match[0], '');
                  }
                  
                  return { images, processedStatement };
                };
                
                const { images, processedStatement } = processStatement(exercise.statement);
                
                return (
                  <div key={index} className="bg-gray-100 dark:bg-[#282828] rounded-lg p-6">
                    <h3 className="text-black dark:text-white font-medium mb-4">Ejercicio {index + 1}</h3>
                    
                    {images.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-4">
                        {images.map((imgName, imgIndex) => (
                          <div key={imgIndex} className="flex justify-center">
                            <Image
                              src={`/${imgName}`}
                              alt={`Imagen ${imgIndex + 1} del ejercicio`}
                              width={300}
                              height={200}
                              className="max-w-full h-auto rounded-lg shadow-md"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: processedStatement }} />
                    <div className="space-y-3">
                      {exercise.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`exercise-${index}`}
                            id={`option-${index}-${optIndex}`}
                            value={optIndex}
                            checked={selectedAnswers[index] === optIndex}
                            onChange={(e) => handleAnswerSelect(index, '', parseInt(e.target.value))}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`option-${index}-${optIndex}`}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {option}
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
      }
    } else {
      return {
        title: currentTopic.title,
        content: (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: currentTopic.description }} />
          </div>
        )
      };
    }
  };

  const { title, content } = getCurrentContent();

  const getAverage = () => {
    if (results.subjects.length === 0) return 0;
    const sum = results.subjects.reduce((acc, s) => acc + s.points, 0);
    const sumMax = results.subjects.reduce((acc, s) => acc + s.maxPoints, 0);
    return ((sum / sumMax) * 5).toFixed(1);
  };

  const getSummaryContent = () => (
    <div className="p-6 mt-20 max-w-4xl mx-auto">
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
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-200 dark:bg-[#222]">
              <th className="px-4 py-2">TEMAS</th>
              <th className="px-4 py-2">Puntos</th>
              <th className="px-4 py-2">Max PUNT</th>
              <th className="px-4 py-2">EFECT</th>
            </tr>
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
    </div>
  );

  const isSummaryStep = currentStep === totalSteps;
  const isChatStep = currentStep === totalSteps + 1;

  const handleNext = async () => {
    const isExerciseStep = (currentStep % 2) === 1;
    if (isSummaryStep) {
      setCurrentStep(currentStep + 1);
      return;
    }
    if (currentStep === totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }
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
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (showChat) {
      setShowChat(false);
      setCurrentStep(totalSteps);
    } else if (currentStep > 0) {
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

  const fillRandomAnswers = () => {
    if (!diagnosticConfigs.length || !diagnosticConfigs[0].topics) return;
    const currentTopicIndex = Math.floor((currentStep - 1) / 2);
    const currentTopic = diagnosticConfigs[0].topics[currentTopicIndex];
    if (!currentTopic || !currentTopic.exercises) return;
    const randomAnswers: { [key: string]: number } = {};
    currentTopic.exercises.forEach((ex, idx) => {
      randomAnswers[idx] = Math.floor(Math.random() * ex.options.length);
    });
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
        <div className="sticky top-0 z-50 h-16 bg-white dark:bg-[#1C1D1F] flex items-center justify-between px-6 text-black dark:text-white shadow-md">
          <div className="flex items-center">
            <h1 className="text-lg font-medium">{diagnosticConfigs.length > 0 ? diagnosticConfigs[0].title : 'Diagnóstico'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0 && !showChat}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${currentStep === 0 && !showChat
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
                disabled={currentStep === totalSteps && showChat}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${currentStep === totalSteps && showChat
                  ? 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-[#282828] hover:bg-gray-300 dark:hover:bg-[#363636]'
                  } rounded-md transition-colors`}
              >
                Siguiente
                <FiChevronRight className="w-4 h-4" />
              </button>
            )}

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

        <div className="h-[calc(100vh-64px)]">
          {process.env.NODE_ENV === 'development' && (currentStep % 2 === 1) && !isSummaryStep && (
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
              <div className="w-[40%] border-r border-gray-300 p-6 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-medium text-black mb-4">Asistente de Matemáticas</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>Bienvenido al asistente de matemáticas.</p>
                  </div>
                </div>
              </div>

              <div className="w-[60%] flex flex-col">
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
              <div className="w-[75%] bg-gray-100 dark:bg-[#1E1F25] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-medium text-black mb-4">{title}</h2>
                  <div className="text-gray-700">
                    {content}
                  </div>
                </div>
              </div>

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
                </div>
              </div>
            </div>
          )}
        </div>

        {isMaterialOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMaterialOpen(false)}
            ></div>

            <div className="absolute right-0 top-16 w-[25%] bg-white dark:bg-[#1E1F25] h-[calc(100vh-64px)] shadow-xl z-50">
              <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-black dark:text-white font-medium mb-1">Progreso del curso</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">19%</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fundamentos de SEO</span>
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
                  <div className="h-full w-[19%] bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-88px)]">
                <div className="relative pt-4 pb-4">
                  <div className="absolute left-[23px] top-0 w-[6px] h-[6px] rounded-full bg-orange-400"></div>
                  <div className="absolute left-[25px] top-[6px] w-[2px] h-[calc(100%-12px)] bg-gray-300 dark:bg-gray-700"></div>
                  <div className="absolute left-[23px] bottom-0 w-[6px] h-[6px] rounded-full bg-gray-300 dark:bg-gray-700"></div>

                  <div className="pl-12 mb-4">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Fundamentos de SEO</span>
                  </div>

                  {diagnosticConfigs.length > 0 ? (
                    diagnosticConfigs[0].topics.map((topic, index) => (
                      <div key={index} className="group relative flex items-center py-4 px-3 hover:bg-gray-200 dark:hover:bg-[#282828] transition-colors cursor-pointer">
                        {index < diagnosticConfigs[0].topics.length - 1 && (
                          <div
                            className={`absolute left-[25px] top-[50%] w-[2px] h-[calc(100%)] ${topic.completed ? 'bg-orange-400' : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                          ></div>
                        )}

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

                        <div className="flex items-center flex-1 pl-5">
                          <div className="w-20 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
                            <Image
                              src={topic.image || '/clase1.png'}
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