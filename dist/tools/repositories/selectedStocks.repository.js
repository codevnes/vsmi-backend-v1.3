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
exports.SelectedStocksRepository = void 0;
var app_1 = require("../app");
var SelectedStocksRepository = /** @class */ (function () {
    function SelectedStocksRepository(prismaClient) {
        if (prismaClient === void 0) { prismaClient = app_1.prisma; }
        this.prismaClient = prismaClient;
    }
    SelectedStocksRepository.prototype.findAll = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, limit, _d, sort, _e, order, skip, take, _f, items, count, totalPages;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _a = options || {}, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? 'date' : _d, _e = _a.order, order = _e === void 0 ? 'desc' : _e;
                        skip = (page - 1) * limit;
                        take = limit;
                        return [4 /*yield*/, Promise.all([
                                this.prismaClient.selectedStocks.findMany({
                                    skip: skip,
                                    take: take,
                                    orderBy: (_g = {},
                                        _g[sort] = order,
                                        _g),
                                }),
                                this.prismaClient.selectedStocks.count(),
                            ])];
                    case 1:
                        _f = _h.sent(), items = _f[0], count = _f[1];
                        totalPages = Math.ceil(count / limit);
                        return [2 /*return*/, {
                                data: items,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    totalItems: count,
                                    totalPages: totalPages,
                                    hasNextPage: page < totalPages,
                                    hasPrevPage: page > 1,
                                },
                            }];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.findBySymbol = function (symbol, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, limit, _d, sort, _e, order, skip, take, _f, items, count, totalPages;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _a = options || {}, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? 'date' : _d, _e = _a.order, order = _e === void 0 ? 'desc' : _e;
                        skip = (page - 1) * limit;
                        take = limit;
                        return [4 /*yield*/, Promise.all([
                                this.prismaClient.selectedStocks.findMany({
                                    where: {
                                        symbol: symbol,
                                    },
                                    skip: skip,
                                    take: take,
                                    orderBy: (_g = {},
                                        _g[sort] = order,
                                        _g),
                                }),
                                this.prismaClient.selectedStocks.count({
                                    where: {
                                        symbol: symbol,
                                    },
                                }),
                            ])];
                    case 1:
                        _f = _h.sent(), items = _f[0], count = _f[1];
                        totalPages = Math.ceil(count / limit);
                        return [2 /*return*/, {
                                data: items,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    totalItems: count,
                                    totalPages: totalPages,
                                    hasNextPage: page < totalPages,
                                    hasPrevPage: page > 1,
                                },
                            }];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.findByDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaClient.selectedStocks.findMany({
                            where: {
                                date: date,
                            },
                            orderBy: {
                                qIndex: 'desc',
                            },
                        })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.findTopByQIndex = function () {
        return __awaiter(this, arguments, void 0, function (limit, startDate, endDate) {
            var dateFilter, whereClause, items;
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dateFilter = {};
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
                        whereClause = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};
                        return [4 /*yield*/, this.prismaClient.selectedStocks.findMany({
                                where: whereClause,
                                orderBy: {
                                    qIndex: 'desc',
                                },
                                take: limit,
                            })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaClient.selectedStocks.findUnique({
                            where: {
                                id: id,
                            },
                        })];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.findBySymbolAndDate = function (symbol, date) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaClient.selectedStocks.findUnique({
                            where: {
                                symbol_date: {
                                    symbol: symbol,
                                    date: date,
                                },
                            },
                        })];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaClient.selectedStocks.create({
                            data: data,
                        })];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaClient.selectedStocks.update({
                            where: {
                                id: id,
                            },
                            data: data,
                        })];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaClient.selectedStocks.delete({
                            where: {
                                id: id,
                            },
                        })];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    SelectedStocksRepository.prototype.deleteMany = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaClient.selectedStocks.deleteMany({
                            where: {
                                id: {
                                    in: ids,
                                },
                            },
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                }
            });
        });
    };
    return SelectedStocksRepository;
}());
exports.SelectedStocksRepository = SelectedStocksRepository;
