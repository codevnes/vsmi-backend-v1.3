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
exports.PostService = void 0;
var repositories_1 = require("../repositories");
var app_1 = require("../app");
var PostService = /** @class */ (function () {
    function PostService() {
    }
    /**
     * Lấy danh sách bài viết với phân trang
     */
    PostService.prototype.getAllPosts = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.postRepository.findAllWithPagination(options)];
                    case 1:
                        result = _a.sent();
                        // Chuyển đổi sang định dạng public cho client
                        return [2 /*return*/, {
                                data: result.data.map(function (post) { return _this.toPublicPost(post); }),
                                pagination: result.pagination
                            }];
                }
            });
        });
    };
    /**
     * Lấy bài viết theo ID
     */
    PostService.prototype.getPostById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.postRepository.findById(id)];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            throw new Error('POST_NOT_FOUND');
                        }
                        return [2 /*return*/, this.toPublicPost(post)];
                }
            });
        });
    };
    /**
     * Lấy bài viết theo slug
     */
    PostService.prototype.getPostBySlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.postRepository.findBySlug(slug)];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            throw new Error('POST_NOT_FOUND');
                        }
                        return [2 /*return*/, this.toPublicPost(post)];
                }
            });
        });
    };
    /**
     * Tạo bài viết mới
     */
    PostService.prototype.createPost = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var category, stock, image, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.categoryRepository.findById(data.categoryId)];
                    case 1:
                        category = _a.sent();
                        if (!category) {
                            throw new Error('CATEGORY_NOT_FOUND');
                        }
                        if (!data.symbol) return [3 /*break*/, 3];
                        return [4 /*yield*/, app_1.prisma.stock.findUnique({
                                where: { symbol: data.symbol }
                            })];
                    case 2:
                        stock = _a.sent();
                        if (!stock) {
                            throw new Error('STOCK_NOT_FOUND');
                        }
                        _a.label = 3;
                    case 3:
                        if (!data.thumbnailId) return [3 /*break*/, 5];
                        return [4 /*yield*/, app_1.prisma.image.findUnique({
                                where: { id: data.thumbnailId }
                            })];
                    case 4:
                        image = _a.sent();
                        if (!image) {
                            throw new Error('IMAGE_NOT_FOUND');
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, repositories_1.postRepository.create(data)];
                    case 6:
                        post = _a.sent();
                        return [2 /*return*/, this.toPublicPost(post)];
                }
            });
        });
    };
    /**
     * Cập nhật bài viết
     */
    PostService.prototype.updatePost = function (id, userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingPost, user, category, stock, image, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.postRepository.findById(id)];
                    case 1:
                        existingPost = _a.sent();
                        if (!existingPost) {
                            throw new Error('POST_NOT_FOUND');
                        }
                        if (!(existingPost.userId !== userId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, app_1.prisma.user.findUnique({
                                where: { id: userId }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user || user.role !== 'ADMIN') {
                            throw new Error('UNAUTHORIZED');
                        }
                        _a.label = 3;
                    case 3:
                        if (!data.categoryId) return [3 /*break*/, 5];
                        return [4 /*yield*/, repositories_1.categoryRepository.findById(data.categoryId)];
                    case 4:
                        category = _a.sent();
                        if (!category) {
                            throw new Error('CATEGORY_NOT_FOUND');
                        }
                        _a.label = 5;
                    case 5:
                        if (!data.symbol) return [3 /*break*/, 7];
                        return [4 /*yield*/, app_1.prisma.stock.findUnique({
                                where: { symbol: data.symbol }
                            })];
                    case 6:
                        stock = _a.sent();
                        if (!stock) {
                            throw new Error('STOCK_NOT_FOUND');
                        }
                        _a.label = 7;
                    case 7:
                        if (!data.thumbnailId) return [3 /*break*/, 9];
                        return [4 /*yield*/, app_1.prisma.image.findUnique({
                                where: { id: data.thumbnailId }
                            })];
                    case 8:
                        image = _a.sent();
                        if (!image) {
                            throw new Error('IMAGE_NOT_FOUND');
                        }
                        _a.label = 9;
                    case 9: return [4 /*yield*/, repositories_1.postRepository.update(id, data)];
                    case 10:
                        post = _a.sent();
                        return [2 /*return*/, this.toPublicPost(post)];
                }
            });
        });
    };
    /**
     * Xóa mềm bài viết
     */
    PostService.prototype.softDeletePost = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingPost, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.postRepository.findById(id)];
                    case 1:
                        existingPost = _a.sent();
                        if (!existingPost) {
                            throw new Error('POST_NOT_FOUND');
                        }
                        if (!(existingPost.userId !== userId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, app_1.prisma.user.findUnique({
                                where: { id: userId }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user || user.role !== 'ADMIN') {
                            throw new Error('UNAUTHORIZED');
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, repositories_1.postRepository.softDelete(id)];
                    case 4: 
                    // Xóa mềm bài viết
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Khôi phục bài viết đã xóa (chỉ admin mới được khôi phục)
     */
    PostService.prototype.restorePost = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, existingPost, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.findUnique({
                            where: { id: userId }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || user.role !== 'ADMIN') {
                            throw new Error('UNAUTHORIZED');
                        }
                        return [4 /*yield*/, app_1.prisma.post.findFirst({
                                where: {
                                    id: id,
                                    deletedAt: { not: null }
                                }
                            })];
                    case 2:
                        existingPost = _a.sent();
                        if (!existingPost) {
                            throw new Error('POST_NOT_FOUND');
                        }
                        return [4 /*yield*/, repositories_1.postRepository.restore(id)];
                    case 3:
                        post = _a.sent();
                        return [2 /*return*/, this.toPublicPost(post)];
                }
            });
        });
    };
    /**
     * Xóa vĩnh viễn bài viết (chỉ admin mới được xóa vĩnh viễn)
     */
    PostService.prototype.deletePost = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, existingPost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.prisma.user.findUnique({
                            where: { id: userId }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || user.role !== 'ADMIN') {
                            throw new Error('UNAUTHORIZED');
                        }
                        return [4 /*yield*/, repositories_1.postRepository.findById(id)];
                    case 2:
                        existingPost = _a.sent();
                        if (!existingPost) {
                            throw new Error('POST_NOT_FOUND');
                        }
                        return [4 /*yield*/, repositories_1.postRepository.delete(id)];
                    case 3: 
                    // Xóa vĩnh viễn bài viết
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Chuyển đổi từ dữ liệu Prisma thành dữ liệu public cho client
     */
    PostService.prototype.toPublicPost = function (post) {
        return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            description: post.description,
            content: post.content,
            thumbnail: post.thumbnail ? {
                id: post.thumbnail.id,
                url: post.thumbnail.url
            } : null,
            categoryId: post.categoryId,
            category: post.category ? {
                id: post.category.id,
                title: post.category.title,
                slug: post.category.slug
            } : undefined,
            symbol: post.symbol,
            stock: post.stock ? {
                symbol: post.stock.symbol,
                name: post.stock.name
            } : null,
            author: {
                id: post.user.id,
                fullName: post.user.fullName
            },
            isPremium: post.isPremium,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        };
    };
    return PostService;
}());
exports.PostService = PostService;
