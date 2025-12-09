import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulos de Matemáticas - Método Fedor | Preparación ICFES y Pre-Universitario',
  description: 'Domina las matemáticas con el Método Fedor. Preparación para ICFES, pre-universitario y desarrollo del pensamiento lógico. Más de 1000 estudiantes satisfechos. Aprende a tu ritmo con nuestros módulos especializados.',
  keywords: [
    'matemáticas',
    'método fedor',
    'preparación icfes',
    'pre-universitario',
    'cursos de matemáticas',
    'pensamiento lógico',
    'matemáticas colombia',
    'preparación universidad',
    'módulos de matemáticas',
    'aprender matemáticas',
    'icfes matemáticas',
    'curso pre icfes',
    'matemáticas online'
  ],
  authors: [{ name: 'Método Fedor' }],
  openGraph: {
    title: 'Módulos de Matemáticas - Método Fedor',
    description: 'Domina las matemáticas con el Método Fedor. Preparación para ICFES y pre-universitario.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Método Fedor',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Método Fedor - Matemáticas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Módulos de Matemáticas - Método Fedor',
    description: 'Domina las matemáticas con el Método Fedor. Preparación para ICFES y pre-universitario.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://tudominio.com/books',
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'Método Fedor',
            description: 'Plataforma de aprendizaje de matemáticas con preparación para ICFES y pre-universitario',
            url: 'https://tudominio.com',
            logo: 'https://tudominio.com/logo.png',
            sameAs: [
              'https://www.facebook.com/metodofedor',
              'https://www.instagram.com/metodofedor',
              'https://www.youtube.com/@metodofedor',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+57-322-749-6445',
              contactType: 'Customer Service',
              areaServed: 'CO',
              availableLanguage: 'Spanish',
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'COP',
              lowPrice: '50000',
              highPrice: '500000',
              offerCount: '10',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '1000',
              bestRating: '5',
              worstRating: '1',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
