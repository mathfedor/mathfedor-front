export interface FzEngine {
  st: Record<string, any>;
  n: number;
  crear: (ex: any, modo: 'ej' | 'ex') => string;
  detectar: (q: string, ctx?: string) => any;
  serieSalto?: (id: string) => void;
  min?: (id: string) => void;
  toque?: (id: string) => void;
  [key: string]: any;
}

export const FZ: FzEngine;
