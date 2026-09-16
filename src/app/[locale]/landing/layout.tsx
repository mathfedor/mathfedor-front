import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo Matemáticas Grado 11 • Preparación ICFES Saber 11° | Método Fedor',
  description:
    'Asegura un puntaje sobresaliente en el ICFES Saber 11° y tu admisión universitaria con el Método Fedor. Aprendizaje interactivo a tu ritmo, ejercicios prácticos y simulacros.',
  keywords: [
    'ICFES matemáticas grado 11',
    'preicfes matematicas',
    'saber 11 matematicas',
    'metodo fedor grado 11',
    'curso matematicas icfes',
    'matematicas de fedor',
  ],
  openGraph: {
    title: 'Módulo Matemáticas Grado 11 • Método Fedor',
    description:
      'Asegura un puntaje sobresaliente en el ICFES Saber 11° y tu admisión universitaria con el Método Fedor.',
    url: 'https://matematicasdefedor.com/landing',
    siteName: 'Matemáticas de Fedor',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Módulo Matemáticas Grado 11 - Método Fedor',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {children}
    </div>
  );
}
