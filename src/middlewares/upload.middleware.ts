import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { imageConfig } from '../config';
import { generateFileName, ensureDirectoryExists, isImage } from '../utils';
import { IMAGE_MESSAGES } from '../utils';

// Đảm bảo thư mục upload tồn tại
ensureDirectoryExists(imageConfig.uploadDir);
ensureDirectoryExists(imageConfig.imageDir);
ensureDirectoryExists(imageConfig.processedImageDir);

// Cấu hình multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageConfig.uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  }
});

// Cấu hình multer file filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!isImage(file.mimetype)) {
    return cb(new Error(IMAGE_MESSAGES.INVALID_FILE_TYPE));
  }
  cb(null, true);
};

// Khởi tạo multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: imageConfig.maxFileSize
  }
});

// Middleware xử lý lỗi từ multer
export const handleUploadErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: IMAGE_MESSAGES.FILE_TOO_LARGE
      });
    }
    return res.status(400).json({
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message || IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
    });
  }
  next();
};

// Middleware kiểm tra file trong request
export const validateFile = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({
      message: IMAGE_MESSAGES.FILE_REQUIRED
    });
    return;
  }
  next();
}; 