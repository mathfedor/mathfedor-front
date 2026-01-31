export interface Exercises {
  statement: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExampleExercises {
  values: string;
}
export interface Topic {
  title: string;
  description: string;
  image: string;
  completed: boolean;
  duration: string;
  exercises: Exercises[];
  exampleExercises: ExampleExercises[];
}

export interface DiagnosticConfig {
  _id: string;
  title: string;
  description: string;
  topics: Topic[];
  group: string;
  createdBy: string;
  createdAt: string;
  published?: boolean;
}

export interface DiagnosticFormData {
  title: string;
  description: string;
  topics: string[];
  group: string;
  file: File | null;
}