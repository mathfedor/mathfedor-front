/**
 * Utilidades para el seguimiento de Leads y Registros en Módulos Gratuitos
 * Integra:
 * 1. Al abrir el modal del módulo gratis:
 *    - fbq('track', 'Lead')
 *    - ttq.track('ClickButton')
 *    - dataLayer.push({ event: 'lead_free' })
 * 2. Al crear la cuenta con éxito:
 *    - fbq('track', 'CompleteRegistration')
 *    - ttq.track('CompleteRegistration')
 *    - dataLayer.push({ event: 'sign_up' })
 */

/**
 * Disparado cuando el usuario hace clic para abrir el modal del módulo gratis
 */
export const trackOpenFreeModal = (grade?: string): void => {
  if (typeof window === 'undefined') return;

  // 1. Meta Pixel (Facebook): fbq('track', 'Lead')
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: grade ? `Modulo Gratis - ${grade}` : 'Modulo Gratis',
      });
    }
  } catch (err) {
    console.warn('[Analytics] Meta Lead error:', err);
  }

  // 2. TikTok Pixel: ttq.track('ClickButton')
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('ClickButton', {
        contents: [
          {
            content_name: grade ? `Modulo Gratis - ${grade}` : 'Modulo Gratis',
          },
        ],
      });
    }
  } catch (err) {
    console.warn('[Analytics] TikTok ClickButton error:', err);
  }

  // 3. Google Tag Manager: dataLayer.push({ event: 'lead_free' })
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'lead_free',
      grade: grade || 'General',
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  } catch (err) {
    console.warn('[Analytics] GTM lead_free error:', err);
  }
};

/**
 * Disparado cuando se crea la cuenta con éxito en el módulo gratuito
 */
export const trackFreeAccountCreated = (grade?: string): void => {
  if (typeof window === 'undefined') return;

  // 1. Meta Pixel (Facebook): fbq('track', 'CompleteRegistration')
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CompleteRegistration', {
        content_name: grade ? `Registro Gratis - ${grade}` : 'Registro Gratis',
        status: true,
      });
    }
  } catch (err) {
    console.warn('[Analytics] Meta CompleteRegistration error:', err);
  }

  // 2. TikTok Pixel: ttq.track('CompleteRegistration')
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('CompleteRegistration', {
        description: grade ? `Registro Gratis - ${grade}` : 'Registro Gratis',
      });
    }
  } catch (err) {
    console.warn('[Analytics] TikTok CompleteRegistration error:', err);
  }

  // 3. Google Tag Manager: dataLayer.push({ event: 'sign_up' })
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'sign_up',
      method: 'email',
      grade: grade || 'General',
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  } catch (err) {
    console.warn('[Analytics] GTM sign_up error:', err);
  }
};
