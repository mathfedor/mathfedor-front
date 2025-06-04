'use client';

import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import ThanksContent from './ThanksContent';

function ThanksFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 bg-[#F9F9F9]">
          <div className="pt-12 px-8 pb-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<ThanksFallback />}>
      <ThanksContent />
    </Suspense>
  );
} 