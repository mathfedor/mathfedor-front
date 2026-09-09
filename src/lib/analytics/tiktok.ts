import { TikTokPixelOptions, TikTokContentItem } from '@/types/analytics';

export const TIKTOK_PIXEL_ID =
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'DADFBLRC77UC8FLJLVI0';

/**
 * Registra una vista de página en el Pixel de TikTok (ttq.page())
 */
export const trackTikTokPageView = (): void => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.page();
  }
};

/**
 * Registra un evento estándar o personalizado en el Pixel de TikTok
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

// ============================================================================
// EVENTOS ESPECÍFICOS DE TIKTOK REQUERIDOS (TIPADOS)
// ============================================================================

/**
 * Evento 2: Abre la ficha de un módulo (ViewContent)
 * Parámetros: contents[], value, currency
 */
export const trackTikTokViewContent = (params: {
  contents: TikTokContentItem[];
  value: number;
  currency: string;
}): void => {
  trackTikTokEvent('ViewContent', params);
};

/**
 * Evento 3: Clic en "Comprar" (AddToCart)
 * Parámetros: contents[], value, currency
 */
export const trackTikTokAddToCart = (params: {
  contents: TikTokContentItem[];
  value: number;
  currency: string;
}): void => {
  trackTikTokEvent('AddToCart', params);
};

/**
 * Evento 4: Registro completado (CompleteRegistration)
 * Parámetros: description
 */
export const trackTikTokCompleteRegistration = (params: {
  description: string;
}): void => {
  trackTikTokEvent('CompleteRegistration', params);
};

/**
 * Evento 5: Entra a la pantalla de pago (InitiateCheckout)
 * Parámetros: contents[], value, currency
 */
export const trackTikTokInitiateCheckout = (params: {
  contents: TikTokContentItem[];
  value: number;
  currency: string;
}): void => {
  trackTikTokEvent('InitiateCheckout', params);
};

/**
 * Evento 6: Aplica un cupón (ApplyCoupon)
 * Parámetros: description, value, currency
 */
export const trackTikTokApplyCoupon = (params: {
  description: string;
  value: number;
  currency: string;
}): void => {
  trackTikTokEvent('ApplyCoupon', params);
};

/**
 * Evento 7: Pago confirmado (CompletePayment)
 * Parámetros: contents[], value, currency + event_id
 */
export const trackTikTokCompletePayment = (params: {
  contents: TikTokContentItem[];
  value: number;
  currency: string;
  event_id: string;
}): void => {
  const { event_id, ...restParams } = params;
  trackTikTokEvent('CompletePayment', restParams, { event_id });
};

/**
 * Evento 8: Clic en el botón de WhatsApp (Contact)
 * Parámetros: description
 */
export const trackTikTokContact = (params: {
  description: string;
}): void => {
  trackTikTokEvent('Contact', params);
};

/**
 * Evento 9: Empieza a jugar en Estación Fedor (StartTrial)
 * Parámetros: description
 */
export const trackTikTokStartTrial = (params: {
  description: string;
}): void => {
  trackTikTokEvent('StartTrial', params);
};
