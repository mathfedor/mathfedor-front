import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { purchaseService } from '@/services/purchase.service';
import { authService } from '@/services/auth.service';
import { moduleService, Module } from '@/services/module.service';

interface ModuleAccessContextType {
  hasAccess: (moduleId: string) => boolean;
  moduleAccess: Record<string, boolean>;
  isLoading: boolean;
  refreshAccess: () => Promise<void>;
}

const ModuleAccessContext = createContext<ModuleAccessContextType | undefined>(undefined);

export function ModuleAccessProvider({ children }: { children: ReactNode }) {
  const [moduleAccess, setModuleAccess] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadModuleAccess = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        setModuleAccess({});
        return;
      }

      // Obtener todos los módulos
      const modules = await moduleService.getAllModules();
      
      // Verificar acceso para cada módulo
      const accessPromises = modules.map(async (module: Module) => {
        const hasAccess = await purchaseService.hasAccessToModule(user.id, module._id);
        return [module._id, hasAccess];
      });

      const accessResults = await Promise.all(accessPromises);
      const accessMap = Object.fromEntries(accessResults);
      
      setModuleAccess(accessMap);
    } catch (error) {
      console.error('Error al cargar accesos a módulos:', error);
      setModuleAccess({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModuleAccess();
  }, []);

  const hasAccess = (moduleId: string) => {
    return moduleAccess[moduleId] || false;
  };

  const refreshAccess = async () => {
    setIsLoading(true);
    await loadModuleAccess();
  };

  return (
    <ModuleAccessContext.Provider value={{ hasAccess, moduleAccess, isLoading, refreshAccess }}>
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