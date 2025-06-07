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
exports.StockProfileService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var StockProfileService = /** @class */ (function () {
    function StockProfileService() {
    }
    StockProfileService.prototype.getStockProfiles = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var skip, where, _c, profiles, total;
            var _d = _b.page, page = _d === void 0 ? 1 : _d, _e = _b.limit, limit = _e === void 0 ? 10 : _e, search = _b.search;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where.stock = {
                                OR: [
                                    { symbol: { contains: search, mode: 'insensitive' } },
                                    { name: { contains: search, mode: 'insensitive' } },
                                ],
                            };
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.stockProfile.findMany({
                                    where: where,
                                    skip: skip,
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
                                prisma.stockProfile.count({ where: where }),
                            ])];
                    case 1:
                        _c = _f.sent(), profiles = _c[0], total = _c[1];
                        return [2 /*return*/, {
                                data: profiles,
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
    StockProfileService.prototype.getStockProfileBySymbol = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.stockProfile.findUnique({
                            where: { symbol: symbol },
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
                        })];
                    case 1:
                        profile = _a.sent();
                        return [2 /*return*/, profile];
                }
            });
        });
    };
    StockProfileService.prototype.createStockProfile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var stock, existingProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.stock.findUnique({
                            where: { symbol: data.symbol },
                        })];
                    case 1:
                        stock = _a.sent();
                        if (!stock) {
                            throw new Error("Stock with symbol ".concat(data.symbol, " not found"));
                        }
                        return [4 /*yield*/, prisma.stockProfile.findUnique({
                                where: { symbol: data.symbol },
                            })];
                    case 2:
                        existingProfile = _a.sent();
                        if (existingProfile) {
                            throw new Error("StockProfile for symbol ".concat(data.symbol, " already exists"));
                        }
                        return [2 /*return*/, prisma.stockProfile.create({
                                data: data,
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
                            })];
                }
            });
        });
    };
    StockProfileService.prototype.updateStockProfile = function (symbol, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.stockProfile.findUnique({
                            where: { symbol: symbol },
                        })];
                    case 1:
                        existingProfile = _a.sent();
                        if (!existingProfile) {
                            throw new Error("StockProfile for symbol ".concat(symbol, " not found"));
                        }
                        return [2 /*return*/, prisma.stockProfile.update({
                                where: { symbol: symbol },
                                data: data,
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
                            })];
                }
            });
        });
    };
    StockProfileService.prototype.deleteStockProfile = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var existingProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.stockProfile.findUnique({
                            where: { symbol: symbol },
                        })];
                    case 1:
                        existingProfile = _a.sent();
                        if (!existingProfile) {
                            throw new Error("StockProfile for symbol ".concat(symbol, " not found"));
                        }
                        return [2 /*return*/, prisma.stockProfile.delete({
                                where: { symbol: symbol },
                            })];
                }
            });
        });
    };
    StockProfileService.prototype.upsertStockProfile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var stock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.stock.findUnique({
                            where: { symbol: data.symbol },
                        })];
                    case 1:
                        stock = _a.sent();
                        if (!stock) {
                            throw new Error("Stock with symbol ".concat(data.symbol, " not found"));
                        }
                        return [2 /*return*/, prisma.stockProfile.upsert({
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
                            })];
                }
            });
        });
    };
    return StockProfileService;
}());
exports.StockProfileService = StockProfileService;
