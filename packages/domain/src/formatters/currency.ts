/**
 * FinTrack Pro Currency Formatter
 * Supports Indian numbering format (Lakhs/Crores) for INR, and standard international formats.
 */

export interface FormatCurrencyOptions {
  showSign?: boolean;
  compact?: boolean;
  decimals?: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  AED: 'AED ',
};

export function getCurrencySymbol(currency: string = 'INR'): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || `${currency} `;
}

/**
 * Format numbers using the Indian numbering system: 1,00,000 instead of 100,000
 */
function formatIndianNumber(num: number, decimals: number = 0): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const fixed = absNum.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  if (intPart.length <= 3) {
    const res = intPart + (decPart ? `.${decPart}` : '');
    return isNegative ? `-${res}` : res;
  }

  const lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const res = `${formattedOther},${lastThree}${decPart ? `.${decPart}` : ''}`;
  return isNegative ? `-${res}` : res;
}

export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  options: FormatCurrencyOptions = {}
): string {
  const { showSign = false, compact = false, decimals = 0 } = options;
  const symbol = getCurrencySymbol(currency);
  const absAmount = Math.abs(amount);

  let formattedNumber = '';

  if (compact) {
    if (currency.toUpperCase() === 'INR') {
      if (absAmount >= 10000000) {
        // Crores
        formattedNumber = `${(absAmount / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
      } else if (absAmount >= 100000) {
        // Lakhs
        formattedNumber = `${(absAmount / 100000).toFixed(1).replace(/\.0$/, '')}L`;
      } else if (absAmount >= 1000) {
        // Thousands
        formattedNumber = `${(absAmount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
      } else {
        formattedNumber = formatIndianNumber(absAmount, decimals);
      }
    } else {
      if (absAmount >= 1000000000) {
        formattedNumber = `${(absAmount / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
      } else if (absAmount >= 1000000) {
        formattedNumber = `${(absAmount / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
      } else if (absAmount >= 1000) {
        formattedNumber = `${(absAmount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
      } else {
        formattedNumber = absAmount.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      }
    }
  } else {
    if (currency.toUpperCase() === 'INR') {
      formattedNumber = formatIndianNumber(absAmount, decimals);
    } else {
      formattedNumber = absAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
  }

  let sign = '';
  if (showSign) {
    if (amount > 0) {
      sign = '+';
    } else if (amount < 0) {
      sign = '-';
    }
  } else if (amount < 0) {
    sign = '-';
  }

  return `${sign}${symbol}${formattedNumber}`;
}
