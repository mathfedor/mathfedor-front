export interface ModuleFormData {
  title: string;
  description: string;
  tags: string[];
  duration: string;
  file: File | null;
  group: string;
  price: number;
  imageName: string;
  status?: string;
}

export interface TopicBlock {
  type: string;
  content?: any;
}

export interface Subtopic {
  title: string;
  blocks?: TopicBlock[];
}

export interface ExerciseItem {
  label?: string;
  answerType?: 'numeric' | 'text';
  expectedAnswers?: number | string | Array<number | string>;
}

export interface ExampleExercise {
  statement?: string;
  interactionType?: string;
  items?: ExerciseItem[];
  orderMatters?: boolean;
  layout?: any;
  values?: string;
}

export interface ModuleExercise {
  statement: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  type?: string;
  template?: string;
  variables?: string[];
  defaultValues?: number[];
  range?: number[];
  image?: string | null;
}

export interface ModuleTopic {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  completed?: boolean;
  duration?: string;
  sheet?: string;
  subtopics?: Subtopic[];
  exampleExercises?: ExampleExercise[];
  exercises?: ModuleExercise[];
}

export interface Module {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  group: string;
  createdBy: string;
  createdAt: string;
  price: number;
  status: string;
  image: string;
  published?: boolean;
  slug?: string;
  units?: any[];
  bookCurriculum?: any;
  topics: ModuleTopic[];
}

export interface PurchasedModule {
  _id: string;
  title: string;
  description: string;
  purchaseDate: string;
  status: 'active' | 'expired';
} 