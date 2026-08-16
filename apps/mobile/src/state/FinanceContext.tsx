import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Profile,
  Account,
  Transaction,
  Category,
  Budget,
  Goal,
  Debt,
  Investment,
  MoneyFlowSummary,
  FinancialPulseResult,
  PortfolioSummary,
  NetWorthSummary,
  BudgetTrackStatus,
  BackupData,
  FinancialDeskQueryResponse,
  calculateTotalBalance,
  calculateMoneyFlow,
  calculateFinancialPulse,
  calculateMonthGrowthPercentage,
  calculatePortfolioSummary,
  calculateNetWorth,
  calculateBudgetStatus,
  FinancialDeskEngine,
  exportTransactionsToCsv,
  parseBankStatementCsv,
} from '@fintrack/domain';
import { ProfileRepository } from '../database/repositories/ProfileRepository';
import { AccountRepository } from '../database/repositories/AccountRepository';
import { TransactionRepository } from '../database/repositories/TransactionRepository';
import { CategoryRepository } from '../database/repositories/CategoryRepository';
import { BudgetRepository } from '../database/repositories/BudgetRepository';
import { GoalRepository } from '../database/repositories/GoalRepository';
import { DebtRepository } from '../database/repositories/DebtRepository';
import { InvestmentRepository } from '../database/repositories/InvestmentRepository';
import { initDatabase, getDatabase } from '../database/db';

