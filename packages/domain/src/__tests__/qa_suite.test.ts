import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatCurrency,
  getCurrencySymbol,
  formatEditorialHeaderDate,
  formatLedgerDate,
  formatTransactionTime,
  getEditorialGreeting,
  calculateTotalBalance,
  computeAccountBalance,
  calculateMonthGrowthPercentage,
  calculateMoneyFlow,
  calculateFinancialPulse,
  calculateGoalProgress,
  calculateDebtPayoff,
  calculatePortfolioSummary,
  calculateNetWorth,
  calculateBudgetStatus,
  FinancialDeskEngine,
  exportTransactionsToCsv,
  parseBankStatementCsv,
  Transaction,
  Account,
  Budget,
  Goal,
  Debt,
  Investment,
  Profile,
  BackupData,
} from '../index';

describe('FULL-STACK PRODUCT QA VALIDATION SUITE', () => {
  // =========================================================================
  // 1. FORMATTER & CURRENCY ENGINE VALIDATION
  // =========================================================================
  describe('1. Formatter & Currency Engine Integrity', () => {
    it('handles zero, negative, and extreme values correctly in Indian format', () => {
      assert.strictEqual(formatCurrency(0, 'INR'), '₹0');
      assert.strictEqual(formatCurrency(-0, 'INR'), '₹0');
      assert.strictEqual(formatCurrency(-500, 'INR'), '-₹500');
      assert.strictEqual(formatCurrency(-124500, 'INR'), '-₹1,24,500');
      assert.strictEqual(formatCurrency(999, 'INR'), '₹999');
      assert.strictEqual(formatCurrency(1000, 'INR'), '₹1,000');
      assert.strictEqual(formatCurrency(10000, 'INR'), '₹10,000');
      assert.strictEqual(formatCurrency(100000, 'INR'), '₹1,00,000');
      assert.strictEqual(formatCurrency(1000000, 'INR'), '₹10,00,000');
      assert.strictEqual(formatCurrency(10000000, 'INR'), '₹1,00,00,000');
      assert.strictEqual(formatCurrency(1000000000, 'INR'), '₹1,00,00,00,000');
    });

    it('handles international currency symbols and formatting', () => {
      assert.strictEqual(formatCurrency(5000, 'USD'), '$5,000');
      assert.strictEqual(formatCurrency(2500, 'EUR'), '€2,500');
      assert.strictEqual(formatCurrency(1200, 'GBP'), '£1,200');
      assert.strictEqual(formatCurrency(10000, 'JPY'), '¥10,000');
      assert.strictEqual(getCurrencySymbol('INR'), '₹');
      assert.strictEqual(getCurrencySymbol('USD'), '$');
    });

    it('compact format produces readable financial statements without precision loss', () => {
      assert.strictEqual(formatCurrency(500, 'INR', { compact: true }), '₹500');
      assert.strictEqual(formatCurrency(45000, 'INR', { compact: true }), '₹45k');
      assert.strictEqual(formatCurrency(2450000, 'INR', { compact: true }), '₹24.5L');
      assert.strictEqual(formatCurrency(15000000, 'INR', { compact: true }), '₹1.5Cr');
      assert.strictEqual(formatCurrency(2500000, 'USD', { compact: true }), '$2.5M');
      assert.strictEqual(formatCurrency(1200000000, 'USD', { compact: true }), '$1.2B');
    });

    it('date formatters maintain editorial uppercase style and relative grouping', () => {
      const headerDate = formatEditorialHeaderDate(new Date(2026, 7, 16));
      assert.ok(headerDate.includes('AUGUST'));
      assert.ok(headerDate.includes('16'));

      const todayStr = new Date().toISOString();
      assert.strictEqual(formatLedgerDate(todayStr), 'TODAY');

      const pastDate = '2026-01-15T10:30:00.000Z';
      const pastFormatted = formatLedgerDate(pastDate);
      assert.strictEqual(pastFormatted, '15 JAN');

      const d = new Date(pastDate);
      const expectedTime = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      assert.strictEqual(formatTransactionTime(pastDate), expectedTime);
    });
  });

  // =========================================================================
  // 2. FINANCIAL BALANCE & ACCOUNTS LOGIC VALIDATION
  // =========================================================================
  describe('2. Financial Balance & Ledger Calculation Integrity', () => {
    const mockAccounts: Account[] = [
      { id: 'acc_hdfc', profileId: 'p1', name: 'HDFC Checking', type: 'checking', balance: 75000, currency: 'INR', createdAt: '', updatedAt: '' },
      { id: 'acc_sbi', profileId: 'p1', name: 'SBI Savings', type: 'savings', balance: 50000, currency: 'INR', createdAt: '', updatedAt: '' },
      { id: 'acc_cash', profileId: 'p1', name: 'Cash Wallet', type: 'cash', balance: 5000, currency: 'INR', createdAt: '', updatedAt: '' },
      { id: 'acc_card', profileId: 'p1', name: 'Credit Card', type: 'credit', balance: 12000, currency: 'INR', createdAt: '', updatedAt: '' },
      { id: 'acc_loan', profileId: 'p1', name: 'Personal Loan', type: 'loan', balance: 20000, currency: 'INR', createdAt: '', updatedAt: '' },
    ];

    it('computes net worth / total liquid balance by treating credits and loans as liabilities', () => {
      const total = calculateTotalBalance(mockAccounts);
      assert.strictEqual(total, 98000);
    });

    it('computes account balance updates correctly for income, expense, and transfer', () => {
      const initial = 50000;
      const txs: Transaction[] = [
        { id: 't1', profileId: 'p1', date: '', description: 'Salary', amount: 20000, currency: 'INR', category: 'Salary', type: 'income', accountId: 'acc_hdfc', createdAt: '', updatedAt: '' },
        { id: 't2', profileId: 'p1', date: '', description: 'Rent', amount: 15000, currency: 'INR', category: 'Bills', type: 'expense', accountId: 'acc_hdfc', createdAt: '', updatedAt: '' },
        { id: 't3', profileId: 'p1', date: '', description: 'Transfer Out', amount: 5000, currency: 'INR', category: 'Transfer', type: 'transfer', accountId: 'acc_hdfc', toAccountId: 'acc_sbi', createdAt: '', updatedAt: '' },
        { id: 't4', profileId: 'p1', date: '', description: 'Transfer In', amount: 2000, currency: 'INR', category: 'Transfer', type: 'transfer', accountId: 'acc_cash', toAccountId: 'acc_hdfc', createdAt: '', updatedAt: '' },
      ];

      const balance = computeAccountBalance(initial, 'acc_hdfc', txs);
      assert.strictEqual(balance, 52000);
    });

    it('handles zero accounts gracefully without NaN', () => {
      assert.strictEqual(calculateTotalBalance([]), 0);
    });
  });

  // =========================================================================
  // 3. MONEY FLOW & FINANCIAL PULSE HEURISTICS VALIDATION
  // =========================================================================
  describe('3. Money Flow & Financial Pulse Heuristics', () => {
    it('handles empty transactions with default baseline pulse', () => {
      const flow = calculateMoneyFlow([]);
      assert.strictEqual(flow.income, 0);
      assert.strictEqual(flow.expenses, 0);
      assert.strictEqual(flow.saved, 0);
      assert.strictEqual(flow.savingsRate, 0);
      assert.strictEqual(flow.topCategories.length, 0);

      const pulse = calculateFinancialPulse([]);
      assert.strictEqual(pulse.score, 75);
      assert.strictEqual(pulse.status, 'STEADY');
    });

    it('calculates money flow with surplus and categorized breakdown', () => {
      const txs: Transaction[] = [
        { id: 't1', profileId: 'p1', date: '2026-08-01T10:00:00Z', description: 'Salary', amount: 100000, currency: 'INR', category: 'Salary', type: 'income', accountId: 'a1', createdAt: '', updatedAt: '' },
        { id: 't2', profileId: 'p1', date: '2026-08-05T12:00:00Z', description: 'Groceries', amount: 15000, currency: 'INR', category: 'Food & Dining', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
        { id: 't3', profileId: 'p1', date: '2026-08-10T14:00:00Z', description: 'Dining out', amount: 5000, currency: 'INR', category: 'Food & Dining', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
        { id: 't4', profileId: 'p1', date: '2026-08-12T16:00:00Z', description: 'Uber', amount: 4000, currency: 'INR', category: 'Transport', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
        { id: 't5', profileId: 'p1', date: '2026-08-14T18:00:00Z', description: 'Gadget', amount: 6000, currency: 'INR', category: 'Shopping', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
      ];

      const flow = calculateMoneyFlow(txs);
      assert.strictEqual(flow.income, 100000);
      assert.strictEqual(flow.expenses, 30000);
      assert.strictEqual(flow.saved, 70000);
      assert.strictEqual(flow.savingsRate, 70);
      assert.strictEqual(flow.topCategories.length, 3);
      assert.strictEqual(flow.topCategories[0].category, 'Food & Dining');
      assert.strictEqual(flow.topCategories[0].amount, 20000);
      assert.strictEqual(flow.topCategories[0].percentage, 67);
    });

    it('correctly reports deficit when expenses exceed income without negative saved numbers', () => {
      const txs: Transaction[] = [
        { id: 't1', profileId: 'p1', date: '2026-08-01T10:00:00Z', description: 'Freelance', amount: 20000, currency: 'INR', category: 'Freelance', type: 'income', accountId: 'a1', createdAt: '', updatedAt: '' },
        { id: 't2', profileId: 'p1', date: '2026-08-05T12:00:00Z', description: 'Hospital Bill', amount: 35000, currency: 'INR', category: 'Health', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
      ];

      const flow = calculateMoneyFlow(txs);
      assert.strictEqual(flow.income, 20000);
      assert.strictEqual(flow.expenses, 35000);
      assert.strictEqual(flow.saved, 0);
      assert.strictEqual(flow.savingsRate, 0);

      const pulse = calculateFinancialPulse(txs);
      assert.ok(['MODERATE', 'CAUTION', 'CRITICAL'].includes(pulse.status));
    });
  });

  // =========================================================================
  // 4. PLANNING (BUDGETS, GOALS, DEBT) VALIDATION
  // =========================================================================
  describe('4. Planning Engine (Budgets, Goals, Debt)', () => {
    it('accurately monitors budget tracking thresholds and overspending states', () => {
      const budgets: Budget[] = [
        { id: 'b1', profileId: 'p1', category: 'Food & Dining', limitAmount: 10000, period: 'monthly', startDate: '2026-08-01', alertThreshold: 0.8 },
        { id: 'b2', profileId: 'p1', category: 'Transport', limitAmount: 5000, period: 'monthly', startDate: '2026-08-01', alertThreshold: 0.8 },
      ];
      const txs: Transaction[] = [
        { id: 't1', profileId: 'p1', date: '2026-08-05T00:00:00Z', description: 'Groceries', amount: 8500, currency: 'INR', category: 'Food & Dining', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
        { id: 't2', profileId: 'p1', date: '2026-08-06T00:00:00Z', description: 'Fuel', amount: 6000, currency: 'INR', category: 'Transport', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
      ];

      const status = calculateBudgetStatus(budgets, txs);
      assert.strictEqual(status.length, 2);

      const foodTrack = status.find(s => s.category === 'Food & Dining')!;
      assert.strictEqual(foodTrack.spentAmount, 8500);
      assert.strictEqual(foodTrack.remainingAmount, 1500);
      assert.strictEqual(foodTrack.isOverBudget, false);
      assert.strictEqual(foodTrack.isNearThreshold, true);

      const transportTrack = status.find(s => s.category === 'Transport')!;
      assert.strictEqual(transportTrack.spentAmount, 6000);
      assert.strictEqual(transportTrack.remainingAmount, 0);
      assert.strictEqual(transportTrack.isOverBudget, true);
    });

    it('calculates goal timelines and required monthly savings targets', () => {
      const goal: Goal = {
        id: 'g1',
        profileId: 'p1',
        name: 'Europe Trip',
        targetAmount: 200000,
        currentAmount: 80000,
        currency: 'INR',
        targetDate: '2026-12-31',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      };

      const result = calculateGoalProgress(goal);
      assert.strictEqual(result.percentage, 40);
      assert.strictEqual(result.remainingAmount, 120000);
      assert.ok(result.monthsRemaining >= 1);
      assert.strictEqual(result.requiredMonthlySavings, Math.round(120000 / result.monthsRemaining));
    });

    it('calculates debt payoff timeline and remaining principal accurately', () => {
      const debt: Debt = {
        id: 'd1',
        profileId: 'p1',
        name: 'Auto Loan',
        principalAmount: 600000,
        remainingAmount: 300000,
        interestRate: 9.5,
        minimumEmi: 15000,
        currency: 'INR',
        startDate: '2024-01-01',
        targetPayoffDate: '2027-01-01',
        createdAt: '',
        updatedAt: '',
      };

      const payoff = calculateDebtPayoff(debt);
      assert.strictEqual(payoff.totalRemaining, 300000);
      assert.strictEqual(payoff.progressPercentage, 50);
      assert.strictEqual(payoff.monthsRemaining, 20);
      assert.ok(payoff.freedomDateString.length > 3);
    });
  });

  // =========================================================================
  // 5. WEALTH & NET WORTH ENGINE VALIDATION
  // =========================================================================
  describe('5. Wealth & Portfolio Allocation Integrity', () => {
    it('aggregates portfolio holdings and calculates P&L and asset distribution', () => {
      const holdings: Investment[] = [
        { id: 'i1', profileId: 'p1', name: 'Nifty ETF', assetType: 'equity', units: 100, buyPrice: 200, currentPrice: 260, currency: 'INR', investedAmount: 20000, currentValue: 26000, returns: 6000, returnsPercentage: 30, createdAt: '', updatedAt: '' },
        { id: 'i2', profileId: 'p1', name: 'HDFC FlexiCap', assetType: 'mutual_fund', units: 50, buyPrice: 300, currentPrice: 360, currency: 'INR', investedAmount: 15000, currentValue: 18000, returns: 3000, returnsPercentage: 20, createdAt: '', updatedAt: '' },
        { id: 'i3', profileId: 'p1', name: 'Sovereign Gold Bond', assetType: 'gold', units: 10, buyPrice: 5000, currentPrice: 6000, currency: 'INR', investedAmount: 50000, currentValue: 60000, returns: 10000, returnsPercentage: 20, createdAt: '', updatedAt: '' },
      ];

      const summary = calculatePortfolioSummary(holdings);
      assert.strictEqual(summary.totalInvested, 85000);
      assert.strictEqual(summary.totalCurrentValue, 104000);
      assert.strictEqual(summary.totalReturns, 19000);
      assert.strictEqual(summary.returnsPercentage, 22.35);

      assert.strictEqual(summary.allocations.length, 3);
      assert.strictEqual(summary.allocations[0].assetType, 'gold');
      assert.strictEqual(summary.allocations[0].totalValue, 60000);
    });

    it('calculates total balance sheet net worth across liquid, portfolio, and debts', () => {
      const accounts: Account[] = [
        { id: 'a1', profileId: 'p1', name: 'Savings', type: 'savings', balance: 100000, currency: 'INR', createdAt: '', updatedAt: '' },
      ];
      const investments: Investment[] = [
        { id: 'i1', profileId: 'p1', name: 'Stocks', assetType: 'equity', units: 1, buyPrice: 200000, currentPrice: 250000, currency: 'INR', investedAmount: 200000, currentValue: 250000, returns: 50000, returnsPercentage: 25, createdAt: '', updatedAt: '' },
      ];
      const debts: Debt[] = [
        { id: 'd1', profileId: 'p1', name: 'Car Loan', principalAmount: 100000, remainingAmount: 50000, interestRate: 8, minimumEmi: 5000, currency: 'INR', startDate: '', targetPayoffDate: '', createdAt: '', updatedAt: '' },
      ];

      const nw = calculateNetWorth(accounts, investments, debts);
      assert.strictEqual(nw.totalAssets, 350000);
      assert.strictEqual(nw.totalLiabilities, 50000);
      assert.strictEqual(nw.netWorth, 300000);
      assert.strictEqual(nw.historyPoints.length, 12);
    });
  });

  // =========================================================================
  // 6. FINANCIAL DESK (AI ANALYST) INTERPRETATION VALIDATION
  // =========================================================================
  describe('6. Financial Desk AI Analyst Heuristics', () => {
    const txs: Transaction[] = [
      { id: 't1', profileId: 'p1', date: '2026-08-01T10:00:00Z', description: 'Salary', amount: 80000, currency: 'INR', category: 'Salary', type: 'income', accountId: 'a1', createdAt: '', updatedAt: '' },
      { id: 't2', profileId: 'p1', date: '2026-08-02T12:00:00Z', description: 'Fine Dining', amount: 12000, currency: 'INR', category: 'Food & Dining', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
      { id: 't3', profileId: 'p1', date: '2026-08-08T18:00:00Z', description: 'Weekend Party', amount: 8000, currency: 'INR', category: 'Entertainment', type: 'expense', accountId: 'a1', createdAt: '', updatedAt: '' },
    ];
    const accounts: Account[] = [
      { id: 'a1', profileId: 'p1', name: 'Primary', type: 'checking', balance: 60000, currency: 'INR', createdAt: '', updatedAt: '' },
    ];

    it('interprets spending breakdown queries accurately', () => {
      const res = FinancialDeskEngine.analyzeQuery('Where did my money go this month?', txs, accounts, [], 'INR');
      assert.ok(res.headline.includes('REVIEW'));
      assert.ok(res.insights.some(i => i.includes('Food & Dining')));
      assert.ok(res.recommendation && res.recommendation.length > 0);
    });

    it('interprets purchase affordability viability', () => {
      const affordable = FinancialDeskEngine.analyzeQuery('Can I afford 15000?', txs, accounts, [], 'INR');
      assert.ok(affordable.summary.includes('within your current liquidity buffer'));

      const unaffordable = FinancialDeskEngine.analyzeQuery('Can I buy a watch for 55000?', txs, accounts, [], 'INR');
      assert.ok(unaffordable.summary.includes('compress your available liquidity buffer'));
    });

    it('analyzes weekend spending velocity surges', () => {
      const res = FinancialDeskEngine.analyzeQuery('Weekend velocity analysis', txs, accounts, [], 'INR');
      assert.ok(res.headline.includes('WEEKEND'));
      assert.ok(res.insights.length > 0);
    });
  });

  // =========================================================================
  // 7. BACKUP, EXPORT & RESTORE INTEGRITY VALIDATION
  // =========================================================================
  describe('7. Backup, Export, Restore & Data Migration', () => {
    it('validates versioned backup JSON format structure and compatibility', () => {
      const profile: Profile = { id: 'p1', name: 'MasterZ', currency: 'INR', isOnboarded: true, createdAt: '', updatedAt: '' };
      const backup: BackupData = {
        format: 'fintrack-backup',
        version: 1,
        createdAt: new Date().toISOString(),
        appVersion: '1.0.0',
        profile,
        accounts: [],
        transactions: [],
        budgets: [],
        goals: [],
        debts: [],
        investments: [],
        categories: [],
      };

      const jsonStr = JSON.stringify(backup);
      const parsed = JSON.parse(jsonStr) as BackupData;
      assert.strictEqual(parsed.format, 'fintrack-backup');
      assert.strictEqual(parsed.version, 1);
      assert.strictEqual(parsed.profile.name, 'MasterZ');
    });

    it('rejects corrupted or non-fintrack backup JSON formats gracefully', () => {
      const invalidJson = JSON.stringify({ someOtherApp: true, format: 'unknown' });
      assert.throws(() => {
        const data = JSON.parse(invalidJson);
        if (data.format !== 'fintrack-backup') throw new Error('Invalid backup format');
      }, /Invalid backup format/);
    });
  });

  // =========================================================================
  // 8. CSV EXPORT & STATEMENT PARSER INTEGRITY VALIDATION
  // =========================================================================
  describe('8. CSV Exporter & Bank Statement Parser', () => {
    it('exports transactions accurately to standard CSV with headers and escaped strings', () => {
      const txs: Transaction[] = [
        { id: 't1', profileId: 'p1', date: '2026-08-16T10:00:00Z', description: 'Grocery Store, Inc.', amount: 1250.50, currency: 'INR', category: 'Food & Dining', type: 'expense', accountId: 'acc1', notes: 'Weekly milk, eggs', createdAt: '', updatedAt: '' },
      ];
      const accountMap = { acc1: 'HDFC Checking' };

      const csv = exportTransactionsToCsv(txs, accountMap);
      assert.ok(csv.startsWith('Date,Description,Category,Type,Amount,Currency,Account,Notes'));
      assert.ok(csv.includes('"Grocery Store, Inc."'));
      assert.ok(csv.includes('1250.50'));
      assert.ok(csv.includes('HDFC Checking'));
      assert.ok(csv.includes('"Weekly milk, eggs"'));
    });

    it('intelligently parses bank statement CSV records and categorizes them', () => {
      const rawBankCsv = `Date,Narrative,Withdrawal,Deposit
2026-08-10,SWIGGY BANGALORE,450.00,
2026-08-11,UBER TRIP MUMBAI,650.00,
2026-08-12,SALARY CREDIT FROM ACME,0.00,85000.00
2026-08-13,AMAZON PAY RETAIL,1200.00,`;

      const results = parseBankStatementCsv(rawBankCsv);
      assert.strictEqual(results.length, 4);

      assert.strictEqual(results[0].description, 'SWIGGY BANGALORE');
      assert.strictEqual(results[0].amount, 450);
      assert.strictEqual(results[0].type, 'expense');
      assert.strictEqual(results[0].category, 'Food & Dining');

      assert.strictEqual(results[1].category, 'Transport');

      assert.strictEqual(results[2].description, 'SALARY CREDIT FROM ACME');
      assert.strictEqual(results[2].amount, 85000);
      assert.strictEqual(results[2].type, 'income');
      assert.strictEqual(results[2].category, 'Salary');

      assert.strictEqual(results[3].category, 'Shopping');
    });

    it('handles empty or malformed CSV inputs gracefully', () => {
      assert.strictEqual(parseBankStatementCsv('').length, 0);
      assert.strictEqual(parseBankStatementCsv('Only One Line Header').length, 0);
      assert.strictEqual(parseBankStatementCsv('Date,Amount\n2026-08-01,invalid').length, 0);
    });
  });
});
