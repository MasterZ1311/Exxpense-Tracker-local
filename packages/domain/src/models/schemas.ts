import { z } from 'zod';

export const TransactionTypeSchema = z.enum(['expense', 'income', 'transfer']);

export const SplitPartSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  notes: z.string().optional(),
});

export const TransactionSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  profileId: z.string().min(1),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.string().min(1).default('INR'),
  convertedAmount: z.number().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  type: TransactionTypeSchema,
  accountId: z.string().min(1, 'Account is required'),
  toAccountId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  receiptUri: z.string().optional(),
  isRecurring: z.boolean().optional().default(false),
  recurringRule: z.string().optional(),
  paymentMethod: z.string().optional(),
  merchant: z.string().optional(),
  importedFrom: z.string().optional(),
  isSplit: z.boolean().optional().default(false),
  splitParts: z.array(SplitPartSchema).optional(),
  isBillable: z.boolean().optional().default(false),
  gstRate: z.number().optional(),
  gstAmount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AccountSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  profileId: z.string().min(1),
  name: z.string().min(1, 'Account name is required'),
  type: z.enum(['checking', 'savings', 'credit', 'cash', 'investment', 'loan']),
  balance: z.number(),
  currency: z.string().min(1).default('INR'),
  institution: z.string().optional(),
  accountNumber: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
  color: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProfileSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(1, 'Name is required'),
  currency: z.string().min(1).default('INR'),
  monthlyIncome: z.number().nonnegative().optional(),
  isOnboarded: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DefaultCategories: Array<{
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  subcategories: string[];
}> = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'utensils',
    color: '#526B4F', // Moss
    type: 'expense',
    subcategories: ['Groceries', 'Restaurants', 'Coffee', 'Delivery'],
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'car',
    color: '#687276', // Slate
    type: 'expense',
    subcategories: ['Fuel', 'Public Transit', 'Rideshare', 'Maintenance'],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping-bag',
    color: '#C96F52', // Terracotta
    type: 'expense',
    subcategories: ['Electronics', 'Clothing', 'Home', 'Personal Care'],
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: 'file-text',
    color: '#59445E', // Plum
    type: 'expense',
    subcategories: ['Electricity', 'Water', 'Internet', 'Subscriptions', 'Rent'],
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: 'trending-up',
    color: '#B89A58', // Brass
    type: 'expense',
    subcategories: ['Mutual Funds', 'Stocks', 'Gold', 'Real Estate', 'Crypto'],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
    color: '#8A5D3B', // Warm ochre
    type: 'expense',
    subcategories: ['Movies', 'Games', 'Concerts', 'Books'],
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: 'heart-pulse',
    color: '#9C4146', // Deep crimson
    type: 'expense',
    subcategories: ['Doctor', 'Pharmacy', 'Insurance', 'Fitness'],
  },
  {
    id: 'salary',
    name: 'Salary',
    icon: 'briefcase',
    color: '#526B4F', // Moss
    type: 'income',
    subcategories: ['Primary Job', 'Bonus', 'Overtime'],
  },
  {
    id: 'freelance',
    name: 'Freelance & Business',
    icon: 'laptop',
    color: '#B89A58', // Brass
    type: 'income',
    subcategories: ['Consulting', 'Client Work', 'Sales'],
  },
  {
    id: 'investment_income',
    name: 'Investment Returns',
    icon: 'arrow-up-right',
    color: '#C8F169', // Chartreuse accent
    type: 'income',
    subcategories: ['Dividends', 'Interest', 'Capital Gains'],
  },
  {
    id: 'other_income',
    name: 'Other Income',
    icon: 'plus-circle',
    color: '#687276', // Slate
    type: 'income',
    subcategories: ['Gifts', 'Refunds', 'Cashback'],
  },
];
