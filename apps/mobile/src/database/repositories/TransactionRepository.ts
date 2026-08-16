import { Transaction, TransactionType, SplitPart } from '@fintrack/domain';
import { getDatabase } from '../db';
import { AccountRepository } from './AccountRepository';

interface TransactionRow {
  id: string;
  profile_id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  converted_amount: number | null;
  category: string;
  subcategory: string | null;
  type: string;
  account_id: string;
  to_account_id: string | null;
  tags: string | null;
  notes: string | null;
  receipt_uri: string | null;
  is_recurring: number;
  recurring_rule: string | null;
  payment_method: string | null;
  merchant: string | null;
  imported_from: string | null;
  is_split: number;
  split_parts: string | null;
  is_billable: number;
  gst_rate: number | null;
  gst_amount: number | null;
  created_at: string;
  updated_at: string;
}

function mapRowToTransaction(row: TransactionRow): Transaction {
  let tags: string[] | undefined;
  let splitParts: SplitPart[] | undefined;

  try {
    if (row.tags) tags = JSON.parse(row.tags);
  } catch (e) {
    tags = undefined;
  }

  try {
    if (row.split_parts) splitParts = JSON.parse(row.split_parts);
  } catch (e) {
    splitParts = undefined;
  }

  return {
    id: row.id,
    profileId: row.profile_id,
    date: row.date,
    description: row.description,
    amount: row.amount,
    currency: row.currency,
    convertedAmount: row.converted_amount || undefined,
    category: row.category,
    subcategory: row.subcategory || undefined,
    type: row.type as TransactionType,
    accountId: row.account_id,
    toAccountId: row.to_account_id || undefined,
    tags,
    notes: row.notes || undefined,
    receiptUri: row.receipt_uri || undefined,
    isRecurring: row.is_recurring === 1,
    recurringRule: row.recurring_rule || undefined,
    paymentMethod: row.payment_method || undefined,
    merchant: row.merchant || undefined,
    importedFrom: row.imported_from || undefined,
    isSplit: row.is_split === 1,
    splitParts,
    isBillable: row.is_billable === 1,
    gstRate: row.gst_rate || undefined,
    gstAmount: row.gst_amount || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class TransactionRepository {
  static async getAll(profileId: string, limit: number = 100): Promise<Transaction[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<TransactionRow>(
      'SELECT * FROM transactions WHERE profile_id = ? ORDER BY date DESC, created_at DESC LIMIT ?;',
      [profileId, limit]
    );
    return rows.map(mapRowToTransaction);
  }

  static async getRecent(profileId: string, limit: number = 10): Promise<Transaction[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<TransactionRow>(
      'SELECT * FROM transactions WHERE profile_id = ? ORDER BY date DESC, created_at DESC LIMIT ?;',
      [profileId, limit]
    );
    return rows.map(mapRowToTransaction);
  }

  static async getByDateRange(
    profileId: string,
    startDateIso: string,
    endDateIso: string
  ): Promise<Transaction[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<TransactionRow>(
      'SELECT * FROM transactions WHERE profile_id = ? AND date >= ? AND date <= ? ORDER BY date DESC, created_at DESC;',
      [profileId, startDateIso, endDateIso]
    );
    return rows.map(mapRowToTransaction);
  }

  static async create(transaction: Transaction): Promise<Transaction> {
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      // 1. Insert transaction
      await db.runAsync(
        `INSERT INTO transactions (
          id, profile_id, date, description, amount, currency, converted_amount,
          category, subcategory, type, account_id, to_account_id, tags, notes,
          receipt_uri, is_recurring, recurring_rule, payment_method, merchant,
          imported_from, is_split, split_parts, is_billable, gst_rate, gst_amount,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?
        );`,
        [
          transaction.id,
          transaction.profileId,
          transaction.date,
          transaction.description,
          transaction.amount,
          transaction.currency,
          transaction.convertedAmount || null,
          transaction.category,
          transaction.subcategory || null,
          transaction.type,
          transaction.accountId,
          transaction.toAccountId || null,
          transaction.tags ? JSON.stringify(transaction.tags) : null,
          transaction.notes || null,
          transaction.receiptUri || null,
          transaction.isRecurring ? 1 : 0,
          transaction.recurringRule || null,
          transaction.paymentMethod || null,
          transaction.merchant || null,
          transaction.importedFrom || null,
          transaction.isSplit ? 1 : 0,
          transaction.splitParts ? JSON.stringify(transaction.splitParts) : null,
          transaction.isBillable ? 1 : 0,
          transaction.gstRate || null,
          transaction.gstAmount || null,
          transaction.createdAt,
          transaction.updatedAt,
        ]
      );

      // 2. Update account balances atomically
      const account = await AccountRepository.getById(transaction.accountId);
      if (account) {
        let newBalance = account.balance;
        if (transaction.type === 'income') {
          newBalance += transaction.amount;
        } else if (transaction.type === 'expense') {
          newBalance -= transaction.amount;
        } else if (transaction.type === 'transfer') {
          newBalance -= transaction.amount;
        }
        await AccountRepository.updateBalance(account.id, newBalance);
      }

      // If transfer, update destination account
      if (transaction.type === 'transfer' && transaction.toAccountId) {
        const toAccount = await AccountRepository.getById(transaction.toAccountId);
        if (toAccount) {
          await AccountRepository.updateBalance(toAccount.id, toAccount.balance + transaction.amount);
        }
      }
    });

    return transaction;
  }

  static async getById(id: string): Promise<Transaction | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<TransactionRow>('SELECT * FROM transactions WHERE id = ?;', [id]);
    return row ? mapRowToTransaction(row) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const tx = await this.getById(id);
    if (!tx) return false;

    await db.withTransactionAsync(async () => {
      // Reconcile source account balance
      const account = await AccountRepository.getById(tx.accountId);
      if (account) {
        let newBalance = account.balance;
        if (tx.type === 'expense') {
          newBalance += tx.amount; // Add back spent money
        } else if (tx.type === 'income') {
          newBalance -= tx.amount; // Deduct removed income
        } else if (tx.type === 'transfer') {
          newBalance += tx.amount; // Refund source
        }
        await AccountRepository.updateBalance(account.id, newBalance);
      }

      // Reconcile transfer destination account
      if (tx.type === 'transfer' && tx.toAccountId) {
        const toAccount = await AccountRepository.getById(tx.toAccountId);
        if (toAccount) {
          await AccountRepository.updateBalance(toAccount.id, toAccount.balance - tx.amount);
        }
      }

      // Delete record
      await db.runAsync('DELETE FROM transactions WHERE id = ?;', [id]);
    });

    return true;
  }

  static async update(transaction: Transaction): Promise<Transaction> {
    const db = await getDatabase();
    const oldTx = await this.getById(transaction.id);
    if (!oldTx) throw new Error('Transaction not found to update');

    await db.withTransactionAsync(async () => {
      // 1. Revert old financial impact
      const oldAccount = await AccountRepository.getById(oldTx.accountId);
      if (oldAccount) {
        let reverted = oldAccount.balance;
        if (oldTx.type === 'expense') reverted += oldTx.amount;
        else if (oldTx.type === 'income') reverted -= oldTx.amount;
        else if (oldTx.type === 'transfer') reverted += oldTx.amount;
        await AccountRepository.updateBalance(oldAccount.id, reverted);
      }
      if (oldTx.type === 'transfer' && oldTx.toAccountId) {
        const oldTo = await AccountRepository.getById(oldTx.toAccountId);
        if (oldTo) await AccountRepository.updateBalance(oldTo.id, oldTo.balance - oldTx.amount);
      }

      // 2. Apply new financial impact
      const newAccount = await AccountRepository.getById(transaction.accountId);
      if (newAccount) {
        let updated = newAccount.balance;
        if (transaction.type === 'expense') updated -= transaction.amount;
        else if (transaction.type === 'income') updated += transaction.amount;
        else if (transaction.type === 'transfer') updated -= transaction.amount;
        await AccountRepository.updateBalance(newAccount.id, updated);
      }
      if (transaction.type === 'transfer' && transaction.toAccountId) {
        const newTo = await AccountRepository.getById(transaction.toAccountId);
        if (newTo) await AccountRepository.updateBalance(newTo.id, newTo.balance + transaction.amount);
      }

      // 3. Update transaction row
      const now = new Date().toISOString();
      await db.runAsync(
        `UPDATE transactions SET
          date = ?, description = ?, amount = ?, currency = ?, category = ?,
          subcategory = ?, type = ?, account_id = ?, to_account_id = ?, notes = ?,
          merchant = ?, updated_at = ?
         WHERE id = ?;`,
        [
          transaction.date,
          transaction.description,
          transaction.amount,
          transaction.currency,
          transaction.category,
          transaction.subcategory || null,
          transaction.type,
          transaction.accountId,
          transaction.toAccountId || null,
          transaction.notes || null,
          transaction.merchant || null,
          now,
          transaction.id,
        ]
      );
    });

    return { ...transaction, updatedAt: new Date().toISOString() };
  }
}
