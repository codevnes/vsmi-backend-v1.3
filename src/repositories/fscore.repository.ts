import { prisma } from '../app';

export interface IFScore {
  id: string;
  symbol: string;
  roa?: number | null;
  cfo?: number | null;
  deltaRoa?: number | null;
  cfoMinusNetProfit?: number | null;
  deltaLongTermDebt?: number | null;
  deltaCurrentRatio?: number | null;
  newlyIssuedShares?: number | null;
  deltaGrossMargin?: number | null;
  deltaAssetTurnover?: number | null;
  priceToForecastEps?: number | null;
  roaPositive?: boolean | null;
  cfoPositive?: boolean | null;
  deltaRoaPositive?: boolean | null;
  cfoGreaterThanNetProfit?: boolean | null;
  deltaLongTermDebtNegative?: boolean | null;
  deltaCurrentRatioPositive?: boolean | null;
  noNewSharesIssued?: boolean | null;
  deltaGrossMarginPositive?: boolean | null;
  deltaAssetTurnoverPositive?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFScoreCreate {
  symbol: string;
  roa?: number | null;
  cfo?: number | null;
  deltaRoa?: number | null;
  cfoMinusNetProfit?: number | null;
  deltaLongTermDebt?: number | null;
  deltaCurrentRatio?: number | null;
  newlyIssuedShares?: number | null;
  deltaGrossMargin?: number | null;
  deltaAssetTurnover?: number | null;
  priceToForecastEps?: number | null;
  roaPositive?: boolean | null;
  cfoPositive?: boolean | null;
  deltaRoaPositive?: boolean | null;
  cfoGreaterThanNetProfit?: boolean | null;
  deltaLongTermDebtNegative?: boolean | null;
  deltaCurrentRatioPositive?: boolean | null;
  noNewSharesIssued?: boolean | null;
  deltaGrossMarginPositive?: boolean | null;
  deltaAssetTurnoverPositive?: boolean | null;
}

export interface IFScoreUpdate extends Partial<IFScoreCreate> {}

export class FScoreRepository {
  async findById(id: string): Promise<IFScore | null> {
    try {
      // Use Prisma with direct SQL query to bypass type issues
      const query = `
        SELECT * FROM "FScore" WHERE id = $1
      `;
      const result = await prisma.$queryRaw`SELECT * FROM "FScore" WHERE id = ${id}`;
      return Array.isArray(result) && result.length > 0 ? result[0] as IFScore : null;
    } catch (error) {
      console.error('Error finding FScore by ID:', error);
      throw error;
    }
  }

  async findBySymbol(symbol: string): Promise<IFScore | null> {
    try {
      const result = await prisma.$queryRaw`SELECT * FROM "FScore" WHERE symbol = ${symbol}`;
      return Array.isArray(result) && result.length > 0 ? result[0] as IFScore : null;
    } catch (error) {
      console.error('Error finding FScore by symbol:', error);
      throw error;
    }
  }

  async findAll(): Promise<IFScore[]> {
    try {
      const result = await prisma.$queryRaw`SELECT * FROM "FScore" ORDER BY symbol ASC`;
      return result as IFScore[];
    } catch (error) {
      console.error('Error fetching all FScores:', error);
      throw error;
    }
  }

  async create(data: IFScoreCreate): Promise<IFScore> {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const columns = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO "FScore" (${columns})
        VALUES (${placeholders})
        RETURNING *
      `;
      
      const result = await prisma.$queryRawUnsafe(query, ...values);
      return Array.isArray(result) && result.length > 0 ? result[0] as IFScore : null as unknown as IFScore;
    } catch (error) {
      console.error('Error creating FScore:', error);
      throw error;
    }
  }

  async update(id: string, data: IFScoreUpdate): Promise<IFScore> {
    try {
      const entries = Object.entries(data);
      const sets = entries.map(([key], i) => `"${key}" = $${i + 2}`).join(', ');
      const values = [id, ...entries.map(([_, value]) => value)];
      
      const query = `
        UPDATE "FScore"
        SET ${sets}
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await prisma.$queryRawUnsafe(query, ...values);
      return Array.isArray(result) && result.length > 0 ? result[0] as IFScore : null as unknown as IFScore;
    } catch (error) {
      console.error('Error updating FScore by ID:', error);
      throw error;
    }
  }

  async updateBySymbol(symbol: string, data: IFScoreUpdate): Promise<IFScore> {
    try {
      const entries = Object.entries(data);
      const sets = entries.map(([key], i) => `"${key}" = $${i + 2}`).join(', ');
      const values = [symbol, ...entries.map(([_, value]) => value)];
      
      const query = `
        UPDATE "FScore"
        SET ${sets}
        WHERE symbol = $1
        RETURNING *
      `;
      
      const result = await prisma.$queryRawUnsafe(query, ...values);
      return Array.isArray(result) && result.length > 0 ? result[0] as IFScore : null as unknown as IFScore;
    } catch (error) {
      console.error('Error updating FScore by symbol:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<IFScore> {
    try {
      const result = await prisma.$queryRaw`
        DELETE FROM "FScore"
        WHERE id = ${id}
        RETURNING *
      `;
      return Array.isArray(result) && result.length > 0 ? result[0] as IFScore : null as unknown as IFScore;
    } catch (error) {
      console.error('Error deleting FScore by ID:', error);
      throw error;
    }
  }

  async deleteBySymbol(symbol: string): Promise<IFScore> {
    try {
      const result = await prisma.$queryRaw`
        DELETE FROM "FScore"
        WHERE symbol = ${symbol}
        RETURNING *
      `;
      return Array.isArray(result) && result.length > 0 ? result[0] as IFScore : null as unknown as IFScore;
    } catch (error) {
      console.error('Error deleting FScore by symbol:', error);
      throw error;
    }
  }

  async upsert(symbol: string, data: IFScoreCreate): Promise<IFScore> {
    try {
      // Check if record exists
      const exists = await this.findBySymbol(symbol);
      if (exists) {
        return this.updateBySymbol(symbol, data);
      } else {
        return this.create({ ...data, symbol });
      }
    } catch (error) {
      console.error('Error upserting FScore:', error);
      throw error;
    }
  }
} 