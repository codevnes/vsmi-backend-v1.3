import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

/**
 * Tạo tên file ngẫu nhiên để tránh trùng lặp
 * 
 * @param originalname Tên file gốc
 * @returns Tên file đã xử lý
 */
export const generateFileName = (originalname: string): string => {
  const timestamp = Date.now().toString();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalname);
  const fileName = `${timestamp}-${randomString}${ext}`;
  return fileName;
};

/**
 * Kiểm tra file có phải là hình ảnh không
 * 
 * @param mimetype MIME type của file
 * @returns boolean
 */
export const isImage = (mimetype: string): boolean => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return allowedMimeTypes.includes(mimetype);
};

/**
 * Xóa file
 * 
 * @param filePath Đường dẫn đến file cần xóa
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

/**
 * Tạo thư mục nếu chưa tồn tại
 * 
 * @param dirPath Đường dẫn thư mục
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}; 