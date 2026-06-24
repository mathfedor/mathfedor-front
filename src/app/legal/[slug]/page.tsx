import Link from 'next/link';

type LegalDocument = {
  title: string;
  slug: string;
  version?: string;
  effectiveFrom?: string;
  contentHtml?: string;
  content?: string;
  pdfUrl?: string | null;
};

type LegalApiResponse = LegalDocument | {
  data?: LegalDocument;
};

const DOCUMENT_TITLES: Record<string, string> = {
  'terminos-y-condiciones': 'Términos y Condiciones',
  'politica-privacidad': 'Política de Privacidad',
  'autorizacion-datos-menor': 'Autorización para el Tratamiento de Datos de Menores',
  'aviso-privacidad': 'Aviso de Privacidad',
  'politica-cookies': 'Política de Cookies'
};

async function getLegalDocument(slug: string): Promise<LegalDocument | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/legal-documents/${slug}/current`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json() as LegalApiResponse;
    return 'data' in payload ? payload.data ?? null : payload as LegalDocument;
  } catch {
    return null;
  }
}

type LegalPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const document = await getLegalDocument(slug);
  const title = document?.title || DOCUMENT_TITLES[slug] || 'Documento legal';
  
  const contentHtml = document?.contentHtml;
  const contentText = document?.content;
  const pdfUrl = document?.pdfUrl;

  const resolvedPdfUrl = pdfUrl
    ? pdfUrl.startsWith('http')
      ? pdfUrl
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${pdfUrl}`
    : null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 text-gray-900">
      <article className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium text-orange-600">Documento legal</p>
        <h1 className="text-3xl font-bold">{title}</h1>

        {document?.version && (
          <p className="mt-3 text-sm text-gray-500">Versión: {document.version}</p>
        )}

        {resolvedPdfUrl ? (
          <div className="mt-8 w-full h-[700px] border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <iframe
              src={resolvedPdfUrl}
              className="w-full h-full"
              title={title}
            />
          </div>
        ) : contentHtml ? (
          <div
            className="prose prose-gray mt-8 max-w-none prose-orange prose-a:text-orange-600 hover:prose-a:text-orange-500"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : contentText ? (
          <div className="mt-8 whitespace-pre-wrap text-gray-700">{contentText}</div>
        ) : (
          <div className="mt-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Este documento aún no está disponible desde el backend. Cuando el endpoint legal responda el contenido activo, se mostrará aquí automáticamente.
          </div>
        )}

        <Link href="/" className="mt-8 inline-block font-medium text-orange-600 hover:text-orange-500">
          ← Volver al inicio
        </Link>
      </article>
    </main>
  );
}
