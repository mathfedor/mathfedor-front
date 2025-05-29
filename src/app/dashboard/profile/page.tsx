"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from '@/components/Sidebar';
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth.types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    if (!currentUser) {
      router.replace("/login");
    }
  }, [router]);

  if (loading || !user) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="max-w-xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Perfil de usuario</h1>
            <div className="bg-white dark:bg-[#232323] rounded-lg shadow p-6">
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 