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
exports.CategoryService = void 0;
var repositories_1 = require("../repositories");
var utils_1 = require("../utils");
var CategoryService = /** @class */ (function () {
    function CategoryService() {
    }
    /**
     * Lấy danh sách danh mục với phân trang
     */
    CategoryService.prototype.getAllCategories = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.categoryRepository.findAllWithPagination(options)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                data: result.data.map(function (category) { return _this.toPublicCategory(category); }),
                                pagination: result.pagination
                            }];
                }
            });
        });
    };
    /**
     * Lấy cấu trúc cây danh mục (chỉ lấy danh mục gốc và con trực tiếp)
     */
    CategoryService.prototype.getCategoryTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rootCategories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.categoryRepository.findAllWithChildren()];
                    case 1:
                        rootCategories = _a.sent();
                        return [2 /*return*/, rootCategories.map(function (category) {
                                var _a;
                                return ({
                                    id: category.id,
                                    title: category.title,
                                    slug: category.slug,
                                    thumbnailId: category.thumbnailId,
                                    description: category.description,
                                    parentId: category.parentId,
                                    createdAt: category.createdAt,
                                    updatedAt: category.updatedAt,
                                    children: (_a = category.children) === null || _a === void 0 ? void 0 : _a.map(function (child) { return ({
                                        id: child.id,
                                        title: child.title,
                                        slug: child.slug,
                                        thumbnailId: child.thumbnailId,
                                        description: child.description,
                                        parentId: child.parentId,
                                        createdAt: child.createdAt,
                                        updatedAt: child.updatedAt
                                    }); })
                                });
                            })];
                }
            });
        });
    };
    /**
     * Lấy thông tin một danh mục kèm danh mục con
     */
    CategoryService.prototype.getCategoryById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var category;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.categoryRepository.getCategoryHierarchy(id)];
                    case 1:
                        category = _a.sent();
                        if (!category) {
                            throw new Error('CATEGORY_NOT_FOUND');
                        }
                        return [2 /*return*/, category];
                }
            });
        });
    };
    /**
     * Lấy thông tin danh mục theo slug
     */
    CategoryService.prototype.getCategoryBySlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var category;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.categoryRepository.findBySlug(slug)];
                    case 1:
                        category = _a.sent();
                        if (!category) {
                            throw new Error('CATEGORY_NOT_FOUND');
                        }
                        return [2 /*return*/, this.toPublicCategory(category)];
                }
            });
        });
    };
    /**
     * Tạo danh mục mới
     */
    CategoryService.prototype.createCategory = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, existingCategory, parentCategory, categoryData, newCategory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = (0, utils_1.slugify)(data.title);
                        return [4 /*yield*/, repositories_1.categoryRepository.findBySlug(slug)];
                    case 1:
                        existingCategory = _a.sent();
                        if (existingCategory) {
                            throw new Error('CATEGORY_SLUG_EXISTS');
                        }
                        if (!data.parentId) return [3 /*break*/, 3];
                        return [4 /*yield*/, repositories_1.categoryRepository.findById(data.parentId)];
                    case 2:
                        parentCategory = _a.sent();
                        if (!parentCategory) {
                            throw new Error('PARENT_CATEGORY_NOT_FOUND');
                        }
                        _a.label = 3;
                    case 3:
                        categoryData = {
                            title: data.title,
                            slug: slug,
                            description: data.description || null,
                            thumbnailId: data.thumbnailId || null,
                            parentId: data.parentId || null
                        };
                        return [4 /*yield*/, repositories_1.categoryRepository.create(categoryData)];
                    case 4:
                        newCategory = _a.sent();
                        return [2 /*return*/, this.toPublicCategory(newCategory)];
                }
            });
        });
    };
    /**
     * Cập nhật danh mục
     */
    CategoryService.prototype.updateCategory = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCategory, updateData, existingSlug, parentCategory, updatedCategory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.categoryRepository.findById(id)];
                    case 1:
                        existingCategory = _a.sent();
                        if (!existingCategory) {
                            throw new Error('CATEGORY_NOT_FOUND');
                        }
                        updateData = {};
                        if (!data.title) return [3 /*break*/, 3];
                        updateData.title = data.title;
                        updateData.slug = (0, utils_1.slugify)(data.title);
                        return [4 /*yield*/, repositories_1.categoryRepository.findBySlug(updateData.slug)];
                    case 2:
                        existingSlug = _a.sent();
                        if (existingSlug && existingSlug.id !== id) {
                            throw new Error('CATEGORY_SLUG_EXISTS');
                        }
                        _a.label = 3;
                    case 3:
                        if (!(data.parentId !== undefined)) return [3 /*break*/, 6];
                        // Không cho phép đặt parent là chính nó
                        if (data.parentId === id) {
                            throw new Error('INVALID_PARENT_CATEGORY');
                        }
                        if (!(data.parentId !== null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, repositories_1.categoryRepository.findById(data.parentId)];
                    case 4:
                        parentCategory = _a.sent();
                        if (!parentCategory) {
                            throw new Error('PARENT_CATEGORY_NOT_FOUND');
                        }
                        _a.label = 5;
                    case 5:
                        updateData.parentId = data.parentId;
                        _a.label = 6;
                    case 6:
                        // Cập nhật các trường khác
                        if (data.description !== undefined)
                            updateData.description = data.description;
                        if (data.thumbnailId !== undefined)
                            updateData.thumbnailId = data.thumbnailId;
                        return [4 /*yield*/, repositories_1.categoryRepository.update(id, updateData)];
                    case 7:
                        updatedCategory = _a.sent();
                        return [2 /*return*/, this.toPublicCategory(updatedCategory)];
                }
            });
        });
    };
    /**
     * Xóa danh mục
     */
    CategoryService.prototype.deleteCategory = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCategory, childCategories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.categoryRepository.findById(id)];
                    case 1:
                        existingCategory = _a.sent();
                        if (!existingCategory) {
                            throw new Error('CATEGORY_NOT_FOUND');
                        }
                        return [4 /*yield*/, repositories_1.categoryRepository.findAllWithPagination({
                                parentId: id
                            })];
                    case 2:
                        childCategories = _a.sent();
                        if (childCategories.data.length > 0) {
                            throw new Error('CATEGORY_HAS_CHILDREN');
                        }
                        return [4 /*yield*/, repositories_1.categoryRepository.delete(id)];
                    case 3: 
                    // TODO: Kiểm tra xem danh mục có bài viết không (nếu cần)
                    // Xóa danh mục (soft delete)
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Chuyển đổi danh mục sang định dạng public
     */
    CategoryService.prototype.toPublicCategory = function (category) {
        return {
            id: category.id,
            title: category.title,
            slug: category.slug,
            thumbnailId: category.thumbnailId,
            description: category.description,
            parentId: category.parentId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    };
    return CategoryService;
}());
exports.CategoryService = CategoryService;
