import { imageRepository } from '../repositories';
import { IImageCreate, IImageUpdate, IImagePublic, IPaginationOptions, IPaginationResult } from '../models';
import { imageConfig } from '../config';
import { deleteFile } from '../utils';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Image } from '@prisma/client';

export class ImageService {
  /**
   * Lấy danh sách hình ảnh với phân trang
   */
  async getAllImages(options: IPaginationOptions): Promise<IPaginationResult<IImagePublic>> {
    const result = await imageRepository.findAllWithPagination(options);
    
    return {
      data: result.data.map(image => this.toPublicImage(image)),
      pagination: result.pagination
    };
  }

  /**
   * Lấy thông tin hình ảnh theo ID
   */
  async getImageById(id: number): Promise<IImagePublic> {
    const image = await imageRepository.findById(id);
    if (!image) {
      throw new Error('IMAGE_NOT_FOUND');
    }
    return this.toPublicImage(image);
  }

  /**
   * Tạo hình ảnh mới từ file được upload
   */
  async uploadImage(file: Express.Multer.File, altText?: string): Promise<IImagePublic> {
    try {
      // Xử lý hình ảnh với sharp
      const processedFileName = `processed-${file.filename}`;
      const processedFilePath = path.join(imageConfig.processedImageDir, processedFileName);
      
      // Xử lý hình ảnh với sharp (resize, tối ưu)
      const metadata = await sharp(file.path)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .toFormat('jpeg', { quality: 80, progressive: true })
        .toFile(processedFilePath);

      // Lưu thông tin hình ảnh vào database
      const imageData: IImageCreate = {
        filename: file.filename,
        processedFilename: processedFileName,
        path: file.path,
        url: `/processed/${processedFileName}`,
        mimetype: file.mimetype,
        size: file.size,
        width: metadata.width,
        height: metadata.height,
        altText: altText || null
      };

      const newImage = await imageRepository.create(imageData);
      return this.toPublicImage(newImage);
    } catch (error) {
      // Xóa file đã upload nếu có lỗi
      if (file && file.path) {
        await deleteFile(file.path);
      }
      throw error;
    }
  }

  /**
   * Cập nhật thông tin hình ảnh (chỉ cho phép cập nhật altText)
   */
  async updateImage(id: number, data: IImageUpdate): Promise<IImagePublic> {
    const image = await imageRepository.findById(id);
    if (!image) {
      throw new Error('IMAGE_NOT_FOUND');
    }

    const updatedImage = await imageRepository.update(id, data);
    return this.toPublicImage(updatedImage);
  }

  /**
   * Xóa hình ảnh
   */
  async deleteImage(id: number): Promise<boolean> {
    const image = await imageRepository.findById(id);
    if (!image) {
      throw new Error('IMAGE_NOT_FOUND');
    }

    // Kiểm tra xem hình ảnh có đang được sử dụng không
    const isInUse = await imageRepository.isImageInUse(id);
    if (isInUse) {
      throw new Error('IMAGE_IN_USE');
    }

    // Xóa file vật lý
    if (image.path) {
      await deleteFile(image.path);
    }
    
    // Xóa file xử lý
    const processedFilePath = path.join(imageConfig.processedImageDir, image.processedFilename);
    await deleteFile(processedFilePath);

    // Xóa record trong database
    return await imageRepository.delete(id);
  }

  /**
   * Chuyển đổi hình ảnh sang định dạng public
   */
  private toPublicImage(image: Image): IImagePublic {
    return {
      id: image.id,
      url: image.url,
      altText: image.altText,
      width: image.width,
      height: image.height,
      createdAt: image.createdAt
    };
  }
} 