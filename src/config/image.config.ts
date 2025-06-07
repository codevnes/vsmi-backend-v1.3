import path from 'path';

export const imageConfig = {
  uploadDir: path.join(process.cwd(), 'public/uploads'),
  imageDir: path.join(process.cwd(), 'public/images'),
  processedImageDir: path.join(process.cwd(), 'public/images'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  baseUrl: process.env.IMAGE_BASE_URL || 'http://localhost:3000/images'
}; 