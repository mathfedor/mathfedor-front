export interface Location {
  city: string;
  region: string;
  address: string;
}

export interface Branch {
  id: string;
  _id?: string;
  name: string;
  address: string;
  institutionId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Classroom {
  id: string;
  _id?: string;
  name: string;
  code: string;
  capacity?: number | null;
  branchId: string;
  teacherIds?: string[];
  teachers?: Array<{
    id: string;
    _id?: string;
    name: string;
    email: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Institution {
  id: string;
  _id?: string;
  name: string;
  type: 'Universidad' | 'Colegio' | 'Escuela' | 'Tecnico';
  location: Location;
  email: string;
  createdAt?: string;
  status?: 'active' | 'inactive';
  branches?: Branch[];
}

export interface CreateInstitutionData {
  name: string;
  type: Institution['type'];
  location: Location;
  email: string;
}

export interface CreateBranchData {
  name: string;
  address: string;
}

export type UpdateBranchData = Partial<CreateBranchData>;

export interface CreateClassroomData {
  name: string;
  code: string;
  capacity?: number | null;
  teacherIds?: string[];
}

export type UpdateClassroomData = Partial<CreateClassroomData>;
