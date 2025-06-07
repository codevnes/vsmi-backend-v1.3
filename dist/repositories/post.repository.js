"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const app_1 = require("../app");
const slugify_1 = __importDefault(require("slugify"));
class PostRepository {
    /**
     * Tìm tất cả bài viết với phân trang và tìm kiếm
     */
    async findAllWithPagination(options) {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search, categoryId, userId, symbol, isPremium } = options;
        // Tính toán offset cho phân trang
        const skip = (page - 1) * limit;
        // Xây dựng điều kiện tìm kiếm
        const where = {
            deletedAt: null,
        };
        // Áp dụng bộ lọc nếu có
        if (categoryId)
            where.categoryId = categoryId;
        if (userId)
            where.userId = userId;
        if (symbol)
            where.symbol = symbol;
        if (isPremium !== undefined)
            where.isPremium = isPremium;
        // Tìm kiếm theo từ khóa nếu có
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        // Đếm tổng số bài viết thỏa mãn điều kiện
        const total = await app_1.prisma.post.count({ where });
        // Lấy danh sách bài viết
        const posts = await app_1.prisma.post.findMany({
            where,
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                isPremium: true,
                createdAt: true,
                updatedAt: true,
                categoryId: true,
                symbol: true,
                userId: true,
                thumbnailId: true,
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                stock: {
                    select: {
                        symbol: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                thumbnail: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            },
            skip,
            take: limit,
            orderBy: { [sort]: order }
        });
        // Tính toán thông tin phân trang
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        return {
            data: posts,
            pagination: {
                page: page,
                limit: limit,
                totalItems: total,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        };
    }
    /**
     * Tìm bài viết theo ID
     */
    async findById(id) {
        return app_1.prisma.post.findFirst({
            where: {
                id,
                deletedAt: null
            },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                stock: {
                    select: {
                        symbol: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                thumbnail: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            }
        });
    }
    /**
     * Tìm bài viết theo slug
     */
    async findBySlug(slug) {
        return app_1.prisma.post.findFirst({
            where: {
                slug,
                deletedAt: null
            },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                stock: {
                    select: {
                        symbol: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                thumbnail: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            }
        });
    }
    /**
     * Kiểm tra xem slug đã tồn tại hay chưa
     */
    async isSlugExist(slug, excludeId) {
        const count = await app_1.prisma.post.count({
            where: {
                slug,
                id: excludeId ? { not: excludeId } : undefined,
                deletedAt: null
            }
        });
        return count > 0;
    }
    /**
     * Tạo bài viết mới
     */
    async create(data) {
        // Tạo slug từ tiêu đề
        let slug = (0, slugify_1.default)(data.title, { lower: true, strict: true });
        // Kiểm tra xem slug có bị trùng không
        const isExist = await this.isSlugExist(slug);
        // Nếu slug đã tồn tại, thêm timestamp để tránh trùng lặp
        if (isExist) {
            slug = `${slug}-${Date.now()}`;
        }
        return app_1.prisma.post.create({
            data: {
                ...data,
                slug
            },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                stock: {
                    select: {
                        symbol: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                thumbnail: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            }
        });
    }
    /**
     * Cập nhật bài viết
     */
    async update(id, data) {
        // Nếu cập nhật tiêu đề, tạo slug mới
        let slug = undefined;
        if (data.title) {
            slug = (0, slugify_1.default)(data.title, { lower: true, strict: true });
            // Kiểm tra xem slug có bị trùng không (ngoại trừ bài viết hiện tại)
            const isExist = await this.isSlugExist(slug, id);
            // Nếu slug đã tồn tại, thêm timestamp để tránh trùng lặp
            if (isExist) {
                slug = `${slug}-${Date.now()}`;
            }
        }
        return app_1.prisma.post.update({
            where: { id },
            data: {
                ...data,
                slug: slug ? slug : undefined,
                updatedAt: new Date()
            },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                stock: {
                    select: {
                        symbol: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                thumbnail: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            }
        });
    }
    /**
     * Xóa mềm bài viết
     */
    async softDelete(id) {
        await app_1.prisma.post.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return true;
    }
    /**
     * Khôi phục bài viết đã xóa mềm
     */
    async restore(id) {
        return app_1.prisma.post.update({
            where: { id },
            data: { deletedAt: null }
        });
    }
    /**
     * Xóa vĩnh viễn bài viết
     */
    async delete(id) {
        await app_1.prisma.post.delete({
            where: { id }
        });
        return true;
    }
}
exports.PostRepository = PostRepository;
