import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo Matemáticas Grado 2° Primaria • Sumas, Restas y Lógica sin Frustración | Método Fedor',
  description:
    'Domina las sumas y restas con reagrupación (llevadas) y la resolución de problemas cotidianos en 2° de primaria con el Método Fedor. Aprendizaje interactivo a su propio ritmo.',
  keywords: [
    'matematicas grado 2',
    'matematicas segundo primaria',
    'sumas y restas con reagrupacion segundo',
    'sumas llevando y restas prestando',
    'metodo fedor grado 2',
    'problemas matematicos segundo primaria',
    'matematicas de fedor',
  ],
  openGraph: {
    title: 'Módulo Matemáticas Grado 2° Primaria • Método Fedor',
    description:
      'Domina las operaciones matemáticas de 2° grado y la resolución de problemas cotidianos sin frustración con el Método Fedor.',
    url: 'https://matematicasdefedor.com/landing/segundo',
    siteName: 'Matemáticas de Fedor',
    images: [
      {
        url: '/fedor-modulo-2-libros.png',
        width: 1200,
        height: 630,
        alt: 'Módulo Matemáticas Grado 2° Primaria - Método Fedor',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function LandingSegundoLayout({
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