interface FinanceContextValue {
  profile: Profile | null;
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  investments: Investment[];
  totalBalance: number;
  moneyFlow: MoneyFlowSummary;
  financialPulse: FinancialPulseResult;
  growthPercentage: number;
  portfolioSummary: PortfolioSummary;
  netWorthSummary: NetWorthSummary;
  budgetStatuses: BudgetTrackStatus[];
  accountMap: Record<string, string>;
  isLoading: boolean;
  createProfile: (profile: Profile, initialAccount: Account) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
  updateTransaction: (tx: Transaction) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<boolean>;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Budget>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goal>;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Debt>;
  addInvestment: (inv: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Investment>;
  addCategory: (cat: Omit<Category, 'id' | 'isCustom'>) => Promise<Category>;
  updateGoalProgress: (goalId: string, newAmount: number) => Promise<void>;
  askFinancialDesk: (query: string) => FinancialDeskQueryResponse;
  exportBackupJson: () => string;
  exportCsvString: () => string;
  importBackupJson: (jsonString: string) => Promise<void>;
  importTransactionsFromCsv: (csvText: string, accountId?: string) => Promise<number>;
  resetAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      await initDatabase();

      const existingProfile = await ProfileRepository.getCurrentProfile();
      setProfile(existingProfile);

      const allCategories = await CategoryRepository.getAll();
      setCategories(allCategories);

      if (existingProfile) {
        const [userAccounts, recentTx, userBudgets, userGoals, userDebts, userInvestments] = await Promise.all([
          AccountRepository.getByProfileId(existingProfile.id),
          TransactionRepository.getAll(existingProfile.id, 500),
          BudgetRepository.getByProfileId(existingProfile.id),
          GoalRepository.getByProfileId(existingProfile.id),
          DebtRepository.getByProfileId(existingProfile.id),
          InvestmentRepository.getByProfileId(existingProfile.id),
        ]);

        setAccounts(userAccounts);
        setTransactions(recentTx);
        setBudgets(userBudgets);
        setGoals(userGoals);
        setDebts(userDebts);
        setInvestments(userInvestments);
      }
    } catch (error) {
      console.error('Failed to load finance data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleCreateProfile = async (newProfile: Profile, initialAccount: Account) => {
    await ProfileRepository.createProfile(newProfile);
    await AccountRepository.createAccount(initialAccount);

    // Seed initial demo data for planning & portfolio
    const now = new Date().toISOString();
    const defaultBudgets: Budget[] = [
      { id: `b_${Date.now()}_1`, profileId: newProfile.id, category: 'Food & Dining', limitAmount: 12000, period: 'monthly', startDate: now, alertThreshold: 0.8 },
      { id: `b_${Date.now()}_2`, profileId: newProfile.id, category: 'Transport', limitAmount: 6000, period: 'monthly', startDate: now, alertThreshold: 0.8 },
      { id: `b_${Date.now()}_3`, profileId: newProfile.id, category: 'Shopping', limitAmount: 5000, period: 'monthly', startDate: now, alertThreshold: 0.8 },
    ];
    for (const b of defaultBudgets) await BudgetRepository.create(b);

    const defaultGoal: Goal = {
      id: `g_${Date.now()}`,
      profileId: newProfile.id,
      name: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 40000,
      currency: newProfile.currency,
      targetDate: '2026-12-30',
      category: 'Savings',
      createdAt: now,
      updatedAt: now,
    };
    await GoalRepository.create(defaultGoal);

    const defaultInvestment: Investment = {
      id: `inv_${Date.now()}`,
      profileId: newProfile.id,
      name: 'Nifty 50 Index Fund',
      assetType: 'equity',
      units: 150,
      buyPrice: 180,
      currentPrice: 220,
      currency: newProfile.currency,
      investedAmount: 27000,
      currentValue: 33000,
      returns: 6000,
      returnsPercentage: 22.2,
      createdAt: now,
      updatedAt: now,
    };
    await InvestmentRepository.create(defaultInvestment);

    await loadAllData();
  };

  const handleAddTransaction = async (
    txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> => {
    const now = new Date().toISOString();
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    const saved = await TransactionRepository.create(newTx);
    await loadAllData();
    return saved;
  };

  const handleUpdateTransaction = async (tx: Transaction): Promise<Transaction> => {
    const updated = await TransactionRepository.update(tx);
    await loadAllData();
    return updated;
  };

  const handleDeleteTransaction = async (id: string): Promise<boolean> => {
    const success = await TransactionRepository.delete(id);
    await loadAllData();
    return success;
  };

  const handleAddBudget = async (bData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
    const newB: Budget = { ...bData, id: `b_${Date.now()}` };
    const saved = await BudgetRepository.create(newB);
    await loadAllData();
    return saved;
  };

  const handleAddGoal = async (gData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> => {
    const now = new Date().toISOString();
    const newG: Goal = { ...gData, id: `g_${Date.now()}`, createdAt: now, updatedAt: now };
    const saved = await GoalRepository.create(newG);
    await loadAllData();
    return saved;
  };

  const handleAddDebt = async (dData: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Debt> => {
    const now = new Date().toISOString();
    const newD: Debt = { ...dData, id: `d_${Date.now()}`, createdAt: now, updatedAt: now };
    const saved = await DebtRepository.create(newD);
    await loadAllData();
    return saved;
  };

  const handleAddInvestment = async (iData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Investment> => {
    const now = new Date().toISOString();
    const returns = iData.currentValue - iData.investedAmount;
    const returnsPercentage = iData.investedAmount > 0 ? Number(((returns / iData.investedAmount) * 100).toFixed(2)) : 0;
    const newI: Investment = { ...iData, id: `inv_${Date.now()}`, returns, returnsPercentage, createdAt: now, updatedAt: now };
    const saved = await InvestmentRepository.create(newI);
    await loadAllData();
    return saved;
  };

  const handleAddCategory = async (catData: Omit<Category, 'id' | 'isCustom'>): Promise<Category> => {
    const newCat: Category = {
      ...catData,
      id: `cat_${Date.now()}`,
      isCustom: true,
    };
    const saved = await CategoryRepository.create(newCat);
    await loadAllData();
    return saved;
  };

  const handleUpdateGoalProgress = async (goalId: string, newAmount: number) => {
    await GoalRepository.updateCurrentAmount(goalId, newAmount);
    await loadAllData();
  };

  const handleAskFinancialDesk = (query: string): FinancialDeskQueryResponse => {
    return FinancialDeskEngine.analyzeQuery(
      query,
      transactions,
      accounts,
      budgets,
      profile?.currency || 'INR'
    );
  };

  const exportBackupJson = (): string => {
    if (!profile) throw new Error('No profile to export');
    const backup: BackupData = {
      format: 'fintrack-backup',
      version: 1,
      createdAt: new Date().toISOString(),
      appVersion: '1.0.0',
      profile,
      accounts,
      transactions,
      budgets,
      goals,
      debts,
      investments,
      categories,
    };
    return JSON.stringify(backup, null, 2);
  };

  const exportCsvString = (): string => {
    const map = accounts.reduce((acc, a) => {
      acc[a.id] = a.name;
      return acc;
    }, {} as Record<string, string>);
    return exportTransactionsToCsv(transactions, map);
  };

  const importTransactionsFromCsv = async (csvText: string, targetAccountId?: string): Promise<number> => {
    const parsed = parseBankStatementCsv(csvText);
    if (parsed.length === 0) return 0;

    const accId = targetAccountId || accounts[0]?.id || 'default';
    const profId = profile?.id || 'default';

    for (const item of parsed) {
      await handleAddTransaction({
        profileId: profId,
        accountId: accId,
        currency: profile?.currency || 'INR',
        date: item.date,
        description: item.description,
        amount: item.amount,
        type: item.type,
        category: item.category,
        notes: item.notes,
      });
    }

    return parsed.length;
  };

  const importBackupJson = async (jsonString: string): Promise<void> => {
    const data: BackupData = JSON.parse(jsonString);
    if (data.format !== 'fintrack-backup') {
      throw new Error('Invalid backup format');
    }

    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      await db.execAsync('DELETE FROM transactions; DELETE FROM accounts; DELETE FROM budgets; DELETE FROM goals; DELETE FROM debts; DELETE FROM investments; DELETE FROM profiles;');

      if (data.profile) await ProfileRepository.createProfile(data.profile);
      for (const a of data.accounts || []) await AccountRepository.createAccount(a);
      for (const tx of data.transactions || []) await TransactionRepository.create(tx);
      for (const b of data.budgets || []) await BudgetRepository.create(b);
      for (const g of data.goals || []) await GoalRepository.create(g);
      for (const d of data.debts || []) await DebtRepository.create(d);
      for (const inv of data.investments || []) await InvestmentRepository.create(inv);
    });

    await loadAllData();
  };

  const resetAllData = async (): Promise<void> => {
    const db = await getDatabase();
    await db.execAsync('DELETE FROM transactions; DELETE FROM accounts; DELETE FROM budgets; DELETE FROM goals; DELETE FROM debts; DELETE FROM investments; DELETE FROM profiles;');
    setProfile(null);
    setAccounts([]);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setDebts([]);
    setInvestments([]);
  };

  // Computations
  const totalBalance = calculateTotalBalance(accounts);
  const moneyFlow = calculateMoneyFlow(transactions);
  const financialPulse = calculateFinancialPulse(transactions);
  const growthPercentage = calculateMonthGrowthPercentage(totalBalance, transactions);
  const portfolioSummary = calculatePortfolioSummary(investments);
  const netWorthSummary = calculateNetWorth(accounts, investments, debts);
  const budgetStatuses = calculateBudgetStatus(budgets, transactions);

  const accountMap = accounts.reduce((acc, account) => {
    acc[account.id] = account.name;
    return acc;
  }, {} as Record<string, string>);

  const value: FinanceContextValue = {
    profile,
    accounts,
    transactions,
    categories,
    budgets,
    goals,
    debts,
    investments,
    totalBalance,
    moneyFlow,
    financialPulse,
    growthPercentage,
    portfolioSummary,
    netWorthSummary,
    budgetStatuses,
    accountMap,
    isLoading,
    createProfile: handleCreateProfile,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    addBudget: handleAddBudget,
    addGoal: handleAddGoal,
    addDebt: handleAddDebt,
    addInvestment: handleAddInvestment,
    addCategory: handleAddCategory,
    updateGoalProgress: handleUpdateGoalProgress,
    askFinancialDesk: handleAskFinancialDesk,
    exportBackupJson,
    exportCsvString,
    importBackupJson,
    importTransactionsFromCsv,
    resetAllData,
    refreshData: loadAllData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = (): FinanceContextValue => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
