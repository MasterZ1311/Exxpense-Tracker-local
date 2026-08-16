/**
 * Editorial date formatters for FinTrack Pro Mobile
 */

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];
const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Formats date as: "MONDAY · 16 AUGUST"
 */
export function formatEditorialHeaderDate(date: Date = new Date()): string {
  const dayName = DAYS[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthName = MONTHS[date.getMonth()];
  return `${dayName} · ${dayOfMonth} ${monthName}`;
}

/**
 * Formats date for ledger transaction grouping: "16 AUG" or "TODAY", "YESTERDAY"
 */
export function formatLedgerDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return 'TODAY';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'YESTERDAY';

  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  return `${day} ${month}`;
}

/**
 * Formats time for transaction row: "10:32" (24h)
 */
export function formatTransactionTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formats greeting based on hour of day
 */
export function getEditorialGreeting(userName?: string): string {
  const hour = new Date().getHours();
  let timeOfDay = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good afternoon';
  } else if (hour >= 17 || hour < 4) {
    timeOfDay = 'Good evening';
  }

  if (userName && userName.trim().length > 0) {
    return `${timeOfDay}, ${userName.trim()}`;
  }
  return timeOfDay;
}
