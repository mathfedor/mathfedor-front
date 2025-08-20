'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiHome, FiBook, FiUsers, FiPlusCircle, FiFileText, FiChevronDown, FiChevronRight, FiUser, FiSun, FiMoon, FiGlobe, FiBarChart, FiMonitor, FiPackage, FiCode } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth.types';
import { useTheme } from '@/contexts/ThemeContext';
import { useModuleAccess } from '@/contexts/ModuleAccessContext';
import { moduleService, Module } from '@/services/module.service';

interface SubMenuItem {
  title: string;
  href: string;
  moduleId?: string;
}

interface MenuItem {
  icon: React.ReactElement;
  title: string;
  href: string;
  submenu?: SubMenuItem[];
}

// Definimos las opciones de menú base (visibles para todos)
const baseMenuItems: MenuItem[] = [
  { icon: <FiHome className="w-5 h-5" />, title: 'Inicio', href: '/dashboard' }
];

// Opciones específicas para cada rol
const roleMenuItems: Record<string, MenuItem[]> = {
  student: [
    {
      icon: <FiBook className="w-5 h-5" />,
      title: 'Mis Módulos',
      href: '/dashboard/cursos',
      submenu: [] // Se llenará dinámicamente
    },
    { icon: <FiFileText className="w-5 h-5" />, title: 'Diagnóstico', href: '/dashboard/diagnostico' },
    { icon: <FiPackage className="w-5 h-5" />, title: 'Simulacro', href: '/dashboard/simulation' },
    { icon: <FiCode className="w-5 h-5" />, title: 'Simulador', href: '/dashboard/simulator' }
  ],
  teacher: [
    { icon: <FiUser className="w-5 h-5" />, title: 'Estudiantes', href: '/dashboard/estudiantes' }
  ],
  admin: [
    { icon: <FiPlusCircle className="w-5 h-5" />, title: 'Crear Diagnóstico', href: '/dashboard/diagnosis' },
    { icon: <FiBook className="w-5 h-5" />, title: 'Crear Módulo', href: '/dashboard/modules/create' },
    { icon: <FiBarChart className="w-5 h-5" />, title: 'Crear Simulador', href: '/dashboard/adminsimulator' },
    { icon: <FiMonitor className="w-5 h-5" />, title: 'Crear Simulacro', href: '/dashboard/adminsimulation' },
    { icon: <FiGlobe className="w-5 h-5" />, title: 'Instituciones', href: '/dashboard/institutions' },
    { icon: <FiUsers className="w-5 h-5" />, title: 'Usuarios', href: '/dashboard/users' }
  ]
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { hasAccess } = useModuleAccess();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    setIsClient(true);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Cargar módulos si el usuario es estudiante
    if (currentUser?.role?.toLowerCase() === 'student') {
      loadModules();
    }
  }, []);

  const loadModules = async () => {
    try {
      const allModules = await moduleService.getAllModules();
      setModules(allModules);
    } catch (error) {
      console.error('Error al cargar módulos:', error);
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  // Combinamos las opciones base con las opciones específicas del rol
  let menuItems = [
    ...baseMenuItems,
    ...(isClient && user && user.role ? roleMenuItems[user.role.toLowerCase() as keyof typeof roleMenuItems] || [] : [])
  ];

  // Si el usuario es estudiante, actualizamos el submenu de módulos
  if (user?.role?.toLowerCase() === 'student') {
    menuItems = menuItems.map(item => {
      if (item.title === 'Mis Módulos') {
        return {
          ...item,
          submenu: [
            ...modules
              .filter(module => hasAccess(module._id))
              .map(module => ({
                title: module.title,
                href: `/dashboard/modules/${module._id}/exercises`,
                moduleId: module._id
              })),
            { title: 'Descargas', href: '/dashboard/downloads' }
          ]
        };
      }
      return item;
    });
  }

  // Si no estamos en el cliente, mostramos solo las opciones base
  if (!isClient) {
    return (
      <div className="w-16 bg-[#1C1D1F] text-white min-h-screen flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-auto"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${pathname === '/dashboard' ? 'w-64' : 'w-16'} bg-white dark:bg-[#1C1D1F] text-black dark:text-white min-h-screen flex flex-col transition-all duration-300`}>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-center mt-16">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={50}
            className={`${pathname === '/dashboard' ? 'w-36' : 'w-8'} h-auto transition-all duration-300`}
            priority
          />
        </div>
        {/* Botón de cambio de tema */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#282828] transition-colors mb-2"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? (
            <FiSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FiMoon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Tooltip content={item.title} position="right">
              <button
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.title);
                  } else {
                    handleNavigation(item.href);
                  }
                }}
                className={`w-full flex items-center ${pathname === '/dashboard' ? 'justify-start' : 'justify-center'} px-4 py-3 text-sm relative ${pathname === item.href
                  ? 'bg-gray-200 dark:bg-[#282828] border-l-4 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282828] hover:text-black dark:hover:text-white'
                  }`}
              >
                <span className="min-w-[20px]">{item.icon}</span>
                {pathname === '/dashboard' && (
                  <span className="ml-3 whitespace-nowrap">{item.title}</span>
                )}
                {item.submenu && (
                  <span className={`${pathname === '/dashboard' ? 'ml-auto' : 'absolute right-2'}`}>
                    {openSubmenu === item.title ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>
            </Tooltip>

            {item.submenu && openSubmenu === item.title && (
              <div className="flex flex-col pl-8">
                {item.submenu.map((subItem, subIndex) => (
                  <Tooltip key={subIndex} content={subItem.title} position="right">
                    <button
                      onClick={() => handleNavigation(subItem.href)}
                      className={`w-full flex items-center justify-start px-4 py-2 text-sm ${pathname === subItem.href
                        ? 'bg-gray-200 dark:bg-[#282828] text-black dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282828] hover:text-black dark:hover:text-white'
                        }`}
                    >
                      <span className="text-sm">{subItem.title}</span>
                    </button>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
} 