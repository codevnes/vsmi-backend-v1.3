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
exports.CategoryRepository = void 0;
var app_1 = require("../app");
var CategoryRepository = /** @class */ (function () {
    function CategoryRepository() {
    }
    CategoryRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.findUnique({
                            where: { id: id }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryRepository.prototype.findBySlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.findUnique({
                            where: { slug: slug }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.findMany({
                            where: { deletedAt: null }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryRepository.prototype.findAllWithPagination = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, sort, _d, order, _e, search, parentId, skip, where, totalItems, categories, totalPages;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = options.page, page = _a === void 0 ? 1 : _a, _b = options.limit, limit = _b === void 0 ? 10 : _b, _c = options.sort, sort = _c === void 0 ? 'createdAt' : _c, _d = options.order, order = _d === void 0 ? 'desc' : _d, _e = options.search, search = _e === void 0 ? '' : _e, parentId = options.parentId;
                        skip = (page - 1) * limit;
                        where = {
                            deletedAt: null
                        };
                        // Thêm điều kiện tìm kiếm
                        if (search) {
                            where.OR = [
                                { title: { contains: search, mode: 'insensitive' } },
                                { slug: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } }
                            ];
                        }
                        // Lọc theo parent nếu có
                        if (parentId !== undefined) {
                            where.parentId = parentId;
                        }
                        return [4 /*yield*/, app_1.prisma.category.count({ where: where })];
                    case 1:
                        totalItems = _g.sent();
                        return [4 /*yield*/, app_1.prisma.category.findMany({
                                where: where,
                                skip: skip,
                                take: limit,
                                orderBy: (_f = {},
                                    _f[sort] = order,
                                    _f)
                            })];
                    case 2:
                        categories = _g.sent();
                        totalPages = Math.ceil(totalItems / limit);
                        return [2 /*return*/, {
                                data: categories,
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
    CategoryRepository.prototype.findAllWithChildren = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rootCategories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.findMany({
                            where: {
                                deletedAt: null,
                                parentId: null
                            },
                            include: {
                                children: {
                                    where: { deletedAt: null }
                                }
                            }
                        })];
                    case 1:
                        rootCategories = _a.sent();
                        return [2 /*return*/, rootCategories];
                }
            });
        });
    };
    CategoryRepository.prototype.getCategoryHierarchy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var category, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.findUnique({
                            where: { id: id },
                            include: {
                                children: {
                                    where: { deletedAt: null }
                                }
                            }
                        })];
                    case 1:
                        category = _a.sent();
                        if (!category) {
                            return [2 /*return*/, null];
                        }
                        result = {
                            id: category.id,
                            title: category.title,
                            slug: category.slug,
                            thumbnailId: category.thumbnailId,
                            description: category.description,
                            parentId: category.parentId,
                            createdAt: category.createdAt,
                            updatedAt: category.updatedAt,
                            children: category.children.map(function (child) { return ({
                                id: child.id,
                                title: child.title,
                                slug: child.slug,
                                thumbnailId: child.thumbnailId,
                                description: child.description,
                                parentId: child.parentId,
                                createdAt: child.createdAt,
                                updatedAt: child.updatedAt
                            }); })
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CategoryRepository.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.create({
                            data: data
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryRepository.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.update({
                            where: { id: id },
                            data: data
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.category.update({
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
    return CategoryRepository;
}());
exports.CategoryRepository = CategoryRepository;
