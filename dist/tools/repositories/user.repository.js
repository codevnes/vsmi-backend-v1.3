"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.UserRepository = void 0;
var client_1 = require("@prisma/client");
var app_1 = require("../app");
var UserRepository = /** @class */ (function () {
    function UserRepository() {
    }
    UserRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.findUnique({
                            where: { id: id }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserRepository.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.findUnique({
                            where: { email: email }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.findMany({
                            where: { deletedAt: null }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserRepository.prototype.findAllWithPagination = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, sort, _d, order, _e, search, role, verified, skip, where, totalItems, users, totalPages;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = options.page, page = _a === void 0 ? 1 : _a, _b = options.limit, limit = _b === void 0 ? 10 : _b, _c = options.sort, sort = _c === void 0 ? 'createdAt' : _c, _d = options.order, order = _d === void 0 ? 'desc' : _d, _e = options.search, search = _e === void 0 ? '' : _e, role = options.role, verified = options.verified;
                        skip = (page - 1) * limit;
                        where = {
                            deletedAt: null
                        };
                        // Thêm điều kiện tìm kiếm
                        if (search) {
                            where.OR = [
                                { fullName: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } }
                            ];
                        }
                        // Thêm điều kiện lọc theo role
                        if (role) {
                            where.role = role;
                        }
                        // Thêm điều kiện lọc theo verified
                        if (verified !== undefined) {
                            where.verified = verified;
                        }
                        return [4 /*yield*/, app_1.prisma.user.count({ where: where })];
                    case 1:
                        totalItems = _g.sent();
                        return [4 /*yield*/, app_1.prisma.user.findMany({
                                where: where,
                                skip: skip,
                                take: limit,
                                orderBy: (_f = {},
                                    _f[sort] = order,
                                    _f)
                            })];
                    case 2:
                        users = _g.sent();
                        totalPages = Math.ceil(totalItems / limit);
                        return [2 /*return*/, {
                                data: users,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    totalItems: totalItems,
                                    totalPages: totalPages,
                                    hasNextPage: page < totalPages,
                                    hasPrevPage: page > 1
                                }
                            }];
                }
            });
        });
    };
    UserRepository.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.create({
                            data: __assign(__assign({}, data), { role: data.role || client_1.Role.USER })
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserRepository.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.update({
                            where: { id: id },
                            data: data
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.update({
                            where: { id: id },
                            data: { deletedAt: new Date() }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    UserRepository.prototype.getUserProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.findUnique({
                            where: { id: id },
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                                phone: true,
                                role: true,
                                verified: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return UserRepository;
}());
exports.UserRepository = UserRepository;
