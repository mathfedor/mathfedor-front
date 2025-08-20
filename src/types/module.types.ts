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
  topics: Array<{
    title: string;
    description: string;
    image: string;
    completed: boolean;
    duration: string;
    exercises: Array<{
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
    }>;
  }>;
}

export interface PurchasedModule {
  _id: string;
  title: string;
  description: string;
  purchaseDate: string;
  status: 'active' | 'expired';
} 