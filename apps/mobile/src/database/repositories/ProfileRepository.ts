import { Profile } from '@fintrack/domain';
import { getDatabase } from '../db';

interface ProfileRow {
  id: string;
  name: string;
  currency: string;
  monthly_income: number;
  is_onboarded: number;
  created_at: string;
  updated_at: string;
}

function mapRowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    currency: row.currency,
    monthlyIncome: row.monthly_income,
    isOnboarded: row.is_onboarded === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ProfileRepository {
  static async getCurrentProfile(): Promise<Profile | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<ProfileRow>(
      'SELECT * FROM profiles ORDER BY created_at ASC LIMIT 1;'
    );
    return row ? mapRowToProfile(row) : null;
  }

  static async createProfile(profile: Profile): Promise<Profile> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO profiles (id, name, currency, monthly_income, is_onboarded, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        profile.id,
        profile.name,
        profile.currency || 'INR',
        profile.monthlyIncome || 0,
        profile.isOnboarded ? 1 : 0,
        profile.createdAt,
        profile.updatedAt,
      ]
    );
    return profile;
  }

  static async updateProfile(profile: Profile): Promise<Profile> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `UPDATE profiles
       SET name = ?, currency = ?, monthly_income = ?, is_onboarded = ?, updated_at = ?
       WHERE id = ?;`,
      [
        profile.name,
        profile.currency,
        profile.monthlyIncome || 0,
        profile.isOnboarded ? 1 : 0,
        now,
        profile.id,
      ]
    );
    return { ...profile, updatedAt: now };
  }
}
