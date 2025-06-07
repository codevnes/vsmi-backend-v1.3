import { Request, Response } from 'express';
import { userService } from '../services';
import { USER_MESSAGES } from '../utils';
import { Role } from '@prisma/client';

/**
 * Lấy danh sách người dùng với phân trang và tìm kiếm
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Trích xuất các tham số phân trang từ query
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sort = req.query.sort as string || 'createdAt';
    const order = (req.query.order as 'asc' | 'desc') || 'desc';
    const search = req.query.search as string || '';
    const role = req.query.role as Role | undefined;
    const verified = req.query.verified 
      ? req.query.verified === 'true' 
      : undefined;

    // Validate page và limit
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      res.status(400).json({
        message: USER_MESSAGES.INVALID_PAGINATION
      });
      return;
    }
    
    // Gọi service với các tham số phân trang
    const result = await userService.getUsersWithPagination({
      page,
      limit,
      sort,
      order,
      search,
      role,
      verified
    });
    
    res.status(200).json({
      message: USER_MESSAGES.GET_USERS_SUCCESS,
      users: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: USER_MESSAGES.GET_USERS_ERROR
    });
  }
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    try {
      const user = await userService.getUserById(id);
      res.status(200).json({
        message: USER_MESSAGES.GET_USER_SUCCESS,
        user
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
        res.status(404).json({
          message: USER_MESSAGES.USER_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      message: USER_MESSAGES.GET_USERS_ERROR
    });
  }
};

/**
 * Tạo người dùng mới
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    // Kiểm tra req.body tồn tại
    if (!req.body) {
      res.status(400).json({
        message: USER_MESSAGES.REQUIRED_FIELDS
      });
      return;
    }
    
    const { email, password, fullName, phone, role } = req.body;
    
    // Validate các trường bắt buộc
    if (!email || !password || !fullName) {
      res.status(400).json({
        message: USER_MESSAGES.REQUIRED_FIELDS
      });
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: USER_MESSAGES.INVALID_USER_DATA
      });
      return;
    }
    
    // Validate mật khẩu
    if (password.length < 6) {
      res.status(400).json({
        message: USER_MESSAGES.INVALID_USER_DATA
      });
      return;
    }
    
    try {
      const user = await userService.createUser({
        email,
        password,
        fullName,
        phone,
        role: role as Role
      });
      
      res.status(201).json({
        message: USER_MESSAGES.CREATE_USER_SUCCESS,
        user
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'EMAIL_IN_USE') {
        res.status(400).json({
          message: USER_MESSAGES.EMAIL_IN_USE
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      message: USER_MESSAGES.CREATE_USER_ERROR
    });
  }
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    // Kiểm tra req.body tồn tại
    if (!req.body) {
      res.status(400).json({
        message: USER_MESSAGES.INVALID_USER_DATA
      });
      return;
    }
    
    const { fullName, phone, password, role } = req.body;
    
    // Phải có ít nhất một trường để cập nhật
    if (!fullName && phone === undefined && !password && !role) {
      res.status(400).json({
        message: USER_MESSAGES.INVALID_USER_DATA
      });
      return;
    }
    
    try {
      const user = await userService.updateUser(id, {
        fullName,
        phone,
        password,
        role: role as Role
      });
      
      res.status(200).json({
        message: USER_MESSAGES.UPDATE_USER_SUCCESS,
        user
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
        res.status(404).json({
          message: USER_MESSAGES.USER_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: USER_MESSAGES.UPDATE_USER_ERROR
    });
  }
};

/**
 * Xóa người dùng
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    // Kiểm tra không cho phép xóa chính mình
    if (req.userId === id) {
      res.status(400).json({
        message: USER_MESSAGES.CANNOT_DELETE_SELF
      });
      return;
    }
    
    try {
      await userService.deleteUser(id);
      res.status(200).json({
        message: USER_MESSAGES.DELETE_USER_SUCCESS
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
        res.status(404).json({
          message: USER_MESSAGES.USER_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: USER_MESSAGES.DELETE_USER_ERROR
    });
  }
}; 