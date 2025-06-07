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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategoryById = exports.getCategoryTree = exports.getAllCategories = void 0;
var services_1 = require("../services");
var utils_1 = require("../utils");
/**
 * Lấy danh sách danh mục với phân trang và tìm kiếm
 */
var getAllCategories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, sort, order, search, parentId, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                page = req.query.page ? parseInt(req.query.page) : 1;
                limit = req.query.limit ? parseInt(req.query.limit) : 10;
                sort = req.query.sort || 'createdAt';
                order = req.query.order || 'desc';
                search = req.query.search || '';
                parentId = req.query.parentId === 'null'
                    ? null
                    : req.query.parentId;
                // Validate page và limit
                if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
                    res.status(400).json({
                        message: utils_1.CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, services_1.categoryService.getAllCategories({
                        page: page,
                        limit: limit,
                        sort: sort,
                        order: order,
                        search: search,
                        parentId: parentId
                    })];
            case 1:
                result = _a.sent();
                res.status(200).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
                    categories: result.data,
                    pagination: result.pagination
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get all categories error:', error_1);
                res.status(500).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllCategories = getAllCategories;
/**
 * Lấy cấu trúc cây danh mục
 */
var getCategoryTree = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, services_1.categoryService.getCategoryTree()];
            case 1:
                categories = _a.sent();
                res.status(200).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
                    categories: categories
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Get category tree error:', error_2);
                res.status(500).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryTree = getCategoryTree;
/**
 * Lấy thông tin danh mục theo ID kèm danh mục con
 */
var getCategoryById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, category, serviceError_1, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.categoryService.getCategoryById(id)];
            case 2:
                category = _a.sent();
                res.status(200).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
                    category: category
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_1 = _a.sent();
                if (serviceError_1 instanceof Error && serviceError_1.message === 'CATEGORY_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_1;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('Get category by ID error:', error_3);
                res.status(500).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryById = getCategoryById;
/**
 * Lấy thông tin danh mục theo slug
 */
var getCategoryBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, category, serviceError_2, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                slug = req.params.slug;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.categoryService.getCategoryBySlug(slug)];
            case 2:
                category = _a.sent();
                res.status(200).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
                    category: category
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_2 = _a.sent();
                if (serviceError_2 instanceof Error && serviceError_2.message === 'CATEGORY_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_2;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.error('Get category by slug error:', error_4);
                res.status(500).json({
                    message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryBySlug = getCategoryBySlug;
/**
 * Tạo danh mục mới
 */
var createCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, thumbnailId, parentId, category, serviceError_3, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                // Kiểm tra req.body tồn tại
                if (!req.body) {
                    res.status(400).json({
                        message: utils_1.CATEGORY_MESSAGES.REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                _a = req.body, title = _a.title, description = _a.description, thumbnailId = _a.thumbnailId, parentId = _a.parentId;
                // Validate các trường bắt buộc
                if (!title) {
                    res.status(400).json({
                        message: utils_1.CATEGORY_MESSAGES.REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.categoryService.createCategory({
                        title: title,
                        description: description,
                        thumbnailId: thumbnailId,
                        parentId: parentId
                    })];
            case 2:
                category = _b.sent();
                res.status(201).json({
                    message: utils_1.CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESS,
                    category: category
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_3 = _b.sent();
                if (serviceError_3 instanceof Error) {
                    switch (serviceError_3.message) {
                        case 'CATEGORY_SLUG_EXISTS':
                            res.status(400).json({
                                message: utils_1.CATEGORY_MESSAGES.CATEGORY_SLUG_EXISTS
                            });
                            return [2 /*return*/];
                        case 'PARENT_CATEGORY_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.CATEGORY_MESSAGES.PARENT_CATEGORY_NOT_FOUND
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_3;
                    }
                }
                throw serviceError_3;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _b.sent();
                console.error('Create category error:', error_5);
                res.status(500).json({
                    message: utils_1.CATEGORY_MESSAGES.CREATE_CATEGORY_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createCategory = createCategory;
/**
 * Cập nhật danh mục
 */
var updateCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, description, thumbnailId, parentId, category, serviceError_4, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = req.params.id;
                // Kiểm tra req.body tồn tại
                if (!req.body) {
                    res.status(400).json({
                        message: utils_1.CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
                    });
                    return [2 /*return*/];
                }
                _a = req.body, title = _a.title, description = _a.description, thumbnailId = _a.thumbnailId, parentId = _a.parentId;
                // Phải có ít nhất một trường để cập nhật
                if (!title && description === undefined && thumbnailId === undefined && parentId === undefined) {
                    res.status(400).json({
                        message: utils_1.CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.categoryService.updateCategory(id, {
                        title: title,
                        description: description,
                        thumbnailId: thumbnailId,
                        parentId: parentId
                    })];
            case 2:
                category = _b.sent();
                res.status(200).json({
                    message: utils_1.CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESS,
                    category: category
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_4 = _b.sent();
                if (serviceError_4 instanceof Error) {
                    switch (serviceError_4.message) {
                        case 'CATEGORY_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'CATEGORY_SLUG_EXISTS':
                            res.status(400).json({
                                message: utils_1.CATEGORY_MESSAGES.CATEGORY_SLUG_EXISTS
                            });
                            return [2 /*return*/];
                        case 'PARENT_CATEGORY_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.CATEGORY_MESSAGES.PARENT_CATEGORY_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'INVALID_PARENT_CATEGORY':
                            res.status(400).json({
                                message: utils_1.CATEGORY_MESSAGES.INVALID_PARENT_CATEGORY
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_4;
                    }
                }
                throw serviceError_4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                console.error('Update category error:', error_6);
                res.status(500).json({
                    message: utils_1.CATEGORY_MESSAGES.UPDATE_CATEGORY_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateCategory = updateCategory;
/**
 * Xóa danh mục
 */
var deleteCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, serviceError_5, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.categoryService.deleteCategory(id)];
            case 2:
                _a.sent();
                res.status(200).json({
                    message: utils_1.CATEGORY_MESSAGES.DELETE_CATEGORY_SUCCESS
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_5 = _a.sent();
                if (serviceError_5 instanceof Error) {
                    switch (serviceError_5.message) {
                        case 'CATEGORY_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'CATEGORY_HAS_CHILDREN':
                            res.status(400).json({
                                message: utils_1.CATEGORY_MESSAGES.CATEGORY_HAS_CHILDREN
                            });
                            return [2 /*return*/];
                        case 'CATEGORY_HAS_POSTS':
                            res.status(400).json({
                                message: utils_1.CATEGORY_MESSAGES.CATEGORY_HAS_POSTS
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_5;
                    }
                }
                throw serviceError_5;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_7 = _a.sent();
                console.error('Delete category error:', error_7);
                res.status(500).json({
                    message: utils_1.CATEGORY_MESSAGES.DELETE_CATEGORY_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
