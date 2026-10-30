'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { moduleService, Module } from '@/services/module.service';
import { authService } from '@/services/auth.service';
import Image from 'next/image';
import Footer from "@/components/Footer";
import { trackMetaViewContent, trackMetaAddToCart } from '@/lib/analytics/meta';
import { trackTikTokViewContent, trackTikTokAddToCart } from '@/lib/analytics/tiktok';
import { trackGTMViewItem, trackGTMAddToCart } from '@/lib/analytics/google';
import PlanSelectModal from '@/components/pricing/PlanSelectModal';
import { Plan } from '@/types/plan.types';

const getGradeNumber = (group?: string) => {
  const match = group?.match(/Grado(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const getStandardsPdfByGroup = (group?: string) => {
  const gradeNumber = getGradeNumber(group);

  if (gradeNumber && gradeNumber >= 1 && gradeNumber <= 11) {
    return `/Estandares-${gradeNumber}.pdf`;
  }

  return null;
};

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('books.module_detail');
  const tBooks = useTranslations('books');
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const modules = await moduleService.getAllModules(locale);
        const foundModule = modules.find((m) => m._id === id);

        if (foundModule) {
          setModule(foundModule);
          const price = foundModule.price || 0;
          trackMetaViewContent({
            content_ids: [foundModule._id],
            content_name: foundModule.title,
            content_type: 'product',
            value: price,
            currency: 'COP',
          });
          trackTikTokViewContent({
            contents: [
              {
                content_id: foundModule._id,
                content_name: foundModule.title,
                content_type: 'product',
                price: price,
                quantity: 1,
              },
            ],
            value: price,
            currency: 'COP',
          });
          trackGTMViewItem({
            currency: 'COP',
            value: price,
            items: [
              {
                item_id: foundModule._id,
                item_name: foundModule.title,
                item_category: foundModule.group || 'Modulo',
                price: price,
                quantity: 1,
              },
            ],
          });
        } else {
          setError(t('not_found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('load_error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [id, locale, t]);

  const handleBuyClick = () => {
    setIsPlanModalOpen(true);
  };

  const handleConfirmPlan = (plan: Plan, quantity: number, finalPrice: number) => {
    if (module) {
      trackMetaAddToCart({
        content_ids: [module._id],
        content_type: 'product',
        value: finalPrice,
        currency: 'COP',
      });
      trackTikTokAddToCart({
        contents: [
          {
            content_id: module._id,
            content_name: `${module.title} (${plan.name})`,
            content_type: 'product',
            price: finalPrice,
            quantity: quantity,
          },
        ],
        value: finalPrice,
        currency: 'COP',
      });
      trackGTMAddToCart({
        currency: 'COP',
        value: finalPrice,
        items: [
          {
            item_id: module._id,
            item_name: `${module.title} (${plan.name})`,
            item_category: module.group || 'Modulo',
            price: finalPrice,
            quantity: quantity,
          },
        ],
      });
    }

    const isAuthenticated = authService.isAuthenticated();
    const targetUrl = `/dashboard/buybooks/${id}?plan=${plan.slug}&qty=${quantity}`;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push(targetUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{t('error_title')}</p>
          <p>{error || t('not_found')}</p>
        </div>
      </div>
    );
  }

  const standardsPdf = getStandardsPdfByGroup(module.group);

  const groupKey = module.group;
  const localizedTitle =
    groupKey && tBooks.has(`modules_content.${groupKey}.title`)
      ? tBooks(`modules_content.${groupKey}.title`)
      : module.title;

  let rawDescription: string =
    groupKey && tBooks.has(`modules_content.${groupKey}.description`)
      ? (tBooks.raw(`modules_content.${groupKey}.description`) as string)
      : (module.description || '');

  if (rawDescription && locale !== 'es') {
    rawDescription = rawDescription
      .replace(/¿Qué incluye el módulo\?/gi, t('what_included_header'))
      .replace(/Libro (\d+):/gi, (match, n) => {
        const bookTranslations: Record<string, string> = {
          en: `Book ${n}:`,
          pt: `Livro ${n}:`,
          fr: `Livre ${n} :`,
          de: `Buch ${n}:`,
        };
        return bookTranslations[locale] || match;
      });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-16">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-[600px] relative">
                  {module.image ? (
                    <Image
                      src={module.image.startsWith('/') ? module.image : `/${module.image}`}
                      alt={localizedTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="h-full bg-orange-100 flex items-center justify-center">
                      <span className="text-8xl text-orange-500">{t('book_fallback')}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <h1 className="text-4xl font-bold mb-4">{localizedTitle}</h1>

                <div className="border-b pb-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 font-medium line-through">
                        {t('regular_price')} ${(module.price || 203000).toLocaleString('es-CO')} COP
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs font-semibold text-emerald-600">{t('with_annual_plan')}</span>
                        <span className="text-3xl font-black text-orange-500">$179.999</span>
                        <span className="text-xs text-gray-500 font-semibold">{t('per_year')}</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        {t('monthly_equivalent')}
                      </p>
                    </div>
                    <button
                      onClick={handleBuyClick}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 text-lg font-bold cursor-pointer whitespace-nowrap"
                    >
                      {t('choose_access_plan')}
                    </button>
                  </div>
                </div>

                <div
                  className="text-gray-600 mb-6 whitespace-pre-line prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: rawDescription.replace(/\n/g, '<br/>') }}
                />

                <div className="space-y-4 mb-8">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">{t('competency_standards')}</span>
                    <ul className="list-disc list-inside space-y-2">
                      {module.tags && module.tags.length > 0 ? (
                        module.tags.slice(0, 3).map((tag, index) => (
                          <li key={index} className="text-gray-600">
                            {tag === 'Estándares y competencias'
                              ? t('standards_and_competencies')
                              : tag}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">{t('no_standards')}</li>
                      )}
                    </ul>

                    {standardsPdf && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowPdf((current) => !current)}
                          className="inline-flex rounded-lg transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                          aria-label={showPdf ? t('hide_standards_pdf') : t('show_standards_pdf')}
                        >
                          <Image
                            src="/estandares-competencias.png"
                            alt={t('standards_and_competencies')}
                            width={260}
                            height={72}
                            className="h-auto w-auto max-w-full object-contain"
                          />
                        </button>

                        {showPdf && (
                          <div className="mt-4 w-full h-[600px] overflow-hidden rounded-lg border shadow-sm">
                            <iframe
                              src={standardsPdf}
                              className="h-full w-full"
                              title={t('standards_and_competencies')}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Selección de Plan */}
      {module && (
        <PlanSelectModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          module={{ ...module, title: localizedTitle }}
          onConfirmPlan={handleConfirmPlan}
        />
      )}

      <Footer />
    </div>
  );
}
