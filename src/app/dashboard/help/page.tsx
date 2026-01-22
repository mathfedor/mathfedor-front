'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function HelpPage() {
    return (
        <div className="flex min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6">Ayuda y Soporte</h1>
                <div className="bg-gray-100 dark:bg-[#282828] p-6 rounded-lg shadow-sm">
                    <p className="text-lg mb-4">
                        Estamos trabajando para brindarte la mejor experiencia. Si tienes alguna duda o problema, por favor contáctanos.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">Correo Electrónico</h2>
                            <p className="text-gray-600 dark:text-gray-400">soporte@metodofedor.com</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Horario de Atención</h2>
                            <p className="text-gray-600 dark:text-gray-400">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
