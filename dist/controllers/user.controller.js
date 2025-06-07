"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * Lấy danh sách người dùng với phân trang và tìm kiếm
 */
const getAllUsers = async (req, res) => {
    try {
        // Trích xuất các tham số phân trang từ query
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const search = req.query.search || '';
        const role = req.query.role;
        const verified = req.query.verified
            ? req.query.verified === 'true'
            : undefined;
        // Validate page và limit
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.INVALID_PAGINATION
            });
            return;
        }
        // Gọi service với các tham số phân trang
        const result = await services_1.userService.getUsersWithPagination({
            page,
            limit,
            sort,
            order,
            search,
            role,
            verified
        });
        res.status(200).json({
            message: utils_1.USER_MESSAGES.GET_USERS_SUCCESS,
            users: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            message: utils_1.USER_MESSAGES.GET_USERS_ERROR
        });
    }
};
exports.getAllUsers = getAllUsers;
/**
 * Lấy thông tin người dùng theo ID
 */
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        try {
            const user = await services_1.userService.getUserById(id);
            res.status(200).json({
                message: utils_1.USER_MESSAGES.GET_USER_SUCCESS,
                user
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.USER_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            message: utils_1.USER_MESSAGES.GET_USERS_ERROR
        });
    }
};
exports.getUserById = getUserById;
/**
 * Tạo người dùng mới
 */
const createUser = async (req, res) => {
    try {
        // Kiểm tra req.body tồn tại
        if (!req.body) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.REQUIRED_FIELDS
            });
            return;
        }
        const { email, password, fullName, phone, role } = req.body;
        // Validate các trường bắt buộc
        if (!email || !password || !fullName) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.REQUIRED_FIELDS
            });
            return;
        }
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.INVALID_USER_DATA
            });
            return;
        }
        // Validate mật khẩu
        if (password.length < 6) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.INVALID_USER_DATA
            });
            return;
        }
        try {
            const user = await services_1.userService.createUser({
                email,
                password,
                fullName,
                phone,
                role: role
            });
            res.status(201).json({
                message: utils_1.USER_MESSAGES.CREATE_USER_SUCCESS,
                user
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'EMAIL_IN_USE') {
                res.status(400).json({
                    message: utils_1.USER_MESSAGES.EMAIL_IN_USE
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            message: utils_1.USER_MESSAGES.CREATE_USER_ERROR
        });
    }
};
exports.createUser = createUser;
/**
 * Cập nhật thông tin người dùng
 */
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        // Kiểm tra req.body tồn tại
        if (!req.body) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.INVALID_USER_DATA
            });
            return;
        }
        const { fullName, phone, password, role } = req.body;
        // Phải có ít nhất một trường để cập nhật
        if (!fullName && phone === undefined && !password && !role) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.INVALID_USER_DATA
            });
            return;
        }
        try {
            const user = await services_1.userService.updateUser(id, {
                fullName,
                phone,
                password,
                role: role
            });
            res.status(200).json({
                message: utils_1.USER_MESSAGES.UPDATE_USER_SUCCESS,
                user
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.USER_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            message: utils_1.USER_MESSAGES.UPDATE_USER_ERROR
        });
    }
};
exports.updateUser = updateUser;
/**
 * Xóa người dùng
 */
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        // Kiểm tra không cho phép xóa chính mình
        if (req.userId === id) {
            res.status(400).json({
                message: utils_1.USER_MESSAGES.CANNOT_DELETE_SELF
            });
            return;
        }
        try {
            await services_1.userService.deleteUser(id);
            res.status(200).json({
                message: utils_1.USER_MESSAGES.DELETE_USER_SUCCESS
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.USER_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: utils_1.USER_MESSAGES.DELETE_USER_ERROR
        });
    }
};
exports.deleteUser = deleteUser;
