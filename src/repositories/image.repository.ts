import { prisma } from '../app';
import { IBaseRepository } from './base.repository';
import { Image } from '@prisma/client';
import { IImageCreate, IImageUpdate } from '../models';
import { IPaginationOptions, IPaginationResult } from '../models/pagination.model';

export interface IImageRepository extends IBaseRepository<Image, number> {
  findByUrl(url: string): Promise<Image | null>;
  findAllWithPagination(options: IPaginationOptions): Promise<IPaginationResult<Image>>;
  isImageInUse(id: number): Promise<boolean>;
}

export class ImageRepository implements IImageRepository {
  async findById(id: number): Promise<Image | null> {
    return await prisma.image.findUnique({
      where: { id }
    });
  }

  async findByUrl(url: string): Promise<Image | null> {
    return await prisma.image.findUnique({
      where: { url }
    });
  }

  async findAll(): Promise<Image[]> {
    return await prisma.image.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findAllWithPagination(options: IPaginationOptions): Promise<IPaginationResult<Image>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search = ''
    } = options;
    
    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;
    
    // Xây dựng điều kiện where
    const where: any = {};
    
    // Thêm điều kiện tìm kiếm
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Đếm tổng số bản ghi
    const totalItems = await prisma.image.count({ where });
    
    // Lấy dữ liệu với phân trang
    const images = await prisma.image.findMany({
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

  async create(data: IImageCreate): Promise<Image> {
    return await prisma.image.create({
      data
    });
  }

  async update(id: number, data: IImageUpdate): Promise<Image> {
    return await prisma.image.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.image.delete({
      where: { id }
    });
    return true;
  }

  async isImageInUse(id: number): Promise<boolean> {
    // Kiểm tra hình ảnh có được sử dụng trong bảng users
    const userCount = await prisma.user.count({
      where: { thumbnailId: id }
    });
    if (userCount > 0) return true;

    // Kiểm tra hình ảnh có được sử dụng trong bảng categories
    const categoryCount = await prisma.category.count({
      where: { thumbnailId: id }
    });
    if (categoryCount > 0) return true;

    // Kiểm tra hình ảnh có được sử dụng trong bảng posts
    const postCount = await prisma.post.count({
      where: { thumbnailId: id }
    });
    if (postCount > 0) return true;

    // Không được sử dụng trong bảng nào
    return false;
  }
} 