import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { purchaseService } from '@/services/purchase.service';
import { authService } from '@/services/auth.service';
import { moduleService, Module } from '@/services/module.service';
import {
  isModuleInFreeTrial,
  isPurchaseExpired,
  getPurchaseExpirationDate,
  type ModuleAccessInfo,
  type ModuleAccessType,
} from '@/constants/module-access.constants';

interface ModuleAccessContextType {
  /** @deprecated Usa hasExerciseAccess en su lugar. Se mantiene por retrocompatibilidad. */
  hasAccess: (moduleId: string) => boolean;
  /** Verifica si el usuario puede acceder a los ejercicios del módulo (incluye trial gratuito). */
  hasExerciseAccess: (moduleId: string) => boolean;
  /** Verifica si el usuario puede acceder a las descargas del módulo (requiere compra activa). */
  hasDownloadAccess: (moduleId: string) => boolean;
  /** Obtiene información detallada del tipo de acceso al módulo. */
  getAccessInfo: (moduleId: string) => ModuleAccessInfo;
  moduleAccess: Record<string, ModuleAccessInfo>;
  isLoading: boolean;
  refreshAccess: () => Promise<void>;
}

const ModuleAccessContext = createContext<ModuleAccessContextType | undefined>(undefined);

export function ModuleAccessProvider({ children }: { children: ReactNode }) {
  const [moduleAccess, setModuleAccess] = useState<Record<string, ModuleAccessInfo>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadModuleAccess = useCallback(async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        setModuleAccess({});
        return;
      }

      // Obtener todos los módulos (incluye el campo group)
      const modules = await moduleService.getAllModules();

      // Obtener las compras del usuario
      const purchases = await purchaseService.getUserPurchases(user.id);

      const accessMap: Record<string, ModuleAccessInfo> = {};

      for (const module of modules) {
        const moduleId = module._id;
        const group = module.group;

        // Buscar compra aprobada para este módulo
        const purchase = purchases.find(
          p => p?.module_id === moduleId && p?.transaction?.status === 'APPROVED'
        );

        let accessType: ModuleAccessType = 'none';
        let canAccessExercises = false;
        let canAccessDownloads = false;
        let expiresAt: Date | undefined;

        if (purchase && !isPurchaseExpired(purchase.purchase_date)) {
          // Compra activa (menos de 1 año)
          accessType = 'purchased';
          canAccessExercises = true;
          canAccessDownloads = true;
          expiresAt = getPurchaseExpirationDate(purchase.purchase_date);
        } else if (purchase && isPurchaseExpired(purchase.purchase_date)) {
          // Compra expirada (más de 1 año)
          accessType = 'expired';
          canAccessExercises = false;
          canAccessDownloads = false;
          expiresAt = getPurchaseExpirationDate(purchase.purchase_date);
        } else if (
          isModuleInFreeTrial(group) ||
          (module.slug && ['libro-1ro', 'matematicas-fedor-2', 'matematicas-fedor-3', 'libro-2do', 'libro-3ro'].includes(module.slug))
        ) {
          // Sin compra, pero módulo de Grado 1, 2 o 3 en periodo de trial hasta el 31/Oct/2026
          accessType = 'free_trial';
          canAccessExercises = true;
          canAccessDownloads = false; // Descargas requieren compra
        }
        // else: 'none' — sin acceso

        const accessInfo: ModuleAccessInfo = {
          type: accessType,
          canAccessExercises,
          canAccessDownloads,
          expiresAt,
          group,
        };

        accessMap[moduleId] = accessInfo;
        if (module.slug) accessMap[module.slug] = accessInfo;
        if (module.group) accessMap[module.group] = accessInfo;
      }

      // También verificar acceso institucional para módulos no cubiertos
      // (los módulos institucionales se manejan aparte vía institutionModuleService)

      setModuleAccess(accessMap);
    } catch (error) {
      console.error('Error al cargar accesos a módulos:', error);
      setModuleAccess({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModuleAccess();

    // Escuchar cambios en el usuario
    const handleUserUpdate = () => {
      loadModuleAccess();
    };

    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, [loadModuleAccess]);

  const hasExerciseAccess = useCallback((moduleId: string) => {
    const norm = (moduleId || '').toLowerCase().trim();
    if (
      norm === '1' || norm === '2' || norm === '3' ||
      norm === 'libro-1ro' || norm === 'libro-2do' || norm === 'libro-3ro' ||
      norm === 'matematicas-fedor-1' || norm === 'matematicas-fedor-2' || norm === 'matematicas-fedor-3' ||
      norm === '6830d368fecd7406dc6f9525' || norm === '6830d619fecd7406dc6f96ad' || norm === '6832543f6fee7c84b2f077c0'
    ) {
      return true;
    }
    const info = moduleAccess[moduleId] || moduleAccess[norm];
    return info?.canAccessExercises || false;
  }, [moduleAccess]);

  const hasDownloadAccess = useCallback((moduleId: string) => {
    const info = moduleAccess[moduleId];
    return info?.canAccessDownloads || false;
  }, [moduleAccess]);

  const getAccessInfo = useCallback((moduleId: string): ModuleAccessInfo => {
    return moduleAccess[moduleId] || {
      type: 'none' as ModuleAccessType,
      canAccessExercises: false,
      canAccessDownloads: false,
    };
  }, [moduleAccess]);

  // hasAccess se mantiene como alias retrocompatible de hasExerciseAccess
  const hasAccess = hasExerciseAccess;

  const refreshAccess = async () => {
    setIsLoading(true);
    await loadModuleAccess();
  };

  return (
    <ModuleAccessContext.Provider value={{
      hasAccess,
      hasExerciseAccess,
      hasDownloadAccess,
      getAccessInfo,
      moduleAccess,
      isLoading,
      refreshAccess,
    }}>
      {children}
    </ModuleAccessContext.Provider>
  );
}

export function useModuleAccess() {
  const context = useContext(ModuleAccessContext);
  if (context === undefined) {
    throw new Error('useModuleAccess debe ser usado dentro de un ModuleAccessProvider');
  }
  return context;
}