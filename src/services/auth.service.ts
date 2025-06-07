import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config';
import { LoginRequest, RegisterRequest } from '../types';
import { userRepository } from '../repositories';
import { IUserCreate } from '../models';
import { Role } from '@prisma/client';

export class AuthService {
  /**
   * Đăng ký người dùng mới
   */
  async register(data: RegisterRequest) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('EMAIL_IN_USE');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new user
    const userData: IUserCreate = {
      email: data.email,
      fullName: data.fullName,
      password: hashedPassword,
      phone: data.phone || null,
      role: Role.USER,
    };

    const newUser = await userRepository.create(userData);

    // Generate token
    const token = this.generateToken(newUser.id, newUser.role);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
      token,
    };
  }

  /**
   * Đăng nhập người dùng
   */
  async login(data: LoginRequest) {
    // Find user
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('ACCOUNT_NOT_FOUND');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('INVALID_PASSWORD');
    }

    // Generate token
    const token = this.generateToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  /**
   * Làm mới token
   */
  async refreshToken(token: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(token, authConfig.jwtSecret) as { id: string };
      
      // Find user
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Generate new access token
      const newToken = this.generateToken(user.id, user.role);

      return { token: newToken };
    } catch (error) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }
  }

  /**
   * Lấy thông tin người dùng
   */
  async getProfile(userId: string) {
    const user = await userRepository.getUserProfile(userId);

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return { user };
  }

  /**
   * Tạo JWT token
   */
  private generateToken(userId: string, role: string) {
    return jwt.sign(
      { id: userId, role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiration }
    );
  }

  /**
   * Tạo refresh token
   */
  private generateRefreshToken(userId: string) {
    return jwt.sign(
      { id: userId },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtRefreshExpiration }
    );
  }
} 