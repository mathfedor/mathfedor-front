'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService } from '@/services/auth.service';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ModuleAccessProvider } from '@/contexts/ModuleAccessContext';

import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import EstacionExperience from '@/components/estacion/EstacionExperience';

function RetosContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificación de Autenticación
    if (!authService.isAuthenticated()) {
      router.replace('/login?redirect=/retos');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.replace('/login?redirect=/retos');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-bold text-slate-300 animate-pulse">
          Verificando acceso a Estación Fedor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070C1F] text-white flex">
      {/* Menu Sidebar */}
      <Sidebar />

      {/* Contenedor Principal: Experiencia Nativa de Estación Fedor */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen pt-16 overflow-y-auto bg-[#070C1F] relative">
        <EstacionExperience />
      </main>
    </div>
  );
}

export default function RetosPage() {
  return (
    <ThemeProvider>
      <ModuleAccessProvider>
        <AuthenticatedNavbar />
        <RetosContent />
      </ModuleAccessProvider>
    </ThemeProvider>
  );
}