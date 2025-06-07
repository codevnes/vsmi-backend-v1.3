import { Request, Response } from 'express';
import { imageService } from '../services';
import { IMAGE_MESSAGES } from '../utils';

/**
 * Lấy danh sách hình ảnh với phân trang
 */
export const getAllImages = async (req: Request, res: Response) => {
  try {
    // Trích xuất các tham số phân trang từ query
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sort = req.query.sort as string || 'createdAt';
    const order = (req.query.order as 'asc' | 'desc') || 'desc';
    const search = req.query.search as string || '';
    
    // Validate page và limit
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      res.status(400).json({
        message: IMAGE_MESSAGES.INVALID_IMAGE_DATA
      });
      return;
    }
    
    // Gọi service với các tham số phân trang
    const result = await imageService.getAllImages({
      page,
      limit,
      sort,
      order,
      search
    });
    
    res.status(200).json({
      message: IMAGE_MESSAGES.GET_IMAGES_SUCCESS,
      images: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all images error:', error);
    res.status(500).json({
      message: IMAGE_MESSAGES.GET_IMAGES_ERROR
    });
  }
};

/**
 * Lấy thông tin hình ảnh theo ID
 */
export const getImageById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        message: IMAGE_MESSAGES.INVALID_IMAGE_DATA
      });
      return;
    }
    
    try {
      const image = await imageService.getImageById(id);
      res.status(200).json({
        message: IMAGE_MESSAGES.GET_IMAGE_SUCCESS,
        image
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'IMAGE_NOT_FOUND') {
        res.status(404).json({
          message: IMAGE_MESSAGES.IMAGE_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Get image by ID error:', error);
    res.status(500).json({
      message: IMAGE_MESSAGES.GET_IMAGES_ERROR
    });
  }
};

/**
 * Upload hình ảnh mới
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    // middleware đã kiểm tra file trong request
    const file = req.file!;
    const { altText } = req.body;
    
    try {
      const image = await imageService.uploadImage(file, altText);
      res.status(201).json({
        message: IMAGE_MESSAGES.UPLOAD_IMAGE_SUCCESS,
        image
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({
        message: IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
      });
    }
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      message: IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
    });
  }
};

/**
 * Cập nhật thông tin hình ảnh (chỉ cho phép cập nhật altText)
 */
export const updateImage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        message: IMAGE_MESSAGES.INVALID_IMAGE_DATA
      });
      return;
    }
    
    const { altText } = req.body;
    
    try {
      const image = await imageService.updateImage(id, { altText });
      res.status(200).json({
        message: IMAGE_MESSAGES.UPDATE_IMAGE_SUCCESS,
        image
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'IMAGE_NOT_FOUND') {
        res.status(404).json({
          message: IMAGE_MESSAGES.IMAGE_NOT_FOUND
        });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({
      message: IMAGE_MESSAGES.UPDATE_IMAGE_ERROR
    });
  }
};

/**
 * Xóa hình ảnh
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        message: IMAGE_MESSAGES.INVALID_IMAGE_DATA
      });
      return;
    }
    
    try {
      await imageService.deleteImage(id);
      res.status(200).json({
        message: IMAGE_MESSAGES.DELETE_IMAGE_SUCCESS
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        switch (serviceError.message) {
          case 'IMAGE_NOT_FOUND':
            res.status(404).json({
              message: IMAGE_MESSAGES.IMAGE_NOT_FOUND
            });
            return;
          case 'IMAGE_IN_USE':
            res.status(400).json({
              message: IMAGE_MESSAGES.IMAGE_IN_USE
            });
            return;
          default:
            throw serviceError;
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      message: IMAGE_MESSAGES.DELETE_IMAGE_ERROR
    });
  }
}; 