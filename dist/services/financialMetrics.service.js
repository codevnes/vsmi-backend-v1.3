"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialMetricsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FinancialMetricsService {
    async getFinancialMetricsList({ symbol, year, quarter, page, limit }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (symbol) {
            where.symbol = symbol;
        }
        if (year) {
            where.year = year;
        }
        if (quarter !== undefined) {
            where.quarter = quarter;
        }
        const [financialMetrics, total] = await Promise.all([
            prisma.financialMetrics.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { year: 'desc' },
                    { quarter: 'desc' },
                ],
                include: {
                    stock: {
                        select: {
                            name: true,
                            exchange: true
                        }
                    }
                }
            }),
            prisma.financialMetrics.count({ where }),
        ]);
        return {
            data: financialMetrics,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getFinancialMetricsById(id) {
        return prisma.financialMetrics.findUnique({
            where: { id },
            include: {
                stock: {
                    select: {
                        name: true,
                        exchange: true
                    }
                }
            }
        });
    }
    async getFinancialMetricsBySymbolYearQuarter(symbol, year, quarter) {
        return prisma.financialMetrics.findUnique({
            where: {
                symbol_year_quarter: {
                    symbol,
                    year,
                    quarter: quarter
                }
            },
            include: {
                stock: {
                    select: {
                        name: true,
                        exchange: true
                    }
                }
            }
        });
    }
    async createFinancialMetrics(data) {
        // Check if stock with symbol exists
        const stock = await prisma.stock.findUnique({
            where: { symbol: data.symbol },
        });
        if (!stock) {
            throw new Error('STOCK_NOT_FOUND');
        }
        // Check if metrics for this symbol, year, and quarter already exist
        const existingMetrics = await prisma.financialMetrics.findUnique({
            where: {
                symbol_year_quarter: {
                    symbol: data.symbol,
                    year: data.year,
                    quarter: data.quarter
                }
            },
        });
        if (existingMetrics) {
            throw new Error('FINANCIAL_METRICS_ALREADY_EXISTS');
        }
        return prisma.financialMetrics.create({
            data,
        });
    }
    async updateFinancialMetrics(id, data) {
        // Check if financial metrics exist
        const existingMetrics = await prisma.financialMetrics.findUnique({
            where: { id },
        });
        if (!existingMetrics) {
            return null;
        }
        return prisma.financialMetrics.update({
            where: { id },
            data,
        });
    }
    async updateFinancialMetricsBySymbolYearQuarter(symbol, year, quarter, data) {
        // Check if financial metrics exist
        const existingMetrics = await prisma.financialMetrics.findUnique({
            where: {
                symbol_year_quarter: {
                    symbol,
                    year,
                    quarter: quarter
                }
            },
        });
        if (!existingMetrics) {
            return null;
        }
        return prisma.financialMetrics.update({
            where: {
                symbol_year_quarter: {
                    symbol,
                    year,
                    quarter: quarter
                }
            },
            data,
        });
    }
    async deleteFinancialMetricsById(id) {
        // Check if financial metrics exist
        const existingMetrics = await prisma.financialMetrics.findUnique({
            where: { id },
        });
        if (!existingMetrics) {
            throw new Error('FINANCIAL_METRICS_NOT_FOUND');
        }
        await prisma.financialMetrics.delete({
            where: { id },
        });
    }
    async deleteFinancialMetricsBySymbolYearQuarter(symbol, year, quarter) {
        // Check if financial metrics exist
        const existingMetrics = await prisma.financialMetrics.findUnique({
            where: {
                symbol_year_quarter: {
                    symbol,
                    year,
                    quarter: quarter
                }
            },
        });
        if (!existingMetrics) {
            throw new Error('FINANCIAL_METRICS_NOT_FOUND');
        }
        await prisma.financialMetrics.delete({
            where: {
                symbol_year_quarter: {
                    symbol,
                    year,
                    quarter: quarter
                }
            },
        });
    }
    async bulkCreateFinancialMetrics(dataArray) {
        // Get unique symbols to validate
        const symbols = [...new Set(dataArray.map(item => item.symbol))];
        // Validate all symbols exist
        const stocks = await prisma.stock.findMany({
            where: {
                symbol: {
                    in: symbols
                }
            },
            select: {
                symbol: true
            }
        });
        const validSymbols = new Set(stocks.map(s => s.symbol));
        // Find invalid symbols
        const invalidSymbols = symbols.filter(symbol => !validSymbols.has(symbol));
        if (invalidSymbols.length > 0) {
            console.log(`Found ${invalidSymbols.length} invalid symbols: ${invalidSymbols.join(', ')}`);
        }
        // Filter out items with invalid symbols
        const validData = dataArray.filter(item => validSymbols.has(item.symbol));
        console.log(`Total records: ${dataArray.length}, Valid symbols: ${validData.length}, Invalid symbols: ${dataArray.length - validData.length}`);
        if (validData.length === 0) {
            return 0;
        }
        // Check for potential duplicates in input data
        const uniqueKeys = new Map();
        const uniqueData = [];
        for (const item of validData) {
            // Do not modify the quarter value here
            const key = `${item.symbol}-${item.year}-${item.quarter === null ? 'null' : item.quarter}`;
            if (!uniqueKeys.has(key)) {
                uniqueKeys.set(key, true);
                uniqueData.push(item);
            }
        }
        console.log(`Found ${validData.length - uniqueData.length} duplicate entries in input data`);
        console.log(`Proceeding with ${uniqueData.length} unique records`);
        // Use createMany for bulk insertion
        const result = await prisma.financialMetrics.createMany({
            data: uniqueData,
            skipDuplicates: true, // Skip records that would cause unique constraint violations
        });
        console.log(`Successfully created ${result.count} new records out of ${uniqueData.length} unique records`);
        return result.count;
    }
    async getFinancialMetricsBySymbol(symbol) {
        return prisma.financialMetrics.findMany({
            where: { symbol },
            orderBy: [
                { year: 'desc' },
                { quarter: 'desc' },
            ],
            include: {
                stock: {
                    select: {
                        name: true,
                        exchange: true,
                    },
                },
            },
        });
    }
}
exports.FinancialMetricsService = FinancialMetricsService;
