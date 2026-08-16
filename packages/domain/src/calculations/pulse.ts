import { Transaction } from '../models/types';
import { calculateMoneyFlow } from './moneyFlow';

export type PulseStatus = 'THRIVING' | 'STEADY' | 'MODERATE' | 'CAUTION' | 'CRITICAL';

export interface FinancialPulseResult {
  score: number; // 0 - 100
  status: PulseStatus;
  headline: string;
  insight: string;
  savingsScore: number;
  spendingScore: number;
  weekendSpendingRatio: number;
}

export function calculateFinancialPulse(
  transactions: Transaction[],
  monthlyBudget?: number
): FinancialPulseResult {
  if (transactions.length === 0) {
    return {
      score: 75,
      status: 'STEADY',
      headline: '75 · STEADY',
      insight: 'Your ledger is freshly initialized. Add transactions to generate personalized pulse analysis.',
      savingsScore: 75,
      spendingScore: 75,
      weekendSpendingRatio: 0,
    };
  }

  const flow = calculateMoneyFlow(transactions);

  // 1. Savings Rate Score (0 - 50 pts)
  // 30%+ savings rate -> 50 pts
  // 20% -> 40 pts
  // 10% -> 25 pts
  // 0% -> 10 pts
  // negative -> 0 pts
  let savingsScore = 0;
  if (flow.income > 0) {
    const rate = ((flow.income - flow.expenses) / flow.income) * 100;
    if (rate >= 30) savingsScore = 50;
    else if (rate >= 20) savingsScore = 40 + (rate - 20);
    else if (rate >= 10) savingsScore = 25 + (rate - 10) * 1.5;
    else if (rate >= 0) savingsScore = 10 + rate * 1.5;
    else savingsScore = Math.max(0, 10 + rate);
  } else {
    savingsScore = 25;
  }

  // 2. Spending stability / weekend factor (0 - 30 pts)
  let weekendExpenses = 0;
  let weekdayExpenses = 0;
  let weekendCount = 0;
  let weekdayCount = 0;

  for (const tx of transactions) {
    if (tx.type === 'expense') {
      const day = new Date(tx.date).getDay();
      if (day === 0 || day === 6) {
        weekendExpenses += tx.amount;
        weekendCount++;
      } else {
        weekdayExpenses += tx.amount;
        weekdayCount++;
      }
    }
  }

  const avgWeekend = weekendCount > 0 ? weekendExpenses / 2 : 0;
  const avgWeekday = weekdayCount > 0 ? weekdayExpenses / 5 : 0;
  const weekendRatio = avgWeekday > 0 ? (avgWeekend - avgWeekday) / avgWeekday : 0;

  let spendingScore = 25;
  if (weekendRatio > 0.5) {
    spendingScore = 18; // Elevated weekend spending
  } else if (weekendRatio <= 0.2) {
    spendingScore = 28; // Very balanced spending
  } else {
    spendingScore = 24;
  }

  // 3. Budget / Volume Factor (0 - 20 pts)
  let budgetScore = 20;
  if (monthlyBudget && monthlyBudget > 0) {
    const usage = flow.expenses / monthlyBudget;
    if (usage > 1.0) budgetScore = Math.max(0, 20 - (usage - 1.0) * 40);
    else if (usage > 0.85) budgetScore = 14;
    else budgetScore = 20;
  }

  const totalScore = Math.max(10, Math.min(100, Math.round(savingsScore + spendingScore + budgetScore)));

  let status: PulseStatus = 'STEADY';
  if (totalScore >= 88) status = 'THRIVING';
  else if (totalScore >= 75) status = 'STEADY';
  else if (totalScore >= 60) status = 'MODERATE';
  else if (totalScore >= 45) status = 'CAUTION';
  else status = 'CRITICAL';

  let insight = '';
  if (status === 'THRIVING') {
    insight = `Savings are exceptionally healthy at ${flow.savingsRate}%. Capital retention is optimized.`;
  } else if (status === 'STEADY') {
    if (weekendRatio > 0.25) {
      insight = `Savings are healthy. Spending is slightly elevated on weekends (${Math.round(weekendRatio * 100)}% above weekdays).`;
    } else {
      insight = `Cash flow remains consistent. Core categories are operating within sustainable limits.`;
    }
  } else if (status === 'MODERATE') {
    insight = `Expenses are consuming ${100 - flow.savingsRate}% of recorded inflows. Review discretionary outlays.`;
  } else {
    insight = `Outflows currently exceed recommended sustainability thresholds. Immediate spending discipline suggested.`;
  }

  return {
    score: totalScore,
    status,
    headline: `${totalScore} · ${status}`,
    insight,
    savingsScore: Math.round(savingsScore),
    spendingScore: Math.round(spendingScore),
    weekendSpendingRatio: Number(weekendRatio.toFixed(2)),
  };
}
