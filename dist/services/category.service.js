"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
class CategoryService {
    /**
     * Lấy danh sách danh mục với phân trang
     */
    async getAllCategories(options) {
        const result = await repositories_1.categoryRepository.findAllWithPagination(options);
        return {
            data: result.data.map(category => this.toPublicCategory(category)),
            pagination: result.pagination
        };
    }
    /**
     * Lấy cấu trúc cây danh mục (chỉ lấy danh mục gốc và con trực tiếp)
     */
    async getCategoryTree() {
        const rootCategories = await repositories_1.categoryRepository.findAllWithChildren();
        return rootCategories.map(category => ({
            id: category.id,
            title: category.title,
            slug: category.slug,
            thumbnailId: category.thumbnailId,
            description: category.description,
            parentId: category.parentId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            children: category.children?.map(child => ({
                id: child.id,
                title: child.title,
                slug: child.slug,
                thumbnailId: child.thumbnailId,
                description: child.description,
                parentId: child.parentId,
                createdAt: child.createdAt,
                updatedAt: child.updatedAt
            }))
        }));
    }
    /**
     * Lấy thông tin một danh mục kèm danh mục con
     */
    async getCategoryById(id) {
        const category = await repositories_1.categoryRepository.getCategoryHierarchy(id);
        if (!category) {
            throw new Error('CATEGORY_NOT_FOUND');
        }
        return category;
    }
    /**
     * Lấy thông tin danh mục theo slug
     */
    async getCategoryBySlug(slug) {
        const category = await repositories_1.categoryRepository.findBySlug(slug);
        if (!category) {
            throw new Error('CATEGORY_NOT_FOUND');
        }
        return this.toPublicCategory(category);
    }
    /**
     * Tạo danh mục mới
     */
    async createCategory(data) {
        // Tạo slug từ title
        const slug = (0, utils_1.slugify)(data.title);
        // Kiểm tra slug đã tồn tại chưa
        const existingCategory = await repositories_1.categoryRepository.findBySlug(slug);
        if (existingCategory) {
            throw new Error('CATEGORY_SLUG_EXISTS');
        }
        // Kiểm tra parentId nếu có
        if (data.parentId) {
            const parentCategory = await repositories_1.categoryRepository.findById(data.parentId);
            if (!parentCategory) {
                throw new Error('PARENT_CATEGORY_NOT_FOUND');
            }
        }
        // Tạo danh mục mới
        const categoryData = {
            title: data.title,
            slug,
            description: data.description || null,
            thumbnailId: data.thumbnailId || null,
            parentId: data.parentId || null
        };
        const newCategory = await repositories_1.categoryRepository.create(categoryData);
        return this.toPublicCategory(newCategory);
    }
    /**
     * Cập nhật danh mục
     */
    async updateCategory(id, data) {
        // Kiểm tra danh mục tồn tại
        const existingCategory = await repositories_1.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error('CATEGORY_NOT_FOUND');
        }
        // Tạo slug mới nếu cập nhật title
        const updateData = {};
        if (data.title) {
            updateData.title = data.title;
            updateData.slug = (0, utils_1.slugify)(data.title);
            // Kiểm tra slug đã tồn tại chưa (trừ slug hiện tại)
            const existingSlug = await repositories_1.categoryRepository.findBySlug(updateData.slug);
            if (existingSlug && existingSlug.id !== id) {
                throw new Error('CATEGORY_SLUG_EXISTS');
            }
        }
        // Kiểm tra parentId nếu có
        if (data.parentId !== undefined) {
            // Không cho phép đặt parent là chính nó
            if (data.parentId === id) {
                throw new Error('INVALID_PARENT_CATEGORY');
            }
            if (data.parentId !== null) {
                const parentCategory = await repositories_1.categoryRepository.findById(data.parentId);
                if (!parentCategory) {
                    throw new Error('PARENT_CATEGORY_NOT_FOUND');
                }
            }
            updateData.parentId = data.parentId;
        }
        // Cập nhật các trường khác
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.thumbnailId !== undefined)
            updateData.thumbnailId = data.thumbnailId;
        // Cập nhật danh mục
        const updatedCategory = await repositories_1.categoryRepository.update(id, updateData);
        return this.toPublicCategory(updatedCategory);
    }
    /**
     * Xóa danh mục
     */
    async deleteCategory(id) {
        // Kiểm tra danh mục tồn tại
        const existingCategory = await repositories_1.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error('CATEGORY_NOT_FOUND');
        }
        // Kiểm tra xem danh mục có danh mục con không
        const childCategories = await repositories_1.categoryRepository.findAllWithPagination({
            parentId: id
        });
        if (childCategories.data.length > 0) {
            throw new Error('CATEGORY_HAS_CHILDREN');
        }
        // TODO: Kiểm tra xem danh mục có bài viết không (nếu cần)
        // Xóa danh mục (soft delete)
        return await repositories_1.categoryRepository.delete(id);
    }
    /**
     * Chuyển đổi danh mục sang định dạng public
     */
    toPublicCategory(category) {
        return {
            id: category.id,
            title: category.title,
            slug: category.slug,
            thumbnailId: category.thumbnailId,
            description: category.description,
            parentId: category.parentId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    }
}
exports.CategoryService = CategoryService;
