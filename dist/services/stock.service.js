"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StockService {
    async getAllStocks({ page, limit, search, exchange, industry }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { symbol: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (exchange) {
            where.exchange = exchange;
        }
        if (industry) {
            where.industry = industry;
        }
        const [stocks, total] = await Promise.all([
            prisma.stock.findMany({
                where,
                skip,
                take: limit,
                orderBy: { symbol: 'asc' },
                include: {
                    profile: true,
                },
            }),
            prisma.stock.count({ where }),
        ]);
        return {
            data: stocks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getStockBySymbol(symbol) {
        return prisma.stock.findUnique({
            where: { symbol },
            include: {
                profile: true,
                financialMetrics: {
                    orderBy: [
                        { year: 'desc' },
                        { quarter: 'desc' },
                    ],
                    take: 10,
                },
            },
        });
    }
    async createStock(data) {
        // Check if stock with symbol already exists
        const existingStock = await prisma.stock.findUnique({
            where: { symbol: data.symbol },
        });
        if (existingStock) {
            throw new Error('STOCK_ALREADY_EXISTS');
        }
        return prisma.stock.create({
            data,
        });
    }
    async updateStock(symbol, data) {
        // Check if stock exists
        const existingStock = await prisma.stock.findUnique({
            where: { symbol },
        });
        if (!existingStock) {
            return null;
        }
        return prisma.stock.update({
            where: { symbol },
            data,
        });
    }
    async deleteStock(symbol) {
        // Check if stock exists
        const existingStock = await prisma.stock.findUnique({
            where: { symbol },
        });
        if (!existingStock) {
            throw new Error('STOCK_NOT_FOUND');
        }
        await prisma.stock.delete({
            where: { symbol },
        });
    }
}
exports.StockService = StockService;
