"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockProfileService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StockProfileService {
    async getStockProfiles({ page = 1, limit = 10, search }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.stock = {
                OR: [
                    { symbol: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                ],
            };
        }
        const [profiles, total] = await Promise.all([
            prisma.stockProfile.findMany({
                where,
                skip,
                take: limit,
                include: {
                    stock: {
                        select: {
                            symbol: true,
                            name: true,
                            exchange: true,
                            industry: true,
                        },
                    },
                },
                orderBy: {
                    stock: {
                        symbol: 'asc',
                    },
                },
            }),
            prisma.stockProfile.count({ where }),
        ]);
        return {
            data: profiles,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getStockProfileBySymbol(symbol) {
        const profile = await prisma.stockProfile.findUnique({
            where: { symbol },
            include: {
                stock: {
                    select: {
                        symbol: true,
                        name: true,
                        exchange: true,
                        industry: true,
                    },
                },
            },
        });
        // Get additional data
        const [chatGptAnalysis, fscoreAnalysis, financialMetrics, fscore, technicalAnalysis] = await Promise.all([
            // Get latest ChatGPT analysis
            prisma.chatGptAnalysis.findFirst({
                where: { symbol },
                orderBy: { analysisDate: 'desc' },
            }),
            // Get latest F-Score analysis
            prisma.fScoreAnalysis.findFirst({
                where: { symbol },
                orderBy: { analysisDate: 'desc' },
            }),
            // Get latest financial metrics
            prisma.financialMetrics.findFirst({
                where: { symbol },
                orderBy: [
                    { year: 'desc' },
                    { quarter: 'desc' },
                ],
            }),
            // Get latest F-Score
            prisma.fScore.findFirst({
                where: { symbol },
                orderBy: { createdAt: 'desc' },
            }),
            // Get latest technical analysis
            prisma.technicalAnalysis.findFirst({
                where: { symbol },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            ...profile,
            chatGptAnalysis,
            fscoreAnalysis,
            financialMetrics,
            fscore,
            technicalAnalysis,
        };
    }
    async createStockProfile(data) {
        // Verify that the stock exists
        const stock = await prisma.stock.findUnique({
            where: { symbol: data.symbol },
        });
        if (!stock) {
            throw new Error(`Stock with symbol ${data.symbol} not found`);
        }
        // Check if profile already exists
        const existingProfile = await prisma.stockProfile.findUnique({
            where: { symbol: data.symbol },
        });
        if (existingProfile) {
            throw new Error(`StockProfile for symbol ${data.symbol} already exists`);
        }
        return prisma.stockProfile.create({
            data,
            include: {
                stock: {
                    select: {
                        symbol: true,
                        name: true,
                        exchange: true,
                        industry: true,
                    },
                },
            },
        });
    }
    async updateStockProfile(symbol, data) {
        // Verify that the profile exists
        const existingProfile = await prisma.stockProfile.findUnique({
            where: { symbol },
        });
        if (!existingProfile) {
            throw new Error(`StockProfile for symbol ${symbol} not found`);
        }
        return prisma.stockProfile.update({
            where: { symbol },
            data,
            include: {
                stock: {
                    select: {
                        symbol: true,
                        name: true,
                        exchange: true,
                        industry: true,
                    },
                },
            },
        });
    }
    async deleteStockProfile(symbol) {
        // Verify that the profile exists
        const existingProfile = await prisma.stockProfile.findUnique({
            where: { symbol },
        });
        if (!existingProfile) {
            throw new Error(`StockProfile for symbol ${symbol} not found`);
        }
        return prisma.stockProfile.delete({
            where: { symbol },
        });
    }
    async upsertStockProfile(data) {
        // Verify that the stock exists
        const stock = await prisma.stock.findUnique({
            where: { symbol: data.symbol },
        });
        if (!stock) {
            throw new Error(`Stock with symbol ${data.symbol} not found`);
        }
        return prisma.stockProfile.upsert({
            where: { symbol: data.symbol },
            update: {
                price: data.price,
                profit: data.profit,
                volume: data.volume,
                pe: data.pe,
                eps: data.eps,
                roa: data.roa,
                roe: data.roe,
            },
            create: data,
            include: {
                stock: {
                    select: {
                        symbol: true,
                        name: true,
                        exchange: true,
                        industry: true,
                    },
                },
            },
        });
    }
}
exports.StockProfileService = StockProfileService;
