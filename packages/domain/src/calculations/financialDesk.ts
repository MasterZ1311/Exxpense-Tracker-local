import { Transaction, Account, Budget } from '../models/types';
import { calculateMoneyFlow } from './moneyFlow';
import { calculateFinancialPulse } from './pulse';
import { formatCurrency } from '../formatters/currency';

export interface FinancialDeskQueryResponse {
  headline: string;
  keyMetric?: string;
  summary: string;
  insights: string[];
  recommendation?: string;
  timestamp: string;
}

export class FinancialDeskEngine {
  /**
   * Interprets user prompt locally against actual financial data
   */
  static analyzeQuery(
    prompt: string,
    transactions: Transaction[],
    accounts: Account[],
    budgets: Budget[] = [],
    currency: string = 'INR'
  ): FinancialDeskQueryResponse {
    const lower = prompt.toLowerCase();
    const flow = calculateMoneyFlow(transactions);
    const pulse = calculateFinancialPulse(transactions);
    const totalLiquid = accounts.reduce((sum, a) => sum + (a.type !== 'loan' && a.type !== 'credit' ? a.balance : 0), 0);

    const now = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = monthNames[now.getMonth()].toUpperCase();

    // 1. Spending breakdown query
    if (lower.includes('where') || lower.includes('spend') || lower.includes('go') || lower.includes('breakdown')) {
      const topCat = flow.topCategories[0];
      const topCatStr = topCat ? `${topCat.category} is your largest category at ${formatCurrency(topCat.amount, currency)} (${topCat.percentage}%).` : 'No major category recorded.';
      const weekendNote = pulse.weekendSpendingRatio > 0.2
        ? `Weekend spending is ${Math.round(pulse.weekendSpendingRatio * 100)}% higher than weekday spending.`
        : 'Daily spending distribution is evenly balanced.';

      return {
        headline: `YOUR ${currentMonth} REVIEW`,
        keyMetric: `${formatCurrency(flow.expenses, currency)} total spending`,
        summary: `You have recorded ${formatCurrency(flow.expenses, currency)} in outflows against ${formatCurrency(flow.income, currency)} in total inflows this month.`,
        insights: [
          topCatStr,
          weekendNote,
          `You're currently retaining ${formatCurrency(flow.saved, currency)} (${flow.savingsRate}% savings rate).`,
        ],
        recommendation: flow.savingsRate > 20
          ? 'Current retention rate is strong. Consider channeling surplus into investment assets.'
          : 'Discretionary spending is consuming most inflows. Review top category outlays.',
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Affordability analysis query (e.g. "Can I afford 20000?")
    if (lower.includes('afford') || lower.includes('buy') || lower.includes('purchase') || lower.includes('can i')) {
      // Extract number from prompt if possible
      const match = lower.match(/\d+[\d,]*/);
      const parsedAmount = match ? parseFloat(match[0].replace(/,/g, '')) : 20000;

      const bufferRemaining = totalLiquid - parsedAmount;
      const canAffordSafely = bufferRemaining > totalLiquid * 0.3 && parsedAmount <= flow.saved + 5000;

      return {
        headline: 'PURCHASE VIABILITY ASSESSMENT',
        keyMetric: formatCurrency(parsedAmount, currency),
        summary: canAffordSafely
          ? `A capital outlay of ${formatCurrency(parsedAmount, currency)} is within your current liquidity buffer.`
          : `A capital outlay of ${formatCurrency(parsedAmount, currency)} will compress your available liquidity buffer below recommended thresholds.`,
        insights: [
          `Current liquid cash across active accounts: ${formatCurrency(totalLiquid, currency)}.`,
          `Estimated liquidity post-purchase: ${formatCurrency(Math.max(0, bufferRemaining), currency)}.`,
          `This purchase represents ${Math.round((parsedAmount / Math.max(1, totalLiquid)) * 100)}% of your available cash reserves.`,
        ],
        recommendation: canAffordSafely
          ? 'The outlay is sustainable without violating emergency reserves.'
          : 'Consider staging this purchase over 2-3 months or funding it from targeted discretionary reserves.',
        timestamp: new Date().toISOString(),
      };
    }

    // 3. Weekend vs Weekday analysis
    if (lower.includes('weekend') || lower.includes('timing') || lower.includes('velocity')) {
      const weekendPct = Math.round(pulse.weekendSpendingRatio * 100);
      return {
        headline: 'WEEKEND SPENDING VELOCITY',
        keyMetric: `${weekendPct > 0 ? `+${weekendPct}%` : 'Balanced'} weekend surge`,
        summary: `Analysis of your ledger timestamps reveals clear transaction velocity patterns.`,
        insights: [
          pulse.weekendSpendingRatio > 0.25
            ? `Your weekend daily spend rate is ${weekendPct}% above your weekday average.`
            : `Your spending rhythm remains calm and steady throughout the week.`,
          `Discretionary dining and leisure transactions account for the majority of Saturday/Sunday entries.`,
        ],
        recommendation: pulse.weekendSpendingRatio > 0.3
          ? 'Setting a weekend spending envelope can protect monthly savings targets.'
          : 'Your disciplined spending cadence is keeping budget variance low.',
        timestamp: new Date().toISOString(),
      };
    }

    // Default overview report
    return {
      headline: `FINANCIAL PULSE & OUTLOOK`,
      keyMetric: pulse.headline,
      summary: pulse.insight,
      insights: [
        `Total liquid assets across accounts: ${formatCurrency(totalLiquid, currency)}.`,
        `Net savings this month: ${formatCurrency(flow.saved, currency)} (${flow.savingsRate}% of total inflows).`,
        `Spending variance score: ${pulse.spendingScore}/30.`,
      ],
      recommendation: 'Keep recording every outlay to refine predictive analytics and budget thresholds.',
      timestamp: new Date().toISOString(),
    };
  }
}
