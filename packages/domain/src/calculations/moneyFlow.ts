import { Transaction } from '../models/types';

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
  icon?: string;
  transactionCount: number;
}

export interface MoneyFlowSummary {
  income: number;
  expenses: number;
  saved: number;
  savingsRate: number; // 0 to 100 percentage
  incomeRatio: number; // 0 to 1 normalized
  expenseRatio: number; // 0 to 1 normalized
  savedRatio: number; // 0 to 1 normalized
  topCategories: CategoryBreakdownItem[];
}

export function calculateMoneyFlow(
  transactions: Transaction[],
  options?: {
    startDate?: Date;
    endDate?: Date;
  }
): MoneyFlowSummary {
  let income = 0;
  let expenses = 0;
  const categoryTotals: Record<string, { amount: number; count: number }> = {};

  const start = options?.startDate?.getTime();
  const end = options?.endDate?.getTime();

  for (const tx of transactions) {
    const txTime = new Date(tx.date).getTime();
    if (start && txTime < start) continue;
    if (end && txTime > end) continue;

    if (tx.type === 'income') {
      income += tx.amount;
    } else if (tx.type === 'expense') {
      expenses += tx.amount;
      const cat = tx.category || 'Other';
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { amount: 0, count: 0 };
      }
      categoryTotals[cat].amount += tx.amount;
      categoryTotals[cat].count += 1;
    }
  }

  const saved = Math.max(0, income - expenses);
  const savingsRate = income > 0 ? Math.max(0, Math.min(100, Math.round(((income - expenses) / income) * 100))) : 0;

  const totalVolume = income + expenses;
  let incomeRatio = 0.5;
  let expenseRatio = 0.5;
  let savedRatio = 0;

  if (totalVolume > 0) {
    incomeRatio = income / totalVolume;
    expenseRatio = expenses / totalVolume;
    savedRatio = income > expenses ? (income - expenses) / income : 0;
  }

  const topCategories: CategoryBreakdownItem[] = Object.entries(categoryTotals)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: expenses > 0 ? Math.round((data.amount / expenses) * 100) : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    income,
    expenses,
    saved,
    savingsRate,
    incomeRatio,
    expenseRatio,
    savedRatio,
    topCategories,
  };
}
