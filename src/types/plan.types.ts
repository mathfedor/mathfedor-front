export type PlanBillingPeriod = 'trial' | 'monthly' | 'semiannual' | 'annual' | 'custom';

export interface FamilyPricing {
  secondModulePrice: number;
  additionalModulePrice: number;
}

export interface Plan {
  _id: string;
  name: string;
  slug: string;
  billingPeriod: PlanBillingPeriod;
  price: number;
  trialDays: number;
  pricePerDay: number;
  pricePerMonth: number;
  digitalBookIncluded: boolean;
  fedorZoneIncluded: boolean;
  excelModulesDescription: string;
  familyPricing?: FamilyPricing;
  isActive: boolean;
  order: number;
  badge: string;
  features: string[];
  isCustomQuote: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlanData {
  name: string;
  slug: string;
  billingPeriod: PlanBillingPeriod;
  price: number;
  trialDays?: number;
  pricePerDay?: number;
  pricePerMonth?: number;
  digitalBookIncluded?: boolean;
  fedorZoneIncluded?: boolean;
  excelModulesDescription?: string;
  familyPricing?: FamilyPricing;
  isActive?: boolean;
  order?: number;
  badge?: string;
  features?: string[];
  isCustomQuote?: boolean;
}

export type UpdatePlanData = Partial<CreatePlanData>;
