"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const repositories_1 = require("../repositories");
class UserService {
    /**
     * Lấy danh sách người dùng không phân trang (đã cũ)
     */
    async getAllUsers() {
        const users = await repositories_1.userRepository.findAll();
        return users.map(user => this.toPublicUser(user));
    }
    /**
     * Lấy danh sách người dùng với phân trang
     */
    async getUsersWithPagination(options) {
        const result = await repositories_1.userRepository.findAllWithPagination(options);
        return {
            data: result.data.map(user => this.toPublicUser(user)),
            pagination: result.pagination
        };
    }
    /**
     * Lấy thông tin một người dùng
     */
    async getUserById(id) {
        const user = await repositories_1.userRepository.findById(id);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return this.toPublicUser(user);
    }
    /**
     * Tạo người dùng mới
     */
    async createUser(data) {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await repositories_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('EMAIL_IN_USE');
        }
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        // Tạo dữ liệu người dùng mới
        const userData = {
            email: data.email,
            fullName: data.fullName,
            password: hashedPassword,
            phone: data.phone || null,
            role: data.role || client_1.Role.USER,
        };
        // Tạo người dùng mới
        const newUser = await repositories_1.userRepository.create(userData);
        return this.toPublicUser(newUser);
    }
    /**
     * Cập nhật thông tin người dùng
     */
    async updateUser(id, data) {
        // Kiểm tra người dùng tồn tại
        const existingUser = await repositories_1.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('USER_NOT_FOUND');
        }
        // Chuẩn bị dữ liệu cập nhật
        const updateData = {};
        if (data.fullName)
            updateData.fullName = data.fullName;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.role)
            updateData.role = data.role;
        // Mã hóa mật khẩu nếu được cung cấp
        if (data.password) {
            updateData.password = await bcrypt_1.default.hash(data.password, 10);
        }
        // Cập nhật người dùng
        const updatedUser = await repositories_1.userRepository.update(id, updateData);
        return this.toPublicUser(updatedUser);
    }
    /**
     * Xóa người dùng
     */
    async deleteUser(id) {
        // Kiểm tra người dùng tồn tại
        const existingUser = await repositories_1.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('USER_NOT_FOUND');
        }
        // Xóa người dùng
        return await repositories_1.userRepository.delete(id);
    }
    /**
     * Chuyển đổi thông tin người dùng để trả về cho client
     */
    toPublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
            verified: user.verified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.UserService = UserService;
