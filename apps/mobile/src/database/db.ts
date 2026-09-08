import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';
import { DefaultCategories } from '@fintrack/domain';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabaseAsync('oikos.db');
  dbInstance = db;
  return db;
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await getDatabase();

  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Execute schema
  await db.execAsync(SCHEMA_SQL);

  // Seed default categories if not already present
  const catCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories;'
  );

  if (!catCount || catCount.count === 0) {
    for (const cat of DefaultCategories) {
      await db.runAsync(
        `INSERT OR IGNORE INTO categories (id, name, icon, color, type, is_custom, subcategories)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          cat.id,
          cat.name,
          cat.icon,
          cat.color,
          cat.type,
          0,
          JSON.stringify(cat.subcategories),
        ]
      );
    }
  }

  return db;
}
