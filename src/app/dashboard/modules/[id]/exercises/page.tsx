'use client';

import { useState, useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { use } from 'react';
import Sidebar from '@/components/Sidebar';
import { DiagnosticConfig } from '@/types/diagnostic.types';
import { authService } from '@/services/auth.service';
import { chatService } from '@/services/chat.service';
import { FiArrowRight, FiBookOpen, FiChevronLeft, FiChevronRight, FiChevronDown, FiX, FiSend, FiShuffle, FiPlus, FiMic, FiCheckCircle, FiGrid, FiHash, FiInfo, FiLayers, FiTarget, FiZap } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/components/ui/tooltip';
import { User } from '@/types/auth.types';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Module, moduleService } from '@/services/module.service';
import { useModuleAccess } from '@/contexts/ModuleAccessContext';
import { LearningResult, learningResultsService } from '@/services/learning-results.service';
import { LearningComment, LearningReply, learningCommentsService } from '@/services/learning-comments.service';

type FireworkStyle = CSSProperties & Record<`--${string}`, string>;

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

const Book123Icon = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 md:w-16 md:h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="15" width="55" height="70" rx="6" fill="#4F46E5" />
    <path d="M75 20h4v60h-4z" fill="#E2E8F0" />
    <path d="M79 23h3v54h-3z" fill="#CBD5E1" />
    <rect x="18" y="15" width="6" height="70" rx="3" fill="#3730A3" />
    <line x1="20" y1="28" x2="20" y2="72" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
    <path d="M35 15v25l6-4 6 4V15" fill="#EF4444" />
    <text x="47" y="62" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">123</text>
  </svg>
);

const FloatingBannerNumbers = () => (
  <div className="relative w-40 h-28 hidden md:block select-none overflow-visible">
    <span className="absolute text-5xl font-extrabold text-white/20 dark:text-white/10 rotate-[-12deg] left-2 top-8 blur-[0.5px]">1</span>
    <span className="absolute text-6xl font-extrabold text-orange-200/90 rotate-[-12deg] left-0 top-6 animate-bounce" style={{ animationDuration: '3s' }}>1</span>
    <span className="absolute text-7xl font-extrabold text-indigo-300/90 rotate-[15deg] left-14 top-2 animate-pulse" style={{ animationDuration: '4s' }}>2</span>
    <span className="absolute text-6xl font-extrabold text-amber-300 rotate-[-8deg] left-28 top-8 hover:scale-110 transition-transform">3</span>
    <svg className="absolute right-0 top-0 w-6 h-6 text-amber-200 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
    <svg className="absolute left-10 top-0 w-4 h-4 text-orange-300 animate-ping" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  </div>
);

const OrangeStarIcon = () => (
  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/20">
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  </div>
);

const MedalBadge = () => (
  <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center overflow-visible">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute w-28 h-28 rounded-full border border-dashed border-amber-300/30 animate-spin" style={{ animationDuration: '10s' }} />
    </div>
    <svg className="absolute w-12 h-16 top-10" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 0 L10 80 L35 70 Z" fill="#6366F1" />
      <path d="M75 0 L90 80 L65 70 Z" fill="#4F46E5" />
    </svg>
    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center shadow-lg border-2 border-amber-200">
      <div className="w-12 h-12 rounded-full border border-amber-100/50 flex items-center justify-center">
        <span className="text-2xl font-black text-amber-900">2</span>
      </div>
    </div>
  </div>
);

const PurpleLightbulbIcon = () => (
  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8M12 3a7 7 0 00-7 7c0 2.76 1.7 5.12 4.07 6.09A3 3 0 0110 19h4a3 3 0 011.83-2.91C18.3 15.12 20 12.76 20 10a7 7 0 00-7-7z" />
    </svg>
  </div>
);

const EnterosIcon = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 md:w-16 md:h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="15" width="55" height="70" rx="6" fill="#6366F1" />
    <path d="M75 20h4v60h-4z" fill="#E2E8F0" />
    <rect x="18" y="15" width="6" height="70" rx="3" fill="#4F46E5" />
    <line x1="20" y1="28" x2="20" y2="72" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
    <text x="47" y="48" fill="#FFFFFF" fontSize="20" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">±Z</text>
    <text x="47" y="68" fill="#C7D2FE" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">{"{-2, 0, 3}"}</text>
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FloatingBannerEnteros = () => (
  <div className="relative w-40 h-28 hidden md:block select-none overflow-visible">
    <span className="absolute text-5xl font-extrabold text-white/20 dark:text-white/10 rotate-[-12deg] left-2 top-8 blur-[0.5px]">Z</span>
    <span className="absolute text-6xl font-extrabold text-emerald-200/90 rotate-[-12deg] left-0 top-6 animate-bounce" style={{ animationDuration: '3s' }}>-5</span>
    <span className="absolute text-7xl font-extrabold text-indigo-200/90 rotate-[15deg] left-14 top-2 animate-pulse" style={{ animationDuration: '4s' }}>+3</span>
    <span className="absolute text-6xl font-extrabold text-amber-200 rotate-[-8deg] left-28 top-8 hover:scale-110 transition-transform">0</span>
    <svg className="absolute right-0 top-0 w-6 h-6 text-indigo-200 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  </div>
);

