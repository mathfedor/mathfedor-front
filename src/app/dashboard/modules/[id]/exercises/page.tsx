'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { use } from 'react';
import Sidebar from '@/components/Sidebar';
import { DiagnosticConfig } from '@/types/diagnostic.types';
import { authService } from '@/services/auth.service';
import { chatService } from '@/services/chat.service';
import { FiArrowRight, FiBookOpen, FiChevronLeft, FiChevronRight, FiChevronDown, FiX, FiSend, FiShuffle, FiPlus, FiMic } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/components/ui/tooltip';
import { User } from '@/types/auth.types';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Module, moduleService } from '@/services/module.service';
import { useModuleAccess } from '@/contexts/ModuleAccessContext';
import { LearningResult, learningResultsService } from '@/services/learning-results.service';
import { LearningComment, LearningReply, learningCommentsService } from '@/services/learning-comments.service';

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
  id: number | string;
  author: Author;
  content: string;
  likes: number;
}

interface Question {
  id: number | string;
  author: Author;
  content: string;
  likes: number;
  replies: Reply[];
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
  image?: string;
  completed?: boolean;
  duration?: string;
  subtopics?: Subtopic[];
  exercises: Array<{
    statement: string;
    options: string[];
    correctAnswer: string;
  }>;
}

type ModuleResultsState = {
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
    answers: Array<{
      exerciseId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }>;
  }>;
  answers: Array<{
    exerciseId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }>;
};

type ModuleDiagnosticConfig = Omit<DiagnosticConfig, 'topics'> & { topics: Topic[] };

const emptyResults: ModuleResultsState = {
  goodAnswers: 0,
  wrongAnswers: 0,
  subjects: [],
  answers: []
};

const normalizeText = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const isInformationalTopic = (topic?: Topic) => (
  normalizeText(topic?.title || '').includes('problemas resueltos')
);

