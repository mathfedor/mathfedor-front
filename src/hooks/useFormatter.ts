import { useLocale } from 'next-intl';

export type RelativeTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

export function useFormatter() {
  const locale = useLocale();

  /**
   * Formatea una fecha usando Intl.DateTimeFormat
   */
  const formatDate = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
  ): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, options).format(d);
    } catch {
      return String(date);
    }
  };

  /**
   * Formatea una hora usando Intl.DateTimeFormat
   */
  const formatTime = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = { timeStyle: 'short' }
  ): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, options).format(d);
    } catch {
      return String(date);
    }
  };

  /**
   * Formatea fecha y hora combinadas
   */
  const formatDateTime = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' }
  ): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, options).format(d);
    } catch {
      return String(date);
    }
  };

  /**
   * Formatea valores monetarios usando Intl.NumberFormat
   */
  const formatCurrency = (
    amount: number,
    currency = 'COP',
    options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
  ): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'COP' ? 0 : 2,
        ...options,
      }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  /**
   * Formatea números genéricos con separadores de miles y decimales según el locale
   */
  const formatNumber = (
    value: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch {
      return String(value);
    }
  };

  /**
   * Formatea porcentajes (0.25 -> 25%) usando Intl.NumberFormat
   */
  const formatPercent = (
    value: number,
    options?: Omit<Intl.NumberFormatOptions, 'style'>
  ): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 1,
        ...options,
      }).format(value);
    } catch {
      return `${(value * 100).toFixed(1)}%`;
    }
  };

  /**
   * Formatea tiempo relativo usando Intl.RelativeTimeFormat
   */
  const formatRelativeTime = (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options: Intl.RelativeTimeFormatOptions = { numeric: 'auto' }
  ): string => {
    try {
      return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
    } catch {
      return `${value} ${unit}`;
    }
  };

  /**
   * Calcula la diferencia con respecto a ahora y devuelve el tiempo relativo ("hace 5 minutos", "ayer", etc.)
   */
  const formatTimeAgo = (
    date: Date | string | number,
    options: Intl.RelativeTimeFormatOptions = { numeric: 'auto' }
  ): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      const elapsedMs = d.getTime() - Date.now();
      const elapsedSeconds = Math.round(elapsedMs / 1000);

      const cutoffs: [RelativeTimeUnit, number][] = [
        ['year', 3600 * 24 * 365],
        ['month', 3600 * 24 * 30],
        ['week', 3600 * 24 * 7],
        ['day', 3600 * 24],
        ['hour', 3600],
        ['minute', 60],
        ['second', 1],
      ];

      for (const [unit, secondsInUnit] of cutoffs) {
        if (Math.abs(elapsedSeconds) >= secondsInUnit || unit === 'second') {
          const delta = Math.round(elapsedSeconds / secondsInUnit);
          return new Intl.RelativeTimeFormat(locale, options).format(delta, unit);
        }
      }

      return formatDate(d);
    } catch {
      return String(date);
    }
  };

  return {
    locale,
    formatDate,
    formatTime,
    formatDateTime,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatRelativeTime,
    formatTimeAgo,
  };
}
