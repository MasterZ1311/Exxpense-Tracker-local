import { Budget, BudgetPeriod } from '@fintrack/domain';
import { getDatabase } from '../db';

interface BudgetRow {
  id: string;
  profile_id: string;
  category: string;
  limit_amount: number;
  period: string;
  start_date: string;
  alert_threshold: number;
  created_at: string;
}

function mapRowToBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    profileId: row.profile_id,
    category: row.category,
    limitAmount: row.limit_amount,
    period: row.period as BudgetPeriod,
    startDate: row.start_date,
    alertThreshold: row.alert_threshold,
    createdAt: row.created_at,
  };
}

export class BudgetRepository {
  static async getByProfileId(profileId: string): Promise<Budget[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<BudgetRow>(
      'SELECT * FROM budgets WHERE profile_id = ? ORDER BY limit_amount DESC;',
      [profileId]
    );
    return rows.map(mapRowToBudget);
  }

  static async create(budget: Budget): Promise<Budget> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO budgets (id, profile_id, category, limit_amount, period, start_date, alert_threshold, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        budget.id,
        budget.profileId,
        budget.category,
        budget.limitAmount,
        budget.period || 'monthly',
        budget.startDate || now,
        budget.alertThreshold || 0.8,
        now,
      ]
    );
    return { ...budget, createdAt: now };
  }
}
