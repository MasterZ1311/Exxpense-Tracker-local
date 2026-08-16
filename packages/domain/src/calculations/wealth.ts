import { Investment, Account, Debt } from '../models/types';
import { calculateTotalBalance } from './balance';

export interface AssetAllocationItem {
  assetType: string;
  label: string;
  totalValue: number;
  percentage: number;
  color: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalReturns: number;
  returnsPercentage: number;
  allocations: AssetAllocationItem[];
}

const ASSET_LABELS: Record<string, { label: string; color: string }> = {
  equity: { label: 'EQUITY', color: '#B89A58' }, // Brass
  mutual_fund: { label: 'MUTUAL FUNDS', color: '#526B4F' }, // Moss
  gold: { label: 'GOLD', color: '#D4AF37' }, // Gold
  crypto: { label: 'CRYPTO', color: '#59445E' }, // Plum
  cash: { label: 'CASH', color: '#687276' }, // Slate
  real_estate: { label: 'REAL ESTATE', color: '#C96F52' }, // Terracotta
};

export function calculatePortfolioSummary(investments: Investment[]): PortfolioSummary {
  let totalInvested = 0;
  let totalCurrentValue = 0;
  const typeValues: Record<string, number> = {};

  for (const inv of investments) {
    totalInvested += inv.investedAmount;
    totalCurrentValue += inv.currentValue;

    const t = inv.assetType || 'equity';
    typeValues[t] = (typeValues[t] || 0) + inv.currentValue;
  }

  const totalReturns = totalCurrentValue - totalInvested;
  const returnsPercentage = totalInvested > 0
    ? Number(((totalReturns / totalInvested) * 100).toFixed(2))
    : 0;

  const allocations: AssetAllocationItem[] = Object.entries(typeValues)
    .map(([assetType, value]) => {
      const meta = ASSET_LABELS[assetType] || { label: assetType.toUpperCase(), color: '#B89A58' };
      return {
        assetType,
        label: meta.label,
        totalValue: value,
        percentage: totalCurrentValue > 0 ? Math.round((value / totalCurrentValue) * 100) : 0,
        color: meta.color,
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue);

  return {
    totalInvested,
    totalCurrentValue,
    totalReturns,
    returnsPercentage,
    allocations,
  };
}

export interface NetWorthSummary {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  yearlyGrowth: number;
  growthPercentage: number;
  historyPoints: Array<{ month: string; netWorth: number }>;
}

export function calculateNetWorth(
  accounts: Account[],
  investments: Investment[],
  debts: Debt[]
): NetWorthSummary {
  let liquidAssets = 0;
  let liabilities = 0;

  for (const acc of accounts) {
    if (acc.type === 'loan' || acc.type === 'credit') {
      liabilities += Math.abs(acc.balance);
    } else {
      liquidAssets += acc.balance;
    }
  }

  const portfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const debtLiabilities = debts.reduce((sum, d) => sum + d.remainingAmount, 0);

  const totalAssets = liquidAssets + portfolioValue;
  const totalLiabilities = liabilities + debtLiabilities;
  const netWorth = totalAssets - totalLiabilities;

  // Approximate 12-month simulated baseline history points for growth line visualization
  const historyPoints: Array<{ month: string; netWorth: number }> = [];
  const monthLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const baseline = Math.max(10000, netWorth * 0.88);

  for (let i = 0; i < 12; i++) {
    const factor = 0.88 + (i / 11) * 0.12;
    historyPoints.push({
      month: monthLabels[i],
      netWorth: Math.round(netWorth * factor),
    });
  }

  const yearlyGrowth = Math.round(netWorth - baseline);
  const growthPercentage = baseline > 0 ? Number(((yearlyGrowth / baseline) * 100).toFixed(1)) : 0;

  return {
    netWorth,
    totalAssets,
    totalLiabilities,
    yearlyGrowth,
    growthPercentage,
    historyPoints,
  };
}
