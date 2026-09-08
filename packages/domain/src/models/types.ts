import { z } from 'zod';

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface SplitPart {
  category: string;
  amount: number;
  notes?: string;
}

export interface Transaction {
  id: string;
  profileId: string;
  date: string; // ISO 8601 string
  description: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  category: string;
  subcategory?: string;
  type: TransactionType;
  accountId: string;
  toAccountId?: string;
  tags?: string[];
  notes?: string;
  receiptUri?: string;
  isRecurring?: boolean;
  recurringRule?: string;
  paymentMethod?: string;
  merchant?: string;
  importedFrom?: string;
  isSplit?: boolean;
  splitParts?: SplitPart[];
  isBillable?: boolean;
  gstRate?: number;
  gstAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment' | 'loan';

export interface Account {
  id: string;
  profileId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution?: string;
  accountNumber?: string;
  isDefault?: boolean;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  isCustom?: boolean;
  subcategories?: string[];
}

export interface Profile {
  id: string;
  name: string;
  currency: string;
  monthlyIncome?: number;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BudgetPeriod = 'monthly' | 'weekly' | 'yearly';

export interface Budget {
  id: string;
  profileId: string;
  category: string;
  limitAmount: number;
  period: BudgetPeriod;
  startDate: string;
  alertThreshold: number; // e.g. 0.8 for 80%
  currentSpent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  profileId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string; // YYYY-MM-DD
  category?: string;
  color?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Debt {
  id: string;
  profileId: string;
  name: string;
  principalAmount: number;
  remainingAmount: number;
  interestRate: number; // e.g. 11.5 for 11.5%
  minimumEmi: number;
  currency: string;
  startDate: string;
  targetPayoffDate: string;
  lender?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssetType = 'equity' | 'mutual_fund' | 'gold' | 'crypto' | 'cash' | 'real_estate';

export interface Investment {
  id: string;
  profileId: string;
  name: string;
  assetType: AssetType;
  units: number;
  buyPrice: number;
  currentPrice: number;
  currency: string;
  investedAmount: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export type AppTheme = 'light' | 'dark' | 'oled' | 'system';

export interface Settings {
  id: string;
  profileId: string;
  theme: AppTheme;
  defaultCurrency: string;
  biometricsEnabled: boolean;
  autoBackup: boolean;
  dataEncryption: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackupData {
  format: 'oikos-backup' | 'fintrack-backup';
  version: number;
  createdAt: string;
  appVersion: string;
  profile: Profile;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  investments: Investment[];
  categories: Category[];
  settings?: Settings;
}
