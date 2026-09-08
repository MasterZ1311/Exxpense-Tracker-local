import alasql from 'alasql';
import { SCHEMA_SQL } from './schema';
import { DefaultCategories } from '@fintrack/domain';

let isInitialized = false;
let dbInstance: AlaSqlWrapper | null = null;

function saveToLocalStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const tablesRes = alasql('SHOW TABLES') as { tableid: string }[];
      if (Array.isArray(tablesRes)) {
        const data: Record<string, any[]> = {};
        for (const t of tablesRes) {
          if (t && t.tableid) {
            try {
              data[t.tableid] = alasql(`SELECT * FROM \`${t.tableid}\``);
            } catch (e) {
              // ignore
            }
          }
        }
        window.localStorage.setItem('oikos_alasql', JSON.stringify(data));
      }
    }
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function loadFromLocalStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const json = window.localStorage.getItem('oikos_alasql');
      if (json) {
        const data = JSON.parse(json) as Record<string, any[]>;
        for (const [tableName, rows] of Object.entries(data)) {
          if (Array.isArray(rows) && rows.length > 0) {
            try {
              alasql(`DELETE FROM \`${tableName}\``);
            } catch (e) {
              // ignore
            }
            for (const row of rows) {
              const keys = Object.keys(row);
              if (keys.length === 0) continue;
              const placeholders = keys.map(() => '?').join(', ');
              const values = keys.map((k) => row[k]);
              try {
                alasql(
                  `INSERT INTO \`${tableName}\` (${keys.map((k) => `\`${k}\``).join(', ')}) VALUES (${placeholders})`,
                  values
                );
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
}

function sanitizeSql(sql: string): string {
  let clean = sql.trim();
  // Remove trailing semicolon if present for single execution
  if (clean.endsWith(';')) {
    clean = clean.slice(0, -1);
  }
  // Replace INSERT OR IGNORE with INSERT
  clean = clean.replace(/INSERT\s+OR\s+IGNORE\s+INTO/gi, 'INSERT INTO');
  // Strip DESC inside CREATE INDEX
  clean = clean.replace(/(CREATE\s+INDEX\s+[\s\S]*?\([\s\S]*?)\s+DESC(\))/gi, '$1$2');
  return clean;
}

export class AlaSqlWrapper {
  async execAsync(sql: string): Promise<void> {
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      if (stmt.toUpperCase().startsWith('PRAGMA')) {
        continue;
      }
      try {
        const cleanStmt = sanitizeSql(stmt);
        alasql(cleanStmt);
      } catch (e) {
        // Log warning for index or schema statements that might already exist
        console.warn('AlaSQL exec statement warning:', stmt, e);
      }
    }
    saveToLocalStorage();
  }

  async runAsync(
    sql: string,
    params: any[] = []
  ): Promise<{ lastInsertRowId: number; changes: number }> {
    const cleanStmt = sanitizeSql(sql);
    let changes = 0;
    try {
      const res = alasql(cleanStmt, params);
      changes = typeof res === 'number' ? res : 1;
    } catch (e: any) {
      // If error is duplicate key on insert, ignore
      if (!cleanStmt.toUpperCase().startsWith('INSERT')) {
        throw e;
      }
    }
    saveToLocalStorage();
    return { lastInsertRowId: Date.now(), changes };
  }

  async getAllAsync<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const cleanStmt = sanitizeSql(sql);
    try {
      const res = alasql(cleanStmt, params);
      return Array.isArray(res) ? (res as T[]) : [];
    } catch (e) {
      console.warn('AlaSQL getAllAsync warning:', sql, e);
      return [];
    }
  }

  async getFirstAsync<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const rows = await this.getAllAsync<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  async withTransactionAsync<T>(action: () => Promise<T>): Promise<T> {
    try {
      const result = await action();
      saveToLocalStorage();
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export async function getDatabase(): Promise<AlaSqlWrapper> {
  if (!dbInstance) {
    dbInstance = new AlaSqlWrapper();
  }
  return dbInstance;
}

export async function initDatabase(): Promise<AlaSqlWrapper> {
  const db = await getDatabase();
  if (isInitialized) {
    return db;
  }

  await db.execAsync(SCHEMA_SQL);
  loadFromLocalStorage();

  const catCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );

  if (!catCount || catCount.count === 0) {
    for (const cat of DefaultCategories) {
      await db.runAsync(
        `INSERT INTO categories (id, name, icon, color, type, is_custom, subcategories)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

  isInitialized = true;
  return db;
}
