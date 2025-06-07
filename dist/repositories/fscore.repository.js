"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FScoreRepository = void 0;
const app_1 = require("../app");
class FScoreRepository {
    async findById(id) {
        try {
            // Use Prisma with direct SQL query to bypass type issues
            const query = `
        SELECT * FROM "FScore" WHERE id = $1
      `;
            const result = await app_1.prisma.$queryRaw `SELECT * FROM "FScore" WHERE id = ${id}`;
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        }
        catch (error) {
            console.error('Error finding FScore by ID:', error);
            throw error;
        }
    }
    async findBySymbol(symbol) {
        try {
            const result = await app_1.prisma.$queryRaw `SELECT * FROM "FScore" WHERE symbol = ${symbol}`;
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        }
        catch (error) {
            console.error('Error finding FScore by symbol:', error);
            throw error;
        }
    }
    async findAll() {
        try {
            const result = await app_1.prisma.$queryRaw `SELECT * FROM "FScore" ORDER BY symbol ASC`;
            return result;
        }
        catch (error) {
            console.error('Error fetching all FScores:', error);
            throw error;
        }
    }
    async create(data) {
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
            const result = await app_1.prisma.$queryRawUnsafe(query, ...values);
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        }
        catch (error) {
            console.error('Error creating FScore:', error);
            throw error;
        }
    }
    async update(id, data) {
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
            const result = await app_1.prisma.$queryRawUnsafe(query, ...values);
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        }
        catch (error) {
            console.error('Error updating FScore by ID:', error);
            throw error;
        }
    }
    async updateBySymbol(symbol, data) {
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
            const result = await app_1.prisma.$queryRawUnsafe(query, ...values);
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        }
        catch (error) {
            console.error('Error updating FScore by symbol:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await app_1.prisma.$queryRaw `
        DELETE FROM "FScore"
        WHERE id = ${id}
        RETURNING *
      `;
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        }
        catch (error) {
            console.error('Error deleting FScore by ID:', error);
            throw error;
        }
    }
    async deleteBySymbol(symbol) {
        try {
            const result = await app_1.prisma.$queryRaw `
        DELETE FROM "FScore"
        WHERE symbol = ${symbol}
        RETURNING *
      `;
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        }
        catch (error) {
            console.error('Error deleting FScore by symbol:', error);
            throw error;
        }
    }
    async upsert(symbol, data) {
        try {
            // Check if record exists
            const exists = await this.findBySymbol(symbol);
            if (exists) {
                return this.updateBySymbol(symbol, data);
            }
            else {
                return this.create({ ...data, symbol });
            }
        }
        catch (error) {
            console.error('Error upserting FScore:', error);
            throw error;
        }
    }
}
exports.FScoreRepository = FScoreRepository;
