/**
 * Format a price in Algerian Dinar (DZD)
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

/**
 * Currency symbol
 */
export const CURRENCY_LABEL = "د.ج";
export const CURRENCY_CODE = "DZD";
