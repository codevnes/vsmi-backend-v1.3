"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedStocksRepository = void 0;
const app_1 = require("../app");
class SelectedStocksRepository {
    prismaClient;
    constructor(prismaClient = app_1.prisma) {
        this.prismaClient = prismaClient;
    }
    async findAll(options) {
        const { page = 1, limit = 10, sort = 'date', order = 'desc', } = options || {};
        const skip = (page - 1) * limit;
        const take = limit;
        const [items, count] = await Promise.all([
            this.prismaClient.selectedStocks.findMany({
                skip,
                take,
                orderBy: {
                    [sort]: order,
                },
            }),
            this.prismaClient.selectedStocks.count(),
        ]);
        const totalPages = Math.ceil(count / limit);
        return {
            data: items,
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async findBySymbol(symbol, options) {
        const { page = 1, limit = 10, sort = 'date', order = 'desc', } = options || {};
        const skip = (page - 1) * limit;
        const take = limit;
        const [items, count] = await Promise.all([
            this.prismaClient.selectedStocks.findMany({
                where: {
                    symbol,
                },
                skip,
                take,
                orderBy: {
                    [sort]: order,
                },
            }),
            this.prismaClient.selectedStocks.count({
                where: {
                    symbol,
                },
            }),
        ]);
        const totalPages = Math.ceil(count / limit);
        return {
            data: items,
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async findByDate(date) {
        const items = await this.prismaClient.selectedStocks.findMany({
            where: {
                date,
            },
            orderBy: {
                qIndex: 'desc',
            },
        });
        return items;
    }
    async findTopByQIndex(limit = 20, startDate, endDate) {
        const dateFilter = {};
        if (startDate && endDate) {
            Object.assign(dateFilter, {
                gte: startDate,
                lte: endDate,
            });
        }
        else if (startDate) {
            Object.assign(dateFilter, {
                gte: startDate,
            });
        }
        else if (endDate) {
            Object.assign(dateFilter, {
                lte: endDate,
            });
        }
        const whereClause = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};
        const items = await this.prismaClient.selectedStocks.findMany({
            where: whereClause,
            orderBy: {
                qIndex: 'desc',
            },
            take: limit,
        });
        return items;
    }
    async findById(id) {
        const item = await this.prismaClient.selectedStocks.findUnique({
            where: {
                id,
            },
        });
        return item;
    }
    async findBySymbolAndDate(symbol, date) {
        const item = await this.prismaClient.selectedStocks.findUnique({
            where: {
                symbol_date: {
                    symbol,
                    date,
                },
            },
        });
        return item;
    }
    async create(data) {
        const item = await this.prismaClient.selectedStocks.create({
            data,
        });
        return item;
    }
    async update(id, data) {
        const item = await this.prismaClient.selectedStocks.update({
            where: {
                id,
            },
            data,
        });
        return item;
    }
    async delete(id) {
        const item = await this.prismaClient.selectedStocks.delete({
            where: {
                id,
            },
        });
        return item;
    }
    async deleteMany(ids) {
        const result = await this.prismaClient.selectedStocks.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return result.count;
    }
}
exports.SelectedStocksRepository = SelectedStocksRepository;
