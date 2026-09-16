'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth.types';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function AuthenticatedNavbar() {
  const t = useTranslations('nav');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[300] bg-[#FF6B00] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y menú público */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Menú de usuario autenticado */}
          <div className="flex items-center space-x-3">
            {/* Selector de idiomas */}
            <LocaleSwitcher />

            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="Menú de perfil"
                >
                  <span className="text-white font-medium">{user.name}</span>
                  {user.avatar && (
                    <Image
                      src={user.avatar}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push('/dashboard/profile');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00]"
                    >
                      {t('profile')}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00]"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}