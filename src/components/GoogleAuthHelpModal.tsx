'use client';

import { useState } from 'react';

interface GoogleAuthHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export default function GoogleAuthHelpModal({ isOpen, onClose, onRetry }: GoogleAuthHelpModalProps) {
  const [activeTab, setActiveTab] = useState<'popup' | 'browser'>('popup');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Ayuda con la autenticación de Google
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('popup')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'popup'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bloqueador de Popups
              </button>
              <button
                onClick={() => setActiveTab('browser')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'browser'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buscar Ventana
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'popup' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">¿No se abrió la ventana?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Es posible que tu navegador esté bloqueando las ventanas emergentes.
                </p>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><strong>Chrome/Edge:</strong> Haz clic en el ícono de escudo en la barra de direcciones y permite popups.</p>
                  <p><strong>Firefox:</strong> Haz clic en el ícono de escudo y selecciona &quot;Permitir ventanas emergentes&quot;.</p>
                  <p><strong>Safari:</strong> Ve a Preferencias → Sitios web → Ventanas emergentes y redirigir.</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={onRetry}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'browser' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-medium text-yellow-900 mb-2">¿No encuentras la ventana?</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  La ventana de Google puede estar oculta o en segundo plano.
                </p>
                <div className="space-y-2 text-sm text-yellow-700">
                  <p><strong>Windows:</strong> Revisa la barra de tareas o presiona Alt+Tab para cambiar entre ventanas.</p>
                  <p><strong>Mac:</strong> Revisa el Dock o presiona Cmd+Tab para cambiar entre aplicaciones.</p>
                  <p><strong>Linux:</strong> Revisa el panel de tareas o presiona Alt+Tab.</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">Consejos adicionales:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• La ventana puede estar minimizada</li>
                  <li>• Verifica que no esté detrás de otras ventanas</li>
                  <li>• Busca en todas las pantallas si tienes múltiples monitores</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={onRetry}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Abrir nueva ventana
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
