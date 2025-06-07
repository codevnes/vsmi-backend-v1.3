import { Request, Response } from 'express';
import { categoryService } from '../services';
import { CATEGORY_MESSAGES } from '../utils';

/**
 * Lấy danh sách danh mục với phân trang và tìm kiếm
 */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    // Trích xuất các tham số phân trang từ query
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sort = req.query.sort as string || 'createdAt';
    const order = (req.query.order as 'asc' | 'desc') || 'desc';
    const search = req.query.search as string || '';
    const parentId = req.query.parentId === 'null' 
      ? null 
      : req.query.parentId as string | undefined;

    // Validate page và limit
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      res.status(400).json({
        message: CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
      });
      return;
    }
    
    // Gọi service với các tham số phân trang
    const result = await categoryService.getAllCategories({
      page,
      limit,
      sort,
      order,
      search,
      parentId
    });
    
    res.status(200).json({
      message: CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
      categories: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      message: CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
    });
  }
};

/**
 * Lấy cấu trúc cây danh mục
 */
export const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategoryTree();
    res.status(200).json({
      message: CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
      categories
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      message: CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
    });
  }
};

/**
 * Lấy thông tin danh mục theo ID kèm danh mục con
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    try {
      const category = await categoryService.getCategoryById(id);
      res.status(200).json({
        message: CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
        category
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      message: CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
    });
  }
};

/**
 * Lấy thông tin danh mục theo slug
 */
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    
    try {
      const category = await categoryService.getCategoryBySlug(slug);
      res.status(200).json({
        message: CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
        category
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      message: CATEGORY_MESSAGES.GET_CATEGORIES_ERROR
    });
  }
};

/**
 * Tạo danh mục mới
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Kiểm tra req.body tồn tại
    if (!req.body) {
      res.status(400).json({
        message: CATEGORY_MESSAGES.REQUIRED_FIELDS
      });
      return;
    }
    
    const { title, description, thumbnailId, parentId } = req.body;
    
    // Validate các trường bắt buộc
    if (!title) {
      res.status(400).json({
        message: CATEGORY_MESSAGES.REQUIRED_FIELDS
      });
      return;
    }
    
    try {
      const category = await categoryService.createCategory({
        title,
        description,
        thumbnailId,
        parentId
      });
      
      res.status(201).json({
        message: CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESS,
        category
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'CATEGORY_SLUG_EXISTS':
            res.status(400).json({
              message: CATEGORY_MESSAGES.CATEGORY_SLUG_EXISTS
            });
            return;
          case 'PARENT_CATEGORY_NOT_FOUND':
            res.status(404).json({
              message: CATEGORY_MESSAGES.PARENT_CATEGORY_NOT_FOUND
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      message: CATEGORY_MESSAGES.CREATE_CATEGORY_ERROR
    });
  }
};

/**
 * Cập nhật danh mục
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    // Kiểm tra req.body tồn tại
    if (!req.body) {
      res.status(400).json({
        message: CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
      });
      return;
    }
    
    const { title, description, thumbnailId, parentId } = req.body;
    
    // Phải có ít nhất một trường để cập nhật
    if (!title && description === undefined && thumbnailId === undefined && parentId === undefined) {
      res.status(400).json({
        message: CATEGORY_MESSAGES.INVALID_CATEGORY_DATA
      });
      return;
    }
    
    try {
      const category = await categoryService.updateCategory(id, {
        title,
        description,
        thumbnailId,
        parentId
      });
      
      res.status(200).json({
        message: CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESS,
        category
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'CATEGORY_NOT_FOUND':
            res.status(404).json({
              message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
            });
            return;
          case 'CATEGORY_SLUG_EXISTS':
            res.status(400).json({
              message: CATEGORY_MESSAGES.CATEGORY_SLUG_EXISTS
            });
            return;
          case 'PARENT_CATEGORY_NOT_FOUND':
            res.status(404).json({
              message: CATEGORY_MESSAGES.PARENT_CATEGORY_NOT_FOUND
            });
            return;
          case 'INVALID_PARENT_CATEGORY':
            res.status(400).json({
              message: CATEGORY_MESSAGES.INVALID_PARENT_CATEGORY
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      message: CATEGORY_MESSAGES.UPDATE_CATEGORY_ERROR
    });
  }
};

/**
 * Xóa danh mục
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    try {
      await categoryService.deleteCategory(id);
      res.status(200).json({
        message: CATEGORY_MESSAGES.DELETE_CATEGORY_SUCCESS
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'CATEGORY_NOT_FOUND':
            res.status(404).json({
              message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
            });
            return;
          case 'CATEGORY_HAS_CHILDREN':
            res.status(400).json({
              message: CATEGORY_MESSAGES.CATEGORY_HAS_CHILDREN
            });
            return;
          case 'CATEGORY_HAS_POSTS':
            res.status(400).json({
              message: CATEGORY_MESSAGES.CATEGORY_HAS_POSTS
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      message: CATEGORY_MESSAGES.DELETE_CATEGORY_ERROR
    });
  }
}; 