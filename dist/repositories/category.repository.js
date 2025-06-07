"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const app_1 = require("../app");
class CategoryRepository {
    async findById(id) {
        return await app_1.prisma.category.findUnique({
            where: { id }
        });
    }
    async findBySlug(slug) {
        return await app_1.prisma.category.findUnique({
            where: { slug }
        });
    }
    async findAll() {
        return await app_1.prisma.category.findMany({
            where: { deletedAt: null }
        });
    }
    async findAllWithPagination(options) {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', parentId } = options;
        // Tính toán skip cho phân trang
        const skip = (page - 1) * limit;
        // Xây dựng điều kiện where
        const where = {
            deletedAt: null
        };
        // Thêm điều kiện tìm kiếm
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        // Lọc theo parent nếu có
        if (parentId !== undefined) {
            where.parentId = parentId;
        }
        // Đếm tổng số bản ghi
        const totalItems = await app_1.prisma.category.count({ where });
        // Lấy dữ liệu với phân trang
        const categories = await app_1.prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sort]: order
            }
        });
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data: categories,
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
    async findAllWithChildren() {
        // Lấy các danh mục gốc (không có parentId)
        const rootCategories = await app_1.prisma.category.findMany({
            where: {
                deletedAt: null,
                parentId: null
            },
            include: {
                children: {
                    where: { deletedAt: null }
                }
            }
        });
        return rootCategories;
    }
    async getCategoryHierarchy(id) {
        // Lấy danh mục theo id
        const category = await app_1.prisma.category.findUnique({
            where: { id },
            include: {
                children: {
                    where: { deletedAt: null }
                }
            }
        });
        if (!category) {
            return null;
        }
        // Chuyển đổi sang public model
        const result = {
            id: category.id,
            title: category.title,
            slug: category.slug,
            thumbnailId: category.thumbnailId,
            description: category.description,
            parentId: category.parentId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            children: category.children.map(child => ({
                id: child.id,
                title: child.title,
                slug: child.slug,
                thumbnailId: child.thumbnailId,
                description: child.description,
                parentId: child.parentId,
                createdAt: child.createdAt,
                updatedAt: child.updatedAt
            }))
        };
        return result;
    }
    async create(data) {
        return await app_1.prisma.category.create({
            data
        });
    }
    async update(id, data) {
        return await app_1.prisma.category.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await app_1.prisma.category.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return true;
    }
}
exports.CategoryRepository = CategoryRepository;
