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
exports.deletePost = exports.restorePost = exports.softDeletePost = exports.updatePost = exports.createPost = exports.getPostBySlug = exports.getPostById = exports.getAllPosts = void 0;
var services_1 = require("../services");
var utils_1 = require("../utils");
/**
 * Lấy danh sách bài viết với phân trang
 */
var getAllPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, sort, order, search, categoryId, symbol, userId, isPremium, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                page = req.query.page ? parseInt(req.query.page) : 1;
                limit = req.query.limit ? parseInt(req.query.limit) : 10;
                sort = req.query.sort || 'createdAt';
                order = req.query.order || 'desc';
                search = req.query.search || '';
                categoryId = req.query.categoryId;
                symbol = req.query.symbol;
                userId = req.query.userId;
                isPremium = req.query.isPremium ? req.query.isPremium === 'true' : undefined;
                // Validate page và limit
                if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.INVALID_POST_DATA
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, services_1.postService.getAllPosts({
                        page: page,
                        limit: limit,
                        sort: sort,
                        order: order,
                        search: search,
                        categoryId: categoryId,
                        symbol: symbol,
                        userId: userId,
                        isPremium: isPremium
                    })];
            case 1:
                result = _a.sent();
                res.status(200).json({
                    message: utils_1.POST_MESSAGES.GET_POSTS_SUCCESS,
                    posts: result.data,
                    pagination: result.pagination
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get all posts error:', error_1);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.GET_POSTS_ERROR
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllPosts = getAllPosts;
/**
 * Lấy thông tin bài viết theo ID
 */
var getPostById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, serviceError_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.INVALID_POST_DATA
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.postService.getPostById(id)];
            case 2:
                post = _a.sent();
                res.status(200).json({
                    message: utils_1.POST_MESSAGES.GET_POST_SUCCESS,
                    post: post
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_1 = _a.sent();
                if (serviceError_1 instanceof Error && serviceError_1.message === 'POST_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_1;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.error('Get post by ID error:', error_2);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.GET_POSTS_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getPostById = getPostById;
/**
 * Lấy thông tin bài viết theo slug
 */
var getPostBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, post, serviceError_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                slug = req.params.slug;
                if (!slug) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.INVALID_POST_DATA
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.postService.getPostBySlug(slug)];
            case 2:
                post = _a.sent();
                res.status(200).json({
                    message: utils_1.POST_MESSAGES.GET_POST_SUCCESS,
                    post: post
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_2 = _a.sent();
                if (serviceError_2 instanceof Error && serviceError_2.message === 'POST_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_2;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('Get post by slug error:', error_3);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.GET_POSTS_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getPostBySlug = getPostBySlug;
/**
 * Tạo bài viết mới
 */
var createPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, content, thumbnailId, categoryId, symbol, isPremium, userId, post, serviceError_3, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, title = _a.title, description = _a.description, content = _a.content, thumbnailId = _a.thumbnailId, categoryId = _a.categoryId, symbol = _a.symbol, isPremium = _a.isPremium;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!title || !categoryId || !userId) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.postService.createPost({
                        title: title,
                        description: description,
                        content: content,
                        thumbnailId: thumbnailId ? parseInt(thumbnailId) : undefined,
                        categoryId: categoryId,
                        symbol: symbol,
                        userId: userId,
                        isPremium: isPremium
                    })];
            case 2:
                post = _c.sent();
                res.status(201).json({
                    message: utils_1.POST_MESSAGES.CREATE_POST_SUCCESS,
                    post: post
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_3 = _c.sent();
                if (serviceError_3 instanceof Error) {
                    switch (serviceError_3.message) {
                        case 'CATEGORY_NOT_FOUND':
                            res.status(400).json({
                                message: utils_1.POST_MESSAGES.CATEGORY_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'STOCK_NOT_FOUND':
                            res.status(400).json({
                                message: utils_1.POST_MESSAGES.STOCK_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'IMAGE_NOT_FOUND':
                            res.status(400).json({
                                message: utils_1.POST_MESSAGES.IMAGE_NOT_FOUND
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_3;
                    }
                }
                throw serviceError_3;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_4 = _c.sent();
                console.error('Create post error:', error_4);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.CREATE_POST_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
/**
 * Cập nhật bài viết
 */
var updatePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, _a, title, description, content, thumbnailId, categoryId, symbol, isPremium, post, serviceError_4, error_5;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                id = req.params.id;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                _a = req.body, title = _a.title, description = _a.description, content = _a.content, thumbnailId = _a.thumbnailId, categoryId = _a.categoryId, symbol = _a.symbol, isPremium = _a.isPremium;
                if (!id) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.INVALID_POST_DATA
                    });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.postService.updatePost(id, userId, {
                        title: title,
                        description: description,
                        content: content,
                        thumbnailId: thumbnailId ? parseInt(thumbnailId) : undefined,
                        categoryId: categoryId,
                        symbol: symbol,
                        isPremium: isPremium
                    })];
            case 2:
                post = _c.sent();
                res.status(200).json({
                    message: utils_1.POST_MESSAGES.UPDATE_POST_SUCCESS,
                    post: post
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_4 = _c.sent();
                if (serviceError_4 instanceof Error) {
                    switch (serviceError_4.message) {
                        case 'POST_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'UNAUTHORIZED':
                            res.status(403).json({
                                message: utils_1.POST_MESSAGES.UNAUTHORIZED
                            });
                            return [2 /*return*/];
                        case 'CATEGORY_NOT_FOUND':
                            res.status(400).json({
                                message: utils_1.POST_MESSAGES.CATEGORY_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'STOCK_NOT_FOUND':
                            res.status(400).json({
                                message: utils_1.POST_MESSAGES.STOCK_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'IMAGE_NOT_FOUND':
                            res.status(400).json({
                                message: utils_1.POST_MESSAGES.IMAGE_NOT_FOUND
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_4;
                    }
                }
                throw serviceError_4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _c.sent();
                console.error('Update post error:', error_5);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.UPDATE_POST_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updatePost = updatePost;
/**
 * Xóa mềm bài viết
 */
var softDeletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, serviceError_5, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = req.params.id;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!id) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.INVALID_POST_DATA
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.postService.softDeletePost(id, userId)];
            case 2:
                _b.sent();
                res.status(200).json({
                    message: utils_1.POST_MESSAGES.DELETE_POST_SUCCESS
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_5 = _b.sent();
                if (serviceError_5 instanceof Error) {
                    switch (serviceError_5.message) {
                        case 'POST_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'UNAUTHORIZED':
                            res.status(403).json({
                                message: utils_1.POST_MESSAGES.UNAUTHORIZED
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_5;
                    }
                }
                throw serviceError_5;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                console.error('Delete post error:', error_6);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.DELETE_POST_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.softDeletePost = softDeletePost;
/**
 * Khôi phục bài viết đã xóa
 */
var restorePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, post, serviceError_6, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = req.params.id;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!id) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.INVALID_POST_DATA
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.postService.restorePost(id, userId)];
            case 2:
                post = _b.sent();
                res.status(200).json({
                    message: utils_1.POST_MESSAGES.UPDATE_POST_SUCCESS,
                    post: post
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_6 = _b.sent();
                if (serviceError_6 instanceof Error) {
                    switch (serviceError_6.message) {
                        case 'POST_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'UNAUTHORIZED':
                            res.status(403).json({
                                message: utils_1.POST_MESSAGES.UNAUTHORIZED
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_6;
                    }
                }
                throw serviceError_6;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_7 = _b.sent();
                console.error('Restore post error:', error_7);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.UPDATE_POST_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.restorePost = restorePost;
/**
 * Xóa vĩnh viễn bài viết (chỉ admin)
 */
var deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, serviceError_7, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = req.params.id;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!id) {
                    res.status(400).json({
                        message: utils_1.POST_MESSAGES.INVALID_POST_DATA
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.postService.deletePost(id, userId)];
            case 2:
                _b.sent();
                res.status(200).json({
                    message: utils_1.POST_MESSAGES.DELETE_POST_SUCCESS
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_7 = _b.sent();
                if (serviceError_7 instanceof Error) {
                    switch (serviceError_7.message) {
                        case 'POST_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'UNAUTHORIZED':
                            res.status(403).json({
                                message: utils_1.POST_MESSAGES.UNAUTHORIZED
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_7;
                    }
                }
                throw serviceError_7;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_8 = _b.sent();
                console.error('Delete post permanently error:', error_8);
                res.status(500).json({
                    message: utils_1.POST_MESSAGES.DELETE_POST_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
