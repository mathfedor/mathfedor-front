import { GA4Item } from '@/types/analytics';

export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLHW2S9G';

/**
 * Inserta un evento o datos en el dataLayer de Google Tag Manager
 */
export const pushToDataLayer = (payload: Record<string, unknown>): void => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }
};

/**
 * Registra un evento en Google Tag Manager
 * @param event Nombre del evento (ej: 'view_item', 'add_to_cart', 'sign_up', 'purchase')
 * @param params Parámetros asociados al evento
 */
export const trackGTMEvent = (
  event: string,
  params?: Record<string, unknown>
): void => {
  pushToDataLayer({
    event,
    ...params,
  });
};

// ============================================================================
// EVENTOS ESPECÍFICOS DE GOOGLE ANALYTICS 4 (GA4) REQUERIDOS (TIPADOS)
// ============================================================================

/**
 * Evento 1: Cada carga y cada cambio de ruta (page_view)
 * Parámetros: page_path, page_location, page_title
 */
export const trackGTMPageView = (params?: {
  page_path?: string;
  page_location?: string;
  page_title?: string;
}): void => {
  if (typeof window === 'undefined') return;

  pushToDataLayer({
    event: 'page_view',
    page_path: params?.page_path || window.location.pathname,
    page_location: params?.page_location || window.location.href,
    page_title: params?.page_title || document.title,
  });
};

/**
 * Evento 2: Abre la ficha de un módulo (view_item)
 * Parámetros: currency, value, items[]
 */
export const trackGTMViewItem = (params: {
  currency: string;
  value: number;
  items: GA4Item[];
}): void => {
  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: params.currency,
      value: params.value,
      items: params.items,
    },
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
};

/**
 * Evento 3: Clic en "Comprar" (add_to_cart)
 * Parámetros: currency, value, items[]
 */
export const trackGTMAddToCart = (params: {
  currency: string;
  value: number;
  items: GA4Item[];
}): void => {
  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: params.currency,
      value: params.value,
      items: params.items,
    },
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
};

/**
 * Evento 4: Registro completado (sign_up)
 * Parámetros: method, grade
 */
export const trackGTMSignUp = (params: {
  method: string;
  grade: string;
}): void => {
  pushToDataLayer({
    event: 'sign_up',
    method: params.method,
    grade: params.grade,
  });
};

/**
 * Evento 5: Entra a la pantalla de pago (begin_checkout)
 * Parámetros: currency, value, items[]
 */
export const trackGTMBeginCheckout = (params: {
  currency: string;
  value: number;
  items: GA4Item[];
}): void => {
  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: params.currency,
      value: params.value,
      items: params.items,
    },
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
};

/**
 * Evento 6: Aplica un cupón (select_promotion)
 * Parámetros: promotion_name, creative_name
 */
export const trackGTMSelectPromotion = (params: {
  promotion_name: string;
  creative_name: string;
}): void => {
  pushToDataLayer({
    event: 'select_promotion',
    promotion_name: params.promotion_name,
    creative_name: params.creative_name,
  });
};

/**
 * Evento 7: Pago confirmado (purchase)
 * Parámetros: transaction_id, currency, value, coupon, items[]
 */
export const trackGTMPurchase = (params: {
  transaction_id: string;
  currency: string;
  value: number;
  coupon: string;
  items: GA4Item[];
}): void => {
  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: params.transaction_id,
      currency: params.currency,
      value: params.value,
      coupon: params.coupon,
      items: params.items,
    },
    transaction_id: params.transaction_id,
    currency: params.currency,
    value: params.value,
    coupon: params.coupon,
    items: params.items,
  });
};

/**
 * Evento 8: Clic en el botón de WhatsApp (generate_lead)
 * Parámetros: method, value, currency
 */
export const trackGTMGenerateLead = (params: {
  method: string;
  value: number;
  currency: string;
}): void => {
  pushToDataLayer({
    event: 'generate_lead',
    method: params.method,
    value: params.value,
    currency: params.currency,
  });
};

/**
 * Evento 9: Empieza a jugar en Estación Fedor (tutorial_begin)
 * Parámetros: grade
 */
export const trackGTMTutorialBegin = (params: {
  grade: string;
}): void => {
  pushToDataLayer({
    event: 'tutorial_begin',
    grade: params.grade,
  });
};
