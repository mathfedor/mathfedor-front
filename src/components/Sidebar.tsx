'use client';

import React from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { FiHome, FiBook, FiUsers, FiPlusCircle, FiFileText, FiChevronDown, FiChevronRight, FiUser, FiSun, FiMoon, FiGlobe, FiBarChart, FiMonitor, FiPackage, FiCode, FiShoppingCart, FiTag, FiHelpCircle, FiLayers, FiTarget } from 'react-icons/fi';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth.types';
import { useTheme } from '@/contexts/ThemeContext';
import { useModuleAccess } from '@/contexts/ModuleAccessContext';
import { moduleService, Module } from '@/services/module.service';
import { trackMetaContact } from '@/lib/analytics/meta';
import { trackTikTokContact } from '@/lib/analytics/tiktok';
import { trackGTMGenerateLead } from '@/lib/analytics/google';

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

const getRoleMenuItems = (t: (key: string) => string): Record<string, MenuItem[]> => ({
  student: [
    {
      icon: <FiBook className="w-5 h-5" />,
      title: t('my_modules'),
      href: '/dashboard/cursos',
      submenu: [] // Se llenará dinámicamente
    },
    {
      icon: <FiLayers className="w-5 h-5" />,
      title: t('inst_modules'),
      href: '/dashboard/mis-modulos',
    },
    { icon: <FiFileText className="w-5 h-5" />, title: t('diagnosis'), href: '/dashboard/diagnostico' },
    { icon: <FiPackage className="w-5 h-5" />, title: t('simulation'), href: '/dashboard/simulation' },
    { icon: <FiCode className="w-5 h-5" />, title: t('simulator'), href: '/dashboard/simulator' },
    { icon: <FiTarget className="w-5 h-5" />, title: t('station'), href: '/retos' }
  ],
  teacher: [
    {
      icon: <FiBook className="w-5 h-5" />,
      title: t('my_modules'),
      href: '/dashboard/cursos',
      submenu: [] // Se llenará dinámicamente
    },
    {
      icon: <FiLayers className="w-5 h-5" />,
      title: t('inst_modules'),
      href: '/dashboard/mis-modulos',
    },
    { icon: <FiUser className="w-5 h-5" />, title: t('students'), href: '/dashboard/estudiantes' },
    { icon: <FiBarChart className="w-5 h-5" />, title: t('results'), href: '/dashboard/results' },
    { icon: <FiTarget className="w-5 h-5" />, title: t('station'), href: '/retos' }
  ],
  academy: [
    { icon: <FiUser className="w-5 h-5" />, title: t('students'), href: '/dashboard/estudiantes' },
    { icon: <FiBarChart className="w-5 h-5" />, title: t('results'), href: '/dashboard/results' },
    { icon: <FiGlobe className="w-5 h-5" />, title: t('institutions'), href: '/dashboard/institutions' },
    { icon: <FiUsers className="w-5 h-5" />, title: t('users'), href: '/dashboard/users' },
    { icon: <FiTarget className="w-5 h-5" />, title: t('station'), href: '/retos' }
  ],
  admin: [
    { icon: <FiPlusCircle className="w-5 h-5" />, title: t('create_diagnosis'), href: '/dashboard/diagnosis' },
    { icon: <FiLayers className="w-5 h-5" />, title: t('manage_modules'), href: '/dashboard/modules' },
    { icon: <FiBook className="w-5 h-5" />, title: t('create_module'), href: '/dashboard/modules/create' },
    { icon: <FiBook className="w-5 h-5" />, title: t('edit_books'), href: '/dashboard/curriculum' },
    { icon: <FiBarChart className="w-5 h-5" />, title: t('create_simulator'), href: '/dashboard/adminsimulator' },
    { icon: <FiTarget className="w-5 h-5" />, title: t('station'), href: '/retos' },
    { icon: <FiMonitor className="w-5 h-5" />, title: t('create_simulation'), href: '/dashboard/adminsimulation' },
    { icon: <FiGlobe className="w-5 h-5" />, title: t('institutions'), href: '/dashboard/institutions' },
    { icon: <FiUsers className="w-5 h-5" />, title: t('users'), href: '/dashboard/users' },
    { icon: <FiBarChart className="w-5 h-5" />, title: t('results'), href: '/dashboard/results' },
    { icon: <FiTag className="w-5 h-5" />, title: t('coupons'), href: '/dashboard/coupons' },
    { icon: <FiFileText className="w-5 h-5" />, title: t('legal_docs'), href: '/dashboard/legal' }
  ]
});

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('dashboard.sidebar');
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { hasExerciseAccess } = useModuleAccess();
  const [modules, setModules] = useState<Module[]>([]);
  const isModuleDetailPage = /^\/dashboard\/modules\/(?!create(?:\/|$))[^/]+(?:\/.*)?$/.test(pathname ?? '');
  const isExpanded = pathname?.startsWith('/dashboard') && !isModuleDetailPage;

  const roleMenuItems = useMemo(() => getRoleMenuItems(t), [t]);
  const baseMenuItems: MenuItem[] = useMemo(() => [
    { icon: <FiHome className="w-5 h-5" />, title: t('home'), href: '/dashboard' }
  ], [t]);

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }

    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const isSubmenuActive = useCallback((submenu?: SubMenuItem[]) => {
    return submenu?.some(subItem => pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)) ?? false;
  }, [pathname]);

  const loadModules = useCallback(async (activeLocale?: string) => {
    try {
      const allModules = await moduleService.getAllModules(activeLocale || locale);
      setModules(allModules);
    } catch (error) {
      console.error('Error al cargar módulos:', error);
    }
  }, [locale]);

  useEffect(() => {
    setIsClient(true);
    const loadUserAndModules = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      // Cargar módulos si el usuario es estudiante o profesor
      if (currentUser?.role?.toLowerCase() === 'student' || currentUser?.role?.toLowerCase() === 'teacher') {
        loadModules(locale);
      }
    };

    // Cargar inicialmente
    loadUserAndModules();

    // Escuchar cambios en el usuario
    const handleUserUpdate = () => {
      loadUserAndModules();
    };

    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, [loadModules, locale]);

  // Recargar módulos cuando cambie el idioma
  useEffect(() => {
    if (isClient && user && (user.role?.toLowerCase() === 'student' || user.role?.toLowerCase() === 'teacher')) {
      loadModules(locale);
    }
  }, [isClient, loadModules, locale, user]);

  const handleNavigation = (href: string) => {
    // Si es el enlace de ayuda, abrir WhatsApp en nueva pestaña
    if (href === 'whatsapp://help') {
      trackMetaContact({ content_name: 'WhatsApp Soporte (Sidebar)' });
      trackTikTokContact({ description: 'WhatsApp Soporte (Sidebar)' });
      trackGTMGenerateLead({ method: 'WhatsApp', value: 0, currency: 'COP' });
      window.open('https://wa.me/573107199897?text=Hola%20amigos%20de%20Fedor%2C%20necesito%20ayuda.', '_blank');
      return;
    }
    router.push(href);
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  // Combinamos las opciones base con las opciones específicas del rol
  const menuItems = useMemo(() => {
    let items = [
      ...baseMenuItems,
      ...(isClient && user && user.role ? roleMenuItems[user.role.toLowerCase() as keyof typeof roleMenuItems] || [] : [])
    ];

    if (user) {
      const isAcademy = user.role?.toLowerCase() === 'academy';
      
      items = [
        ...items,
        ...(isAcademy ? [] : [{ icon: <FiShoppingCart className="w-5 h-5" />, title: t('buy'), href: '/dashboard/buybooks' }]),
        { icon: <FiUser className="w-5 h-5" />, title: t('profile'), href: '/dashboard/profile' },
        { icon: <FiHelpCircle className="w-5 h-5" />, title: t('help'), href: '/dashboard/help' }
      ];
    }

    // Si el usuario es estudiante o profesor, actualizamos el submenu de módulos
    if (user?.role?.toLowerCase() === 'student' || user?.role?.toLowerCase() === 'teacher') {
      items = items.map(item => {
        if (item.href === '/dashboard/cursos') {
          return {
            ...item,
            submenu: [
              ...modules
                .filter(module => hasExerciseAccess(module._id))
                .map(module => ({
                  title: module.title,
                  href: `/dashboard/modules/${module._id}/exercises`,
                  moduleId: module._id
                })),
              { title: t('downloads'), href: '/dashboard/downloads' }
            ]
          };
        }
        return item;
      });
    }

    return items;
  }, [baseMenuItems, hasExerciseAccess, isClient, modules, roleMenuItems, t, user]);

  useEffect(() => {
    const activeSubmenu = menuItems.find(item => isSubmenuActive(item.submenu));

    if (activeSubmenu) {
      setOpenSubmenu(activeSubmenu.title);
    }
  }, [isSubmenuActive, menuItems]);

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
    <div className={`${isExpanded ? 'w-52' : 'w-16'} bg-white dark:bg-[#1C1D1F] text-black dark:text-white min-h-screen flex flex-col border-r border-gray-100 dark:border-gray-800 transition-all duration-300`}>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-center mt-16">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={50}
            className={`${isExpanded ? 'w-32' : 'w-8'} h-auto transition-all duration-300`}
            priority
          />
        </div>
        {/* Botón de cambio de tema */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#282828] transition-colors mb-2"
          aria-label={t('toggle_theme')}
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
          <div key={index} className="px-3">
            <Tooltip content={item.title} position="right">
              <button
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.title);
                  } else {
                    handleNavigation(item.href);
                  }
                }}
                className={`w-full flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} px-3 py-3 text-sm relative rounded-r-lg rounded-l-md transition-colors ${isItemActive(item.href) || isSubmenuActive(item.submenu)
                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 border-l-4 border-orange-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10 dark:hover:text-orange-400'
                  }`}
              >
                <span className="min-w-[20px]">{item.icon}</span>
                {isExpanded && (
                  <span className="ml-3 whitespace-nowrap">{item.title}</span>
                )}
                {item.submenu && (
                  <span className={`${isExpanded ? 'ml-auto' : 'absolute right-2'}`}>
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
              <div className={`${isExpanded ? 'flex' : 'hidden'} flex-col pl-7 py-1`}>
                {item.submenu.map((subItem, subIndex) => (
                  <Tooltip key={subIndex} content={subItem.title} position="right">
                    <button
                      onClick={() => handleNavigation(subItem.href)}
                      className={`w-full flex items-center justify-start rounded-lg px-3 py-2 text-sm transition-colors ${pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
                        ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10 dark:hover:text-orange-400'
                        }`}
                    >
                      <span className="truncate text-sm">{subItem.title}</span>
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
