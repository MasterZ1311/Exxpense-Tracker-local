import { Debt } from '@fintrack/domain';
import { getDatabase } from '../db';

interface DebtRow {
  id: string;
  profile_id: string;
  name: string;
  principal_amount: number;
  remaining_amount: number;
  interest_rate: number;
  minimum_emi: number;
  currency: string;
  start_date: string;
  target_payoff_date: string;
  lender: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToDebt(row: DebtRow): Debt {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    principalAmount: row.principal_amount,
    remainingAmount: row.remaining_amount,
    interestRate: row.interest_rate,
    minimumEmi: row.minimum_emi,
    currency: row.currency,
    startDate: row.start_date,
    targetPayoffDate: row.target_payoff_date,
    lender: row.lender || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class DebtRepository {
  static async getByProfileId(profileId: string): Promise<Debt[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<DebtRow>(
      'SELECT * FROM debts WHERE profile_id = ? ORDER BY remaining_amount DESC;',
      [profileId]
    );
    return rows.map(mapRowToDebt);
  }

  static async create(debt: Debt): Promise<Debt> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO debts (id, profile_id, name, principal_amount, remaining_amount, interest_rate, minimum_emi, currency, start_date, target_payoff_date, lender, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        debt.id,
        debt.profileId,
        debt.name,
        debt.principalAmount,
        debt.remainingAmount,
        debt.interestRate || 0,
        debt.minimumEmi || 0,
        debt.currency || 'INR',
        debt.startDate,
        debt.targetPayoffDate,
        debt.lender || null,
        debt.createdAt || now,
        debt.updatedAt || now,
      ]
    );
    return debt;
  }
}
