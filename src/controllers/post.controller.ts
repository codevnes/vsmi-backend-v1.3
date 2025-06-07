import { Request, Response } from 'express';
import { postService } from '../services';
import { POST_MESSAGES } from '../utils';
import { AuthRequest } from '../types';

/**
 * Lấy danh sách bài viết với phân trang
 */
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Trích xuất các tham số từ query
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sort = req.query.sort as string || 'createdAt';
    const order = (req.query.order as 'asc' | 'desc') || 'desc';
    const search = req.query.search as string || '';
    const categoryId = req.query.categoryId as string;
    const symbol = req.query.symbol as string;
    const userId = req.query.userId as string;
    const isPremium = req.query.isPremium ? req.query.isPremium === 'true' : undefined;
    
    // Validate page và limit
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      res.status(400).json({
        message: POST_MESSAGES.INVALID_POST_DATA
      });
      return;
    }
    
    // Gọi service với các tham số
    const result = await postService.getAllPosts({
      page,
      limit,
      sort,
      order,
      search,
      categoryId,
      symbol,
      userId,
      isPremium
    });
    
    res.status(200).json({
      message: POST_MESSAGES.GET_POSTS_SUCCESS,
      posts: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      message: POST_MESSAGES.GET_POSTS_ERROR
    });
  }
};

/**
 * Lấy thông tin bài viết theo ID
 */
export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({
        message: POST_MESSAGES.INVALID_POST_DATA
      });
      return;
    }
    
    try {
      const post = await postService.getPostById(id);
      res.status(200).json({
        message: POST_MESSAGES.GET_POST_SUCCESS,
        post
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'POST_NOT_FOUND') {
        res.status(404).json({
          message: POST_MESSAGES.POST_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      message: POST_MESSAGES.GET_POSTS_ERROR
    });
  }
};

/**
 * Lấy thông tin bài viết theo slug
 */
export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    
    if (!slug) {
      res.status(400).json({
        message: POST_MESSAGES.INVALID_POST_DATA
      });
      return;
    }
    
    try {
      const post = await postService.getPostBySlug(slug);
      res.status(200).json({
        message: POST_MESSAGES.GET_POST_SUCCESS,
        post
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'POST_NOT_FOUND') {
        res.status(404).json({
          message: POST_MESSAGES.POST_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({
      message: POST_MESSAGES.GET_POSTS_ERROR
    });
  }
};

/**
 * Tạo bài viết mới
 */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, content, thumbnailId, categoryId, symbol, isPremium } = req.body;
    const userId = req.user?.id;
    
    if (!title || !categoryId || !userId) {
      res.status(400).json({
        message: POST_MESSAGES.REQUIRED_FIELDS
      });
      return;
    }
    
    try {
      const post = await postService.createPost({
        title,
        description,
        content,
        thumbnailId: thumbnailId ? parseInt(thumbnailId) : undefined,
        categoryId,
        symbol,
        userId,
        isPremium
      });
      
      res.status(201).json({
        message: POST_MESSAGES.CREATE_POST_SUCCESS,
        post
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'CATEGORY_NOT_FOUND':
            res.status(400).json({
              message: POST_MESSAGES.CATEGORY_NOT_FOUND
            });
            return;
          case 'STOCK_NOT_FOUND':
            res.status(400).json({
              message: POST_MESSAGES.STOCK_NOT_FOUND
            });
            return;
          case 'IMAGE_NOT_FOUND':
            res.status(400).json({
              message: POST_MESSAGES.IMAGE_NOT_FOUND
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      message: POST_MESSAGES.CREATE_POST_ERROR
    });
  }
};

/**
 * Cập nhật bài viết
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id!;
    const { title, description, content, thumbnailId, categoryId, symbol, isPremium } = req.body;
    
    if (!id) {
      res.status(400).json({
        message: POST_MESSAGES.INVALID_POST_DATA
      });
      return;
    }
    
    try {
      const post = await postService.updatePost(id, userId, {
        title,
        description,
        content,
        thumbnailId: thumbnailId ? parseInt(thumbnailId) : undefined,
        categoryId,
        symbol,
        isPremium
      });
      
      res.status(200).json({
        message: POST_MESSAGES.UPDATE_POST_SUCCESS,
        post
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'POST_NOT_FOUND':
            res.status(404).json({
              message: POST_MESSAGES.POST_NOT_FOUND
            });
            return;
          case 'UNAUTHORIZED':
            res.status(403).json({
              message: POST_MESSAGES.UNAUTHORIZED
            });
            return;
          case 'CATEGORY_NOT_FOUND':
            res.status(400).json({
              message: POST_MESSAGES.CATEGORY_NOT_FOUND
            });
            return;
          case 'STOCK_NOT_FOUND':
            res.status(400).json({
              message: POST_MESSAGES.STOCK_NOT_FOUND
            });
            return;
          case 'IMAGE_NOT_FOUND':
            res.status(400).json({
              message: POST_MESSAGES.IMAGE_NOT_FOUND
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      message: POST_MESSAGES.UPDATE_POST_ERROR
    });
  }
};

/**
 * Xóa mềm bài viết
 */
export const softDeletePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id!;
    
    if (!id) {
      res.status(400).json({
        message: POST_MESSAGES.INVALID_POST_DATA
      });
      return;
    }
    
    try {
      await postService.softDeletePost(id, userId);
      
      res.status(200).json({
        message: POST_MESSAGES.DELETE_POST_SUCCESS
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'POST_NOT_FOUND':
            res.status(404).json({
              message: POST_MESSAGES.POST_NOT_FOUND
            });
            return;
          case 'UNAUTHORIZED':
            res.status(403).json({
              message: POST_MESSAGES.UNAUTHORIZED
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      message: POST_MESSAGES.DELETE_POST_ERROR
    });
  }
};

/**
 * Khôi phục bài viết đã xóa
 */
export const restorePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id!;
    
    if (!id) {
      res.status(400).json({
        message: POST_MESSAGES.INVALID_POST_DATA
      });
      return;
    }
    
    try {
      const post = await postService.restorePost(id, userId);
      
      res.status(200).json({
        message: POST_MESSAGES.UPDATE_POST_SUCCESS,
        post
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'POST_NOT_FOUND':
            res.status(404).json({
              message: POST_MESSAGES.POST_NOT_FOUND
            });
            return;
          case 'UNAUTHORIZED':
            res.status(403).json({
              message: POST_MESSAGES.UNAUTHORIZED
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Restore post error:', error);
    res.status(500).json({
      message: POST_MESSAGES.UPDATE_POST_ERROR
    });
  }
};

/**
 * Xóa vĩnh viễn bài viết (chỉ admin)
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id!;
    
    if (!id) {
      res.status(400).json({
        message: POST_MESSAGES.INVALID_POST_DATA
      });
      return;
    }
    
    try {
      await postService.deletePost(id, userId);
      
      res.status(200).json({
        message: POST_MESSAGES.DELETE_POST_SUCCESS
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'POST_NOT_FOUND':
            res.status(404).json({
              message: POST_MESSAGES.POST_NOT_FOUND
            });
            return;
          case 'UNAUTHORIZED':
            res.status(403).json({
              message: POST_MESSAGES.UNAUTHORIZED
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Delete post permanently error:', error);
    res.status(500).json({
      message: POST_MESSAGES.DELETE_POST_ERROR
    });
  }
}; 