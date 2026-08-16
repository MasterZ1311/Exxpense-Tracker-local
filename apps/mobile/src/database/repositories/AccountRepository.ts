import { Account, AccountType } from '@fintrack/domain';
import { getDatabase } from '../db';

interface AccountRow {
  id: string;
  profile_id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  institution?: string;
  account_number?: string;
  is_default: number;
  color?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

function mapRowToAccount(row: AccountRow): Account {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    type: row.type as AccountType,
    balance: row.balance,
    currency: row.currency,
    institution: row.institution || undefined,
    accountNumber: row.account_number || undefined,
    isDefault: row.is_default === 1,
    color: row.color || undefined,
    icon: row.icon || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class AccountRepository {
  static async getByProfileId(profileId: string): Promise<Account[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<AccountRow>(
      'SELECT * FROM accounts WHERE profile_id = ? ORDER BY is_default DESC, created_at ASC;',
      [profileId]
    );
    return rows.map(mapRowToAccount);
  }

  static async getById(id: string): Promise<Account | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<AccountRow>('SELECT * FROM accounts WHERE id = ?;', [id]);
    return row ? mapRowToAccount(row) : null;
  }

  static async getDefaultAccount(profileId: string): Promise<Account | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<AccountRow>(
      'SELECT * FROM accounts WHERE profile_id = ? AND is_default = 1 LIMIT 1;',
      [profileId]
    );
    if (row) return mapRowToAccount(row);

    // Fallback to first account
    const firstRow = await db.getFirstAsync<AccountRow>(
      'SELECT * FROM accounts WHERE profile_id = ? ORDER BY created_at ASC LIMIT 1;',
      [profileId]
    );
    return firstRow ? mapRowToAccount(firstRow) : null;
  }

  static async createAccount(account: Account): Promise<Account> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO accounts (id, profile_id, name, type, balance, currency, institution, account_number, is_default, color, icon, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        account.id,
        account.profileId,
        account.name,
        account.type,
        account.balance,
        account.currency,
        account.institution || null,
        account.accountNumber || null,
        account.isDefault ? 1 : 0,
        account.color || null,
        account.icon || null,
        account.createdAt,
        account.updatedAt,
      ]
    );
    return account;
  }

  static async updateBalance(accountId: string, newBalance: number): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      'UPDATE accounts SET balance = ?, updated_at = ? WHERE id = ?;',
      [newBalance, now, accountId]
    );
  }
}
