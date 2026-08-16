import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatCurrency,
  getCurrencySymbol,
  formatEditorialHeaderDate,
  formatLedgerDate,
  calculateTotalBalance,
  calculateMoneyFlow,
  calculateFinancialPulse,
  Transaction,
  Account,
} from '../index';

describe('Domain Calculations & Formatters', () => {
  describe('formatCurrency', () => {
    it('formats Indian numbering properly', () => {
      assert.strictEqual(formatCurrency(124500, 'INR'), '₹1,24,500');
      assert.strictEqual(formatCurrency(500, 'INR'), '₹500');
      assert.strictEqual(formatCurrency(10000000, 'INR'), '₹1,00,00,000');
    });

    it('formats with signs properly', () => {
      assert.strictEqual(formatCurrency(65000, 'INR', { showSign: true }), '+₹65,000');
      assert.strictEqual(formatCurrency(-450, 'INR'), '-₹450');
      assert.strictEqual(formatCurrency(-450, 'INR', { showSign: true }), '-₹450');
    });

    it('formats compact representations', () => {
      assert.strictEqual(formatCurrency(2420000, 'INR', { compact: true }), '₹24.2L');
      assert.strictEqual(formatCurrency(15000000, 'INR', { compact: true }), '₹1.5Cr');
      assert.strictEqual(formatCurrency(1500, 'USD', { compact: true }), '$1.5k');
    });
  });

  describe('calculateTotalBalance', () => {
    it('sums asset accounts and subtracts liabilities', () => {
      const accounts: Account[] = [
        {
          id: 'acc1',
          profileId: 'p1',
          name: 'HDFC Savings',
          type: 'savings',
          balance: 100000,
          currency: 'INR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'acc2',
          profileId: 'p1',
          name: 'Cash',
          type: 'cash',
          balance: 24500,
          currency: 'INR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'acc3',
          profileId: 'p1',
          name: 'Credit Card',
          type: 'credit',
          balance: 5000,
          currency: 'INR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const total = calculateTotalBalance(accounts);
      assert.strictEqual(total, 119500); // 100000 + 24500 - 5000
    });
  });

  describe('calculateMoneyFlow & Financial Pulse', () => {
    const transactions: Transaction[] = [
      {
        id: 'tx1',
        profileId: 'p1',
        date: '2026-08-16T10:00:00.000Z',
        description: 'Monthly Salary',
        amount: 65000,
        currency: 'INR',
        category: 'Salary',
        type: 'income',
        accountId: 'acc1',
        createdAt: '2026-08-16T10:00:00.000Z',
        updatedAt: '2026-08-16T10:00:00.000Z',
      },
      {
        id: 'tx2',
        profileId: 'p1',
        date: '2026-08-16T12:00:00.000Z',
        description: 'Swiggy Lunch',
        amount: 450,
        currency: 'INR',
        category: 'Food & Dining',
        type: 'expense',
        accountId: 'acc1',
        createdAt: '2026-08-16T12:00:00.000Z',
        updatedAt: '2026-08-16T12:00:00.000Z',
      },
      {
        id: 'tx3',
        profileId: 'p1',
        date: '2026-08-15T15:00:00.000Z',
        description: 'Grocery store',
        amount: 3200,
        currency: 'INR',
        category: 'Food & Dining',
        type: 'expense',
        accountId: 'acc1',
        createdAt: '2026-08-15T15:00:00.000Z',
        updatedAt: '2026-08-15T15:00:00.000Z',
      },
    ];

    it('calculates money flow totals accurately', () => {
      const flow = calculateMoneyFlow(transactions);
      assert.strictEqual(flow.income, 65000);
      assert.strictEqual(flow.expenses, 3650);
      assert.strictEqual(flow.saved, 61350);
      assert.strictEqual(flow.topCategories.length, 1);
      assert.strictEqual(flow.topCategories[0].category, 'Food & Dining');
      assert.strictEqual(flow.topCategories[0].amount, 3650);
    });

    it('computes financial pulse score with steady/thriving status', () => {
      const pulse = calculateFinancialPulse(transactions);
      assert.ok(pulse.score >= 75);
      assert.ok(['STEADY', 'THRIVING'].includes(pulse.status));
      assert.ok(pulse.headline.includes(pulse.status));
    });
  });

  describe('Planning & Wealth Calculations', () => {
    it('calculates goal progress and required monthly savings', () => {
      const { calculateGoalProgress } = require('../index');
      const goal = {
        id: 'g1',
        profileId: 'p1',
        name: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 40000,
        currency: 'INR',
        targetDate: '2026-12-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const res = calculateGoalProgress(goal);
      assert.strictEqual(res.percentage, 40);
      assert.strictEqual(res.remainingAmount, 60000);
      assert.ok(res.requiredMonthlySavings > 0);
    });

    it('calculates debt payoff freedom timeline', () => {
      const { calculateDebtPayoff } = require('../index');
      const debt = {
        id: 'd1',
        profileId: 'p1',
        name: 'Personal Loan',
        principalAmount: 500000,
        remainingAmount: 284000,
        interestRate: 11.5,
        minimumEmi: 12450,
        currency: 'INR',
        startDate: '2024-01-01',
        targetPayoffDate: '2028-12-31',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const res = calculateDebtPayoff(debt);
      assert.strictEqual(res.totalRemaining, 284000);
      assert.ok(res.monthsRemaining > 0);
      assert.ok(res.freedomDateString.length > 0);
    });

    it('calculates portfolio summary and asset allocations', () => {
      const { calculatePortfolioSummary } = require('../index');
      const investments = [
        {
          id: 'inv1',
          profileId: 'p1',
          name: 'Nifty 50 Index',
          assetType: 'equity',
          units: 100,
          buyPrice: 200,
          currentPrice: 250,
          currency: 'INR',
          investedAmount: 20000,
          currentValue: 25000,
          returns: 5000,
          returnsPercentage: 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const summary = calculatePortfolioSummary(investments);
      assert.strictEqual(summary.totalInvested, 20000);
      assert.strictEqual(summary.totalCurrentValue, 25000);
      assert.strictEqual(summary.totalReturns, 5000);
      assert.strictEqual(summary.returnsPercentage, 25);
    });

    it('runs Financial Desk queries locally with intelligent response', () => {
      const { FinancialDeskEngine } = require('../index');
      const res = FinancialDeskEngine.analyzeQuery(
        'Where did my money go this month?',
        [],
        [{ id: 'a1', profileId: 'p1', name: 'Checking', type: 'checking', balance: 50000, currency: 'INR', createdAt: '', updatedAt: '' }],
        [],
        'INR'
      );
      assert.ok(res.headline.includes('REVIEW') || res.headline.includes('PULSE'));
      assert.ok(res.insights.length > 0);
    });
  });
});
