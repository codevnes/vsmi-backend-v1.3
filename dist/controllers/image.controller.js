"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.updateImage = exports.uploadImage = exports.getImageById = exports.getAllImages = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * Lấy danh sách hình ảnh với phân trang
 */
const getAllImages = async (req, res) => {
    try {
        // Trích xuất các tham số phân trang từ query
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const search = req.query.search || '';
        // Validate page và limit
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            res.status(400).json({
                message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
            });
            return;
        }
        // Gọi service với các tham số phân trang
        const result = await services_1.imageService.getAllImages({
            page,
            limit,
            sort,
            order,
            search
        });
        res.status(200).json({
            message: utils_1.IMAGE_MESSAGES.GET_IMAGES_SUCCESS,
            images: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('Get all images error:', error);
        res.status(500).json({
            message: utils_1.IMAGE_MESSAGES.GET_IMAGES_ERROR
        });
    }
};
exports.getAllImages = getAllImages;
/**
 * Lấy thông tin hình ảnh theo ID
 */
const getImageById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
            });
            return;
        }
        try {
            const image = await services_1.imageService.getImageById(id);
            res.status(200).json({
                message: utils_1.IMAGE_MESSAGES.GET_IMAGE_SUCCESS,
                image
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'IMAGE_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.IMAGE_MESSAGES.IMAGE_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Get image by ID error:', error);
        res.status(500).json({
            message: utils_1.IMAGE_MESSAGES.GET_IMAGES_ERROR
        });
    }
};
exports.getImageById = getImageById;
/**
 * Upload hình ảnh mới
 */
const uploadImage = async (req, res) => {
    try {
        // middleware đã kiểm tra file trong request
        const file = req.file;
        const { altText } = req.body;
        try {
            const image = await services_1.imageService.uploadImage(file, altText);
            res.status(201).json({
                message: utils_1.IMAGE_MESSAGES.UPLOAD_IMAGE_SUCCESS,
                image
            });
        }
        catch (error) {
            console.error('Upload image error:', error);
            res.status(500).json({
                message: utils_1.IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
            });
        }
    }
    catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({
            message: utils_1.IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
        });
    }
};
exports.uploadImage = uploadImage;
/**
 * Cập nhật thông tin hình ảnh (chỉ cho phép cập nhật altText)
 */
const updateImage = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
            });
            return;
        }
        const { altText } = req.body;
        try {
            const image = await services_1.imageService.updateImage(id, { altText });
            res.status(200).json({
                message: utils_1.IMAGE_MESSAGES.UPDATE_IMAGE_SUCCESS,
                image
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'IMAGE_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.IMAGE_MESSAGES.IMAGE_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Update image error:', error);
        res.status(500).json({
            message: utils_1.IMAGE_MESSAGES.UPDATE_IMAGE_ERROR
        });
    }
};
exports.updateImage = updateImage;
/**
 * Xóa hình ảnh
 */
const deleteImage = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
            });
            return;
        }
        try {
            await services_1.imageService.deleteImage(id);
            res.status(200).json({
                message: utils_1.IMAGE_MESSAGES.DELETE_IMAGE_SUCCESS
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                switch (serviceError.message) {
                    case 'IMAGE_NOT_FOUND':
                        res.status(404).json({
                            message: utils_1.IMAGE_MESSAGES.IMAGE_NOT_FOUND
                        });
                        return;
                    case 'IMAGE_IN_USE':
                        res.status(400).json({
                            message: utils_1.IMAGE_MESSAGES.IMAGE_IN_USE
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
        console.error('Delete image error:', error);
        res.status(500).json({
            message: utils_1.IMAGE_MESSAGES.DELETE_IMAGE_ERROR
        });
    }
};
exports.deleteImage = deleteImage;
