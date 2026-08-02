/**
 * FinTrack Pro — Default Transaction Categories
 * All expense and income categories with icons, colors, and subcategories.
 * Used by the category picker, AI categorizer, and budget system.
 */

import { Icons } from '../../utils/icons.js';

// ─── Expense Categories ───────────────────────────────────────────────────────

export const EXPENSE_CATEGORIES = [
  {
    id: 'food_dining',
    label: 'Food & Dining',
    icon: Icons.food,
    color: '#f97316',
    colorHex: 'rgba(249,115,22,0.15)',
    type: 'expense',
    subcategories: ['Restaurants', 'Groceries', 'Coffee', 'Delivery', 'Fast Food', 'Bakery'],
  },
  {
    id: 'transport',
    label: 'Transport',
    icon: Icons.car,
    color: '#3b82f6',
    colorHex: 'rgba(59,130,246,0.15)',
    type: 'expense',
    subcategories: ['Fuel', 'Taxi/Auto', 'Public Transport', 'Parking', 'Toll', 'Vehicle Service'],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: Icons.shopping,
    color: '#ec4899',
    colorHex: 'rgba(236,72,153,0.15)',
    type: 'expense',
    subcategories: ['Clothing', 'Electronics', 'Home', 'Beauty', 'Books', 'Accessories'],
  },
  {
    id: 'housing',
    label: 'Housing',
    icon: Icons.home,
    color: '#8b5cf6',
    colorHex: 'rgba(139,92,246,0.15)',
    type: 'expense',
    subcategories: ['Rent', 'EMI', 'Maintenance', 'Utilities', 'Furniture', 'Security Deposit'],
  },
  {
    id: 'bills_utilities',
    label: 'Bills & Utilities',
    icon: Icons.lightbulb,
    color: '#eab308',
    colorHex: 'rgba(234,179,8,0.15)',
    type: 'expense',
    subcategories: ['Electricity', 'Gas', 'Water', 'Internet', 'Phone', 'Cable/DTH'],
  },
  {
    id: 'health',
    label: 'Health',
    icon: Icons.health,
    color: '#10b981',
    colorHex: 'rgba(16,185,129,0.15)',
    type: 'expense',
    subcategories: ['Doctor', 'Medicine', 'Lab Tests', 'Insurance', 'Dental', 'Optical'],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: Icons.game,
    color: '#6366f1',
    colorHex: 'rgba(99,102,241,0.15)',
    type: 'expense',
    subcategories: ['OTT', 'Games', 'Movies', 'Sports', 'Events', 'Music'],
  },
  {
    id: 'education',
    label: 'Education',
    icon: Icons.education,
    color: '#06b6d4',
    colorHex: 'rgba(6,182,212,0.15)',
    type: 'expense',
    subcategories: ['Tuition', 'Books', 'Courses', 'School Fees', 'Stationery', 'Exams'],
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: Icons.plane,
    color: '#f59e0b',
    colorHex: 'rgba(245,158,11,0.15)',
    type: 'expense',
    subcategories: ['Flights', 'Hotels', 'Vacation', 'IRCTC', 'Visa', 'Travel Insurance'],
  },
  {
    id: 'personal',
    label: 'Personal',
    icon: Icons.personal,
    color: '#14b8a6',
    colorHex: 'rgba(20,184,166,0.15)',
    type: 'expense',
    subcategories: ['Haircut', 'Spa', 'Gym', 'Clothing', 'Personal Care', 'Subscriptions'],
  },
  {
    id: 'gifts_donations',
    label: 'Gifts & Donations',
    icon: Icons.gift,
    color: '#f472b6',
    colorHex: 'rgba(244,114,182,0.15)',
    type: 'expense',
    subcategories: ['Gifts', 'Charity', 'Religious', 'Festivals', 'Donations'],
  },
  {
    id: 'investments',
    label: 'Investments',
    icon: Icons.trendUp,
    color: '#22c55e',
    colorHex: 'rgba(34,197,94,0.15)',
    type: 'expense',
    subcategories: ['Stocks', 'Mutual Funds', 'SIP', 'FD', 'Crypto', 'Gold', 'PPF', 'NPS'],
  },
  {
    id: 'debt_payments',
    label: 'Debt Payments',
    icon: Icons.creditCard,
    color: '#ef4444',
    colorHex: 'rgba(239,68,68,0.15)',
    type: 'expense',
    subcategories: ['Credit Card Bill', 'Loan EMI', 'Personal Loan', 'Home Loan'],
  },
  {
    id: 'family',
    label: 'Family',
    icon: Icons.family,
    color: '#a78bfa',
    colorHex: 'rgba(167,139,250,0.15)',
    type: 'expense',
    subcategories: ['Kids', 'Parents', 'Pets', 'Baby Care', 'Elder Care'],
  },
  {
    id: 'business',
    label: 'Business',
    icon: Icons.briefcase,
    color: '#64748b',
    colorHex: 'rgba(100,116,139,0.15)',
    type: 'expense',
    subcategories: ['Office', 'Software', 'Marketing', 'Travel', 'Equipment', 'Salaries'],
  },
  {
    id: 'other_expense',
    label: 'Other',
    icon: Icons.help,
    color: '#94a3b8',
    colorHex: 'rgba(148,163,184,0.15)',
    type: 'expense',
    subcategories: ['Miscellaneous', 'Other'],
  },
];

