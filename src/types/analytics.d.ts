export interface TikTokPixelOptions {
  event_id?: string;
  [key: string]: unknown;
}

export interface TikTokContentItem {
  content_id?: string;
  content_name?: string;
  content_type?: string;
  quantity?: number;
  price?: number;
  [key: string]: unknown;
}

export interface GA4Item {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
  [key: string]: unknown;
}

export interface TikTokAnalytics {
  page: () => void;
  track: (event: string, params?: Record<string, unknown>, options?: TikTokPixelOptions) => void;
  identify: (params: Record<string, unknown>) => void;
  instances: (instance: string) => void;
  debug: () => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
  once: (event: string, callback: (...args: unknown[]) => void) => void;
  ready: (callback: () => void) => void;
  alias: (alias: string) => void;
  group: (group: string) => void;
  enableCookie: () => void;
  disableCookie: () => void;
  holdConsent: () => void;
  revokeConsent: () => void;
  grantConsent: () => void;
  load: (pixelId: string, options?: Record<string, unknown>) => void;
  [key: string]: unknown;
}

export interface MetaPixelEventOptions {
  eventID?: string;
  [key: string]: unknown;
}

export interface MetaPixel {
  (action: 'init', pixelId: string, options?: Record<string, unknown>): void;
  (action: 'track' | 'trackCustom', event: string, params?: Record<string, unknown>, options?: MetaPixelEventOptions): void;
  (action: string, ...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    ttq?: TikTokAnalytics;
    TiktokAnalyticsObject?: string;
    fbq?: MetaPixel;
    _fbq?: MetaPixel;
    dataLayer?: Record<string, unknown>[];
  }
}
