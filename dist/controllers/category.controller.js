"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategoryById = exports.getCategoryTree = exports.getAllCategories = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * Lấy danh sách danh mục với phân trang và tìm kiếm
 */
const getAllCategories = async (req, res) => {
    try {
        // Trích xuất các tham số phân trang từ query
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const search = req.query.search || '';
        const parentId = req.query.parentId === 'null'
            ? null
            : req.query.parentId;
        // Validate page và limit
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            res.status(400).json({
                message: utils_1.CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
            });
            return;
        }
        // Gọi service với các tham số phân trang
        const result = await services_1.categoryService.getAllCategories({
            page,
            limit,
            sort,
            order,
            search,
            parentId
        });
        res.status(200).json({
            message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
            categories: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({
            message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
        });
    }
};
exports.getAllCategories = getAllCategories;
/**
 * Lấy cấu trúc cây danh mục
 */
const getCategoryTree = async (req, res) => {
    try {
        const categories = await services_1.categoryService.getCategoryTree();
        res.status(200).json({
            message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
            categories
        });
    }
    catch (error) {
        console.error('Get category tree error:', error);
        res.status(500).json({
            message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
        });
    }
};
exports.getCategoryTree = getCategoryTree;
/**
 * Lấy thông tin danh mục theo ID kèm danh mục con
 */
const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        try {
            const category = await services_1.categoryService.getCategoryById(id);
            res.status(200).json({
                message: utils_1.CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
                category
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'CATEGORY_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Get category by ID error:', error);
        res.status(500).json({
            message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
        });
    }
};
exports.getCategoryById = getCategoryById;
/**
 * Lấy thông tin danh mục theo slug
 */
const getCategoryBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        try {
            const category = await services_1.categoryService.getCategoryBySlug(slug);
            res.status(200).json({
                message: utils_1.CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
                category
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'CATEGORY_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Get category by slug error:', error);
        res.status(500).json({
            message: utils_1.CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
        });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
/**
 * Tạo danh mục mới
 */
const createCategory = async (req, res) => {
    try {
        // Kiểm tra req.body tồn tại
        if (!req.body) {
            res.status(400).json({
                message: utils_1.CATEGORY_MESSAGES.REQUIRED_FIELDS
            });
            return;
        }
        const { title, description, thumbnailId, parentId } = req.body;
        // Validate các trường bắt buộc
        if (!title) {
            res.status(400).json({
                message: utils_1.CATEGORY_MESSAGES.REQUIRED_FIELDS
            });
            return;
        }
        try {
            const category = await services_1.categoryService.createCategory({
                title,
                description,
                thumbnailId,
                parentId
            });
            res.status(201).json({
                message: utils_1.CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESS,
                category
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'CATEGORY_SLUG_EXISTS':
                        res.status(400).json({
                            message: utils_1.CATEGORY_MESSAGES.CATEGORY_SLUG_EXISTS
                        });
                        return;
                    case 'PARENT_CATEGORY_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.CATEGORY_MESSAGES.PARENT_CATEGORY_NOT_FOUND
                        });
                        return;
                    default:
                        throw serviceError;
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            message: utils_1.CATEGORY_MESSAGES.CREATE_CATEGORY_ERROR
        });
    }
};
exports.createCategory = createCategory;
/**
 * Cập nhật danh mục
 */
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        // Kiểm tra req.body tồn tại
        if (!req.body) {
            res.status(400).json({
                message: utils_1.CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
            });
            return;
        }
        const { title, description, thumbnailId, parentId } = req.body;
        // Phải có ít nhất một trường để cập nhật
        if (!title && description === undefined && thumbnailId === undefined && parentId === undefined) {
            res.status(400).json({
                message: utils_1.CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
            });
            return;
        }
        try {
            const category = await services_1.categoryService.updateCategory(id, {
                title,
                description,
                thumbnailId,
                parentId
            });
            res.status(200).json({
                message: utils_1.CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESS,
                category
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'CATEGORY_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                        });
                        return;
                    case 'CATEGORY_SLUG_EXISTS':
                        res.status(400).json({
                            message: utils_1.CATEGORY_MESSAGES.CATEGORY_SLUG_EXISTS
                        });
                        return;
                    case 'PARENT_CATEGORY_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.CATEGORY_MESSAGES.PARENT_CATEGORY_NOT_FOUND
                        });
                        return;
                    case 'INVALID_PARENT_CATEGORY':
                        res.status(400).json({
                            message: utils_1.CATEGORY_MESSAGES.INVALID_PARENT_CATEGORY
                        });
                        return;
                    default:
                        throw serviceError;
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            message: utils_1.CATEGORY_MESSAGES.UPDATE_CATEGORY_ERROR
        });
    }
};
exports.updateCategory = updateCategory;
/**
 * Xóa danh mục
 */
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        try {
            await services_1.categoryService.deleteCategory(id);
            res.status(200).json({
                message: utils_1.CATEGORY_MESSAGES.DELETE_CATEGORY_SUCCESS
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'CATEGORY_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
                        });
                        return;
                    case 'CATEGORY_HAS_CHILDREN':
                        res.status(400).json({
                            message: utils_1.CATEGORY_MESSAGES.CATEGORY_HAS_CHILDREN
                        });
                        return;
                    case 'CATEGORY_HAS_POSTS':
                        res.status(400).json({
                            message: utils_1.CATEGORY_MESSAGES.CATEGORY_HAS_POSTS
                        });
                        return;
                    default:
                        throw serviceError;
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            message: utils_1.CATEGORY_MESSAGES.DELETE_CATEGORY_ERROR
        });
    }
};
exports.deleteCategory = deleteCategory;
