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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
var app_1 = require("../app");
var slugify_1 = __importDefault(require("slugify"));
var PostRepository = /** @class */ (function () {
    function PostRepository() {
    }
    /**
     * Tìm tất cả bài viết với phân trang và tìm kiếm
     */
    PostRepository.prototype.findAllWithPagination = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, sort, _d, order, search, categoryId, userId, symbol, isPremium, skip, where, total, posts, totalPages, hasNextPage, hasPrevPage;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = options.page, page = _a === void 0 ? 1 : _a, _b = options.limit, limit = _b === void 0 ? 10 : _b, _c = options.sort, sort = _c === void 0 ? 'createdAt' : _c, _d = options.order, order = _d === void 0 ? 'desc' : _d, search = options.search, categoryId = options.categoryId, userId = options.userId, symbol = options.symbol, isPremium = options.isPremium;
                        skip = (page - 1) * limit;
                        where = {
                            deletedAt: null,
                        };
                        // Áp dụng bộ lọc nếu có
                        if (categoryId)
                            where.categoryId = categoryId;
                        if (userId)
                            where.userId = userId;
                        if (symbol)
                            where.symbol = symbol;
                        if (isPremium !== undefined)
                            where.isPremium = isPremium;
                        // Tìm kiếm theo từ khóa nếu có
                        if (search) {
                            where.OR = [
                                { title: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } },
                                { content: { contains: search, mode: 'insensitive' } }
                            ];
                        }
                        return [4 /*yield*/, app_1.prisma.post.count({ where: where })];
                    case 1:
                        total = _f.sent();
                        return [4 /*yield*/, app_1.prisma.post.findMany({
                                where: where,
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true,
                                    description: true,
                                    isPremium: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    categoryId: true,
                                    symbol: true,
                                    userId: true,
                                    thumbnailId: true,
                                    category: {
                                        select: {
                                            id: true,
                                            title: true,
                                            slug: true
                                        }
                                    },
                                    stock: {
                                        select: {
                                            symbol: true,
                                            name: true
                                        }
                                    },
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true
                                        }
                                    },
                                    thumbnail: {
                                        select: {
                                            id: true,
                                            url: true
                                        }
                                    }
                                },
                                skip: skip,
                                take: limit,
                                orderBy: (_e = {}, _e[sort] = order, _e)
                            })];
                    case 2:
                        posts = _f.sent();
                        totalPages = Math.ceil(total / limit);
                        hasNextPage = page < totalPages;
                        hasPrevPage = page > 1;
                        return [2 /*return*/, {
                                data: posts,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    totalItems: total,
                                    totalPages: totalPages,
                                    hasNextPage: hasNextPage,
                                    hasPrevPage: hasPrevPage
                                }
                            }];
                }
            });
        });
    };
    /**
     * Tìm bài viết theo ID
     */
    PostRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, app_1.prisma.post.findFirst({
                        where: {
                            id: id,
                            deletedAt: null
                        },
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true
                                }
                            },
                            stock: {
                                select: {
                                    symbol: true,
                                    name: true
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    fullName: true
                                }
                            },
                            thumbnail: {
                                select: {
                                    id: true,
                                    url: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    /**
     * Tìm bài viết theo slug
     */
    PostRepository.prototype.findBySlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, app_1.prisma.post.findFirst({
                        where: {
                            slug: slug,
                            deletedAt: null
                        },
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true
                                }
                            },
                            stock: {
                                select: {
                                    symbol: true,
                                    name: true
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    fullName: true
                                }
                            },
                            thumbnail: {
                                select: {
                                    id: true,
                                    url: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    /**
     * Kiểm tra xem slug đã tồn tại hay chưa
     */
    PostRepository.prototype.isSlugExist = function (slug, excludeId) {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.post.count({
                            where: {
                                slug: slug,
                                id: excludeId ? { not: excludeId } : undefined,
                                deletedAt: null
                            }
                        })];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count > 0];
                }
            });
        });
    };
    /**
     * Tạo bài viết mới
     */
    PostRepository.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, isExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = (0, slugify_1.default)(data.title, { lower: true, strict: true });
                        return [4 /*yield*/, this.isSlugExist(slug)];
                    case 1:
                        isExist = _a.sent();
                        // Nếu slug đã tồn tại, thêm timestamp để tránh trùng lặp
                        if (isExist) {
                            slug = "".concat(slug, "-").concat(Date.now());
                        }
                        return [2 /*return*/, app_1.prisma.post.create({
                                data: __assign(__assign({}, data), { slug: slug }),
                                include: {
                                    category: {
                                        select: {
                                            id: true,
                                            title: true,
                                            slug: true
                                        }
                                    },
                                    stock: {
                                        select: {
                                            symbol: true,
                                            name: true
                                        }
                                    },
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true
                                        }
                                    },
                                    thumbnail: {
                                        select: {
                                            id: true,
                                            url: true
                                        }
                                    }
                                }
                            })];
                }
            });
        });
    };
    /**
     * Cập nhật bài viết
     */
    PostRepository.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, isExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = undefined;
                        if (!data.title) return [3 /*break*/, 2];
                        slug = (0, slugify_1.default)(data.title, { lower: true, strict: true });
                        return [4 /*yield*/, this.isSlugExist(slug, id)];
                    case 1:
                        isExist = _a.sent();
                        // Nếu slug đã tồn tại, thêm timestamp để tránh trùng lặp
                        if (isExist) {
                            slug = "".concat(slug, "-").concat(Date.now());
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, app_1.prisma.post.update({
                            where: { id: id },
                            data: __assign(__assign({}, data), { slug: slug ? slug : undefined, updatedAt: new Date() }),
                            include: {
                                category: {
                                    select: {
                                        id: true,
                                        title: true,
                                        slug: true
                                    }
                                },
                                stock: {
                                    select: {
                                        symbol: true,
                                        name: true
                                    }
                                },
                                user: {
                                    select: {
                                        id: true,
                                        fullName: true
                                    }
                                },
                                thumbnail: {
                                    select: {
                                        id: true,
                                        url: true
                                    }
                                }
                            }
                        })];
                }
            });
        });
    };
    /**
     * Xóa mềm bài viết
     */
    PostRepository.prototype.softDelete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.post.update({
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
    /**
     * Khôi phục bài viết đã xóa mềm
     */
    PostRepository.prototype.restore = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, app_1.prisma.post.update({
                        where: { id: id },
                        data: { deletedAt: null }
                    })];
            });
        });
    };
    /**
     * Xóa vĩnh viễn bài viết
     */
    PostRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.post.delete({
                            where: { id: id }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return PostRepository;
}());
exports.PostRepository = PostRepository;
