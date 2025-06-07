import { Role } from '@prisma/client';
import { prisma } from '../app';
import { IBaseRepository } from './base.repository';
import { IUser, IUserCreate, IUserPublic, IUserUpdate } from '../models/user.model';
import { IPaginationOptions, IPaginationResult } from '../models/pagination.model';

export interface IUserRepository extends IBaseRepository<IUser, string> {
  findByEmail(email: string): Promise<IUser | null>;
  getUserProfile(id: string): Promise<IUserPublic | null>;
  findAllWithPagination(options: IPaginationOptions & { role?: Role; verified?: boolean }): Promise<IPaginationResult<IUser>>;
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async findAll(): Promise<IUser[]> {
    return await prisma.user.findMany({
      where: { deletedAt: null }
    });
  }

  async findAllWithPagination(options: IPaginationOptions & { role?: Role; verified?: boolean }): Promise<IPaginationResult<IUser>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search = '',
      role,
      verified
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
    const totalItems = await prisma.user.count({ where });
    
    // Lấy dữ liệu với phân trang
    const users = await prisma.user.findMany({
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

  async create(data: IUserCreate): Promise<IUser> {
    return await prisma.user.create({
      data: {
        ...data,
        role: (data.role as Role) || Role.USER
      }
    });
  }

  async update(id: string, data: IUserUpdate): Promise<IUser> {
    return await prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    return true;
  }

  async getUserProfile(id: string): Promise<IUserPublic | null> {
    const user = await prisma.user.findUnique({
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