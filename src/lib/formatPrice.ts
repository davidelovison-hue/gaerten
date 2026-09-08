import { FESTIVAL_CURRENCY } from '../data/festivalConfig';

export function formatPrice(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  const hasCents = Math.abs(rounded % 1) >= 0.005;
  return new Intl.NumberFormat(FESTIVAL_CURRENCY.locale, {
    style: 'currency',
    currency: FESTIVAL_CURRENCY.currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}
