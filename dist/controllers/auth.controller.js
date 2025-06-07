"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.refreshToken = exports.login = exports.register = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const register = async (req, res) => {
    try {
        // Kiểm tra req.body tồn tại
        if (!req.body) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.REQUIRED_FIELDS
            });
            return;
        }
        const { email, password, fullName, phone } = req.body;
        // Validate required fields
        if (!email || !password || !fullName) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.REQUIRED_FIELDS
            });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.INVALID_EMAIL
            });
            return;
        }
        // Validate password strength
        if (password.length < 6) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.WEAK_PASSWORD
            });
            return;
        }
        // Gọi service để đăng ký
        const result = await services_1.authService.register({ email, password, fullName, phone });
        // Trả về kết quả
        res.status(201).json({
            message: utils_1.AUTH_MESSAGES.REGISTRATION_SUCCESS,
            ...result
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        // Xử lý từng loại lỗi cụ thể
        if (error instanceof Error && error.message === 'EMAIL_IN_USE') {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.EMAIL_IN_USE
            });
            return;
        }
        res.status(500).json({
            message: utils_1.AUTH_MESSAGES.REGISTRATION_FAILED
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        // Kiểm tra req.body tồn tại
        if (!req.body) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.LOGIN_REQUIRED_FIELDS
            });
            return;
        }
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.LOGIN_REQUIRED_FIELDS
            });
            return;
        }
        // Gọi service để đăng nhập
        try {
            const result = await services_1.authService.login({ email, password });
            res.status(200).json({
                message: utils_1.AUTH_MESSAGES.LOGIN_SUCCESS,
                ...result
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                if (serviceError.message === 'ACCOUNT_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.AUTH_MESSAGES.ACCOUNT_NOT_FOUND
                    });
                    return;
                }
                if (serviceError.message === 'INVALID_PASSWORD') {
                    res.status(401).json({
                        message: utils_1.AUTH_MESSAGES.INVALID_PASSWORD
                    });
                    return;
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: utils_1.AUTH_MESSAGES.LOGIN_FAILED
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        // Kiểm tra req.body tồn tại
        if (!req.body) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED
            });
            return;
        }
        const { refreshToken: token } = req.body;
        if (!token) {
            res.status(400).json({
                message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED
            });
            return;
        }
        try {
            const result = await services_1.authService.refreshToken(token);
            res.status(200).json({
                message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS,
                ...result
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                if (serviceError.message === 'USER_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.AUTH_MESSAGES.USER_NOT_FOUND
                    });
                    return;
                }
                if (serviceError.message === 'REFRESH_TOKEN_INVALID') {
                    res.status(401).json({
                        message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_INVALID
                    });
                    return;
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            message: utils_1.AUTH_MESSAGES.SYSTEM_ERROR
        });
    }
};
exports.refreshToken = refreshToken;
const getProfile = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({
                message: utils_1.AUTH_MESSAGES.UNAUTHORIZED
            });
            return;
        }
        try {
            const result = await services_1.authService.getProfile(req.userId);
            res.status(200).json({
                message: utils_1.AUTH_MESSAGES.PROFILE_SUCCESS,
                ...result
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
                res.status(404).json({
                    message: utils_1.AUTH_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: utils_1.AUTH_MESSAGES.PROFILE_ERROR
        });
    }
};
exports.getProfile = getProfile;
