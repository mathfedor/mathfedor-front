import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo Matemáticas Grado 1° Primaria • Aprende Jugando y sin Frustración | Método Fedor',
  description:
    'Desarrolla el amor por los números y domina las bases matemáticas en 1° grado con el Método Fedor. Conteo, valor posicional, sumas, restas y pensamiento lógico a su ritmo.',
  keywords: [
    'matematicas grado 1',
    'matematicas primero primaria',
    'aprender a sumar y restar primero',
    'metodo fedor grado 1',
    'conteo y numeros primaria',
    'curso matematicas para ninos',
    'matematicas de fedor',
  ],
  openGraph: {
    title: 'Módulo Matemáticas Grado 1° Primaria • Método Fedor',
    description:
      'Construye bases matemáticas sólidas y despierta el amor por los números desde primer grado con el Método Fedor.',
    url: 'https://matematicasdefedor.com/landing/primero',
    siteName: 'Matemáticas de Fedor',
    images: [
      {
        url: '/fedor-modulo-1-libros.png',
        width: 1200,
        height: 630,
        alt: 'Módulo Matemáticas Grado 1° Primaria - Método Fedor',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function LandingPrimeroLayout({
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
