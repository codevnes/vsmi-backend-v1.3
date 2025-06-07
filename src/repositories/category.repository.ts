import { prisma } from '../app';
import { IBaseRepository } from './base.repository';
import { ICategory, ICategoryCreate, ICategoryPublic, ICategoryUpdate } from '../models';
import { IPaginationOptions, IPaginationResult } from '../models/pagination.model';
import { Category } from '@prisma/client';

export interface ICategoryWithChildren extends Category {
  children?: Category[];
}

export interface ICategoryRepository extends IBaseRepository<Category, string> {
  findBySlug(slug: string): Promise<Category | null>;
  findAllWithPagination(options: IPaginationOptions & { parentId?: string | null }): Promise<IPaginationResult<Category>>;
  findAllWithChildren(): Promise<ICategoryWithChildren[]>;
  getCategoryHierarchy(id: string): Promise<ICategoryPublic | null>;
}

export class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id }
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { slug }
    });
  }

  async findAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      where: { deletedAt: null }
    });
  }

  async findAllWithPagination(options: IPaginationOptions & { parentId?: string | null }): Promise<IPaginationResult<Category>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search = '',
      parentId
    } = options;
    
    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;
    
    // Xây dựng điều kiện where
    const where: any = {
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
    const totalItems = await prisma.category.count({ where });
    
    // Lấy dữ liệu với phân trang
    const categories = await prisma.category.findMany({
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

  async findAllWithChildren(): Promise<ICategoryWithChildren[]> {
    // Lấy các danh mục gốc (không có parentId)
    const rootCategories = await prisma.category.findMany({
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

  async getCategoryHierarchy(id: string): Promise<ICategoryPublic | null> {
    // Lấy danh mục theo id
    const category = await prisma.category.findUnique({
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
    const result: ICategoryPublic = {
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

  async create(data: ICategoryCreate): Promise<Category> {
    return await prisma.category.create({
      data
    });
  }

  async update(id: string, data: ICategoryUpdate): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    return true;
  }
} 