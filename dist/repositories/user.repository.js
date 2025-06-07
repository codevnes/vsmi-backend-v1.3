"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const app_1 = require("../app");
class UserRepository {
    async findById(id) {
        return await app_1.prisma.user.findUnique({
            where: { id }
        });
    }
    async findByEmail(email) {
        return await app_1.prisma.user.findUnique({
            where: { email }
        });
    }
    async findAll() {
        return await app_1.prisma.user.findMany({
            where: { deletedAt: null }
        });
    }
    async findAllWithPagination(options) {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', role, verified } = options;
        // Tính toán skip cho phân trang
        const skip = (page - 1) * limit;
        // Xây dựng điều kiện where
        const where = {
            deletedAt: null
        };
        // Thêm điều kiện tìm kiếm
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        // Thêm điều kiện lọc theo role
        if (role) {
            where.role = role;
        }
        // Thêm điều kiện lọc theo verified
        if (verified !== undefined) {
            where.verified = verified;
        }
        // Đếm tổng số bản ghi
        const totalItems = await app_1.prisma.user.count({ where });
        // Lấy dữ liệu với phân trang
        const users = await app_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sort]: order
            }
        });
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data: users,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }
    async create(data) {
        return await app_1.prisma.user.create({
            data: {
                ...data,
                role: data.role || client_1.Role.USER
            }
        });
    }
    async update(id, data) {
        return await app_1.prisma.user.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await app_1.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return true;
    }
    async getUserProfile(id) {
        const user = await app_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                verified: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    }
}
exports.UserRepository = UserRepository;
