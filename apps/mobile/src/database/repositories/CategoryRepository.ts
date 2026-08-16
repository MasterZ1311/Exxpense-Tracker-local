import { Category } from '@fintrack/domain';
import { getDatabase } from '../db';

interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
  is_custom: number;
  subcategories: string | null;
}

function mapRowToCategory(row: CategoryRow): Category {
  let subcategories: string[] = [];
  try {
    if (row.subcategories) {
      subcategories = JSON.parse(row.subcategories);
    }
  } catch (e) {
    subcategories = [];
  }

  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    type: row.type as 'expense' | 'income',
    isCustom: row.is_custom === 1,
    subcategories,
  };
}

export class CategoryRepository {
  static async getAll(): Promise<Category[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<CategoryRow>(
      'SELECT * FROM categories ORDER BY name ASC;'
    );
    return rows.map(mapRowToCategory);
  }

  static async getByType(type: 'expense' | 'income'): Promise<Category[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<CategoryRow>(
      'SELECT * FROM categories WHERE type = ? ORDER BY name ASC;',
      [type]
    );
    return rows.map(mapRowToCategory);
  }

  static async getById(id: string): Promise<Category | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<CategoryRow>(
      'SELECT * FROM categories WHERE id = ?;',
      [id]
    );
    return row ? mapRowToCategory(row) : null;
  }

  static async create(category: Category): Promise<Category> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO categories (id, name, icon, color, type, is_custom, subcategories)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        category.id,
        category.name,
        category.icon || 'tag',
        category.color || '#526B4F',
        category.type,
        1,
        category.subcategories ? JSON.stringify(category.subcategories) : null,
      ]
    );
    return category;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM categories WHERE id = ?;', [id]);
    return true;
  }
}
