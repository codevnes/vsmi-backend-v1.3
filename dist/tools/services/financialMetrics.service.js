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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialMetricsService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var FinancialMetricsService = /** @class */ (function () {
    function FinancialMetricsService() {
    }
    FinancialMetricsService.prototype.getFinancialMetricsList = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var skip, where, _c, financialMetrics, total;
            var symbol = _b.symbol, year = _b.year, quarter = _b.quarter, page = _b.page, limit = _b.limit;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        where = {};
                        if (symbol) {
                            where.symbol = symbol;
                        }
                        if (year) {
                            where.year = year;
                        }
                        if (quarter !== undefined) {
                            where.quarter = quarter;
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.financialMetrics.findMany({
                                    where: where,
                                    skip: skip,
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
                                prisma.financialMetrics.count({ where: where }),
                            ])];
                    case 1:
                        _c = _d.sent(), financialMetrics = _c[0], total = _c[1];
                        return [2 /*return*/, {
                                data: financialMetrics,
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
    FinancialMetricsService.prototype.getFinancialMetricsById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma.financialMetrics.findUnique({
                        where: { id: id },
                        include: {
                            stock: {
                                select: {
                                    name: true,
                                    exchange: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    FinancialMetricsService.prototype.getFinancialMetricsBySymbolYearQuarter = function (symbol, year, quarter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma.financialMetrics.findUnique({
                        where: {
                            symbol_year_quarter: {
                                symbol: symbol,
                                year: year,
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
                    })];
            });
        });
    };
    FinancialMetricsService.prototype.createFinancialMetrics = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var stock, existingMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.stock.findUnique({
                            where: { symbol: data.symbol },
                        })];
                    case 1:
                        stock = _a.sent();
                        if (!stock) {
                            throw new Error('STOCK_NOT_FOUND');
                        }
                        return [4 /*yield*/, prisma.financialMetrics.findUnique({
                                where: {
                                    symbol_year_quarter: {
                                        symbol: data.symbol,
                                        year: data.year,
                                        quarter: data.quarter === undefined ? 0 : data.quarter
                                    }
                                },
                            })];
                    case 2:
                        existingMetrics = _a.sent();
                        if (existingMetrics) {
                            throw new Error('FINANCIAL_METRICS_ALREADY_EXISTS');
                        }
                        return [2 /*return*/, prisma.financialMetrics.create({
                                data: data,
                            })];
                }
            });
        });
    };
    FinancialMetricsService.prototype.updateFinancialMetrics = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.financialMetrics.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        existingMetrics = _a.sent();
                        if (!existingMetrics) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, prisma.financialMetrics.update({
                                where: { id: id },
                                data: data,
                            })];
                }
            });
        });
    };
    FinancialMetricsService.prototype.updateFinancialMetricsBySymbolYearQuarter = function (symbol, year, quarter, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.financialMetrics.findUnique({
                            where: {
                                symbol_year_quarter: {
                                    symbol: symbol,
                                    year: year,
                                    quarter: quarter
                                }
                            },
                        })];
                    case 1:
                        existingMetrics = _a.sent();
                        if (!existingMetrics) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, prisma.financialMetrics.update({
                                where: {
                                    symbol_year_quarter: {
                                        symbol: symbol,
                                        year: year,
                                        quarter: quarter
                                    }
                                },
                                data: data,
                            })];
                }
            });
        });
    };
    FinancialMetricsService.prototype.deleteFinancialMetricsById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.financialMetrics.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        existingMetrics = _a.sent();
                        if (!existingMetrics) {
                            throw new Error('FINANCIAL_METRICS_NOT_FOUND');
                        }
                        return [4 /*yield*/, prisma.financialMetrics.delete({
                                where: { id: id },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FinancialMetricsService.prototype.deleteFinancialMetricsBySymbolYearQuarter = function (symbol, year, quarter) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.financialMetrics.findUnique({
                            where: {
                                symbol_year_quarter: {
                                    symbol: symbol,
                                    year: year,
                                    quarter: quarter
                                }
                            },
                        })];
                    case 1:
                        existingMetrics = _a.sent();
                        if (!existingMetrics) {
                            throw new Error('FINANCIAL_METRICS_NOT_FOUND');
                        }
                        return [4 /*yield*/, prisma.financialMetrics.delete({
                                where: {
                                    symbol_year_quarter: {
                                        symbol: symbol,
                                        year: year,
                                        quarter: quarter
                                    }
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FinancialMetricsService.prototype.bulkCreateFinancialMetrics = function (dataArray) {
        return __awaiter(this, void 0, void 0, function () {
            var symbols, stocks, validSymbols, validData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        symbols = __spreadArray([], new Set(dataArray.map(function (item) { return item.symbol; })), true);
                        return [4 /*yield*/, prisma.stock.findMany({
                                where: {
                                    symbol: {
                                        in: symbols
                                    }
                                },
                                select: {
                                    symbol: true
                                }
                            })];
                    case 1:
                        stocks = _a.sent();
                        validSymbols = new Set(stocks.map(function (s) { return s.symbol; }));
                        validData = dataArray.filter(function (item) { return validSymbols.has(item.symbol); });
                        if (validData.length === 0) {
                            return [2 /*return*/, 0];
                        }
                        return [4 /*yield*/, prisma.financialMetrics.createMany({
                                data: validData,
                                skipDuplicates: true, // Skip records that would cause unique constraint violations
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                }
            });
        });
    };
    return FinancialMetricsService;
}());
exports.FinancialMetricsService = FinancialMetricsService;
