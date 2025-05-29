'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ModuleAccessProvider } from '@/contexts/ModuleAccessContext';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ModuleAccessProvider>
        <AuthenticatedNavbar />
        {children}
      </ModuleAccessProvider>
    </ThemeProvider>
  );
} 