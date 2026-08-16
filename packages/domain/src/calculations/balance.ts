import { Account, Transaction } from '../models/types';

/**
 * Calculates net worth / total liquid balance across active accounts
 */
export function calculateTotalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (account.type === 'loan' || account.type === 'credit') {
      // Credit and loans represent liabilities or negative impact on cash if balance is positive debt
      return sum - Math.abs(account.balance);
    }
    return sum + account.balance;
  }, 0);
}

/**
 * Calculates current account balance given initial balance and transactions
 */
export function computeAccountBalance(
  initialBalance: number,
  accountId: string,
  transactions: Transaction[]
): number {
  let balance = initialBalance;

  for (const tx of transactions) {
    if (tx.accountId === accountId) {
      if (tx.type === 'income') {
        balance += tx.amount;
      } else if (tx.type === 'expense') {
        balance -= tx.amount;
      } else if (tx.type === 'transfer') {
        balance -= tx.amount;
      }
    } else if (tx.toAccountId === accountId && tx.type === 'transfer') {
      balance += tx.amount;
    }
  }

  return balance;
}

/**
 * Computes month-over-month growth percentage for balance
 */
export function calculateMonthGrowthPercentage(
  currentBalance: number,
  transactionsThisMonth: Transaction[]
): number {
  // Back out net flow this month to find balance at start of month
  let netThisMonth = 0;
  for (const tx of transactionsThisMonth) {
    if (tx.type === 'income') netThisMonth += tx.amount;
    else if (tx.type === 'expense') netThisMonth -= tx.amount;
  }

  const startOfMonthBalance = currentBalance - netThisMonth;
  if (startOfMonthBalance <= 0) {
    return netThisMonth > 0 ? 100 : 0;
  }

  const growth = ((currentBalance - startOfMonthBalance) / startOfMonthBalance) * 100;
  return Number(growth.toFixed(1));
}
