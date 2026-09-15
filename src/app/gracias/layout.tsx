import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¡Felicitaciones por tu compra! • Matemáticas de Fedor',
  description: 'Tu acceso al Módulo de Matemáticas Grado 11 ha sido activado.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GraciasLayout({
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
