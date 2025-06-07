import { categoryRepository } from '../repositories';
import { ICategoryCreate, ICategoryPublic, ICategoryUpdate, IPaginationOptions, IPaginationResult } from '../models';
import { slugify } from '../utils';
import { Category } from '@prisma/client';

export class CategoryService {
  /**
   * Lấy danh sách danh mục với phân trang
   */
  async getAllCategories(options: IPaginationOptions & { parentId?: string | null }): Promise<IPaginationResult<ICategoryPublic>> {
    const result = await categoryRepository.findAllWithPagination(options);
    
    return {
      data: result.data.map(category => this.toPublicCategory(category)),
      pagination: result.pagination
    };
  }

  /**
   * Lấy cấu trúc cây danh mục (chỉ lấy danh mục gốc và con trực tiếp)
   */
  async getCategoryTree(): Promise<ICategoryPublic[]> {
    const rootCategories = await categoryRepository.findAllWithChildren();
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
  async getCategoryById(id: string): Promise<ICategoryPublic> {
    const category = await categoryRepository.getCategoryHierarchy(id);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
    return category;
  }

  /**
   * Lấy thông tin danh mục theo slug
   */
  async getCategoryBySlug(slug: string): Promise<ICategoryPublic> {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
    return this.toPublicCategory(category);
  }

  /**
   * Tạo danh mục mới
   */
  async createCategory(data: {
    title: string;
    description?: string;
    thumbnailId?: number;
    parentId?: string;
  }): Promise<ICategoryPublic> {
    // Tạo slug từ title
    const slug = slugify(data.title);
    
    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await categoryRepository.findBySlug(slug);
    if (existingCategory) {
      throw new Error('CATEGORY_SLUG_EXISTS');
    }

    // Kiểm tra parentId nếu có
    if (data.parentId) {
      const parentCategory = await categoryRepository.findById(data.parentId);
      if (!parentCategory) {
        throw new Error('PARENT_CATEGORY_NOT_FOUND');
      }
    }

    // Tạo danh mục mới
    const categoryData: ICategoryCreate = {
      title: data.title,
      slug,
      description: data.description || null,
      thumbnailId: data.thumbnailId || null,
      parentId: data.parentId || null
    };

    const newCategory = await categoryRepository.create(categoryData);
    return this.toPublicCategory(newCategory);
  }

  /**
   * Cập nhật danh mục
   */
  async updateCategory(id: string, data: {
    title?: string;
    description?: string | null;
    thumbnailId?: number | null;
    parentId?: string | null;
  }): Promise<ICategoryPublic> {
    // Kiểm tra danh mục tồn tại
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    // Tạo slug mới nếu cập nhật title
    const updateData: ICategoryUpdate = {};
    
    if (data.title) {
      updateData.title = data.title;
      updateData.slug = slugify(data.title);
      
      // Kiểm tra slug đã tồn tại chưa (trừ slug hiện tại)
      const existingSlug = await categoryRepository.findBySlug(updateData.slug);
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
        const parentCategory = await categoryRepository.findById(data.parentId);
        if (!parentCategory) {
          throw new Error('PARENT_CATEGORY_NOT_FOUND');
        }
      }

      updateData.parentId = data.parentId;
    }

    // Cập nhật các trường khác
    if (data.description !== undefined) updateData.description = data.description;
    if (data.thumbnailId !== undefined) updateData.thumbnailId = data.thumbnailId;

    // Cập nhật danh mục
    const updatedCategory = await categoryRepository.update(id, updateData);
    return this.toPublicCategory(updatedCategory);
  }

  /**
   * Xóa danh mục
   */
  async deleteCategory(id: string): Promise<boolean> {
    // Kiểm tra danh mục tồn tại
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    // Kiểm tra xem danh mục có danh mục con không
    const childCategories = await categoryRepository.findAllWithPagination({
      parentId: id
    });

    if (childCategories.data.length > 0) {
      throw new Error('CATEGORY_HAS_CHILDREN');
    }

    // TODO: Kiểm tra xem danh mục có bài viết không (nếu cần)

    // Xóa danh mục (soft delete)
    return await categoryRepository.delete(id);
  }

  /**
   * Chuyển đổi danh mục sang định dạng public
   */
  private toPublicCategory(category: Category): ICategoryPublic {
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