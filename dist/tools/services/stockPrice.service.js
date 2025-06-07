"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockPriceService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var StockPriceService = /** @class */ (function () {
    function StockPriceService() {
    }
    StockPriceService.prototype.getStockPrices = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var skip, where, _c, stockPrices, total;
            var symbol = _b.symbol, startDate = _b.startDate, endDate = _b.endDate, page = _b.page, limit = _b.limit;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        where = {
                            symbol: symbol,
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
                        return [4 /*yield*/, Promise.all([
                                prisma.stockPrice.findMany({
                                    where: where,
                                    skip: skip,
                                    take: limit,
                                    orderBy: { date: 'desc' },
                                }),
                                prisma.stockPrice.count({ where: where }),
                            ])];
                    case 1:
                        _c = _d.sent(), stockPrices = _c[0], total = _c[1];
                        return [2 /*return*/, {
                                data: stockPrices,
                                pagination: {
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit),
                                },
                            }];
                }
            });
        });
    };
    StockPriceService.prototype.getStockPriceByDate = function (symbol, date) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedDate;
            return __generator(this, function (_a) {
                parsedDate = new Date(date);
                return [2 /*return*/, prisma.stockPrice.findUnique({
                        where: {
                            symbol_date: {
                                symbol: symbol,
                                date: parsedDate,
                            },
                        },
                    })];
            });
        });
    };
    StockPriceService.prototype.createStockPrice = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingStock, existingStockPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.stock.findUnique({
                            where: { symbol: data.symbol },
                        })];
                    case 1:
                        existingStock = _a.sent();
                        if (!existingStock) {
                            throw new Error('STOCK_NOT_FOUND');
                        }
                        return [4 /*yield*/, prisma.stockPrice.findUnique({
                                where: {
                                    symbol_date: {
                                        symbol: data.symbol,
                                        date: data.date,
                                    },
                                },
                            })];
                    case 2:
                        existingStockPrice = _a.sent();
                        if (existingStockPrice) {
                            throw new Error('STOCK_PRICE_ALREADY_EXISTS');
                        }
                        return [2 /*return*/, prisma.stockPrice.create({
                                data: data,
                            })];
                }
            });
        });
    };
    StockPriceService.prototype.updateStockPrice = function (symbol, date, data) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedDate, existingStockPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedDate = new Date(date);
                        return [4 /*yield*/, prisma.stockPrice.findUnique({
                                where: {
                                    symbol_date: {
                                        symbol: symbol,
                                        date: parsedDate,
                                    },
                                },
                            })];
                    case 1:
                        existingStockPrice = _a.sent();
                        if (!existingStockPrice) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, prisma.stockPrice.update({
                                where: {
                                    symbol_date: {
                                        symbol: symbol,
                                        date: parsedDate,
                                    },
                                },
                                data: data,
                            })];
                }
            });
        });
    };
    StockPriceService.prototype.deleteStockPrice = function (symbol, date) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedDate, existingStockPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedDate = new Date(date);
                        return [4 /*yield*/, prisma.stockPrice.findUnique({
                                where: {
                                    symbol_date: {
                                        symbol: symbol,
                                        date: parsedDate,
                                    },
                                },
                            })];
                    case 1:
                        existingStockPrice = _a.sent();
                        if (!existingStockPrice) {
                            throw new Error('STOCK_PRICE_NOT_FOUND');
                        }
                        return [4 /*yield*/, prisma.stockPrice.delete({
                                where: {
                                    symbol_date: {
                                        symbol: symbol,
                                        date: parsedDate,
                                    },
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StockPriceService.prototype.getLatestStockPrice = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma.stockPrice.findFirst({
                        where: { symbol: symbol },
                        orderBy: { date: 'desc' },
                    })];
            });
        });
    };
    StockPriceService.prototype.bulkCreateStockPrices = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.$transaction(data.map(function (item) {
                            return prisma.stockPrice.upsert({
                                where: {
                                    symbol_date: {
                                        symbol: item.symbol,
                                        date: item.date,
                                    },
                                },
                                update: item,
                                create: item,
                            });
                        }))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length];
                }
            });
        });
    };
    return StockPriceService;
}());
exports.StockPriceService = StockPriceService;
