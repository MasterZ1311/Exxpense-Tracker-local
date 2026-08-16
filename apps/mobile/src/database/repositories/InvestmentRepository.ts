import { Investment, AssetType } from '@fintrack/domain';
import { getDatabase } from '../db';

interface InvestmentRow {
  id: string;
  profile_id: string;
  name: string;
  asset_type: string;
  units: number;
  buy_price: number;
  current_price: number;
  currency: string;
  invested_amount: number;
  current_value: number;
  returns: number;
  returns_percentage: number;
  created_at: string;
  updated_at: string;
}

function mapRowToInvestment(row: InvestmentRow): Investment {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    assetType: row.asset_type as AssetType,
    units: row.units,
    buyPrice: row.buy_price,
    currentPrice: row.current_price,
    currency: row.currency,
    investedAmount: row.invested_amount,
    currentValue: row.current_value,
    returns: row.returns,
    returnsPercentage: row.returns_percentage,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class InvestmentRepository {
  static async getByProfileId(profileId: string): Promise<Investment[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<InvestmentRow>(
      'SELECT * FROM investments WHERE profile_id = ? ORDER BY current_value DESC;',
      [profileId]
    );
    return rows.map(mapRowToInvestment);
  }

  static async create(investment: Investment): Promise<Investment> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO investments (id, profile_id, name, asset_type, units, buy_price, current_price, currency, invested_amount, current_value, returns, returns_percentage, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        investment.id,
        investment.profileId,
        investment.name,
        investment.assetType,
        investment.units || 1,
        investment.buyPrice,
        investment.currentPrice,
        investment.currency || 'INR',
        investment.investedAmount,
        investment.currentValue,
        investment.returns,
        investment.returnsPercentage,
        investment.createdAt || now,
        investment.updatedAt || now,
      ]
    );
    return investment;
  }
}
