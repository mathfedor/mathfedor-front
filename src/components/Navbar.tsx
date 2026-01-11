'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) return null;
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#FF6B00] transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            {!isDashboard && (
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo Matemáticas de Fedor"
                  width={360}
                  height={120}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            )}
          </div>

          {/* Menú para usuarios no autenticados */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/'
                  ? 'text-fedor-orange bg-white'
                  : 'text-white hover:bg-white hover:text-fedor-orange'
                }`}
            >
              Home
            </Link>
            <Link
              href="/books"
              className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/books'
                  ? 'text-fedor-orange bg-white'
                  : 'text-white hover:bg-white hover:text-fedor-orange'
                }`}
            >
              Módulos
            </Link>
            <Link
              href="/retos"
              className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/retos'
                  ? 'text-fedor-orange bg-white'
                  : 'text-white hover:bg-white hover:text-fedor-orange'
                }`}
            >
              Retos
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-sm font-medium text-fedor-orange bg-white hover:bg-gray-100"
            >
              Login
            </Link>
          </div>


          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:text-fedor-orange focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden bg-fedor-orange">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/'
                  ? 'text-fedor-orange bg-white'
                  : 'text-white hover:bg-white hover:text-fedor-orange'
                }`}
            >
              Home
            </Link>
            <Link
              href="/books"
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/books'
                  ? 'text-fedor-orange bg-white'
                  : 'text-white hover:bg-white hover:text-fedor-orange'
                }`}
            >
              Módulos
            </Link>
            <Link
              href="/retos"
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/retos'
                  ? 'text-fedor-orange bg-white'
                  : 'text-white hover:bg-white hover:text-fedor-orange'
                }`}
            >
              Retos
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-fedor-orange bg-white hover:bg-gray-100"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 