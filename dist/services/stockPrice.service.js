"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockPriceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StockPriceService {
    async getStockPrices({ symbol, startDate, endDate, page, limit }) {
        const skip = (page - 1) * limit;
        const where = {
            symbol,
        };
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        else if (startDate) {
            where.date = {
                gte: new Date(startDate),
            };
        }
        else if (endDate) {
            where.date = {
                lte: new Date(endDate),
            };
        }
        const [stockPrices, total] = await Promise.all([
            prisma.stockPrice.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: 'desc' },
            }),
            prisma.stockPrice.count({ where }),
        ]);
        return {
            data: stockPrices,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getStockPriceByDate(symbol, date) {
        const parsedDate = new Date(date);
        return prisma.stockPrice.findUnique({
            where: {
                symbol_date: {
                    symbol,
                    date: parsedDate,
                },
            },
        });
    }
    async createStockPrice(data) {
        // Check if stock exists
        const existingStock = await prisma.stock.findUnique({
            where: { symbol: data.symbol },
        });
        if (!existingStock) {
            throw new Error('STOCK_NOT_FOUND');
        }
        // Check if stock price for this date already exists
        const existingStockPrice = await prisma.stockPrice.findUnique({
            where: {
                symbol_date: {
                    symbol: data.symbol,
                    date: data.date,
                },
            },
        });
        if (existingStockPrice) {
            throw new Error('STOCK_PRICE_ALREADY_EXISTS');
        }
        return prisma.stockPrice.create({
            data,
        });
    }
    async updateStockPrice(symbol, date, data) {
        const parsedDate = new Date(date);
        // Check if stock price exists
        const existingStockPrice = await prisma.stockPrice.findUnique({
            where: {
                symbol_date: {
                    symbol,
                    date: parsedDate,
                },
            },
        });
        if (!existingStockPrice) {
            return null;
        }
        return prisma.stockPrice.update({
            where: {
                symbol_date: {
                    symbol,
                    date: parsedDate,
                },
            },
            data,
        });
    }
    async deleteStockPrice(symbol, date) {
        const parsedDate = new Date(date);
        // Check if stock price exists
        const existingStockPrice = await prisma.stockPrice.findUnique({
            where: {
                symbol_date: {
                    symbol,
                    date: parsedDate,
                },
            },
        });
        if (!existingStockPrice) {
            throw new Error('STOCK_PRICE_NOT_FOUND');
        }
        await prisma.stockPrice.delete({
            where: {
                symbol_date: {
                    symbol,
                    date: parsedDate,
                },
            },
        });
    }
    async getLatestStockPrice(symbol) {
        return prisma.stockPrice.findFirst({
            where: { symbol },
            orderBy: { date: 'desc' },
        });
    }
    async bulkCreateStockPrices(data) {
        const result = await prisma.$transaction(data.map((item) => prisma.stockPrice.upsert({
            where: {
                symbol_date: {
                    symbol: item.symbol,
                    date: item.date,
                },
            },
            update: item,
            create: item,
        })));
        return result.length;
    }
}
exports.StockPriceService = StockPriceService;
