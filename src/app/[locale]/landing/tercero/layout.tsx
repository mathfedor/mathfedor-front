import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo Matemáticas Grado 3° Primaria • Tablas de Multiplicar, División y Pruebas SABER 3° | Método Fedor',
  description:
    'Aprende las tablas de multiplicar sin memorización vacía, domina la división y prepárate para las Pruebas SABER 3° con el Método Fedor. 100% interactivo y a su ritmo.',
  keywords: [
    'matematicas grado 3',
    'matematicas tercero primaria',
    'tablas de multiplicar tercero',
    'aprender a dividir tercero primaria',
    'pruebas saber 3 matematicas',
    'metodo fedor grado 3',
    'curso matematicas para ninos tercero',
    'matematicas de fedor',
  ],
  openGraph: {
    title: 'Módulo Matemáticas Grado 3° Primaria • Método Fedor',
    description:
      'Aprende las tablas de multiplicar, división y razonamiento lógico para 3° grado con el Método Fedor.',
    url: 'https://matematicasdefedor.com/landing/tercero',
    siteName: 'Matemáticas de Fedor',
    images: [
      {
        url: '/fedor-modulo-3-libros.png',
        width: 1200,
        height: 630,
        alt: 'Módulo Matemáticas Grado 3° Primaria - Método Fedor',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function LandingTerceroLayout({
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
