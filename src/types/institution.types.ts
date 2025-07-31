export interface Location {
  city: string;
  region: string;
  address: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'Universidad' | 'Colegio' | 'Escuela' | 'Tecnico';
  location: Location;
  email: string;
  createdAt?: string;
  status?: 'active' | 'inactive';
}

export interface CreateInstitutionData {
  name: string;
  type: Institution['type'];
  city: string;
  region: string;
  address: string;
  email: string;
} 