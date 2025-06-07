"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalRecommendationService = void 0;
const app_1 = require("../app");
class TechnicalRecommendationService {
    async getAll({ page, limit, symbol, startDate, endDate }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (symbol) {
            where.symbol = symbol;
        }
        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                where.date.gte = new Date(startDate);
            }
            if (endDate) {
                where.date.lte = new Date(endDate);
            }
        }
        const [technicalRecommendations, total] = await Promise.all([
            app_1.prisma.technicalRecommendation.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { date: 'desc' },
                    { symbol: 'asc' }
                ],
                include: {
                    stock: true,
                },
            }),
            app_1.prisma.technicalRecommendation.count({ where }),
        ]);
        return {
            data: technicalRecommendations,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getBySymbolAndDate(symbol, date) {
        const formattedDate = new Date(date);
        return app_1.prisma.technicalRecommendation.findUnique({
            where: {
                date_symbol: {
                    date: formattedDate,
                    symbol,
                },
            },
            include: {
                stock: true,
            },
        });
    }
    async getLatestBySymbol(symbol) {
        return app_1.prisma.technicalRecommendation.findFirst({
            where: {
                symbol,
            },
            orderBy: {
                date: 'desc',
            },
            include: {
                stock: true,
            },
        });
    }
    async create(data) {
        return app_1.prisma.technicalRecommendation.create({
            data: {
                symbol: data.symbol,
                date: data.date,
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.close,
                volume: data.volume,
                rsi14: data.rsi14,
                macdLine: data.macdLine,
                macdSignal: data.macdSignal,
                macdHistogram: data.macdHistogram,
                stochasticK: data.stochasticK,
                stochasticD: data.stochasticD,
                williamsR: data.williamsR,
                adx14: data.adx14,
                plusDi14: data.plusDi14,
                minusDi14: data.minusDi14,
                momentum10: data.momentum10,
                ultimateOscillator: data.ultimateOscillator,
                cci20: data.cci20,
                stochRsiK: data.stochRsiK,
                stochRsiD: data.stochRsiD,
                awesomeOscillator: data.awesomeOscillator,
                bullPower13: data.bullPower13,
                bearPower13: data.bearPower13,
                sma10: data.sma10,
                ema10: data.ema10,
                sma20: data.sma20,
                ema20: data.ema20,
                sma30: data.sma30,
                ema30: data.ema30,
                sma50: data.sma50,
                ema50: data.ema50,
                sma100: data.sma100,
                ema100: data.ema100,
                sma200: data.sma200,
                ema200: data.ema200,
                hma9: data.hma9,
                ichimokuBaseLine26: data.ichimokuBaseLine26,
            },
            include: {
                stock: true,
            },
        });
    }
    async update(symbol, date, data) {
        const formattedDate = new Date(date);
        return app_1.prisma.technicalRecommendation.update({
            where: {
                date_symbol: {
                    date: formattedDate,
                    symbol,
                },
            },
            data,
            include: {
                stock: true,
            },
        });
    }
    async upsert(symbol, date, data) {
        return app_1.prisma.technicalRecommendation.upsert({
            where: {
                date_symbol: {
                    date,
                    symbol
                }
            },
            create: {
                symbol,
                date,
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.close,
                volume: data.volume,
                rsi14: data.rsi14,
                macdLine: data.macdLine,
                macdSignal: data.macdSignal,
                macdHistogram: data.macdHistogram,
                stochasticK: data.stochasticK,
                stochasticD: data.stochasticD,
                williamsR: data.williamsR,
                adx14: data.adx14,
                plusDi14: data.plusDi14,
                minusDi14: data.minusDi14,
                momentum10: data.momentum10,
                ultimateOscillator: data.ultimateOscillator,
                cci20: data.cci20,
                stochRsiK: data.stochRsiK,
                stochRsiD: data.stochRsiD,
                awesomeOscillator: data.awesomeOscillator,
                bullPower13: data.bullPower13,
                bearPower13: data.bearPower13,
                sma10: data.sma10,
                ema10: data.ema10,
                sma20: data.sma20,
                ema20: data.ema20,
                sma30: data.sma30,
                ema30: data.ema30,
                sma50: data.sma50,
                ema50: data.ema50,
                sma100: data.sma100,
                ema100: data.ema100,
                sma200: data.sma200,
                ema200: data.ema200,
                hma9: data.hma9,
                ichimokuBaseLine26: data.ichimokuBaseLine26,
            },
            update: data,
            include: {
                stock: true,
            },
        });
    }
    async delete(symbol, date) {
        return app_1.prisma.technicalRecommendation.delete({
            where: {
                date_symbol: {
                    date,
                    symbol
                }
            }
        });
    }
}
exports.TechnicalRecommendationService = TechnicalRecommendationService;
