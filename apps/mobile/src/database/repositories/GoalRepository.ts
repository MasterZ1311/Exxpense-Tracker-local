import { Goal } from '@fintrack/domain';
import { getDatabase } from '../db';

interface GoalRow {
  id: string;
  profile_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  target_date: string;
  category: string | null;
  color: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    targetAmount: row.target_amount,
    currentAmount: row.current_amount,
    currency: row.currency,
    targetDate: row.target_date,
    category: row.category || undefined,
    color: row.color || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class GoalRepository {
  static async getByProfileId(profileId: string): Promise<Goal[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<GoalRow>(
      'SELECT * FROM goals WHERE profile_id = ? ORDER BY target_date ASC;',
      [profileId]
    );
    return rows.map(mapRowToGoal);
  }

  static async create(goal: Goal): Promise<Goal> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO goals (id, profile_id, name, target_amount, current_amount, currency, target_date, category, color, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        goal.id,
        goal.profileId,
        goal.name,
        goal.targetAmount,
        goal.currentAmount || 0,
        goal.currency || 'INR',
        goal.targetDate,
        goal.category || null,
        goal.color || null,
        goal.notes || null,
        goal.createdAt || now,
        goal.updatedAt || now,
      ]
    );
    return goal;
  }

  static async updateCurrentAmount(goalId: string, amount: number): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      'UPDATE goals SET current_amount = ?, updated_at = ? WHERE id = ?;',
      [amount, now, goalId]
    );
  }
}
