import { Metadata } from 'next';
import NuevaLandingPage from '@/components/landing-nueva/NuevaLandingPage';

export const metadata: Metadata = {
  title: 'Matemáticas de Fedor | ¿Quiere que su hijo destaque en matemáticas?',
  description:
    'Método interactivo de matemáticas para estudiantes de 1° a 11°. Aprende paso a paso sin memorizar. 7 días de prueba gratis sin tarjeta.',
  keywords: [
    'Matemáticas de Fedor',
    'aprender matemáticas primaria',
    'matemáticas bachillerato Colombia',
    'icfes matemáticas',
    'tablas de multiplicar',
    'fracciones fáciles',
    'método fedor'
  ],
  openGraph: {
    title: 'Matemáticas de Fedor | ¿Quiere que su hijo destaque en matemáticas?',
    description:
      'Su hijo aprende solo, sin que usted tenga que sentarse al lado. 7 días de prueba gratis.',
    url: 'https://matematicasdefedor.com/nueva-landing',
    siteName: 'Matemáticas de Fedor',
    images: [
      {
        url: '/images/landing-nueva/portada-3.webp',
        width: 660,
        height: 660,
        alt: 'Matemáticas de Fedor - Grados 1° a 11°'
      }
    ],
    locale: 'es_CO',
    type: 'website'
  }
};

export default function Page() {
  return <NuevaLandingPage />;
}