const NumberLineSVG = ({ a, b, c, indexStr }: { a: number; b: number; c: number; indexStr: string }) => {
  // Determine bounds
  let minVal = -6;
  let maxVal = 6;
  let step = 1;

  const maxAbs = Math.max(Math.abs(a), Math.abs(c));
  const isMultipleOf10 = (a % 10 === 0 && a !== 0) || (b % 10 === 0 && b !== 0) || (c % 10 === 0 && c !== 0);

  if (isMultipleOf10 || maxAbs > 12) {
    minVal = -60;
    maxVal = 60;
    step = 10;
  } else if (maxAbs > 6) {
    minVal = -12;
    maxVal = 12;
    step = 2;
  }

  const getX = (val: number) => {
    const pct = (val - minVal) / (maxVal - minVal);
    return 40 + pct * 420; // total axis length is 420, padding left is 40, right padding is 40 (500 - 40 - 40)
  };

  // Ticks list
  const ticks: number[] = [];
  for (let v = minVal; v <= maxVal; v += step) {
    ticks.push(v);
  }

  // Coordinates for vectors
  const x0 = getX(0);
  const xA = getX(a);
  const xC = getX(c);

  // Arrow colors
  const isPositive = c >= 0;
  const stepColor = isPositive ? "#10B981" : "#F43F5E"; // emerald-500 or rose-500
  
  // Draw paths for arc transitions
  // Arc 1 (0 -> A)
  const arc1Height = 20;
  const arc1D = a !== 0 
    ? `M ${x0} 70 Q ${(x0 + xA) / 2} ${70 - arc1Height} ${xA} 70`
    : "";

  // Arc 2 (A -> C)
  const arc2Height = 35;
  const arc2D = `M ${xA} 70 Q ${(xA + xC) / 2} ${70 - arc2Height} ${xC} 70`;

  return (
    <svg viewBox="0 0 500 125" className="w-full h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Arrow markers */}
        <marker id={`arrow-left-${indexStr}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 10 2 L 2 5 L 10 8 Z" fill="#9CA3AF" />
        </marker>
        <marker id={`arrow-right-${indexStr}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 2 L 8 5 L 0 8 Z" fill="#9CA3AF" />
        </marker>
        <marker id={`arrow-indigo-${indexStr}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 2 L 8 5 L 0 8 Z" fill="#818CF8" />
        </marker>
        <marker id={`arrow-emerald-${indexStr}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 2 L 8 5 L 0 8 Z" fill="#10B981" />
        </marker>
        <marker id={`arrow-rose-${indexStr}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 2 L 8 5 L 0 8 Z" fill="#F43F5E" />
        </marker>
      </defs>

      {/* Main Number Line Axis */}
      <line 
        x1={25} 
        y1={75} 
        x2={475} 
        y2={75} 
        stroke="#9CA3AF" 
        strokeWidth={2} 
        markerStart={`url(#arrow-left-${indexStr})`}
        markerEnd={`url(#arrow-right-${indexStr})`}
      />

      {/* Draw Ticks & Labels */}
      {ticks.map((val, idx) => {
        const x = getX(val);
        const isZero = val === 0;
        return (
          <g key={idx}>
            <line 
              x1={x} 
              y1={70} 
              x2={x} 
              y2={80} 
              stroke={isZero ? "#4B5563" : "#D1D5DB"} 
              strokeWidth={isZero ? 2 : 1.5} 
            />
            <text
              x={x}
              y={96}
              fontSize={11}
              fontFamily="sans-serif"
              fontWeight={isZero ? "bold" : "normal"}
              textAnchor="middle"
              className={isZero ? "fill-gray-800 dark:fill-gray-200" : "fill-gray-400 dark:fill-gray-500"}
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Draw Arc 1 (0 to A) - Dashed Indigo Arc */}
      {a !== 0 && (
        <path 
          d={arc1D} 
          stroke="#818CF8" 
          strokeWidth={2} 
          strokeDasharray="4 3" 
          markerEnd={`url(#arrow-indigo-${indexStr})`}
        />
      )}

      {/* Draw Arc 2 (A to C) - Solid Color Arc (Emerald/Rose) */}
      <path 
        d={arc2D} 
        stroke={stepColor} 
        strokeWidth={2.5} 
        markerEnd={isPositive ? `url(#arrow-emerald-${indexStr})` : `url(#arrow-rose-${indexStr})`}
      />
      
      {/* Highlight points on the line */}
      {a !== 0 && <circle cx={xA} cy={75} r={3} fill="#4F46E5" />}
      <circle cx={xC} cy={75} r={3.5} fill={stepColor} />
      <circle cx={x0} cy={75} r={3} fill="#4B5563" />
    </svg>
  );
};

const DivisionIcon = () => (
  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/20">
    <span className="text-2xl font-extrabold leading-none">÷</span>
  </div>
);

const SearchIcon = () => (
  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ClipboardChecklistIcon = () => (
  <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
    <div className="w-12 h-14 bg-amber-50 dark:bg-[#282828] border-2 border-amber-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col items-center justify-center p-2">
      <div className="absolute top-1 w-5 h-2 bg-amber-400 dark:bg-amber-600 rounded-sm"></div>
      <div className="space-y-1 w-full mt-1.5 px-1">
        <div className="h-1 bg-green-500 rounded-full w-[60%]"></div>
        <div className="h-1 bg-green-500 rounded-full w-[80%]"></div>
        <div className="h-1 bg-green-500 rounded-full w-[40%]"></div>
      </div>
    </div>
    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-[#1E1F25] flex items-center justify-center shadow-md">
      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
);

interface DivisorStep {
  stepNumber: number;
  formula: string;
  listText: string;
  description: string;
}

interface DivisorExampleData {
  N: number;
  steps: DivisorStep[];
  endingText: string;
}

const getDivisors = (num: number): number[] => {
  const divs: number[] = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      divs.push(i);
    }
  }
  return divs;
};

const parseDivisorsBlock = (blockText: string): DivisorExampleData[] => {
  const parts = blockText.split(/Hallar los divisores de\s*:\s*/i);
  const examples: DivisorExampleData[] = [];

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].trim();
    const targetNumMatch = part.match(/^(\d+)/);
    if (!targetNumMatch) continue;
    const N = parseInt(targetNumMatch[1]);

    const stepRegex = /\b(\d+)\.\s*(\([^)]+\))?\s*\{([^}]+)\}/g;
    const steps: DivisorStep[] = [];
    const matches: { index: number; length: number; stepNumber: number; formula: string; listText: string }[] = [];
    let match;

    stepRegex.lastIndex = 0;
    while ((match = stepRegex.exec(part)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        stepNumber: parseInt(match[1]),
        formula: match[2] ? match[2].trim() : '',
        listText: match[3].trim()
      });
    }

    const headerOffset = targetNumMatch[0].length;

    for (let j = 0; j < matches.length; j++) {
      const currentMatch = matches[j];
      const prevEnd = j === 0 ? headerOffset : matches[j - 1].index + matches[j - 1].length;
      let description = part.substring(prevEnd, currentMatch.index).trim();

      description = description.replace(/^[.,\s]+/, '').trim();

      steps.push({
        stepNumber: currentMatch.stepNumber,
        formula: currentMatch.formula,
        listText: currentMatch.listText,
        description: description
      });
    }

    if (steps.length > 1 && steps[0].description && steps.slice(1).every(s => !s.description)) {
      const desc = steps[0].description;
      const subparts = desc.split(/\b[Ll]uego\b/);
      if (subparts.length === steps.length) {
        steps[0].description = subparts[0].trim();
        for (let j = 1; j < steps.length; j++) {
          steps[j].description = 'Luego ' + subparts[j].trim();
        }
      }
    }

    const lastMatchEnd = matches.length > 0 
      ? matches[matches.length - 1].index + matches[matches.length - 1].length 
      : headerOffset;
    let endingText = part.substring(lastMatchEnd).trim();
    endingText = endingText.replace(/^[.,\s]+/, '').trim();

    examples.push({
      N,
      steps,
      endingText
    });
  }

  return examples;
};


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
    if (!diagnosticConfigs[0]?.topics?.length || !getStepMeta().isExerciseStep) return;

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

  const getTopicStartStep = (topicIndex: number) => {
    const topics = diagnosticConfigs[0]?.topics || [];
    return topics.slice(0, topicIndex).reduce((step, topic) => (
      step + (topicHasExercises(topic) ? 2 : 1)
    ), 1);
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

  type EducationalSegment = {
    kind: 'heading' | 'paragraph' | 'listItem';
    level?: 1 | 2 | 3;
    html: string;
  };

  const decodeBasicEntities = (value: string) => value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  const stripHtmlTags = (value: string) => decodeBasicEntities(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );

  const splitPlainEducationalSegments = (value: string): EducationalSegment[] => {
    const normalized = stripHtmlTags(value);
    if (!normalized) return [];

    const lines = normalized
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      return [{ kind: 'paragraph', html: normalized }];
    }

    return lines.map((line) => ({
      kind: /^\d+[\.\)]\s+/.test(line) ? 'listItem' : 'paragraph',
      html: line
    }));
  };

  const getEducationalSegments = (value: string): EducationalSegment[] => {
    const prepared = value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?(ul|ol|div)[^>]*>/gi, '\n');
    const blockRegex = /<(h[1-3]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
    const segments: EducationalSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(prepared)) !== null) {
      const before = prepared.slice(lastIndex, match.index);
      segments.push(...splitPlainEducationalSegments(before));

      const tag = match[1].toLowerCase();
      const html = match[2].trim();
      if (html) {
        if (tag.startsWith('h')) {
          segments.push({
            kind: 'heading',
            level: Number(tag.slice(1)) as 1 | 2 | 3,
            html
          });
        } else {
          segments.push({
            kind: tag === 'li' ? 'listItem' : 'paragraph',
            html
          });
        }
      }

      lastIndex = blockRegex.lastIndex;
    }

    segments.push(...splitPlainEducationalSegments(prepared.slice(lastIndex)));

    return segments.filter((segment) => stripHtmlTags(segment.html).length > 0);
  };

  const isHeadingLikeText = (value: string) => {
    const plain = stripHtmlTags(value);
    const normalized = normalizeText(plain);
    const words = plain.split(/\s+/).filter(Boolean);
    const knownHeading = /(division|teoria de numeros|numeros enteros|multiplicacion|divisibilidad|adicion|sustraccion|numero primo|numero compuesto|recta numerica|actividad|ejercicios?)/i.test(normalized);

    return plain.length <= 54
      && words.length <= 6
      && !/[.:;!?]$/.test(plain)
      && (knownHeading || /^[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ\s-]+$/.test(plain));
  };

  const extractNumbers = (value: string) => (
    stripHtmlTags(value).match(/-?\d+(?:[.,]\d+)?/g) ?? []
  );

  const isPrimeSequence = (value: string) => {
    const plain = stripHtmlTags(value);
    const numbers = plain.match(/\d+/g)?.map(Number) ?? [];
    const compactText = plain.replace(/[\d,\s;]/g, '').trim();
    const primeAnchors = [2, 3, 5, 7, 11, 13].filter((prime) => numbers.includes(prime)).length;

    return numbers.length >= 5 && primeAnchors >= 4 && compactText.length <= 4;
  };

  const getDefinitionParts = (value: string) => {
    const plain = stripHtmlTags(value);
    const match = plain.match(/^([^:\n]{3,60}):\s*(Es|Son|Se llama|Corresponde|Representa|Indica)\b([\s\S]*)/i);
    if (!match) return null;

    return {
      term: match[1].trim(),
      definition: `${match[2]}${match[3]}`.trim()
    };
  };

  const getExampleParts = (value: string) => {
    const plain = stripHtmlTags(value);
    const match = plain.match(/\b(Ejemplo|Ejemplos|Por ejemplo)\s*:?\s*([\s\S]*)/i);
    if (!match) return null;

    return {
      label: match[1],
      body: match[2]?.trim() || plain
    };
  };

  const getLongDivisionParts = (value: string) => {
    const plain = stripHtmlTags(value);
    const match = plain.match(/\b(\d{2,})\s*(?:÷|\/|entre)\s*(\d{1,3})\b/i);
    if (!match) return null;

    const dividend = Number(match[1]);
    const divisor = Number(match[2]);
    if (!divisor) return null;

    return {
      dividend,
      divisor,
      quotient: Math.floor(dividend / divisor),
      residue: dividend % divisor
    };
  };

  const getOperationMatch = (value: string) => {
    const plain = stripHtmlTags(value);
    return plain.match(/\b-?\d+(?:[.,]\d+)?\s*(?:\+|-|x|X|\*|÷|\/)\s*-?\d+(?:[.,]\d+)?(?:\s*=\s*-?\d+(?:[.,]\d+)?)?\b/);
  };

  const getDivisibilityRules = (value: string) => {
    const plain = stripHtmlTags(value);
    const rules = plain.match(/Divisible\s+por\s+(2|3|5|10)[^\n.]*/gi) ?? [];
    return Array.from(new Set(rules.map((rule) => rule.trim())));
  };

  const renderEducationalHeading = (html: string, level: 1 | 2 | 3, key: string) => {
    const plain = stripHtmlTags(html);
    const symbol = getOperationSymbol(plain);

    if (level === 1) {
      return (
        <section key={key} className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-purple-500 p-6 text-white shadow-xl shadow-orange-500/20 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Leccion
              </span>
              <h3 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                {plain}
              </h3>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl font-black shadow-inner">
              {symbol || <FiBookOpen className="h-8 w-8" />}
            </div>
          </div>
        </section>
      );
    }

    if (level === 2) {
      return (
        <div key={key} className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm dark:border-orange-500/20 dark:bg-[#282828]">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
            {symbol || <FiLayers className="h-5 w-5" />}
          </span>
          <h3 className="text-2xl font-extrabold leading-tight text-slate-800 dark:text-white">
            {plain}
          </h3>
        </div>
      );
    }

    return (
      <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#282828]">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/15">
            {symbol || <FiBookOpen className="h-5 w-5" />}
          </span>
          <h4 className="text-xl font-bold text-slate-800 dark:text-white">{plain}</h4>
        </div>
      </div>
    );
  };

  const renderDefinitionCard = (term: string, definition: string, key: string) => (
    <div key={key} className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm dark:border-orange-500/20 dark:bg-orange-500/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm dark:bg-[#282828]">
          <FiInfo className="h-6 w-6" />
        </div>
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-500 shadow-sm dark:bg-[#282828]">
            Definicion
          </span>
          <h4 className="text-xl font-extrabold text-slate-800 dark:text-white">{term}</h4>
          <p className="text-base leading-7 text-slate-600 dark:text-gray-200">{definition}</p>
        </div>
      </div>
    </div>
  );

  const renderExampleCard = (label: string, body: string, key: string) => (
    <div key={key} className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-500/20 dark:bg-[#282828]">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-md shadow-blue-500/20">
          <FiZap className="h-5 w-5" />
        </span>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-blue-500">{label}</span>
          <h4 className="text-lg font-bold text-slate-800 dark:text-white">Mira el patron</h4>
        </div>
      </div>
      <div
        className="rounded-2xl bg-blue-50 p-4 font-medium leading-7 text-slate-700 dark:bg-blue-500/10 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: formatRichHtml(body) }}
      />
    </div>
  );

  const renderNumberedStepper = (items: string[], key: string, asActivity = false) => (
    <div key={key} className={asActivity ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
      {items.map((item, index) => {
        const clean = item.replace(/^\d+[\.\)]\s*/, '').trim();
        return (
          <div key={`${key}-${index}`} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-[#282828]">
            <div className="flex gap-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-extrabold text-white shadow-md shadow-orange-500/20">
                {index + 1}
              </span>
              <div className="min-w-0">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-orange-500">
                  {asActivity ? 'Practica' : 'Paso'}
                </span>
                <div
                  className="text-base leading-7 text-slate-700 dark:text-gray-200"
                  dangerouslySetInnerHTML={{ __html: formatRichHtml(clean) }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMathOperationCard = (html: string, key: string) => {
    const plain = stripHtmlTags(html);
    const operation = getOperationMatch(plain)?.[0] ?? plain;

    return (
      <div key={key} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm dark:border-orange-500/20 dark:bg-[#282828]">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <FiHash className="h-5 w-5" />
          </span>
          <h4 className="text-lg font-bold text-slate-800 dark:text-white">Operacion matematica</h4>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-slate-900 px-5 py-4 font-mono text-2xl font-extrabold text-white shadow-inner">
          {operation}
        </div>
        {plain !== operation && (
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-gray-300">{plain.replace(operation, '').trim()}</p>
        )}
      </div>
    );
  };

  const renderLongDivisionCard = (parts: NonNullable<ReturnType<typeof getLongDivisionParts>>, key: string) => (
    <div key={key} className="rounded-3xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-6 shadow-sm dark:border-purple-500/20 dark:from-[#282828] dark:to-purple-500/10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500 text-xl font-black text-white">/</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-purple-500">Division larga</span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">{parts.dividend} entre {parts.divisor}</h4>
          </div>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700 dark:bg-green-500/15 dark:text-green-300">
          Residuo {parts.residue}
        </span>
      </div>
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div className="rounded-2xl bg-white p-5 font-mono text-2xl font-black text-slate-800 shadow-inner dark:bg-[#1E1F25] dark:text-white">
          <div className="flex justify-end pr-3 text-orange-500">{parts.quotient}</div>
          <div className="flex items-start">
            <span className="pr-2">{parts.divisor}</span>
            <span className="border-l-2 border-t-2 border-slate-800 pl-3 dark:border-white">{parts.dividend}</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            `Busca cuantas veces cabe ${parts.divisor} en ${parts.dividend}.`,
            `Multiplica ${parts.divisor} x ${parts.quotient}.`,
            `Resta y verifica el residuo: ${parts.residue}.`
          ].map((step, index) => (
            <div key={`${key}-step-${index}`} className="flex gap-3 rounded-2xl bg-white p-3 text-sm font-medium text-slate-700 shadow-sm dark:bg-[#1E1F25] dark:text-gray-200">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">{index + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrimeChips = (html: string, key: string) => {
    const numbers = extractNumbers(html);

    return (
      <div key={key} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm dark:border-orange-500/20 dark:bg-[#282828]">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <FiGrid className="h-5 w-5" />
          </span>
          <h4 className="text-lg font-bold text-slate-800 dark:text-white">Numeros primos</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {numbers.map((number, index) => (
            <span key={`${key}-${number}-${index}`} className="rounded-full bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-600 shadow-sm ring-1 ring-orange-100 transition-transform hover:-translate-y-0.5 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/20">
              {number}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderDivisibilityCards = (rules: string[], key: string) => (
    <div key={key} className="grid gap-4 md:grid-cols-3">
      {rules.map((rule, index) => (
        <div key={`${key}-${index}`} className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-500/20 dark:bg-[#282828]">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white">
            <FiCheckCircle className="h-5 w-5" />
          </span>
          <h4 className="text-lg font-extrabold text-slate-800 dark:text-white">{rule}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400">Regla rapida para verificar multiplos sin hacer toda la division.</p>
        </div>
      ))}
    </div>
  );

  const renderNumberLineVisual = (html: string, key: string) => (
    <div key={key} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#282828]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-white dark:bg-white dark:text-slate-800">
          <FiTarget className="h-5 w-5" />
        </span>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-orange-500">Recta numerica</span>
          <h4 className="text-lg font-bold text-slate-800 dark:text-white">Negativos, cero y positivos</h4>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-slate-50 p-5 dark:bg-[#1E1F25]">
        <div className="relative min-w-[520px] py-8">
          <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-300 dark:bg-gray-600" />
          <div className="relative grid grid-cols-11 gap-2">
            {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((number) => (
              <div key={`${key}-${number}`} className="flex flex-col items-center gap-2">
                <span className={`h-4 w-4 rounded-full ${number < 0 ? 'bg-blue-500' : number > 0 ? 'bg-green-500' : 'bg-orange-500'} shadow-sm`} />
                <span className="text-sm font-bold text-slate-600 dark:text-gray-300">{number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-gray-300">{stripHtmlTags(html)}</p>
    </div>
  );

  const renderComparisonGrid = (items: string[], key: string) => (
    <div key={key} className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => {
        const [label, ...rest] = item.split(':');
        return (
          <div key={`${key}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#282828]">
            <span className="mb-2 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-500 dark:bg-orange-500/15">
              {label.trim()}
            </span>
            <p className="text-sm leading-6 text-slate-600 dark:text-gray-300">{rest.join(':').trim()}</p>
          </div>
        );
      })}
    </div>
  );

  const renderParagraphCard = (html: string, key: string) => (
    <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#282828]">
      <div className="flex gap-4">
        <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/15">
          <FiBookOpen className="h-4 w-4" />
        </span>
        <div
          className="min-w-0 text-base leading-8 text-slate-600 dark:text-gray-200 [&_strong]:font-extrabold [&_strong]:text-slate-800 [&_strong]:dark:text-white"
          dangerouslySetInnerHTML={{ __html: formatRichHtml(html) }}
        />
      </div>
    </div>
  );

  const renderEducationalContent = (text: string, blockKey: string, context: 'lesson' | 'exercise' = 'lesson') => {
    const segments = getEducationalSegments(text);
    const elements: ReactNode[] = [];
    const wholeText = stripHtmlTags(text);

    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index];
      const plain = stripHtmlTags(segment.html);
      const key = `${blockKey}-visual-${index}`;

      if (segment.kind === 'listItem' || /^\d+[\.\)]\s+/.test(plain)) {
        const listItems: string[] = [];
        let cursor = index;

        while (cursor < segments.length) {
          const cursorPlain = stripHtmlTags(segments[cursor].html);
          if (segments[cursor].kind !== 'listItem' && !/^\d+[\.\)]\s+/.test(cursorPlain)) break;
          listItems.push(cursorPlain);
          cursor += 1;
        }

        const asActivity = context === 'exercise' || /actividad|ejercicios?|resuelve|practica/i.test(normalizeText(wholeText)) || listItems.length >= 4;
        elements.push(renderNumberedStepper(listItems, key, asActivity));
        index = cursor - 1;
        continue;
      }

      if (segment.kind === 'heading' || isHeadingLikeText(segment.html) || hasHeadingMarkup(segment.html)) {
        elements.push(renderEducationalHeading(segment.html, segment.level ?? 2, key));
        continue;
      }

      const definition = getDefinitionParts(segment.html);
      if (definition) {
        elements.push(renderDefinitionCard(definition.term, definition.definition, key));
        continue;
      }

      const example = getExampleParts(segment.html);
      if (example) {
        elements.push(renderExampleCard(example.label, example.body, key));
        continue;
      }

      if (isPrimeSequence(segment.html)) {
        elements.push(renderPrimeChips(segment.html, key));
        continue;
      }

      const divisibilityRules = getDivisibilityRules(segment.html);
      if (divisibilityRules.length >= 2) {
        elements.push(renderDivisibilityCards(divisibilityRules, key));
        continue;
      }

      if (/recta\s+numerica|numeros\s+enteros|positivos|negativos|cero/i.test(normalizeText(plain))) {
        elements.push(renderNumberLineVisual(segment.html, key));
        continue;
      }

      const longDivision = getLongDivisionParts(segment.html);
      if (longDivision) {
        elements.push(renderLongDivisionCard(longDivision, key));
        continue;
      }

      if (getOperationMatch(segment.html)) {
        elements.push(renderMathOperationCard(segment.html, key));
        continue;
      }

      const comparisonLines = plain
        .split(/\n|;/)
        .map((line) => line.trim())
        .filter((line) => /^[^:]{2,40}:\s+/.test(line));
      if (comparisonLines.length >= 3) {
        elements.push(renderComparisonGrid(comparisonLines, key));
        continue;
      }

      elements.push(renderParagraphCard(segment.html, key));
    }

    return <div key={blockKey} className="space-y-5">{elements}</div>;
  };

  const getParagraphImageSources = (text: string) => (
    Array.from(text.matchAll(/\{\s*img_([^}]+)\s*\}/gi))
      .map((match) => match[1]?.trim())
      .filter(Boolean)
      .map((imageName) => {
        const cleanName = imageName
          .replace(/^\/+/, '')
          .replace(/\.(png|jpe?g|webp|gif|svg)$/i, '');

        return `/${cleanName}.png`;
      })
  );

  const removeParagraphImageMarkers = (text: string) => (
    text.replace(/\{\s*img_[^}]+\s*\}/gi, '').replace(/\n{3,}/g, '\n\n').trim()
  );

  const renderParagraphImages = (sources: string[], blockKey: string) => {
    if (sources.length === 0) return null;

    return (
      <div className={sources.length === 1 ? "flex justify-center" : "grid gap-4 sm:grid-cols-2"} key={`${blockKey}-images`}>
        {sources.map((src, index) => (
          <div
            key={`${blockKey}-image-${src}-${index}`}
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-orange-100 bg-white p-3 shadow-sm dark:border-orange-500/20 dark:bg-[#282828]"
          >
            <Image
              src={src}
              alt={`Imagen de apoyo ${index + 1}`}
              width={720}
              height={420}
              className="mx-auto h-auto max-h-[420px] w-full object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    );
  };

  const renderDesignedParagraphBlock = (text: string, blockKey: string) => {
    const paragraphImageSources = getParagraphImageSources(text);
    const cleanText = removeParagraphImageMarkers(text);

    if (paragraphImageSources.length === 0) {
      return renderEducationalContent(text, blockKey);
    }

    return (
      <div key={blockKey} className="space-y-5">
        {cleanText && renderEducationalContent(cleanText, `${blockKey}-content`)}
        {renderParagraphImages(paragraphImageSources, blockKey)}
      </div>
    );
  };

  const isOnlyParagraphImageMarker = (text: string) => (
    getParagraphImageSources(text).length > 0 && removeParagraphImageMarkers(text).length === 0
  );

  const parseCompuestoText = (text: string) => {
    if (!text) return { desc: "", example: "" };
    const parts = text.split(/ejemplo:/i);
    const desc = parts[0]?.trim() ?? "";
    let example = "";
    if (parts[1]) {
      example = "Ejemplo: " + parts[1].trim();
    } else {
      const parts2 = text.split(/ejemplo/i);
      if (parts2[1]) {
        example = "Ejemplo: " + parts2[1].trim();
      }
    }
    return { desc, example };
  };

  const renderCompuestoCard = (title: string, contentText: string, blockKey: string) => {
    const { desc, example } = parseCompuestoText(contentText);
    return (
      <div 
        key={blockKey}
        className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/10 dark:bg-amber-950/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all"
      >
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm font-bold select-none">#</span>
            <h4 
              className="text-xl font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider [&_h3]:m-0 [&_h3]:text-xl"
              dangerouslySetInnerHTML={{ __html: formatRichHtml(title) }}
            />
          </div>
          <p 
            className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatRichHtml(desc) }}
          />
          {example && (
            <div className="bg-white dark:bg-[#202020] border border-amber-200/20 p-3.5 rounded-xl shadow-xs text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
              <span dangerouslySetInnerHTML={{ __html: formatRichHtml(example) }} />
            </div>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderRecuerdaCard = (title: string, bodyText: string, blockKey: string) => {
    const parseRecuerdaBody = (text: string) => {
      if (!text) return { desc: "", examples: [] };
      const parts = text.split(/ejemplos?:/i);
      const desc = parts[0]?.trim() ?? "";
      
      const examples: Array<{ num: string; divs: string }> = [];
      if (parts[1]) {
        const regex = /(\d+)\s*=\s*\{\s*([\d\s,]+)\s*\}/g;
        let match;
        while ((match = regex.exec(parts[1])) !== null) {
          examples.push({
            num: match[1],
            divs: match[2].split(',').map(x => x.trim()).filter(Boolean).join(', ')
          });
        }
      }
      return { desc, examples };
    };

    const { desc, examples } = parseRecuerdaBody(bodyText);

    return (
      <div 
        key={blockKey}
        className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/10 dark:bg-indigo-950/5 p-6 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in"
      >
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8M12 3a7 7 0 00-7 7c0 2.76 1.7 5.12 4.07 6.09A3 3 0 0110 19h4a3 3 0 011.83-2.91C18.3 15.12 20 12.76 20 10a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider [&_strong]:text-indigo-600 [&_strong]:dark:text-indigo-400 [&_strong]:text-xl"
              dangerouslySetInnerHTML={{ __html: formatRichHtml(title) }}
            />
          </div>
          <p 
            className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatRichHtml(desc) }}
          />

          {examples.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-dashed border-indigo-200/50">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                EJEMPLOS:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {examples.map((ex, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-[#202020] border border-indigo-100 dark:border-indigo-900/20 rounded-xl p-3 text-center shadow-xs hover:scale-105 transition-all select-none"
                  >
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{ex.num}</span>
                    <span className="text-gray-400 mx-1.5">=</span>
                    <span className="text-gray-700 dark:text-gray-300 font-bold">{`{ ${ex.divs} }`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLeySignosCard = (text: string, blockKey: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const parsedRules: string[] = [];
    const descriptiveLines: string[] = [];

    lines.forEach(line => {
      if (/[\+\-]\s*(?:x|\*|\.|por)\s*[\+\-]\s*=/i.test(line) || /\([\+\-]\)\s*(?:x|\*|\.|\s)*\([\+\-]\)\s*=/i.test(line)) {
        parsedRules.push(line);
      } else {
        descriptiveLines.push(line);
      }
    });

    return (
      <div 
        key={blockKey}
        className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/10 dark:bg-purple-950/5 p-6 space-y-4 shadow-sm hover:shadow-md transition-all animate-fade-in"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white shadow-md shadow-purple-500/20">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Ley de los Signos
          </h4>
        </div>

        {descriptiveLines.length > 0 && (
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {descriptiveLines.join(' ')}
          </p>
        )}

        {parsedRules.length > 0 && (
          <div className="grid grid-cols-2 gap-3 max-w-md pt-2">
            {parsedRules.map((rule, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-[#202020] border border-purple-100 dark:border-purple-900/20 rounded-xl p-3 text-center shadow-xs font-mono font-bold text-base text-gray-800 dark:text-gray-200 select-none hover:scale-105 transition-all"
              >
                {rule}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderNumerosEnterosIntroCard = (blocks: TopicBlock[], startIdx: number, blockKey: string) => {
    // Gather all consecutive intro blocks from startIdx
    const consumedIndices: number[] = [];
    const allTexts: string[] = [];
    
    for (let i = startIdx; i < blocks.length; i++) {
      const txt = blocks[i].content?.text?.trim() ?? '';
      if (!txt) continue;
      const normTxt = normalizeText(txt);
      
      // Stop at known section boundaries
      if (/ley\s+de\s+(?:los\s+)?signos/i.test(normTxt)) break;
      if (/recta\s+num[eé]rica/i.test(normTxt) && /\d+\)\s*-?\d+\s*[\+\-]/.test(txt)) break;
      if (/actividad\s+de\s+repaso/i.test(normTxt)) break;
      if (/[\+\-]\s*(?:x|\*|\.|por)\s*[\+\-]\s*=/i.test(txt)) break;
      if (/\(\+\)\s*(?:x|\*|\.|por|\s)+\(\+\)/i.test(txt)) break;
      if (/adici[oó]n\s+y?\s*sustracci[oó]n/i.test(normTxt)) break;
      if (/multiplicaci[oó]n\s+de\s+n[uú]meros\s+enteros/i.test(normTxt)) break;
      
      consumedIndices.push(i);
      allTexts.push(txt);
    }
    
    if (allTexts.length === 0) return { element: null, consumed: [] as number[] };

    const fullText = allTexts.join('\n');
    const fullNorm = normalizeText(fullText);
    
    // Parse key content sections from the database text
    let mainDef = '';
    if (fullNorm.includes('conjunto de numeros que incluye') || fullNorm.includes('numeros que incluyen')) {
      const defMatch = fullText.match(/(?:son\s+)?(?:un\s+)?conjunto\s+de\s+n[úu]meros\s+que\s+incluy[ea][^.]*\./i);
      if (defMatch) mainDef = defMatch[0];
    }
    if (!mainDef) {
      const defMatch2 = fullText.match(/(?:Los\s+)?n[úu]meros\s+enteros[^.]*?\./i);
      if (defMatch2) mainDef = defMatch2[0];
    }
    
    const hasNaturales = fullNorm.includes('naturales') || fullNorm.includes('0, 1, 2, 3');
    const hasNegativos = fullNorm.includes('negativos') || fullNorm.includes('-1, -2, -3');
    const hasCero = fullNorm.includes('cero') || fullNorm.includes('(0)');
    
    const noEnterosMatch = fullText.match(/(?:no\s+(?:son|incluyen|incluye)\s+n[úu]meros\s+enteros?|no\s+son\s+enteros)[^.]*\./i);
    const noEnterosText = noEnterosMatch ? noEnterosMatch[0] : '';
    const hasExclusion = fullNorm.includes('fracciones') || fullNorm.includes('decimales') || fullNorm.includes('irracionales');
    const hasRectaExamples = fullNorm.includes('recta numerica') || fullNorm.includes('..., -5, -4') || fullNorm.includes('-5, -4, -3');
    
    const nonIntExamples: string[] = [];
    if (fullText.match(/2[.,]5/)) nonIntExamples.push('2.5');
    if (fullText.match(/3\s*\/\s*4/)) nonIntExamples.push('3/4');
    if (fullText.match(/√\s*2|raiz\s+de\s+2/i)) nonIntExamples.push('√2');

    const element = (
      <div key={blockKey} className="space-y-6">
        {/* Card 1: ¿Qué son los números enteros? */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1F25] p-6 md:p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">¿Qué son los números enteros?</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {mainDef || 'Los números enteros son un conjunto de números que incluye:'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {hasNaturales && (
                  <div className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">1</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">Números Naturales</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">(0, 1, 2, 3, ...)</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[0, 1, 2, 3].map(n => (
                        <span key={n} className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold text-sm">{n}</span>
                      ))}
                      <span className="flex h-8 items-center justify-center text-gray-400 font-bold text-sm px-1">...</span>
                    </div>
                  </div>
                )}
                
                {hasNegativos && (
                  <div className="rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-950/10 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">2</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">Números Negativos</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">(-1, -2, -3, ...)</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[-3, -2, -1].map(n => (
                        <span key={n} className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-sm">{n}</span>
                      ))}
                      <span className="flex h-8 items-center justify-center text-gray-400 font-bold text-sm px-1">...</span>
                    </div>
                  </div>
                )}
                
                {hasCero && (
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">3</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Cero</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">(0)</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm">0</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasExclusion && (
              <div className="lg:w-64 flex-shrink-0 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/10 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8M12 3a7 7 0 00-7 7c0 2.76 1.7 5.12 4.07 6.09A3 3 0 0110 19h4a3 3 0 011.83-2.91C18.3 15.12 20 12.76 20 10a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Los números enteros no incluyen fracciones, decimales ni números irracionales.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Ejemplos:</p>
                  <div className="flex flex-wrap gap-2">
                    {(nonIntExamples.length > 0 ? nonIntExamples : ['2.5', '3/4', '√2']).map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{ex}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">
                    {noEnterosText || 'no son números enteros.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Ejemplos de Números Enteros (Number Line) */}
        {hasRectaExamples && (
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1F25] p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md font-bold text-lg">#</div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ejemplos de Números Enteros</h4>
            </div>

            <div className="rounded-xl bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30 px-6 py-4">
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap text-base md:text-lg font-bold font-mono">
                <span className="text-gray-400">...</span>
                <span className="text-gray-400">,</span>
                {[-5, -4, -3, -2, -1].map(n => (
                  <span key={n}>
                    <span className="text-rose-500 dark:text-rose-400">{n}</span>
                    <span className="text-gray-300 dark:text-gray-600">,</span>
                  </span>
                ))}
                <span className="text-gray-900 dark:text-white font-extrabold text-xl">0</span>
                <span className="text-gray-300 dark:text-gray-600">,</span>
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n}>
                    <span className="text-blue-500 dark:text-blue-400">{n}</span>
                    {n < 5 && <span className="text-gray-300 dark:text-gray-600">,</span>}
                  </span>
                ))}
                <span className="text-gray-400">,</span>
                <span className="text-gray-400">...</span>
              </div>
            </div>

            <div className="px-2">
              <svg viewBox="0 0 600 80" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="nl-arrow-left" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 10 2 L 2 5 L 10 8 Z" fill="#F43F5E" />
                  </marker>
                  <marker id="nl-arrow-right" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 0 2 L 8 5 L 0 8 Z" fill="#3B82F6" />
                  </marker>
                </defs>
                <line x1={30} y1={35} x2={300} y2={35} stroke="#F43F5E" strokeWidth={3} markerStart="url(#nl-arrow-left)" />
                <line x1={300} y1={35} x2={570} y2={35} stroke="#3B82F6" strokeWidth={3} markerEnd="url(#nl-arrow-right)" />
                <circle cx={300} cy={35} r={5} fill="#1F2937" stroke="#fff" strokeWidth={2} />
                {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((val) => {
                  const x = 300 + val * 49;
                  const isZero = val === 0;
                  const isNeg = val < 0;
                  return (
                    <g key={val}>
                      <line x1={x} y1={28} x2={x} y2={42} stroke={isZero ? '#1F2937' : isNeg ? '#F43F5E' : '#3B82F6'} strokeWidth={isZero ? 2.5 : 1.5} />
                      <text x={x} y={60} fontSize={13} fontFamily="sans-serif" fontWeight={isZero ? 'bold' : 'normal'} textAnchor="middle"
                        className={isZero ? 'fill-gray-900 dark:fill-white' : isNeg ? 'fill-rose-500 dark:fill-rose-400' : 'fill-blue-500 dark:fill-blue-400'}>
                        {val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 px-4 py-2 shadow-xs">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 text-base">0</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">(el único número que no es positivo ni negativo)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    return { element, consumed: consumedIndices };
  };
  
  const renderRectaNumericaCard = (titleText: string, bodyText: string, blockKey: string) => {
    let titleClean = titleText;
    const eqIdx = titleClean.search(/(\d+)\s*\)/);
    if (eqIdx !== -1) {
      titleClean = titleClean.substring(0, eqIdx).trim();
    }
    titleClean = titleClean
      .replace(/<[^>]+>/g, '')
      .replace(/:\s*$/, '')
      .trim();

    const equationRegex = /(\d+)\s*\)\s*(-?\d+)\s*([\+\-])\s*(?:\(?(-?\d+)\)?)\s*=\s*(-?\d+)/g;
    const equations: Array<{ num: number; a: number; op: string; b: number; c: number; raw: string }> = [];
    let match;
    equationRegex.lastIndex = 0;
    while ((match = equationRegex.exec(bodyText)) !== null) {
      equations.push({
        num: parseInt(match[1]),
        a: parseInt(match[2]),
        op: match[3],
        b: parseInt(match[4]),
        c: parseInt(match[5]),
        raw: match[0]
      });
    }

    return (
      <div 
        key={blockKey}
        className="rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/10 dark:bg-orange-950/5 p-6 space-y-6 shadow-sm hover:shadow-md transition-all animate-fade-in"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold select-none text-2xl">
            ÷
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            {titleClean || "Ejemplos en la recta numérica"}
          </h4>
        </div>

        {equations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {equations.map((eq, idx) => {
              const isPositive = eq.c >= 0;
              const textClass = isPositive 
                ? "text-emerald-600 dark:text-emerald-400 font-extrabold" 
                : "text-rose-600 dark:text-rose-400 font-extrabold";
              
              const formattedB = eq.b < 0 ? `(${eq.b})` : `${eq.b}`;
              const equationString = `${eq.num}) ${eq.a} ${eq.op} ${formattedB} = ${eq.c}`;

              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#202020] border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col items-center shadow-xs select-none hover:scale-102 hover:shadow-sm transition-all"
                >
                  <div className={`text-base mb-2 font-mono ${textClass}`}>
                    {equationString}
                  </div>
                  <div className="w-full">
                    <NumberLineSVG a={eq.a} b={eq.b} c={eq.c} indexStr={`${blockKey}-${idx}`} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {bodyText}
          </p>
        )}
      </div>
    );
  };

  const renderTeoriaDeNumerosSubtopic = (subtopic: Subtopic, subtopicKey: string, subtopicIndex?: number) => {
    const blocks = subtopic.blocks ?? [];
    
    const divisoresHeaderIdx = blocks.findIndex(b => b.content?.text?.trim() === 'DIVISORES');
    const primoTitleIdx = blocks.findIndex(b => b.content?.text?.trim() === 'Número Primo');
    const primeDefIdx = blocks.findIndex(b => b.content?.text?.includes('Únicamente tiene dos factores'));
    const divisoresDeUnNumeroHeaderIdx = blocks.findIndex(b => b.content?.text?.trim() === 'Divisores de un Número');
    
    const examplesTitleIdx = blocks.findIndex(b => b.content?.text?.includes('Hallar los divisores de: 12') || b.content?.text?.includes('Hallar los divisores de : 12'));
    const examplesStepsIdx = blocks.findIndex(b => b.content?.text?.includes('Para hallar los divisores de un número, se buscan los números que dividen exactamente a 12'));

    const renderedIndices = new Set<number>();
    const sections: React.ReactNode[] = [];

    // Top orange gradient banner
    const bannerIndex = subtopicIndex !== undefined ? subtopicIndex + 1 : 3;
    const bannerTitle = `${bannerIndex}. ${subtopic.title}`;
    const bannerSubtitle = "Explora los números primos y aprende a encontrar los divisores de un número.";

    sections.push(
      <div key="banner" className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white rounded-2xl p-6 md:p-8 flex items-center justify-between gap-6 shadow-md relative overflow-hidden mb-8">
        <div className="flex items-center gap-5 relative z-10">
          <div className="flex h-16 w-16 md:h-20 md:w-20 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md">
            <Book123Icon />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {bannerTitle}
            </h2>
            <p className="mt-2 text-sm md:text-base text-orange-100 max-w-xl">
              {bannerSubtitle}
            </p>
          </div>
        </div>
        <FloatingBannerNumbers />
      </div>
    );

    // A. DIVISORES Section
    if (divisoresHeaderIdx !== -1) {
      renderedIndices.add(divisoresHeaderIdx);
      const subtextBlock = blocks[divisoresHeaderIdx + 1];
      const subtext = subtextBlock?.content?.text ?? 'Primero recordemos los números primos.';
      if (subtextBlock) renderedIndices.add(divisoresHeaderIdx + 1);

      sections.push(
        <div key="divisores-header" className="flex items-center gap-4 mb-6">
          <OrangeStarIcon />
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">DIVISORES</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{subtext}</p>
          </div>
        </div>
      );
    }

    // B. Número Primo Card & Examples
    if (primeDefIdx !== -1) {
      if (primoTitleIdx !== -1) renderedIndices.add(primoTitleIdx);
      renderedIndices.add(primeDefIdx);

      const blockText = blocks[primeDefIdx].content?.text ?? '';

      const primeRegex = /(\d+)\s*=\s*\{\s*([\d\s,]+)\s*\}/g;
      let pMatch;
      const primes: Array<{ num: number; divisors: string }> = [];
      primeRegex.lastIndex = 0;
      while ((pMatch = primeRegex.exec(blockText)) !== null) {
        primes.push({
          num: parseInt(pMatch[1]),
          divisors: pMatch[2].replace(/\s+/g, ' ')
        });
      }

      sections.push(
        <div key="primo-section" className="space-y-6">
          <div className="bg-[#FFFBF5] dark:bg-amber-950/10 border border-orange-100 dark:border-orange-500/15 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">1</span>
                <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400">Número Primo</h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-orange-500">✔</span>
                  Únicamente tiene dos factores o divisores.
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-orange-500">✔</span>
                  Los dos factores o divisores son 1 y el mismo número.
                </li>
              </ul>
            </div>
            <MedalBadge />
          </div>

          {primes.length > 0 && (
            <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-500/15 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <PurpleLightbulbIcon />
                <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-400">Ejemplo: Los factores o divisores de:</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {primes.map((p, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#282828] border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-center shadow-sm hover:scale-105 transition-transform">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{p.num}</span>
                    <span className="text-gray-400 mx-1">=</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{`{ ${p.divisors} }`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // C. Divisores de un Número Section
    if (divisoresDeUnNumeroHeaderIdx !== -1) {
      renderedIndices.add(divisoresDeUnNumeroHeaderIdx);
      const subtextBlock = blocks[divisoresDeUnNumeroHeaderIdx + 1];
      let subtext = 'DIVISORES DE UN NÚMERO: Son los factores de un número.';

      if (subtextBlock) {
        const text = subtextBlock.content?.text ?? '';
        const m = text.match(/^(DIVISORES DE UN NÚMERO:\s*Son los factores de un número\.)/i);
        if (m) {
          subtext = m[1];
        }
      }

      sections.push(
        <div key="divisores-de-un-numero-header" className="flex items-center gap-4 mt-8 mb-6">
          <DivisionIcon />
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Divisores de un Número</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{subtext}</p>
          </div>
        </div>
      );
    }

    // D. Divisores Examples (Dynamic parsing)
    if (examplesStepsIdx !== -1 && examplesTitleIdx !== -1) {
      renderedIndices.add(examplesTitleIdx);
      renderedIndices.add(examplesStepsIdx);

      const block5Text = blocks[examplesTitleIdx].content?.text ?? '';
      const block6Text = blocks[examplesStepsIdx].content?.text ?? '';

      const combinedText = block5Text + ' ' + block6Text;
      const parsedExamples = parseDivisorsBlock(combinedText);

      sections.push(
        <div key="divisores-examples" className="space-y-12">
          {parsedExamples.map((ex, exIdx) => {
            const allDivisors = getDivisors(ex.N);
            return (
              <div key={exIdx} className="bg-white dark:bg-[#242424] border border-orange-100 dark:border-orange-500/15 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3 bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100/50 dark:border-orange-500/10 rounded-xl p-4">
                  <SearchIcon />
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Ejemplo: Hallar los divisores de:
                  </h4>
                  <span className="bg-orange-500 text-white font-extrabold px-3 py-1 rounded-lg text-lg shadow-sm">
                    {ex.N}
                  </span>
                </div>

                <div className="relative pl-6 space-y-6">
                  {ex.steps.length > 0 && (
                    <div className="absolute left-9 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-orange-200 dark:border-orange-500/30"></div>
                  )}

                  {ex.steps.map((step, stepIdx) => {
                    const cleanListText = step.listText.split(',').map(x => x.trim()).filter(Boolean).join(', ');

                    let formula = step.formula;
                    if (!formula) {
                      const eqMatch = step.description.match(/(\d+)\s*x\s*(\d+)/);
                      if (eqMatch) {
                        formula = `(${eqMatch[0]})`;
                      } else if (step.stepNumber === 1) {
                        formula = `(1x${ex.N})`;
                      }
                    }

                    return (
                      <div key={stepIdx} className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFBF7]/50 dark:bg-[#2C2B29]/30 rounded-xl p-4 border border-orange-100/30 dark:border-orange-500/5">
                        <div className="absolute -left-[30px] top-6 md:top-1/2 md:-translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm shadow-sm border border-white dark:border-[#242424]">
                          {step.stepNumber}
                        </div>

                        <div className="flex-1 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                          {step.description}
                        </div>

                        <div className="flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-3 min-w-[140px] text-center">
                          {formula && (
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">
                              {formula}
                            </span>
                          )}
                          <span className="font-extrabold text-gray-900 dark:text-white">
                            {`{ ${cleanListText} }`}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-green-50/30 dark:bg-green-950/5 rounded-xl p-4 border border-green-100/30 dark:border-green-500/5">
                    <div className="absolute -left-[30px] top-6 md:top-1/2 md:-translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm border border-white dark:border-[#242424]">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div className="flex-1 text-gray-700 dark:text-gray-300 text-base font-semibold leading-relaxed">
                      {ex.endingText.replace(/Por tanto los divisores de.*$/i, '').trim() || 'Aqui termina. Por tanto ya no hay mas divisores o factores.'}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Por tanto los divisores de {ex.N} =</span>
                        <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 font-extrabold px-3 py-1 rounded-lg text-base">
                          {`{ ${allDivisors.join(', ')} }`}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center justify-center">
                      <div className="relative w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center text-green-600 dark:text-green-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    blocks.forEach((block, idx) => {
      if (renderedIndices.has(idx)) return;

      const rawBlockText = block.content?.text?.trim();
      if (!rawBlockText) return;

      if (block.type === 'paragraph' && /numero\s+compuesto/i.test(normalizeText(rawBlockText))) {
        renderedIndices.add(idx);
        
        let compuestoBody = "";
        if (blocks[idx + 1]) {
          compuestoBody = blocks[idx + 1].content?.text ?? "";
          renderedIndices.add(idx + 1);
        }
        
        sections.push(
          <div key={`compuesto-${idx}`} className="mt-6">
            {renderCompuestoCard(rawBlockText, compuestoBody, `${subtopicKey}-compuesto-${idx}`)}
          </div>
        );
        return;
      }

      if (block.type === 'paragraph' && /recuerda/i.test(normalizeText(rawBlockText)) && rawBlockText.length < 30) {
        renderedIndices.add(idx);
        let recuerdaBody = "";
        if (blocks[idx + 1]) {
          recuerdaBody = blocks[idx + 1].content?.text ?? "";
          renderedIndices.add(idx + 1);
        }
        sections.push(
          <div key={`recuerda-${idx}`} className="mt-6">
            {renderRecuerdaCard(rawBlockText, recuerdaBody, `${subtopicKey}-recuerda-${idx}`)}
          </div>
        );
        return;
      }

      sections.push(
        <div key={`remaining-${idx}`} className="mt-6">
          {block.type === 'math_layout' ? (
            renderMathLayout(rawBlockText, `${subtopicKey}-math-${idx}`)
          ) : (
            renderDesignedParagraphBlock(rawBlockText, `${subtopicKey}-paragraph-${idx}`)
          )}
        </div>
      );
    });

    return <div className="space-y-8">{sections}</div>;
  };

  const renderNumerosEnterosSubtopic = (subtopic: Subtopic, subtopicKey: string, subtopicIndex: number, currentTopic: Topic) => {
    const bannerIndex = subtopicIndex + 1;
    const bannerTitle = `${bannerIndex}. ${subtopic.title.toUpperCase()}`;
    const topicTitle = currentTopic.title?.toUpperCase() || '';
    const topicDescription = currentTopic.description || '';
    
    return (
      <div className="space-y-6">
        {/* Top Banner — New Design */}
        <div key="banner" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white rounded-2xl p-6 md:p-8 flex items-center justify-between gap-6 shadow-lg relative overflow-hidden mb-8">
          {/* Subtle background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
            <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
          </div>

          {/* Left: Icon + Title block */}
          <div className="flex items-center gap-5 relative z-10">
            <div className="flex h-16 w-16 md:h-20 md:w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-md border border-white/20">
              <EnterosIcon />
            </div>
            <div>
              {topicTitle && (
                <p className="text-xs md:text-sm font-semibold text-indigo-200 tracking-widest uppercase mb-1">
                  {topicTitle}
                </p>
              )}
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                {bannerTitle}
              </h2>
              {topicDescription && (
                <p className="mt-1.5 text-sm text-indigo-100/80 max-w-md hidden md:block">
                  {topicDescription.length > 120 ? topicDescription.substring(0, 120) + '...' : topicDescription}
                </p>
              )}
            </div>
          </div>

          {/* Right: Three colored icons + mini number line */}
          <div className="hidden md:flex flex-col items-center gap-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-md border-2 border-white/30">
                <span className="text-xl font-extrabold leading-none">−</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-2 border-white/30">
                <span className="text-lg font-extrabold leading-none">0</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-md border-2 border-white/30">
                <span className="text-xl font-extrabold leading-none">+</span>
              </div>
            </div>
            {/* Mini number line */}
            <svg viewBox="0 0 120 30" className="w-28 h-auto" fill="none">
              <defs>
                <marker id="mini-nl-l" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 10 2 L 2 5 L 10 8 Z" fill="#F43F5E" />
                </marker>
                <marker id="mini-nl-r" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M 0 2 L 8 5 L 0 8 Z" fill="#3B82F6" />
                </marker>
              </defs>
              <line x1={10} y1={12} x2={60} y2={12} stroke="#F43F5E" strokeWidth={2} markerStart="url(#mini-nl-l)" />
              <line x1={60} y1={12} x2={110} y2={12} stroke="#3B82F6" strokeWidth={2} markerEnd="url(#mini-nl-r)" />
              <line x1={60} y1={6} x2={60} y2={18} stroke="white" strokeWidth={2} />
              <circle cx={60} cy={12} r={3} fill="white" />
              <text x={60} y={28} fontSize={9} fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="rgba(255,255,255,0.7)">0</text>
            </svg>
          </div>
        </div>

        {/* Blocks rendered beautifully */}
        {renderSubtopicBlocks(subtopic, subtopicIndex, currentTopic)}
      </div>
    );
  };

  const renderDynamicDivision = (
    titleText: string,
    block27Text: string,
    block28Text: string,
    block29Text: string,
    subtopicIndex: number,
    customHeaderHtml?: string
  ) => {
    // Extract divisor and dividend from block27Text
    const digitSeqMatch = block27Text.match(/(\d)\s+(\d)\s+(\d)\s+(\d)/);
    let dividend = 237;
    let divisor = 5;
    
    if (digitSeqMatch) {
      dividend = parseInt(digitSeqMatch[1] + digitSeqMatch[2] + digitSeqMatch[3]);
      divisor = parseInt(digitSeqMatch[4]);
    } else {
      const titleMatch = titleText.match(/Dividir\s+(\d+)\s+entre\s+(\d+)/i);
      if (titleMatch) {
        dividend = parseInt(titleMatch[1]);
        divisor = parseInt(titleMatch[2]);
        if (dividend === 0) dividend = 237;
      }
    }

    const D1 = Math.floor(dividend / 100);
    const D2 = Math.floor((dividend % 100) / 10);
    const D3 = dividend % 10;
    const first_2_digits = D1 * 10 + D2;
    const q1 = Math.floor(first_2_digits / divisor);
    const prod1 = q1 * divisor;
    const diff1 = first_2_digits - prod1;
    const combined = diff1 * 10 + D3;
    const q2 = Math.floor(combined / divisor);
    const prod2 = q2 * divisor;
    const residue = combined - prod2;
    const quotient = q1 * 10 + q2;

    // Helper functions to format and highlight numbers in steps
    const formatStep1 = (text: string, first_digits: number) => {
      let formatted = text.charAt(0).toUpperCase() + text.slice(1);
      formatted = formatted.replace(/(\d+)\s*(>)\s*(\d+)/, '<span class="text-[#FF6B00] font-bold">$1</span> <span class="text-[#FF6B00] font-bold">$2</span> <span class="text-[#FF6B00] font-bold">$3</span>');
      return (
        <span>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {': '}
          <span className="text-[#FF6B00] font-bold">{first_digits}</span>
        </span>
      );
    };

    const formatStep2 = (text: string, esText: string) => {
      let formatted = text;
      formatted = formatted.replace(new RegExp('(por\\s+)(' + divisor + ')\\b', 'i'), '$1<span class="text-[#FF6B00] font-bold">$2</span>');
      formatted = formatted.replace(new RegExp('(igual\\s+a\\s+)(' + first_2_digits + ')\\b', 'i'), '$1<span class="text-[#FF6B00] font-bold">$2</span>');
      const formattedEs = esText.replace(/(\d+)/, '<span class="text-[#FF6B00] font-bold">$1</span>');
      return (
        <span>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {' '}
          <span dangerouslySetInnerHTML={{ __html: formattedEs }} />.
        </span>
      );
    };

    const formatOsea = (text: string) => {
      const formatted = text.replace(/(\d+)\s*(x|\*)\s*(\d+)\s*(=)\s*(\d+)/i, '<span class="text-[#FF6B00] font-bold">$1</span> <span class="text-[#FF6B00] font-bold">$2</span> <span class="text-[#FF6B00] font-bold">$3</span> <span class="text-[#FF6B00] font-bold">$4</span> <span class="text-[#FF6B00] font-bold">$5</span>');
      return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    const formatStep3 = (text: string) => {
      const formatted = text.replace(/(\d+)\s*(-)\s*(\d+)\s*(=)\s*(\d+)/, '<span class="text-[#FF6B00] font-bold">$1</span> <span class="text-[#FF6B00] font-bold">$2</span> <span class="text-[#FF6B00] font-bold">$3</span> <span class="text-[#FF6B00] font-bold">$4</span> <span class="text-[#FF6B00] font-bold">$5</span>');
      return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    const formatStep4 = (text: string) => {
      let formatted = text.charAt(0).toUpperCase() + text.slice(1);
      formatted = formatted.replace(/(\d+)/, '<span class="text-[#FF6B00] font-bold">$1</span>');
      return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    const formatStep5 = (text: string) => {
      let formatted = text;
      formatted = formatted.replace(/(es\s+)(\d+)$/i, '$1<span class="text-[#FF6B00] font-bold">$2</span>');
      formatted = formatted.replace(/(por:?\s+)(\d+)\b/i, '$1<span class="text-[#FF6B00] font-bold">$2</span>');
      return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    const formatStep5Formula = (text: string) => {
      const formatted = text.replace(/(\d+)\s*(x|\*)\s*(\d+)\s*(=)\s*(\d+)/, '<span class="text-[#FF6B00] font-bold">$1</span> <span class="text-[#FF6B00] font-bold">$2</span> <span class="text-[#FF6B00] font-bold">$3</span> <span class="text-[#FF6B00] font-bold">$4</span> <span class="text-[#FF6B00] font-bold">$5</span>');
      return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    const step6Html = `Por tanto: <span class="text-[#FF6B00] font-bold">${combined}</span> <span class="text-[#FF6B00] font-bold">-</span> <span class="text-[#FF6B00] font-bold">${prod2}</span> <span class="text-[#FF6B00] font-bold">=</span> <span class="text-[#FF6B00] font-bold">${residue}</span>`;

    // Parse step texts from the backend blocks
    const s1Match = block27Text.match(/como\s+\d+\s*>\s*\d+\s+entonces\s+separamos\s+\d+\s+cifras/i);
    const step1Text = s1Match ? s1Match[0].trim() : `Como ${divisor} > ${D1} entonces separamos 2 cifras: ${first_2_digits}`;
    // formattedStep1 intentionally computed but used via step1Text directly

    const s2Match = block27Text.match(/Se\s+busca\s+un\s+número\s+que\s+multiplicado\s+(.*?)\s*por\s+(\d+)\s+se\s+aproxime\s+o\s+sea\s+igual\s+a\s+(\d+)/i);
    let step2Text = '';
    if (s2Match) {
      const cleanMiddle = s2Match[1].replace(/(?:-|\+)?\s*(?:\b\d\b\s*)+/gi, '').trim();
      step2Text = `Se busca un número que multiplicado ${cleanMiddle ? cleanMiddle + ' ' : ''}por ${s2Match[2]} se aproxime o sea igual a ${s2Match[3]}.`;
    } else {
      step2Text = `Buscamos un número que multiplicado por ${divisor} se aproxime o sea igual a ${first_2_digits}.`;
    }

    const esMatch = block27Text.match(/Es\s+(\d+)\b/i);
    const step2Es = esMatch ? esMatch[0] : `Es ${q1}`;

    const oseaMatch = block27Text.match(/Osea:\s*\d+\s*x\s*\d+\s*=\s*\d+/i);
    const step2Osea = oseaMatch ? oseaMatch[0] : `Osea: ${divisor} x ${q1} = ${prod1}`;

    const s3Match = block27Text.match(/Por\s+tanto:\s*(\d+)\s*-\s*(\d+)\s*=\s*(\d+)/i);
    const step3Text = s3Match ? s3Match[0] : `Por tanto: ${first_2_digits} - ${prod1} = ${diff1}`;

    const s4Match = block27Text.match(/se\s+baja\s+la\s+siguiente\s+cifra\s+que\s+es:\s*(\d+)/i);
    const step4Text = s4Match ? s4Match[0] : `Se baja la siguiente cifra que es: ${D3}`;
    // formattedStep4 intentionally computed but used via step4Text directly

    // Join Block 28 and 29 text to parse Step 5
    const joined28_29 = (block28Text + ' ' + block29Text).trim();
    const s5TextMatch = joined28_29.match(/(Ahora\s+buscamos\s+un\s+número\s+que\s+multiplicado\s+por:\s*\d+\s+sea\s+igual\s+a\s+\d+\.\s+Ese\s+número\s+es\s+\d+)/i);
    const step5Text = s5TextMatch ? s5TextMatch[0] : `Ahora buscamos un número que multiplicado por ${divisor} sea igual a ${combined}. Ese número es ${q2}`;

    const s5FormulaMatch = joined28_29.match(/(\d+\s*x\s*\d+\s*=\s*\d+)\s*$/);
    const step5Formula = s5FormulaMatch ? s5FormulaMatch[1] : `${divisor} x ${q2} = ${prod2}`;

    const ArrowLeftSvg = ({ color }: { color: string }) => (
      <svg className={`w-6 h-4 ${color}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
      </svg>
    );

    return (
      <div className="space-y-6">
        {/* Header Section */}
        {customHeaderHtml ? (
          <div className="mb-4">
            <div dangerouslySetInnerHTML={{ __html: formatRichHtml(customHeaderHtml) }} />
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 ml-12">
              Dividir {dividend} entre {divisor}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-4">
            <DivisionIcon />
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {subtopicIndex !== undefined ? `${subtopicIndex + 1}. ` : '1. '}DIVISIÓN
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Dividir {dividend} entre {divisor}
              </p>
            </div>
          </div>
        )}

        {/* Tip / Intro Box */}
        <div className="bg-[#FFFBF5] dark:bg-amber-950/10 border border-orange-100 dark:border-orange-500/15 rounded-xl p-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8M12 3a7 7 0 00-7 7c0 2.76 1.7 5.12 4.07 6.09A3 3 0 0110 19h4a3 3 0 011.83-2.91C18.3 15.12 20 12.76 20 10a7 7 0 00-7-7z" />
            </svg>
          </span>
          <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
            Vamos a dividir <span className="text-orange-600 font-bold">{dividend}</span> entre <span className="text-orange-600 font-bold">{divisor}</span> paso a paso.
          </p>
        </div>

        {/* Main Grid: Steps on left, visual division on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Side: Steps List (Mockup Layout with horizontal dashed dividers) */}
          <div className="flex flex-col justify-between py-2">
            {/* Step 1 */}
            <div className="flex items-start gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00] text-white text-lg font-bold flex-shrink-0 shadow-sm">
                1
              </div>
              <div className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed pt-1">
                {formatStep1(step1Text, first_2_digits)}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-800"></div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00] text-white text-lg font-bold flex-shrink-0 shadow-sm">
                2
              </div>
              <div className="flex-1 text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed pt-1">
                <p>{formatStep2(step2Text, step2Es)}</p>
                <div className="bg-[#FFF0E6] border border-[#FFE0CC] rounded-xl px-4 py-2 mt-3 inline-block font-semibold text-[#FF6B00]">
                  {formatOsea(step2Osea)}
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-800"></div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00] text-white text-lg font-bold flex-shrink-0 shadow-sm">
                3
              </div>
              <div className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed pt-1">
                {formatStep3(step3Text)}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-800"></div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00] text-white text-lg font-bold flex-shrink-0 shadow-sm">
                4
              </div>
              <div className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed pt-1">
                {formatStep4(step4Text)}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-800"></div>

            {/* Step 5 */}
            <div className="flex items-start gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00] text-white text-lg font-bold flex-shrink-0 shadow-sm">
                5
              </div>
              <div className="flex-1 text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed pt-1">
                <p>{formatStep5(step5Text)}</p>
                <div className="bg-[#FFF0E6] border border-[#FFE0CC] rounded-xl px-4 py-2 mt-3 inline-block font-semibold text-[#FF6B00]">
                  {formatStep5Formula(step5Formula)}
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-800"></div>

            {/* Step 6 */}
            <div className="flex items-start gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00] text-white text-lg font-bold flex-shrink-0 shadow-sm">
                6
              </div>
              <div className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed pt-1">
                <span dangerouslySetInnerHTML={{ __html: step6Html }} />
              </div>
            </div>
          </div>

          {/* Right Side: Long Division Box */}
          <div className="flex flex-col items-center justify-center bg-white dark:bg-[#242424] border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex-1">
            <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-3 py-1 rounded-full text-xs mb-8 border border-orange-100/30 dark:border-orange-500/5 select-none">
              División larga
            </span>
            <div className="flex items-start gap-8 select-none">
              {/* Monospace Division layout */}
              <div className="font-mono text-2xl font-bold tracking-widest text-gray-800 dark:text-gray-100 space-y-2">
                <div className="flex items-center">
                  <span className="w-20 text-right mr-3">{D1} {D2} {D3}</span>
                  <span className="border-l-2 border-gray-400 dark:border-gray-500 pl-3 py-1">{divisor}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20"></span>
                  <span className="border-t-2 border-l-2 border-gray-400 dark:border-gray-500 pl-3 py-1 text-orange-600 dark:text-orange-400">
                    {q1} {q2}
                  </span>
                </div>
                <div className="flex items-center text-orange-600 dark:text-orange-400">
                  <span className="w-20 text-right mr-3">- {Math.floor(prod1 / 10)} {prod1 % 10}</span>
                  <span></span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 border-b-2 border-gray-400 dark:border-gray-500 mr-3"></span>
                  <span></span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-right mr-3">{diff1} {D3}</span>
                  <span></span>
                </div>
                <div className="flex items-center text-orange-600 dark:text-orange-400">
                  <span className="w-20 text-right mr-3">- {Math.floor(prod2 / 10)} {prod2 % 10}</span>
                  <span></span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 border-b-2 border-gray-400 dark:border-gray-500 mr-3"></span>
                  <span></span>
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <span className="w-20 text-right mr-3">{residue}</span>
                  <span></span>
                </div>
              </div>

              {/* Arrow pointers and annotations */}
              <div className="flex flex-col justify-between h-[300px] py-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <ArrowLeftSvg color="text-orange-500" />
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold">1</span>
                    Separamos {first_2_digits}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeftSvg color="text-orange-500" />
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold">2</span>
                    {divisor} x {q1} = {prod1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeftSvg color="text-orange-500" />
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold">3</span>
                    {first_2_digits} - {prod1} = {diff1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeftSvg color="text-purple-500" />
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white text-[10px] font-bold">4</span>
                    Bajamos el {D3}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeftSvg color="text-purple-500" />
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white text-[10px] font-bold">5</span>
                    {divisor} x {q2} = {prod2}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeftSvg color="text-green-500" />
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-[10px] font-bold">6</span>
                    {combined} - {prod2} = {residue} (residuo)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Summary Bar */}
        <div className="bg-[#FFFBF5] dark:bg-amber-950/10 border border-orange-100 dark:border-orange-500/15 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 p-3 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-orange-600 dark:text-orange-400">Resumen</span>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">Dividendo</p>
              <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{dividend}</p>
            </div>
            <div className="h-8 border-l border-gray-200 dark:border-gray-800"></div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">Divisor</p>
              <p className="text-2xl font-black text-amber-500 dark:text-amber-400">{divisor}</p>
            </div>
            <div className="h-8 border-l border-gray-200 dark:border-gray-800"></div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">Cociente</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{quotient}</p>
            </div>
            <div className="h-8 border-l border-gray-200 dark:border-gray-800"></div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">Residuo</p>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">{residue}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPrimesSection = (
    titleText: string,
    primesListText: string,
    examplesBlockText: string,
    subtopicIndex: number
  ) => {
    const primes = primesListText.split(/\s+/).map(x => x.trim()).filter(Boolean);
    
    // Parse examples from examplesBlockText
    const regex = /(\d+)\s*=\s*\{\s*([\d\s,]+)\s*\}/g;
    let match;
    const parsedExamples = [];
    while ((match = regex.exec(examplesBlockText)) !== null) {
      parsedExamples.push({
        num: parseInt(match[1]),
        divisors: match[2].trim()
      });
    }
    // Sort examples by value
    parsedExamples.sort((a, b) => a.num - b.num);

    const total = parsedExamples.length;
    const colSize = Math.ceil(total / 3);
    const col1 = parsedExamples.slice(0, colSize);
    const col2 = parsedExamples.slice(colSize, colSize * 2);
    const col3 = parsedExamples.slice(colSize * 2);

    // Dynamic subtitle
    let subtitle = "Son los que tienen exactamente 2 divisores: 1 y él mismo.";
    const subMatch = examplesBlockText.match(/^(.*?Ejemplos:)/i);
    if (subMatch) {
      subtitle = subMatch[1].replace(/Ejemplos:/i, '').replace(/Los números primos son los que tienen 2 divisores; uno y el mismo número\.?/i, 'Son los que tienen exactamente 2 divisores: 1 y él mismo.').trim();
    }

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <OrangeStarIcon />
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
              {subtopicIndex !== undefined ? `${subtopicIndex + 1}. ` : ''}{titleText}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Primes Grid */}
        <div className="flex flex-wrap gap-3">
          {primes.map((p, idx) => (
            <div key={idx} className="bg-[#FFF0E6] border border-[#FFE0CC] text-[#FF6B00] text-lg font-extrabold w-12 h-12 flex items-center justify-center rounded-xl shadow-sm hover:scale-105 transition-transform select-none">
              {p}
            </div>
          ))}
        </div>

        {/* Examples Card */}
        {parsedExamples.length > 0 && (
          <div className="bg-[#FFFBF7] dark:bg-amber-950/5 border border-orange-100 dark:border-orange-500/10 rounded-2xl p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wider uppercase">
              EJEMPLOS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-base font-semibold text-gray-800 dark:text-gray-200">
              <div className="space-y-2">
                {col1.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-1 select-none">
                    <span className="text-[#FF6B00]">{ex.num}</span>
                    <span>{` = { ${ex.divisors} }`}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {col2.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-1 select-none">
                    <span className="text-[#FF6B00]">{ex.num}</span>
                    <span>{` = { ${ex.divisors} }`}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {col3.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-1 select-none">
                    <span className="text-[#FF6B00]">{ex.num}</span>
                    <span>{` = { ${ex.divisors} }`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ActividadIcon = () => (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/20">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  );

  const renderDivisibilidadSection = (
    subtopicIndex: number,
    div2Text: string,
    div3Block37Text: string,
    div3Block38Text: string,
    div5Text: string
  ) => {

    // 2. Parse DIVISIBILIDAD por 2
    const div2RuleText = div2Text.split(/ejemplos:/i)[0].trim();
    const div2PillsMatch = div2Text.match(/Ejemplos:\s*([\d,\s]+)\s+son/i);
    const div2Pills = div2PillsMatch ? div2PillsMatch[1].split(',').map(x => x.trim()) : [];
    const div2Divs = [];
    const div2Regex = /(\d+)\s*:\s*(\d+)\s*=\s*(\d+)/g;
    let m;
    while ((m = div2Regex.exec(div2Text)) !== null) {
      div2Divs.push(`${m[1]} ÷ ${m[2]} = ${m[3]}`);
    }

    // 3. Parse DIVISIBILIDAD por 3
    const div3RuleText = div3Block37Text.split(/ejemplos:/i)[0].trim();
    const step1Match = div3Block38Text.match(/Paso1\.\s*(.*?)(?=Paso2\b)/i);
    const step2Match = div3Block38Text.match(/Paso2\.\s*(.*?)(?=Paso3\b)/i);
    const step3Match = div3Block38Text.match(/Paso3\.\s*(.*?)(?=Ejemplos\b)/i);

    const cleanStep1 = step1Match ? step1Match[1].trim().replace(/\./g, '') : '';
    const cleanStep2 = step2Match ? step2Match[1].trim().replace(/Tres/i, '3').replace(/tres/i, '3') : '';
    const cleanStep3Raw = step3Match ? step3Match[1].trim() : '';
    let cleanStep3 = '';
    const step3DivMatch = cleanStep3Raw.match(/(\d+)\s*:\s*(\d+)\s*=\s*(\d+)/);
    if (step3DivMatch) {
      cleanStep3 = `${step3DivMatch[1]} ÷ ${step3DivMatch[2]} = ${step3DivMatch[3]} (residuo 0)`;
    } else {
      cleanStep3 = cleanStep3Raw;
    }

    const div3PillsMatch = div3Block38Text.match(/Ejemplos:\s*([\d,\s]+)\s*\./i);
    const div3Pills = div3PillsMatch ? div3PillsMatch[1].split(',').map(x => x.trim()) : [];

    const div3VerifyCards = [];
    const cardRegex = /Ejemplo:\s*(\d+)\s*([\d+=\s]+),\s*([^.]+)/gi;
    let m3;
    while ((m3 = cardRegex.exec(div3Block38Text)) !== null) {
      div3VerifyCards.push({
        num: m3[1],
        sum: m3[2].trim(),
        explanation: m3[3].replace(/como\s+(\d+)\s+es\s+divisible\s+por\s+3,\s+entonces\s+(\d+)\s+es\s+divisible\s+por\s+3/i, '$1 es múltiplo de 3').trim()
      });
    }

    // 4. Parse DIVISIBILIDAD por 5
    const div5RuleText = div5Text.split(/ejemplos:/i)[0].trim();
    const div5Divs = [];
    const div5Regex = /(\d+)\s*:\s*(\d+)\s*=\s*(\d+)/g;
    let m5;
    while ((m5 = div5Regex.exec(div5Text)) !== null) {
      div5Divs.push(`${m5[1]} ÷ ${m5[2]} = ${m5[3]}`);
    }
    const div5Pills = div5Divs.map(d => d.split(' ')[0]);

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <ActividadIcon />
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
              {subtopicIndex !== undefined ? `${subtopicIndex + 1}. ` : ''}DIVISIBILIDAD
            </h3>
          </div>
        </div>

        {/* 3-Column Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Column 1: DIVISIBILIDAD por 2 (Green) */}
          <div className="rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50/10 dark:bg-green-950/5 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-green-600 dark:text-green-400">DIVISIBILIDAD por 2</h4>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-extrabold text-lg shadow-sm">
                  2
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {div2RuleText}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Ejemplos:</p>
                <div className="flex flex-wrap gap-2">
                  {div2Pills.map((pill, idx) => (
                    <span key={idx} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-extrabold px-3 py-1 rounded-lg text-sm border border-green-200/50">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-dashed border-green-200 dark:border-green-900/40">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Ejemplo:</p>
              <div className="space-y-1 font-mono text-base font-bold text-gray-800 dark:text-gray-200">
                {div2Divs.map((d, idx) => (
                  <div key={idx}>{d}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: DIVISIBILIDAD por 3 (Purple) */}
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/10 dark:bg-indigo-950/5 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">DIVISIBILIDAD por 3</h4>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white font-extrabold text-lg shadow-sm">
                  3
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {div3RuleText}
              </p>

              {/* Verification Steps Card */}
              <div className="bg-white dark:bg-[#202020] border border-indigo-150 dark:border-indigo-900/30 rounded-xl p-4 space-y-2.5 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Ejemplo: 111
                </p>
                <div className="space-y-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                  <p><span className="text-indigo-600 font-bold">Paso 1:</span> {cleanStep1.replace(/Sumo las cifras/i, '').replace(/1\+1\+1\s*=\s*3/g, '1 + 1 + 1 = 3').trim()}</p>
                  <p><span className="text-indigo-600 font-bold">Paso 2:</span> {cleanStep2}</p>
                  <p><span className="text-indigo-600 font-bold">Paso 3:</span> {cleanStep3}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Más ejemplos:</p>
                <div className="flex flex-wrap gap-2">
                  {div3Pills.map((pill, idx) => (
                    <span key={idx} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-extrabold px-3 py-1 rounded-lg text-sm border border-indigo-200/50">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Verification Side-by-Side Cards */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-indigo-200 dark:border-indigo-900/40">
              {div3VerifyCards.map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-[#202020] border border-indigo-100 dark:border-indigo-900/20 rounded-xl p-3 space-y-1 text-center shadow-xs">
                  <p className="text-xs font-bold text-indigo-600">Ejemplo: {card.num}</p>
                  <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200">{card.sum.replace(/\s+/g, '')}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{card.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: DIVISIBILIDAD por 5 (Orange) */}
          <div className="rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/10 dark:bg-orange-950/5 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400">DIVISIBILIDAD por 5</h4>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-extrabold text-lg shadow-sm">
                  5
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {div5RuleText}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Ejemplos:</p>
                <div className="flex flex-wrap gap-2">
                  {div5Pills.map((pill, idx) => (
                    <span key={idx} className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-extrabold px-3 py-1 rounded-lg text-sm border border-orange-200/50">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-dashed border-orange-200 dark:border-orange-900/40">
              <div className="grid grid-cols-3 gap-2 font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                {div5Divs.map((d, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#202020] border border-orange-100 dark:border-orange-900/10 p-2 rounded-lg text-center shadow-xs">
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActividadRepasoSection = (
    subtopicIndex: number,
    titleText: string,
    subtitleText: string,
    multBlockText: string,
    divBlockText: string,
    zBlockText: string,
    block44Text: string,
    block51Text: string
  ) => {
    const parseRows = (text: string) => {
      const regex = /(\d+)\.\s+([\s\S]+?)(?=\s+\d+\.|$)/g;
      let match;
      const itemsByNum: Record<number, string[]> = {};
      
      while ((match = regex.exec(text)) !== null) {
        const num = parseInt(match[1]);
        let content = match[2].trim();
        
        if (content.includes("Actividad para adquirir")) {
          content = content.split(/actividad\s+para/i)[0].trim();
        }
        
        if (!itemsByNum[num]) {
          itemsByNum[num] = [];
        }
        itemsByNum[num].push(content);
      }
      return itemsByNum;
    };

    const rows44 = parseRows(block44Text);
    const rows51 = parseRows(block51Text);

    const col1List: string[] = [];
    const col2List: string[] = [];
    const col3List: string[] = [];

    for (let i = 1; i <= 10; i++) {
      const row = rows44[i] || [];
      col1List.push(row[0] || '');
      col2List.push(row[1] || '');
      col3List.push(row[2] || '');
    }

    for (let i = 11; i <= 20; i++) {
      const row = rows51[i] || [];
      col1List.push(row[0] || '');
      col2List.push(row[1] || '');
      col3List.push(row[2] || '');
    }

    const parseInstructionBlock = (text: string, defaultTitle: string) => {
      if (!text) return { title: defaultTitle, lines: [] };
      const parts = text.split('\n').map(line => line.trim()).filter(Boolean);
      if (parts.length === 0) return { title: defaultTitle, lines: [] };
      
      const title = parts[0];
      const lines = parts.slice(1);
      return { title, lines };
    };

    const multParsed = parseInstructionBlock(multBlockText, "Multiplicación");
    const divParsed = parseInstructionBlock(divBlockText, "División");
    const zParsed = parseInstructionBlock(zBlockText, "Z + - Enteros");

    const getMathIcon = (title: string, index: number) => {
      const t = title.toLowerCase();
      if (t.includes("multiplicaci")) return "×";
      if (t.includes("divisi")) return "÷";
      if (t.includes("z ") || t.includes("entero") || t.includes("suma") || t.includes("resta") || t.includes("±")) return "±";
      return index === 0 ? "×" : index === 1 ? "÷" : "±";
    };

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <ActividadIcon />
          <div>
            <h3 
              className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider [&_strong]:font-extrabold"
              dangerouslySetInnerHTML={{ __html: formatRichHtml(titleText || 'ACTIVIDAD DE REPASO') }}
            />
            {subtitleText ? (
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1.5 space-y-1">
                {subtitleText.split('\n').map((line, lIdx) => (
                  <p key={lIdx} dangerouslySetInnerHTML={{ __html: formatRichHtml(line) }} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Realizar las siguientes operaciones en el cuaderno.
              </p>
            )}
          </div>
        </div>

        {/* 3-Column Table Grid */}
        <div className="w-full bg-white dark:bg-[#202020] border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          {/* Header row */}
          <div className="grid grid-cols-3 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-150 dark:border-gray-800 text-center font-bold text-sm tracking-wider select-none divide-x divide-gray-150 dark:divide-gray-800">
            {/* Col 1 Header: Multiplicación */}
            <div className="p-5 flex flex-col items-center justify-between gap-3 text-orange-600 dark:text-orange-400">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white font-extrabold text-base shadow-xs select-none">
                  {getMathIcon(multParsed.title, 0)}
                </span>
                <span className="text-base font-black uppercase tracking-wider">{multParsed.title}</span>
              </div>
              {multParsed.lines.length > 0 && (
                <div className="w-full text-left bg-orange-500/5 dark:bg-orange-500/10 border border-orange-100/50 dark:border-orange-500/10 rounded-xl p-3.5 text-xs font-semibold text-gray-700 dark:text-gray-300 space-y-1.5 normal-case leading-relaxed">
                  {multParsed.lines.map((line, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-1.5">
                      <span className="text-orange-500 font-bold select-none">•</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Col 2 Header: División */}
            <div className="p-5 flex flex-col items-center justify-between gap-3 text-blue-600 dark:text-blue-400">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white font-extrabold text-base shadow-xs select-none">
                  {getMathIcon(divParsed.title, 1)}
                </span>
                <span className="text-base font-black uppercase tracking-wider">{divParsed.title}</span>
              </div>
              {divParsed.lines.length > 0 && (
                <div className="w-full text-left bg-blue-500/5 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/10 rounded-xl p-3.5 text-xs font-semibold text-gray-700 dark:text-gray-300 space-y-1.5 normal-case leading-relaxed">
                  {divParsed.lines.map((line, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold select-none">•</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Col 3 Header: Z + - Enteros */}
            <div className="p-5 flex flex-col items-center justify-between gap-3 text-purple-600 dark:text-purple-400">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500 text-white font-extrabold text-sm shadow-xs select-none">
                  {getMathIcon(zParsed.title, 2)}
                </span>
                <span className="text-base font-black uppercase tracking-wider">{zParsed.title}</span>
              </div>
              {zParsed.lines.length > 0 && (
                <div className="w-full text-left bg-purple-500/5 dark:bg-purple-500/10 border border-purple-100/50 dark:border-purple-500/10 rounded-xl p-3.5 text-xs font-semibold text-gray-700 dark:text-gray-300 space-y-2 normal-case leading-relaxed">
                  {zParsed.lines.map((line, lIdx) => {
                    const isExample = line.toLowerCase().includes('ejemplo');
                    if (isExample) {
                      const parts = line.split(/ejemplo:\s*/i);
                      const beforeExample = parts[0]?.trim();
                      const exampleContent = parts[1]?.trim().replace(/\.$/, ''); // remove trailing dot
                      return (
                        <div key={lIdx} className="flex flex-col gap-1.5 mt-1">
                          {beforeExample && (
                            <div className="flex items-start gap-1.5">
                              <span className="text-purple-500 font-bold select-none">•</span>
                              <span>{beforeExample}</span>
                            </div>
                          )}
                          <div className="flex flex-col gap-1 pl-3.5">
                            <span className="font-bold text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-wider select-none">Ejemplo:</span>
                            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-bold">
                              {exampleContent?.split(',').map((ex, eIdx) => (
                                <span key={eIdx} className="bg-white dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200/50 select-all">
                                  {ex.replace(/\s+/g, '').replace(/(\+|-)/g, ' $1 ').trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={lIdx} className="flex items-start gap-1.5">
                        <span className="text-purple-500 font-bold select-none">•</span>
                        <span>{line}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Grid Body */}
          <div className="flex-1 divide-y divide-gray-150 dark:divide-gray-800 font-mono text-sm font-semibold text-gray-700 dark:text-gray-300">
            {Array.from({ length: 20 }).map((_, idx) => {
              const rowNum = idx + 1;
              return (
                <div key={idx} className="grid grid-cols-3 items-stretch text-center hover:bg-gray-50/20 dark:hover:bg-gray-800/5 transition-colors divide-x divide-gray-150 dark:divide-gray-800">
                  {/* Col 1: MULTIPLICACIÓN */}
                  <div className="px-4 py-4 flex items-center justify-start pl-6 md:pl-16 gap-1.5 select-all">
                    <span className="text-gray-400 font-bold text-xs w-6 text-right select-none">{rowNum}.</span>
                    <span className="hover:text-orange-500 transition-colors">{col1List[idx]?.replace(/x/g, '×')}</span>
                  </div>

                  {/* Col 2: DIVISIÓN */}
                  <div className="px-4 py-4 flex items-center justify-start pl-6 md:pl-16 gap-1.5 select-all">
                    <span className="text-gray-400 font-bold text-xs w-6 text-right select-none">{rowNum}.</span>
                    <span className="hover:text-blue-500 transition-colors">{col2List[idx]}</span>
                  </div>

                  {/* Col 3: Z + - Enteros */}
                  <div className="px-4 py-4 flex items-center justify-start pl-6 md:pl-16 gap-1.5 select-all">
                    <span className="text-gray-400 font-bold text-xs w-6 text-right select-none">{rowNum}.</span>
                    <span className="tracking-widest hover:text-purple-500 transition-colors">{col3List[idx]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSubtopicBlocks = (subtopic: Subtopic, subtopicIndex: number, currentTopic: Topic) => {
    const blocks = subtopic.blocks ?? [];
    const renderedIndices = new Set<number>();
    const elements: React.ReactNode[] = [];

    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
      if (renderedIndices.has(blockIndex)) continue;

      const block = blocks[blockIndex];
      const rawBlockText = block.content?.text?.trim();
      if (!rawBlockText) continue;

      // Check if this is the introductory "Números Enteros" content block  
      const isNumerosEnterosIntro = blockIndex === 0 && block.type === 'paragraph' && 
        subtopic.title && subtopic.title.toLowerCase().includes('enteros') &&
        !subtopic.title.toLowerCase().includes('adición') && 
        !subtopic.title.toLowerCase().includes('adicion') &&
        !subtopic.title.toLowerCase().includes('sustracción') &&
        !subtopic.title.toLowerCase().includes('sustraccion') &&
        !subtopic.title.toLowerCase().includes('multiplicación') &&
        !subtopic.title.toLowerCase().includes('multiplicacion') &&
        !subtopic.title.toLowerCase().includes('división') &&
        !subtopic.title.toLowerCase().includes('division');

      if (isNumerosEnterosIntro) {
        const introResult = renderNumerosEnterosIntroCard(blocks, blockIndex, `${currentTopic._id}-enterosintro-${subtopicIndex}`);
        if (introResult.element) {
          introResult.consumed.forEach(idx => renderedIndices.add(idx));
          elements.push(
            <div key={`enterosintro-${blockIndex}`} className="mt-6">
              {introResult.element}
            </div>
          );
          continue;
        }
      }

      // Check if the current block is <h3>División</h3> and the next block is the division start block
      const isHeaderDivision = block.type === 'paragraph' && 
        /<h3>Divisi[óo]n<\/h3>/i.test(rawBlockText);
      const nextBlock = blocks[blockIndex + 1];
      const nextBlockText = nextBlock?.content?.text?.trim() ?? '';
      const isNextDivisionStart = nextBlock && nextBlock.type === 'paragraph' && 
        /^\s*Dividir\s+\d+\s+entre\s+\d+/i.test(nextBlockText);

      if (isHeaderDivision && isNextDivisionStart) {
        const divisionStartIdx = blockIndex + 1;
        const stepBlockIndex = divisionStartIdx + 1;
        const stepBlock = blocks[stepBlockIndex];
        const stepBlockText = stepBlock?.content?.text?.trim() ?? '';
        
        if (stepBlock && /como\s+\d+\s*>\s*\d+\s+entonces\s+separamos/i.test(stepBlockText)) {
          renderedIndices.add(blockIndex); // consume title block
          renderedIndices.add(divisionStartIdx); // consume division start block
          renderedIndices.add(stepBlockIndex); // consume step block
          
          let block28Idx = -1;
          let block29Idx = -1;
          let block28Text = '';
          let block29Text = '';

          if (blocks[stepBlockIndex + 1]) {
            const b28Text = blocks[stepBlockIndex + 1].content?.text?.trim() ?? '';
            if (b28Text.toLowerCase().includes('ahora buscamos') || b28Text.toLowerCase().includes('multiplicado')) {
              block28Idx = stepBlockIndex + 1;
              block28Text = b28Text;
              renderedIndices.add(block28Idx);
            }
          }

          if (blocks[stepBlockIndex + 2]) {
            const b29Text = blocks[stepBlockIndex + 2].content?.text?.trim() ?? '';
            if (b29Text.toLowerCase().includes('sea igual') || b29Text.includes('=')) {
              block29Idx = stepBlockIndex + 2;
              block29Text = b29Text;
              renderedIndices.add(block29Idx);
            }
          }

          elements.push(
            <div key={`division-${blockIndex}`} className="mt-8 mb-8">
              {renderDynamicDivision(nextBlockText, stepBlockText, block28Text, block29Text, subtopicIndex, rawBlockText)}
            </div>
          );
          continue;
        }
      }

      const isDivisionStart = block.type === 'paragraph' && 
        /^\s*Dividir\s+\d+\s+entre\s+\d+/i.test(rawBlockText);

      if (isDivisionStart) {
        const stepBlockIndex = blockIndex + 1;
        const stepBlock = blocks[stepBlockIndex];
        const stepBlockText = stepBlock?.content?.text?.trim() ?? '';
        
        if (stepBlock && /como\s+\d+\s*>\s*\d+\s+entonces\s+separamos/i.test(stepBlockText)) {
          renderedIndices.add(blockIndex);
          renderedIndices.add(stepBlockIndex);
          
          let block28Idx = -1;
          let block29Idx = -1;
          let block28Text = '';
          let block29Text = '';

          if (blocks[stepBlockIndex + 1]) {
            const b28Text = blocks[stepBlockIndex + 1].content?.text?.trim() ?? '';
            if (b28Text.toLowerCase().includes('ahora buscamos') || b28Text.toLowerCase().includes('multiplicado')) {
              block28Idx = stepBlockIndex + 1;
              block28Text = b28Text;
              renderedIndices.add(block28Idx);
            }
          }

          if (blocks[stepBlockIndex + 2]) {
            const b29Text = blocks[stepBlockIndex + 2].content?.text?.trim() ?? '';
            if (b29Text.toLowerCase().includes('sea igual') || b29Text.includes('=')) {
              block29Idx = stepBlockIndex + 2;
              block29Text = b29Text;
              renderedIndices.add(block29Idx);
            }
          }

          elements.push(
            <div key={`division-${blockIndex}`} className="mt-8 mb-8">
              {renderDynamicDivision(rawBlockText, stepBlockText, block28Text, block29Text, subtopicIndex)}
            </div>
          );
          continue;
        }
      }

      // Check if the block is "Recordar Números Primos"
      const isPrimosStart = block.type === 'paragraph' && 
        /Recordar\s+N[úu]meros\s+Primos/i.test(rawBlockText);

      if (isPrimosStart) {
        const nextBlock = blocks[blockIndex + 1];
        const nextBlockText = nextBlock?.content?.text?.trim() ?? '';
        const isPrimosList = nextBlock && /^\d+(?:\s+\d+)+$/.test(nextBlockText);

        if (isPrimosList) {
          renderedIndices.add(blockIndex);
          renderedIndices.add(blockIndex + 1);

          // Find the examples block in the subtopic blocks (search only within the next few blocks to avoid stealing blocks from the end)
          let examplesBlockIdx = -1;
          let examplesBlockText = '';
          const maxSearchIdx = Math.min(blocks.length, blockIndex + 5);
          for (let j = blockIndex + 2; j < maxSearchIdx; j++) {
            const bText = blocks[j].content?.text ?? '';
            if (bText.includes('2 = { 1, 2 }') || bText.includes('2 = {1, 2}')) {
              examplesBlockIdx = j;
              examplesBlockText = bText;
              break;
            }
          }

          if (examplesBlockIdx !== -1) {
            renderedIndices.add(examplesBlockIdx);
            if (examplesBlockIdx > 0) {
              const prevText = blocks[examplesBlockIdx - 1].content?.text?.trim() ?? '';
              if (prevText.toLowerCase() === 'recuerda' || prevText.toLowerCase() === 'recuerde') {
                renderedIndices.add(examplesBlockIdx - 1);
              }
            }
          }

          elements.push(
            <div key={`primes-${blockIndex}`} className="mt-8 mb-8">
              {renderPrimesSection(rawBlockText, nextBlockText, examplesBlockText, subtopicIndex)}
            </div>
          );
          continue;
        }
      }

      // Check if the block is "NÚMERO COMPUESTO" block to render as standalone card
      const isCompuestoStart = block.type === 'paragraph' && 
        /numero\s+compuesto/i.test(normalizeText(rawBlockText));

      if (isCompuestoStart) {
        renderedIndices.add(blockIndex);
        let compuestoBody = '';
        if (blocks[blockIndex + 1]) {
          compuestoBody = blocks[blockIndex + 1].content?.text ?? '';
          renderedIndices.add(blockIndex + 1);
        }
        elements.push(
          <div key={`compuesto-${blockIndex}`} className="mt-6">
            {renderCompuestoCard(rawBlockText, compuestoBody, `${currentTopic._id}-compuesto-${subtopicIndex}-${blockIndex}`)}
          </div>
        );
        continue;
      }

      // Check if the block is "Recuerda" block
      const isRecuerdaStart = block.type === 'paragraph' && 
        /recuerda/i.test(normalizeText(rawBlockText)) && 
        rawBlockText.length < 30;

      if (isRecuerdaStart) {
        renderedIndices.add(blockIndex);
        let recuerdaBody = '';
        if (blocks[blockIndex + 1]) {
          recuerdaBody = blocks[blockIndex + 1].content?.text ?? '';
          renderedIndices.add(blockIndex + 1);
        }
        elements.push(
          <div key={`recuerda-${blockIndex}`} className="mt-6">
            {renderRecuerdaCard(rawBlockText, recuerdaBody, `${currentTopic._id}-recuerda-${subtopicIndex}-${blockIndex}`)}
          </div>
        );
        continue;
      }

      // Check if the block is "Ejemplos en la recta numérica"
      const isRectaNumerica = block.type === 'paragraph' && 
        /recta\s+num[eé]rica/i.test(normalizeText(rawBlockText));

      if (isRectaNumerica) {
        renderedIndices.add(blockIndex);
        let rectaNumericaBody = '';
        
        const hasEquations = (text: string) => {
          return /(\d+)\s*\)\s*(-?\d+)\s*([\+\-])\s*(?:\(?(-?\d+)\)?)\s*=\s*(-?\d+)/.test(text);
        };

        if (hasEquations(rawBlockText)) {
          rectaNumericaBody = rawBlockText;
        } else if (blocks[blockIndex + 1]) {
          const nextText = blocks[blockIndex + 1].content?.text ?? '';
          if (hasEquations(nextText)) {
            rectaNumericaBody = nextText;
            renderedIndices.add(blockIndex + 1);
          }
        }

        elements.push(
          <div key={`rectanumerica-${blockIndex}`} className="mt-6">
            {renderRectaNumericaCard(rawBlockText, rectaNumericaBody, `${currentTopic._id}-rectanumerica-${subtopicIndex}-${blockIndex}`)}
          </div>
        );
        continue;
      }

      // Check if the block is "Ley de Signos"
      const isLeySignos = block.type === 'paragraph' && (
        /ley\s+de\s+(?:los\s+)?signos/i.test(normalizeText(rawBlockText)) || 
        /[\+\-]\s*(?:x|\*|\.|por)\s*[\+\-]\s*=/i.test(rawBlockText) ||
        /\([\+\-]\)\s*(?:x|\*|\.|\s)*\([\+\-]\)\s*=/i.test(rawBlockText)
      );

      if (isLeySignos) {
        renderedIndices.add(blockIndex);
        elements.push(
          <div key={`leysignos-${blockIndex}`} className="mt-6">
            {renderLeySignosCard(rawBlockText, `${currentTopic._id}-leysignos-${subtopicIndex}-${blockIndex}`)}
          </div>
        );
        continue;
      }

      // Check if the block is "DIVISIBILIDAD por 2" block to start DIVISIBILIDAD section
      const isDiv2Start = block.type === 'paragraph' && 
        /DIVISIBILIDAD\s+por\s+2/i.test(rawBlockText);

      if (isDiv2Start) {
        const div2HeaderIdx = blockIndex;
        const div2BodyIdx = blockIndex + 1;
        let div3HeaderIdx = -1;
        let div3Body1Idx = -1;
        let div3Body2Idx = -1;
        let div5HeaderIdx = -1;
        let div5BodyIdx = -1;

        for (let j = 0; j < blocks.length; j++) {
          const bText = blocks[j].content?.text?.trim() ?? '';
          if (/DIVISIBILIDAD\s+por\s+3/i.test(bText)) {
            div3HeaderIdx = j;
            div3Body1Idx = j + 1;
            div3Body2Idx = j + 2;
          } else if (/DIVISIBILIDAD\s+por\s+5/i.test(bText)) {
            div5HeaderIdx = j;
            div5BodyIdx = j + 1;
          }
        }

        if (div3HeaderIdx !== -1 && div5HeaderIdx !== -1) {
          renderedIndices.add(div2HeaderIdx);
          renderedIndices.add(div2BodyIdx);
          renderedIndices.add(div3HeaderIdx);
          renderedIndices.add(div3Body1Idx);
          renderedIndices.add(div3Body2Idx);
          renderedIndices.add(div5HeaderIdx);
          renderedIndices.add(div5BodyIdx);

          const div2Text = blocks[div2BodyIdx]?.content?.text ?? '';
          const div3Block37Text = blocks[div3Body1Idx]?.content?.text ?? '';
          const div3Block38Text = blocks[div3Body2Idx]?.content?.text ?? '';
          const div5Text = blocks[div5BodyIdx]?.content?.text ?? '';

          elements.push(
            <div key={`divisibilidad-${blockIndex}`} className="mt-8 mb-8">
              {renderDivisibilidadSection(subtopicIndex, div2Text, div3Block37Text, div3Block38Text, div5Text)}
            </div>
          );
          continue;
        }
      }

      // Check if the block is "Actividad de repaso" to start review activity section
      const isActividadStart = block.type === 'paragraph' && 
        /Actividad\s+de\s+repaso/i.test(rawBlockText);
      
      if (isActividadStart) {
        renderedIndices.add(blockIndex);
        
        let block44Text = "";
        let block51Text = "";
        let multBlockText = "";
        let divBlockText = "";
        let zBlockText = "";
        let subtitleText = "";
        
        // Scan subsequent blocks to dynamically identify instructions and exercises
        for (let j = blockIndex + 1; j < blocks.length; j++) {
          const b = blocks[j];
          const txt = b.content?.text ?? "";
          const normTxt = txt.trim().toLowerCase();
          
          if (/1\.\s+/i.test(txt) && !/11\.\s+/i.test(txt)) {
            block44Text = txt;
            renderedIndices.add(j);
          } else if (/11\.\s+/i.test(txt)) {
            block51Text = txt;
            renderedIndices.add(j);
          } else if (normTxt.startsWith("multiplicaci")) {
            multBlockText = txt;
            renderedIndices.add(j);
          } else if (normTxt.startsWith("divisi")) {
            divBlockText = txt;
            renderedIndices.add(j);
          } else if (normTxt.startsWith("z ") || normTxt.includes("enteros")) {
            zBlockText = txt;
            renderedIndices.add(j);
          } else if (normTxt.includes("colocando cada") || normTxt.includes("en el cuaderno") || normTxt.includes("adquirir habilidad") || normTxt.includes("forma vertical")) {
            subtitleText = txt;
            renderedIndices.add(j);
          }
        }
        
        elements.push(
          <div key={`actividad-repaso-${blockIndex}`} className="mt-8 mb-8">
            {renderActividadRepasoSection(
              subtopicIndex,
              rawBlockText,
              subtitleText,
              multBlockText,
              divBlockText,
              zBlockText,
              block44Text,
              block51Text
            )}
          </div>
        );
        continue;
      }

      const hasImageBackMarker = rawBlockText.includes(imageBackMarker);
      const blockText = rawBlockText.split(imageBackMarker).join('').trim();

      renderedIndices.add(blockIndex);

      if (block.type === 'paragraph' && isOnlyParagraphImageMarker(blockText)) {
        elements.push(
          <div key={`paragraph-image-${blockIndex}`} className="my-6">
            {renderParagraphImages(
              getParagraphImageSources(blockText),
              `${currentTopic._id}-paragraph-image-${subtopicIndex}-${blockIndex}`
            )}
          </div>
        );
        continue;
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

        elements.push(
          hasCurrentCDUHeader ? (
            <div key={`math-${blockIndex}`}>
              {renderMathLayout(blockText, `${currentTopic._id}-${subtopicIndex}-${blockIndex}`, shouldShowSubtractionImage)}
            </div>
          ) : (
            <div
              key={`math-${blockIndex}`}
              className="overflow-x-auto rounded-xl border border-orange-100 bg-white p-4 font-mono text-sm text-gray-700 shadow-sm dark:border-orange-500/20 dark:bg-[#282828] dark:text-gray-200 whitespace-pre-wrap [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h4]:mb-3 [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-orange-600 [&_h4]:dark:text-orange-400"
              dangerouslySetInnerHTML={{ __html: formatRichHtml(blockText) }}
            />
          )
        );
      } else {
        elements.push(
          renderDesignedParagraphBlock(
            blockText,
            `${currentTopic._id}-paragraph-${subtopicIndex}-${blockIndex}`
          )
        );
      }
    }

    return <div className="space-y-4">{elements}</div>;
  };


  const validateCurrentTopicAnswers = async () => {
    const currentTopic = getStepMeta().topic;
    if (!currentTopic) return false;

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

    const { topic: currentTopic, isExerciseStep } = getStepMeta();

    if (!currentTopic) return { title: 'Cargando...', content: null };

    if (isExerciseStep) {
      return {
        title: `Ejercicios - ${currentTopic.title}`,
        content: (
          <div className="grid gap-5">
            {currentTopic.exercises.map((exercise, index) => (
              <article key={index} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-orange-500/20 dark:bg-[#282828]">
                <div className="border-b border-orange-100 bg-orange-50/70 px-5 py-4 dark:border-orange-500/10 dark:bg-orange-500/10 sm:px-6">
                  <h3 className="flex items-center gap-3 text-lg font-extrabold text-slate-800 dark:text-white">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500 text-sm text-white shadow-md shadow-orange-500/20">
                      {index + 1}
                    </span>
                    Practica guiada
                  </h3>
                </div>
                <div className="space-y-5 p-5 sm:p-6">
                  <div className="rounded-2xl bg-slate-50 p-4 text-base leading-7 text-slate-700 dark:bg-[#1E1F25] dark:text-gray-200">
                    {getOperationMatch(exercise.statement) ? (
                      <div className="space-y-3">
                        <div
                          dangerouslySetInnerHTML={{ __html: formatRichHtml(exercise.statement.replace(getOperationMatch(exercise.statement)?.[0] ?? '', '').trim()) }}
                        />
                        <div className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 font-mono text-xl font-extrabold text-white">
                          {getOperationMatch(exercise.statement)?.[0]}
                        </div>
                      </div>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: formatRichHtml(exercise.statement) }} />
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                  {exercise.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      htmlFor={`option-${index}-${optIndex}`}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-all ${
                        selectedAnswers[index] === optIndex.toString()
                          ? 'border-orange-400 bg-orange-50 shadow-sm dark:border-orange-400 dark:bg-orange-500/15'
                          : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/50 dark:border-gray-700 dark:bg-[#282828] dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`exercise-${index}`}
                        id={`option-${index}-${optIndex}`}
                        value={option}
                        checked={selectedAnswers[index] === optIndex.toString()}
                        onChange={() => handleAnswerSelect(index, optIndex)}
                        className="sr-only"
                      />
                      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                        selectedAnswers[index] === optIndex.toString()
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-[#1E1F25] dark:text-gray-300'
                      }`}>
                        {indexToLetter(optIndex)}
                      </span>
                      <span
                        className="min-w-0 pt-1 text-sm font-semibold leading-6 text-slate-700 dark:text-gray-200"
                        dangerouslySetInnerHTML={{ __html: formatRichHtml(option) }}
                      />
                    </label>
                  ))}
                </div>
                </div>
              </article>
            ))}
          </div>
        )
      };
    }

    return {
      title: currentTopic.title,
      content: (
        <div className="max-w-none space-y-8">
          {((currentTopic.subtopics?.length
            ? currentTopic.subtopics
            : currentTopic.description
              ? [{ title: '', blocks: [{ type: 'paragraph' as const, content: { text: currentTopic.description } }] }]
              : []
          )).map((subtopic, subtopicIndex) => {
            const isTeoriaDeNumerosSubtopic = subtopic.title && (
              subtopic.title.toLowerCase().includes('teoría de números') ||
              subtopic.title.toLowerCase().includes('teoria de numeros')
            );

            if (isTeoriaDeNumerosSubtopic) {
              return (
                <section key={`${currentTopic._id}-subtopic-${subtopicIndex}`} className="space-y-4">
                  {renderTeoriaDeNumerosSubtopic(subtopic, `${currentTopic._id}-subtopic-${subtopicIndex}`, subtopicIndex)}
                </section>
              );
            }

            const isNumerosEnterosSubtopic = subtopic.title && (
              subtopic.title.toLowerCase().includes('enteros')
            );

            if (isNumerosEnterosSubtopic) {
              return (
                <section key={`${currentTopic._id}-subtopic-${subtopicIndex}`} className="space-y-4">
                  {renderNumerosEnterosSubtopic(subtopic, `${currentTopic._id}-subtopic-${subtopicIndex}`, subtopicIndex, currentTopic)}
                </section>
              );
            }

            return (
              <section key={`${currentTopic._id}-subtopic-${subtopicIndex}`} className="space-y-4">
                {subtopic.title && (
                  <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900">
                      <FiBookOpen className="h-5 w-5" />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: formatRichHtml(subtopic.title) }} />
                  </h3>
                )}

                {renderSubtopicBlocks(subtopic, subtopicIndex, currentTopic)}
              </section>
            );
          })}
        </div>
      )
    };
  };

  const { title, content } = getCurrentContent();
  const isCurrentExerciseStep = getStepMeta().isExerciseStep;
  const activeCommentsTab = isCurrentExerciseStep ? 'contributions' : commentsTab;
  const currentTopicForComments = getCurrentTopic();
  const currentTopicIdForComments = getTopicId(currentTopicForComments);
  const displayedComments = currentTopicIdForComments ? getFallbackQuestions(currentTopicIdForComments) : [];
  const currentTopicImageSrc = currentTopicForComments?.image?.trim()
    ? currentTopicForComments.image.trim().startsWith('/') || currentTopicForComments.image.trim().startsWith('http')
      ? currentTopicForComments.image.trim()
      : `/${currentTopicForComments.image.trim()}`
    : '';

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
    const isExerciseStep = getStepMeta().isExerciseStep;

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
    const currentTopic = getStepMeta().topic;
    if (!currentTopic) return;

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
    setCurrentStep(getTopicStartStep(topicIndex));
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
                {process.env.NODE_ENV === 'development' && !showChat && isCurrentExerciseStep && (
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
                          '--firework-travel': `-${burst.travel}vh`
                        } as FireworkStyle}
                      />
                    ))}
                    {fireworkEffects.bursts.map((burst) => (
                      <span
                        key={`trail-${burst.id}`}
                        className="module-firework-trail absolute top-[100vh] h-28 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-100 via-orange-400 to-transparent opacity-80"
                        style={{
                          left: `${burst.left}%`,
                          animationDelay: `${burst.delay}s`,
                          '--firework-travel': `-${Math.max(16, burst.travel - 12)}vh`
                        } as FireworkStyle}
                      />
                    ))}
                    {fireworkEffects.bursts.map((burst) => (
                      <span
                        key={`flash-${burst.id}`}
                        className="module-firework-flash absolute top-[100vh] h-24 w-24 -translate-x-1/2 rounded-full bg-white"
                        style={{
                          left: `${burst.left}%`,
                          animationDelay: `${burst.delay + 0.74}s`,
                          '--firework-travel': `-${burst.travel}vh`
                        } as FireworkStyle}
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
                          '--firework-burst-x': `${spark.burstX}px`,
                          '--firework-burst-y': `${spark.burstY}px`,
                          '--firework-travel': `-${spark.travel}vh`,
                          '--firework-angle': `${spark.angle}deg`
                        } as FireworkStyle}
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
                          <div className="min-w-0 flex-1">
                            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-white">{title}</h2>
                            {currentTopicImageSrc && (
                              <div className="mt-5 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm dark:border-orange-500/20 dark:bg-[#282828]">
                                <Image
                                  src={currentTopicImageSrc}
                                  alt={currentTopicForComments?.title || title}
                                  width={960}
                                  height={420}
                                  className="h-auto max-h-[420px] w-full object-contain"
                                  priority
                                />
                              </div>
                            )}
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
                          const isActiveTopic = getStepMeta().topicIndex === index;

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
