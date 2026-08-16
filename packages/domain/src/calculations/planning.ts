import { Goal, Debt, Budget, Transaction } from '../models/types';
import { calculateMoneyFlow } from './moneyFlow';

export interface GoalProgressResult {
  goalId: string;
  percentage: number;
  remainingAmount: number;
  monthsRemaining: number;
  requiredMonthlySavings: number;
  isOnTrack: boolean;
}

export function calculateGoalProgress(goal: Goal): GoalProgressResult {
  const percentage = goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0;

  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

  const targetDate = new Date(goal.targetDate);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const monthsRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.4)));

  const requiredMonthlySavings = remainingAmount > 0 ? Math.round(remainingAmount / monthsRemaining) : 0;

  return {
    goalId: goal.id,
    percentage,
    remainingAmount,
    monthsRemaining,
    requiredMonthlySavings,
    isOnTrack: percentage >= 50 || monthsRemaining > 6,
  };
}

export interface DebtPayoffResult {
  debtId: string;
  totalRemaining: number;
  totalMonthlyEmi: number;
  payoffYear: number;
  monthsRemaining: number;
  progressPercentage: number;
  freedomDateString: string;
}

export function calculateDebtPayoff(debt: Debt): DebtPayoffResult {
  const totalRemaining = Math.max(0, debt.remainingAmount);
  const paidAmount = Math.max(0, debt.principalAmount - debt.remainingAmount);
  const progressPercentage = debt.principalAmount > 0
    ? Math.min(100, Math.round((paidAmount / debt.principalAmount) * 100))
    : 0;

  const monthsRemaining = debt.minimumEmi > 0
    ? Math.ceil(totalRemaining / debt.minimumEmi)
    : 12;

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + monthsRemaining);

  const payoffYear = payoffDate.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const freedomDateString = `${monthNames[payoffDate.getMonth()]} ${payoffYear}`;

  return {
    debtId: debt.id,
    totalRemaining,
    totalMonthlyEmi: debt.minimumEmi,
    payoffYear,
    monthsRemaining,
    progressPercentage,
    freedomDateString,
  };
}

export interface BudgetTrackStatus {
  budgetId: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  isOverBudget: boolean;
  isNearThreshold: boolean;
}

export function calculateBudgetStatus(
  budgets: Budget[],
  transactions: Transaction[]
): BudgetTrackStatus[] {
  const flow = calculateMoneyFlow(transactions);
  const spentMap: Record<string, number> = {};

  for (const cat of flow.topCategories) {
    spentMap[cat.category.toLowerCase()] = cat.amount;
  }

  return budgets.map((b) => {
    const spent = spentMap[b.category.toLowerCase()] || b.currentSpent || 0;
    const remaining = Math.max(0, b.limitAmount - spent);
    const percentage = b.limitAmount > 0 ? Math.min(150, Math.round((spent / b.limitAmount) * 100)) : 0;
    const isOverBudget = spent > b.limitAmount;
    const isNearThreshold = spent >= b.limitAmount * b.alertThreshold;

    return {
      budgetId: b.id,
      category: b.category,
      limitAmount: b.limitAmount,
      spentAmount: spent,
      remainingAmount: remaining,
      percentage,
      isOverBudget,
      isNearThreshold,
    };
  });
}
