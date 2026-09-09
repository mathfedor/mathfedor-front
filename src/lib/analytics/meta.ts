import { MetaPixelEventOptions } from '@/types/analytics';

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '1305911099962631';

/**
 * Registra una vista de página en el Pixel de Meta (Facebook)
 */
export const trackMetaPageView = (): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Registra un evento estándar en el Pixel de Meta
 */
export const trackMetaEvent = (
  event: string,
  params?: Record<string, unknown>,
  options?: MetaPixelEventOptions
): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (params && options) {
      window.fbq('track', event, params, options);
    } else if (params) {
      window.fbq('track', event, params);
    } else {
      window.fbq('track', event);
    }
  }
};

/**
 * Registra un evento personalizado en el Pixel de Meta
 */
export const trackMetaCustomEvent = (
  event: string,
  params?: Record<string, unknown>,
  options?: MetaPixelEventOptions
): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (params && options) {
      window.fbq('trackCustom', event, params, options);
    } else if (params) {
      window.fbq('trackCustom', event, params);
    } else {
      window.fbq('trackCustom', event);
    }
  }
};

// ============================================================================
// EVENTOS ESPECÍFICOS REQUERIDOS (TIPADOS)
// ============================================================================

/**
 * Evento 2: Abre la ficha de un módulo (ViewContent)
 * Parámetros: content_ids, content_name, content_type, value, currency
 */
export const trackMetaViewContent = (params: {
  content_ids: string[];
  content_name: string;
  content_type: string;
  value: number;
  currency: string;
}): void => {
  trackMetaEvent('ViewContent', params);
};

/**
 * Evento 3: Clic en "Comprar" (AddToCart)
 * Parámetros: content_ids, content_type, value, currency
 */
export const trackMetaAddToCart = (params: {
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
}): void => {
  trackMetaEvent('AddToCart', params);
};

/**
 * Evento 4: Registro completado (CompleteRegistration)
 * Parámetros: content_name, status
 */
export const trackMetaCompleteRegistration = (params: {
  content_name: string;
  status: boolean | string;
}): void => {
  trackMetaEvent('CompleteRegistration', params);
};

/**
 * Evento 5: Entra a la pantalla de pago (InitiateCheckout)
 * Parámetros: content_ids, num_items, value, currency
 */
export const trackMetaInitiateCheckout = (params: {
  content_ids: string[];
  num_items: number;
  value: number;
  currency: string;
}): void => {
  trackMetaEvent('InitiateCheckout', params);
};

/**
 * Evento 6: Aplica un cupón (CuponAplicado - Custom)
 * Parámetros: coupon, discount, currency
 */
export const trackMetaCouponApplied = (params: {
  coupon: string;
  discount: number;
  currency: string;
}): void => {
  trackMetaCustomEvent('CuponAplicado', params);
};

/**
 * Evento 7: Pago confirmado (Purchase)
 * Parámetros: content_ids, content_type, value, currency + eventID
 */
export const trackMetaPurchase = (params: {
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
  eventID: string;
}): void => {
  const { eventID, ...restParams } = params;
  trackMetaEvent('Purchase', restParams, { eventID });
};

/**
 * Evento 8: Clic en el botón de WhatsApp (Contact)
 * Parámetros: content_name
 */
export const trackMetaContact = (params: {
  content_name: string;
}): void => {
  trackMetaEvent('Contact', params);
};

/**
 * Evento 9: Empieza a jugar en Estación Fedor (StartTrial)
 * Parámetros: content_name, value, currency
 */
export const trackMetaStartTrial = (params: {
  content_name: string;
  value: number;
  currency: string;
}): void => {
  trackMetaEvent('StartTrial', params);
};
