/**
 * Utilidades para el seguimiento de conversiones y contactos vía WhatsApp
 * Integra:
 * 1. Meta Pixel (Facebook): fbq('track', 'Contact')
 * 2. TikTok Pixel: ttq.track('Contact')
 * 3. Google Tag Manager / GA4: dataLayer.push({ event: 'whatsapp_click' })
 */

import { trackMetaEvent } from './meta';
import { trackTikTokEvent } from './tiktok';

export interface WhatsAppTrackingContext {
  grade?: string;
  placement?: 'floating' | 'footer' | string;
  url?: string;
  [key: string]: unknown;
}

/**
 * Dispara los eventos de contacto en Facebook Pixel, TikTok Pixel y Google Tag Manager
 */
export const trackWhatsAppContact = (context?: WhatsAppTrackingContext): void => {
  if (typeof window === 'undefined') return;

  const gradeName = context?.grade || 'General';
  const placement = context?.placement || 'floating';

  // 1. Meta Pixel (Facebook) - Evento Estándar 'Contact'
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', {
        content_name: `WhatsApp - ${gradeName} (${placement})`,
        content_category: 'WhatsApp Contact',
      });
    } else {
      trackMetaEvent('Contact', {
        content_name: `WhatsApp - ${gradeName} (${placement})`,
      });
    }
  } catch (err) {
    console.warn('[Analytics] Meta Contact tracking warning:', err);
  }

  // 2. TikTok Pixel - Evento Estándar 'Contact'
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('Contact', {
        description: `WhatsApp - ${gradeName} (${placement})`,
      });
    } else {
      trackTikTokEvent('Contact', {
        description: `WhatsApp - ${gradeName} (${placement})`,
      });
    }
  } catch (err) {
    console.warn('[Analytics] TikTok Contact tracking warning:', err);
  }

  // 3. Google Tag Manager - Evento personalizado 'whatsapp_click'
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      grade: gradeName,
      placement: placement,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  } catch (err) {
    console.warn('[Analytics] GTM whatsapp_click tracking warning:', err);
  }
};
