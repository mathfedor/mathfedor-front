export interface FZEngine {
  crear: (ex: any, tipo?: string) => string;
  st: Record<string, any>;
  n: number;
  [key: string]: any;
}

export const FZ: FZEngine;
