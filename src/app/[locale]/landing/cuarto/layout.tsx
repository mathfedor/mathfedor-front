import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo Matemáticas Grado 4° Primaria • Fracciones, Decimales y División | Método Fedor',
  description:
    'Domina las fracciones, números decimales y división de varias cifras en 4° de primaria con el Método Fedor. 100% interactivo, paso a paso y sin frustración.',
  keywords: [
    'matematicas grado 4',
    'matematicas cuarto primaria',
    'fracciones cuarto primaria',
    'aprender a dividir por dos cifras',
    'numeros decimales primaria',
    'metodo fedor grado 4',
    'curso matematicas para ninos cuarto',
    'matematicas de fedor',
  ],
  openGraph: {
    title: 'Módulo Matemáticas Grado 4° Primaria • Método Fedor',
    description:
      'Aprende fracciones, decimales, división y razonamiento geométrico para 4° grado con el Método Fedor.',
    url: 'https://matematicasdefedor.com/landing/cuarto',
    siteName: 'Matemáticas de Fedor',
    images: [
      {
        url: '/fedor-modulo-4-libros.png',
        width: 1200,
        height: 630,
        alt: 'Módulo Matemáticas Grado 4° Primaria - Método Fedor',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function LandingCuartoLayout({
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