// ─── Income Categories ────────────────────────────────────────────────────────

export const INCOME_CATEGORIES = [
  {
    id: 'salary',
    label: 'Salary',
    icon: Icons.money,
    color: '#10b981',
    colorHex: 'rgba(16,185,129,0.15)',
    type: 'income',
    subcategories: ['Monthly Salary', 'Bonus', 'Overtime', 'Arrears', 'Advance'],
  },
  {
    id: 'interest_returns',
    label: 'Interest & Returns',
    icon: Icons.bank,
    color: '#3b82f6',
    colorHex: 'rgba(59,130,246,0.15)',
    type: 'income',
    subcategories: ['Bank Interest', 'FD Interest', 'Savings Interest', 'Bond Returns'],
  },
  {
    id: 'rental_income',
    label: 'Rental Income',
    icon: Icons.home,
    color: '#8b5cf6',
    colorHex: 'rgba(139,92,246,0.15)',
    type: 'income',
    subcategories: ['Residential Rent', 'Commercial Rent', 'Airbnb', 'Land Rent'],
  },
  {
    id: 'freelance_income',
    label: 'Freelance Income',
    icon: Icons.target,
    color: '#f97316',
    colorHex: 'rgba(249,115,22,0.15)',
    type: 'income',
    subcategories: ['Consulting', 'Design', 'Development', 'Writing', 'Teaching'],
  },
  {
    id: 'investment_returns',
    label: 'Investment Returns',
    icon: Icons.trendUp,
    color: '#22c55e',
    colorHex: 'rgba(34,197,94,0.15)',
    type: 'income',
    subcategories: ['Stock Gains', 'Mutual Fund', 'Dividend', 'Crypto Gains', 'Capital Gains'],
  },
  {
    id: 'gifts_received',
    label: 'Gifts Received',
    icon: Icons.gift,
    color: '#f472b6',
    colorHex: 'rgba(244,114,182,0.15)',
    type: 'income',
    subcategories: ['Cash Gift', 'Festival Gift', 'Birthday Gift', 'Inheritance'],
  },
  {
    id: 'business_revenue',
    label: 'Business Revenue',
    icon: Icons.money,
    color: '#06b6d4',
    colorHex: 'rgba(6,182,212,0.15)',
    type: 'income',
    subcategories: ['Sales', 'Service Revenue', 'Commission', 'Royalties'],
  },
  {
    id: 'other_income',
    label: 'Other Income',
    icon: Icons.help,
    color: '#94a3b8',
    colorHex: 'rgba(148,163,184,0.15)',
    type: 'income',
    subcategories: ['Refund', 'Cashback', 'Lottery', 'Miscellaneous'],
  },
];

// ─── Combined & Lookup Helpers ────────────────────────────────────────────────

/** All categories (expense + income) */
export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

/**
 * Look up a category by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getCategoryById(id) {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

/**
 * Get categories filtered by transaction type.
 * @param {'income'|'expense'|'transfer'} type
 * @returns {object[]}
 */
export function getCategoriesByType(type) {
  if (type === 'transfer') return [];
  return ALL_CATEGORIES.filter((c) => c.type === type);
}

/**
 * Get subcategories for a given category id.
 * @param {string} categoryId
 * @returns {string[]}
 */
export function getSubcategories(categoryId) {
  const cat = getCategoryById(categoryId);
  return cat?.subcategories ?? [];
}

/**
 * Build a map of category id → category object for O(1) lookups.
 * @returns {Record<string, object>}
 */
export function buildCategoryMap() {
  return ALL_CATEGORIES.reduce((map, cat) => {
    map[cat.id] = cat;
    return map;
  }, {});
}

/** Singleton category map */
export const CATEGORY_MAP = buildCategoryMap();

export default {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  ALL_CATEGORIES,
  CATEGORY_MAP,
  getCategoryById,
  getCategoriesByType,
  getSubcategories,
  buildCategoryMap,
};
