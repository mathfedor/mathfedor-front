import api from './api.config';
import { Plan, CreatePlanData, UpdatePlanData } from '@/types/plan.types';

export const DEFAULT_PLANS: Plan[] = [
  {
    _id: 'default-trial',
    name: 'Prueba 17 días',
    slug: 'prueba-17-dias',
    billingPeriod: 'trial',
    price: 0,
    trialDays: 17,
    pricePerDay: 0,
    pricePerMonth: 0,
    digitalBookIncluded: true,
    fedorZoneIncluded: true,
    excelModulesDescription: 'No incluye módulos en Excel',
    isActive: true,
    order: 0,
    badge: '17 Días Gratis',
    isCustomQuote: false,
    features: [
      'Acceso completo por 17 días',
      'Libro digital interactivo completo',
      'Zona Fedor completa',
      'Sin ingresar tarjeta de crédito',
    ],
  },
  {
    _id: 'default-monthly',
    name: 'Mensual',
    slug: 'mensual',
    billingPeriod: 'monthly',
    price: 24999,
    trialDays: 0,
    pricePerDay: 833,
    pricePerMonth: 24999,
    digitalBookIncluded: true,
    fedorZoneIncluded: true,
    excelModulesDescription: '1° = Libro 2. 2° a 11° = Libro 3.',
    isActive: true,
    order: 1,
    badge: '',
    isCustomQuote: false,
    features: [
      'Facturación mensual flexible',
      'Equivale a solo $833 al día',
      'Libro digital completo',
      'Zona Fedor completa',
      'Cortesía: 1° = Libro 2 / 2° a 11° = Libro 3 en Excel',
    ],
  },
  {
    _id: 'default-semiannual',
    name: 'Semestral',
    slug: 'semestral',
    billingPeriod: 'semiannual',
    price: 109999,
    trialDays: 0,
    pricePerDay: 611,
    pricePerMonth: 18333,
    digitalBookIncluded: true,
    fedorZoneIncluded: true,
    excelModulesDescription: 'El grado en curso. Todos los libros',
    isActive: true,
    order: 2,
    badge: 'Ahorra 26%',
    isCustomQuote: false,
    features: [
      'Facturación semestral (6 meses)',
      'Equivale a $18.333 / mes (solo $611 / día)',
      'Libro digital completo',
      'Zona Fedor completa',
      'Todos los libros en Excel del grado en curso',
    ],
  },
  {
    _id: 'default-annual',
    name: 'Anual',
    slug: 'anual',
    billingPeriod: 'annual',
    price: 179999,
    trialDays: 0,
    pricePerDay: 493,
    pricePerMonth: 15000,
    digitalBookIncluded: true,
    fedorZoneIncluded: true,
    excelModulesDescription: 'El grado en curso. Todos los libros',
    familyPricing: {
      secondModulePrice: 120000,
      additionalModulePrice: 80000,
    },
    isActive: true,
    order: 3,
    badge: 'Más Popular · Ahorra 40%',
    isCustomQuote: false,
    features: [
      'Facturación anual (12 meses)',
      'Equivale a $15.000 / mes (solo $493 / día)',
      'Libro digital interactivo completo',
      'Zona Fedor completa',
      'Todos los libros en Excel del grado en curso',
      'Beneficio familiar: 2do módulo a $120.000 y a partir del 3ero a solo $80.000 c/u',
    ],
  },
  {
    _id: 'default-institution',
    name: 'Institución',
    slug: 'institucion',
    billingPeriod: 'custom',
    price: 0,
    trialDays: 0,
    pricePerDay: 0,
    pricePerMonth: 0,
    digitalBookIncluded: true,
    fedorZoneIncluded: true,
    excelModulesDescription: 'Todos, sin límite',
    isActive: true,
    order: 4,
    badge: 'Colegios e Instituciones',
    isCustomQuote: true,
    features: [
      'Licencias ilimitadas para docentes y estudiantes',
      'Libro digital y Zona Fedor completa',
      'Todos los módulos en Excel sin límite',
      'Panel administrativo y analíticas de aula',
      'Soporte prioritario y acompañamiento pedagógico',
    ],
  },
];

class PlanService {
  /**
   * Obtiene todos los planes activos (público)
   */
  async getActivePlans(): Promise<Plan[]> {
    try {
      const response = await api.get<Plan[]>('/plans');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return DEFAULT_PLANS.filter((p) => p.isActive);
    } catch (err) {
      console.warn('Usando planes por defecto debido a fallo en API:', err);
      return DEFAULT_PLANS.filter((p) => p.isActive);
    }
  }

  /**
   * Obtiene todos los planes (incluyendo inactivos, para Admin)
   */
  async getAllPlans(): Promise<Plan[]> {
    try {
      const response = await api.get<Plan[]>('/plans?all=true');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return DEFAULT_PLANS;
    } catch (err) {
      console.warn('Usando planes por defecto debido a fallo en API:', err);
      return DEFAULT_PLANS;
    }
  }

  /**
   * Obtiene un plan por ID
   */
  async getPlanById(id: string): Promise<Plan> {
    try {
      const response = await api.get<Plan>(`/plans/${id}`);
      return response.data;
    } catch {
      const found = DEFAULT_PLANS.find((p) => p._id === id);
      if (found) return found;
      throw new Error(`Plan con ID ${id} no encontrado`);
    }
  }

  /**
   * Crea un nuevo plan (Admin)
   */
  async createPlan(data: CreatePlanData): Promise<Plan> {
    const response = await api.post<Plan>('/plans', data);
    return response.data;
  }

  /**
   * Actualiza un plan existente (Admin)
   */
  async updatePlan(id: string, data: UpdatePlanData): Promise<Plan> {
    const response = await api.put<Plan>(`/plans/${id}`, data);
    return response.data;
  }

  /**
   * Elimina un plan (Admin)
   */
  async deletePlan(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/plans/${id}`);
    return response.data;
  }
}

export const planService = new PlanService();
