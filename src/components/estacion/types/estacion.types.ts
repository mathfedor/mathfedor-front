export type MecanicaTipo =
  | 'opciones'
  | 'entradas'
  | 'ordenar'
  | 'armar'
  | 'ubicar'
  | 'ahorro'
  | 'fraccion';

export interface EscenaData {
  tipo:
    | 'dinero'
    | 'semillas'
    | 'planta'
    | 'podio'
    | 'dados'
    | 'domino'
    | 'bolsa'
    | 'figura'
    | 'cuadricula'
    | 'cubos'
    | 'barras'
    | 'picto'
    | 'reloj'
    | 'linea';
  args: any[];
}

export interface CampoEntrada {
  etq: string;
  esp: number;
  tol?: number;
}

export interface OpcionEspecial {
  escena?: EscenaData;
  v: string | number;
}

export interface RondaData {
  consigna?: string;
  ayuda?: string;
  escena?: EscenaData;
  ops?: Array<string | number | OpcionEspecial>;
  corr?: string | number;
  campos?: CampoEntrada[];
  items?: Array<[string, number]>;
  meta?: number;
  piezas?: number[];
  n?: number;
  k?: number;
  recibo?: number;
  pago?: number;
  queda?: number;
}

export interface UbicarContenedor {
  id: string;
  e: string;
  n: string;
}

export interface UbicarItem {
  e: string;
  svg?: string;
  t: string;
  c: string;
  p?: number;
}

export interface UbicarData {
  id?: string;
  t: string;
  et: string;
  o: string;
  frase: string;
  contenedores: UbicarContenedor[];
  items: UbicarItem[];
}

export interface NivelData {
  t: string;
  et?: string;
  o: string;
  mec: MecanicaTipo;
  frase?: string;
  ahorro?: boolean;
  expres?: boolean;
  datos?: {
    rondas?: RondaData[];
  } & Partial<UbicarData>;
}

export interface ModuloEstacion {
  id: string;
  nombre: string;
  mapa: [string, string?];
  icono: string;
  color: string;
  desc: string;
  niveles: NivelData[];
}

export interface ItemCatalogo {
  n: string;
  p: number;
  tier: 'eco' | 'com' | 'pre';
  ic: string;
}

export interface JuegoZona {
  id: string;
  archivo: string;
  emoji: string;
  nombre: string;
  desc: string;
  final: string;
}

export interface BitacoraItem {
  dia: number;
  item: string;
  costo: number;
  pago: number;
  cambio: number;
}

export interface RegistroNivel {
  int: number;
  ok: number;
  seg: number;
  est: number;
}

export interface EstadoEstacion {
  progreso: Record<string, number>; // idNivel -> estrellas (1..3)
  saldo: number;
  vidas: number;
  dia: number;
  bitacora: BitacoraItem[];
  meta: string | null;
  registro: Record<string, RegistroNivel>;
  nombre: string;
}
