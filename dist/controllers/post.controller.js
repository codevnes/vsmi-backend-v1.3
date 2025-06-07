"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.restorePost = exports.softDeletePost = exports.updatePost = exports.createPost = exports.getPostBySlug = exports.getPostById = exports.getAllPosts = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * Lấy danh sách bài viết với phân trang
 */
const getAllPosts = async (req, res) => {
    try {
        // Trích xuất các tham số từ query
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const search = req.query.search || '';
        const categoryId = req.query.categoryId;
        const symbol = req.query.symbol;
        const userId = req.query.userId;
        const isPremium = req.query.isPremium ? req.query.isPremium === 'true' : undefined;
        // Validate page và limit
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.INVALID_POST_DATA
            });
            return;
        }
        // Gọi service với các tham số
        const result = await services_1.postService.getAllPosts({
            page,
            limit,
            sort,
            order,
            search,
            categoryId,
            symbol,
            userId,
            isPremium
        });
        res.status(200).json({
            message: utils_1.POST_MESSAGES.GET_POSTS_SUCCESS,
            posts: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.GET_POSTS_ERROR
        });
    }
};
exports.getAllPosts = getAllPosts;
/**
 * Lấy thông tin bài viết theo ID
 */
const getPostById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.INVALID_POST_DATA
            });
            return;
        }
        try {
            const post = await services_1.postService.getPostById(id);
            res.status(200).json({
                message: utils_1.POST_MESSAGES.GET_POST_SUCCESS,
                post
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'POST_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Get post by ID error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.GET_POSTS_ERROR
        });
    }
};
exports.getPostById = getPostById;
/**
 * Lấy thông tin bài viết theo slug
 */
const getPostBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.INVALID_POST_DATA
            });
            return;
        }
        try {
            const post = await services_1.postService.getPostBySlug(slug);
            res.status(200).json({
                message: utils_1.POST_MESSAGES.GET_POST_SUCCESS,
                post
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'POST_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Get post by slug error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.GET_POSTS_ERROR
        });
    }
};
exports.getPostBySlug = getPostBySlug;
/**
 * Tạo bài viết mới
 */
const createPost = async (req, res) => {
    try {
        const { title, description, content, thumbnailId, categoryId, symbol, isPremium } = req.body;
        const userId = req.user?.id;
        if (!title || !categoryId || !userId) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.REQUIRED_FIELDS
            });
            return;
        }
        try {
            const post = await services_1.postService.createPost({
                title,
                description,
                content,
                thumbnailId: thumbnailId ? parseInt(thumbnailId) : undefined,
                categoryId,
                symbol,
                userId,
                isPremium
            });
            res.status(201).json({
                message: utils_1.POST_MESSAGES.CREATE_POST_SUCCESS,
                post
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'CATEGORY_NOT_FOUND':
                        res.status(400).json({
                            message: utils_1.POST_MESSAGES.CATEGORY_NOT_FOUND
                        });
                        return;
                    case 'STOCK_NOT_FOUND':
                        res.status(400).json({
                            message: utils_1.POST_MESSAGES.STOCK_NOT_FOUND
                        });
                        return;
                    case 'IMAGE_NOT_FOUND':
                        res.status(400).json({
                            message: utils_1.POST_MESSAGES.IMAGE_NOT_FOUND
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
        console.error('Create post error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.CREATE_POST_ERROR
        });
    }
};
exports.createPost = createPost;
/**
 * Cập nhật bài viết
 */
const updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        const { title, description, content, thumbnailId, categoryId, symbol, isPremium } = req.body;
        if (!id) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.INVALID_POST_DATA
            });
            return;
        }
        try {
            const post = await services_1.postService.updatePost(id, userId, {
                title,
                description,
                content,
                thumbnailId: thumbnailId ? parseInt(thumbnailId) : undefined,
                categoryId,
                symbol,
                isPremium
            });
            res.status(200).json({
                message: utils_1.POST_MESSAGES.UPDATE_POST_SUCCESS,
                post
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'POST_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                        });
                        return;
                    case 'UNAUTHORIZED':
                        res.status(403).json({
                            message: utils_1.POST_MESSAGES.UNAUTHORIZED
                        });
                        return;
                    case 'CATEGORY_NOT_FOUND':
                        res.status(400).json({
                            message: utils_1.POST_MESSAGES.CATEGORY_NOT_FOUND
                        });
                        return;
                    case 'STOCK_NOT_FOUND':
                        res.status(400).json({
                            message: utils_1.POST_MESSAGES.STOCK_NOT_FOUND
                        });
                        return;
                    case 'IMAGE_NOT_FOUND':
                        res.status(400).json({
                            message: utils_1.POST_MESSAGES.IMAGE_NOT_FOUND
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
        console.error('Update post error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.UPDATE_POST_ERROR
        });
    }
};
exports.updatePost = updatePost;
/**
 * Xóa mềm bài viết
 */
const softDeletePost = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        if (!id) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.INVALID_POST_DATA
            });
            return;
        }
        try {
            await services_1.postService.softDeletePost(id, userId);
            res.status(200).json({
                message: utils_1.POST_MESSAGES.DELETE_POST_SUCCESS
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'POST_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                        });
                        return;
                    case 'UNAUTHORIZED':
                        res.status(403).json({
                            message: utils_1.POST_MESSAGES.UNAUTHORIZED
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
        console.error('Delete post error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.DELETE_POST_ERROR
        });
    }
};
exports.softDeletePost = softDeletePost;
/**
 * Khôi phục bài viết đã xóa
 */
const restorePost = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        if (!id) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.INVALID_POST_DATA
            });
            return;
        }
        try {
            const post = await services_1.postService.restorePost(id, userId);
            res.status(200).json({
                message: utils_1.POST_MESSAGES.UPDATE_POST_SUCCESS,
                post
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'POST_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                        });
                        return;
                    case 'UNAUTHORIZED':
                        res.status(403).json({
                            message: utils_1.POST_MESSAGES.UNAUTHORIZED
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
        console.error('Restore post error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.UPDATE_POST_ERROR
        });
    }
};
exports.restorePost = restorePost;
/**
 * Xóa vĩnh viễn bài viết (chỉ admin)
 */
const deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        if (!id) {
            res.status(400).json({
                message: utils_1.POST_MESSAGES.INVALID_POST_DATA
            });
            return;
        }
        try {
            await services_1.postService.deletePost(id, userId);
            res.status(200).json({
                message: utils_1.POST_MESSAGES.DELETE_POST_SUCCESS
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'POST_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.POST_MESSAGES.POST_NOT_FOUND
                        });
                        return;
                    case 'UNAUTHORIZED':
                        res.status(403).json({
                            message: utils_1.POST_MESSAGES.UNAUTHORIZED
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
        console.error('Delete post permanently error:', error);
        res.status(500).json({
            message: utils_1.POST_MESSAGES.DELETE_POST_ERROR
        });
    }
};
exports.deletePost = deletePost;
