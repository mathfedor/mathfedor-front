export interface LoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string;
}

export interface Student {
  country?: string | null;
  department?: string | null;
  city?: string | null;
  institution?: string | null;
  institutionId?: string | null;
  branchId?: string | null;
  classroomId?: string | null;
  name?: string | null;
  email?: string | null;
  legalRepresentativeDeclarationAccepted?: boolean | null;
  legalRepresentativeDeclarationAcceptedAt?: string | null;
  minorDataTreatmentAccepted?: boolean | null;
  minorDataTreatmentAcceptedAt?: string | null;
  minorDataTreatmentDocumentVersion?: string | null;
  guardianName?: string | null;
  guardianEmail?: string | null;
  guardianDocument?: string | null;
  guardianRelationship?: string | null;
}

export interface LegalConsentEvidence {
  termsAndPrivacyAccepted?: boolean;
  termsVersion?: string;
  privacyPolicyVersion?: string;
  commercialCommunicationsAccepted?: boolean;
  commercialCommunicationsAcceptedAt?: string | null;
  legalRepresentativeDeclarationAccepted?: boolean;
  legalRepresentativeDeclarationAcceptedAt?: string | null;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  lastName?: string;
  avatar?: string;
  institutionId?: string | null;
  student?: Student;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  rol: string;
  institutionId?: string;
  student?: Student;
  recaptchaToken?: string;
  legalConsents?: LegalConsentEvidence;
}

export interface RegisterUserWithRolePayload {
  name: string;
  email: string;
  password: string;
  role: string;
  institutionId?: string;
  student?: Student;
  recaptchaToken?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  ok: boolean;
  message?: string;
} 