const topicHasExercises = (topic?: Topic) => (
  Boolean(topic?.exercises?.length) && !isInformationalTopic(topic)
);

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
  const [diagnosticConfigs, setDiagnosticConfigs] = useState<ModuleDiagnosticConfig[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const router = useRouter();
  const { hasAccess } = useModuleAccess();
  const totalSteps = diagnosticConfigs[0]?.topics?.reduce((total, topic) => total + (topicHasExercises(topic) ? 2 : 1), 0) || 0;
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<ModuleResultsState>(emptyResults);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const [showResults, setShowResults] = useState(false);
  const [isSupportPanelOpen, setIsSupportPanelOpen] = useState(true);
  const lastSubmittedSubjectCountRef = useRef(0);
  const [commentsByTopic, setCommentsByTopic] = useState<Record<string, Question[]>>({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [contributionText, setContributionText] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
  const fireworkEffects = useMemo(() => {
    const colors = ['#FDE68A', '#F97316', '#EF4444', '#38BDF8', '#818CF8', '#34D399', '#F472B6'];
    const bursts = [
      { id: 0, left: 10, travel: 32, delay: 0.05, sparks: 42 },
      { id: 1, left: 25, travel: 70, delay: 0.18, sparks: 50 },
      { id: 2, left: 50, travel: 58, delay: 0.34, sparks: 58 },
      { id: 3, left: 72, travel: 66, delay: 0.5, sparks: 48 },
      { id: 4, left: 88, travel: 42, delay: 0.68, sparks: 44 },
      { id: 5, left: 38, travel: 46, delay: 0.84, sparks: 38 },
      { id: 6, left: 62, travel: 80, delay: 1.02, sparks: 40 }
    ];

    const sparks = bursts.flatMap((burst) => (
      Array.from({ length: burst.sparks }, (_, sparkIndex) => {
        const angle = ((Math.PI * 2) / burst.sparks) * sparkIndex + (Math.random() * 0.22 - 0.11);
        const distance = Math.random() * 330 + 170;

        return {
          id: `${burst.id}-${sparkIndex}`,
          left: burst.left + (Math.random() * 3 - 1.5),
          travel: burst.travel,
          angle: (angle * 180) / Math.PI,
          length: Math.random() * 72 + 38,
          thickness: Math.random() * 2 + 1.5,
          duration: Math.random() * 1.35 + 1.85,
          delay: burst.delay + 0.72 + Math.random() * 0.18,
          burstX: Math.cos(angle) * distance,
          burstY: Math.sin(angle) * distance,
          color: colors[(burst.id + sparkIndex) % colors.length]
        };
      })
    ));

    return { bursts, sparks };
  }, []);

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
      if (!user) return;

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

        const studentId = user.id || user._id || user.email || '';
        const savedResult = studentId
          ? await learningResultsService.getStudentResultByModule(resolvedParams.id, studentId)
          : null;
        const currentConfig = moduleData as unknown as ModuleDiagnosticConfig;

        setDiagnosticConfigs(applySavedLearningResult([currentConfig], savedResult));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id, user]);

  useEffect(() => {
    if (diagnosticConfigs[0]?.topics?.length) {
      void loadTopicComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, diagnosticConfigs, resolvedParams.id]);

  useEffect(() => {
    if (!diagnosticConfigs[0]?.topics?.length || currentStep % 2 !== 0) return;

    const topic = getCurrentTopic();
    if (topic) {
      setSelectedAnswers(getSelectedAnswersForTopic(topic));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, diagnosticConfigs]);

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

  const getRating = (goodAnswers: number, wrongAnswers: number) => {
    const totalAnswers = goodAnswers + wrongAnswers;
    const percentage = totalAnswers > 0 ? (goodAnswers / totalAnswers) * 100 : 0;

    return percentage >= 70 ? 'Todo está muy bien' : 'Necesita mejorar';
  };

  const getExerciseId = (topic: Topic, exerciseIndex: number) => (
    `${topic.title.replace(/\s+/g, '_').toUpperCase()}_ex${exerciseIndex + 1}`
  );

  const buildResultsFromSubjects = (subjects: ModuleResultsState['subjects']): ModuleResultsState => {
    const answers = subjects.flatMap((subject) => subject.answers || []);
    const goodAnswers = answers.filter((answer) => answer.isCorrect).length;
    const wrongAnswers = answers.length - goodAnswers;

    return {
      goodAnswers,
      wrongAnswers,
      subjects,
      answers
    };
  };

  const getSelectedAnswersForTopic = (topic: Topic, sourceResults = results) => {
    const selectedByExercise: { [key: string]: string } = {};

    topic.exercises.forEach((exercise, index) => {
      const savedAnswer = sourceResults.answers.find((answer) => answer.exerciseId === getExerciseId(topic, index));
      if (!savedAnswer) return;

      const selectedPrefix = savedAnswer.selectedAnswer.match(/^\s*([a-z])/i)?.[1];
      const selectedIndex = selectedPrefix
        ? selectedPrefix.toUpperCase().charCodeAt(0) - 65
        : exercise.options.findIndex((option) => savedAnswer.selectedAnswer.includes(option));

      if (selectedIndex >= 0) {
        selectedByExercise[index] = selectedIndex.toString();
      }
    });

    return selectedByExercise;
  };

  const applySavedLearningResult = (
    configs: ModuleDiagnosticConfig[],
    savedResult: LearningResult | null
  ) => {
    if (!savedResult) {
      setResults(emptyResults);
      lastSubmittedSubjectCountRef.current = 0;
      return configs;
    }

    const savedSubjects = (savedResult.subjects || []).map((subject) => {
      const topicPrefix = subject.title.replace(/\s+/g, '_').toUpperCase();

      return {
        title: subject.title,
        points: Number(subject.points || 0),
        maxPoints: Number(subject.maxPoints || 0),
        percentage: Number(subject.percentage || 0),
        N1: subject.N1 || '0%',
        N2: subject.N2 || '0%',
        N3: subject.N3 || '0%',
        N4: subject.N4 || '0%',
        answers: subject.answers?.length
          ? subject.answers
          : (savedResult.answers || []).filter((answer) => answer.exerciseId.startsWith(topicPrefix))
      };
    });
    const restoredResults = buildResultsFromSubjects(savedSubjects);

    setResults(restoredResults);
    lastSubmittedSubjectCountRef.current = savedSubjects.length;

    return configs.map((config) => ({
      ...config,
      topics: config.topics.map((topic) => ({
        ...topic,
        completed: savedSubjects.some((subject) => subject.title === topic.title)
      }))
    }));
  };

  const getTeacherPayload = () => {
    const userWithTeacher = user as (User & {
      teacher?: { name?: string; userId?: string; id?: string; _id?: string };
      teacherId?: string;
      teacherName?: string;
    }) | null;

    return {
      name: userWithTeacher?.teacher?.name || userWithTeacher?.teacherName || 'Profesor asignado',
      userId: userWithTeacher?.teacher?.userId || userWithTeacher?.teacher?.id || userWithTeacher?.teacher?._id || userWithTeacher?.teacherId || currentModule?.createdBy || 'pending-teacher'
    };
  };

  const submitLearningResult = async (compiledResults: ModuleResultsState) => {
    if (!user || !currentModule) {
      return;
    }

    const submittedSubjectCount = compiledResults.subjects.length;

    try {
      await learningResultsService.submitResult({
        learningId: resolvedParams.id,
        moduleId: resolvedParams.id,
        module: {
          id: currentModule._id,
          title: currentModule.title,
          group: currentModule.group
        },
        student: {
          name: user.name,
          userId: user.id || user._id || '',
          lastName: user.lastName || '',
          email: user.email,
          institutionId: user.institutionId || user.student?.institutionId || null,
          branchId: user.student?.branchId || null,
          classroomId: user.student?.classroomId || null
        },
        teacher: getTeacherPayload(),
        institutionId: user.institutionId || user.student?.institutionId || null,
        branchId: user.student?.branchId || null,
        classroomId: user.student?.classroomId || null,
        group: currentModule.group,
        goodAnswers: compiledResults.goodAnswers,
        wrongAnswers: compiledResults.wrongAnswers,
        rating: getRating(compiledResults.goodAnswers, compiledResults.wrongAnswers),
        subjects: compiledResults.subjects,
        answers: compiledResults.answers
      });
      lastSubmittedSubjectCountRef.current = submittedSubjectCount;
    } catch (error) {
      lastSubmittedSubjectCountRef.current = Math.max(0, submittedSubjectCount - 1);
      console.error('Error al guardar resultados del módulo:', error);
      setAlertMessage({
        title: 'Resultados no guardados',
        message: 'No se pudieron guardar las respuestas de este bloque. Intenta continuar nuevamente.'
      });
      setIsAlertOpen(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTopicSymbol = (topicTitle: string): string | null => {
    const normalizedTitle = topicTitle.toLowerCase();

    if (normalizedTitle.includes('adición') || normalizedTitle.includes('adicion')) return '+';
    if (normalizedTitle.includes('sustracción') || normalizedTitle.includes('sustraccion')) return '-';
    if (normalizedTitle.includes('multiplicación') || normalizedTitle.includes('multiplicacion')) return 'x';
    if (normalizedTitle.includes('división') || normalizedTitle.includes('division')) return '÷';

    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getHtmlHeadingSymbol = (headingText: string): string | null => {
    const normalizedText = headingText.replace(/<[^>]*>/g, '').trim().toLowerCase();

    if (normalizedText === 'adiciÃ³n' || normalizedText === 'adicion') return '+';
    if (normalizedText === 'sustracciÃ³n' || normalizedText === 'sustraccion') return '-';
    if (normalizedText === 'multiplicaciÃ³n' || normalizedText === 'multiplicacion') return 'x';
    if (normalizedText === 'divisiÃ³n' || normalizedText === 'division') return '/';

    return null;
  };

  const getOperationSymbol = (value: string, exact = false): string | null => {
    const normalizedValue = value
      .replace(/<[^>]*>/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
    const matches = exact
      ? (target: string) => normalizedValue === target
      : (target: string) => normalizedValue.includes(target);

    if (matches('adicion') || normalizedValue.includes('adici')) return '+';
    if (matches('sustraccion') || normalizedValue.includes('sustracci')) return '-';
    if (matches('multiplicacion') || normalizedValue.includes('multiplicaci')) return 'x';
    if (matches('division') || normalizedValue.includes('divisi')) return '/';

    return null;
  };

  const getPlainTextLength = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim().length;
  };

  const formatRichHtml = (html: string) => {
    return html.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/gi, (_match, attributes, content) => {
      const symbol = getOperationSymbol(content, true);
      const symbolHtml = symbol
        ? `<span class="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-xl font-bold leading-none text-white shadow-sm">${symbol}</span>`
        : '';

      return `<h3${attributes} class="mb-4 flex items-center text-2xl font-bold text-gray-900 dark:text-white">${symbolHtml}<span>${content}</span></h3>`;
    });
  };

  const renderTopicIcon = (topicTitle: string, className = 'h-8 w-8') => {
    const symbol = getOperationSymbol(topicTitle);

    if (symbol) {
      return <span className="text-3xl font-bold leading-none">{symbol}</span>;
    }

    return <FiBookOpen className={className} />;
  };

  const imageBackMarker = '{img_back}';

  const getRelativeTime = (createdAt?: string) => {
    if (!createdAt) return 'ahora';

    const diffMinutes = Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `hace ${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);
    return `hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
  };

  const getAuthorPayload = () => ({
    name: user?.name || 'Usuario',
    userId: user?.id || user?._id || '',
    role: user?.role || 'Student',
    avatar: (user?.name || 'U').charAt(0).toUpperCase()
  });

  const mapReplyToQuestionReply = (reply: LearningReply): Reply => ({
    id: reply._id || reply.id || `${Date.now()}`,
    author: {
      name: reply.author?.name || 'Usuario',
      avatar: reply.author?.avatar || reply.author?.name?.charAt(0).toUpperCase() || 'U',
      role: reply.author?.role || 'Estudiante',
      timeAgo: getRelativeTime(reply.createdAt)
    },
    content: reply.content,
    likes: reply.likes || 0
  });

  const mapCommentToQuestion = (comment: LearningComment): Question => ({
    id: comment._id || comment.id || `${Date.now()}`,
    author: {
      name: comment.author?.name || 'Usuario',
      avatar: comment.author?.avatar || comment.author?.name?.charAt(0).toUpperCase() || 'U',
      role: comment.author?.role || 'Estudiante',
      timeAgo: getRelativeTime(comment.createdAt)
    },
    content: comment.content,
    likes: comment.likes || 0,
    replies: (comment.replies || []).map(mapReplyToQuestionReply)
  });

  const getStepMeta = (step = currentStep) => {
    const topics = diagnosticConfigs[0]?.topics || [];
    let cursor = 1;

    for (let index = 0; index < topics.length; index += 1) {
      const topic = topics[index];
      if (step === cursor) {
        return { topic, topicIndex: index, isExerciseStep: false };
      }

      cursor += 1;

      if (topicHasExercises(topic)) {
        if (step === cursor) {
          return { topic, topicIndex: index, isExerciseStep: true };
        }

        cursor += 1;
      }
    }

    return { topic: undefined, topicIndex: -1, isExerciseStep: false };
  };

  const getCurrentTopic = () => getStepMeta().topic;

  const getTopicId = (topic?: Topic) => {
    if (!topic) return '';

    return topic._id || topic.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .toUpperCase();
  };

  const getFallbackQuestions = (topicId: string) => {
    if (commentsByTopic[topicId]) {
      return commentsByTopic[topicId];
    }

    return [];
  };

  const loadTopicComments = async () => {
    const topic = getCurrentTopic();
    if (!topic) return;
    const topicId = getTopicId(topic);

    setLoadingComments(true);
    try {
      const comments = await learningCommentsService.getComments(resolvedParams.id, topicId);
      setCommentsByTopic((prev) => ({
        ...prev,
        [topicId]: comments.map(mapCommentToQuestion)
      }));
    } catch (error) {
      console.error('Error al cargar aportes:', error);
      setCommentsByTopic((prev) => ({
        ...prev,
        [topicId]: prev[topicId] || []
      }));
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreateContribution = async () => {
    const topic = getCurrentTopic();
    const content = contributionText.trim();

    if (!topic || !content || !user) return;
    const topicId = getTopicId(topic);

    const optimisticComment: Question = {
      id: `local-${Date.now()}`,
      author: {
        name: user.name,
        avatar: user.name.charAt(0).toUpperCase(),
        role: user.role,
        timeAgo: 'ahora'
      },
      content,
      likes: 0,
      replies: []
    };

    setContributionText('');
    setCommentsByTopic((prev) => ({
      ...prev,
      [topicId]: [optimisticComment, ...(prev[topicId] || [])]
    }));

    try {
      const createdComment = await learningCommentsService.createComment({
        learningId: resolvedParams.id,
        topicId,
        content,
        author: getAuthorPayload()
      });

      setCommentsByTopic((prev) => ({
        ...prev,
        [topicId]: (prev[topicId] || []).map((comment) =>
          comment.id === optimisticComment.id ? mapCommentToQuestion(createdComment) : comment
        )
      }));
    } catch (error) {
      console.error('Error al crear aporte:', error);
    }
  };

  const handleCreateReply = async (commentId: string | number) => {
    const topic = getCurrentTopic();
    const content = replyInputs[String(commentId)]?.trim();

    if (!topic || !content || !user) return;
    const topicId = getTopicId(topic);

    const optimisticReply: Reply = {
      id: `local-reply-${Date.now()}`,
      author: {
        name: user.name,
        avatar: user.name.charAt(0).toUpperCase(),
        role: user.role,
        timeAgo: 'ahora'
      },
      content,
      likes: 0
    };

    setReplyInputs((prev) => ({ ...prev, [String(commentId)]: '' }));
    setReplyingTo(null);
    setCommentsByTopic((prev) => ({
      ...prev,
      [topicId]: (prev[topicId] || []).map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, optimisticReply] } : comment
      )
    }));

    try {
      const createdReply = await learningCommentsService.createReply(String(commentId), {
        content,
        author: getAuthorPayload()
      });

      setCommentsByTopic((prev) => ({
        ...prev,
        [topicId]: (prev[topicId] || []).map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === optimisticReply.id ? mapReplyToQuestionReply(createdReply) : reply
                )
              }
            : comment
        )
      }));
    } catch (error) {
      console.error('Error al crear respuesta:', error);
    }
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

  const renderMathLayout = (text: string, blockKey: string, showSubtractionImage = false) => {
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
              <div
                key={`${blockKey}-plain-${sectionIndex}`}
                className="overflow-x-auto rounded-lg bg-gray-100 dark:bg-[#282828] p-4 font-mono text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h4]:mb-3 [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-orange-600 [&_h4]:dark:text-orange-400"
                dangerouslySetInnerHTML={{ __html: formatRichHtml(sectionText) }}
              />
            );
          }

          const headerColumns = ['C', 'D', 'U'];
          const rows = lines.slice(1).map((line) => parseMathRow(line, headerColumns.length));
          const lastRowIndex = rows.length - 1;
          const highlightedExplanationIndex = rows.reduce((lastIndex, row, rowIndex) => (
            row.explanation ? rowIndex : lastIndex
          ), -1);

          const shouldShowSubtractionImage = showSubtractionImage && sectionIndex === 0;

          return (
            <div
              key={`${blockKey}-section-${sectionIndex}`}
              className="overflow-x-auto rounded-xl border border-orange-100 bg-white p-5 shadow-sm dark:border-orange-500/20 dark:bg-[#242424]"
            >
              <div className={`${shouldShowSubtractionImage ? 'flex min-w-[560px] flex-col gap-6 lg:min-w-0 lg:flex-row lg:items-center lg:justify-between' : 'min-w-[560px]'} text-sm text-gray-700 dark:text-gray-200`}>
                <div className="min-w-[560px] flex-1 space-y-3 lg:min-w-0">
                  <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-6 items-start">
                    <div className="flex justify-end gap-7 rounded-t-lg bg-orange-50 px-4 py-3 font-mono font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {headerColumns.map((column) => (
                        <span key={column} className="w-4 text-center">
                          {column}
                        </span>
                      ))}
                    </div>
                    <div
                      className="whitespace-pre-wrap pt-2 font-medium text-gray-800 dark:text-gray-100 [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h4]:mb-3 [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-orange-600 [&_h4]:dark:text-orange-400"
                      dangerouslySetInnerHTML={{ __html: formatRichHtml(headerMatch[1]?.trim() ?? '') }}
                    />
                  </div>

                  {rows.map((row, rowIndex) => (
                    <div key={`${blockKey}-row-${sectionIndex}-${rowIndex}`} className="space-y-2">
                      {(() => {
                        const shouldHighlightExplanation = Boolean(
                          row.explanation &&
                          rowIndex === highlightedExplanationIndex &&
                          getPlainTextLength(row.explanation) >= 13
                        );

                        return (
                          <>
                            {rowIndex === lastRowIndex && rows.length > 1 && (
                              <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-6 items-start">
                                <div className="flex justify-end">
                                  <div className="w-[142px] border-t-2 border-gray-400 dark:border-gray-500" />
                                </div>
                                <div />
                              </div>
                            )}

                            <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-6 items-start">
                              <div className={`flex justify-end gap-7 px-4 font-mono ${rowIndex === lastRowIndex ? 'font-bold text-orange-600 dark:text-orange-400' : ''}`}>
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
                              <div className="flex gap-3 whitespace-pre-wrap leading-6">
                                {row.explanation && !shouldHighlightExplanation && (
                                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
                                    {rowIndex + 1}
                                  </span>
                                )}
                                {row.explanation && shouldHighlightExplanation ? (
                                  <div className="ml-auto flex max-w-[360px] items-center gap-4 rounded-xl bg-orange-50 px-5 py-3 font-semibold text-gray-800 shadow-sm dark:bg-orange-500/10 dark:text-gray-100">
                                    <FiArrowRight className="h-5 w-5 flex-shrink-0 text-orange-500" />
                                    <span dangerouslySetInnerHTML={{ __html: formatRichHtml(row.explanation) }} />
                                  </div>
                                ) : (
                                  <span dangerouslySetInnerHTML={{ __html: formatRichHtml(row.explanation) }} />
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>

                {shouldShowSubtractionImage && (
                  <div className="mx-auto w-44 flex-shrink-0 lg:w-56 xl:w-64">
                    <Image
                      src="/sustraccion-imagen-1.svg"
                      alt="Ejemplo visual de sustracción"
                      width={260}
                      height={210}
                      className="h-auto w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Función para validar respuestas del tema actual
  const hasHeadingMarkup = (text: string) => /<h[1-6][\s>]/i.test(text);

  const renderDesignedParagraphBlock = (text: string, blockKey: string, variantOffset = 0) => {
    if (hasHeadingMarkup(text)) {
      return (
        <div
          key={blockKey}
          className="max-w-4xl text-base leading-7 text-gray-700 dark:text-gray-300 whitespace-pre-line [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h4]:mb-3 [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-orange-600 [&_h4]:dark:text-orange-400"
          dangerouslySetInnerHTML={{ __html: formatRichHtml(text) }}
        />
      );
    }

    const paragraphs = text
      .replace(/\r/g, '')
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    const sectionStyles = [
      {
        shell: 'border-orange-100 bg-orange-50/80 dark:border-orange-500/20 dark:bg-orange-500/10',
        accent: 'bg-orange-500',
        icon: 'bg-orange-500 text-white',
        marker: 'bg-orange-500',
        text: 'text-gray-800 dark:text-gray-100'
      },
      {
        shell: 'border-violet-100 bg-violet-50/80 dark:border-violet-500/20 dark:bg-violet-500/10',
        accent: 'bg-violet-500',
        icon: 'bg-violet-500 text-white',
        marker: 'bg-violet-500',
        text: 'text-violet-950 dark:text-violet-50'
      },
      {
        shell: 'border-gray-100 bg-white dark:border-gray-700 dark:bg-[#242424]',
        accent: 'bg-gray-900 dark:bg-white',
        icon: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900',
        marker: 'bg-orange-500',
        text: 'text-gray-800 dark:text-gray-100'
      }
    ];
    const sectionStyle = sectionStyles[variantOffset % sectionStyles.length];
    const highlightParagraph = paragraphs[0];
    const supportingParagraphs = paragraphs.slice(1);

    return (
      <section
        key={blockKey}
        className={`max-w-5xl overflow-hidden rounded-xl border shadow-sm ${sectionStyle.shell}`}
      >
        <div className={`h-1.5 w-full ${sectionStyle.accent}`} />
        <div className="p-5 sm:p-6">
          <div className="flex gap-4">
            <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${sectionStyle.icon}`}>
              <FiBookOpen className="h-5 w-5" />
            </div>
            <div className={`min-w-0 flex-1 text-base leading-7 ${sectionStyle.text}`}>
              <p className="text-lg font-semibold leading-8" dangerouslySetInnerHTML={{ __html: formatRichHtml(highlightParagraph) }} />

              {supportingParagraphs.length > 0 && (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {supportingParagraphs.map((paragraph, paragraphIndex) => {
                    const lines = paragraph.split('\n').map((line) => line.trim()).filter(Boolean);
                    const shouldRenderLines = lines.length > 1;

                    return (
                      <div
                        key={`${blockKey}-support-${paragraphIndex}`}
                        className="rounded-lg border border-white/70 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-black/10"
                      >
                        {shouldRenderLines ? (
                          <div className="space-y-2">
                            {lines.map((line, lineIndex) => (
                              <div key={`${blockKey}-${paragraphIndex}-${lineIndex}`} className="flex gap-3">
                                <span className={`mt-3 h-2 w-2 flex-shrink-0 rounded-full ${sectionStyle.marker}`} />
                                <span dangerouslySetInnerHTML={{ __html: formatRichHtml(line) }} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p dangerouslySetInnerHTML={{ __html: formatRichHtml(paragraph) }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {paragraphs.length === 1 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="h-2 rounded-full bg-orange-200 dark:bg-orange-500/30" />
              <div className="h-2 rounded-full bg-white dark:bg-white/20" />
              <div className="h-2 rounded-full bg-violet-200 dark:bg-violet-500/30" />
            </div>
          )}
        </div>
      </section>
    );
  };

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
      const selectedLetter = indexToLetter(parseInt(userSelectedIndex));
      const selectedOption = exercise.options[parseInt(userSelectedIndex)] || selectedLetter;
      const selectedAnswer = `${selectedLetter.toLowerCase()}. ${selectedOption}`;
      const isCorrect = selectedLetter === exercise.correctAnswer;

      return {
        topicId: currentTopic._id,
        topicTitle: currentTopic.title,
        exerciseId: getExerciseId(currentTopic, index),
        userAnswer: selectedAnswer,
        correctAnswer: exercise.correctAnswer,
        isCorrect,
        options: exercise.options
      };
    });

    // Calcular estadísticas
    const correctAnswers = newAnswers.filter(answer => answer.isCorrect).length;
    const points = (correctAnswers / exercises.length) * 10;
    const percentage = (correctAnswers / exercises.length) * 100;

    const newSubject = {
      title: currentTopic.title,
      points: points,
      maxPoints: 10,
      percentage: percentage,
      N1: '0%',
      N2: '0%',
      N3: '0%',
      N4: '0%',
      answers: newAnswers.map(answer => ({
        exerciseId: answer.exerciseId,
        selectedAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect
      }))
    };

    const subjectsWithoutCurrent = results.subjects.filter((subject) => subject.title !== currentTopic.title);
    const nextResults = buildResultsFromSubjects([...subjectsWithoutCurrent, newSubject]);

    setResults(nextResults);

    setDiagnosticConfigs((prevConfigs) => prevConfigs.map((config) => ({
      ...config,
      topics: config.topics.map((topic) => (
        topic.title === currentTopic.title ? { ...topic, completed: true } : topic
      ))
    })));

    await submitLearningResult(nextResults);

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
              <div key={index} className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm dark:border-orange-500/20 dark:bg-[#282828]">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
                    {index + 1}
                  </span>
                  Ejercicio {index + 1}
                </h3>
                <p
                  className="mb-5 leading-7 text-gray-700 dark:text-gray-200"
                  dangerouslySetInnerHTML={{ __html: formatRichHtml(exercise.statement) }}
                />
                <div className="space-y-3">
                  {exercise.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-orange-50/30 px-4 py-3 dark:border-gray-700 dark:bg-orange-500/5">
                      <input
                        type="radio"
                        name={`exercise-${index}`}
                        id={`option-${index}-${optIndex}`}
                        value={option}
                        checked={selectedAnswers[index] === optIndex.toString()}
                        onChange={() => handleAnswerSelect(index, optIndex)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <label
                        htmlFor={`option-${index}-${optIndex}`}
                        className="text-black dark:text-gray-200"
                      >
                        <span dangerouslySetInnerHTML={{ __html: formatRichHtml(option) }} />
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

    const designedParagraphBlocks = (currentTopic.subtopics ?? []).flatMap((subtopic) =>
      (subtopic.blocks ?? []).filter((block) => {
        const rawBlockText = block.content?.text?.trim();
        const blockText = rawBlockText?.split(imageBackMarker).join('').trim();

        return block.type !== 'math_layout' && Boolean(blockText) && !hasHeadingMarkup(blockText || '');
      })
    );
    const totalDesignedParagraphBlocks = designedParagraphBlocks.length;
    let designedParagraphIndex = 0;

    return {
      title: currentTopic.title,
      content: (
        <div className="max-w-none space-y-8">
          {(currentTopic.subtopics ?? []).map((subtopic, subtopicIndex) => (
            <section key={`${currentTopic._id}-subtopic-${subtopicIndex}`} className="space-y-4">
              {subtopic.title && (
                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900">
                    <FiBookOpen className="h-5 w-5" />
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: formatRichHtml(subtopic.title) }} />
                </h3>
              )}

              {(subtopic.blocks ?? []).map((block, blockIndex) => {
                const rawBlockText = block.content?.text?.trim();
                const hasImageBackMarker = rawBlockText?.includes(imageBackMarker) ?? false;
                const blockText = rawBlockText?.split(imageBackMarker).join('').trim();

                if (!blockText) {
                  return null;
                }

                if (block.type === 'math_layout') {
                  const hasCurrentCDUHeader = hasCDUHeader(blockText);
                  const hasPreviousCDUBlock = (currentTopic.subtopics ?? []).some((previousSubtopic, previousSubtopicIndex) => {
                    if (previousSubtopicIndex > subtopicIndex) return false;

                    const blocksToCheck = previousSubtopicIndex === subtopicIndex
                      ? (previousSubtopic.blocks ?? []).slice(0, blockIndex)
                      : (previousSubtopic.blocks ?? []);

                    return blocksToCheck.some((previousBlock) => (
                      previousBlock.type === 'math_layout' &&
                      hasCDUHeader(previousBlock.content?.text?.trim() ?? '')
                    ));
                  });
                  const shouldShowSubtractionImage = hasImageBackMarker && hasCurrentCDUHeader && !hasPreviousCDUBlock;

                  return hasCurrentCDUHeader ? (
                    <div key={`${currentTopic._id}-math-${subtopicIndex}-${blockIndex}`}>
                      {renderMathLayout(blockText, `${currentTopic._id}-${subtopicIndex}-${blockIndex}`, shouldShowSubtractionImage)}
                    </div>
                  ) : (
                    <div
                      key={`${currentTopic._id}-math-${subtopicIndex}-${blockIndex}`}
                      className="overflow-x-auto rounded-xl border border-orange-100 bg-white p-4 font-mono text-sm text-gray-700 shadow-sm dark:border-orange-500/20 dark:bg-[#282828] dark:text-gray-200 whitespace-pre-wrap [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h4]:mb-3 [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-orange-600 [&_h4]:dark:text-orange-400"
                      dangerouslySetInnerHTML={{ __html: formatRichHtml(blockText) }}
                    />
                  );
                }

                const zoneIndex = hasHeadingMarkup(blockText) || totalDesignedParagraphBlocks === 0
                  ? 2
                  : Math.min(2, Math.floor((designedParagraphIndex * 3) / totalDesignedParagraphBlocks));

                if (!hasHeadingMarkup(blockText)) {
                  designedParagraphIndex += 1;
                }

                return renderDesignedParagraphBlock(
                  blockText,
                  `${currentTopic._id}-paragraph-${subtopicIndex}-${blockIndex}`,
                  zoneIndex
                );
              })}
            </section>
          ))}
        </div>
      )
    };
  };

  const { title, content } = getCurrentContent();
  const isCurrentExerciseStep = (currentStep % 2) === 0;
  const activeCommentsTab = isCurrentExerciseStep ? 'contributions' : commentsTab;
  const currentTopicForComments = getCurrentTopic();
  const currentTopicIdForComments = getTopicId(currentTopicForComments);
  const displayedComments = currentTopicIdForComments ? getFallbackQuestions(currentTopicIdForComments) : [];

  const getAverage = () => {
    if (results.subjects.length === 0) return 0;

    const sum = results.subjects.reduce((acc, subject) => acc + subject.points, 0);
    const sumMax = results.subjects.reduce((acc, subject) => acc + subject.maxPoints, 0);

    if (sumMax === 0) return 0;

    return ((sum / sumMax) * 5).toFixed(1);
  };

  const getSubjectGrade = (subject: ModuleResultsState['subjects'][number]) => {
    if (subject.maxPoints === 0) return 0;

    return (subject.points / subject.maxPoints) * 5;
  };

  // Actualizar la lógica de navegación
  const handleNext = async () => {
    const isExerciseStep = (currentStep % 2) === 0;

    if (isExerciseStep) {
      const success = await validateCurrentTopicAnswers();
      if (!success) return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      if (isExerciseStep) {
        setSelectedAnswers({});
      }
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
      const response = await chatService.sendChatMessages([userMessage], token, currentModule?.group);

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
            <div className="sticky top-0 z-50 h-16 bg-white/95 dark:bg-[#1C1D1F]/95 flex items-center justify-between px-6 text-black dark:text-white shadow-sm backdrop-blur">
              <div className="flex items-center">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{diagnosticConfigs.length > 0 ? diagnosticConfigs[0].title : 'Módulo'}</h1>
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
                    className="px-4 py-2 text-sm font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-500/15 dark:text-orange-300 dark:hover:bg-orange-500/25 rounded-md transition-colors"
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
                      : 'bg-orange-500 text-white hover:bg-orange-600'
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
                <div className="relative h-full bg-gray-100 dark:bg-[#1E1F25] p-8">
                  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
                    {fireworkEffects.bursts.map((burst) => (
                      <span
                        key={`rocket-${burst.id}`}
                        className="module-firework-rocket absolute top-[100vh] h-8 w-2 -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.95)]"
                        style={{
                          left: `${burst.left}%`,
                          animationDelay: `${burst.delay}s`,
                          ['--firework-travel' as string]: `-${burst.travel}vh`
                        }}
                      />
                    ))}
                    {fireworkEffects.bursts.map((burst) => (
                      <span
                        key={`trail-${burst.id}`}
                        className="module-firework-trail absolute top-[100vh] h-28 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-100 via-orange-400 to-transparent opacity-80"
                        style={{
                          left: `${burst.left}%`,
                          animationDelay: `${burst.delay}s`,
                          ['--firework-travel' as string]: `-${Math.max(16, burst.travel - 12)}vh`
                        }}
                      />
                    ))}
                    {fireworkEffects.bursts.map((burst) => (
                      <span
                        key={`flash-${burst.id}`}
                        className="module-firework-flash absolute top-[100vh] h-24 w-24 -translate-x-1/2 rounded-full bg-white"
                        style={{
                          left: `${burst.left}%`,
                          animationDelay: `${burst.delay + 0.74}s`,
                          ['--firework-travel' as string]: `-${burst.travel}vh`
                        }}
                      />
                    ))}
                    {fireworkEffects.sparks.map((spark) => (
                      <span
                        key={spark.id}
                        className="module-firework-spark absolute inline-block rounded-full"
                        style={{
                          left: `${spark.left}%`,
                          top: '100vh',
                          width: `${spark.length}px`,
                          height: `${spark.thickness}px`,
                          backgroundColor: spark.color,
                          backgroundImage: `linear-gradient(90deg, ${spark.color}, rgba(255,255,255,0.95), transparent)`,
                          boxShadow: `0 0 12px ${spark.color}, 0 0 28px ${spark.color}`,
                          animation: `module-firework-spark ${spark.duration}s cubic-bezier(0.16, 0.72, 0.26, 1) ${spark.delay}s forwards`,
                          ['--firework-burst-x' as string]: `${spark.burstX}px`,
                          ['--firework-burst-y' as string]: `${spark.burstY}px`,
                          ['--firework-travel' as string]: `-${spark.travel}vh`,
                          ['--firework-angle' as string]: `${spark.angle}deg`
                        }}
                      />
                    ))}
                    <style>{`
                      .module-firework-rocket {
                        animation: module-firework-rocket 0.95s cubic-bezier(0.18, 0.72, 0.2, 1) forwards;
                      }

                      .module-firework-trail {
                        animation: module-firework-trail 0.95s cubic-bezier(0.18, 0.72, 0.2, 1) forwards;
                      }

                      .module-firework-flash {
                        animation: module-firework-flash 0.95s ease-out forwards;
                        filter: blur(1px);
                        opacity: 0;
                      }

                      @keyframes module-firework-rocket {
                        0% {
                          transform: translate3d(-50%, 0, 0) scaleY(1);
                          opacity: 1;
                        }
                        82% {
                          transform: translate3d(-50%, var(--firework-travel), 0) scaleY(1);
                          opacity: 1;
                        }
                        to {
                          transform: translate3d(-50%, var(--firework-travel), 0) scale(2.4);
                          opacity: 0;
                        }
                      }

                      @keyframes module-firework-trail {
                        0% {
                          transform: translate3d(-50%, 0, 0) scaleY(0.4);
                          opacity: 0.9;
                        }
                        75% {
                          transform: translate3d(-50%, var(--firework-travel), 0) scaleY(1.15);
                          opacity: 0.65;
                        }
                        to {
                          transform: translate3d(-50%, var(--firework-travel), 0) scaleY(0.1);
                          opacity: 0;
                        }
                      }

                      @keyframes module-firework-flash {
                        0% {
                          transform: translate3d(-50%, var(--firework-travel), 0) scale(0.1);
                          opacity: 0;
                          box-shadow: 0 0 0 rgba(255, 255, 255, 0);
                        }
                        18% {
                          transform: translate3d(-50%, var(--firework-travel), 0) scale(1.25);
                          opacity: 0.95;
                          box-shadow: 0 0 34px rgba(255, 255, 255, 0.98), 0 0 90px rgba(56, 189, 248, 0.7), 0 0 140px rgba(249, 115, 22, 0.55);
                        }
                        to {
                          transform: translate3d(-50%, var(--firework-travel), 0) scale(4.8);
                          opacity: 0;
                          box-shadow: 0 0 120px rgba(255, 255, 255, 0.8), 0 0 220px rgba(56, 189, 248, 0.45);
                        }
                      }

                      @keyframes module-firework-spark {
                        0% {
                          transform: translate3d(0, 0, 0) rotate(var(--firework-angle)) scaleX(0.05);
                          opacity: 0;
                        }
                        36% {
                          transform: translate3d(0, var(--firework-travel), 0) rotate(var(--firework-angle)) scaleX(0.05);
                          opacity: 0;
                        }
                        42% {
                          transform: translate3d(0, var(--firework-travel), 0) rotate(var(--firework-angle)) scaleX(0.35);
                          opacity: 1;
                        }
                        to {
                          transform: translate3d(var(--firework-burst-x), calc(var(--firework-travel) + var(--firework-burst-y)), 0) rotate(var(--firework-angle)) scaleX(1);
                          opacity: 0;
                        }
                      }
                    `}</style>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resultados del Módulo</h2>

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
                          {results.subjects.map((subject, index) => {
                            const subjectGrade = getSubjectGrade(subject);

                            return (
                              <tr key={index} className="hover:bg-[#323232] transition-colors">
                                <td className="px-6 py-4 text-white">{subject.title}</td>
                                <td className="px-6 py-4 text-white">{Math.round(subject.points)}</td>
                                <td className="px-6 py-4 text-white">{subject.maxPoints}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-sm ${subjectGrade >= 3.5 ? 'bg-green-500/20 text-green-400' :
                                    subjectGrade >= 2.5 ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                    {subjectGrade.toFixed(1)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
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
                          <p className="text-2xl font-bold text-white">{getAverage()}</p>
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
                  <div className={`bg-[#fbfbfb] dark:bg-[#1E1F25] overflow-y-auto ${isSupportPanelOpen ? 'h-[55%] lg:h-full lg:w-[64%] 2xl:w-[70%]' : 'h-full lg:w-[calc(100%-4rem)]'}`}>
                    <div className="mx-auto max-w-5xl p-6 lg:p-8">
                      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-5">
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                            {renderTopicIcon(title)}
                          </div>
                          <div>
                            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-white">{title}</h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                              Aprende con ejemplos guiados y resuelve cada paso con el metodo Fedor.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-black dark:text-gray-200 text-base md:text-lg">
                        {content}
                      </div>
                    </div>
                  </div>

                  {/* Sección de Comentarios */}
                  <div className={`bg-white dark:bg-[#1E1F25] border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 lg:h-full lg:border-l lg:border-t-0 ${isSupportPanelOpen ? 'h-[45%] lg:w-[36%] 2xl:w-[30%]' : 'h-auto lg:w-16'}`}>
                    {!isSupportPanelOpen ? (
                      <div className="flex h-full items-center justify-center p-3 lg:p-2">
                        <button
                          type="button"
                          onClick={() => setIsSupportPanelOpen(true)}
                          aria-expanded={isSupportPanelOpen}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-500/15 dark:text-orange-300 dark:hover:bg-orange-500/25 lg:h-full lg:flex-col lg:px-2"
                        >
                          <FiChevronLeft className="hidden h-5 w-5 lg:block" />
                          <FiChevronDown className="h-5 w-5 lg:hidden" />
                          <span className="lg:[writing-mode:vertical-rl] lg:rotate-180">Ayuda y aportes</span>
                        </button>
                      </div>
                    ) : (
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
                        <button
                          type="button"
                          onClick={() => setIsSupportPanelOpen(false)}
                          aria-expanded={isSupportPanelOpen}
                          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#282828] dark:hover:text-white"
                          aria-label="Cerrar panel de ayuda y aportes"
                        >
                          <FiChevronRight className="hidden h-5 w-5 lg:block" />
                          <FiChevronDown className="h-5 w-5 rotate-180 lg:hidden" />
                        </button>
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
                              value={contributionText}
                              onChange={(e) => setContributionText(e.target.value)}
                              placeholder="Escribe tu comentario o pregunta"
                              className="w-full bg-gray-100 dark:bg-[#282828] text-black dark:text-white rounded-lg p-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg"
                            ></textarea>
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={handleCreateContribution}
                                disabled={!contributionText.trim() || !currentTopicForComments}
                                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Publicar aporte
                              </button>
                            </div>
                          </div>

                          {/* Lista de comentarios actualizada según el paso actual */}
                          <div className="space-y-6">
                            {loadingComments && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">Cargando aportes...</p>
                            )}
                            {displayedComments.map((comment) => (
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
                                      <button
                                        type="button"
                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                        className="text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                      >
                                        Responder
                                      </button>
                                    </div>
                                    {replyingTo === comment.id && (
                                      <div className="mt-3 space-y-2">
                                        <textarea
                                          value={replyInputs[String(comment.id)] || ''}
                                          onChange={(e) => setReplyInputs((prev) => ({ ...prev, [String(comment.id)]: e.target.value }))}
                                          placeholder="Escribe tu respuesta"
                                          className="w-full rounded-lg bg-gray-100 p-3 text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#282828] dark:text-white"
                                          rows={2}
                                        />
                                        <div className="flex justify-end gap-2">
                                          <button
                                            type="button"
                                            onClick={() => setReplyingTo(null)}
                                            className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#282828]"
                                          >
                                            Cancelar
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleCreateReply(comment.id)}
                                            disabled={!replyInputs[String(comment.id)]?.trim()}
                                            className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            Responder
                                          </button>
                                        </div>
                                      </div>
                                    )}
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
                    )}
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


