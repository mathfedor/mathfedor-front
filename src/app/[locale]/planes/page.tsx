import { getTranslations } from 'next-intl/server';
import Footer from '@/components/Footer';
import PricingSection from '@/components/pricing/PricingSection';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'plans' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function PlanesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 pt-16">
      <div className="flex-1 py-8">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
}

