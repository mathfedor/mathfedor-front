import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo Matemáticas Grado 5° Primaria • Pre-Bachillerato, MCD, MCM y Pruebas SABER 5° | Método Fedor',
  description:
    'Prepara a tu hijo(a) para el éxito en el bachillerato y las Pruebas SABER 5° con el Método Fedor. Operaciones combinadas, fracciones heterogéneas, teoría de números y geometría.',
  keywords: [
    'matematicas grado 5',
    'matematicas quinto primaria',
    'pruebas saber 5 matematicas',
    'preparacion bachillerato',
    'mcd y mcm quinto primaria',
    'fracciones heterogeneas',
    'metodo fedor grado 5',
    'curso matematicas para ninos quinto',
    'matematicas de fedor',
  ],
  openGraph: {
    title: 'Módulo Matemáticas Grado 5° Primaria • Método Fedor',
    description:
      'Consolida la primaria, domina fracciones avanzadas, operaciones combinadas y prepárate con ventaja para bachillerato con el Método Fedor.',
    url: 'https://matematicasdefedor.com/landing/quinto',
    siteName: 'Matemáticas de Fedor',
    images: [
      {
        url: '/fedor-modulo-5-libros.png',
        width: 1200,
        height: 630,
        alt: 'Módulo Matemáticas Grado 5° Primaria - Método Fedor',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function LandingQuintoLayout({
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
