import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { userRepository } from '../repositories';
import { IPaginationOptions, IPaginationResult, IUserCreate, IUserPublic, IUserUpdate } from '../models';

export class UserService {
  /**
   * Lấy danh sách người dùng không phân trang (đã cũ)
   */
  async getAllUsers(): Promise<IUserPublic[]> {
    const users = await userRepository.findAll();
    return users.map(user => this.toPublicUser(user));
  }

  /**
   * Lấy danh sách người dùng với phân trang
   */
  async getUsersWithPagination(options: IPaginationOptions & {
    role?: Role;
    verified?: boolean;
  }): Promise<IPaginationResult<IUserPublic>> {
    const result = await userRepository.findAllWithPagination(options);
    
    return {
      data: result.data.map(user => this.toPublicUser(user)),
      pagination: result.pagination
    };
  }

  /**
   * Lấy thông tin một người dùng
   */
  async getUserById(id: string): Promise<IUserPublic> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return this.toPublicUser(user);
  }

  /**
   * Tạo người dùng mới
   */
  async createUser(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: Role;
  }): Promise<IUserPublic> {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('EMAIL_IN_USE');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Tạo dữ liệu người dùng mới
    const userData: IUserCreate = {
      email: data.email,
      fullName: data.fullName,
      password: hashedPassword,
      phone: data.phone || null,
      role: data.role || Role.USER,
    };

    // Tạo người dùng mới
    const newUser = await userRepository.create(userData);
    return this.toPublicUser(newUser);
  }

  /**
   * Cập nhật thông tin người dùng
   */
  async updateUser(id: string, data: {
    fullName?: string;
    phone?: string;
    password?: string;
    role?: Role;
  }): Promise<IUserPublic> {
    // Kiểm tra người dùng tồn tại
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('USER_NOT_FOUND');
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData: IUserUpdate = {};
    if (data.fullName) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.role) updateData.role = data.role;
    
    // Mã hóa mật khẩu nếu được cung cấp
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Cập nhật người dùng
    const updatedUser = await userRepository.update(id, updateData);
    return this.toPublicUser(updatedUser);
  }

  /**
   * Xóa người dùng
   */
  async deleteUser(id: string): Promise<boolean> {
    // Kiểm tra người dùng tồn tại
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('USER_NOT_FOUND');
    }

    // Xóa người dùng
    return await userRepository.delete(id);
  }

  /**
   * Chuyển đổi thông tin người dùng để trả về cho client
   */
  private toPublicUser(user: any): IUserPublic {
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