"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRepository = void 0;
const app_1 = require("../app");
class ImageRepository {
    async findById(id) {
        return await app_1.prisma.image.findUnique({
            where: { id }
        });
    }
    async findByUrl(url) {
        return await app_1.prisma.image.findUnique({
            where: { url }
        });
    }
    async findAll() {
        return await app_1.prisma.image.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findAllWithPagination(options) {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '' } = options;
        // Tính toán skip cho phân trang
        const skip = (page - 1) * limit;
        // Xây dựng điều kiện where
        const where = {};
        // Thêm điều kiện tìm kiếm
        if (search) {
            where.OR = [
                { filename: { contains: search, mode: 'insensitive' } },
                { altText: { contains: search, mode: 'insensitive' } }
            ];
        }
        // Đếm tổng số bản ghi
        const totalItems = await app_1.prisma.image.count({ where });
        // Lấy dữ liệu với phân trang
        const images = await app_1.prisma.image.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sort]: order
            }
        });
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data: images,
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
        return await app_1.prisma.image.create({
            data
        });
    }
    async update(id, data) {
        return await app_1.prisma.image.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await app_1.prisma.image.delete({
            where: { id }
        });
        return true;
    }
    async isImageInUse(id) {
        // Kiểm tra hình ảnh có được sử dụng trong bảng users
        const userCount = await app_1.prisma.user.count({
            where: { thumbnailId: id }
        });
        if (userCount > 0)
            return true;
        // Kiểm tra hình ảnh có được sử dụng trong bảng categories
        const categoryCount = await app_1.prisma.category.count({
            where: { thumbnailId: id }
        });
        if (categoryCount > 0)
            return true;
        // Kiểm tra hình ảnh có được sử dụng trong bảng posts
        const postCount = await app_1.prisma.post.count({
            where: { thumbnailId: id }
        });
        if (postCount > 0)
            return true;
        // Không được sử dụng trong bảng nào
        return false;
    }
}
exports.ImageRepository = ImageRepository;
