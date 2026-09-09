import { TikTokPixelOptions } from '@/types/analytics';

export const TIKTOK_PIXEL_ID =
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'DADFBLRC77UC8FLJLVI0';

/**
 * Registra una vista de página en el Pixel de TikTok
 */
export const trackTikTokPageView = (): void => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.page();
  }
};

/**
 * Registra un evento estándar o personalizado en el Pixel de TikTok
 * @param event Nombre del evento (ej: 'ViewContent', 'ClickButton', 'CompleteRegistration', 'Purchase')
 * @param params Parámetros adicionales del evento (ej: { content_type: 'product', value: 100, currency: 'USD' })
 * @param options Opciones adicionales (ej: { event_id: '123' })
 */
export const trackTikTokEvent = (
  event: string,
  params?: Record<string, unknown>,
  options?: TikTokPixelOptions
): void => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(event, params, options);
  }
};
