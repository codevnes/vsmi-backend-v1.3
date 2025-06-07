"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const repositories_1 = require("../repositories");
const client_1 = require("@prisma/client");
class AuthService {
    /**
     * Đăng ký người dùng mới
     */
    async register(data) {
        // Check if user already exists
        const existingUser = await repositories_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('EMAIL_IN_USE');
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        // Create new user
        const userData = {
            email: data.email,
            fullName: data.fullName,
            password: hashedPassword,
            phone: data.phone || null,
            role: client_1.Role.USER,
        };
        const newUser = await repositories_1.userRepository.create(userData);
        // Generate token
        const token = this.generateToken(newUser.id, newUser.role);
        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                fullName: newUser.fullName,
                role: newUser.role,
            },
            token,
        };
    }
    /**
     * Đăng nhập người dùng
     */
    async login(data) {
        // Find user
        const user = await repositories_1.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('ACCOUNT_NOT_FOUND');
        }
        // Verify password
        const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('INVALID_PASSWORD');
        }
        // Generate token
        const token = this.generateToken(user.id, user.role);
        const refreshToken = this.generateRefreshToken(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
            token,
            refreshToken,
        };
    }
    /**
     * Làm mới token
     */
    async refreshToken(token) {
        try {
            // Verify refresh token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.authConfig.jwtSecret);
            // Find user
            const user = await repositories_1.userRepository.findById(decoded.id);
            if (!user) {
                throw new Error('USER_NOT_FOUND');
            }
            // Generate new access token
            const newToken = this.generateToken(user.id, user.role);
            return { token: newToken };
        }
        catch (error) {
            throw new Error('REFRESH_TOKEN_INVALID');
        }
    }
    /**
     * Lấy thông tin người dùng
     */
    async getProfile(userId) {
        const user = await repositories_1.userRepository.getUserProfile(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return { user };
    }
    /**
     * Tạo JWT token
     */
    generateToken(userId, role) {
        return jsonwebtoken_1.default.sign({ id: userId, role }, config_1.authConfig.jwtSecret, { expiresIn: config_1.authConfig.jwtExpiration });
    }
    /**
     * Tạo refresh token
     */
    generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, config_1.authConfig.jwtSecret, { expiresIn: config_1.authConfig.jwtRefreshExpiration });
    }
}
exports.AuthService = AuthService;
