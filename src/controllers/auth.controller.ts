import { Request, Response } from 'express';
import { LoginRequest, RegisterRequest } from '../types';
import { AUTH_MESSAGES } from '../utils';
import { authService } from '../services';

export const register = async (req: Request, res: Response) => {
  try {
    // Kiểm tra req.body tồn tại
    if (!req.body) {
      res.status(400).json({ 
        message: AUTH_MESSAGES.REQUIRED_FIELDS 
      });
      return;
    }
    
    const { email, password, fullName, phone }: RegisterRequest = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      res.status(400).json({ 
        message: AUTH_MESSAGES.REQUIRED_FIELDS
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: AUTH_MESSAGES.INVALID_EMAIL
      });
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      res.status(400).json({
        message: AUTH_MESSAGES.WEAK_PASSWORD
      });
      return;
    }

    // Gọi service để đăng ký
    const result = await authService.register({ email, password, fullName, phone });

    // Trả về kết quả
    res.status(201).json({
      message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
      ...result
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Xử lý từng loại lỗi cụ thể
    if (error instanceof Error && error.message === 'EMAIL_IN_USE') {
      res.status(400).json({ 
        message: AUTH_MESSAGES.EMAIL_IN_USE 
      });
      return;
    }
    
    res.status(500).json({ 
      message: AUTH_MESSAGES.REGISTRATION_FAILED 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Kiểm tra req.body tồn tại
    if (!req.body) {
      res.status(400).json({ 
        message: AUTH_MESSAGES.LOGIN_REQUIRED_FIELDS 
      });
      return;
    }
    
    const { email, password }: LoginRequest = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ 
        message: AUTH_MESSAGES.LOGIN_REQUIRED_FIELDS 
      });
      return;
    }

    // Gọi service để đăng nhập
    try {
      const result = await authService.login({ email, password });
      
      res.status(200).json({
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        ...result
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        if (serviceError.message === 'ACCOUNT_NOT_FOUND') {
          res.status(404).json({ 
            message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND
          });
          return;
        }
        if (serviceError.message === 'INVALID_PASSWORD') {
          res.status(401).json({ 
            message: AUTH_MESSAGES.INVALID_PASSWORD
          });
          return;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: AUTH_MESSAGES.LOGIN_FAILED
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Kiểm tra req.body tồn tại
    if (!req.body) {
      res.status(400).json({ 
        message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED
      });
      return;
    }
    
    const { refreshToken: token } = req.body;
    
    if (!token) {
      res.status(400).json({ 
        message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED
      });
      return;
    }

    try {
      const result = await authService.refreshToken(token);
      
      res.status(200).json({
        message: AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS,
        ...result
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        if (serviceError.message === 'USER_NOT_FOUND') {
          res.status(404).json({ 
            message: AUTH_MESSAGES.USER_NOT_FOUND 
          });
          return;
        }
        if (serviceError.message === 'REFRESH_TOKEN_INVALID') {
          res.status(401).json({ 
            message: AUTH_MESSAGES.REFRESH_TOKEN_INVALID
          });
          return;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      message: AUTH_MESSAGES.SYSTEM_ERROR
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ 
        message: AUTH_MESSAGES.UNAUTHORIZED
      });
      return;
    }

    try {
      const result = await authService.getProfile(req.userId);
      
      res.status(200).json({ 
        message: AUTH_MESSAGES.PROFILE_SUCCESS,
        ...result
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
        res.status(404).json({ 
          message: AUTH_MESSAGES.USER_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: AUTH_MESSAGES.PROFILE_ERROR
    });
  }
}; 